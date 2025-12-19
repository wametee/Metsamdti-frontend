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

export default function BackgroundSeriesEight() {
  const router = useRouter();

  const [faithImportance, setFaithImportance] = useState("");
  const [genderRolesInMarriage, setGenderRolesInMarriage] = useState("");

  // Load saved data
  useEffect(() => {
    const saved = getOnboardingData();
    if (saved) {
      setFaithImportance(saved.faithImportance || '');
      setGenderRolesInMarriage(saved.genderRolesInMarriage || '');
    }
  }, []);

  // Use submit hook
  const { handleSubmit, isSubmitting, error } = useOnboardingSubmit<
    { faithImportance: string; genderRolesInMarriage: string }
  >(
    (data) => onboardingService.submitBackgroundSeriesEight(data, ''),
    '/onboarding/background-series-nine'
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faithImportance) {
      alert('Please select how important faith is to you');
      return;
    }
    if (!genderRolesInMarriage) {
      alert('Please select your thoughts on gender roles');
      return;
    }
    handleSubmit({ faithImportance, genderRolesInMarriage }, e);
  };

  const faithOptions = ["Very important", "Somewhat", "Not important"];

  const genderRoleOptions = [
    "Traditional",
    "Equal partnership",
    "Flexible",
    "Not sure",
  ];

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

        {/* Progress Bar (approx 80%) */}
        <div className="w-full h-1.5 bg-[#E7D3D1] rounded-full mb-10">
          <div className="h-full w-[80%] bg-[#702C3E] rounded-full"></div>
        </div>

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

        {/* FORM CARD */}
        <form onSubmit={onSubmit} className="p-0 md:p-0 flex flex-col gap-12 bg-[#EDD4D3]/60 rounded-xl">

          {/* FIRST SERIES */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] text-sm font-medium">I like hearing different perspectives.</p>

            <label className="text-base text-[#491A26] font-semibold">
              How important is faith or spirituality in your life?
            </label>

            <div className="flex flex-col gap-3">
              {faithOptions.map((option) => (
                <label
                  key={option}
                  onClick={() => setFaithImportance(option)}
                  className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="faith"
                    checked={faithImportance === option}
                    onChange={() => setFaithImportance(option)}
                    className="w-4 h-4 accent-[#702C3E]"
                  />
                  <span className="text-sm text-[#491A26] ml-3">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SECOND SERIES */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] text-sm font-medium">And...</p>

            <label className="text-base text-[#491A26] font-semibold">
              What are your thoughts on gender roles within a marriage?
            </label>

            <div className="flex flex-col gap-3">
              {genderRoleOptions.map((option) => (
                <label
                  key={option}
                  onClick={() => setGenderRolesInMarriage(option)}
                  className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="gender-roles"
                    checked={genderRolesInMarriage === option}
                    onChange={() => setGenderRolesInMarriage(option)}
                    className="w-4 h-4 accent-[#702C3E]"
                  />
                  <span className="text-sm text-[#491A26] ml-3">{option}</span>
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
