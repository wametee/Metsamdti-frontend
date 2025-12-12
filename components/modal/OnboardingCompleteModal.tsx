"use client";

import { ImCancelCircle } from "react-icons/im";
import { FiArrowUpRight } from "react-icons/fi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
};

export default function OnboardingCompleteModal({
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
      <div className="relative bg-white rounded-2xl max-w-2xl w-full mx-4 p-8 pt-12 shadow-lg z-10">
        {/* Cancel icon top-right (moved out a bit from the title) */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-[#702C3E] hover:text-[#5E2333]"
          aria-label="Close"
        >
          <ImCancelCircle className="w-8 h-8" />
        </button>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-semibold text-[#491A26] text-center mb-4">
          Thank you for sharing your journey with us.
        </h3>

        {/* Message */}
        <p className="text-sm text-[#5A4A4A] text-center mb-6 leading-relaxed">
          Your answers will help us connect you with someone who honors your values and aligns
          with your vision for love and partnership. You’re now one step closer.
        </p>

        {/* Submit button (styled like other Next buttons) */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              if (onSubmit) onSubmit();
              else onClose();
            }}
            className="bg-[#702C3E] text-white px-8 py-3 rounded-md flex items-center gap-2 hover:bg-[#5E2333] transition"
          >
            Submit <FiArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
