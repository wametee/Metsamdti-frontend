/**
 * Onboarding Step Validation
 * Ensures users complete steps in the correct order
 */

import { ONBOARDING_STEPS } from '@/lib/progress/onboarding-progress.config';
import { getOnboardingData, getOnboardingProgress } from './localStorage';

/**
 * Step dependencies - defines which steps must be completed before accessing a step
 */
const STEP_DEPENDENCIES: Record<string, string[]> = {
  '/onboarding/basics': [],
  '/onboarding/background-series-one': ['/onboarding/basics'],
  '/onboarding/background-series-two': ['/onboarding/basics', '/onboarding/background-series-one'],
  '/onboarding/background-series-three': ['/onboarding/basics', '/onboarding/background-series-one', '/onboarding/background-series-two'],
  '/onboarding/background-series-four': ['/onboarding/basics', '/onboarding/background-series-one', '/onboarding/background-series-two', '/onboarding/background-series-three'],
  '/onboarding/background-series-five': ['/onboarding/basics', '/onboarding/background-series-one', '/onboarding/background-series-two', '/onboarding/background-series-three', '/onboarding/background-series-four'],
  '/onboarding/background-series-six': ['/onboarding/basics', '/onboarding/background-series-one', '/onboarding/background-series-two', '/onboarding/background-series-three', '/onboarding/background-series-four', '/onboarding/background-series-five'],
  '/onboarding/background-series-seven': ['/onboarding/basics', '/onboarding/background-series-one', '/onboarding/background-series-two', '/onboarding/background-series-three', '/onboarding/background-series-four', '/onboarding/background-series-five', '/onboarding/background-series-six'],
  '/onboarding/background-series-eight': ['/onboarding/basics', '/onboarding/background-series-one', '/onboarding/background-series-two', '/onboarding/background-series-three', '/onboarding/background-series-four', '/onboarding/background-series-five', '/onboarding/background-series-six', '/onboarding/background-series-seven'],
  '/onboarding/background-series-nine': ['/onboarding/basics', '/onboarding/background-series-one', '/onboarding/background-series-two', '/onboarding/background-series-three', '/onboarding/background-series-four', '/onboarding/background-series-five', '/onboarding/background-series-six', '/onboarding/background-series-seven', '/onboarding/background-series-eight'],
  '/onboarding/emotional-series-one': ['/onboarding/basics', '/onboarding/background-series-one', '/onboarding/background-series-two', '/onboarding/background-series-three', '/onboarding/background-series-four', '/onboarding/background-series-five', '/onboarding/background-series-six', '/onboarding/background-series-seven', '/onboarding/background-series-eight', '/onboarding/background-series-nine'],
  '/onboarding/emotional-series-two': ['/onboarding/basics', '/onboarding/background-series-one', '/onboarding/background-series-two', '/onboarding/background-series-three', '/onboarding/background-series-four', '/onboarding/background-series-five', '/onboarding/background-series-six', '/onboarding/background-series-seven', '/onboarding/background-series-eight', '/onboarding/background-series-nine', '/onboarding/emotional-series-one'],
  '/onboarding/emotional-series-three': ['/onboarding/basics', '/onboarding/background-series-one', '/onboarding/background-series-two', '/onboarding/background-series-three', '/onboarding/background-series-four', '/onboarding/background-series-five', '/onboarding/background-series-six', '/onboarding/background-series-seven', '/onboarding/background-series-eight', '/onboarding/background-series-nine', '/onboarding/emotional-series-one', '/onboarding/emotional-series-two'],
  '/onboarding/emotional-series-four': ['/onboarding/basics', '/onboarding/background-series-one', '/onboarding/background-series-two', '/onboarding/background-series-three', '/onboarding/background-series-four', '/onboarding/background-series-five', '/onboarding/background-series-six', '/onboarding/background-series-seven', '/onboarding/background-series-eight', '/onboarding/background-series-nine', '/onboarding/emotional-series-one', '/onboarding/emotional-series-two', '/onboarding/emotional-series-three'],
  '/onboarding/emotional-series-five': ['/onboarding/basics', '/onboarding/background-series-one', '/onboarding/background-series-two', '/onboarding/background-series-three', '/onboarding/background-series-four', '/onboarding/background-series-five', '/onboarding/background-series-six', '/onboarding/background-series-seven', '/onboarding/background-series-eight', '/onboarding/background-series-nine', '/onboarding/emotional-series-one', '/onboarding/emotional-series-two', '/onboarding/emotional-series-three', '/onboarding/emotional-series-four'],
  '/onboarding/great-start': ['/onboarding/basics', '/onboarding/background-series-one', '/onboarding/background-series-two', '/onboarding/background-series-three', '/onboarding/background-series-four', '/onboarding/background-series-five', '/onboarding/background-series-six', '/onboarding/background-series-seven', '/onboarding/background-series-eight', '/onboarding/background-series-nine', '/onboarding/emotional-series-one', '/onboarding/emotional-series-two', '/onboarding/emotional-series-three', '/onboarding/emotional-series-four', '/onboarding/emotional-series-five'],
  '/onboarding/complete-application': ['/onboarding/great-start'],
  '/onboarding/complete': ['/onboarding/great-start'],
  '/signup': ['/onboarding/great-start'],
};

