"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import { useState as useStateLocal } from "react";
import OnboardingCompleteModal from "../modal/OnboardingCompleteModal";

export default function BackgroundSeriesNine() {
  const router = useRouter();
  const [culturePref, setCulturePref] = useState("");
  const [futureFamily, setFutureFamily] = useState("");
  const [dealBreaker, setDealBreaker] = useState("");
  const [isCompleteOpen, setIsCompleteOpen] = useStateLocal(false);

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
        <div className="w-full h-1.5 bg-[#E7D3D1] rounded-full mb-10">
          <div className="h-full w-[75%] bg-[#702C3E] rounded-full"></div>
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

        {/* FORM CONTAINER */}
        <div className="p-0 md:p-0 flex flex-col gap-10 bg-[#EDD4D3]/60 rounded-xl">

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
                  onClick={() => setCulturePref(opt.value)}
                  className="w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer hover:brightness-105 transition"
                >
                  <input
                    type="radio"
                    name="culturePref"
                    checked={culturePref === opt.value}
                    onChange={() => setCulturePref(opt.value)}
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

            <input
              type="text"
              placeholder="Short answer"
              value={futureFamily}
              onChange={(e) => setFutureFamily(e.target.value)}
              className="w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-black outline-none"
            />
          </div>

          {/* QUESTION 3 */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] text-sm font-medium">Finally,</p>

            <label className="text-base text-[#491A26]">What is your biggest relationship deal-breaker?</label>

            <input
              type="text"
              placeholder="Short answer"
              value={dealBreaker}
              onChange={(e) => setDealBreaker(e.target.value)}
              className="w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-black outline-none"
            />
          </div>

        </div>

        {/* Next Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setIsCompleteOpen(true)}
            className="bg-[#702C3E] text-white px-8 py-3 rounded-md flex items-center gap-2 hover:bg-[#5E2333] transition"
          >
            Next <FiArrowUpRight className="w-4 h-4" />
          </button>
        </div>
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
