"use client";

import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import love from "@/assets/love2.png";
import UserHeader from "./UserHeader";

export default function FindAnotherMatch() {
  return (
    <section className="min-h-screen w-full bg-[#F0DBDA] flex flex-col relative">

      {/* ───────── Header ───────── */}
      <UserHeader />

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
