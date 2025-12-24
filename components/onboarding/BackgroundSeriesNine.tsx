"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import OnboardingCompleteModal from "../modal/OnboardingCompleteModal";
import { onboardingService } from '@/services';
import { useOnboardingSubmit } from '@/hooks/useOnboardingSubmit';
import { getOnboardingData } from '@/lib/utils/localStorage';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';
import { StepProgressBar } from './ProgressBar';

export default function BackgroundSeriesNine() {
  const router = useRouter();
  const [preferOwnBackground, setPreferOwnBackground] = useState<boolean | null>(null);
  const [futureFamilyVision, setFutureFamilyVision] = useState("");
  const [biggestDealBreaker, setBiggestDealBreaker] = useState("");
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  // Initialize Google Translate
  useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on background-series-nine page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  // Load saved data
  useEffect(() => {
    const saved = getOnboardingData();
    if (saved) {
      if (saved.preferOwnBackground !== undefined) setPreferOwnBackground(saved.preferOwnBackground);
      setFutureFamilyVision(saved.futureFamilyVision || '');
      setBiggestDealBreaker(saved.biggestDealBreaker || '');
    }
  }, []);

  // Use submit hook
  const { handleSubmit, isSubmitting, error } = useOnboardingSubmit<
    { preferOwnBackground: boolean; futureFamilyVision: string; biggestDealBreaker: string }
  >(
    (data, userId) => onboardingService.submitBackgroundSeriesNine(data, userId),
    '/onboarding/great-start'
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (preferOwnBackground === null) {
      alert('Please answer if you prefer a partner from your own background');
      return;
    }
    if (!futureFamilyVision.trim()) {
      alert('Please describe how you envision your future family life');
      return;
    }
    if (!biggestDealBreaker.trim()) {
      alert('Please tell us your biggest relationship deal-breaker');
      return;
    }
    handleSubmit({ preferOwnBackground, futureFamilyVision, biggestDealBreaker }, e);
    setIsCompleteOpen(true);
  };

  const handleCulturePref = (value: string) => {
    setPreferOwnBackground(value === "Yes");
  };

  return (
  <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center 
    pt-24 pb-10 md:py-20 px-4">
      {/* Hidden Google Translate Element - must exist for translation to work */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}></div>

      {/* Language Toggle - Top Right */}
      <div className="absolute top-6 right-6 text-sm text-[#2F2E2E] z-50">
        <LanguageSwitcher />
      </div>
  
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute left-6 top-6 p-2 rounded-md text-[#702C3E] hover:bg-white/60 z-40"
        >
          <FaArrowLeft className="w-5 h-5" />
        </button>

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
          Faith, Culture & Vision
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-[#5A4A4A] max-w-lg mb-6 leading-relaxed font-medium">
          What you believe, where you come from, and where you’re going all tell a deeper story.
          Recognizing that story is the first step toward finding someone who moves through the world
          with a similar heartbeat.
        </p>

        {/* FORM CONTAINER */}
        <form onSubmit={onSubmit} className="p-0 md:p-0 flex flex-col gap-10 bg-[#EDD4D3]/60 rounded-xl">

          {/* QUESTION 1 */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] text-sm font-medium">When it comes to culture,</p>

            <label className="text-base text-[#491A26] font-semibold">Do you prefer a partner from your own background?</label>

            <div className="flex flex-col gap-3">
              {[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
                { label: "Open to Both", value: "Both" }
              ].map((opt) => (
                <label
                  key={opt.value}
                  onClick={() => handleCulturePref(opt.value)}
                  className="w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer hover:brightness-105 transition"
                >
                  <input
                    type="radio"
                    name="culturePref"
                    checked={(opt.value === "Yes" && preferOwnBackground === true) || 
                             (opt.value === "No" && preferOwnBackground === false) ||
                             (opt.value === "Both" && preferOwnBackground === false)}
                    onChange={() => handleCulturePref(opt.value)}
                    className="w-4 h-4 accent-[#702C3E]"
                  />
                  <span className="text-sm text-[#491A26] ml-3">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* QUESTION 2 */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] text-sm font-medium">Let’s look into your vision.</p>

            <label className="text-base text-[#491A26]">How do you envision your future family life?</label>

            <textarea
              placeholder="Describe how you see family life — values, routines, or hopes"
              value={futureFamilyVision}
              onChange={(e) => setFutureFamilyVision(e.target.value)}
              rows={5}
              className="w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-black outline-none resize-y min-h-24"
              required
            />
          </div>

          {/* QUESTION 3 */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] text-sm font-medium">Finally,</p>

            <label className="text-base text-[#491A26]">What is your biggest relationship deal-breaker?</label>

            <textarea
              placeholder="What would make you end a relationship?"
              value={biggestDealBreaker}
              onChange={(e) => setBiggestDealBreaker(e.target.value)}
              rows={4}
              className="w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-black outline-none resize-y min-h-24"
              required
            />
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
              className="bg-[#702C3E] text-white px-8 py-3 rounded-md flex items-center gap-2 hover:bg-[#5E2333] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Next'} <FiArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </form>
        {/* Completion modal */}
        <OnboardingCompleteModal
          isOpen={isCompleteOpen}
          onClose={() => setIsCompleteOpen(false)}
          onSubmit={() => {
            // close modal and navigate to the dedicated Great Start route
            setIsCompleteOpen(false);
            router.push('/onboarding/great-start');
          }}
        />
      </div>
      

      {/* Footer */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </section>
  );
}
