"use client";

import { FiX } from "react-icons/fi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
};

export default function CancelMatchModal({
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
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal Card */}
      <div
        className="
          relative z-10
          bg-[#FCF8F8]
          w-full max-w-[640px]
          mx-4
          rounded-2xl
          px-8 py-10
          shadow-[0_12px_40px_rgba(0,0,0,0.12)]
          text-center
        "
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-[#702C3E] hover:opacity-70 transition"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-[22px] md:text-[26px] font-semibold text-black mb-3">
          Are you sure you want to cancel this match
        </h2>

        {/* Warning */}
        <p className="text-sm text-[#C6536A] mb-8">
          This action cannot be undone
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {/* Keep Match */}
          <button
            onClick={onClose}
            className="
              px-8 py-3
              rounded-md
              border border-[#C9A7AF]
              text-[#702C3E]
              text-sm font-medium
              hover:bg-[#F2E6E8]
              transition
            "
          >
            Keep Match
          </button>

          {/* Cancel Match */}
          <button
            onClick={onSubmit}
            className="
              px-8 py-3
              rounded-md
              bg-[#702C3E]
              text-white
              text-sm font-medium
              hover:bg-[#5E2333]
              transition
            "
          >
            Cancel Match
          </button>
        </div>
      </div>
    </div>
  );
}
