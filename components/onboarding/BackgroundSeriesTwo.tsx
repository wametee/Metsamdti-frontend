"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { FiArrowUpRight } from "react-icons/fi";

export default function BackgroundSeriesTwo() {
  const router = useRouter();
  const [living, setLiving] = useState<string>("");
  const [bornRaised, setBornRaised] = useState<string>("");

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

        {/* Progress Bar (taller and padded on md, narrower track on md/lg) */}
             <div className="w-full md:w-11/12 lg:w-10/12 h-2 md:h-3 bg-[#F6E7EA] rounded-full mb-10 md:mb-12 px-2 ml-0">
                 {/* 40% progress for step 2 - responsive fill widths */}
                 <div className="h-full w-[40%] md:w-[30%] lg:w-[24%] bg-[#702C3E] rounded-full"></div>
               </div>
        {/* Title */}
       <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
          Background & Identity
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-[#5A4A4A] max-w-lg mb-6 leading-relaxed font-medium">
          Every individual has a history. Share your background and upbringing so your
          matches better understand you. These details help us match you with those
          whose experiences complement your own.
        </p>

        {/* Form Container */}
        <div className="p-0 md:p-0 flex flex-col gap-10 bg-[#EDD4D3]/60">

          {/* WHERE DO YOU LIVE */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] font-medium text-sm mb-0">Tell us about home.</p>

            <label className="text-base text-[#491A26] font-semibold">
              Where do you live?
            </label>

            <input
              type="text"
              placeholder="City and country"
              className="
                w-full md:w-3/4
                bg-[#F6E7EA]
                border border-[#E4D6D6]
                rounded-md py-3 px-4
                text-sm text-black
                outline-none
              "
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
                onClick={() => setLiving("Alone")}
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
                  checked={living === "Alone"}
                  onChange={() => setLiving("Alone")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3 font-medium">Alone</span>
              </label>

              {/* With family */}
              <label
                onClick={() => setLiving("With family")}
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
                  checked={living === "With family"}
                  onChange={() => setLiving("With family")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3 font-medium">With family</span>
              </label>

              {/* With roommates */}
              <label
                onClick={() => setLiving("With roommates")}
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
                  checked={living === "With roommates"}
                  onChange={() => setLiving("With roommates")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3 font-medium">With roommates</span>
              </label>

              {/* Other */}
              <label
                onClick={() => setLiving("Other")}
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
                  checked={living === "Other"}
                  onChange={() => setLiving("Other")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3 font-medium">Other</span>
              </label>
            </div>
          </div>

          {/* WHERE WERE YOU BORN */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] font-medium text-sm mb-0">
              I’d love to hear more about your story.
            </p>

            <label className="text-base text-[#491A26] font-semibold">
              Where were you born and raised?
            </label>

            <textarea
              placeholder="Tell us the city, region or stories you'd like to share"
              value={bornRaised}
              onChange={(e) => setBornRaised(e.target.value)}
              rows={4}
              className="
                w-full md:w-3/4
                bg-[#F6E7EA]
                border border-[#E4D6D6]
                rounded-md py-3 px-4
                text-sm text-black
                outline-none resize-y min-h-24
              "
            />
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => router.push('/onboarding/background-series-three')}
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
