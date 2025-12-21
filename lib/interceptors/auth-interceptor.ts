import { AxiosInstance, InternalAxiosRequestConfig } from "axios";

/**
 * Auth Interceptor
 * Automatically adds authentication token to requests
 * Handles token refresh and storage
 */
const AuthInterceptor = (httpClient: AxiosInstance) => {
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

  httpClient.interceptors.response.use(
    (response) => {
      // Optionally store token from response
      if (response.data?.token && typeof window !== "undefined") {
        localStorage.setItem("auth_token", response.data.token);
      }
      return response;
    },
    async (error) => {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response?.status === 401) {
        if (typeof window !== "undefined") {
          // Clear invalid token
          localStorage.removeItem("auth_token");
          
          // Don't redirect if we're on accept-terms page or if the request was for accept-terms
          const currentPath = window.location.pathname;
          const requestUrl = error.config?.url || '';
          const isAcceptTermsPage = currentPath.includes("/accept-terms") || currentPath.includes("/onboarding/accept-terms");
          const isAcceptTermsRequest = requestUrl.includes("accept-terms");
          
          // Redirect to login if not already there and not on accept-terms page/request
          if (!currentPath.includes("/login") && !isAcceptTermsPage && !isAcceptTermsRequest) {
            window.location.href = "/login";
          }
        }
      }

      return Promise.reject(error);
    }
  );
};

export default AuthInterceptor;

