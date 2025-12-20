import { AxiosInstance, AxiosError } from "axios";
import { toast } from "react-toastify";

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
        case 401:
          toastMessage = "Unauthorized. Please log in again.";
          toast.error(toastMessage, {
            position: "top-right",
            autoClose: 5000,
          });
          return Promise.reject({
            message: toastMessage,
            code: "UNAUTHORIZED",
            status,
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

