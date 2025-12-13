"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/logo2.png";

export default function BackgroundSeriesThree() {
  const router = useRouter();
  const [education, setEducation] = useState("");

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

        {/* Progress Bar (50%) */}
       <div className="w-full md:w-11/12 lg:w-10/12 h-2 md:h-3 bg-[#F6E7EA] rounded-full mb-10 md:mb-12 px-2 ml-0">
                 {/* 50% progress for step 2 - responsive fill widths */}
                 <div className="h-full w-[50%] md:w-[30%] lg:w-[24%] bg-[#702C3E] rounded-full"></div>
               </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
          Background & Identity
        </h2>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-[#5A4A4A] max-w-lg mb-6 leading-relaxed font-medium">
          Every person has a history. Share your background and upbringing so your 
          matches better understand you. These details help us match you with the 
          right person.
        </p>

        {/* FORM CARD */}
        <div className="p-0 md:p-0 flex flex-col gap-10 bg-[#EDD4D3]/60">

          {/* EDUCATION LEVEL */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] font-medium text-sm mb-0">
              Let’s begin with your past.
            </p>

            <label className="text-base text-[#491A26] font-semibold">
              What is your highest level of education?
            </label>

            <div className="flex flex-col gap-3">

              {/* Primary */}
              <label
                onClick={() => setEducation("Primary")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4
                  flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="education"
                  checked={education === "Primary"}
                  onChange={() => setEducation("Primary")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-base text-[#491A26] ml-3 font-semibold">Primary</span>
              </label>

              {/* Secondary */}
              <label
                onClick={() => setEducation("Secondary")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4
                  flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="education"
                  checked={education === "Secondary"}
                  onChange={() => setEducation("Secondary")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-base text-[#491A26] ml-3 font-semibold">Secondary</span>
              </label>

              {/* University */}
              <label
                onClick={() => setEducation("University")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4
                  flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="education"
                  checked={education === "University"}
                  onChange={() => setEducation("University")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-base text-[#491A26] ml-3 font-semibold">University</span>
              </label>

              {/* Other */}
              <label
                onClick={() => setEducation("Other")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4
                  flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="education"
                  checked={education === "Other"}
                  onChange={() => setEducation("Other")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-base text-[#491A26] ml-3 font-semibold">Other</span>
              </label>
            </div>
          </div>

          {/* OCCUPATION INPUT */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] font-medium text-sm mb-0">
              What do you spend most of your days doing?
            </p>

            <label className="text-base text-[#491A26] font-semibold">
              Tell us your occupation or field of work.
            </label>

            <input
              type="text"
              placeholder="Short answer"
              className="
                w-full md:w-3/4
                bg-[#F6E7EA] border border-[#E4D6D6]
                rounded-md py-3 px-4
                text-sm text-black outline-none
              "
            />
          </div>

        </div>

        {/* Next Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => router.push('/onboarding/background-series-four')}
            className="
              bg-[#702C3E] text-white
              px-8 py-3 rounded-md
              flex items-center gap-2
              hover:bg-[#5E2333] transition
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
