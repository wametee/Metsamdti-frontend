import httpClient from "@/lib/httpClient";

/**
 * Auth Service
 * Handles authentication-related API calls
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  username?: string;
  displayName?: string; // Keep for backward compatibility
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
  isNewUser?: boolean;
}

class AuthService {
  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post("/auth/login", data);
      
      // Store token if provided
      if (response.data.token && typeof window !== "undefined") {
        localStorage.setItem("auth_token", response.data.token);
      }

      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Login failed",
      };
    }
  }

  /**
   * Signup user
   */
  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post("/auth/signup", data);
      
      // Store token if provided
      if (response.data.token && typeof window !== "undefined") {
        localStorage.setItem("auth_token", response.data.token);
      }

      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Signup failed",
      };
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await httpClient.get("/auth/me");
      return {
        success: true,
        user: response.data.user,
      };
    } catch (error: any) {
      // Silently handle 401 errors (expected when user is not logged in)
      // This is normal during onboarding or on public routes
      if (error?.status === 401 || error?.code === 'UNAUTHORIZED' || error?.isExpected) {
        return {
          success: false,
          message: "User not authenticated",
        };
      }
      return {
        success: false,
        message: error.message || "Failed to get user",
      };
    }
  }

  /**
   * Google OAuth login/signup
   */
  async googleAuth(idToken: string): Promise<AuthResponse> {
    try {
      const response = await httpClient.post("/auth/google", { idToken });
      
      // Store token if provided
      if (response.data.token && typeof window !== "undefined") {
        localStorage.setItem("auth_token", response.data.token);
      }

      const isNewUser = response.data.isNewUser === true;
      
      console.log('[AuthService] Google auth response:', {
        hasToken: !!response.data.token,
        hasUser: !!response.data.user,
        isNewUser: response.data.isNewUser,
        isNewUserStrict: isNewUser,
      });

      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
        isNewUser: isNewUser,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Google authentication failed",
      };
    }
  }

  /**
   * Get Google OAuth URL
   */
  async getGoogleAuthUrl(): Promise<{ success: boolean; authUrl?: string; message?: string }> {
    try {
      const response = await httpClient.get("/auth/google/url");
      return {
        success: true,
        authUrl: response.data.authUrl,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get Google auth URL",
      };
    }
  }

  /**
   * Get current user's profile
   */
  async getCurrentUserProfile(): Promise<{ success: boolean; profile?: any; message?: string }> {
    try {
      const response = await httpClient.get("/auth/profile");
      return {
        success: true,
        profile: response.data.profile,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get user profile",
      };
    }
  }

  /**
   * Update current user's profile
   */
  async updateProfile(profileData: any): Promise<{ success: boolean; profile?: any; message?: string }> {
    try {
      const response = await httpClient.put("/auth/profile", profileData);
      return {
        success: true,
        profile: response.data.profile,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to update profile",
      };
    }
  }

  /**
   * Update user's phone number (for Google sign-up users)
   */
  async updatePhone(phone: string, phoneCountryCode: string, phoneNumber: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await httpClient.put("/auth/user", {
        phone,
        phone_country_code: phoneCountryCode,
        phone_number: phoneNumber,
      });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to update phone number",
      };
    }
  }
}

export default new AuthService();




