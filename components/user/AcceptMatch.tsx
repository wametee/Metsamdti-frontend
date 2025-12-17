"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa6";
import logo from "@/assets/logo2.png";

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
        <h1 className="text-lg md:text-xl font-medium text-[#1A1A1A] mb-2">
          You have been matched with{" "}
          <span className="text-[#C6536A]">Clara</span> from{" "}
          <span className="text-[#C6536A]">Maryland</span>.
        </h1>

        <p className="text-sm text-[#7A6A6A] mb-8">
          If you both accept then it’s a match
        </p>

        {/* MATCH VISUAL */}
        <div className="relative flex items-center justify-center mb-6">

          {/* Match Badge */}
          <div className="absolute top-[-14px] bg-[#F2E6E8] text-[#702C3E] text-xs px-3 py-1 rounded-full z-10">
            100% Match
          </div>

          {/* Images */}
          <div className="flex items-center gap-[-20px]">
            <div className="w-24 h-32 md:w-28 md:h-36 rounded-tl-[40px] rounded-br-[40px] overflow-hidden shadow-md">
              <Image
                src="/placeholder-man.jpg"
                alt="You"
                width={200}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-24 h-32 md:w-28 md:h-36 rounded-tr-[40px] rounded-bl-[40px] overflow-hidden shadow-md -ml-6">
              <Image
                src="/placeholder-woman.jpg"
                alt="Clara"
                width={200}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* INFO CARD */}
        <div className="w-full max-w-md bg-[#F4EAEA] rounded-lg px-4 py-4 mb-8 text-left">
          <p className="text-sm text-[#702C3E] font-medium mb-1">
            Age: 30
          </p>
          <p className="text-xs text-[#6B5B5B]">
            You’re both in similar career fields and share the same love language.
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
              text-sm font-medium
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
              text-sm font-medium
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
