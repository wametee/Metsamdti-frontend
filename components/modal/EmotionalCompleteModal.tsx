
"use client";

import { ImCancelCircle } from "react-icons/im";
import { FiArrowUpRight } from "react-icons/fi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
};

export default function EmotionalCompleteModal({
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />

  {/* Modal Card */}
  <div className="relative bg-white rounded-xl max-w-[660px] w-full mx-4 p-10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.08)] z-10">
        {/* Cancel icon top-right (moved out a bit from the title) */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-[#702C3E] hover:text-[#5E2333]"
          aria-label="Close"
        >
          <ImCancelCircle className="w-8 h-8" />
        </button>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-bold text-black text-center mb-4">
          Thank you for reflecting with honesty.
        </h3>

        {/* Message */}
        <p className="text-sm sm:text-base text-[#5A4A4A] max-w-md mx-auto text-left mb-6 leading-relaxed font-medium">
         Your emotional patterns help us understand the language of your heart — and guide us in
          finding someone who resonates with your rhythm.
        </p>

        {/* Submit button (styled like other Next buttons) */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              if (onSubmit) onSubmit();
              else onClose();
            }}
            className="bg-[#702C3E] text-white text-sm font-semibold px-8 py-3 rounded-md flex items-center gap-2 hover:bg-[#5E2333] transition"
          >
            Submit <FiArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
