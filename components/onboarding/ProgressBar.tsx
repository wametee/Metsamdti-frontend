"use client";

import { useState, useEffect } from 'react';
import { useOnboardingProgress } from '@/hooks/useOnboardingProgress';
import { OnboardingPhase } from '@/lib/progress/onboarding-progress.config';
import * as progressConfig from '@/lib/progress/onboarding-progress.config';

interface ProgressBarProps {
  /**
   * Display mode:
   * - 'phase': Shows progress within current phase (e.g., 1/3, 2/3, 3/3)
   * - 'step': Shows progress within current phase steps (e.g., 5/14)
   * - 'overall': Shows overall progress across all steps
   * - 'auto': Automatically chooses based on phase
   */
  mode?: 'phase' | 'step' | 'overall' | 'auto';
  
  /**
   * Show text label (e.g., "1/3" or "5/14")
   */
  showLabel?: boolean;
  
  /**
   * Custom className for the container
   */
  className?: string;
  
  /**
   * Height of the progress bar
   */
  height?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable Progress Bar Component
 * Automatically calculates and displays progress based on current route
 */
export default function ProgressBar({
  mode = 'auto',
  showLabel = false,
  className = '',
  height = 'md',
}: ProgressBarProps) {
  const { currentStep, phaseProgress, overallProgress, phaseInfo, stepInfo } = useOnboardingProgress();

  if (!currentStep) {
    return null;
  }

  // Determine display mode
  let displayProgress: number;
  let displayLabel: string | null = null;

  if (mode === 'auto') {
    // For phase-based pages (Start, GreatStart, CompleteApplication, Match-time), show phase progress
    if (
      currentStep.phase === OnboardingPhase.START ||
      currentStep.phase === OnboardingPhase.COMPLETE_APPLICATION ||
      currentStep.phase === OnboardingPhase.COMPLETED
    ) {
      displayProgress = phaseInfo?.percentage || 0;
      if (showLabel && phaseInfo) {
        displayLabel = `${phaseInfo.current}/${phaseInfo.total}`;
      }
    } else {
      // For step-based pages, show step progress within phase
      displayProgress = phaseProgress;
      if (showLabel && stepInfo) {
        displayLabel = `${stepInfo.current}/${stepInfo.total}`;
      }
    }
  } else if (mode === 'phase') {
    displayProgress = phaseInfo?.percentage || 0;
    if (showLabel && phaseInfo) {
      displayLabel = `${phaseInfo.current}/${phaseInfo.total}`;
    }
  } else if (mode === 'step') {
    displayProgress = phaseProgress;
    if (showLabel && stepInfo) {
      displayLabel = `${stepInfo.current}/${stepInfo.total}`;
    }
  } else {
    displayProgress = overallProgress;
    if (showLabel) {
      displayLabel = `${Math.round(overallProgress)}%`;
    }
  }

  // Height classes
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2 md:h-3',
    lg: 'h-3 md:h-4',
  };

  // Check if this is a rounded progress bar page (Thankyou, GreatStart, CompleteApplication, Match-time)
  // These pages use phase-based progress (0/3, 1/3, 2/3, 3/3) and should have rounded bars
  const isRoundedBar = currentStep.phase === OnboardingPhase.START || 
                       currentStep.phase === OnboardingPhase.COMPLETE_APPLICATION ||
                       currentStep.phase === OnboardingPhase.COMPLETED ||
                       currentStep.route === '/onboarding/great-start';

  // For rounded bars, use slightly taller height for better visibility
  const barHeight = isRoundedBar ? 'h-3 md:h-4' : heightClasses[height];

  // Get previous phase progress to show as background layer (for all progress bars)
  // This creates the professional three-layer effect: background -> previous progress -> current progress
  let previousProgress = 0;
  try {
    if (typeof progressConfig.getPreviousPhaseProgress === 'function') {
      previousProgress = progressConfig.getPreviousPhaseProgress(currentStep.phase);
    } else {
      // Fallback calculation
      const phaseOrder = [
        OnboardingPhase.START,
        OnboardingPhase.PROFILE,
        OnboardingPhase.COMPLETE_APPLICATION,
        OnboardingPhase.COMPLETED,
      ];
      const currentIndex = phaseOrder.indexOf(currentStep.phase);
      if (currentIndex > 0) {
        const previousPhase = phaseOrder[currentIndex - 1];
        const PHASE_PROGRESS_MAP: Record<OnboardingPhase, number> = {
          [OnboardingPhase.START]: 0,
          [OnboardingPhase.PROFILE]: 33.33,
          [OnboardingPhase.COMPLETE_APPLICATION]: 66.66,
          [OnboardingPhase.COMPLETED]: 100,
        };
        previousProgress = PHASE_PROGRESS_MAP[previousPhase] || 0;
      }
    }
  } catch (error) {
    previousProgress = 0;
  }

