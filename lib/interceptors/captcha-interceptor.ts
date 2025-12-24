import { AxiosInstance, InternalAxiosRequestConfig } from "axios";

/**
 * Captcha Interceptor
 * Placeholder for captcha validation logic
 * Currently a no-op interceptor that can be extended if captcha is needed
 * 
 * Responsibilities (if implemented):
 * - Validate captcha tokens before sending requests
 * - Handle captcha errors
 * - Refresh captcha tokens when needed
 */
function CaptchaInterceptor(httpClient: AxiosInstance) {
  // Request interceptor: Add captcha token if needed
  httpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Captcha logic can be added here if needed in the future
      // For now, this is a no-op to maintain the interceptor structure
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor: Handle captcha errors if needed
  httpClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Captcha error handling can be added here if needed
      return Promise.reject(error);
    }
  );
}

export default CaptchaInterceptor;

