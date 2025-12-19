import httpClient from "@/lib/httpClient";
import {
  saveOnboardingData,
  getOnboardingData,
  clearOnboardingData,
  type OnboardingData,
} from "@/lib/utils/localStorage";

/**
 * Onboarding Service
 * Handles all API calls related to onboarding flow
 * All methods save to localStorage before submitting to backend
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
  sessionId?: string;
}

class OnboardingService {
  /**
   * Submit basics (display name, full name, age, photos)
   */
  async submitBasics(data: SubmitBasicsRequest, sessionId: string): Promise<OnboardingResponse> {
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
      const response = await httpClient.post(
        "/onboarding/basics",
        {
          displayName: data.displayName,
          fullName: data.fullName,
          age: data.age,
          photos: photoUrls,
        },
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );

      return {
        success: true,
        data: response.data,
        sessionId: response.data.sessionId || sessionId,
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
    data: SubmitBackgroundSeriesOneRequest,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-one",
        data,
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );
      return { success: true, data: response.data, sessionId: response.data.sessionId || sessionId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series two
   */
  async submitBackgroundSeriesTwo(
    data: SubmitBackgroundSeriesTwoRequest,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-two",
        data,
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );
      return { success: true, data: response.data, sessionId: response.data.sessionId || sessionId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series three
   */
  async submitBackgroundSeriesThree(
    data: SubmitBackgroundSeriesThreeRequest,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-three",
        data,
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );
      return { success: true, data: response.data, sessionId: response.data.sessionId || sessionId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series four
   */
  async submitBackgroundSeriesFour(
    data: SubmitBackgroundSeriesFourRequest,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-four",
        data,
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );
      return { success: true, data: response.data, sessionId: response.data.sessionId || sessionId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series five
   */
  async submitBackgroundSeriesFive(
    data: SubmitBackgroundSeriesFiveRequest,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-five",
        data,
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );
      return { success: true, data: response.data, sessionId: response.data.sessionId || sessionId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series six
   */
  async submitBackgroundSeriesSix(
    data: SubmitBackgroundSeriesSixRequest,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-six",
        data,
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );
      return { success: true, data: response.data, sessionId: response.data.sessionId || sessionId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series seven
   */
  async submitBackgroundSeriesSeven(
    data: SubmitBackgroundSeriesSevenRequest,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-seven",
        data,
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );
      return { success: true, data: response.data, sessionId: response.data.sessionId || sessionId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series eight
   */
  async submitBackgroundSeriesEight(
    data: SubmitBackgroundSeriesEightRequest,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-eight",
        data,
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );
      return { success: true, data: response.data, sessionId: response.data.sessionId || sessionId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series nine
   */
  async submitBackgroundSeriesNine(
    data: SubmitBackgroundSeriesNineRequest,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-nine",
        data,
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );
      return { success: true, data: response.data, sessionId: response.data.sessionId || sessionId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit emotional series one
   */
  async submitEmotionalSeriesOne(
    data: SubmitEmotionalSeriesOneRequest,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/emotional-series-one",
        data,
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );
      return { success: true, data: response.data, sessionId: response.data.sessionId || sessionId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit emotional series two
   */
  async submitEmotionalSeriesTwo(
    data: SubmitEmotionalSeriesTwoRequest,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/emotional-series-two",
        data,
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );
      return { success: true, data: response.data, sessionId: response.data.sessionId || sessionId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit emotional series three
   */
  async submitEmotionalSeriesThree(
    data: SubmitEmotionalSeriesThreeRequest,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/emotional-series-three",
        data,
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );
      return { success: true, data: response.data, sessionId: response.data.sessionId || sessionId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit emotional series four
   */
  async submitEmotionalSeriesFour(
    data: SubmitEmotionalSeriesFourRequest,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/emotional-series-four",
        data,
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );
      return { success: true, data: response.data, sessionId: response.data.sessionId || sessionId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit emotional series five
   */
  async submitEmotionalSeriesFive(
    data: SubmitEmotionalSeriesFiveRequest,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/emotional-series-five",
        data,
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );
      return { success: true, data: response.data, sessionId: response.data.sessionId || sessionId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Complete application - submit all data and create account
   */
  async completeApplication(
    data: CompleteApplicationRequest,
    sessionId: string
  ): Promise<OnboardingResponse> {
    try {
      // Get all saved data from localStorage
      const allData = getOnboardingData();
      if (!allData) {
        return { success: false, message: "No onboarding data found" };
      }

      // Submit everything to backend
      const response = await httpClient.post(
        "/onboarding/complete",
        {
          ...allData,
          email: data.email,
          password: data.password, // Backend will handle encryption
        },
        {
          headers: {
            "X-Session-ID": sessionId,
          },
        }
      );

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

