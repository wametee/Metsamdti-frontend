"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/logo2.png";

export default function BackgroundSeriesFour() {
  const router = useRouter();

  const [maritalStatus, setMaritalStatus] = useState("");
  const [children, setChildren] = useState("");

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

        {/* Progress Bar (≈ 65%) */}
        <div className="w-full h-1.5 bg-[#E7D3D1] rounded-full mb-10">
          <div className="h-full w-[65%] bg-[#702C3E] rounded-full"></div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-[#491A26] mb-3">
          Relationship History & Readiness
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-[#5A4A4A] max-w-lg mb-6 leading-relaxed">
          Every relationship we form is rooted in your life’s path, joys, and challenges — 
          your personal story matters. Share a little about your relationship history 
          so your matches better understand the context you come with.
        </p>

        {/* FORM AREA */}
        <div className="p-6 md:p-8 flex flex-col gap-10 bg-[#EDD4D3]/60">

          {/* MARRIAGE HISTORY */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] font-normal text-[18px]">
              Let’s gently touch on your past.
            </p>

            <label className="text-sm text-[#491A26]">
              Have you been married before?
            </label>

            <div className="flex flex-col gap-3">

              {/* No */}
              <label
                onClick={() => setMaritalStatus("No")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4
                  flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="marital"
                  checked={maritalStatus === "No"}
                  onChange={() => setMaritalStatus("No")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">No</span>
              </label>

              {/* Divorced */}
              <label
                onClick={() => setMaritalStatus("Divorced")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="marital"
                  checked={maritalStatus === "Divorced"}
                  onChange={() => setMaritalStatus("Divorced")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">Divorced</span>
              </label>

              {/* Widowed */}
              <label
                onClick={() => setMaritalStatus("Widowed")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="marital"
                  checked={maritalStatus === "Widowed"}
                  onChange={() => setMaritalStatus("Widowed")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">Widowed</span>
              </label>

            </div>
          </div>

          {/* CHILDREN QUESTION */}
          <div className="flex flex-col gap-4">
            <p className="text-[#5A5959] font-normal text-[18px]">
              Tell me a bit about your family.
            </p>

            <label className="text-sm text-[#491A26]">
              Do you have children?
            </label>

            <div className="flex flex-col gap-3">

              {/* No */}
              <label
                onClick={() => setChildren("No")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA]
                  border border-[#E4D6D6]
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="children"
                  checked={children === "No"}
                  onChange={() => setChildren("No")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">No</span>
              </label>

              {/* Yes */}
              <label
                onClick={() => setChildren("Yes")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA]
                  border border-[#E4D6D6]
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="children"
                  checked={children === "Yes"}
                  onChange={() => setChildren("Yes")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">Yes</span>
              </label>

              {/* Prefer not to say */}
              <label
                onClick={() => setChildren("Prefer not to say")}
                className="
                  w-full md:w-3/4 bg-[#F6E7EA]
                  border border-[#E4D6D6]
                  rounded-md py-3 px-4 flex items-center gap-3 cursor-pointer
                  hover:brightness-105 transition
                "
              >
                <input
                  type="radio"
                  name="children"
                  checked={children === "Prefer not to say"}
                  onChange={() => setChildren("Prefer not to say")}
                  className="w-4 h-4 accent-[#702C3E]"
                />
                <span className="text-sm text-[#491A26] ml-3">Prefer not to say</span>
              </label>
            </div>
          </div>

        </div>

        {/* Next Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => router.push('/onboarding/background-series-five')}
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
