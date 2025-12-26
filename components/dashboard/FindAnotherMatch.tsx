"use client";

import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import love from "@/assets/love2.png";
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';

interface FindAnotherMatchProps {
  onFindAnother: () => void;
}

export default function FindAnotherMatch({ onFindAnother }: FindAnotherMatchProps) {
  // Initialize Google Translate
  useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on find-another-match page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-[#F0DBDA] min-h-full overflow-y-auto">
      {/* Hidden Google Translate Element - must exist for translation to work */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}></div>

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
        onClick={onFindAnother}
        className="flex items-center gap-2 bg-[#702C3E] text-white px-8 py-3 rounded-md text-sm font-semibold hover:bg-[#702C3E]/90 transition"
      >
        Find another match
        <FiArrowUpRight className="w-4 h-4" />
      </button>
    </div>
  );
}







