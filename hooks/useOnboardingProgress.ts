"use client";

import { useState, useEffect } from "react";
import { ONBOARDING_STEPS, type OnboardingStep } from "@/lib/constants";

export function useOnboardingProgress() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("photos");

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("onboardingStep");
    if (saved && ONBOARDING_STEPS.includes(saved as OnboardingStep)) {
      setCurrentStep(saved as OnboardingStep);
    }
  }, []);

  const updateStep = (step: OnboardingStep) => {
    setCurrentStep(step);
    localStorage.setItem("onboardingStep", step);
  };

  return {
    currentStep,
    updateStep,
  };
}

