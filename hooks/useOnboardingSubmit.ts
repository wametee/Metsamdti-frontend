"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { onboardingService } from "@/services";
import { useOnboardingUser } from "./useOnboardingUser";
import { updateOnboardingProgress } from "@/lib/utils/localStorage";

/**
 * Reusable hook for onboarding form submissions
 * 
 * IMPORTANT: All hooks inside this function must be called unconditionally
 * to follow React's Rules of Hooks. This hook must always be called
 * at the top level of a component, before any conditional returns.
 * 
 * This hook internally uses:
 * - useRouter() - Next.js navigation
 * - useOnboardingUser() - User ID management (uses useState, useEffect)
 * - useState() - Local state for isSubmitting and error
 * - useMutation() - React Query mutation (uses useContext internally)
 */
export function useOnboardingSubmit<T>(
  submitFn: (data: T, userId: string) => Promise<any>,
  nextRoute: string
) {
  // ============================================================================
  // CRITICAL: ALL HOOKS MUST BE CALLED UNCONDITIONALLY AND IN THE SAME ORDER
  // ============================================================================
  // Hook order must be consistent on every render:
  // 1. useRouter()
  // 2. useOnboardingUser() (calls useState, useEffect internally)
  // 3. useState() for isSubmitting
  // 4. useState() for error
  // 5. useMutation() (calls useContext internally to access QueryClient)
  // ============================================================================
  
  const router = useRouter();
  const userId = useOnboardingUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useMutation MUST be called unconditionally - it uses useContext internally
  // This hook must always be called, even if the mutation won't be used
  // Never call this conditionally or after early returns
  const mutation = useMutation({
    mutationFn: async (data: T) => {
      setIsSubmitting(true);
      setError(null);
      
      if (!userId) {
        setIsSubmitting(false);
        throw new Error("User ID not available. Please refresh the page.");
      }
      
      try {
        const result = await submitFn(data, userId);
        
        if (!result.success) {
          throw new Error(result.message || "Failed to submit");
        }

        return result;
      } catch (err: any) {
        setIsSubmitting(false);
        // Preserve suggestions if they exist
        if (err.response?.data?.suggestions) {
          (err as any).suggestions = err.response.data.suggestions;
        }
        throw err;
      }
    },
    onSuccess: (result) => {
      // Update progress
      const stepName = nextRoute.split("/").pop() || "";
      updateOnboardingProgress(stepName);
      
      // Navigate to next step
      router.push(nextRoute);
    },
    onError: (error: any) => {
      setError(error.message || "An error occurred");
      setIsSubmitting(false);
      // If error has suggestions, they'll be handled in the component
      if (error.suggestions) {
        throw error; // Re-throw to let component handle suggestions
      }
    },
  });

  const handleSubmit = async (data: T, e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    mutation.mutate(data);
  };

  return {
    handleSubmit,
    isSubmitting,
    error,
    isSuccess: mutation.isSuccess,
  };
}

