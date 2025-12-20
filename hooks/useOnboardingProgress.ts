"use client";

import { usePathname } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import {
  getStepByRoute,
  calculatePhaseProgress,
  calculateOverallProgress,
  PHASE_PROGRESS,
  OnboardingPhase,
  type OnboardingStep,
} from '@/lib/progress/onboarding-progress.config';

export interface ProgressInfo {
  currentStep: OnboardingStep | null;
  phaseProgress: number; // Percentage within current phase (0-100)
  overallProgress: number; // Overall percentage across all steps (0-100)
  phaseInfo: {
    current: number;
    total: number;
    percentage: number;
  } | null;
  stepInfo: {
    current: number;
    total: number;
  } | null;
}

/**
 * Hook to get current onboarding progress
 * Automatically detects current route and calculates progress
 * Uses client-side only to prevent hydration mismatches
 */
export function useOnboardingProgress(): ProgressInfo {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const progressInfo = useMemo(() => {
    // During SSR or before client hydration, return default values
    if (!isClient || !pathname) {
      return {
        currentStep: null,
        phaseProgress: 0,
        overallProgress: 0,
        phaseInfo: null,
        stepInfo: null,
      };
    }

    const currentStep = getStepByRoute(pathname);

    if (!currentStep) {
      return {
        currentStep: null,
        phaseProgress: 0,
        overallProgress: 0,
        phaseInfo: null,
        stepInfo: null,
      };
    }

    const phaseProgress = calculatePhaseProgress(currentStep);
    const overallProgress = calculateOverallProgress(currentStep);
    const phaseInfo = PHASE_PROGRESS[currentStep.phase] || null;
    const stepInfo = {
      current: currentStep.stepNumber,
      total: currentStep.totalStepsInPhase,
    };

    return {
      currentStep,
      phaseProgress,
      overallProgress,
      phaseInfo,
      stepInfo,
    };
  }, [pathname, isClient]);

  return progressInfo;
}
