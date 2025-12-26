/**
 * Authentication Utilities
 * 
 * Handles token expiration, login timestamp tracking, and auto-logout logic
 */

const LOGIN_TIMESTAMP_KEY = 'auth_login_timestamp';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Store login timestamp when user logs in
 */
export function storeLoginTimestamp(): void {
  if (typeof window !== 'undefined') {
    const timestamp = Date.now().toString();
    localStorage.setItem(LOGIN_TIMESTAMP_KEY, timestamp);
  }
}

/**
 * Get login timestamp
 */
export function getLoginTimestamp(): number | null {
  if (typeof window !== 'undefined') {
    const timestamp = localStorage.getItem(LOGIN_TIMESTAMP_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  }
  return null;
}

/**
 * Clear login timestamp (on logout)
 */
export function clearLoginTimestamp(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
  }
}

/**
 * Check if session has expired (24 hours passed)
 */
export function isSessionExpired(): boolean {
  const loginTimestamp = getLoginTimestamp();
  
  if (!loginTimestamp) {
    // No timestamp means session is invalid
    return true;
  }

  const now = Date.now();
  const elapsed = now - loginTimestamp;
  
  return elapsed >= SESSION_DURATION_MS;
}

/**
 * Get remaining session time in milliseconds
 */
export function getRemainingSessionTime(): number {
  const loginTimestamp = getLoginTimestamp();
  
  if (!loginTimestamp) {
    return 0;
  }

  const now = Date.now();
  const elapsed = now - loginTimestamp;
  const remaining = SESSION_DURATION_MS - elapsed;
  
  return Math.max(0, remaining);
}

/**
 * Get remaining session time in hours (for display)
 */
export function getRemainingSessionHours(): number {
  const remaining = getRemainingSessionTime();
  return Math.floor(remaining / (60 * 60 * 1000));
}

/**
 * Get remaining session time in minutes (for display)
 */
export function getRemainingSessionMinutes(): number {
  const remaining = getRemainingSessionTime();
  return Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
}