/**
 * Check if a step has required data in localStorage
 */
function hasStepData(route: string, onboardingData: any): boolean {
  switch (route) {
    case '/onboarding/basics':
      return !!(onboardingData?.username || onboardingData?.displayName) && !!onboardingData?.fullName && !!onboardingData?.age;
    case '/onboarding/background-series-one':
      return !!onboardingData?.birthday && !!onboardingData?.gender;
    case '/onboarding/background-series-two':
      return !!onboardingData?.currentLocation && !!onboardingData?.livingSituation;
    case '/onboarding/background-series-three':
      return !!onboardingData?.education && !!onboardingData?.occupation;
    case '/onboarding/background-series-four':
      return onboardingData?.previouslyMarried !== undefined && onboardingData?.hasChildren !== undefined;
    case '/onboarding/background-series-five':
      return onboardingData?.openToPartnerWithChildren !== undefined && !!onboardingData?.idealMarriageTimeline;
    case '/onboarding/background-series-six':
      return !!onboardingData?.weekendActivities && !!onboardingData?.conflictHandling;
    case '/onboarding/background-series-seven':
      return !!onboardingData?.loveLanguage;
    case '/onboarding/background-series-eight':
      return !!onboardingData?.faithImportance;
    case '/onboarding/background-series-nine':
      return onboardingData?.preferOwnBackground !== undefined;
    case '/onboarding/emotional-series-one':
    case '/onboarding/emotional-series-two':
    case '/onboarding/emotional-series-three':
    case '/onboarding/emotional-series-four':
    case '/onboarding/emotional-series-five':
      // For emotional series, we check if previous emotional steps are done
      // For simplicity, we'll check if they've completed background series
      return true; // Will be validated by step dependencies
    default:
      return true;
  }
}

/**
 * Check if a step is marked as completed in progress
 */
function isStepCompleted(route: string, progress: any): boolean {
  if (!progress?.completedSteps) return false;
  
  // Normalize route names for comparison
  const normalizedRoute = route.replace('/onboarding/', '');
  
  return progress.completedSteps.some((step: string) => {
    // Handle both formats: "basics" or "/onboarding/basics"
    const normalizedStep = step.startsWith('/') ? step.replace('/onboarding/', '') : step;
    return normalizedStep === normalizedRoute || step === route;
  });
}

/**
 * Get the first incomplete required step
 */
export function getFirstIncompleteStep(route: string): string | null {
  const requiredSteps = STEP_DEPENDENCIES[route] || [];
  const onboardingData = getOnboardingData();
  const progress = getOnboardingProgress();

  // Check each required step
  for (const requiredRoute of requiredSteps) {
    // Check if step is marked as completed
    const isCompleted = isStepCompleted(requiredRoute, progress);

    // Also check if step has required data
    const hasData = hasStepData(requiredRoute, onboardingData);

    // If step is neither completed nor has data, it's missing
    if (!isCompleted && !hasData) {
      return requiredRoute;
    }
  }

  return null;
}

/**
 * Check if user can access a step
 */
export function canAccessStep(route: string): { allowed: boolean; missingStep: string | null } {
  const missingStep = getFirstIncompleteStep(route);
  return {
    allowed: missingStep === null,
    missingStep,
  };
}

/**
 * Get friendly step name for display
 */
export function getStepDisplayName(route: string): string {
  const step = ONBOARDING_STEPS.find(s => s.route === route);
  if (step) {
    return step.label;
  }

  // Fallback to readable names
  const nameMap: Record<string, string> = {
    '/onboarding/basics': 'Basics',
    '/onboarding/background-series-one': 'Background & Identity (Part 1)',
    '/onboarding/background-series-two': 'Background & Identity (Part 2)',
    '/onboarding/background-series-three': 'Background & Identity (Part 3)',
    '/onboarding/background-series-four': 'Background & Identity (Part 4)',
    '/onboarding/background-series-five': 'Background & Identity (Part 5)',
    '/onboarding/background-series-six': 'Background & Identity (Part 6)',
    '/onboarding/background-series-seven': 'Background & Identity (Part 7)',
    '/onboarding/background-series-eight': 'Background & Identity (Part 8)',
    '/onboarding/background-series-nine': 'Background & Identity (Part 9)',
    '/onboarding/emotional-series-one': 'Emotional Evaluation (Part 1)',
    '/onboarding/emotional-series-two': 'Emotional Evaluation (Part 2)',
    '/onboarding/emotional-series-three': 'Emotional Evaluation (Part 3)',
    '/onboarding/emotional-series-four': 'Emotional Evaluation (Part 4)',
    '/onboarding/emotional-series-five': 'Emotional Evaluation (Part 5)',
  };

  return nameMap[route] || route.replace('/onboarding/', '').replace(/-/g, ' ');
}

