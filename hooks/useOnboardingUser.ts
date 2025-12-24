"use client";

import { useEffect, useState } from "react";
import authService from "@/services/auth/authService";
import { onboardingService } from "@/services";

/**
 * Hook to manage onboarding user ID
 * 
 * This hook:
 * 1. Checks if user is authenticated (has auth_token and user.id)
 * 2. If authenticated, uses the user's ID
 * 3. If not authenticated, initializes onboarding to get/create a userId
 * 4. Stores userId in localStorage for persistence
 * 
 * IMPORTANT: This hook must always be called unconditionally to follow React's Rules of Hooks
 */
export function useOnboardingUser(): string {
  const [userId, setUserId] = useState<string>("");
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeUserId = async () => {
      if (typeof window === "undefined") return;

      try {
        // Check if user is authenticated
        const token = localStorage.getItem("auth_token");
        
        if (token) {
          try {
            const userResult = await authService.getCurrentUser();
            if (userResult.success && userResult.user?.id) {
              // User is authenticated - use their ID
              const authenticatedUserId = userResult.user.id;
              localStorage.setItem("onboarding_user_id", authenticatedUserId);
              setUserId(authenticatedUserId);
              setIsInitializing(false);
              return;
            }
          } catch (error) {
            // If getCurrentUser fails, continue to initialize onboarding
            console.warn("Failed to get current user, initializing onboarding:", error);
          }
        }

        // Check if we already have a userId in localStorage
        let existingUserId = localStorage.getItem("onboarding_user_id");
        
        if (existingUserId) {
          // Verify userId is still valid by checking if user exists
          // For now, we'll trust localStorage. In production, you might want to verify.
          setUserId(existingUserId);
          setIsInitializing(false);
          return;
        }

        // No userId found - initialize onboarding to get/create one
        try {
          const result = await onboardingService.initializeOnboarding();
          if (result.success && result.userId) {
            localStorage.setItem("onboarding_user_id", result.userId);
            setUserId(result.userId);
          } else {
            console.error("Failed to initialize onboarding:", result.message);
            // Fallback: generate a temporary ID (will be replaced when user authenticates)
            const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem("onboarding_user_id", tempId);
            setUserId(tempId);
          }
        } catch (error) {
          console.error("Error initializing onboarding:", error);
          // Fallback: generate a temporary ID
          const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem("onboarding_user_id", tempId);
          setUserId(tempId);
        }
      } catch (error) {
        console.error("Error in useOnboardingUser:", error);
        // Fallback: generate a temporary ID
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("onboarding_user_id", tempId);
        setUserId(tempId);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeUserId();
  }, []);

  return userId;
}

