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
  displayName?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
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
      return {
        success: false,
        message: error.message || "Failed to get user",
      };
    }
  }
}

export default new AuthService();




