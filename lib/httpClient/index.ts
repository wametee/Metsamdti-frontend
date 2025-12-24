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

// Apply interceptors
AuthInterceptor(httpClient);
CaptchaInterceptor(httpClient);
ErrorInterceptor(httpClient);

export default httpClient;

