import axios, { AxiosInstance } from "axios";
import AuthInterceptor from "../interceptors/auth-interceptor";
import ErrorInterceptor from "../interceptors/error-interceptor";
import CaptchaInterceptor from "../interceptors/captcha-interceptor";

// Get API URL from environment variables
// Next.js requires NEXT_PUBLIC_ prefix for client-side env vars
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies for auth
});

/**
 * Interceptor Registration Order
 * 
 * Axios interceptors execute in REVERSE order for error handlers:
 * - Last registered = First to execute
 * - First registered = Last to execute
 * 
 * Current order (registration → execution):
 * 1. AuthInterceptor (registered first) → runs LAST
 *    - Handles 401s, determines redirects, marks public route errors as silent
 * 
 * 2. CaptchaInterceptor (registered second) → runs MIDDLE
 *    - Adds captcha tokens to requests
 * 
 * 3. ErrorInterceptor (registered last) → runs FIRST
 *    - Skips 401s (passes to auth interceptor)
 *    - Handles all other errors (400, 403, 404, 500, etc.)
 *    - Shows toast notifications for user-facing errors
 * 
 * This ensures:
 * - ErrorInterceptor sees 401s first and passes them through
 * - AuthInterceptor handles 401s intelligently (public vs protected routes)
 * - Public route 401s are silently handled (no redirects, no toasts)
 */
AuthInterceptor(httpClient);
CaptchaInterceptor(httpClient);
ErrorInterceptor(httpClient);

export default httpClient;

