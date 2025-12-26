"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import love from "@/assets/love3.png";
import UserHeader from "@/components/user/UserHeader";
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';
// matchIllustration asset is missing in the repo. Use logo as a placeholder
// replace with: import matchIllustration from "@/assets/match-illustration.png";

/**
 * UnlockChat Component
 * 
 * This component was archived for future use when payment integration is implemented.
 * It displays a page prompting users to make a payment to unlock chat functionality.
 * 
 * To restore:
 * 1. Move this file back to components/user/UnlockChat.tsx
 * 2. Restore the unlock-chat page from app/archive/unlock-chat/page.tsx
 * 3. Update payment flow to integrate with this component
 */
export default function UnlockChat() {
  const router = useRouter();
  
  // Initialize Google Translate
  useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on unlock-chat page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  return (
    <section className="min-h-screen w-full bg-[#F0DBDA] flex flex-col">
      {/* Hidden Google Translate Element - must exist for translation to work */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}></div>

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
          onClick={() => router.push("/payment")}
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

