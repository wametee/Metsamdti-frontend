/**
 * Route Configuration
 * Centralized configuration for public and protected routes
 */

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/auth/google/callback",
  "/google-phone",
] as const;

export const PUBLIC_ROUTE_PREFIXES = [
  "/onboarding",
] as const;

export const PUBLIC_API_ENDPOINTS = [
  "/auth/google",
  "/auth/login",
  "/auth/signup",
  "/onboarding/",
] as const;

/**
 * Check if a path is a public route
 */
export function isPublicRoute(path: string): boolean {
  // Exact match for public routes
  if (PUBLIC_ROUTES.some(route => path === route)) {
    return true;
  }
  
  // Prefix match for public route prefixes (e.g., /onboarding/*)
  if (PUBLIC_ROUTE_PREFIXES.some(prefix => path.startsWith(prefix))) {
    return true;
  }
  
  return false;
}

/**
 * Check if an API endpoint is public
 */
export function isPublicApiEndpoint(url: string): boolean {
  return PUBLIC_API_ENDPOINTS.some(endpoint => url.includes(endpoint));
}

/**
 * Check if a 401 error should trigger a redirect to login
 * Returns true if user should be redirected, false otherwise
 */
export function shouldRedirectToLogin(
  currentPath: string,
  requestUrl: string,
  statusCode: number
): boolean {
  // Only handle 401 errors
  if (statusCode !== 401) {
    return false;
  }
  
  // Don't redirect if already on login page
  if (currentPath === "/login" || currentPath.startsWith("/login?")) {
    return false;
  }
  
  // Don't redirect if on a public route
  if (isPublicRoute(currentPath)) {
    return false;
  }
  
  // Don't redirect if request is to a public API endpoint
  if (isPublicApiEndpoint(requestUrl)) {
    return false;
  }
  
  // Special case: /auth/me is used to check auth status
  // If we're on a public route, 401 from /auth/me is expected
  if (requestUrl.includes("/auth/me") && isPublicRoute(currentPath)) {
    return false;
  }
  
  // Special case: accept-terms pages
  if (currentPath.includes("/accept-terms") || requestUrl.includes("accept-terms")) {
    return false;
  }
  
  // All other cases: redirect to login
  return true;
}

