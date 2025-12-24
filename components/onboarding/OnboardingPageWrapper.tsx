/**
 * Wrapper component for onboarding pages
 * Validates step access and shows loading state
 */

import { ReactNode } from 'react';
import { useOnboardingStepValidation } from '@/hooks/useOnboardingStepValidation';

interface OnboardingPageWrapperProps {
  children: ReactNode;
}

export default function OnboardingPageWrapper({ children }: OnboardingPageWrapperProps) {
  const { isValidating, isValid } = useOnboardingStepValidation();

  // Show loading state while validating
  if (isValidating) {
    return (
      <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center pt-24 pb-10 md:py-20 px-4">
        <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-1xl bg-[#EDD4D3] border-2 border-white rounded-2xl py-10 px-6 md:px-20 shadow-md">
          <p className="text-center text-[#702C3E]">Loading...</p>
        </div>
      </section>
    );
  }

  // Don't render if validation failed (redirect will happen)
  if (!isValid) {
    return null;
  }

  return <>{children}</>;
}














