"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { QUESTIONS } from "@/lib/constants";
import { answersToVector } from "@/lib/matching/vectors";
import Link from "next/link";

type Answers = Record<number, string | string[] | number>;

export default function QuestionnairePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const question = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;
  const canProceed = answers[question.id] !== undefined;

  function handleSingleSelect(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function handleMultiSelect(value: string) {
    const current = (answers[question.id] as string[]) || [];
    const max = question.maxSelections || 3;
    if (current.includes(value)) {
      setAnswers((prev) => ({
        ...prev,
        [question.id]: current.filter((v) => v !== value),
      }));
    } else if (current.length < max) {
      setAnswers((prev) => ({
        ...prev,
        [question.id]: [...current, value],
      }));
    }
  }

  function handleSlider(value: number) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function handleNext() {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }

  async function handleSubmit() {
    setSaving(true);
    const vector = answersToVector(answers);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    await supabase
      .from("profiles")
      .update({
        questionnaire_answers: answers,
        match_vector: vector,
        completed_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    router.push("/results");
  }

  const isLast = currentStep === QUESTIONS.length - 1;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border bg-white">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            apto
          </Link>
          <span className="text-sm text-muted">
            {currentStep + 1} of {QUESTIONS.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-primary progress-fill rounded-r-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg fade-in" key={currentStep}>
          <h2 className="text-2xl font-semibold text-slate-900 mb-8">
            {question.question}
          </h2>

          {/* Single select */}
          {question.type === "single-select" && question.options && (
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSingleSelect(option.value)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all text-sm font-medium ${
                    answers[question.id] === option.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {/* Multi select */}
          {question.type === "multi-select" && question.options && (
            <div className="space-y-3">
              <p className="text-sm text-muted mb-4">
                Select up to {question.maxSelections || 3}
              </p>
              {question.options.map((option) => {
                const selected = (
                  (answers[question.id] as string[]) || []
                ).includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleMultiSelect(option.value)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all text-sm font-medium ${
                      selected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          selected
                            ? "border-primary bg-primary"
                            : "border-slate-300"
                        }`}
                      >
                        {selected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Slider */}
          {question.type === "slider" && question.sliderConfig && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted mb-4">
                <span>{question.sliderConfig.minLabel}</span>
                <span>{question.sliderConfig.maxLabel}</span>
              </div>
              <input
                type="range"
                min={question.sliderConfig.min}
                max={question.sliderConfig.max}
                value={
                  (answers[question.id] as number) ??
                  question.sliderConfig.max / 2
                }
                onChange={(e) => handleSlider(parseInt(e.target.value))}
                onMouseDown={() => {
                  if (answers[question.id] === undefined) {
                    handleSlider(question.sliderConfig!.max / 2);
                  }
                }}
                className="w-full"
              />
              <div className="text-center mt-3 text-2xl font-bold text-primary">
                {(answers[question.id] as number) ??
                  question.sliderConfig.max / 2}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="border-t border-border bg-white">
        <div className="max-w-lg mx-auto px-6 py-4 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-colors"
          >
            &larr; Back
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed || saving}
              className="px-8 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              {saving ? "Finding your matches..." : "See My Results"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="px-8 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              Next &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
