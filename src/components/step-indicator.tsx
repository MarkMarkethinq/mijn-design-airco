"use client";

import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: { key: string; label: string }[];
  currentStep: string;
  completedSteps: string[];
  onNavigate: (step: string) => void;
}

export default function StepIndicator({ steps, currentStep, completedSteps, onNavigate }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => {
        const isCurrent = step.key === currentStep;
        const isCompleted = completedSteps.includes(step.key);
        const isClickable = isCompleted && !isCurrent;

        return (
          <div key={step.key} className="flex items-center">
            {i > 0 && (
              <div
                className={cn(
                  "w-8 h-px mx-1",
                  isCompleted || isCurrent ? "bg-mda-accent" : "bg-border"
                )}
              />
            )}
            <button
              onClick={() => isClickable && onNavigate(step.key)}
              disabled={!isClickable}
              className={cn(
                "flex items-center gap-2 text-sm transition-colors duration-200",
                "px-3 py-1.5 rounded-full",
                isCurrent && "bg-[rgba(122,158,159,0.18)] text-mda-accent font-semibold",
                isCompleted && !isCurrent && "text-mda-text cursor-pointer hover:bg-[rgba(61,43,31,0.04)]",
                !isCompleted && !isCurrent && "text-mda-text-muted cursor-default"
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full shrink-0 transition-colors duration-200",
                  isCurrent && "bg-mda-accent",
                  isCompleted && !isCurrent && "bg-mda-accent",
                  !isCompleted && !isCurrent && "bg-border ring-1 ring-border"
                )}
              />
              {step.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}
