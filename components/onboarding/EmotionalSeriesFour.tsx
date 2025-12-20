"use client";

import { useState, useEffect } from "react";
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

export default function EmotionalSeriesFour() {
  const router = useRouter();

  const [disagreementResponse, setDisagreementResponse] = useState("");
  const [lovedOneUpsetResponse, setLovedOneUpsetResponse] = useState("");
  const [refillEmotionalEnergy, setRefillEmotionalEnergy] = useState("");

  // Load saved data
  useEffect(() => {
    const saved = getOnboardingData();
    if (saved) {
      setDisagreementResponse(saved.disagreementResponse || '');
      setLovedOneUpsetResponse(saved.lovedOneUpsetResponse || '');
      setRefillEmotionalEnergy(saved.refillEmotionalEnergy || '');
    }
  }, []);

  // Use submit hook
  const { handleSubmit, isSubmitting, error } = useOnboardingSubmit<
    { disagreementResponse: string; lovedOneUpsetResponse: string; refillEmotionalEnergy: string }
  >(
    (data) => onboardingService.submitEmotionalSeriesFour(data, ''),
    '/onboarding/emotional-series-five'
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disagreementResponse || !lovedOneUpsetResponse || !refillEmotionalEnergy) {
      alert('Please answer all questions');
      return;
    }
    handleSubmit({ disagreementResponse, lovedOneUpsetResponse, refillEmotionalEnergy }, e);
  };

  const disagreeOptions = [
    "I try to understand their point of view",
    "I feel challenged and need time to reflect",
  ];

  const upsetOptions = [
    "I give them space to breathe",
    "I stay close and offer comfort",
  ];

  const refillOptions = [
    "Quiet time alone",
    "Being around the people I love",
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
          These questions are an invitation to pause and reflect on your emotional rhythm — 
          not to choose quickly, but to answer honestly.
        </p>

        {/* FORM CARD */}
        <form onSubmit={onSubmit} className="p-0 md:p-0 flex flex-col gap-12 bg-[#EDD4D3]/60 rounded-xl">

          {/* QUESTION 1 */}
          <div className="flex flex-col gap-4">
            <p className="text-base text-[#491A26] font-semibold mb-0">
              When someone disagrees with you, what happens inside you?
             
            </p>
              <p className="text-[#5A5959] font-medium text-sm mb-0">
              Consider your honest emotional reaction.
            </p>

            <div className="flex flex-col gap-3">
              {disagreeOptions.map((option) => (
                <label
                  key={option}
                  onClick={() => setDisagreementResponse(option)}
                  className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="disagree"
                    checked={disagreementResponse === option}
                    onChange={() => setDisagreementResponse(option)}
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
              When someone you love is upset, how do you respond?
             
            </p>

              <p className="text-[#5A5959] font-medium text-sm mb-0">
              Picture yourself in that moment — what do you do first?
            </p>

            <div className="flex flex-col gap-3">
              {upsetOptions.map((option) => (
                <label
                  key={option}
                  onClick={() => setLovedOneUpsetResponse(option)}
                  className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="upset"
                    checked={lovedOneUpsetResponse === option}
                    onChange={() => setLovedOneUpsetResponse(option)}
                    className="w-4 h-4 accent-[#702C3E]"
                  />
                  <span className="text-base text-[#491A26] ml-3 font-semibold">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* QUESTION 3 */}
          <div className="flex flex-col gap-4">
           <p className="text-base text-[#491A26] font-semibold mb-0">
              What helps you refill your emotional energy?
             
            </p>
              <p className="text-[#5A5959] font-medium text-sm mb-0">
              Look at your patterns — when do you feel most restored?
            </p>

            <div className="flex flex-col gap-3">
              {refillOptions.map((option) => (
                <label
                  key={option}
                  onClick={() => setRefillEmotionalEnergy(option)}
                  className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="refill"
                    checked={refillEmotionalEnergy === option}
                    onChange={() => setRefillEmotionalEnergy(option)}
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

      {/* Footer */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </section>
  );
}
