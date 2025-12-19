"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa6";
import logo from "@/assets/logo2.png";
import john from "@/assets/john.png";
import eva from "@/assets/eva.png";

export default function AcceptRejectMatch() {
  const router = useRouter();

  return (
    <section className="min-h-screen w-full bg-[#FCF8F8] relative flex flex-col">

      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-5">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/match-time")}
            className="p-2 rounded-md text-[#702C3E] hover:bg-[#EDD4D3]/40 transition"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>

          <Image src={logo} alt="Logo" className="w-10 opacity-90" />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 text-[#702C3E] text-sm">
          <div className="flex items-center gap-1 border border-[#E5D5D5] rounded-md px-3 py-1 cursor-pointer">
            <span>John</span>
            <span className="text-xs">▾</span>
          </div>

          <div className="flex items-center gap-1 border border-[#E5D5D5] rounded-md px-3 py-1 cursor-pointer">
            <span>EN</span>
            <span className="text-xs">▾</span>
          </div>
        </div>
      </div>

      {/* CENTER CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
          You have been matched with{" "}
          <span className="text-[#C6536A]">Clara</span> from{" "}
          <span className="text-[#C6536A]">Maryland</span>.
        </h1>

        <p className="text-sm md:text-base text-[#5A4A4A] max-w-lg mb-8 leading-relaxed font-medium">
          If you both accept then it's a match
        </p>

        {/* MATCH VISUAL */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Images Container */}
          <div className="relative flex items-center justify-center">
            {/* John's Image (Left Heart) */}
            <div className="relative">
              {/* Heart-shaped container for John */}
              <button
                onClick={() => router.push('/user/profile/john')}
                className="w-32 h-32 md:w-40 md:h-40 relative cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Image
                  src={john}
                  alt="John"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </button>
            </div>

            {/* Match Badge - centered between the two images */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#702C3E] text-white text-xs md:text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-full z-20 shadow-md whitespace-nowrap pointer-events-none">
              100% Match
            </div>

            {/* Eva's Image (Right Heart) */}
            <button
              onClick={() => router.push('/user/profile/clara')}
              className="w-32 h-32 md:w-40 md:h-40 relative -ml-4 md:-ml-6 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Image
                src={eva}
                alt="Clara"
                width={200}
                height={200}
                className="w-full h-full object-contain"
              />
            </button>
          </div>
        </div>

        {/* INFO CARD */}
        <div className="w-full max-w-md bg-[#F4EAEA] rounded-lg px-4 py-4 mb-8 text-left">
          <p className="text-base text-[#491A26] font-semibold mb-1">
            Age: 30
          </p>
          <p className="text-sm text-[#5A4A4A] leading-relaxed font-medium">
            You're both in similar career fields and share the same love language.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">

          {/* Reject */}
          <button
            className="
              w-full
              border border-[#C9A7AF]
              text-[#702C3E]
              py-3 rounded-md
              text-sm font-semibold
              hover:bg-[#F2E6E8]
              transition
            "
            onClick={() => router.push('/find-another-match')}
          >
            Reject Match ✕
          </button>

          {/* Accept */}
          <button
            className="
              w-full
              bg-[#702C3E]
              text-white
              py-3 rounded-md
              text-sm font-semibold
              hover:bg-[#5E2333]
              transition
            "
            onClick={() => router.push('/cancel-match')}
          >
            Accept Match ↗
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="pb-6">
        <p className="text-center text-xs text-[#6B5B5B] px-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </section>
  );
}