  // For step-based progress (BackgroundSeries, EmotionalSeries), use overall progress
  // which already includes all previous steps and phases
  let finalDisplayProgress = displayProgress;
  if (mode === 'step' || (!isRoundedBar && currentStep.phase === OnboardingPhase.PROFILE)) {
    // Use overall progress for step-based pages to show cumulative progress
    finalDisplayProgress = overallProgress;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar Container - Exact style match, starts at absolute left edge */}
      {/* Break out of parent padding: px-6 (1.5rem) on mobile, px-20 (5rem) on desktop */}
      <div 
        className="h-1.5 bg-[#E7D3D1] rounded-full mb-10 relative overflow-hidden -mx-4 md:-mx-12 w-[calc(100%+2rem)] md:w-[calc(100%+6rem)]"
      >
        {/* Previous phase progress as background (lighter color) - shows for all progress bars */}
        {previousProgress > 0 && (
          <div
            className="h-full bg-[#C9A7AF] rounded-full absolute left-0 top-0 transition-all duration-700 ease-out"
            style={{ width: `${Math.min(Math.max(previousProgress, 0), 100)}%` }}
          />
        )}
        {/* Current progress on top - exact style match */}
        <div
          className="h-full bg-[#702C3E] rounded-full absolute left-0 top-0 transition-all duration-700 ease-out z-10"
          style={{ 
            width: `${Math.min(Math.max(finalDisplayProgress, 0), 100)}%`
          }}
        />
      </div>
      
      {/* Label (if enabled) */}
      {showLabel && displayLabel && (
        <div className="text-center">
          <span className="text-xs md:text-sm text-[#702C3E] font-medium">
            {displayLabel}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Circular Progress Component
 * Rounded circle that fills based on progress
 */
function CircularProgress({ 
  progress, 
  previousProgress, 
  size = 56,
  className = '' 
}: { 
  progress: number; 
  previousProgress: number;
  size?: number;
  className?: string;
}) {
  // Ensure size is always a number and consistent to prevent hydration mismatch
  const finalSize = typeof size === 'number' ? size : 56;
  const radius = (finalSize - 6) / 2; // Account for border (2px on each side = 4px total, so radius needs 2px less)
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const previousOffset = circumference - (previousProgress / 100) * circumference;

  return (
    <div className={`relative ${className}`} style={{ width: finalSize, height: finalSize }}>
      <svg
        width={finalSize}
        height={finalSize}
        className="transform -rotate-90 absolute inset-0"
        style={{ width: finalSize, height: finalSize }}
      >
        {/* Background circle (previous progress) */}
        {previousProgress > 0 && (
          <circle
            cx={finalSize / 2}
            cy={finalSize / 2}
            r={radius}
            fill="none"
            stroke="#C9A7AF"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={previousOffset}
            className="transition-all duration-500 ease-out"
            strokeLinecap="round"
          />
        )}
        {/* Current progress circle */}
        <circle
          cx={finalSize / 2}
          cy={finalSize / 2}
          r={radius}
          fill="none"
          stroke="#702C3E"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
          strokeLinecap="round"
        />
      </svg>
      {/* Border circle - outer ring */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-[#702C3E] pointer-events-none"
        style={{ width: finalSize, height: finalSize }}
      />
    </div>
  );
}

/**
 * Phase Progress Bar Component
 * Specifically for GreatStart, CompleteApplication, Thankyou, and Match-time pages
 * Shows progress as 0/3, 1/3, 2/3, 3/3 in a circular format
 */
export function PhaseProgressBar({ className = '' }: { className?: string }) {
  const [isMounted, setIsMounted] = useState(false);
  const { currentStep, phaseInfo } = useOnboardingProgress();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Always use consistent defaults for SSR to prevent hydration mismatch
  const defaultProgress = 0;
  const defaultPhaseInfo = { current: 0, total: 3, percentage: 0 };
  
  // Use defaults during SSR, only use actual values after mount
  const currentProgress = (isMounted && phaseInfo) ? phaseInfo.percentage : defaultProgress;
  
  // Safely get previous progress - calculate inline if function not available
  let previousProgress = 0;
  if (isMounted && currentStep) {
    try {
      if (typeof progressConfig.getPreviousPhaseProgress === 'function') {
        previousProgress = progressConfig.getPreviousPhaseProgress(currentStep.phase);
      } else {
        // Fallback calculation
        const phaseOrder = [
          OnboardingPhase.START,
          OnboardingPhase.PROFILE,
          OnboardingPhase.COMPLETE_APPLICATION,
          OnboardingPhase.COMPLETED,
        ];
        const currentIndex = phaseOrder.indexOf(currentStep.phase);
        if (currentIndex > 0) {
          const previousPhase = phaseOrder[currentIndex - 1];
          const PHASE_PROGRESS_MAP: Record<OnboardingPhase, number> = {
            [OnboardingPhase.START]: 0,
            [OnboardingPhase.PROFILE]: 33.33,
            [OnboardingPhase.COMPLETE_APPLICATION]: 66.66,
            [OnboardingPhase.COMPLETED]: 100,
          };
          previousProgress = PHASE_PROGRESS_MAP[previousPhase] || 0;
        }
      }
    } catch (error) {
      console.warn('Error getting previous phase progress:', error);
      previousProgress = 0;
    }
  }
  
  const displayPhaseInfo = (isMounted && phaseInfo) ? phaseInfo : defaultPhaseInfo;

  // Always render with consistent values - size, className, and text size must match SSR
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="mb-3">
        <CircularProgress
          progress={currentProgress}
          previousProgress={previousProgress}
          size={56}
        />
      </div>
      {/* Label */}
      <span className="text-sm md:text-base text-[#702C3E] font-medium">
        {displayPhaseInfo.current}/{displayPhaseInfo.total}
      </span>
    </div>
  );
}

/**
 * Step Progress Bar Component
 * For BackgroundSeries and EmotionalSeries pages
 * Shows progress within the current phase (e.g., 5/14)
 */
export function StepProgressBar({ className = '' }: { className?: string }) {
  return (
    <ProgressBar
      mode="step"
      showLabel={true}
      className={className}
      height="md"
    />
  );
}

