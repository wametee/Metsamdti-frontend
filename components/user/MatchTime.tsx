"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import logo from "@/assets/logo2.png";
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function MatchTime() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(10);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // start countdown
    setSecondsLeft(10);
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // navigate when countdown reaches 0
  useEffect(() => {
    if (secondsLeft <= 0) {
      router.push('/perfect-match');
    }
  }, [secondsLeft, router]);

  return (
    <section className="min-h-screen w-full bg-[#FCF8F8] relative flex flex-col items-center">

      {/* Top-right language switcher (fixed to top-right across breakpoints) */}
      <div className="absolute top-6 right-6 z-30">
        <LanguageSwitcher />
      </div>

      {/* Top Bar */}
      <div className="w-full relative flex items-center justify-center px-6 pt-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-2 mx-auto">
          <Image src={logo} alt="Metsamdti Logo" width={80} height={80} />
        </div>
      </div>

      {/* Back button (top-left) */}
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="absolute left-6 top-6 p-2 rounded-md text-[#702C3E] hover:bg-white/60 z-30"
      >
        <FaArrowLeft className="h-5 w-5" />
      </button>

      {/* Background Diagonal Shape */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-[#DDB1B5] opacity-60 clip-path-diagonal"></div>

      {/* Center Card */}
      <div className="relative z-10 mt-24 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] w-[90%] max-w-[620px] p-10 text-center">
        {/* Small Circle Icon */}
        <div className="w-10 h-10 rounded-full border border-[#702C3E] mx-auto mb-6" />

        <h1 className="text-black text-3xl md:text-4xl font-bold mb-4">
          It's Match time, John
        </h1>

        <p className="text-sm md:text-base text-[#5A4A4A] leading-relaxed max-w-md mx-auto font-medium mb-8">
          Someone amazing is about to enter your life.
        </p>

        {/* Countdown display + Continue Button */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-sm text-[#702C3E] font-medium">Redirecting in <span className="font-semibold">{secondsLeft}</span>s</div>
          <button
            type="button"
            onClick={() => router.push('/onboarding/basics')}
            className="flex items-center gap-2 mx-auto bg-[#702C3E] text-white text-sm font-semibold px-8 py-3 rounded-md hover:bg-[#702C3E]/90 transition"
          >
            Continue
            <FiArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Terms */}
      <p className="absolute bottom-8 text-xs text-[#2F2E2E] text-center w-full px-4">
        By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>
      </p>

      {/* Custom Diagonal Clip */}
      <style>{`
        .clip-path-diagonal {
          clip-path: polygon(40% 0, 100% 0, 100% 100%, 10% 100%);
        }
      `}</style>
    </section>
  );
}
