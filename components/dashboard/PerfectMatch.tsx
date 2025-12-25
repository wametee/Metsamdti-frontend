"use client";

import { FiArrowUpRight } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';

interface PerfectMatchProps {
  onContinue: () => void;
}

export default function PerfectMatch({ onContinue }: PerfectMatchProps) {
  // Initialize Google Translate
  useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on perfect-match page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 bg-[#EDD4D3] min-h-full">
      {/* Hidden Google Translate Element - must exist for translation to work */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}></div>

      {/* Hearts */}
      <div className="relative mb-6">
        <FaHeart className="text-[#E7B7B4] w-16 h-16" />
        <FaHeart className="text-[#702C3E] w-10 h-10 absolute -right-3 top-3" />
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
        Finding Your Perfect Match.
      </h1>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-[#5A4A4A] max-w-md leading-relaxed font-medium mb-8">
        Love is a craft… we're working carefully behind the scenes.
      </p>

      {/* Continue Button */}
      <button
        type="button"
        onClick={onContinue}
        className="flex items-center gap-2 mx-auto bg-[#702C3E] text-white text-sm font-semibold px-8 py-3 rounded-md hover:bg-[#702C3E]/90 transition"
      >
        Continue
        <FiArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
}


