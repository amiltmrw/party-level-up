"use client";

import { Check } from "lucide-react";

const STEPS = [
  { id: 1, label: "Spirits" },
  { id: 2, label: "Mixers" },
  { id: 3, label: "Extras" },
];

interface StepWizardProps {
  currentStep: number;
  counts: [number, number, number];
}

export default function StepWizard({ currentStep, counts }: StepWizardProps) {
  return (
    <div className="flex items-start justify-center w-full">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        const count = counts[index];

        return (
          <div key={step.id} className="flex items-start">
            {/* Step node + label */}
            <div className="flex flex-col items-center gap-2 w-20">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-brand-violet border-brand-violet text-white"
                    : isActive
                    ? "bg-brand-violet/15 border-brand-violet text-brand-violet shadow-glow-violet"
                    : "bg-brand-surface border-brand-border text-brand-muted"
                }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : step.id}
              </div>
              <div className="text-center">
                <p className={`text-xs font-bold tracking-wide transition-colors ${
                  isActive ? "text-brand-violet" : isCompleted ? "text-brand-text" : "text-brand-muted"
                }`}>
                  {step.label}
                </p>
                {count > 0 && (
                  <p className="text-[10px] text-brand-muted mt-0.5">
                    {count} selected
                  </p>
                )}
              </div>
            </div>

            {/* Connector */}
            {index < STEPS.length - 1 && (
              <div className="w-16 mt-5 mx-1">
                <div className={`h-0.5 rounded-full transition-all duration-500 ${
                  currentStep > step.id ? "bg-brand-violet/70" : "bg-brand-border"
                }`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
