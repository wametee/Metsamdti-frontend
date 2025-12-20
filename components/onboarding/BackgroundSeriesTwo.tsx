"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import { FiArrowUpRight } from "react-icons/fi";
import { onboardingService } from '@/services';
import { useOnboardingSubmit } from '@/hooks/useOnboardingSubmit';
import { getOnboardingData } from '@/lib/utils/localStorage';
import { StepProgressBar } from './ProgressBar';
import { validateRequired, showValidationError, validationMessages } from '@/lib/utils/validation';

export default function BackgroundSeriesTwo() {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [livingSituation, setLivingSituation] = useState<string>("");
  const [birthLocation, setBirthLocation] = useState<string>("");

  // Load saved data from localStorage
  useEffect(() => {
    const saved = getOnboardingData();
    if (saved) {
      setCurrentLocation(saved.currentLocation || '');
      setLivingSituation(saved.livingSituation || '');
      setBirthLocation(saved.birthLocation || '');
    }
  }, []);

  // Use the reusable submit hook
  const { handleSubmit, isSubmitting, error } = useOnboardingSubmit<
    { currentLocation: string; livingSituation: string; birthLocation: string }
  >(
    (data) => onboardingService.submitBackgroundSeriesTwo(data, ''),
    '/onboarding/background-series-three'
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const locationValidation = validateRequired(currentLocation, 'current location');
    if (!locationValidation.isValid) {
      showValidationError('Please tell us where you currently live. This helps us understand your background better!');
      return;
    }

    const livingSituationValidation = validateRequired(livingSituation, 'living situation');
    if (!livingSituationValidation.isValid) {
      showValidationError('Please select your living situation. We\'d love to learn more about your lifestyle!');
      return;
    }

    const birthLocationValidation = validateRequired(birthLocation, 'birth location');
    if (!birthLocationValidation.isValid) {
      showValidationError('Please tell us where you were born and raised. This helps us understand your cultural background!');
      return;
    }

    handleSubmit({
      currentLocation,
      livingSituation,
      birthLocation,
    }, e);
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
          Background & Identity
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-[#5A4A4A] max-w-lg mb-6 leading-relaxed font-medium">
          Every individual has a history. Share your background and upbringing so your matches better understand you. These details help us match you with those whose experiences complement your own.
        </p>

        {/* Form Container */}
        <form onSubmit={onSubmit} className="p-0 md:p-0 flex flex-col gap-10 bg-[#EDD4D3]/60">

          {/* WHERE DO YOU LIVE */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] font-medium text-sm mb-0">Tell us about home.</p>

            <label className="text-base text-[#491A26] font-semibold">
              Where do you live?
            </label>

            <input
              type="text"
              placeholder="City and country"
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              className="
                w-full md:w-3/4
                bg-[#F6E7EA]
                border border-[#E4D6D6]
                rounded-md py-3 px-4
                text-sm text-black
                outline-none
              "
              required
            />
          </div>

          {/* LIVING SITUATION */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] font-medium text-sm mb-0">
              To understand your world a little better.
            </p>

            <label className="text-base text-[#491A26] mb-2 font-semibold">
              What is your current living situation?
            </label>

            <div className="flex flex-col gap-3">
              {/* Alone */}
              <label
                onClick={() => setLivingSituation("Alone")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4
                  flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="living"
                  checked={livingSituation === "Alone"}
                  onChange={() => setLivingSituation("Alone")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3 font-medium">Alone</span>
              </label>

              {/* With family */}
              <label
                onClick={() => setLivingSituation("With family")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4
                  flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="living"
                  checked={livingSituation === "With family"}
                  onChange={() => setLivingSituation("With family")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3 font-medium">With family</span>
              </label>

              {/* With roommates */}
              <label
                onClick={() => setLivingSituation("With roommates")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4
                  flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="living"
                  checked={livingSituation === "With roommates"}
                  onChange={() => setLivingSituation("With roommates")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3 font-medium">With roommates</span>
              </label>

              {/* Other */}
              <label
                onClick={() => setLivingSituation("Other")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4
                  flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="living"
                  checked={livingSituation === "Other"}
                  onChange={() => setLivingSituation("Other")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3 font-medium">Other</span>
              </label>
            </div>
          </div>

          {/* WHERE WERE YOU BORN */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] font-medium text-sm mb-0">
              I'd love to hear more about your story.
            </p>

            <label className="text-base text-[#491A26] font-semibold">
              Where were you born and raised?
            </label>

            <textarea
              placeholder="Tell us the city, region or stories you'd like to share"
              value={birthLocation}
              onChange={(e) => setBirthLocation(e.target.value)}
              rows={4}
              className="
                w-full md:w-3/4
                bg-[#F6E7EA]
                border border-[#E4D6D6]
                rounded-md py-3 px-4
                text-sm text-black
                outline-none resize-y min-h-24
              "
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
