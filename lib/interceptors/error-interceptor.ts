import { AxiosInstance, AxiosError } from "axios";
import { toast } from "react-toastify";
import { shouldRedirectToLogin } from "../config/routes";

/**
 * Error Interceptor
 * 
 * Centralized error handling for all API requests.
 * Provides consistent error messages, logging, and toast notifications.
 * 
 * Responsibilities:
 * 1. Handle network errors (no response from server)
 * 2. Skip 401 errors (pass to AuthInterceptor for intelligent handling)
 * 3. Skip errors marked as silent/expected (from AuthInterceptor)
 * 4. Handle all other HTTP errors (400, 403, 404, 422, 429, 500, etc.)
 * 5. Show appropriate toast notifications for user-facing errors
 * 
 * Note: This interceptor runs FIRST (registered last = runs first)
 * It skips 401s so AuthInterceptor can handle them based on route context
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
        
        // Show toast notification for network errors
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
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

      // Skip 401 errors - let auth interceptor handle them
      // Error interceptor runs FIRST (registered last), auth interceptor runs SECOND
      // If error is marked as silent/expected, skip all error handling
      if (status === 401) {
        // Pass through to auth interceptor - it will handle redirects and marking
        return Promise.reject(error);
      }
      
      // Skip errors marked as silent/expected (from auth interceptor)
      if ((error as any).silent || (error as any).isExpected) {
        return Promise.reject(error);
      }

      // Transform error to a consistent format
      const errorMessage = data?.message || data?.error || "An error occurred";
      
      // Handle specific status codes and show toast notifications
      let toastMessage = errorMessage;
      
      switch (status) {
        case 400:
          toastMessage = errorMessage || "Invalid request";
          toast.error(toastMessage, {
            position: "top-right",
            autoClose: 5000,
          });
          return Promise.reject({
            message: toastMessage,
            code: "BAD_REQUEST",
            status,
            data,
          });
        case 403:
          toastMessage = "You don't have permission to perform this action.";
          toast.error(toastMessage, {
            position: "top-right",
            autoClose: 5000,
          });
          return Promise.reject({
            message: toastMessage,
            code: "FORBIDDEN",
            status,
          });
        case 404:
          toastMessage = "Resource not found";
          toast.error(toastMessage, {
            position: "top-right",
            autoClose: 5000,
          });
          return Promise.reject({
            message: toastMessage,
            code: "NOT_FOUND",
            status,
          });
        case 422:
          toastMessage = errorMessage || "Validation error";
          toast.error(toastMessage, {
            position: "top-right",
            autoClose: 5000,
          });
          return Promise.reject({
            message: toastMessage,
            code: "VALIDATION_ERROR",
            status,
            data,
          });
        case 429:
          toastMessage = "Too many requests. Please try again later.";
          toast.error(toastMessage, {
            position: "top-right",
            autoClose: 5000,
          });
          return Promise.reject({
            message: toastMessage,
            code: "RATE_LIMIT",
            status,
          });
        case 500:
          toastMessage = "Server error. Please try again later.";
          toast.error(toastMessage, {
            position: "top-right",
            autoClose: 5000,
          });
          return Promise.reject({
            message: toastMessage,
            code: "SERVER_ERROR",
            status,
          });
        default:
          toastMessage = errorMessage || "An unexpected error occurred";
          toast.error(toastMessage, {
            position: "top-right",
            autoClose: 5000,
          });
          return Promise.reject({
            message: toastMessage,
            code: "UNKNOWN_ERROR",
            status,
            data,
          });
      }
    }
  );
};

export default ErrorInterceptor;

