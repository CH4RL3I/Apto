"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { deleteMyAccount, updateStudentProfile } from "./actions";

interface InitialValues {
  name: string;
  education: string;
  experience: string[];
  skills: string[];
  isPublic: boolean;
  username: string;
  headline: string;
  cvUrl: string | null;
  email: string | null;
}

export function ProfileEditForm({ initial }: { initial: InitialValues }) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [education, setEducation] = useState(initial.education);
  const [experience, setExperience] = useState<string[]>(
    initial.experience.length > 0 ? initial.experience : [""],
  );
  const [skills, setSkills] = useState<string[]>(initial.skills);
  const [skillDraft, setSkillDraft] = useState("");
  const [isPublic, setIsPublic] = useState(initial.isPublic);
  const [username, setUsername] = useState(initial.username);
  const [headline, setHeadline] = useState(initial.headline);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateExperience(index: number, value: string) {
    setExperience((prev) => prev.map((e, i) => (i === index ? value : e)));
  }

  function removeExperience(index: number) {
    setExperience((prev) => prev.filter((_, i) => i !== index));
  }

  function addExperience() {
    setExperience((prev) => [...prev, ""]);
  }

  function addSkill() {
    const v = skillDraft.trim();
    if (!v) return;
    if (skills.includes(v)) {
      setSkillDraft("");
      return;
    }
    setSkills((prev) => [...prev, v]);
    setSkillDraft("");
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateStudentProfile({
        name,
        education,
        experience,
        skills,
        isPublic,
        username,
        headline,
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
        setError(err.message);
      }
      setSaving(false);
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-[14px] bg-chalk p-5 shadow-1">
        <label htmlFor="name" className="eyebrow mb-2 block">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-[10px] border border-sage-mist-2 bg-chalk px-3 py-2 text-sm text-charcoal focus-ring"
          placeholder="Your full name"
        />
      </div>

      <div className="rounded-[14px] bg-chalk p-5 shadow-1">
        <label htmlFor="education" className="eyebrow mb-2 block">
          Education
        </label>
        <textarea
          id="education"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          rows={3}
          className="w-full rounded-[10px] border border-sage-mist-2 bg-chalk px-3 py-2 text-sm text-charcoal focus-ring"
          placeholder="School, degree, year"
        />
      </div>

      <div className="rounded-[14px] bg-chalk p-5 shadow-1">
        <div className="mb-3 flex items-center justify-between">
          <span className="eyebrow">Experience</span>
          <button
            type="button"
            onClick={addExperience}
            className="focus-ring inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-sage hover:underline"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {experience.map((exp, i) => (
            <div key={i} className="flex items-start gap-2">
              <textarea
                value={exp}
                onChange={(e) => updateExperience(i, e.target.value)}
                rows={2}
                className="flex-1 rounded-[10px] border border-sage-mist-2 bg-chalk px-3 py-2 text-sm text-charcoal focus-ring"
                placeholder="Role, company, what you did"
              />
              {experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(i)}
                  className="focus-ring mt-1 rounded-full p-1 text-charcoal-3 hover:bg-pale-sage hover:text-coral-700"
                  aria-label="Remove experience"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[14px] bg-chalk p-5 shadow-1">
        <div className="mb-3 flex items-center justify-between">
          <span className="eyebrow">Skills</span>
          <span className="text-[11px] text-charcoal-3">Used for matching</span>
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {skills.length === 0 && (
            <span className="text-xs text-charcoal-3">No skills yet.</span>
          )}
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 rounded-full bg-pale-sage px-2.5 py-1 text-xs font-semibold text-sage-700"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-coral-700"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={skillDraft}
            onChange={(e) => setSkillDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add a skill and press Enter"
            className="flex-1 rounded-[10px] border border-sage-mist-2 bg-chalk px-3 py-2 text-sm text-charcoal focus-ring"
          />
          <Button type="button" variant="ghost" size="sm" onClick={addSkill}>
            Add
          </Button>
        </div>
      </div>

      <div className="rounded-[14px] bg-chalk p-5 shadow-1">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow block">Public profile</span>
            <p className="mt-1 text-xs text-charcoal-3">
              When on, anyone with the link can view your name, headline, and
              skills. Submissions stay private.
            </p>
          </div>
          <label className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-charcoal">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-sage-mist-2 text-sage focus-ring"
            />
            {isPublic ? "On" : "Off"}
          </label>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="headline" className="eyebrow mb-1 block">
              Headline
            </label>
            <input
              id="headline"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              maxLength={200}
              className="w-full rounded-[10px] border border-sage-mist-2 bg-chalk px-3 py-2 text-sm text-charcoal focus-ring"
              placeholder="e.g. CS senior at TUM, building data tools"
            />
          </div>
          <div>
            <label htmlFor="username" className="eyebrow mb-1 block">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "")
                    .slice(0, 30),
                )
              }
              className="w-full rounded-[10px] border border-sage-mist-2 bg-chalk px-3 py-2 text-sm text-charcoal focus-ring"
              placeholder="your-handle"
            />
            {username && (
              <p className="mt-1 text-xs text-charcoal-3">
                Your public profile: apto.app/u/{username}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => router.push("/dashboard")}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>

    <CvSection cvUrl={initial.cvUrl} />

    <DangerZone />
    </>
  );
}

// ---------------------------------------------------------------------------
// CV section — view current CV, replace via /upload-cv
// ---------------------------------------------------------------------------

function CvSection({ cvUrl }: { cvUrl: string | null }) {
  const fileName = (() => {
    if (!cvUrl) return null;
    try {
      const decoded = decodeURIComponent(cvUrl);
      const last = decoded.split("/").pop() ?? "";
      // Strip leading timestamp prefix (uploads use `${timestamp}-${name}`).
      return last.replace(/^\d+-/, "");
    } catch {
      return cvUrl;
    }
  })();

  return (
    <div className="mt-6 rounded-[14px] border border-sage-mist-2 bg-chalk p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="eyebrow text-charcoal-2">CV</div>
          <h2 className="mt-1 text-base font-bold tracking-tight text-charcoal">
            Your CV
          </h2>
        </div>
      </div>
      {cvUrl ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-charcoal-2">
            Current file:{" "}
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sage underline-offset-2 hover:underline"
            >
              {fileName ?? "View CV"}
            </a>
          </div>
          <Link
            href="/upload-cv"
            className="focus-ring inline-flex items-center justify-center rounded-[10px] border border-sage bg-chalk px-3 py-2 text-sm font-semibold text-sage hover:bg-pale-sage"
          >
            Replace CV
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-charcoal-2">
            No CV on file yet. Upload one so we can match you and so companies can review your submissions with full context.
          </p>
          <Link
            href="/upload-cv"
            className="focus-ring inline-flex items-center justify-center rounded-[10px] bg-sage px-3 py-2 text-sm font-semibold text-chalk hover:bg-sage-700"
          >
            Upload CV
          </Link>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Danger zone — account deletion
// ---------------------------------------------------------------------------

function DangerZone() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = confirm === "DELETE" && !pending;

  function close() {
    if (pending) return;
    setOpen(false);
    setConfirm("");
    setError(null);
  }

  async function handleDelete() {
    setPending(true);
    setError(null);
    try {
      const res = await deleteMyAccount("DELETE");
      if (!res.ok) {
        setError(res.error ?? "Something went wrong. Please try again.");
        setPending(false);
        return;
      }
      // Server cleared the session cookies. Hard navigate to "/" so any
      // cached client state is dropped.
      window.location.assign("/");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
      setPending(false);
    }
  }

  return (
    <>
      <div className="mt-10 rounded-[14px] border-2 border-coral/50 bg-coral-100/40 p-5 shadow-1">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle
            className="h-4 w-4 text-coral-700"
            strokeWidth={2.25}
          />
          <span className="eyebrow text-coral-700">Danger zone</span>
        </div>
        <h2 className="mb-2 text-base font-bold text-charcoal">
          Delete account
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-charcoal-2">
          Permanently delete your Apto account, including your profile, CV,
          submissions, connections, messages, certificates, notifications and
          invitations. This action is permanent and cannot be undone.
        </p>
        <Button
          type="button"
          variant="coral"
          size="md"
          onClick={() => setOpen(true)}
        >
          Delete my account
        </Button>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 px-4"
          onClick={close}
        >
          <div
            className="w-full max-w-md rounded-[14px] bg-chalk p-6 shadow-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle
                className="h-5 w-5 text-coral-700"
                strokeWidth={2.25}
              />
              <h3
                id="delete-account-title"
                className="text-lg font-bold text-charcoal"
              >
                Permanently delete your account?
              </h3>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-charcoal-2">
              The following will be erased: your profile, CV, submissions,
              connections, messages, certificates, notifications and
              invitations.
            </p>
            <p className="mb-4 text-sm font-semibold text-coral-700">
              This cannot be undone.
            </p>

            <label
              htmlFor="delete-confirm"
              className="eyebrow mb-2 block"
            >
              Type DELETE to confirm
            </label>
            <input
              id="delete-confirm"
              type="text"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="DELETE"
              disabled={pending}
              className="w-full rounded-[10px] border border-sage-mist-2 bg-chalk px-3 py-2 text-sm text-charcoal focus-ring"
            />

            {error && (
              <div className="mt-3 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={close}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="coral"
                size="md"
                onClick={handleDelete}
                disabled={!canSubmit}
              >
                {pending ? "Deleting…" : "Delete forever"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
