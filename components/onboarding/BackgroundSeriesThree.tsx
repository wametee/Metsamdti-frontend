"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import { onboardingService } from '@/services';
import { useOnboardingSubmit } from '@/hooks/useOnboardingSubmit';
import { getOnboardingData } from '@/lib/utils/localStorage';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';
import { StepProgressBar } from './ProgressBar';

export default function BackgroundSeriesThree() {
  const router = useRouter();
  const [education, setEducation] = useState("");
  const [occupation, setOccupation] = useState("");

  // Initialize Google Translate
  useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on background-series-three page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  // Load saved data
  useEffect(() => {
    const saved = getOnboardingData();
    if (saved) {
      setEducation(saved.education || '');
      setOccupation(saved.occupation || '');
    }
  }, []);

  // Use submit hook
  const { handleSubmit, isSubmitting, error } = useOnboardingSubmit<
    { education: string; occupation: string }
  >(
    (data, userId) => onboardingService.submitBackgroundSeriesThree(data, userId),
    '/onboarding/background-series-four'
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!education) {
      alert('Please select your education level');
      return;
    }
    if (!occupation.trim()) {
      alert('Please tell us your occupation');
      return;
    }
    handleSubmit({ education, occupation }, e);
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
          Background & Identity
        </h2>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-[#5A4A4A] max-w-lg mb-6 leading-relaxed font-medium">
          Every person has a history. Share your background and upbringing so your 
          matches better understand you. These details help us match you with the 
          right person.
        </p>

        {/* FORM CARD */}
        <form onSubmit={onSubmit} className="p-0 md:p-0 flex flex-col gap-10 bg-[#EDD4D3]/60">

          {/* EDUCATION LEVEL */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] font-medium text-sm mb-0">
              Let’s begin with your past.
            </p>

            <label className="text-base text-[#491A26] font-semibold">
              What is your highest level of education?
            </label>

            <div className="flex flex-col gap-3">

              {/* Primary */}
              <label
                onClick={() => setEducation("Primary")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4
                  flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="education"
                  checked={education === "Primary"}
                  onChange={() => setEducation("Primary")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-base text-[#491A26] ml-3 font-semibold">Primary</span>
              </label>

              {/* Secondary */}
              <label
                onClick={() => setEducation("Secondary")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4
                  flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="education"
                  checked={education === "Secondary"}
                  onChange={() => setEducation("Secondary")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-base text-[#491A26] ml-3 font-semibold">Secondary</span>
              </label>

              {/* University */}
              <label
                onClick={() => setEducation("University")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4
                  flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="education"
                  checked={education === "University"}
                  onChange={() => setEducation("University")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-base text-[#491A26] ml-3 font-semibold">University</span>
              </label>

              {/* Other */}
              <label
                onClick={() => setEducation("Other")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4
                  flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="education"
                  checked={education === "Other"}
                  onChange={() => setEducation("Other")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-base text-[#491A26] ml-3 font-semibold">Other</span>
              </label>
            </div>
          </div>

          {/* OCCUPATION INPUT */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] font-medium text-sm mb-0">
              What do you spend most of your days doing?
            </p>

            <label className="text-base text-[#491A26] font-semibold">
              Tell us your occupation or field of work.
            </label>

            <textarea
              placeholder="Briefly describe your role, company, or field"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              rows={4}
              className="
                w-full md:w-3/4
                bg-[#F6E7EA] border border-[#E4D6D6]
                rounded-md py-3 px-4
                text-sm text-black outline-none resize-y min-h-24
              "
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
              className="
                bg-[#702C3E] text-white
                px-8 py-3 rounded-md
                flex items-center gap-2
                hover:bg-[#5E2333] transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? 'Submitting...' : 'Next'} <FiArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </section>
  );
}
