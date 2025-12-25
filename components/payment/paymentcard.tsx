"use client";

import { FiX } from "react-icons/fi";
import { GiWallet } from "react-icons/gi";

type PaymentCardProps = {
  amount?: number;
  onClose?: () => void;
  onPay?: () => void;
};

export default function PaymentCard({
  amount = 200,
  onClose,
  onPay,
}: PaymentCardProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Card */}
      <div
        className="
          relative z-10
          w-full max-w-md
          mx-4
          bg-[#FDFCFA]
          rounded-2xl
          px-6 py-7
          shadow-[0_12px_40px_rgba(0,0,0,0.12)]
        "
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#702C3E] hover:opacity-70 transition"
          aria-label="Close"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-[#491A26] mb-6">
          Make Payment
        </h2>

        {/* Amount */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-[#5A4A4A]">Amount</span>
          <span className="text-sm font-semibold text-[#491A26]">
            ${amount}
          </span>
        </div>

        {/* Card Details Header */}
        <div className="flex items-center gap-2 mb-2">
          <GiWallet className="text-[#702C3E] w-5 h-5" />
          <span className="text-sm font-semibold text-[#491A26]">
            Card Details
          </span>
        </div>

        <p className="text-xs text-[#7A6A6A] mb-4">
          Enter your debit or credit card details.
        </p>

        {/* Card Input Wrapper */}
        <div className="border border-[#E6DADA] rounded-lg overflow-hidden mb-6">
          {/* Card Number */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E6DADA]">
            <input
              type="text"
              placeholder="4242 4242 4242 4242"
              className="
                w-full
                text-sm
                text-[#491A26]
                placeholder-[#B6A8A8]
                bg-transparent
                outline-none
              "
            />
            <span className="text-sm font-semibold text-[#1A4FD8] ml-3">
              VISA
            </span>
          </div>

          {/* Expiry / CVC / Autofill */}
          <div className="grid grid-cols-3 gap-2 px-4 py-3">
            <input
              type="text"
              placeholder="MM / YY"
              className="
                text-sm
                text-[#491A26]
                placeholder-[#B6A8A8]
                bg-transparent
                outline-none
              "
            />
            <input
              type="text"
              placeholder="CVC"
              className="
                text-sm
                text-[#491A26]
                placeholder-[#B6A8A8]
                bg-transparent
                outline-none
              "
            />
            <button
              type="button"
              className="
                text-xs
                border border-[#E6DADA]
                rounded-md
                px-2 py-1
                text-[#491A26]
                hover:bg-[#F3ECEC]
                transition
              "
            >
              Autofill
            </button>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={onPay}
          className="
            w-full
            bg-[#702C3E]
            text-white
            py-3
            rounded-md
            text-sm font-semibold
            hover:bg-[#5E2333]
            transition
          "
        >
          Pay ${amount}
        </button>
      </div>
    </div>
  );
}


