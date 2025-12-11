
"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import { FiArrowUpRight } from 'react-icons/fi';

export default function BackgroundSeriesOne() {
  const router = useRouter();
  const [gender, setGender] = useState<string>('');
  const [languages, setLanguages] = useState<string>('');

  return (
    <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center py-10 md:py-20 px-4">

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
          {/* 40% progress for step 2 */}
          <div className="h-full w-[40%] bg-[#702C3E] rounded-full"></div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-[#491A26] mb-3">
          Background & Identity
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-[#5A4A4A] max-w-lg mb-6 leading-relaxed">
          Everyone has a story. Share a bit about your background and identity so your 
          matches understand you better. These details help us find the most meaningful 
          connections for you.
        </p>

        {/* Form Container */}
        <div className=" p-6 md:p-8 flex flex-col gap-10 bg-[#EDD4D3]/60">

          {/* AGE */}
          <p className="text-[#5A5959] font-normal text-[18px] mb-1">Hello! Just for context.</p>
          <div className="flex flex-col gap-3">
            <label className="text-sm text-[#491A26] mb-2">
              How old are you?
            </label>
            <input
              type="number"
              placeholder="Enter your age"
              className="w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-black outline-none"
            />
        
          </div>


            {/* GENDER */}
            <p className="text-[#5A5959] font-normal text-[18px] mb-1">I hope you don’t mind me asking.</p>
            <div className="w-full gap-3">
            <label className="text-sm text-[#491A26] mb-4 block">
                What gender do you identify with?
            </label>

            <div className="flex flex-col gap-3">

                {/* Male */}
                <label
                onClick={() => setGender("Male")}
                className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4
                    flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                "
                >
        <input
          type="radio"
          name="gender"
          checked={gender === "Male"}
          onChange={() => setGender("Male")}
          className="w-4 h-4 accent-[#702C3E]"
        />
        <span className="text-sm text-[#491A26] ml-3">Male</span>
                </label>

                {/* Female */}
                <label
                onClick={() => setGender("Female")}
                className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4
                    flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                "
                >
        <input
          type="radio"
          name="gender"
          checked={gender === "Female"}
          onChange={() => setGender("Female")}
          className="w-4 h-4 accent-[#702C3E]"
        />
        <span className="text-sm text-[#491A26] ml-3">Female</span>
                </label>

               

            </div>
            </div>

      
  {/* LANGUAGES */}
  <p className="text-[#5A5959] font-normal text-[18px] mb-1">And tell me,</p>
<div className="w-full mt-2">
  <label className="text-sm text-[#491A26] mb-3 block">
    How many languages do you speak fluently?
  </label>

  <div className="flex flex-col gap-3">

    {/* One */}
    <label
      onClick={() => setLanguages("One")}
      className="
        w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
        rounded-md py-3 px-4
        flex items-center gap-3 cursor-pointer
        hover:brightness-105 transition
      "
    >
      <input
        type="radio"
        name="lang"
        checked={languages === "One"}
        onChange={() => setLanguages("One")}
        className="w-4 h-4 accent-[#702C3E]"
      />
      <span className="text-sm text-[#491A26] ml-3">One</span>
    </label>

    {/* Two */}
    <label
      onClick={() => setLanguages("Two")}
      className="
        w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
        rounded-md py-3 px-4
        flex items-center gap-3 cursor-pointer
        hover:brightness-105 transition
      "
    >
      <input
        type="radio"
        name="lang"
        checked={languages === "Two"}
        onChange={() => setLanguages("Two")}
        className="w-4 h-4 accent-[#702C3E]"
      />
      <span className="text-sm text-[#491A26] ml-3">Two</span>
    </label>

    {/* Three or more */}
    <label
      onClick={() => setLanguages("Three or more")}
      className="
        w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
        rounded-md py-3 px-4
        flex items-center gap-3 cursor-pointer
        hover:brightness-105 transition
      "
    >
      <input
        type="radio"
        name="lang"
        checked={languages === "Three or more"}
        onChange={() => setLanguages("Three or more")}
        className="w-4 h-4 accent-[#702C3E]"
      />
      <span className="text-sm text-[#491A26] ml-3">Three or more</span>
    </label>

  </div>
</div>


        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => router.push('/onboarding/background-series-two')}
            className="
              bg-[#702C3E] text-white
              px-8 py-3 rounded-md
              flex items-center gap-2
              hover:bg-[#5E2333] transition
            "
          >
            Next  <FiArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6">
        Your information is safe with us and only used for matchmaking purposes.
      </p>
    </section>
  );
}
