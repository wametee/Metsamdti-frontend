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
  username: string;
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
  phone?: string;
  phone_country_code?: string;
}

export interface OnboardingResponse {
  success: boolean;
  message?: string;
  data?: any;
  userId?: string; // Changed from sessionId to userId
}

class OnboardingService {
  /**
   * Initialize onboarding - get or create userId
   * For authenticated users: returns their existing userId
   * For anonymous users: creates a new user record and returns userId
   */
  async initializeOnboarding(): Promise<{ success: boolean; userId?: string; message?: string }> {
    try {
      // Check if user is authenticated
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      if (token) {
        try {
          // Try to get current user
          const response = await httpClient.get('/auth/me');
          if (response.data?.user?.id) {
            return {
              success: true,
              userId: response.data.user.id,
            };
          }
        } catch (error) {
          // User not authenticated or error - continue to create anonymous user
          console.log('User not authenticated, creating anonymous user for onboarding');
        }
      }

      // Create anonymous user for onboarding
      const response = await httpClient.post('/onboarding/initialize', {});
      
      // Backend returns { ok: true, userId: string, isNewUser: boolean }
      if (response.data?.ok && response.data?.userId) {
        return {
          success: true,
          userId: response.data.userId,
          isNewUser: response.data.isNewUser || false,
        };
      }
      
      throw new Error('Invalid response from server');
    } catch (error: any) {
      console.error('Error initializing onboarding:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to initialize onboarding';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
  /**
   * Check username availability in real-time
   */
  async checkUsername(username: string): Promise<{ isAvailable: boolean; suggestions: string[] }> {
    try {
      const response = await httpClient.get('/onboarding/check-username', {
        params: { username },
      });

      console.log('Username check API response:', response.data); // Debug log

      return {
        isAvailable: response.data.isAvailable ?? true,
        suggestions: response.data.suggestions || [],
      };
    } catch (error: any) {
      console.error('Error checking username:', error);
      console.error('Error response:', error.response?.data); // Debug log
      // If error, return unavailable with suggestions if provided
      return {
        isAvailable: false,
        suggestions: error.response?.data?.suggestions || [],
      };
    }
  }

  /**
   * Submit basics (display name, full name, age, photos)
   * Now uses userId instead of sessionId
   */
  async submitBasics(data: SubmitBasicsRequest, userId: string): Promise<OnboardingResponse> {
    try {
      // Save to localStorage first
      saveOnboardingData({
        username: data.username,
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
        
        // Add userId to formData or headers
        if (userId) {
          formData.append("userId", userId);
        }

        const uploadResponse = await httpClient.post("/onboarding/upload-photos", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-User-ID": userId || "",
          },
        });

        photoUrls = uploadResponse.data.urls || uploadResponse.data.fileUrl?.map((f: any) => typeof f === 'string' ? f : f.url) || [];
        saveOnboardingData({ photos: photoUrls });
      }

      // Submit to backend
      // Backend expects userId in the request body
      const response = await httpClient.post(
        "/onboarding/basics",
        {
          userId: userId, // Backend expects userId in body
          displayName: data.username, // Backend expects displayName
          fullName: data.fullName,
          age: data.age,
          photos: photoUrls.length > 0 ? photoUrls : undefined,
        },
        {
          headers: {
            "X-User-ID": userId, // Also send in header for consistency
          },
        }
      );

      return {
        success: true,
        data: response.data,
        userId: response.data.userId || userId,
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
   * Now uses userId instead of sessionId
   */
  async submitBackgroundSeriesOne(
    data: SubmitBackgroundSeriesOneRequest,
    userId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-one",
        {
          userId: userId, // Backend expects userId in body
          ...data,
        },
        {
          headers: {
            "X-User-ID": userId, // Also send in header for consistency
          },
        }
      );
      return { success: true, data: response.data, userId: response.data.userId || userId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series two
   */
  async submitBackgroundSeriesTwo(
    data: SubmitBackgroundSeriesTwoRequest,
    userId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-two",
        {
          userId: userId, // Backend expects userId in body
          ...data,
        },
        {
          headers: {
            "X-User-ID": userId, // Also send in header for consistency
          },
        }
      );
      return { success: true, data: response.data, userId: response.data.userId || userId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series three
   */
  async submitBackgroundSeriesThree(
    data: SubmitBackgroundSeriesThreeRequest,
    userId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-three",
        {
          userId: userId, // Backend expects userId in body
          ...data,
        },
        {
          headers: {
            "X-User-ID": userId, // Also send in header for consistency
          },
        }
      );
      return { success: true, data: response.data, userId: response.data.userId || userId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series four
   */
  async submitBackgroundSeriesFour(
    data: SubmitBackgroundSeriesFourRequest,
    userId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-four",
        {
          userId: userId, // Backend expects userId in body
          ...data,
        },
        {
          headers: {
            "X-User-ID": userId, // Also send in header for consistency
          },
        }
      );
      return { success: true, data: response.data, userId: response.data.userId || userId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series five
   */
  async submitBackgroundSeriesFive(
    data: SubmitBackgroundSeriesFiveRequest,
    userId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-five",
        {
          userId: userId, // Backend expects userId in body
          ...data,
        },
        {
          headers: {
            "X-User-ID": userId, // Also send in header for consistency
          },
        }
      );
      return { success: true, data: response.data, userId: response.data.userId || userId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series six
   */
  async submitBackgroundSeriesSix(
    data: SubmitBackgroundSeriesSixRequest,
    userId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-six",
        {
          userId: userId, // Backend expects userId in body
          ...data,
        },
        {
          headers: {
            "X-User-ID": userId, // Also send in header for consistency
          },
        }
      );
      return { success: true, data: response.data, userId: response.data.userId || userId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series seven
   */
  async submitBackgroundSeriesSeven(
    data: SubmitBackgroundSeriesSevenRequest,
    userId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-seven",
        {
          userId: userId, // Backend expects userId in body
          ...data,
        },
        {
          headers: {
            "X-User-ID": userId, // Also send in header for consistency
          },
        }
      );
      return { success: true, data: response.data, userId: response.data.userId || userId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series eight
   */
  async submitBackgroundSeriesEight(
    data: SubmitBackgroundSeriesEightRequest,
    userId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-eight",
        {
          userId: userId, // Backend expects userId in body
          ...data,
        },
        {
          headers: {
            "X-User-ID": userId, // Also send in header for consistency
          },
        }
      );
      return { success: true, data: response.data, userId: response.data.userId || userId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit background series nine
   */
  async submitBackgroundSeriesNine(
    data: SubmitBackgroundSeriesNineRequest,
    userId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/background-series-nine",
        {
          userId: userId, // Backend expects userId in body
          ...data,
        },
        {
          headers: {
            "X-User-ID": userId, // Also send in header for consistency
          },
        }
      );
      return { success: true, data: response.data, userId: response.data.userId || userId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit emotional series one
   */
  async submitEmotionalSeriesOne(
    data: SubmitEmotionalSeriesOneRequest,
    userId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/emotional-series-one",
        {
          userId: userId, // Backend expects userId in body
          ...data,
        },
        {
          headers: {
            "X-User-ID": userId,
          },
        }
      );
      return { success: true, data: response.data, userId: response.data.userId || userId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit emotional series two
   */
  async submitEmotionalSeriesTwo(
    data: SubmitEmotionalSeriesTwoRequest,
    userId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/emotional-series-two",
        {
          userId: userId, // Backend expects userId in body
          ...data,
        },
        {
          headers: {
            "X-User-ID": userId,
          },
        }
      );
      return { success: true, data: response.data, userId: response.data.userId || userId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit emotional series three
   */
  async submitEmotionalSeriesThree(
    data: SubmitEmotionalSeriesThreeRequest,
    userId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/emotional-series-three",
        {
          userId: userId, // Backend expects userId in body
          ...data,
        },
        {
          headers: {
            "X-User-ID": userId,
          },
        }
      );
      return { success: true, data: response.data, userId: response.data.userId || userId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit emotional series four
   */
  async submitEmotionalSeriesFour(
    data: SubmitEmotionalSeriesFourRequest,
    userId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/emotional-series-four",
        {
          userId: userId, // Backend expects userId in body
          ...data,
        },
        {
          headers: {
            "X-User-ID": userId,
          },
        }
      );
      return { success: true, data: response.data, userId: response.data.userId || userId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Submit emotional series five
   */
  async submitEmotionalSeriesFive(
    data: SubmitEmotionalSeriesFiveRequest,
    userId: string
  ): Promise<OnboardingResponse> {
    try {
      saveOnboardingData(data);
      const response = await httpClient.post(
        "/onboarding/emotional-series-five",
        {
          userId: userId, // Backend expects userId in body
          ...data,
        },
        {
          headers: {
            "X-User-ID": userId,
          },
        }
      );
      return { success: true, data: response.data, userId: response.data.userId || userId };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed to submit data" };
    }
  }

  /**
   * Complete application - submit all data and create account
   * Now uses userId instead of sessionId
   */
  async completeApplication(
    data: CompleteApplicationRequest,
    userId: string
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
          userId: userId, // Backend expects userId in body
          ...allData,
          email: data.email,
          password: data.password, // Backend will handle encryption
          phone: data.phone,
          phone_country_code: data.phone_country_code,
        },
        {
          headers: {
            "X-User-ID": userId,
          },
        }
      );

      // Clear localStorage after successful submission
      clearOnboardingData();
      // Also clear userId from localStorage since user is now fully registered
      localStorage.removeItem("onboarding_user_id");

      return {
        success: true,
        data: response.data,
        userId: response.data.userId || userId,
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

