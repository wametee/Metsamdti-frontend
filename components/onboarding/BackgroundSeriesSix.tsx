"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/logo2.png";

export default function BackgroundSeriesSix() {
  const router = useRouter();

  // State
  const [weekend, setWeekend] = useState("");
  const [conflict, setConflict] = useState("");
  const [values, setValues] = useState<string[]>([]);

  // List of values (pills)
  const valueOptions = [
    "Love",
    "Loyalty",
    "Honesty",
    "Kindness",
    "Growth",
    "Compassion",
    "Patience",
    "Ambition",
    "Stability",
    "Creativity",
    "Openness",
    "Simplicity",
  ];

  const toggleValue = (item: string) => {
    if (values.includes(item)) {
      setValues(values.filter((v) => v !== item));
    } else {
      if (values.length >= 3) return; // limit to 3
      setValues([...values, item]);
    }
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

        {/* Progress Bar (80%) */}
        <div className="w-full h-1.5 bg-[#E7D3D1] rounded-full mb-10">
          <div className="h-full w-[80%] bg-[#702C3E] rounded-full"></div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-[#491A26] mb-3">
          Personality & Lifestyle
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-[#5A4A4A] max-w-lg mb-10 leading-relaxed">
          Every journey to love begins with understanding yourself. These questions aren’t tests — they're a way to see what matters to you and the partner who truly resonates.
        </p>

        {/* MAIN FORM BODY */}
        <div className="p-6 md:p-8 flex flex-col gap-12 bg-[#EDD4D3]/60 rounded-xl">

          {/* WEEKENDS */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] font-normal text-[18px]">
              Let’s explore your lifestyle.
            </p>

            <label className="text-sm text-[#491A26]">
              How do you usually spend your weekends?
            </label>

            <div className="flex flex-col gap-3">

              {[
                "Quiet at home",
                "Socializing",
                "Outdoors",
                "Hobbies or studying",
              ].map((option) => (
                <label
                  key={option}
                  onClick={() => setWeekend(option)}
                  className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name="weekend"
                    checked={weekend === option}
                    onChange={() => setWeekend(option)}
                    className="w-4 h-4 accent-[#702C3E]"
                  />
                  <span className="text-sm text-[#491A26] ml-3">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* VALUES */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] font-normal text-[18px]">If you had to pick,</p>

            <label className="text-sm text-[#491A26]">
              Which three values guide your life the most?
            </label>

            <div className="flex flex-wrap gap-3 mt-2">
              {valueOptions.map((item) => {
                const active = values.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleValue(item)}
                    className={`
                      px-4 py-2 rounded-full border text-sm transition
                      ${
                        active
                          ? "bg-[#702C3E] text-white border-[#702C3E]"
                          : "bg-[#F6E7EA] text-[#491A26] border-[#E4D6D6]"
                      }
                    `}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONFLICT HANDLING */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] font-normal text-[18px]">
              What about this matter?
            </p>

            <label className="text-sm text-[#491A26]">
              How do you tend to handle conflict?
            </label>

            <div className="flex flex-col gap-3">
              {["Talk it out", "Take space", "Avoid it", "Stay calm"].map(
                (option) => (
                  <label
                    key={option}
                    onClick={() => setConflict(option)}
                    className="
                      w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                      rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                      hover:brightness-105 transition
                    "
                  >
                    <input
                      type="radio"
                      name="conflict"
                      checked={conflict === option}
                      onChange={() => setConflict(option)}
                      className="w-4 h-4 accent-[#702C3E]"
                    />
                    <span className="text-sm text-[#491A26] ml-3">{option}</span>
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        {/* NEXT BUTTON */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => router.push("/onboarding/background-series-seven")}
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
