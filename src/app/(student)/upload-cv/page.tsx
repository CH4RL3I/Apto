"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Logo } from "@/components/Logo";

interface ParsedCV {
  name: string | null;
  education: string | null;
  experience: string[];
  skills: string[];
  languages: string[];
}

export default function UploadCVPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsed, setParsed] = useState<ParsedCV | null>(null);
  const [editableSkills, setEditableSkills] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  function handleFile(f: File) {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(f.type)) {
      alert("Please upload a PDF or DOCX file.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB.");
      return;
    }
    setFile(f);
    setError(null);
  }

  async function handleUploadAndParse() {
    if (!file) return;
    setUploading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // Upload to Supabase Storage
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("cvs")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
    }

    // Get URL for reference
    const { data: urlData } = supabase.storage
      .from("cvs")
      .getPublicUrl(filePath);

    // Send to Gemini for real parsing
    let result: ParsedCV;
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-cv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to parse CV");
      }

      result = await response.json();
    } catch (err) {
      console.error("Parse error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to analyze CV. You can skip this step and continue."
      );
      setUploading(false);
      return;
    }

    // Override name with auth data if available
    if (!result.name) {
      result.name = user.user_metadata?.full_name || user.user_metadata?.name || null;
    }

    setParsed(result);
    setEditableSkills(result.skills);

    // Save to profile
    await supabase
      .from("profiles")
      .update({
        cv_url: urlData?.publicUrl || filePath,
        cv_parsed: result,
        cv_skills: result.skills,
      })
      .eq("user_id", user.id);

    setUploading(false);
  }

  function removeSkill(index: number) {
    setEditableSkills((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleContinue() {
    if (parsed) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ cv_skills: editableSkills })
          .eq("user_id", user.id);
      }
    }
    router.push("/questionnaire");
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border bg-white">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center"><Logo height={28} priority /></Link>
          <span className="text-sm text-muted">Optional step</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {!parsed ? (
            <div className="fade-in">
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                Have a CV? Upload it.
              </h1>
              <p className="text-muted mb-8">
                We&apos;ll use AI to extract your skills and experience to improve your career matches.
                This is optional &mdash; you can skip it.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
                  {error}
                </div>
              )}

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile(f);
                }}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : file
                    ? "border-green-400 bg-green-50"
                    : "border-border hover:border-slate-400 bg-white"
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />

                {file ? (
                  <div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="font-medium text-slate-900">{file.name}</p>
                    <p className="text-sm text-muted mt-1">
                      {(file.size / 1024).toFixed(0)} KB &middot; Click to change
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="font-medium text-slate-900">
                      Drop your CV here or click to browse
                    </p>
                    <p className="text-sm text-muted mt-1">PDF or DOCX, max 5MB</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-6">
                {file && (
                  <button
                    onClick={handleUploadAndParse}
                    disabled={uploading}
                    className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors"
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        AI is analyzing your CV...
                      </span>
                    ) : (
                      "Upload & Analyze with AI"
                    )}
                  </button>
                )}
                <button
                  onClick={() => router.push("/questionnaire")}
                  className="w-full text-muted py-2 text-sm hover:text-slate-900 transition-colors"
                >
                  Skip for now &rarr;
                </button>
              </div>
            </div>
          ) : (
            // Parsed results - editable
            <div className="fade-in">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  CV Analyzed
                </h1>
              </div>

              <p className="text-muted mb-6">
                We extracted the following from your CV. Edit anything that&apos;s off before continuing.
              </p>

              {/* Name */}
              {parsed.name && (
                <div className="bg-white rounded-xl border border-border p-5 mb-4">
                  <h3 className="text-sm font-medium text-muted mb-1">Name</h3>
                  <p className="text-slate-900 font-medium">{parsed.name}</p>
                </div>
              )}

              {/* Education */}
              {parsed.education && (
                <div className="bg-white rounded-xl border border-border p-5 mb-4">
                  <h3 className="text-sm font-medium text-muted mb-1">Education</h3>
                  <p className="text-slate-900">{parsed.education}</p>
                </div>
              )}

              {/* Experience */}
              {parsed.experience.length > 0 && (
                <div className="bg-white rounded-xl border border-border p-5 mb-4">
                  <h3 className="text-sm font-medium text-muted mb-2">Experience</h3>
                  <ul className="space-y-1.5">
                    {parsed.experience.map((exp, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills (editable) */}
              <div className="bg-white rounded-xl border border-border p-5 mb-4">
                <h3 className="text-sm font-medium text-muted mb-3">
                  Skills <span className="text-xs font-normal">(used for matching)</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {editableSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(i)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              {parsed.languages.length > 0 && (
                <div className="bg-white rounded-xl border border-border p-5 mb-6">
                  <h3 className="text-sm font-medium text-muted mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {parsed.languages.map((lang, i) => (
                      <span key={i} className="text-sm px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleContinue}
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                Continue to Questionnaire &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
