"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import { FiLock } from "react-icons/fi";
import logo from "@/assets/logo2.png";

export default function ChatUnlocked() {
  const router = useRouter();

  return (
    <section className="min-h-screen w-full bg-[#FCF8F8] relative flex flex-col">

      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Metsamdti Logo" className="w-10 opacity-90" />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4 text-[#702C3E] text-sm">
          {/* Profile */}
          <div className="flex items-center gap-1 border border-[#E6DADA] rounded-md px-3 py-1 cursor-pointer">
            <span>John</span>
            <span className="text-xs">▾</span>
          </div>

          {/* Language */}
          <div className="flex items-center gap-1 border border-[#E6DADA] rounded-md px-3 py-1 cursor-pointer">
            <span>EN</span>
            <span className="text-xs">▾</span>
          </div>
        </div>
      </div>

      {/* CENTER CONTENT */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div
          className="
            w-full max-w-md
            bg-[#EDD4D3]
            border-2 border-white
            rounded-2xl
            px-8 py-10
            text-center
            shadow-[0_12px_40px_rgba(0,0,0,0.08)]
          "
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <FiLock className="w-7 h-7 text-[#702C3E]" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-semibold text-[#491A26] mb-2">
            Chat unlocked successfully
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-[#5A4A4A] mb-8">
            Don’t be shy. Say Hello to Clara.
          </p>

          {/* CTA */}
          <button
            onClick={() => router.push("/chat")}
            className="
              mx-auto
              bg-[#702C3E]
              text-white
              px-8 py-3
              rounded-md
              text-sm font-semibold
              flex items-center gap-2
              hover:bg-[#5E2333]
              transition
            "
          >
            Go to Chat <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* REJECT MATCH */}
      <button
        onClick={() => router.push("/match-time")}
        className="text-xs text-[#8A7A7A] underline text-center mb-6"
      >
        Reject Match
      </button>

      {/* FOOTER */}
      <p className="text-center text-xs text-[#6B5B5B] px-4 pb-6">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </section>
  );
}
