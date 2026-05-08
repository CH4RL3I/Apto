'use client';

import {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowDownUp,
  Check,
  ChevronDown,
  Clock,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { CaseStudy } from '@/lib/questionnaire/case-studies';
import { Pill } from '@/components/ui/Pill';

// ─── Types ────────────────────────────────────────────────────────────────────

type Segment = 'all' | 'for-you' | 'saved' | 'in-progress' | 'completed';
type SortKey = 'popular' | 'newest' | 'shortest' | 'difficulty';

interface Filters {
  industries: string[];
  difficulty: string; // '' | 'short' | 'medium' | 'long'
  durationMin: number;
  durationMax: number;
  savedOnly: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SEGMENTS: { key: Segment; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'for-you', label: 'For you' },
  { key: 'saved', label: 'Saved' },
  { key: 'in-progress', label: 'In progress' },
  { key: 'completed', label: 'Completed' },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'popular', label: 'Most popular' },
  { key: 'newest', label: 'Newest' },
  { key: 'shortest', label: 'Shortest first' },
  { key: 'difficulty', label: 'Difficulty' },
];

const DIFFICULTY_OPTIONS = [
  { key: 'short', label: 'Easy' },
  { key: 'medium', label: 'Medium' },
  { key: 'long', label: 'Hard' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clusterLabel(cluster: string): string {
  return cluster
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function countForCluster(cases: CaseStudy[], cluster: string): number {
  return cases.filter((c) => c.cluster === cluster).length;
}

function applyFilters(cases: CaseStudy[], filters: Filters, segment: Segment): CaseStudy[] {
  let result = cases;

  if (filters.industries.length > 0) {
    result = result.filter((c) => filters.industries.includes(c.cluster));
  }
  if (filters.difficulty) {
    result = result.filter((c) => c.duration === filters.difficulty);
  }
  result = result.filter(
    (c) =>
      c.estimatedMinutes >= filters.durationMin &&
      c.estimatedMinutes <= filters.durationMax,
  );
  if (filters.savedOnly) {
    // Saved state requires user-level data; stub returns empty for now.
    result = [];
  }
  // Non-All segments require server-side user state — stubbed for v2.
  if (segment !== 'all') {
    result = [];
  }
  return result;
}

function sortCases(cases: CaseStudy[], sort: SortKey): CaseStudy[] {
  const sorted = [...cases];
  if (sort === 'shortest') sorted.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
  if (sort === 'difficulty') {
    const order: Record<string, number> = { short: 0, medium: 1, long: 2 };
    sorted.sort((a, b) => (order[a.duration] ?? 1) - (order[b.duration] ?? 1));
  }
  return sorted;
}

function countActiveFilters(filters: Filters, globalMin: number, globalMax: number): number {
  let n = 0;
  n += filters.industries.length;
  if (filters.difficulty) n++;
  if (filters.durationMin !== globalMin || filters.durationMax !== globalMax) n++;
  if (filters.savedOnly) n++;
  return n;
}

// ─── Dual Range Slider ────────────────────────────────────────────────────────

function DualRangeSlider({
  min,
  max,
  lo,
  hi,
  step = 5,
  onChange,
}: {
  min: number;
  max: number;
  lo: number;
  hi: number;
  step?: number;
  onChange: (lo: number, hi: number) => void;
}) {
  const loPercent = ((lo - min) / (max - min)) * 100;
  const hiPercent = ((hi - min) / (max - min)) * 100;
  // When lo is near max, put hi thumb on top so it can still be dragged right.
  const loZ = loPercent > 90 ? 'z-10' : 'z-20';
  const hiZ = loPercent > 90 ? 'z-20' : 'z-10';

  return (
    <div className="relative py-3">
      {/* Visual track */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 rounded-full bg-sage-mist-2 pointer-events-none">
        <div
          className="absolute h-full rounded-full bg-sage"
          style={{ left: `${loPercent}%`, right: `${100 - hiPercent}%` }}
        />
      </div>
      {/* Lo thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={lo}
        onChange={(e) => onChange(Math.min(Number(e.target.value), hi - step), hi)}
        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 w-full cursor-pointer ${loZ}`}
        style={{
          WebkitAppearance: 'none',
          appearance: 'none',
          height: 0,
          background: 'transparent',
          outline: 'none',
        }}
      />
      {/* Hi thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={hi}
        onChange={(e) => onChange(lo, Math.max(Number(e.target.value), lo + step))}
        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 w-full cursor-pointer ${hiZ}`}
        style={{
          WebkitAppearance: 'none',
          appearance: 'none',
          height: 0,
          background: 'transparent',
          outline: 'none',
        }}
      />
    </div>
  );
}

// ─── Filter Drawer (desktop) ──────────────────────────────────────────────────

function FilterDrawer({
  open,
  cases,
  draft,
  globalMin,
  globalMax,
  onChangeDraft,
  onApply,
  onReset,
  onClose,
}: {
  open: boolean;
  cases: CaseStudy[];
  draft: Filters;
  globalMin: number;
  globalMax: number;
  onChangeDraft: (next: Filters) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const allClusters = useMemo(() => {
    const seen = new Set<string>();
    cases.forEach((c) => seen.add(c.cluster));
    return Array.from(seen).sort();
  }, [cases]);

  const INITIAL_SHOW = 6;
  const [showAll, setShowAll] = useState(false);
  const visibleClusters = showAll ? allClusters : allClusters.slice(0, INITIAL_SHOW);

  const draftCount = useMemo(() => applyFilters(cases, draft, 'all').length, [cases, draft]);

  const toggleIndustry = (cluster: string) => {
    const next = draft.industries.includes(cluster)
      ? draft.industries.filter((i) => i !== cluster)
      : [...draft.industries, cluster];
    onChangeDraft({ ...draft, industries: next });
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <>
      {/* Scrim */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-charcoal/40 backdrop-blur-[2px]"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Panel */}
      <aside
        className="fixed top-0 right-0 bottom-0 z-30 flex flex-col w-80 bg-chalk shadow-3 transition-transform duration-[320ms] ease-[cubic-bezier(0.32,0.72,0.24,1)]"
        style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
        aria-label="Filter panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-sage-mist-2 flex-shrink-0">
          <h2 className="text-lg font-bold text-charcoal">Filters</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-pale-sage flex items-center justify-center text-charcoal-2 hover:bg-sage-mist-2 transition-colors"
            aria-label="Close filters"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Industry */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="eyebrow">Industry</h3>
              {draft.industries.length > 0 && (
                <span className="text-[11px] text-charcoal-3">
                  {draft.industries.length} of {allClusters.length}
                </span>
              )}
            </div>
            <div className="space-y-0.5">
              {visibleClusters.map((cluster) => {
                const checked = draft.industries.includes(cluster);
                const count = countForCluster(cases, cluster);
                return (
                  <button
                    key={cluster}
                    onClick={() => toggleIndustry(cluster)}
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-pale-sage transition-colors text-left"
                  >
                    <span
                      className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${
                        checked ? 'bg-sage border-sage' : 'border-sage-mist bg-chalk'
                      }`}
                    >
                      {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />}
                    </span>
                    <span className="flex-1 text-[13px] text-charcoal">{clusterLabel(cluster)}</span>
                    <span className="text-[12px] text-charcoal-3">{count}</span>
                  </button>
                );
              })}
            </div>
            {allClusters.length > INITIAL_SHOW && (
              <button
                onClick={() => setShowAll((v) => !v)}
                className="text-[12px] text-sage font-medium px-2 hover:underline"
              >
                {showAll ? 'Show less' : `Show all ${allClusters.length}`}
              </button>
            )}
          </div>

          {/* Difficulty */}
          <div className="space-y-2.5">
            <h3 className="eyebrow">Difficulty</h3>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() =>
                    onChangeDraft({ ...draft, difficulty: draft.difficulty === key ? '' : key })
                  }
                  className={`flex-1 text-[12px] font-medium py-1.5 px-3 rounded-full border transition-colors ${
                    draft.difficulty === key
                      ? 'bg-sage text-white border-sage'
                      : 'bg-chalk text-charcoal border-sage-mist-2 hover:bg-pale-sage'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="eyebrow">Duration</h3>
              <span className="text-[11px] text-charcoal-3">
                {draft.durationMin}–{draft.durationMax} min
              </span>
            </div>
            <div className="bg-pale-sage rounded-xl p-4">
              <div className="flex justify-between text-[13px] font-semibold text-charcoal mb-3">
                <span>{draft.durationMin} min</span>
                <span>{draft.durationMax} min</span>
              </div>
              <DualRangeSlider
                min={globalMin}
                max={globalMax}
                lo={draft.durationMin}
                hi={draft.durationMax}
                step={5}
                onChange={(lo, hi) => onChangeDraft({ ...draft, durationMin: lo, durationMax: hi })}
              />
            </div>
          </div>

          {/* Saved only */}
          <div className="space-y-2.5">
            <h3 className="eyebrow">Saved</h3>
            <button
              onClick={() => onChangeDraft({ ...draft, savedOnly: !draft.savedOnly })}
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-pale-sage transition-colors text-left"
            >
              <span
                className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${
                  draft.savedOnly ? 'bg-sage border-sage' : 'border-sage-mist bg-chalk'
                }`}
              >
                {draft.savedOnly && (
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
                )}
              </span>
              <span className="text-[13px] text-charcoal">★ Saved only</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-sage-mist-2 flex-shrink-0">
          <button
            onClick={onReset}
            className="flex-1 py-2.5 rounded-xl border border-sage-mist-2 bg-chalk text-[13px] font-semibold text-charcoal hover:bg-pale-sage transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onApply}
            className="flex-1 py-2.5 rounded-xl bg-sage text-white text-[13px] font-semibold hover:bg-sage-700 transition-colors"
          >
            Show {draftCount} result{draftCount !== 1 ? 's' : ''}
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Filter Sheet (mobile) ────────────────────────────────────────────────────

function FilterSheet({
  open,
  cases,
  draft,
  globalMin,
  globalMax,
  onChangeDraft,
  onApply,
  onReset,
  onClose,
}: {
  open: boolean;
  cases: CaseStudy[];
  draft: Filters;
  globalMin: number;
  globalMax: number;
  onChangeDraft: (next: Filters) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const allClusters = useMemo(() => {
    const seen = new Set<string>();
    cases.forEach((c) => seen.add(c.cluster));
    return Array.from(seen).sort();
  }, [cases]);

  const draftCount = useMemo(() => applyFilters(cases, draft, 'all').length, [cases, draft]);

  const toggleIndustry = (cluster: string) => {
    const next = draft.industries.includes(cluster)
      ? draft.industries.filter((i) => i !== cluster)
      : [...draft.industries, cluster];
    onChangeDraft({ ...draft, industries: next });
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-charcoal/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-chalk rounded-t-[22px] flex flex-col max-h-[88svh] transition-transform duration-[320ms] ease-[cubic-bezier(0.32,0.72,0.24,1)]"
        style={{ transform: open ? 'translateY(0)' : 'translateY(110%)' }}
        aria-label="Filter sheet"
      >
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-9 h-1 rounded-full bg-sage-mist" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
          <h2 className="text-lg font-bold text-charcoal">Filters</h2>
          <button onClick={onReset} className="text-[13px] font-medium text-coral">
            Reset
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-5">
          {/* Industry */}
          <div className="space-y-2">
            <h3 className="eyebrow">Industry</h3>
            <div className="flex flex-wrap gap-2">
              {allClusters.slice(0, 12).map((cluster) => {
                const active = draft.industries.includes(cluster);
                return (
                  <button
                    key={cluster}
                    onClick={() => toggleIndustry(cluster)}
                    className={`text-[13px] font-medium px-3 py-2 rounded-full border transition-colors ${
                      active
                        ? 'bg-sage text-white border-sage'
                        : 'bg-chalk text-charcoal border-sage-mist-2'
                    }`}
                  >
                    {clusterLabel(cluster)}
                  </button>
                );
              })}
              {allClusters.length > 12 && (
                <span className="text-[13px] font-medium px-3 py-2 rounded-full border border-dashed border-sage-mist-2 text-charcoal-3">
                  +{allClusters.length - 12} more
                </span>
              )}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <h3 className="eyebrow">Difficulty</h3>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() =>
                    onChangeDraft({ ...draft, difficulty: draft.difficulty === key ? '' : key })
                  }
                  className={`flex-1 text-[13px] font-medium py-2 px-4 rounded-full border transition-colors ${
                    draft.difficulty === key
                      ? 'bg-sage text-white border-sage'
                      : 'bg-chalk text-charcoal border-sage-mist-2'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="eyebrow">Duration</h3>
              <span className="text-[11px] text-charcoal-3">
                {draft.durationMin}–{draft.durationMax} min
              </span>
            </div>
            <div className="bg-pale-sage rounded-xl p-4">
              <div className="flex justify-between text-[13px] font-semibold text-charcoal mb-3">
                <span>{draft.durationMin} min</span>
                <span>{draft.durationMax} min</span>
              </div>
              <DualRangeSlider
                min={globalMin}
                max={globalMax}
                lo={draft.durationMin}
                hi={draft.durationMax}
                step={5}
                onChange={(lo, hi) =>
                  onChangeDraft({ ...draft, durationMin: lo, durationMax: hi })
                }
              />
            </div>
          </div>

          {/* Saved */}
          <div className="space-y-2">
            <h3 className="eyebrow">Status</h3>
            <button
              onClick={() => onChangeDraft({ ...draft, savedOnly: !draft.savedOnly })}
              className={`text-[13px] font-medium px-4 py-2 rounded-full border transition-colors ${
                draft.savedOnly
                  ? 'bg-sage text-white border-sage'
                  : 'bg-chalk text-charcoal border-sage-mist-2'
              }`}
            >
              ★ Saved
            </button>
          </div>
        </div>

        <div className="px-5 pb-6 pt-2 flex-shrink-0">
          <button
            onClick={onApply}
            className="w-full py-3.5 rounded-xl bg-sage text-white text-[14px] font-semibold hover:bg-sage-700 transition-colors"
          >
            Show {draftCount} result{draftCount !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Challenge Card ───────────────────────────────────────────────────────────

function ChallengeCard({ cs }: { cs: CaseStudy }) {
  return (
    <Link
      href={`/case-studies/${cs.id}`}
      className="group block rounded-[14px] bg-chalk shadow-1 hover:shadow-2 transition-[box-shadow,transform] duration-[220ms] active:scale-[0.98] p-4"
    >
      <div className="flex items-start gap-2.5 mb-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-pale-sage shadow-1">
          <Image
            src={cs.logoUrl}
            alt={cs.companyName ?? 'Company'}
            width={36}
            height={36}
            className="object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="eyebrow truncate">{cs.companyName ?? 'Company'}</div>
          <h2 className="text-[13px] font-semibold text-charcoal leading-snug mt-0.5 line-clamp-3 group-hover:text-sage transition-colors">
            {cs.title}
          </h2>
        </div>
      </div>
      {cs.matchesRoles.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-1">
          {cs.matchesRoles.slice(0, 2).map((role) => (
            <span
              key={role}
              className="rounded-full bg-pale-sage px-2 py-0.5 text-[10px] font-semibold text-sage-700"
            >
              {role}
            </span>
          ))}
          {cs.matchesRoles.length > 2 && (
            <span className="rounded-full bg-pale-sage px-2 py-0.5 text-[10px] font-semibold text-charcoal-3">
              +{cs.matchesRoles.length - 2}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5 mt-auto">
        <Pill variant="sage" size="sm" icon={<Clock className="w-2.5 h-2.5" strokeWidth={1.75} />}>
          {cs.estimatedMinutes} min
        </Pill>
        <Pill variant="sage" size="sm">
          <span className="capitalize">{clusterLabel(cs.cluster)}</span>
        </Pill>
        <Pill variant="sage" size="sm">
          <span className="capitalize">{cs.duration}</span>
        </Pill>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ChallengesClient({ cases }: { cases: CaseStudy[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [globalMin, globalMax] = useMemo(() => {
    let min = Infinity, max = -Infinity;
    cases.forEach((c) => {
      min = Math.min(min, c.estimatedMinutes);
      max = Math.max(max, c.estimatedMinutes);
    });
    return [min === Infinity ? 0 : min, max === -Infinity ? 60 : max];
  }, [cases]);

  // ── Parse committed state from URL ────────────────────────────────────────
  const segment = (searchParams.get('segment') as Segment) ?? 'all';
  const sort = (searchParams.get('sort') as SortKey) ?? 'popular';

  const committedFilters = useMemo<Filters>(
    () => ({
      industries: searchParams.getAll('industry'),
      difficulty: searchParams.get('difficulty') ?? '',
      durationMin: searchParams.has('durationMin')
        ? Number(searchParams.get('durationMin'))
        : globalMin,
      durationMax: searchParams.has('durationMax')
        ? Number(searchParams.get('durationMax'))
        : globalMax,
      savedOnly: searchParams.get('savedOnly') === '1',
    }),
    [searchParams, globalMin, globalMax],
  );

  // ── Local UI state ────────────────────────────────────────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');

  // Draft filters: editable inside drawer/sheet; committed to URL on Apply
  const [draft, setDraft] = useState<Filters>(committedFilters);
  useEffect(() => {
    if (drawerOpen || sheetOpen) setDraft(committedFilters);
  }, [drawerOpen, sheetOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search → URL
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => pushParams({ q: value || null }), 200);
  };

  // ── URL helpers ───────────────────────────────────────────────────────────
  const pushParams = useCallback(
    (overrides: Record<string, string | string[] | null>) => {
      const base = new URLSearchParams(searchParams.toString());
      for (const [key, val] of Object.entries(overrides)) {
        base.delete(key);
        if (val === null) continue;
        if (Array.isArray(val)) val.forEach((v) => base.append(key, v));
        else base.set(key, val);
      }
      // Strip default values for clean URLs
      if (base.get('segment') === 'all') base.delete('segment');
      if (base.get('sort') === 'popular') base.delete('sort');
      if (base.get('durationMin') === String(globalMin)) base.delete('durationMin');
      if (base.get('durationMax') === String(globalMax)) base.delete('durationMax');
      const qs = base.toString();
      router.replace(`/challenges${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [router, searchParams, globalMin, globalMax],
  );

  const applyDraft = useCallback(() => {
    pushParams({
      industry: draft.industries,
      difficulty: draft.difficulty || null,
      durationMin: draft.durationMin !== globalMin ? String(draft.durationMin) : null,
      durationMax: draft.durationMax !== globalMax ? String(draft.durationMax) : null,
      savedOnly: draft.savedOnly ? '1' : null,
    });
    setDrawerOpen(false);
    setSheetOpen(false);
  }, [draft, pushParams, globalMin, globalMax]);

  const resetDraft = useCallback(() => {
    setDraft({ industries: [], difficulty: '', durationMin: globalMin, durationMax: globalMax, savedOnly: false });
  }, [globalMin, globalMax]);

  const clearAll = useCallback(() => {
    pushParams({ industry: [], difficulty: null, durationMin: null, durationMax: null, savedOnly: null });
  }, [pushParams]);

  const removeFilter = useCallback(
    (type: 'industry' | 'difficulty' | 'duration' | 'savedOnly', value?: string) => {
      if (type === 'industry' && value)
        pushParams({ industry: committedFilters.industries.filter((i) => i !== value) });
      else if (type === 'difficulty') pushParams({ difficulty: null });
      else if (type === 'duration') pushParams({ durationMin: null, durationMax: null });
      else if (type === 'savedOnly') pushParams({ savedOnly: null });
    },
    [pushParams, committedFilters],
  );

  // ── Computed results ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = applyFilters(cases, committedFilters, segment);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.companyName?.toLowerCase().includes(q) ?? false) ||
          clusterLabel(c.cluster).toLowerCase().includes(q) ||
          c.matchesRoles.some((r) => r.toLowerCase().includes(q)),
      );
    }
    return sortCases(result, sort);
  }, [cases, committedFilters, segment, searchQuery, sort]);

  const activeCount = useMemo(
    () => countActiveFilters(committedFilters, globalMin, globalMax),
    [committedFilters, globalMin, globalMax],
  );

  // Segment counts (non-All stubbed pending user state)
  const segmentCounts: Record<Segment, number> = {
    all: cases.length,
    'for-you': 0,
    saved: 0,
    'in-progress': 0,
    completed: 0,
  };

  // Close sort dropdown on outside click
  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sortOpen) return;
    const off = (e: MouseEvent) => {
      if (!sortRef.current?.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener('mousedown', off);
    return () => document.removeEventListener('mousedown', off);
  }, [sortOpen]);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label ?? 'Most popular';

  // ── Active chip list ──────────────────────────────────────────────────────
  const activeChips: { id: string; label: string; remove: () => void }[] = [
    ...committedFilters.industries.map((ind) => ({
      id: `ind-${ind}`,
      label: clusterLabel(ind),
      remove: () => removeFilter('industry', ind),
    })),
    ...(committedFilters.difficulty
      ? [{
          id: 'diff',
          label: DIFFICULTY_OPTIONS.find((d) => d.key === committedFilters.difficulty)?.label ?? committedFilters.difficulty,
          remove: () => removeFilter('difficulty'),
        }]
      : []),
    ...(committedFilters.durationMin !== globalMin || committedFilters.durationMax !== globalMax
      ? [{
          id: 'dur',
          label: `${committedFilters.durationMin}–${committedFilters.durationMax} min`,
          remove: () => removeFilter('duration'),
        }]
      : []),
    ...(committedFilters.savedOnly
      ? [{ id: 'saved', label: '★ Saved', remove: () => removeFilter('savedOnly') }]
      : []),
  ];

  return (
    <div className="space-y-4">
      {/* Page head */}
      <header>
        <div className="eyebrow mb-1.5" style={{ color: 'var(--color-sage)' }}>All challenges</div>
        <h1 className="text-3xl font-bold text-charcoal tracking-tight leading-tight">
          Browse every case study
        </h1>
        <p className="text-charcoal-2 text-sm mt-1.5">
          {cases.length} real-world challenges from{' '}
          {new Set(cases.map((c) => c.companyName)).size} companies.
        </p>
      </header>

      {/* ── Segment tabs ──────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-pale-sage rounded-xl w-fit overflow-x-auto">
        {SEGMENTS.map(({ key, label }) => {
          const active = segment === key;
          return (
            <button
              key={key}
              onClick={() => pushParams({ segment: key })}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
                active
                  ? 'bg-chalk text-charcoal font-semibold shadow-1'
                  : 'text-charcoal-2 hover:text-charcoal'
              }`}
            >
              {label}
              <span
                className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                  active ? 'bg-sage text-white' : 'bg-sage/15 text-sage-700'
                }`}
              >
                {segmentCounts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-chalk border border-sage-mist-2 rounded-xl px-3.5 py-2 text-[13px] text-charcoal-3">
          <Search className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.75} />
          <input
            type="search"
            placeholder="Search challenges, companies, roles…"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 bg-transparent outline-none text-charcoal placeholder:text-charcoal-3 min-w-0"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); pushParams({ q: null }); }}
              className="text-charcoal-3 hover:text-charcoal"
            >
              <X className="w-3 h-3" strokeWidth={2} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center text-[10px] border border-sage-mist-2 rounded px-1.5 py-0.5 text-charcoal-3">
            ⌘K
          </kbd>
        </div>

        {/* Sort — desktop */}
        <div ref={sortRef} className="relative hidden sm:block">
          <button
            onClick={() => setSortOpen((v) => !v)}
            className="flex items-center gap-2 px-3.5 py-2 bg-chalk border border-sage-mist-2 rounded-xl text-[13px] font-medium text-charcoal hover:bg-pale-sage transition-colors whitespace-nowrap"
          >
            <ArrowDownUp className="w-3.5 h-3.5" strokeWidth={1.75} />
            {currentSortLabel}
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-10 bg-chalk border border-sage-mist-2 rounded-xl shadow-3 py-1.5 min-w-[180px]">
              {SORT_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { pushParams({ sort: key }); setSortOpen(false); }}
                  className={`w-full text-left px-3.5 py-2 text-[13px] hover:bg-pale-sage transition-colors flex items-center justify-between ${
                    sort === key ? 'text-sage font-semibold' : 'text-charcoal'
                  }`}
                >
                  {label}
                  {sort === key && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters button — desktop */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={`hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-colors whitespace-nowrap ${
            activeCount > 0
              ? 'bg-sage text-white hover:bg-sage-700'
              : 'bg-chalk border border-sage-mist-2 text-charcoal hover:bg-pale-sage'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.75} />
          Filters
          {activeCount > 0 && (
            <span className="bg-white/25 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </button>

        {/* Filters button — mobile */}
        <button
          onClick={() => setSheetOpen(true)}
          className="lg:hidden relative flex items-center gap-2 px-3.5 py-2 bg-chalk border border-sage-mist-2 rounded-xl text-[13px] font-medium text-charcoal"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.75} />
          Filters
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-coral text-white text-[9px] font-bold flex items-center justify-center border-2 border-chalk">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Active filter chips ────────────────────────────────────────────── */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
          <span className="text-charcoal-3 mr-0.5">Filtering by:</span>
          {activeChips.map(({ id, label, remove }) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 bg-pale-sage text-sage-700 font-medium px-2.5 py-1 rounded-full"
            >
              {label}
              <button
                onClick={remove}
                className="opacity-60 hover:opacity-100 transition-opacity ml-0.5"
                aria-label={`Remove ${label} filter`}
              >
                <X className="w-2.5 h-2.5" strokeWidth={2.5} />
              </button>
            </span>
          ))}
          <button onClick={clearAll} className="text-coral font-medium hover:underline ml-1">
            Clear all
          </button>
        </div>
      )}

      {/* ── Result count + mobile sort ─────────────────────────────────────── */}
      <div className="flex items-center justify-between text-[13px] text-charcoal-2">
        <span>
          <strong className="text-charcoal font-semibold">{filtered.length}</strong>{' '}
          result{filtered.length !== 1 ? 's' : ''}
          {searchQuery && <span className="ml-1">for &ldquo;{searchQuery}&rdquo;</span>}
        </span>
        <button
          className="sm:hidden flex items-center gap-1.5 text-charcoal"
          onClick={() => setSortOpen((v) => !v)}
        >
          <ArrowDownUp className="w-3.5 h-3.5" strokeWidth={1.75} />
          {currentSortLabel}
          <ChevronDown className="w-3 h-3" strokeWidth={2} />
        </button>
      </div>

      {/* Mobile sort sheet */}
      {sortOpen && (
        <div className="sm:hidden fixed inset-0 z-40" onClick={() => setSortOpen(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-chalk rounded-t-2xl shadow-3 py-4 px-5 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="eyebrow mb-3">Sort by</p>
            {SORT_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { pushParams({ sort: key }); setSortOpen(false); }}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-[14px] hover:bg-pale-sage transition-colors ${
                  sort === key ? 'text-sage font-semibold' : 'text-charcoal'
                }`}
              >
                {label}
                {sort === key && <Check className="w-4 h-4" strokeWidth={2.5} />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Card grid ─────────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((cs) => (
            <ChallengeCard key={cs.id} cs={cs} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-pale-sage flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-sage-300" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-semibold text-charcoal mb-1">No challenges found</h2>
          <p className="text-charcoal-3 text-sm max-w-xs">
            {searchQuery
              ? `No results for "${searchQuery}". Try different keywords.`
              : 'Try adjusting or clearing your filters.'}
          </p>
          {(activeCount > 0 || searchQuery) && (
            <button
              onClick={() => { clearAll(); setSearchQuery(''); pushParams({ q: null }); }}
              className="mt-4 text-sage text-sm font-medium hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Drawers */}
      <FilterDrawer
        open={drawerOpen}
        cases={cases}
        draft={draft}
        globalMin={globalMin}
        globalMax={globalMax}
        onChangeDraft={setDraft}
        onApply={applyDraft}
        onReset={resetDraft}
        onClose={() => setDrawerOpen(false)}
      />
      <FilterSheet
        open={sheetOpen}
        cases={cases}
        draft={draft}
        globalMin={globalMin}
        globalMax={globalMax}
        onChangeDraft={setDraft}
        onApply={applyDraft}
        onReset={resetDraft}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
