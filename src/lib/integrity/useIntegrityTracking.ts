"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface PasteEvent {
  /** ms since tracking started */
  at: number;
  charCount: number;
}

/**
 * Rich integrity signal payload persisted into `submissions.integrity_signals`.
 *
 * Back-compat: the legacy fields `tab_switches`, `paste_count`,
 * `fullscreen_exits`, and `time_spent_seconds` are mirrored from the new
 * counters so older readers (the company portal, `lib/integrity.ts` verdict
 * computation, etc.) keep working without a coordinated migration.
 */
export interface IntegritySignals {
  // New, richer signals (PRD §12)
  tab_visibility_changes: number;
  fullscreen_exits: number;
  paste_events: PasteEvent[];
  long_idle_periods_ms: number[];
  active_seconds: number;
  total_elapsed_seconds: number;
  started_at: string;
  ended_at?: string;
  user_agent: string;
  screen: { width: number; height: number };
  honor_code_accepted_at?: string;

  // Legacy mirror — keep in sync so existing readers don't break.
  tab_switches: number;
  paste_count: number;
  time_spent_seconds: number;
}

export interface UseIntegrityTrackingResult {
  signals: IntegritySignals;
  attachPasteListener: (el: HTMLElement | null) => void;
  finalize: () => IntegritySignals;
}

interface Options {
  trackPaste?: boolean;
}

const IDLE_THRESHOLD_MS = 120_000; // >2 min with no input = idle window
const ACTIVE_INPUT_WINDOW_MS = 30_000; // input within 30s counts as active

function emptySignals(): IntegritySignals {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const width = typeof window !== "undefined" ? window.screen?.width ?? 0 : 0;
  const height = typeof window !== "undefined" ? window.screen?.height ?? 0 : 0;
  return {
    tab_visibility_changes: 0,
    fullscreen_exits: 0,
    paste_events: [],
    long_idle_periods_ms: [],
    active_seconds: 0,
    total_elapsed_seconds: 0,
    started_at: new Date().toISOString(),
    user_agent: ua,
    screen: { width, height },
    tab_switches: 0,
    paste_count: 0,
    time_spent_seconds: 0,
  };
}

/**
 * useIntegrityTracking — proctor-style telemetry for the challenge runner.
 *
 * - tab_visibility_changes: increments on every `visibilitychange` event.
 * - fullscreen_exits: increments when fullscreen is exited.
 * - paste_events: pushes `{at, charCount}` for every paste on attached elements
 *   (only when `opts.trackPaste` is set; you wire textareas via
 *   `attachPasteListener`).
 * - long_idle_periods_ms: records gaps >2min between user input events while
 *   the tab is visible.
 * - active_seconds: ticks once per second when the tab is visible AND input
 *   was observed in the last 30s.
 * - total_elapsed_seconds: ticks once per second unconditionally from mount.
 *
 * Honest UX, not gotcha — pair with a visible "Integrity tracked" chip.
 */
