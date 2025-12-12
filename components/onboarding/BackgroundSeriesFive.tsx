"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/logo2.png";

export default function BackgroundSeriesFive() {
  const router = useRouter();

  const [childrenPreference, setChildrenPreference] = useState("");
  const [timeline, setTimeline] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");

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

        {/* Progress Bar (70%) */}
        <div className="w-full h-1.5 bg-[#E7D3D1] rounded-full mb-10">
          <div className="h-full w-[70%] bg-[#702C3E] rounded-full"></div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-[#491A26] mb-3">
          Relationship History & Readiness
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-[#5A4A4A] max-w-lg mb-6 leading-relaxed">
          Every readiness for love has roots nurtured by what fulfills you and strengthened by what hurts you.
          These questions aren’t tests; they're mirrors, helping us understand the patterns you value in
          relationships.
        </p>

        {/* Form Section */}
        <div className="p-6 md:p-8 flex flex-col gap-10 bg-[#EDD4D3]/60">

          {/* CHILDREN PREFERENCE */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] font-normal text-[18px]">Just wondering.</p>

            <label className="text-sm text-[#491A26]">
              Are you open to a partner who has children?
            </label>

            <div className="flex flex-col gap-3">

              {/* No */}
              <label
                onClick={() => setChildrenPreference("No")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] 
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer 
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="children"
                  checked={childrenPreference === "No"}
                  onChange={() => setChildrenPreference("No")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">No</span>
              </label>

              {/* Yes */}
              <label
                onClick={() => setChildrenPreference("Yes")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] 
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer 
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="children"
                  checked={childrenPreference === "Yes"}
                  onChange={() => setChildrenPreference("Yes")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">Yes</span>
              </label>

              {/* Depends */}
              <label
                onClick={() => setChildrenPreference("Depends")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] 
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer 
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="children"
                  checked={childrenPreference === "Depends"}
                  onChange={() => setChildrenPreference("Depends")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">Depends</span>
              </label>

            </div>
          </div>

          {/* AGE RANGE */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] font-normal text-[18px]">And,</p>

            <label className="text-sm text-[#491A26]">
              What is your preferred age range for a partner?
            </label>

            <div className="flex flex-col gap-4">

              {/* MIN AGE */}
              <div className="flex items-center gap-3 w-full md:w-3/4">
                <div
                  className="
                    bg-[#F6E7EA] border border-[#E4D6D6] 
                    rounded-md py-3 px-4 w-24 text-sm text-[#491A26]
                  "
                >
                  Min
                </div>

                <input
                  type="number"
                  placeholder="e.g., 30"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  className="
                    flex-1 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 text-sm text-black outline-none
                  "
                />
              </div>

              {/* MAX AGE */}
              <div className="flex items-center gap-3 w-full md:w-3/4">
                <div
                  className="
                    bg-[#F6E7EA] border border-[#E4D6D6] 
                    rounded-md py-3 px-4 w-24 text-sm text-[#491A26]
                  "
                >
                  Max
                </div>

                <input
                  type="number"
                  placeholder="e.g., 50"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  className="
                    flex-1 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4 text-sm text-black outline-none
                  "
                />
              </div>

            </div>
          </div>

          {/* TIMELINE FOR MARRIAGE */}
          <div className="flex flex-col gap-3">
            <p className="text-[#5A5959] font-normal text-[18px]">
              Regarding your intentions,
            </p>

            <label className="text-sm text-[#491A26]">
              What is your ideal timeline for marriage?
            </label>

            <div className="flex flex-col gap-3">

              {/* 1 year */}
              <label
                onClick={() => setTimeline("1 year")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] 
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer 
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="timeline"
                  checked={timeline === "1 year"}
                  onChange={() => setTimeline("1 year")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">1 year</span>
              </label>

              {/* 1–2 years */}
              <label
                onClick={() => setTimeline("1–2 years")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] 
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer 
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="timeline"
                  checked={timeline === "1–2 years"}
                  onChange={() => setTimeline("1–2 years")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">1–2 years</span>
              </label>

              {/* Open-ended */}
              <label
                onClick={() => setTimeline("Open-ended")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] 
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer 
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="timeline"
                  checked={timeline === "Open-ended"}
                  onChange={() => setTimeline("Open-ended")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">Open-ended</span>
              </label>

            </div>
          </div>

        </div>

        {/* NEXT BUTTON */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => router.push("/onboarding/background-series-six")}
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
