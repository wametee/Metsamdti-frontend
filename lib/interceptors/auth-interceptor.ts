import { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
import { shouldRedirectToLogin } from "../config/routes";

/**
 * Auth Interceptor
 * Automatically adds authentication token to requests
 * Handles token refresh and storage
 * 
 * Responsibilities:
 * - Attach auth token to outgoing requests
 * - Handle 401 errors intelligently (only redirect on protected routes)
 * - Store tokens from successful auth responses
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
          const statusCode = error.response.status;
          
          // Use centralized route configuration to determine if redirect is needed
          const needsRedirect = shouldRedirectToLogin(currentPath, requestUrl, statusCode);
          
          if (needsRedirect) {
            // Clear invalid/expired token
            localStorage.removeItem("auth_token");
            console.log('[AuthInterceptor] 401 on protected route, redirecting to login', {
              path: currentPath,
              request: requestUrl,
            });
            window.location.href = "/login";
          } else {
            // On public routes, 401 is expected - don't redirect
            // Silently handle the error without disrupting user experience
            console.log('[AuthInterceptor] 401 on public route, ignoring', {
              path: currentPath,
              request: requestUrl,
            });
          }
        }
      }

      return Promise.reject(error);
    }
  );
};

export default AuthInterceptor;

