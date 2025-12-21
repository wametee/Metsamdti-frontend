import { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
import { shouldRedirectToLogin } from "../config/routes";

/**
 * Auth Interceptor
 * 
 * Responsibilities:
 * 1. Request Interceptor: Attach auth token to outgoing requests
 * 2. Response Success: Store tokens from successful auth responses
 * 3. Response Error: Handle 401 errors intelligently
 *    - Protected routes: Clear token and redirect to login
 *    - Public routes: Mark error as silent (no redirect, no toast)
 * 
 * Note: This interceptor runs AFTER ErrorInterceptor (registered first = runs last)
 * This allows ErrorInterceptor to skip 401s, then AuthInterceptor handles them properly
 */
const AuthInterceptor = (httpClient: AxiosInstance) => {
  // Request interceptor: Attach auth token to requests
  httpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from localStorage (client-side only)
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor: Handle auth errors and token storage
  httpClient.interceptors.response.use(
    (response) => {
      // Store token from response if provided (e.g., after login/signup)
      if (response.data?.token && typeof window !== "undefined") {
        localStorage.setItem("auth_token", response.data.token);
      }
      return response;
    },
    async (error: AxiosError) => {
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401) {
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const requestUrl = error.config?.url || '';
          
          // Use centralized route configuration to determine if redirect is needed
          const needsRedirect = shouldRedirectToLogin(currentPath, requestUrl, 401);
          
          if (needsRedirect) {
            // Clear invalid/expired token
            localStorage.removeItem("auth_token");
            // Redirect to login on protected routes
            window.location.href = "/login";
            // Reject to stop further processing
            return Promise.reject(error);
          } else {
            // On public routes, 401 is expected - mark error as silent
            // This prevents error interceptor from showing toasts/logs
            (error as any).isExpected = true;
            (error as any).silent = true;
          }
        }
      }

      // Pass through all errors (marked or not)
      return Promise.reject(error);
    }
  );
};

export default AuthInterceptor;

