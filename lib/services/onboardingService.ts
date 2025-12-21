import httpClient from "../httpClient";
import {
  getOnboardingData,
  saveOnboardingData,
  clearOnboardingData,
  type OnboardingData,
} from "../utils/localStorage";

/**
 * Onboarding Service
 * Handles all API calls related to onboarding flow
 */

export interface SubmitBasicsRequest {
  displayName: string;
  fullName: string;
  age: number;
  photos?: File[];
}

export interface SubmitBackgroundSeriesOneRequest {
  birthday: string;
  gender: string;
  languages: string[];
}

export interface SubmitBackgroundSeriesTwoRequest {
  currentLocation: string;
  livingSituation: string;
  birthLocation: string;
}

export interface SubmitBackgroundSeriesThreeRequest {
  education: string;
  occupation: string;
}

export interface SubmitBackgroundSeriesFourRequest {
  previouslyMarried: boolean;
  hasChildren: boolean;
}

export interface SubmitBackgroundSeriesFiveRequest {
  openToPartnerWithChildren: boolean;
  preferredAgeRange: { min: number; max: number };
  idealMarriageTimeline: string;
}

export interface SubmitBackgroundSeriesSixRequest {
  weekendActivities: string;
  coreValues: string[];
  conflictHandling: string;
}

export interface SubmitBackgroundSeriesSevenRequest {
  loveLanguage: string;
  oneThingToUnderstand: string;
}

export interface SubmitBackgroundSeriesEightRequest {
  faithImportance: string;
  genderRolesInMarriage: string;
}

export interface SubmitBackgroundSeriesNineRequest {
  preferOwnBackground: boolean;
  futureFamilyVision: string;
  biggestDealBreaker: string;
}

export interface SubmitEmotionalSeriesOneRequest {
  emotionalBalance: string;
  conflictEmotionalResponse: string;
  decisionMakingGuide: string;
}

export interface SubmitEmotionalSeriesTwoRequest {
  preferredEmotionalEnergy: string;
  feelsLoved: string;
  deepConnection: string;
}

export interface SubmitEmotionalSeriesThreeRequest {
  confidenceMoments: string;
  showLove: string;
}

export interface SubmitEmotionalSeriesFourRequest {
  disagreementResponse: string;
  lovedOneUpsetResponse: string;
  refillEmotionalEnergy: string;
}

export interface SubmitEmotionalSeriesFiveRequest {
  communicationStyle: string;
  lifeApproach: string;
  valuedRelationship: string;
}

export interface CompleteApplicationRequest {
  email: string;
  password: string;
}

export interface OnboardingResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class OnboardingService {
  /**
   * Submit basics (display name, full name, age, photos)
   */
  async submitBasics(data: SubmitBasicsRequest): Promise<OnboardingResponse> {
    try {
      // Save to localStorage first
      saveOnboardingData({
        displayName: data.displayName,
        fullName: data.fullName,
        age: data.age,
      });

      // If photos are provided, upload them first
      let photoUrls: string[] = [];
      if (data.photos && data.photos.length > 0) {
        const formData = new FormData();
        data.photos.forEach((photo) => {
          formData.append("uploaded_file", photo);
        });

        const uploadResponse = await httpClient.post("/onboarding/upload-photos", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        photoUrls = uploadResponse.data.urls || [];
        saveOnboardingData({ photos: photoUrls });
      }

      // Submit to backend
      const response = await httpClient.post("/onboarding/basics", {
        displayName: data.displayName,
        fullName: data.fullName,
        age: data.age,
        photos: photoUrls,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to submit basics",
      };
    }
  }

  /**
   * Submit background series one
   */
  async submitBackgroundSeriesOne(
    data: SubmitBackgroundSeriesOneRequest
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post("/onboarding/background-series-one", data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series two
   */
  async submitBackgroundSeriesTwo(
    data: SubmitBackgroundSeriesTwoRequest
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post("/onboarding/background-series-two", data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series three
   */
  async submitBackgroundSeriesThree(
    data: SubmitBackgroundSeriesThreeRequest
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post("/onboarding/background-series-three", data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series four
   */
  async submitBackgroundSeriesFour(
    data: SubmitBackgroundSeriesFourRequest
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post("/onboarding/background-series-four", data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series five
   */
  async submitBackgroundSeriesFive(
    data: SubmitBackgroundSeriesFiveRequest
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post("/onboarding/background-series-five", data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series six
   */
  async submitBackgroundSeriesSix(
    data: SubmitBackgroundSeriesSixRequest
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post("/onboarding/background-series-six", data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series seven
   */
  async submitBackgroundSeriesSeven(
    data: SubmitBackgroundSeriesSevenRequest
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post("/onboarding/background-series-seven", data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series eight
   */
  async submitBackgroundSeriesEight(
    data: SubmitBackgroundSeriesEightRequest
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post("/onboarding/background-series-eight", data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series nine
   */
  async submitBackgroundSeriesNine(
    data: SubmitBackgroundSeriesNineRequest
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post("/onboarding/background-series-nine", data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit emotional series one
   */
  async submitEmotionalSeriesOne(
    data: SubmitEmotionalSeriesOneRequest
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post("/onboarding/emotional-series-one", data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit emotional series two
   */
  async submitEmotionalSeriesTwo(
    data: SubmitEmotionalSeriesTwoRequest
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post("/onboarding/emotional-series-two", data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit emotional series three
   */
  async submitEmotionalSeriesThree(
    data: SubmitEmotionalSeriesThreeRequest
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post("/onboarding/emotional-series-three", data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit emotional series four
   */
  async submitEmotionalSeriesFour(
    data: SubmitEmotionalSeriesFourRequest
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post("/onboarding/emotional-series-four", data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit emotional series five
   */
  async submitEmotionalSeriesFive(
    data: SubmitEmotionalSeriesFiveRequest
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post("/onboarding/emotional-series-five", data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Complete application - submit all data and create account
   */
  async completeApplication(data: CompleteApplicationRequest): Promise<OnboardingResponse> {
    try {
      // Get all saved data from localStorage
      const allData = getOnboardingData();
      if (!allData) {
        return { success: false, message: "No onboarding data found" };
      }

      // Submit everything to backend
      const response = await httpClient.post("/onboarding/complete", {
        ...allData,
        email: data.email,
        password: data.password, // Backend will handle encryption
      });

      // Clear localStorage after successful submission
      clearOnboardingData();

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to complete application",
      };
    }
  }

  /**
   * Get saved onboarding data (for resuming)
   */
  getSavedData(): OnboardingData | null {
    return getOnboardingData();
  }
}

export default new OnboardingService();








