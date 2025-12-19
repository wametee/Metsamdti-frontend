import { AxiosInstance, AxiosError } from "axios";

/**
 * Error Interceptor
 * Centralized error handling for all API requests
 * Provides consistent error messages and logging
 */
const ErrorInterceptor = (httpClient: AxiosInstance) => {
  httpClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle network errors (no response from server)
      if (!error.response) {
        const errorMessage = error.message || "Network error. Please check your connection.";
        const url = error.config?.url || "unknown";
        const baseURL = error.config?.baseURL || "unknown";
        
        console.error("Network Error:", {
          message: errorMessage,
          url: `${baseURL}${url}`,
          code: error.code,
        });
        
        return Promise.reject({
          message: errorMessage,
          code: "NETWORK_ERROR",
          originalError: error,
        });
      }

      // Handle HTTP errors
      const status = error.response.status;
      const data = error.response.data as any;

      // Log error for debugging (always log in development, or if there's useful info)
      const shouldLog = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ENVIRONMENT === "dev";
      if (shouldLog) {
        console.error("API Error:", {
          status,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          data: data || "No error data",
          fullError: error,
        });
      }

      // Transform error to a consistent format
      const errorMessage = data?.message || data?.error || "An error occurred";
      
      // Handle specific status codes
      switch (status) {
        case 400:
          return Promise.reject({
            message: errorMessage || "Invalid request",
            code: "BAD_REQUEST",
            status,
            data,
          });
        case 401:
          return Promise.reject({
            message: "Unauthorized. Please log in again.",
            code: "UNAUTHORIZED",
            status,
          });
        case 403:
          return Promise.reject({
            message: "You don't have permission to perform this action.",
            code: "FORBIDDEN",
            status,
          });
        case 404:
          return Promise.reject({
            message: "Resource not found",
            code: "NOT_FOUND",
            status,
          });
        case 422:
          return Promise.reject({
            message: errorMessage || "Validation error",
            code: "VALIDATION_ERROR",
            status,
            data,
          });
        case 429:
          return Promise.reject({
            message: "Too many requests. Please try again later.",
            code: "RATE_LIMIT",
            status,
          });
        case 500:
          return Promise.reject({
            message: "Server error. Please try again later.",
            code: "SERVER_ERROR",
            status,
          });
        default:
          return Promise.reject({
            message: errorMessage || "An unexpected error occurred",
            code: "UNKNOWN_ERROR",
            status,
            data,
          });
      }
    }
  );
};

export default ErrorInterceptor;

