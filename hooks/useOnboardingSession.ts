"use client";

import { useEffect, useState } from "react";

/**
 * Hook to manage onboarding session ID
 * Generates and persists session ID in localStorage
 */
export function useOnboardingSession(): string {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
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

