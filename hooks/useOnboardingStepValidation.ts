/**
 * Hook to validate onboarding step access
 * Redirects users to the appropriate step if they try to skip ahead
 */

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { canAccessStep, getStepDisplayName } from '@/lib/utils/onboarding-validation';
import { toast } from 'react-toastify';

export function useOnboardingStepValidation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Skip validation for non-onboarding routes
    if (!pathname.startsWith('/onboarding/') && pathname !== '/signup') {
      setIsValidating(false);
      setIsValid(true);
      return;
    }

    // Skip validation for thankyou page (entry point)
    if (pathname === '/onboarding/thankyou') {
      setIsValidating(false);
      setIsValid(true);
      return;
    }

    const checkAccess = () => {
      const { allowed, missingStep } = canAccessStep(pathname);

      if (!allowed && missingStep) {
        setIsValidating(false);
        setIsValid(false);
        
        // Show friendly message
        const missingStepName = getStepDisplayName(missingStep);
        toast.info(
          `Please complete "${missingStepName}" first before continuing. We'll take you there now.`,
          {
            autoClose: 3000,
          }
        );

        // Redirect to the missing step after a short delay
        setTimeout(() => {
          router.push(missingStep);
        }, 1000);
      } else {
        setIsValidating(false);
        setIsValid(true);
      }
    };

    // Small delay to ensure localStorage is available
    const timer = setTimeout(checkAccess, 100);
    return () => clearTimeout(timer);
  }, [pathname, router]);

  return { isValidating, isValid };
}

