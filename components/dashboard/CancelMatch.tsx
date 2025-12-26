"use client";

import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import CancelMatchModal from "@/components/modal/CancelMatchModal";
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';

interface CancelMatchProps {
  onCancelMatch: () => void;
}

export default function CancelMatch({ onCancelMatch }: CancelMatchProps) {
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  // Initialize Google Translate
  useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on cancel-match page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  function handleCancelSubmit() {
    // close modal then navigate
    setIsCancelOpen(false);
    onCancelMatch();
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-[#F0DBDA] min-h-full overflow-y-auto">
      {/* Hidden Google Translate Element - must exist for translation to work */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}></div>

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

      {/* Cancel confirmation modal */}
      <CancelMatchModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onSubmit={handleCancelSubmit}
      />
    </div>
  );
}







