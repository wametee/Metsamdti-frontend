"use client";

import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { ONBOARDING_STEPS, STEP_ORDER } from "@/lib/constants";

export function StepIndicator() {
  const { currentStep } = useOnboardingProgress();
  const currentStepIndex = STEP_ORDER[currentStep] - 1;
  const totalSteps = ONBOARDING_STEPS.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {ONBOARDING_STEPS.map((step, index) => (
          <div
            key={step}
            className={`text-xs ${
              index <= currentStepIndex ? "text-blue-600" : "text-gray-400"
            }`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-2 bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

