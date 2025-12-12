"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/logo2.png";

export default function EmotionalSeriesFour() {
  const router = useRouter();

  const [disagree, setDisagree] = useState("");
  const [upset, setUpset] = useState("");
  const [refill, setRefill] = useState("");

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
      <div className="absolute right-6 top-6 text-[#702C3E] text-sm cursor-pointer select-none">
        EN ▾
      </div>

      {/* Outer Card */}
      <div
        className="
          w-full max-w-3xl
          bg-[#EDD4D3]
          border-2 border-white
          rounded-2xl
          py-10 px-6 md:px-12
          shadow-md
        "
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <Image src={logo} alt="Logo" className="w-14 opacity-90" />
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#E7D3D1] rounded-full mb-10">
          {/* Estimated 60% progress */}
          <div className="h-full w-[60%] bg-[#702C3E] rounded-full"></div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-[#491A26] mb-3">
          Reflective Emotional Compatibility
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-[#5A4A4A] max-w-lg mb-10 leading-relaxed">
          Emotional compatibility is about understanding how you feel, respond, and connect.
          These questions are an invitation to pause and reflect on your emotional rhythm — 
          not to choose quickly, but to answer honestly.
        </p>

        {/* FORM CARD */}
        <div className="p-6 md:p-8 flex flex-col gap-12 bg-[#EDD4D3]/60 rounded-xl">

          {/* QUESTION 1 */}
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#491A26]">
              When someone disagrees with you, what happens inside you?
              <span className="block text-[#5A4A4A] text-xs mt-1">
                Consider your honest emotional reaction.
              </span>
            </p>

            <div className="flex flex-col gap-3">
              {disagreeOptions.map((option) => (
                <label
                  key={option}
                  onClick={() => setDisagree(option)}
                  className="
                    w-full bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="disagree"
                    checked={disagree === option}
                    onChange={() => setDisagree(option)}
                    className="w-4 h-4 accent-[#702C3E]"
                  />
                  <span className="text-sm text-[#491A26] ml-3">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* QUESTION 2 */}
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#491A26]">
              When someone you love is upset, how do you respond?
              <span className="block text-[#5A4A4A] text-xs mt-1">
                Picture yourself in that moment — what do you do first?
              </span>
            </p>

            <div className="flex flex-col gap-3">
              {upsetOptions.map((option) => (
                <label
                  key={option}
                  onClick={() => setUpset(option)}
                  className="
                    w-full bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="upset"
                    checked={upset === option}
                    onChange={() => setUpset(option)}
                    className="w-4 h-4 accent-[#702C3E]"
                  />
                  <span className="text-sm text-[#491A26] ml-3">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* QUESTION 3 */}
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#491A26]">
              What helps you refill your emotional energy?
              <span className="block text-[#5A4A4A] text-xs mt-1">
                Look at your patterns — when do you feel most restored?
              </span>
            </p>

            <div className="flex flex-col gap-3">
              {refillOptions.map((option) => (
                <label
                  key={option}
                  onClick={() => setRefill(option)}
                  className="
                    w-full bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="refill"
                    checked={refill === option}
                    onChange={() => setRefill(option)}
                    className="w-4 h-4 accent-[#702C3E]"
                  />
                  <span className="text-sm text-[#491A26] ml-3">{option}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* NEXT BUTTON */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => router.push("/onboarding/emotional-series-five")}
            className="
              bg-[#702C3E] text-white px-8 py-3 rounded-md
              flex items-center gap-2 hover:bg-[#5E2333] transition
            "
          >
            Next <FiArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </section>
  );
}
