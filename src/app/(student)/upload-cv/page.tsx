"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Check, FileText, UploadCloud, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";

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

    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("cvs")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
    }

    const { data: urlData } = supabase.storage
      .from("cvs")
      .getPublicUrl(filePath);

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

    if (!result.name) {
      result.name = user.user_metadata?.full_name || user.user_metadata?.name || null;
    }

    setParsed(result);
    setEditableSkills(result.skills);

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
    <div className="min-h-screen bg-chalk flex flex-col">
      {/* Top bar */}
      <div className="border-b border-sage-mist-2 bg-chalk">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center"><Logo height={28} priority /></Link>
          <span className="eyebrow">Optional step</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {!parsed ? (
            <div className="fade-in">
              <h1 className="text-2xl md:text-[28px] font-bold text-charcoal mb-2 tracking-tight">
                Have a CV? Upload it.
              </h1>
              <p className="text-charcoal-2 mb-8 leading-relaxed">
                We&apos;ll use AI to extract your skills and experience to improve your career matches.
                This is optional &mdash; you can skip it.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[10px] px-4 py-3 mb-6">
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
                className={`border-2 border-dashed rounded-[14px] p-12 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-sage bg-pale-sage"
                    : file
                    ? "border-sage bg-pale-sage"
                    : "border-sage-mist-2 hover:border-sage-mist bg-chalk"
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
                    <div className="w-12 h-12 bg-pale-sage rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-sage" strokeWidth={1.75} />
                    </div>
                    <p className="font-semibold text-charcoal">{file.name}</p>
                    <p className="text-sm text-charcoal-2 mt-1">
                      {(file.size / 1024).toFixed(0)} KB &middot; Click to change
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 bg-pale-sage rounded-full flex items-center justify-center mx-auto mb-3">
                      <UploadCloud className="w-6 h-6 text-sage" strokeWidth={1.75} />
                    </div>
                    <p className="font-semibold text-charcoal">
                      Drop your CV here or click to browse
                    </p>
                    <p className="text-sm text-charcoal-2 mt-1">PDF or DOCX, max 5MB</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-6">
                {file && (
                  <Button
                    onClick={handleUploadAndParse}
                    disabled={uploading}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        AI is analyzing your CV…
                      </span>
                    ) : (
                      "Upload & analyze with AI"
                    )}
                  </Button>
                )}
                <button
                  onClick={() => router.push("/questionnaire")}
                  className="w-full text-charcoal-2 py-2 text-sm hover:text-charcoal transition-colors"
                >
                  Skip for now &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-pale-sage rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-sage" strokeWidth={1.75} />
                </div>
                <h1 className="text-2xl md:text-[28px] font-bold text-charcoal tracking-tight">
                  CV analyzed
                </h1>
              </div>

              <p className="text-charcoal-2 mb-6 leading-relaxed">
                We extracted the following from your CV. Edit anything that&apos;s off before continuing.
              </p>

              {parsed.name && (
                <div className="bg-chalk rounded-[14px] shadow-1 p-5 mb-4">
                  <h3 className="eyebrow mb-1">Name</h3>
                  <p className="text-charcoal font-medium">{parsed.name}</p>
                </div>
              )}

              {parsed.education && (
                <div className="bg-chalk rounded-[14px] shadow-1 p-5 mb-4">
                  <h3 className="eyebrow mb-1">Education</h3>
                  <p className="text-charcoal">{parsed.education}</p>
                </div>
              )}

              {parsed.experience.length > 0 && (
                <div className="bg-chalk rounded-[14px] shadow-1 p-5 mb-4">
                  <h3 className="eyebrow mb-3">Experience</h3>
                  <ul className="space-y-2">
                    {parsed.experience.map((exp, i) => (
                      <li key={i} className="text-sm text-charcoal flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sage mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-chalk rounded-[14px] shadow-1 p-5 mb-4">
                <h3 className="eyebrow mb-3">
                  Skills <span className="text-charcoal-3 normal-case tracking-normal">(used for matching)</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {editableSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-pale-sage text-sage-700 font-semibold"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(i)}
                        className="hover:text-coral-700 transition-colors"
                        aria-label={`Remove ${skill}`}
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {parsed.languages.length > 0 && (
                <div className="bg-chalk rounded-[14px] shadow-1 p-5 mb-6">
                  <h3 className="eyebrow mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {parsed.languages.map((lang, i) => (
                      <Pill key={i} variant="mist" size="md">
                        {lang}
                      </Pill>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleContinue}
                variant="primary"
                size="lg"
                className="w-full"
              >
                Continue to questionnaire &rarr;
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
