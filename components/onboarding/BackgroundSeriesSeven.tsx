"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function BackgroundSeriesSeven() {
  const router = useRouter();

  const [loveLanguage, setLoveLanguage] = useState("");
  const [understood, setUnderstood] = useState("");

  const loveOptions = [
    "Words",
    "Acts",
    "Touch",
    "Quality time",
    "Gifts",
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

        {/* Progress Bar (90%) */}
        <div className="w-full h-1.5 bg-[#E7D3D1] rounded-full mb-10">
          <div className="h-full w-[90%] bg-[#702C3E] rounded-full"></div>
        </div>

        {/* Title */}
         <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
          Personality & Lifestyle
        </h2>

        {/* Subtitle */}
               <p className="text-sm text-[#5A4A4A] max-w-lg mb-6 leading-relaxed font-medium">
          Every journey to love begins with understanding yourself. These questions aren’t tests — they're a way to see what matters to you and the partner who truly resonates.
        </p>

        {/* FORM CARD */}
        <div className="p-0 md:p-0 flex flex-col gap-12 bg-[#EDD4D3]/60 rounded-xl">

          {/* LOVE LANGUAGE */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] text-sm font-medium">
              I’m curious.
            </p>

            <label className="text-base text-[#491A26] font-semibold">
              Which love language resonates most with you?
            </label>

            <div className="flex flex-col gap-3">
              {loveOptions.map((option) => (
                <label
                  key={option}
                  onClick={() => setLoveLanguage(option)}
                  className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="love-language"
                    checked={loveLanguage === option}
                    onChange={() => setLoveLanguage(option)}
                    className="w-4 h-4 accent-[#702C3E]"
                  />
                  <span className="text-sm text-[#491A26] ml-3">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ONE THING YOU WISH OTHERS UNDERSTOOD */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] text-sm font-medium">
              I like questions that make us think.
            </p>

            <label className="text-base text-[#491A26] font-semibold">
              What is one thing you wish others understood about you?
            </label>

            <textarea
              placeholder="Share something meaningful — there’s room to write"
              value={understood}
              onChange={(e) => setUnderstood(e.target.value)}
              rows={5}
              className="
                w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                rounded-md py-3 px-4 text-sm text-black outline-none resize-y min-h-24
              "
            />
          </div>

        </div>

        {/* NEXT BUTTON */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => router.push("/onboarding/background-series-eight")}
            className="
              bg-[#702C3E] text-white px-8 py-3 rounded-md
              flex items-center gap-2 hover:bg-[#5E2333] transition
            "
          >
            Next <FiArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </section>
  );
}
