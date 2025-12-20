/**
 * Onboarding Progress Configuration
 * Defines all onboarding steps and their progress values
 */

export enum OnboardingPhase {
  START = 'start',              // Thankyou page - beginning
  PROFILE = 'profile',           // Background + Personality + Emotional evaluation
  COMPLETE_APPLICATION = 'complete', // Signup details
  COMPLETED = 'completed',      // Match-time - completion
}

export interface OnboardingStep {
  route: string;
  phase: OnboardingPhase;
  stepNumber: number;
  totalStepsInPhase: number;
  label: string;
}

/**
 * All onboarding steps in order
 */
export const ONBOARDING_STEPS: OnboardingStep[] = [
  // Phase 0: Start
  { route: '/onboarding/thankyou', phase: OnboardingPhase.START, stepNumber: 1, totalStepsInPhase: 1, label: 'Start' },
  
  // Phase 1: Profile Phase - Basics (Step 1)
  { route: '/onboarding/basics', phase: OnboardingPhase.PROFILE, stepNumber: 1, totalStepsInPhase: 15, label: 'Basics' },
  
  // Phase 1: Profile Phase (Background Series) - Steps 2-10
  { route: '/onboarding/background-series-one', phase: OnboardingPhase.PROFILE, stepNumber: 2, totalStepsInPhase: 15, label: 'Background & Identity' },
  { route: '/onboarding/background-series-two', phase: OnboardingPhase.PROFILE, stepNumber: 3, totalStepsInPhase: 15, label: 'Background & Identity' },
  { route: '/onboarding/background-series-three', phase: OnboardingPhase.PROFILE, stepNumber: 4, totalStepsInPhase: 15, label: 'Background & Identity' },
  { route: '/onboarding/background-series-four', phase: OnboardingPhase.PROFILE, stepNumber: 5, totalStepsInPhase: 15, label: 'Background & Identity' },
  { route: '/onboarding/background-series-five', phase: OnboardingPhase.PROFILE, stepNumber: 6, totalStepsInPhase: 15, label: 'Background & Identity' },
  { route: '/onboarding/background-series-six', phase: OnboardingPhase.PROFILE, stepNumber: 7, totalStepsInPhase: 15, label: 'Background & Identity' },
  { route: '/onboarding/background-series-seven', phase: OnboardingPhase.PROFILE, stepNumber: 8, totalStepsInPhase: 15, label: 'Background & Identity' },
  { route: '/onboarding/background-series-eight', phase: OnboardingPhase.PROFILE, stepNumber: 9, totalStepsInPhase: 15, label: 'Background & Identity' },
  { route: '/onboarding/background-series-nine', phase: OnboardingPhase.PROFILE, stepNumber: 10, totalStepsInPhase: 15, label: 'Background & Identity' },
  
  // Phase 1: Profile Phase (Emotional Series) - Steps 11-15
  { route: '/onboarding/emotional-series-one', phase: OnboardingPhase.PROFILE, stepNumber: 11, totalStepsInPhase: 15, label: 'Emotional Evaluation' },
  { route: '/onboarding/emotional-series-two', phase: OnboardingPhase.PROFILE, stepNumber: 12, totalStepsInPhase: 15, label: 'Emotional Evaluation' },
  { route: '/onboarding/emotional-series-three', phase: OnboardingPhase.PROFILE, stepNumber: 13, totalStepsInPhase: 15, label: 'Emotional Evaluation' },
  { route: '/onboarding/emotional-series-four', phase: OnboardingPhase.PROFILE, stepNumber: 14, totalStepsInPhase: 15, label: 'Emotional Evaluation' },
  { route: '/onboarding/emotional-series-five', phase: OnboardingPhase.PROFILE, stepNumber: 15, totalStepsInPhase: 15, label: 'Emotional Evaluation' },
  
  // Phase 1: Milestone (GreatStart - shows 1/3 after profile phase, uses PhaseProgressBar not StepProgressBar)
  { route: '/onboarding/great-start', phase: OnboardingPhase.PROFILE, stepNumber: 15, totalStepsInPhase: 15, label: 'Great Start' },
  
  // Phase 2: Complete Application
  { route: '/onboarding/complete', phase: OnboardingPhase.COMPLETE_APPLICATION, stepNumber: 1, totalStepsInPhase: 1, label: 'Complete Application' },
  { route: '/onboarding/complete-application', phase: OnboardingPhase.COMPLETE_APPLICATION, stepNumber: 1, totalStepsInPhase: 1, label: 'Complete Application' },
  { route: '/signup', phase: OnboardingPhase.COMPLETE_APPLICATION, stepNumber: 1, totalStepsInPhase: 1, label: 'Complete Application' },
  
  // Phase 3: Completed (Match-time)
  { route: '/match-time', phase: OnboardingPhase.COMPLETED, stepNumber: 1, totalStepsInPhase: 1, label: 'Completed' },
];

/**
 * Phase progress configuration
 * Shows progress as 0/3, 1/3, 2/3, 3/3
 */
export const PHASE_PROGRESS = {
  [OnboardingPhase.START]: { current: 0, total: 3, percentage: 0 },
  [OnboardingPhase.PROFILE]: { current: 1, total: 3, percentage: 33.33 },
  [OnboardingPhase.COMPLETE_APPLICATION]: { current: 2, total: 3, percentage: 66.66 },
  [OnboardingPhase.COMPLETED]: { current: 3, total: 3, percentage: 100 },
};

/**
 * Get step by route
 */
export function getStepByRoute(route: string): OnboardingStep | undefined {
  return ONBOARDING_STEPS.find(step => step.route === route);
}

/**
 * Get current step index
 */
export function getStepIndex(route: string): number {
  const index = ONBOARDING_STEPS.findIndex(step => step.route === route);
  return index >= 0 ? index : 0;
}

/**
 * Calculate progress percentage for a step within its phase
 */
export function calculatePhaseProgress(step: OnboardingStep): number {
  if (step.phase === OnboardingPhase.COMPLETED) {
    return 100;
  }
  if (step.phase === OnboardingPhase.START) {
    return 0;
  }
  return (step.stepNumber / step.totalStepsInPhase) * 100;
}

/**
 * Calculate overall progress across all phases
 */
export function calculateOverallProgress(step: OnboardingStep): number {
  const stepIndex = getStepIndex(step.route);
  const totalSteps = ONBOARDING_STEPS.length;
  return ((stepIndex + 1) / totalSteps) * 100;
}

/**
 * Get previous phase's progress percentage
 * Used to show previous progress as background in rounded progress bars
 */
export function getPreviousPhaseProgress(currentPhase: OnboardingPhase): number {
  const phaseOrder = [
    OnboardingPhase.START,
    OnboardingPhase.PROFILE,
    OnboardingPhase.COMPLETE_APPLICATION,
    OnboardingPhase.COMPLETED,
  ];
  
  const currentIndex = phaseOrder.indexOf(currentPhase);
  if (currentIndex <= 0) {
    return 0; // No previous phase for START
  }
  
  const previousPhase = phaseOrder[currentIndex - 1];
  return PHASE_PROGRESS[previousPhase]?.percentage || 0;
}

