// App constants
export const ONBOARDING_STEPS = [
  "photos",
  "basics",
  "preferences",
  "questionnaire",
  "complete",
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export const STEP_ORDER: Record<OnboardingStep, number> = {
  photos: 1,
  basics: 2,
  preferences: 3,
  questionnaire: 4,
  complete: 5,
};

export const MATCH_WINDOW_DEFAULT_HOURS = 4;
export const CHAT_EXPIRY_BUFFER_MINUTES = 5;


