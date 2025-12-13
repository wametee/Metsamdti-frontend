"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import EmotionalCompleteModal from "@/components/modal/EmotionalCompleteModal";

export default function EmotionalSeriesFive() {
  const router = useRouter();

  const [styleSafe, setStyleSafe] = useState("");
  const [approachNatural, setApproachNatural] = useState("");
  const [relationshipValue, setRelationshipValue] = useState("");
  const [isEmotionalCompleteOpen, setIsEmotionalCompleteOpen] = useState(false);

  const styleOptions = [
    "Direct and clear",
    "Gentle and layered",
  ];

  const approachOptions = [
    "Structured and predictable",
    "Flexible and spontaneous",
  ];

  const relationshipOptions = [
    "Stable and harmonious",
    "Deep and emotionally rich",
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
          {/* Estimated 75% progress */}
          <div className="h-full w-[75%] bg-[#702C3E] rounded-full"></div>
        </div>

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
        <div className="p-0 md:p-0 flex flex-col gap-12 bg-[#EDD4D3]/60 rounded-xl">

          {/* QUESTION 1 */}
          <div className="flex flex-col gap-4">
            <p className="text-base text-[#491A26] font-semibold mb-0">
              What communication style feels safest to your heart?
            
            </p>
              <p className="text-[#5A5959] font-medium text-sm mb-0">
                         Which one makes you feel understood?
                        </p>

            <div className="flex flex-col gap-3">
              {styleOptions.map((option) => (
                <label
                  key={option}
                  onClick={() => setStyleSafe(option)}
                  className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="styleSafe"
                    checked={styleSafe === option}
                    onChange={() => setStyleSafe(option)}
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
              Which approach to life feels more natural to you?
             
            </p>

              <p className="text-[#5A5959] font-medium text-sm mb-0">
              Think of your energy — do you like clarity or freedom?
            </p>

            <div className="flex flex-col gap-3">
              {approachOptions.map((option) => (
                <label
                  key={option}
                  onClick={() => setApproachNatural(option)}
                  className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="approachNatural"
                    checked={approachNatural === option}
                    onChange={() => setApproachNatural(option)}
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
              What kind of relationship do you value most?
            </p>

              <p className="text-[#5A5959] font-medium text-sm mb-0">
             Imagine the partnership that feels “right” to your soul.
            </p>

            <div className="flex flex-col gap-3">
              {relationshipOptions.map((option) => (
                <label
                  key={option}
                  onClick={() => setRelationshipValue(option)}
                  className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="relationshipValue"
                    checked={relationshipValue === option}
                    onChange={() => setRelationshipValue(option)}
                    className="w-4 h-4 accent-[#702C3E]"
                  />
                  <span className="text-base text-[#491A26] ml-3 font-semibold">{option}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* NEXT BUTTON */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setIsEmotionalCompleteOpen(true)}
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

      {/* Emotional completion modal */}
      <EmotionalCompleteModal
        isOpen={isEmotionalCompleteOpen}
        onClose={() => setIsEmotionalCompleteOpen(false)}
        onSubmit={() => {
          setIsEmotionalCompleteOpen(false);
          router.push("/onboarding/complete-application");
        }}
      />
    </section>
  );
}
