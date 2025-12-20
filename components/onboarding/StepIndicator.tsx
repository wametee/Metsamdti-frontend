"use client";

import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { ONBOARDING_STEPS } from "@/lib/progress/onboarding-progress.config";

export function StepIndicator() {
  const { currentStep, stepInfo } = useOnboardingProgress();
  
  // Use stepInfo if available, otherwise calculate from currentStep
  const currentStepIndex = currentStep 
    ? ONBOARDING_STEPS.findIndex(step => step.route === currentStep.route)
    : -1;
  const totalSteps = ONBOARDING_STEPS.length;
  const progress = currentStepIndex >= 0 
    ? ((currentStepIndex + 1) / totalSteps) * 100 
    : 0;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {ONBOARDING_STEPS.map((step, index) => (
          <div
            key={step.route}
            className={`text-xs ${
              index <= currentStepIndex ? "text-blue-600" : "text-gray-400"
            }`}
          >
            {step.label}
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

