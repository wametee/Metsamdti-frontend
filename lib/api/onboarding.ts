import { apiClient } from "./client";

export interface OnboardingStepData {
  step: string;
  data: Record<string, any>;
}

export async function saveStep(stepData: OnboardingStepData) {
  const response = await apiClient("user/onboarding/step", {
    method: "POST",
    body: JSON.stringify(stepData),
  });
  return response.json();
}

export async function completeProfile() {
  const response = await apiClient("user/onboarding/finish", {
    method: "POST",
  });
  return response.json();
}

export async function getOnboardingProgress() {
  const response = await apiClient("user/onboarding/progress", {
    method: "GET",
  });
  return response.json();
}

