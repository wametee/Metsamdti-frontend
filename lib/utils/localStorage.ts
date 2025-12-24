/**
 * LocalStorage Utilities
 * Handles onboarding data persistence with type safety
 */

const ONBOARDING_STORAGE_KEY = "metsamdti_onboarding_data";
const ONBOARDING_PROGRESS_KEY = "metsamdti_onboarding_progress";

export interface OnboardingData {
  // Basics
  username?: string;
  displayName?: string; // Keep for backward compatibility
  fullName?: string;
  age?: number;
  photos?: string[];

  // Background Series One
  birthday?: string;
  gender?: string;
  languages?: string[];

  // Background Series Two
  currentLocation?: string;
  livingSituation?: string;
  birthLocation?: string;

  // Background Series Three
  education?: string;
  occupation?: string;

  // Background Series Four
  previouslyMarried?: boolean;
  hasChildren?: boolean;
  preferNotToSay?: boolean;

  // Background Series Five
  openToPartnerWithChildren?: boolean;
  preferredAgeRange?: { min: number; max: number };
  idealMarriageTimeline?: string;

  // Background Series Six
  weekendActivities?: string;
  coreValues?: string[];
  conflictHandling?: string;

  // Background Series Seven
  loveLanguage?: string;
  oneThingToUnderstand?: string;

  // Background Series Eight
  faithImportance?: string;
  genderRolesInMarriage?: string;

  // Background Series Nine
  preferOwnBackground?: boolean;
  futureFamilyVision?: string;
  biggestDealBreaker?: string;

  // Emotional Series One
  emotionalBalance?: string;
  conflictEmotionalResponse?: string;
  decisionMakingGuide?: string;

  // Emotional Series Two
  preferredEmotionalEnergy?: string;
  feelsLoved?: string;
  deepConnection?: string;

  // Emotional Series Three
  confidenceMoments?: string;
  showLove?: string;

  // Emotional Series Four
  disagreementResponse?: string;
  lovedOneUpsetResponse?: string;
  refillEmotionalEnergy?: string;

  // Emotional Series Five
  communicationStyle?: string;
  lifeApproach?: string;
  valuedRelationship?: string;

  // Complete Application
  email?: string;
  password?: string; // Will be encrypted before storage
}

export interface OnboardingProgress {
  currentStep: string;
  completedSteps: string[];
  startedAt: string;
  lastUpdated: string;
}

/**
 * Get all onboarding data from localStorage
 */
export function getOnboardingData(): OnboardingData | null {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading onboarding data from localStorage:", error);
    return null;
  }
}

/**
 * Save onboarding data to localStorage
 */
export function saveOnboardingData(data: Partial<OnboardingData>): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getOnboardingData() || {};
    const updated = { ...existing, ...data };
    // If username is provided, also save as displayName for backward compatibility
    if (data.username && !data.displayName) {
      updated.displayName = data.username;
    }
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving onboarding data to localStorage:", error);
  }
}

/**
 * Clear all onboarding data
 */
export function clearOnboardingData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  localStorage.removeItem(ONBOARDING_PROGRESS_KEY);
}

/**
 * Get onboarding progress
 */
export function getOnboardingProgress(): OnboardingProgress | null {
  if (typeof window === "undefined") return null;

  try {
    const progress = localStorage.getItem(ONBOARDING_PROGRESS_KEY);
    return progress ? JSON.parse(progress) : null;
  } catch (error) {
    console.error("Error reading onboarding progress:", error);
    return null;
  }
}

/**
 * Update onboarding progress
 */
export function updateOnboardingProgress(step: string): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getOnboardingProgress() || {
      currentStep: step,
      completedSteps: [],
      startedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    const updated: OnboardingProgress = {
      ...existing,
      currentStep: step,
      completedSteps: existing.completedSteps.includes(step)
        ? existing.completedSteps
        : [...existing.completedSteps, step],
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(ONBOARDING_PROGRESS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error updating onboarding progress:", error);
  }
}

/**
 * Get the next step in the onboarding flow
 */
export function getNextStep(currentStep: string): string | null {
  const stepOrder = [
    "thankyou",
    "basics",
    "background-series-one",
    "background-series-two",
    "background-series-three",
    "background-series-four",
    "background-series-five",
    "background-series-six",
    "background-series-seven",
    "background-series-eight",
    "background-series-nine",
    "emotional-series-one",
    "emotional-series-two",
    "emotional-series-three",
    "emotional-series-four",
    "emotional-series-five",
    "complete-application",
  ];

  const currentIndex = stepOrder.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === stepOrder.length - 1) {
    return null;
  }

  return stepOrder[currentIndex + 1];
}

/**
 * Save form data for Basics page (including photos as base64)
 * This is used to preserve form data during language changes
 */
export function saveBasicsFormData(data: {
  fullName?: string;
  username?: string;
  age?: number | "";
  photos?: (File | undefined)[];
  photoPreviews?: (string | undefined)[];
}): void {
  if (typeof window === "undefined") return;

  try {
    const photosAsBase64: string[] = [];
    
    // Convert File objects to base64 strings for storage
    if (data.photos) {
      const photoPromises = data.photos
        .filter((photo): photo is File => photo !== undefined)
        .map((photo) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.onerror = () => resolve("");
            reader.readAsDataURL(photo);
          });
        });
      
      // Use existing previews if available (faster)
      if (data.photoPreviews) {
        const validPreviews = data.photoPreviews.filter((preview): preview is string => preview !== undefined);
        photosAsBase64.push(...validPreviews);
      } else {
        // Fallback: convert files to base64 (async, but we'll store what we can)
        Promise.all(photoPromises).then((base64Photos) => {
          const existing = getOnboardingData() || {};
          saveOnboardingData({
            ...existing,
            fullName: data.fullName,
            username: data.username,
            age: typeof data.age === "number" ? data.age : undefined,
            photos: base64Photos.filter((p) => p !== ""),
          });
        });
        return; // Early return for async conversion
      }
    }

    // Save immediately with previews (synchronous)
    const existing = getOnboardingData() || {};
    saveOnboardingData({
      ...existing,
      fullName: data.fullName,
      username: data.username,
      age: typeof data.age === "number" ? data.age : undefined,
      photos: photosAsBase64.length > 0 ? photosAsBase64 : existing.photos,
    });
  } catch (error) {
    console.error("Error saving basics form data:", error);
  }
}

/**
 * Restore photos from base64 strings to preview URLs
 * Note: This returns preview URLs, not File objects (File objects can't be restored)
 */
export function restoreBasicsPhotos(base64Strings?: string[]): (string | undefined)[] {
  if (!base64Strings || base64Strings.length === 0) {
    return Array(5).fill(undefined) as (string | undefined)[];
  }
  
  // Pad to 5 slots with undefined
  const restored: (string | undefined)[] = [...base64Strings];
  while (restored.length < 5) {
    restored.push(undefined as string | undefined);
  }
  
  return restored.slice(0, 5);
}




