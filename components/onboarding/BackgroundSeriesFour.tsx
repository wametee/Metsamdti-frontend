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

export default function BackgroundSeriesFour() {
  const router = useRouter();
  const [previouslyMarried, setPreviouslyMarried] = useState<boolean | null>(null);
  const [hasChildren, setHasChildren] = useState<"Yes" | "No" | "Prefer not to say" | null>(null);

  // Load saved data - only once on mount
  const dataLoadedRef = useRef(false);
  useEffect(() => {
    if (dataLoadedRef.current) return;
    
    const saved = getOnboardingData();
    if (saved) {
      // Only set values if they're not already set (to avoid overwriting user input)
      if (previouslyMarried === null && saved.previouslyMarried !== undefined) {
        setPreviouslyMarried(saved.previouslyMarried);
      }
      if (hasChildren === null && saved.hasChildren !== undefined) {
        // Convert boolean to string representation
        if (saved.hasChildren === true) {
          setHasChildren("Yes");
        } else if (saved.hasChildren === false) {
          setHasChildren("No");
        } else {
          setHasChildren(null);
        }
      }
    }
    dataLoadedRef.current = true;
  }, []);

  // Use submit hook
  const { handleSubmit, isSubmitting, error } = useOnboardingSubmit<
    { previouslyMarried: boolean; hasChildren: boolean }
  >(
    (data) => onboardingService.submitBackgroundSeriesFour(data, ''),
    '/onboarding/background-series-five'
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (previouslyMarried === null) {
      alert('Please answer if you have been married before');
      return;
    }
    if (hasChildren === null) {
      alert('Please answer if you have children');
      return;
    }
    
    // Convert string value to boolean for backend compatibility
    // "Yes" -> true, "No" or "Prefer not to say" -> false
    const hasChildrenBoolean = hasChildren === "Yes";
    
    handleSubmit({ previouslyMarried, hasChildren: hasChildrenBoolean }, e);
  };

  const handleMaritalStatus = (value: string) => {
    setPreviouslyMarried(value !== "No");
  };

  const handleChildren = (value: "Yes" | "No" | "Prefer not to say") => {
    setHasChildren(value);
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
          Every relationship we form is rooted in your life’s path, joys, and challenges — 
          your personal story matters. Share a little about your relationship history 
          so your matches better understand the context you come with.
        </p>

        {/* FORM AREA */}
        <form onSubmit={onSubmit} className="p-0 md:p-0 flex flex-col gap-10 bg-[#EDD4D3]/60">

          {/* MARRIAGE HISTORY */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] text-sm font-medium">
                Let’s gently touch on your past.
              </p>

              <label className="text-base text-[#491A26] font-semibold">
                Have you been married before?
              </label>

            <div className="flex flex-col gap-3">

              {/* No */}
              <label
                onClick={() => handleMaritalStatus("No")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4
                  flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="marital"
                  checked={previouslyMarried === false}
                  onChange={() => handleMaritalStatus("No")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">No</span>
              </label>

              {/* Divorced */}
              <label
                onClick={() => handleMaritalStatus("Divorced")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="marital"
                  checked={previouslyMarried === true}
                  onChange={() => handleMaritalStatus("Divorced")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">Yes (Divorced/Widowed)</span>
              </label>

            </div>
          </div>

          {/* CHILDREN QUESTION */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] text-sm font-medium">
              Tell me a bit about your family.
            </p>

            <label className="text-base text-[#491A26] font-semibold">
              Do you have children?
            </label>

            <div className="flex flex-col gap-3">

              {/* No */}
              <label
                onClick={() => handleChildren("No")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA]
                  border border-[#E4D6D6]
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="children"
                  checked={hasChildren === "No"}
                  onChange={() => handleChildren("No")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">No</span>
              </label>

              {/* Yes */}
              <label
                onClick={() => handleChildren("Yes")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA]
                  border border-[#E4D6D6]
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="children"
                  checked={hasChildren === "Yes"}
                  onChange={() => handleChildren("Yes")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">Yes</span>
              </label>

              {/* Prefer not to say */}
              <label
                onClick={() => handleChildren("Prefer not to say")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA]
                  border border-[#E4D6D6]
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="children"
                  checked={hasChildren === "Prefer not to say"}
                  onChange={() => handleChildren("Prefer not to say")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">Prefer not to say</span>
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
