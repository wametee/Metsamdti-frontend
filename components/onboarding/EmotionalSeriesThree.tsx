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
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';

export default function EmotionalSeriesThree() {
  const router = useRouter();

  // Initialize Google Translate
  useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on emotional-series-three page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  const [confidenceMoments, setConfidenceMoments] = useState("");
  const [showLove, setShowLove] = useState("");

  // Load saved data - only once on mount
  const dataLoadedRef = useRef(false);
  useEffect(() => {
    if (dataLoadedRef.current) return;
    
    const saved = getOnboardingData();
    if (saved) {
      // Only set values if they're not already set (to avoid overwriting user input)
      if (!confidenceMoments && saved.confidenceMoments) {
        setConfidenceMoments(saved.confidenceMoments);
      }
      if (!showLove && saved.showLove) {
        setShowLove(saved.showLove);
      }
    }
    dataLoadedRef.current = true;
  }, []);

  // Use submit hook
  const { handleSubmit, isSubmitting, error } = useOnboardingSubmit<
    { confidenceMoments: string; showLove: string }
  >(
    (data, userId) => onboardingService.submitEmotionalSeriesThree(data, userId),
    '/onboarding/emotional-series-four'
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confidenceMoments || !showLove) {
      alert('Please answer all questions');
      return;
    }
    handleSubmit({ confidenceMoments, showLove }, e);
  };

  const confidenceOptions = [
    "After completing tasks or goals",
    "When receiving value from people or situations",
  ];

  const showLoveOptions = [
    "I show love through actions and doing things",
    "I express love with words and affirmations",
  ];

  return (
   <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center 
  pt-24 pb-10 md:py-20 px-4">
      {/* Hidden Google Translate Element - must exist for translation to work */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}></div>

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
          Reflective Emotional Compatibility
        </h2>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-[#5A4A4A] max-w-lg mb-6 leading-relaxed font-medium">
          Emotional compatibility is about understanding how you feel, respond, and connect.
          These questions are invitations to be open and reflect on your emotional rhythms — not to choose quickly, but to discover gently.
        </p>

        {/* FORM CARD */}
        <form onSubmit={onSubmit} className="p-0 md:p-0 flex flex-col gap-12 bg-[#EDD4D3]/60 rounded-xl">

          {/* QUESTION 1 */}
          <div className="flex flex-col gap-4">
            <p className="text-base text-[#491A26] font-semibold mb-0">
              When do you feel most confident in yourself?
            </p>

             <p className="text-[#5A5959] font-medium text-sm mb-0">
                Think of the moments when you feel grounded and strong.
              </p>

            <div className="flex flex-col gap-3">
              {confidenceOptions.map((option) => (
                <label
                  key={option}
                  onClick={() => setConfidenceMoments(option)}
                  className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="confidence"
                    checked={confidenceMoments === option}
                    onChange={() => setConfidenceMoments(option)}
                    className="w-4 h-4 accent-[#702C3E]"
                  />
                  <span className="text-base text-[#491A26] ml-3 font-semibold">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* QUESTION 2 */}
          <div className="flex flex-col gap-4">
            <p className="text-base text-[#491A26] font-semibold mb-0">
              How do you naturally show love?
             
            </p>

            <p className="text-[#5A5959] font-medium text-sm mb-0">
              Think of what you do without even realizing it.
            </p>

            <div className="flex flex-col gap-3">
              {showLoveOptions.map((option) => (
                <label
                  key={option}
                  onClick={() => setShowLove(option)}
                  className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="show-love"
                    checked={showLove === option}
                    onChange={() => setShowLove(option)}
                    className="w-4 h-4 accent-[#702C3E]"
                  />
                  <span className="text-base text-[#491A26] ml-3 font-semibold">{option}</span>
                </label>
              ))}
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
