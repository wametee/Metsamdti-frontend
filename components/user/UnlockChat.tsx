"use client";

import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import logo from "@/assets/logo2.png";
// matchIllustration asset is missing in the repo. Use logo as a placeholder
// replace with: import matchIllustration from "@/assets/match-illustration.png";

export default function UnlockChat() {
  return (
    <section className="min-h-screen w-full bg-[#F0DBDA] flex flex-col">

      {/* ───────── Header ───────── */}
      <header className="w-full flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src={logo}
            alt="Metsamdti"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-[#702C3E] font-title font-semibold text-sm">
            Metsamdti
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 border border-[#702C3E]/20 rounded-md px-3 py-1.5 text-sm text-[#702C3E]">
            <FaUserCircle className="text-base" />
            John
          </button>

          <button className="flex items-center gap-1 border border-[#702C3E]/20 rounded-md px-3 py-1.5 text-sm text-[#702C3E]">
            EN
          </button>
        </div>
      </header>

      {/* ───────── Main Content ───────── */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">

        {/* Illustration Card (placeholder) */}
        <div className="bg-[#F6E3E1] p-6 rounded-md mb-8">
          <Image
            src={logo}
            alt="It's a match"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="font-title font-semibold text-[#2F2E2E] text-xl md:text-2xl mb-3">
          It’s a Match
        </h1>

        {/* Description */}
        <p className="text-[#2F2E2E]/70 text-sm md:text-base max-w-sm leading-relaxed mb-8">
          You and Clara liked each other.
          <br />
          Make a payment to unlock chat and take the
          first step in getting to know Clara.
        </p>

        {/* CTA */}
        <button
          className="flex items-center justify-center gap-2 bg-[#702C3E] text-white px-10 py-3 rounded-sm text-sm font-medium hover:bg-[#702C3E]/90 transition"
        >
          Unlock Chat
          <FiArrowUpRight className="w-4 h-4" />
        </button>

      </main>

      {/* ───────── Footer ───────── */}
      <p className="text-xs text-[#2F2E2E]/70 text-center pb-6 px-4">
        By continuing, you agree to our{" "}
        <span className="underline cursor-pointer">Terms of Service</span> and{" "}
        <span className="underline cursor-pointer">Privacy Policy</span>
      </p>

    </section>
  );
}
