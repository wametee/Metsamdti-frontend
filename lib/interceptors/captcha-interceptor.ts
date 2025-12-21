import { AxiosInstance, InternalAxiosRequestConfig } from "axios";

/**
 * Captcha Interceptor
 * Adds captcha token to requests that require it
 * Can be extended for reCAPTCHA or other captcha services
 */
const CaptchaInterceptor = (httpClient: AxiosInstance) => {
  httpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Only add captcha for specific endpoints (e.g., signup, login)
      const captchaEndpoints = ["/auth/signup", "/auth/login"];
      const requiresCaptcha = captchaEndpoints.some((endpoint) =>
        config.url?.includes(endpoint)
      );

      if (requiresCaptcha && typeof window !== "undefined") {
        const captchaToken = localStorage.getItem("captcha_token");
        
        if (captchaToken && config.headers) {
          config.headers["X-Captcha-Token"] = captchaToken;
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default CaptchaInterceptor;








