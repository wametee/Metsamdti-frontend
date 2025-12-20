"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowUpRight } from "react-icons/fi";
import { FaHeart } from "react-icons/fa"
import CancelMatchModal from "@/components/modal/CancelMatchModal";
import UserHeader from "./UserHeader";

export default function CancelMatch() {
  const router = useRouter();
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  function handleCancelSubmit() {
    // close modal then navigate
    setIsCancelOpen(false);
    router.push('/find-another-match');
  }

  return (
    <section className="min-h-screen w-full bg-[#F0DBDA] flex flex-col relative">

      {/* ───────── Header ───────── */}
      <UserHeader />

      {/* ───────── Main Content ───────── */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">

        {/* Hearts */}
        <div className="relative mb-6">
                 <FaHeart className="text-[#E7B7B4] w-16 h-16" />
                 <FaHeart className="text-[#702C3E] w-10 h-10 absolute -right-3 top-3" />
               </div>

        {/* Text */}
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
          Clara is in "hmm" mode
        </h1>

        <p className="text-sm md:text-base text-[#5A4A4A] max-w-md leading-relaxed font-medium mb-10">
          Let's give Clara a little time. <br />
          Good things take a moment.
        </p>

        {/* CTA */}
        <button
          onClick={() => setIsCancelOpen(true)}
          className="flex items-center gap-2 bg-[#702C3E] text-white px-8 py-3 rounded-md text-sm font-semibold hover:bg-[#702C3E]/90 transition"
        >
          Cancel Match
          <FiArrowUpRight className="w-4 h-4" />
        </button>

      </main>

      {/* ───────── Footer Text ───────── */}
      <p className="text-xs text-[#2F2E2E]/70 text-center pb-6 px-4">
        By continuing, you agree to our{" "}
        <span className="underline cursor-pointer">Terms of Service</span> and{" "}
        <span className="underline cursor-pointer">Privacy Policy</span>
      </p>

      {/* Cancel confirmation modal */}
      <CancelMatchModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onSubmit={handleCancelSubmit}
      />

    </section>
  );
}
