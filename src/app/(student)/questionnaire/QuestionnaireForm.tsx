"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { QUESTIONS, type Answers, type Question } from "@/lib/questionnaire/questions";
import { submitQuestionnaire } from "./actions";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";

export default function QuestionnaireForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [saving, setSaving] = useState(false);

  const question = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;
  const isLast = currentStep === QUESTIONS.length - 1;
  const canProceed = isAnswered(question, answers);

  function handleSingle(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function handleMulti(value: string) {
    if (question.type !== "multi") return;
    const current = (answers[question.id] as string[] | undefined) ?? [];
    if (current.includes(value)) {
      setAnswers((prev) => ({
        ...prev,
        [question.id]: current.filter((v) => v !== value),
      }));
    } else if (current.length < question.max) {
      setAnswers((prev) => ({ ...prev, [question.id]: [...current, value] }));
    }
  }

  function handleRank(value: string) {
    if (question.type !== "rank") return;
    const current = (answers.values as string[] | undefined) ?? [];
    if (current.includes(value)) {
      setAnswers((prev) => ({
        ...prev,
        values: current.filter((v) => v !== value),
      }));
    } else if (current.length < question.max) {
      setAnswers((prev) => ({ ...prev, values: [...current, value] }));
    }
  }

  function handleNext() {
    if (currentStep < QUESTIONS.length - 1) setCurrentStep((s) => s + 1);
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      await submitQuestionnaire(answers);
    } catch (err) {
      // redirect() throws NEXT_REDIRECT; any other error we surface
      if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
        setSaving(false);
        throw err;
      }
    }
  }

  return (
    <div className="min-h-screen bg-pale-sage flex flex-col">
      {/* Top bar */}
      <div className="border-b border-sage-mist-2 bg-chalk">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" aria-label="Apto home" className="inline-flex items-center">
            <Logo height={28} priority />
          </Link>
          <span className="eyebrow">
            {currentStep + 1} / {QUESTIONS.length}
          </span>
        </div>
        <div className="h-1 bg-sage-mist-2">
          <div
            className="h-full bg-sage progress-fill rounded-r-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg fade-in" key={currentStep}>
          <h2 className="text-[28px] md:text-3xl font-bold text-charcoal mb-2 tracking-tight" style={{ textWrap: "balance" }}>
            {question.title}
          </h2>
          <p className="text-sm text-charcoal-2 mb-8 leading-relaxed">{question.hint}</p>

          {question.type === "single" && (
            <div className="space-y-3">
              {question.options.map((option) => {
                const selected = answers[question.id] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSingle(option.value)}
                    className={`w-full text-left px-5 py-4 rounded-[14px] border transition-all text-sm font-medium ${
                      selected
                        ? "border-sage bg-pale-sage text-sage-700 shadow-1"
                        : "border-sage-mist-2 bg-chalk text-charcoal hover:border-sage-mist hover:shadow-1"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}

          {question.type === "multi" && (
            <>
              <div className="space-y-3">
                {question.options.map((option) => {
                  const current = (answers[question.id] as string[] | undefined) ?? [];
                  const selected = current.includes(option.value);
                  const atMax = current.length >= question.max && !selected;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleMulti(option.value)}
                      disabled={atMax}
                      className={`w-full text-left px-5 py-4 rounded-[14px] border transition-all text-sm font-medium ${
                        selected
                          ? "border-sage bg-pale-sage text-sage-700 shadow-1"
                          : atMax
                          ? "border-sage-mist-2 bg-chalk text-charcoal-3 cursor-not-allowed"
                          : "border-sage-mist-2 bg-chalk text-charcoal hover:border-sage-mist hover:shadow-1"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`w-5 h-5 rounded-[6px] border-2 flex items-center justify-center flex-shrink-0 ${
                            selected
                              ? "border-sage bg-sage"
                              : "border-sage-mist"
                          }`}
                        >
                          {selected && (
                            <Check className="w-3 h-3 text-chalk" strokeWidth={3} />
                          )}
                        </span>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-charcoal-2 mt-4 text-center">
                {((answers[question.id] as string[] | undefined) ?? []).length}{" "}
                of max. {question.max} selected
              </p>
            </>
          )}

          {question.type === "rank" && (
            <>
              <div className="space-y-3">
                {question.options.map((option) => {
                  const ranked = (answers.values as string[] | undefined) ?? [];
                  const idx = ranked.indexOf(option.value);
                  const rank = idx >= 0 ? idx + 1 : null;
                  const atMax = ranked.length >= question.max && rank === null;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleRank(option.value)}
                      disabled={atMax}
                      className={`w-full text-left px-5 py-4 rounded-[14px] border transition-all text-sm font-medium ${
                        rank !== null
                          ? "border-sage bg-pale-sage text-sage-700 shadow-1"
                          : atMax
                          ? "border-sage-mist-2 bg-chalk text-charcoal-3 cursor-not-allowed"
                          : "border-sage-mist-2 bg-chalk text-charcoal hover:border-sage-mist hover:shadow-1"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                            rank !== null
                              ? "border-sage bg-sage text-chalk"
                              : "border-sage-mist text-transparent"
                          }`}
                        >
                          {rank ?? ""}
                        </span>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-charcoal-2 mt-4 text-center">
                {((answers.values as string[] | undefined) ?? []).length} of{" "}
                {question.max} ranked
              </p>
            </>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="border-t border-sage-mist-2 bg-chalk">
        <div className="max-w-lg mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0 || saving}
            className="px-4 py-2.5 text-sm font-medium text-charcoal-2 hover:text-charcoal disabled:opacity-30 transition-colors"
          >
            &larr; Back
          </button>

          <Button
            onClick={isLast ? handleSubmit : handleNext}
            disabled={!canProceed || saving}
            variant="primary"
            size="md"
          >
            {isLast ? (saving ? "Saving…" : "Show my matches →") : "Next →"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function isAnswered(question: Question, answers: Answers): boolean {
  const value = answers[question.id];
  if (question.type === "single") {
    return typeof value === "string" && value.length > 0;
  }
  if (question.type === "multi") {
    return Array.isArray(value) && value.length >= 1;
  }
  return Array.isArray(value) && value.length === question.max;
}
