"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import { onboardingService } from '@/services';
import { useOnboardingSubmit } from '@/hooks/useOnboardingSubmit';
import { getOnboardingData } from '@/lib/utils/localStorage';
import { StepProgressBar } from './ProgressBar';
import { showValidationError, validationMessages } from '@/lib/utils/validation';

export default function BackgroundSeriesFive() {
  const router = useRouter();
  const [openToPartnerWithChildren, setOpenToPartnerWithChildren] = useState<"Yes" | "No" | "Depends" | null>(null);
  const [idealMarriageTimeline, setIdealMarriageTimeline] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");

  // Load saved data - only once on mount
  const dataLoadedRef = useRef(false);
  useEffect(() => {
    if (dataLoadedRef.current) return;
    
    const saved = getOnboardingData();
    if (saved) {
      // Only set values if they're not already set (to avoid overwriting user input)
      if (openToPartnerWithChildren === null && saved.openToPartnerWithChildren !== undefined) {
        // Convert boolean to string representation
        if (saved.openToPartnerWithChildren === true) {
          setOpenToPartnerWithChildren("Yes");
        } else if (saved.openToPartnerWithChildren === false) {
          setOpenToPartnerWithChildren("No");
        }
      }
      if (!idealMarriageTimeline && saved.idealMarriageTimeline) {
        setIdealMarriageTimeline(saved.idealMarriageTimeline);
      }
      if (!minAge && !maxAge && saved.preferredAgeRange) {
        setMinAge(saved.preferredAgeRange.min?.toString() || '');
        setMaxAge(saved.preferredAgeRange.max?.toString() || '');
      }
    }
    dataLoadedRef.current = true;
  }, []);

  // Use submit hook
  const { handleSubmit, isSubmitting, error } = useOnboardingSubmit<
    { openToPartnerWithChildren: boolean; preferredAgeRange: { min: number; max: number }; idealMarriageTimeline: string }
  >(
    (data) => onboardingService.submitBackgroundSeriesFive(data, ''),
    '/onboarding/background-series-six'
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (openToPartnerWithChildren === null) {
      showValidationError('Please let us know if you\'re open to a partner with children. This helps us find better matches for you!');
      return;
    }
    
    if (!minAge || !maxAge) {
      showValidationError('Please enter both minimum and maximum age for your preferred partner. This helps us understand your preferences!');
      return;
    }
    
    const minAgeNum = parseInt(minAge);
    const maxAgeNum = parseInt(maxAge);
    
    if (isNaN(minAgeNum) || minAgeNum < 22) {
      showValidationError('The minimum age for a partner must be at least 22 years old. We focus on serious relationships and require users to be 22 or older.');
      return;
    }
    
    if (isNaN(maxAgeNum) || maxAgeNum < minAgeNum) {
      showValidationError('The maximum age must be greater than or equal to the minimum age. Please adjust your age range.');
      return;
    }
    
    if (!idealMarriageTimeline) {
      showValidationError('Please select your ideal timeline for marriage. This helps us understand your relationship goals!');
      return;
    }
    
    // Convert string value to boolean for backend compatibility
    // "Yes" or "Depends" -> true, "No" -> false
    const openToPartnerBoolean = openToPartnerWithChildren === "Yes" || openToPartnerWithChildren === "Depends";
    
    handleSubmit({
      openToPartnerWithChildren: openToPartnerBoolean,
      preferredAgeRange: { min: minAgeNum, max: maxAgeNum },
      idealMarriageTimeline,
    }, e);
  };

  const handleChildrenPreference = (value: "Yes" | "No" | "Depends") => {
    setOpenToPartnerWithChildren(value);
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
          Relationship History & Readiness
        </h2>

        {/* Subtitle */}
               <p className="text-sm text-[#5A4A4A] max-w-lg mb-6 leading-relaxed font-medium">
          Every readiness for love has roots nurtured by what fulfills you and strengthened by what hurts you.
          These questions aren’t tests; they're mirrors, helping us understand the patterns you value in
          relationships.
        </p>

        {/* Form Section */}
        <form onSubmit={onSubmit} className="p-0 md:p-0 flex flex-col gap-10 bg-[#EDD4D3]/60">

          {/* CHILDREN PREFERENCE */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] text-sm font-medium">Just wondering.</p>

            <label className="text-base text-[#491A26] font-semibold">
              Are you open to a partner who has children?
            </label>

            <div className="flex flex-col gap-3">

              {/* No */}
              <label
                onClick={() => handleChildrenPreference("No")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] 
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer 
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="children"
                  checked={openToPartnerWithChildren === "No"}
                  onChange={() => handleChildrenPreference("No")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">No</span>
              </label>

              {/* Yes */}
              <label
                onClick={() => handleChildrenPreference("Yes")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] 
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer 
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="children"
                  checked={openToPartnerWithChildren === "Yes"}
                  onChange={() => handleChildrenPreference("Yes")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">Yes</span>
              </label>

              {/* Depends */}
              <label
                onClick={() => handleChildrenPreference("Depends")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] 
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer 
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="children"
                  checked={openToPartnerWithChildren === "Depends"}
                  onChange={() => handleChildrenPreference("Depends")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">Depends</span>
              </label>

            </div>
          </div>

          {/* AGE RANGE */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] text-sm font-medium">And,</p>

            <label className="text-base text-[#491A26] font-semibold">
              What is your preferred age range for a partner?
            </label>

            <div className="flex flex-col gap-4">

              {/* MIN AGE */}
              <div className="flex flex-col gap-2 w-full md:w-3/4">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      bg-[#F6E7EA] border border-[#E4D6D6] 
                      rounded-md py-3 px-4 w-24 text-sm text-[#491A26]
                    "
                  >
                    Min
                  </div>

                  <input
                    type="number"
                    placeholder="e.g., 30"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    min="22"
                    className="
                      flex-1 bg-[#F6E7EA] border border-[#E4D6D6]
                      rounded-md py-3 px-4 text-sm text-black outline-none
                    "
                  />
                </div>
                <p className="text-xs text-[#6B5B5B] ml-28">
                  Minimum age is 22 years old
                </p>
              </div>

              {/* MAX AGE */}
              <div className="flex items-center gap-3 w-full md:w-3/4">
                <div
                  className="
                    bg-[#F6E7EA] border border-[#E4D6D6] 
                    rounded-md py-3 px-4 w-24 text-sm text-[#491A26]
                  "
                >
                  Max
                </div>

                <input
                  type="number"
                  placeholder="e.g., 50"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  min={minAge || "22"}
                  className="
                    flex-1 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 text-sm text-black outline-none
                  "
                />
              </div>

            </div>
          </div>

          {/* TIMELINE FOR MARRIAGE */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] text-sm font-medium">
              Regarding your intentions,
            </p>

            <label className="text-base text-[#491A26] font-semibold">
              What is your ideal timeline for marriage?
            </label>

            <div className="flex flex-col gap-3">

              {/* 1 year */}
              <label
                onClick={() => setIdealMarriageTimeline("1 year")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] 
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer 
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="timeline"
                  checked={idealMarriageTimeline === "1 year"}
                  onChange={() => setIdealMarriageTimeline("1 year")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">1 year</span>
              </label>

              {/* 1–2 years */}
              <label
                onClick={() => setIdealMarriageTimeline("1–2 years")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] 
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer 
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="timeline"
                  checked={idealMarriageTimeline === "1–2 years"}
                  onChange={() => setIdealMarriageTimeline("1–2 years")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">1–2 years</span>
              </label>

              {/* Open-ended */}
              <label
                onClick={() => setIdealMarriageTimeline("Open-ended")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] 
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer 
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="timeline"
                  checked={idealMarriageTimeline === "Open-ended"}
                  onChange={() => setIdealMarriageTimeline("Open-ended")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">Open-ended</span>
              </label>

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

      {/* Footer */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </section>
  );
}
