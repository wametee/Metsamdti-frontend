"use client";

import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import love from "@/assets/love3.png";
import UserHeader from "./UserHeader";
// matchIllustration asset is missing in the repo. Use logo as a placeholder
// replace with: import matchIllustration from "@/assets/match-illustration.png";

export default function UnlockChat() {
  return (
    <section className="min-h-screen w-full bg-[#F0DBDA] flex flex-col">

      {/* ───────── Header ───────── */}
      <UserHeader />

      {/* ───────── Main Content ───────── */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">

        {/* Illustration Card (placeholder) */}
        <div className="p-6 rounded-md mb-8">
          <Image
            src={love}
            alt="It's a match"
            width={160}
            height={160}
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
          It's a Match
        </h1>

        {/* Description */}
        <p className="text-sm md:text-base text-[#5A4A4A] max-w-sm leading-relaxed font-medium mb-8">
          You and Clara liked each other.
          <br />
          Make a payment to unlock chat and take the
          first step in getting to know Clara.
        </p>

        {/* CTA */}
        <button
          className="flex items-center justify-center gap-2 bg-[#702C3E] text-white px-10 py-3 rounded-md text-sm font-semibold hover:bg-[#702C3E]/90 transition"
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
