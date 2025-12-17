"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { FaArrowLeft } from 'react-icons/fa6';
import logo from "@/assets/logo2.png";

export default function PerfectMatch() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(10);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setSecondsLeft(10);
    timerRef.current = window.setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      router.push('/accept-match');
    }
  }, [secondsLeft, router]);

  return (
    <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col">

      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-5">

        {/* Left: Back Button + Logo */}
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/match-time')} className="p-2 rounded-md text-[#702C3E] hover:bg-white/60">
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Image src={logo} alt="Metsamdti Logo" className="w-10 opacity-90" />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4 text-[#702C3E] text-sm">

          {/* Profile */}
          <div className="flex items-center gap-1 border border-white/60 rounded-md px-3 py-1 cursor-pointer">
            <span>John</span>
            <span className="text-xs">▾</span>
          </div>

          {/* Language */}
          <div className="flex items-center gap-1 border border-white/60 rounded-md px-3 py-1 cursor-pointer">
            <span>EN</span>
            <span className="text-xs">▾</span>
          </div>
        </div>
      </div>

        {/* CENTER CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">

        {/* Hearts */}
        <div className="relative mb-6">
          <FaHeart className="text-[#E7B7B4] w-16 h-16" />
          <FaHeart className="text-[#702C3E] w-10 h-10 absolute -right-3 top-3" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-semibold text-black mb-3">
          Finding Your Perfect Match.
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-[#6B5B5B] max-w-md">
          Love is a craft… we’re working carefully behind the scenes.
        </p>

        <div className="mt-4 text-sm text-[#702C3E]">Proceeding in <span className="font-semibold">{secondsLeft}</span>s</div>
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

