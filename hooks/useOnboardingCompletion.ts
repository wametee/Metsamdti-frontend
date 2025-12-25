"use client";

import { useState, useEffect } from 'react';
import { getOnboardingData } from '@/lib/utils/localStorage';

interface OnboardingCompletionStatus {
  isComplete: boolean;
  isLoading: boolean;
  currentStep: string | null;
  userId: string | null;
  error: string | null;
}

/**
 * Hook to check if user has completed onboarding
 * 
 * Onboarding is considered complete when ALL required data is present:
 * 1. Accept Terms (userId exists)
 * 2. Basics (displayName/username, fullName, age, photos)
 * 3. Background Series 1-9 (all fields)
 * 4. Emotional Series 1-5 (all fields)
 * 
 * This ensures users must go through the complete onboarding flow
 * before they can access signup to create their account.
 */
export function useOnboardingCompletion(): OnboardingCompletionStatus {
  const [status, setStatus] = useState<OnboardingCompletionStatus>({
    isComplete: false,
    isLoading: true,
    currentStep: null,
    userId: null,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const checkOnboardingStatus = () => {
      try {
        // Get userId from localStorage (from onboarding)
        const userId = typeof window !== 'undefined' 
          ? localStorage.getItem('onboarding_user_id') 
          : null;

        if (!userId) {
          if (isMounted) {
            setStatus({
              isComplete: false,
              isLoading: false,
              currentStep: null,
              userId: null,
              error: 'No onboarding session found. Please start by accepting terms.',
            });
          }
          return;
        }

        // Get onboarding data from localStorage
        const onboardingData = getOnboardingData();

        if (!onboardingData) {
          if (isMounted) {
            setStatus({
              isComplete: false,
              isLoading: false,
              currentStep: null,
              userId,
              error: 'No onboarding data found. Please complete the onboarding process.',
            });
          }
          return;
        }

        // Check if all required steps are completed
        // Basics
        const hasBasics = !!(onboardingData.displayName || onboardingData.username) && 
                         !!onboardingData.fullName && 
                         onboardingData.age !== undefined && 
                         onboardingData.age !== null &&
                         onboardingData.photos && 
                         onboardingData.photos.length > 0;

        // Background Series One
        const hasBackgroundOne = !!onboardingData.birthday && 
                                 !!onboardingData.gender && 
                                 onboardingData.languages && 
                                 onboardingData.languages.length > 0;

        // Background Series Two
        const hasBackgroundTwo = !!onboardingData.currentLocation && 
                                 !!onboardingData.livingSituation && 
                                 !!onboardingData.birthLocation;

        // Background Series Three
        const hasBackgroundThree = !!onboardingData.education && 
                                  !!onboardingData.occupation;

        // Background Series Four
        const hasBackgroundFour = onboardingData.previouslyMarried !== undefined && 
                                 onboardingData.hasChildren !== undefined;

        // Background Series Five
        const hasBackgroundFive = onboardingData.openToPartnerWithChildren !== undefined && 
                                 !!onboardingData.idealMarriageTimeline &&
                                 onboardingData.preferredAgeRange?.min !== undefined &&
                                 onboardingData.preferredAgeRange?.max !== undefined;

        // Background Series Six
        const hasBackgroundSix = !!onboardingData.weekendActivities && 
                                !!onboardingData.conflictHandling &&
                                onboardingData.coreValues && 
                                onboardingData.coreValues.length > 0;

        // Background Series Seven
        const hasBackgroundSeven = !!onboardingData.loveLanguage && 
                                  !!onboardingData.oneThingToUnderstand;

        // Background Series Eight
        const hasBackgroundEight = !!onboardingData.faithImportance && 
                                  !!onboardingData.genderRolesInMarriage;

        // Background Series Nine
        const hasBackgroundNine = onboardingData.preferOwnBackground !== undefined && 
                                 !!onboardingData.futureFamilyVision && 
                                 !!onboardingData.biggestDealBreaker;

        // Emotional Series One
        const hasEmotionalOne = !!onboardingData.emotionalBalance && 
                               !!onboardingData.conflictEmotionalResponse && 
                               !!onboardingData.decisionMakingGuide;

        // Emotional Series Two
        const hasEmotionalTwo = !!onboardingData.preferredEmotionalEnergy && 
                               !!onboardingData.feelsLoved && 
                               !!onboardingData.deepConnection;

        // Emotional Series Three
        const hasEmotionalThree = !!onboardingData.confidenceMoments && 
                                 !!onboardingData.showLove;

        // Emotional Series Four
        const hasEmotionalFour = !!onboardingData.disagreementResponse && 
                                !!onboardingData.lovedOneUpsetResponse && 
                                !!onboardingData.refillEmotionalEnergy;

        // Emotional Series Five
        const hasEmotionalFive = !!onboardingData.communicationStyle && 
                                !!onboardingData.lifeApproach && 
                                !!onboardingData.valuedRelationship;

        // All steps must be completed
        const isComplete = hasBasics &&
                         hasBackgroundOne &&
                         hasBackgroundTwo &&
                         hasBackgroundThree &&
                         hasBackgroundFour &&
                         hasBackgroundFive &&
                         hasBackgroundSix &&
                         hasBackgroundSeven &&
                         hasBackgroundEight &&
                         hasBackgroundNine &&
                         hasEmotionalOne &&
                         hasEmotionalTwo &&
                         hasEmotionalThree &&
                         hasEmotionalFour &&
                         hasEmotionalFive;

        if (isMounted) {
          setStatus({
            isComplete,
            isLoading: false,
            currentStep: isComplete ? 'emotional_series_five' : null,
            userId,
            error: isComplete ? null : 'Please complete all onboarding steps before signing up.',
          });
        }
      } catch (error: any) {
        if (isMounted) {
          setStatus({
            isComplete: false,
            isLoading: false,
            currentStep: null,
            userId: null,
            error: error.message || 'Error checking onboarding status',
          });
        }
      }
    };

    checkOnboardingStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return status;
}