export function useIntegrityTracking(
  opts?: Options,
): UseIntegrityTrackingResult {
  const trackPaste = opts?.trackPaste ?? false;

  const startedAtMsRef = useRef<number>(Date.now());
  const lastInputAtRef = useRef<number>(Date.now());
  const idleStartRef = useRef<number | null>(null);

  const signalsRef = useRef<IntegritySignals>(emptySignals());
  const [, setTick] = useState(0);
  const bumpState = useCallback(() => setTick((n) => n + 1), []);

  // Re-init started_at, UA and screen once on mount (in case of SSR initial).
  useEffect(() => {
    const fresh = emptySignals();
    signalsRef.current = {
      ...fresh,
      started_at: new Date().toISOString(),
    };
    startedAtMsRef.current = Date.now();
    lastInputAtRef.current = Date.now();
    bumpState();
  }, [bumpState]);

  // visibilitychange — count both hide & show transitions.
  useEffect(() => {
    function handler() {
      const s = signalsRef.current;
      s.tab_visibility_changes += 1;
      // Mirror to legacy: only count *hides* as "tab switches" so existing
      // verdict thresholds keep their meaning.
      if (document.visibilityState === "hidden") {
        s.tab_switches += 1;
      }
      bumpState();
    }
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [bumpState]);

  // fullscreenchange — count exits.
  useEffect(() => {
    function handler() {
      if (!document.fullscreenElement) {
        signalsRef.current.fullscreen_exits += 1;
        bumpState();
      }
    }
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [bumpState]);

  // Global input observer (any keystroke, anywhere in the document).
  useEffect(() => {
    function onInput() {
      const now = Date.now();
      const idleStart = idleStartRef.current;
      if (idleStart != null) {
        const gap = now - idleStart;
        if (gap > IDLE_THRESHOLD_MS) {
          signalsRef.current.long_idle_periods_ms.push(gap);
          bumpState();
        }
        idleStartRef.current = null;
      }
      lastInputAtRef.current = now;
    }
    document.addEventListener("input", onInput, true);
    document.addEventListener("keydown", onInput, true);
    return () => {
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("keydown", onInput, true);
    };
  }, [bumpState]);

  // 1s ticker: total elapsed + active seconds + idle window detection.
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now();
      const s = signalsRef.current;
      s.total_elapsed_seconds = Math.floor(
        (now - startedAtMsRef.current) / 1000,
      );
      s.time_spent_seconds = s.total_elapsed_seconds;

      const visible =
        typeof document !== "undefined" &&
        document.visibilityState === "visible";
      const recentInput = now - lastInputAtRef.current <= ACTIVE_INPUT_WINDOW_MS;
      if (visible && recentInput) {
        s.active_seconds += 1;
      }

      // Track idle window opening (visible, but no input for >threshold).
      if (visible && !recentInput && idleStartRef.current == null) {
        idleStartRef.current = lastInputAtRef.current;
      }
      bumpState();
    }, 1000);
    return () => window.clearInterval(id);
  }, [bumpState]);

  // Paste listener wiring.
  const attachedRef = useRef<HTMLElement | null>(null);
  const pasteHandlerRef = useRef<((e: ClipboardEvent) => void) | null>(null);

  const attachPasteListener = useCallback(
    (el: HTMLElement | null) => {
      if (!trackPaste) return;
      const prev = attachedRef.current;
      const prevHandler = pasteHandlerRef.current;
      if (prev && prevHandler) {
        prev.removeEventListener("paste", prevHandler);
      }
      attachedRef.current = el;
      if (!el) {
        pasteHandlerRef.current = null;
        return;
      }
      const handler = (e: ClipboardEvent) => {
        const text = e.clipboardData?.getData("text") ?? "";
        const s = signalsRef.current;
        s.paste_events.push({
          at: Date.now() - startedAtMsRef.current,
          charCount: text.length,
        });
        s.paste_count += 1;
        bumpState();
      };
      pasteHandlerRef.current = handler;
      el.addEventListener("paste", handler);
    },
    [trackPaste, bumpState],
  );

  // Cleanup paste listener on unmount.
  useEffect(() => {
    return () => {
      const el = attachedRef.current;
      const handler = pasteHandlerRef.current;
      if (el && handler) el.removeEventListener("paste", handler);
    };
  }, []);

  const finalize = useCallback((): IntegritySignals => {
    const s = signalsRef.current;
    s.ended_at = new Date().toISOString();
    s.total_elapsed_seconds = Math.floor(
      (Date.now() - startedAtMsRef.current) / 1000,
    );
    s.time_spent_seconds = s.total_elapsed_seconds;
    return { ...s, paste_events: [...s.paste_events], long_idle_periods_ms: [...s.long_idle_periods_ms] };
  }, []);

  return {
    signals: signalsRef.current,
    attachPasteListener,
    finalize,
  };
}
