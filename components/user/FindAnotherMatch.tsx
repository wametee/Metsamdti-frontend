"use client";

import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import logo from "@/assets/logo2.png";
import love from "@/assets/love2.png";

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

        {/* Love Image */}
        <div className="relative mb-10">
          <Image
            src={love}
            alt="Love"
            width={160}
            height={160}
            className="object-contain"
          />
        </div>

        {/* Text */}
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
          This one didn't click.
        </h1>

        <p className="text-sm md:text-base text-[#5A4A4A] max-w-md leading-relaxed font-medium mb-10">
          Hold tight. We are looking for another match.
        </p>

        {/* CTA */}
        <button
          onClick={() => { window.location.href = '/unlock-chat'; }}
          className="flex items-center gap-2 bg-[#702C3E] text-white px-8 py-3 rounded-md text-sm font-semibold hover:bg-[#702C3E]/90 transition"
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
