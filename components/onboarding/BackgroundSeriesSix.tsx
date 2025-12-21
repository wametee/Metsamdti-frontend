"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { onboardingService } from '@/services';
import { useOnboardingSubmit } from '@/hooks/useOnboardingSubmit';
import { getOnboardingData } from '@/lib/utils/localStorage';
import { StepProgressBar } from './ProgressBar';
import { validateRequired, showValidationError } from '@/lib/utils/validation';

export default function BackgroundSeriesSix() {
  const router = useRouter();

  // State
  const [weekendActivities, setWeekendActivities] = useState("");
  const [conflictHandling, setConflictHandling] = useState("");
  const [coreValues, setCoreValues] = useState<string[]>([]);

  // Load saved data - only once on mount
  const dataLoadedRef = useRef(false);
  useEffect(() => {
    if (dataLoadedRef.current) return;
    
    const saved = getOnboardingData();
    if (saved) {
      // Only set values if they're not already set (to avoid overwriting user input)
      if (!weekendActivities && saved.weekendActivities) {
        setWeekendActivities(saved.weekendActivities);
      }
      if (!conflictHandling && saved.conflictHandling) {
        setConflictHandling(saved.conflictHandling);
      }
      if (coreValues.length === 0 && saved.coreValues && Array.isArray(saved.coreValues)) {
        setCoreValues(saved.coreValues);
      }
    }
    dataLoadedRef.current = true;
  }, []);

  // Use submit hook
  const { handleSubmit, isSubmitting, error } = useOnboardingSubmit<
    { weekendActivities: string; coreValues: string[]; conflictHandling: string }
  >(
    (data) => onboardingService.submitBackgroundSeriesSix(data, ''),
    '/onboarding/background-series-seven'
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weekendValidation = validateRequired(weekendActivities, 'weekend activities');
    if (!weekendValidation.isValid) {
      showValidationError('Please tell us how you spend your weekends. We\'d love to know what brings you joy!');
      return;
    }

    if (coreValues.length !== 3) {
      const message = coreValues.length < 3 
        ? `Please select 3 core values. You've selected ${coreValues.length} so far.`
        : `Please select exactly 3 core values. You've selected ${coreValues.length}.`;
      showValidationError(message);
      return;
    }

    const conflictValidation = validateRequired(conflictHandling, 'conflict handling style');
    if (!conflictValidation.isValid) {
      showValidationError('Please tell us how you handle conflict. This helps us understand your communication style!');
      return;
    }

    handleSubmit({ weekendActivities, coreValues, conflictHandling }, e);
  };

  // List of values (pills)
  const valueOptions = [
    "Love",
    "Loyalty",
    "Honesty",
    "Kindness",
    "Growth",
    "Compassion",
    "Patience",
    "Ambition",
    "Stability",
    "Creativity",
    "Openness",
    "Simplicity",
  ];

  const toggleValue = (item: string) => {
    if (coreValues.includes(item)) {
      setCoreValues(coreValues.filter((v) => v !== item));
    } else {
      if (coreValues.length >= 3) return; // limit to 3
      setCoreValues([...coreValues, item]);
    }
  };

  return (
  <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center 
  pt-24 pb-10 md:py-20 px-4">


      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute left-6 top-6 p-2 rounded-md text-[#702C3E] hover:bg-white/60 z-40"
      >
        <FaArrowLeft className="w-5 h-5" />
      </button>

      {/* Language Switcher */}
      <div className="absolute right-6 top-6">
        <LanguageSwitcher />
      </div>

      {/* Outer Card */}
      <div className="
        w-full max-w-3xl md:max-w-4xl lg:max-w-1xl
        bg-[#EDD4D3] 
        border-2 border-white 
        rounded-2xl 
        py-10 px-6 md:px-20
        shadow-md 
      ">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <Image src={logo} alt="Logo" className="w-14 opacity-90" />
        </div>

        {/* Progress Bar */}
        <StepProgressBar className="mb-10" />

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
          Personality & Lifestyle
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-[#5A4A4A] max-w-lg mb-6 leading-relaxed font-medium">
          Every journey to love begins with understanding yourself. These questions aren’t tests — they're a way to see what matters to you and the partner who truly resonates.
        </p>

        {/* MAIN FORM BODY */}
        <form onSubmit={onSubmit} className="p-0 md:p-0 flex flex-col gap-12 bg-[#EDD4D3]/60 rounded-xl">

          {/* WEEKENDS */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] text-sm font-medium">
              Let’s explore your lifestyle.
            </p>

            <label className="text-base text-[#491A26] font-semibold">
              How do you usually spend your weekends?
            </label>

            <div className="flex flex-col gap-3">

              {[
                "Quiet at home",
                "Socializing",
                "Outdoors",
                "Hobbies or studying",
              ].map((option) => (
                <label
                  key={option}
                  onClick={() => setWeekendActivities(option)}
                  className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="weekend"
                    checked={weekendActivities === option}
                    onChange={() => setWeekendActivities(option)}
                    className="w-4 h-4 accent-[#702C3E]"
                  />
                  <span className="text-sm text-[#491A26] ml-3">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* VALUES */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] text-sm font-medium">If you had to pick,</p>

            <label className="text-base text-[#491A26] font-semibold">
              Which three values guide your life the most?
            </label>

            <div className="flex flex-wrap gap-3 mt-2">
              {valueOptions.map((item) => {
                const active = coreValues.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleValue(item)}
                    className={`
                      px-4 py-2 rounded-full border text-sm transition
                      ${
                        active
                          ? "bg-[#702C3E] text-white border-[#702C3E]"
                          : "bg-[#F6E7EA] text-[#491A26] border-[#E4D6D6]"
                      }
                    `}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONFLICT HANDLING */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] text-sm font-medium">
              What about this matter?
            </p>

            <label className="text-base text-[#491A26] font-semibold">
              How do you tend to handle conflict?
            </label>

            <div className="flex flex-col gap-3">
              {["Talk it out", "Take space", "Avoid it", "Stay calm"].map(
                (option) => (
                  <label
                    key={option}
                    onClick={() => setConflictHandling(option)}
                    className="
                      w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                      rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                      hover:brightness-105 transition
                    "
                  >
                    <input
                      type="radio"
                      name="conflict"
                      checked={conflictHandling === option}
                      onChange={() => setConflictHandling(option)}
                      className="w-4 h-4 accent-[#702C3E]"
                    />
                    <span className="text-sm text-[#491A26] ml-3">{option}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                bg-[#702C3E] text-white px-8 py-3 rounded-md
                flex items-center gap-2 hover:bg-[#5E2333] transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? 'Submitting...' : 'Next'} <FiArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* FOOTER */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </section>
  );
}
