"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { updateStudentProfile } from "./actions";

interface InitialValues {
  name: string;
  education: string;
  experience: string[];
  skills: string[];
  isPublic: boolean;
  username: string;
  headline: string;
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
  );
}
