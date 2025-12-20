"use client";

import { useEffect, useState } from "react";

/**
 * Hook to manage onboarding session ID
 * Generates and persists session ID in localStorage
 * 
 * IMPORTANT: This hook must always be called unconditionally to follow React's Rules of Hooks
 */
export function useOnboardingSession(): string {
  // Always call useState unconditionally - never conditionally
  const [sessionId, setSessionId] = useState<string>("");

  // Always call useEffect unconditionally - never conditionally
  useEffect(() => {
    // Check for window inside the effect, not as a condition for calling the hook
    if (typeof window === "undefined") return;

    // Try to get existing session ID
    let existingSessionId = localStorage.getItem("onboarding_session_id");

    // If no session ID exists, generate a new one
    if (!existingSessionId) {
      existingSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("onboarding_session_id", existingSessionId);
    }

    setSessionId(existingSessionId);
  }, []);

  return sessionId;
}

