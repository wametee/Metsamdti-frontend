"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { onboardingService } from "@/services";
import { useOnboardingSession } from "./useOnboardingSession";
import { updateOnboardingProgress } from "@/lib/utils/localStorage";

/**
 * Reusable hook for onboarding form submissions
 */
export function useOnboardingSubmit<T>(
  submitFn: (data: T, sessionId: string) => Promise<any>,
  nextRoute: string
) {
  const router = useRouter();
  const sessionId = useOnboardingSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: T) => {
      setIsSubmitting(true);
      setError(null);
      
      try {
        const result = await submitFn(data, sessionId);
        
        if (!result.success) {
          throw new Error(result.message || "Failed to submit");
        }

        return result;
      } catch (err: any) {
        setIsSubmitting(false);
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

