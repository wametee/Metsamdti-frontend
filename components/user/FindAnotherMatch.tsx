"use client";

import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import logo from "@/assets/logo2.png";

export default function FindAnotherMatch() {
  return (
    <section className="min-h-screen w-full bg-[#F0DBDA] flex flex-col relative">

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

        {/* Broken Heart */}
        <div className="relative mb-10">
          <div className="w-20 h-20 bg-[#C97A75] rounded-full relative flex items-center justify-center">
            {/* crack */}
            <span className="absolute text-[#702C3E] text-lg rotate-12">✕</span>
            <span className="absolute text-[#702C3E] text-lg -rotate-12">✕</span>
          </div>
        </div>

        {/* Text */}
        <h1 className="font-title font-semibold text-[#2F2E2E] text-xl md:text-2xl mb-3">
          This one didn’t click.
        </h1>

        <p className="text-[#2F2E2E]/70 text-sm md:text-base max-w-md leading-relaxed mb-10">
          Hold tight. We are looking for another match.
        </p>

        {/* CTA */}
        <button
          onClick={() => { window.location.href = '/unlock-chat'; }}
          className="flex items-center gap-2 bg-[#702C3E] text-white px-8 py-3 rounded-sm text-sm font-medium hover:bg-[#702C3E]/90 transition"
        >
          Find another match
          <FiArrowUpRight className="w-4 h-4" />
        </button>

      </main>

      {/* ───────── Footer Text ───────── */}
      <p className="text-xs text-[#2F2E2E]/70 text-center pb-6 px-4">
        By continuing, you agree to our{" "}
        <span className="underline cursor-pointer">Terms of Service</span> and{" "}
        <span className="underline cursor-pointer">Privacy Policy</span>
      </p>

    </section>
  );
}
