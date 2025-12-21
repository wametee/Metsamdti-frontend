"use client";

import { useState } from "react";
import { FiArrowUpRight, FiCheck, FiFileText, FiShield } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo2.png";

type Props = {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
};

export default function TermsPrivacyModal({
  isOpen,
  onAccept,
  onDecline,
}: Props) {
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const canAccept = termsChecked && privacyChecked;

  const handleAccept = async () => {
    if (!canAccept) return;
    
    setIsSubmitting(true);
    try {
      await onAccept();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        aria-hidden
      />

      {/* Modal Card - Professional Design */}
      <div className="relative bg-white rounded-3xl max-w-[680px] w-full max-h-[90vh] overflow-hidden shadow-2xl z-10 flex flex-col">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#702C3E] to-[#8B3A4F] px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Image src={logo} alt="Metsamdti" width={32} height={32} className="opacity-90" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Terms & Privacy Policy
              </h2>
              <p className="text-white/90 text-sm">
                Please review and accept to continue
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-medium mb-2">
              Welcome to <span className="font-semibold text-[#702C3E]">Metsamdti</span>. Before you begin your journey, we need your consent to our Terms of Service and Privacy Policy.
            </p>
            <p className="text-sm text-[#6B5B5B] leading-relaxed">
              These documents outline how we protect your privacy, handle your data, and the terms of using our matchmaking platform.
            </p>
          </div>

          {/* Terms Checkbox - Enhanced Design */}
          <div className="mb-6 p-5 bg-gradient-to-br from-[#F6E7EA] to-[#F9F0F2] rounded-xl border-2 border-[#E4D6D6] hover:border-[#702C3E]/30 transition-all duration-200">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                  termsChecked 
                    ? 'bg-[#702C3E] border-[#702C3E]' 
                    : 'bg-white border-[#E4D6D6] group-hover:border-[#702C3E]'
                }`}>
                  {termsChecked && (
                    <FiCheck className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FiFileText className="w-5 h-5 text-[#702C3E]" />
                  <span className="text-base font-bold text-[#491A26]">
                    Terms of Service
                  </span>
                </div>
                <p className="text-sm text-[#6B5B5B] mb-2">
                  I have read and agree to the{" "}
                  <Link
                    href="/terms-of-service"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#702C3E] font-semibold underline hover:text-[#5E2333] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms of Service
                  </Link>
                </p>
              </div>
            </label>
          </div>

          {/* Privacy Checkbox - Enhanced Design */}
          <div className="mb-6 p-5 bg-gradient-to-br from-[#F6E7EA] to-[#F9F0F2] rounded-xl border-2 border-[#E4D6D6] hover:border-[#702C3E]/30 transition-all duration-200">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={privacyChecked}
                  onChange={(e) => setPrivacyChecked(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                  privacyChecked 
                    ? 'bg-[#702C3E] border-[#702C3E]' 
                    : 'bg-white border-[#E4D6D6] group-hover:border-[#702C3E]'
                }`}>
                  {privacyChecked && (
                    <FiCheck className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FiShield className="w-5 h-5 text-[#702C3E]" />
                  <span className="text-base font-bold text-[#491A26]">
                    Privacy Policy
                  </span>
                </div>
                <p className="text-sm text-[#6B5B5B] mb-2">
                  I have read and agree to the{" "}
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#702C3E] font-semibold underline hover:text-[#5E2333] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-[#F6E7EA]/50 border-l-4 border-[#702C3E] rounded-r-lg p-4 mb-6">
            <p className="text-sm text-[#491A26] leading-relaxed">
              <span className="font-semibold">Important:</span> By accepting these terms, you acknowledge that you have read, understood, and agree to be bound by our Terms of Service and Privacy Policy. Your privacy and data security are our top priorities.
            </p>
          </div>
        </div>

        {/* Action Buttons - Professional Footer */}
        <div className="border-t border-[#E4D6D6] bg-gradient-to-b from-white to-[#FAF9F9] px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onDecline}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3.5 border-2 border-[#E4D6D6] text-[#702C3E] rounded-xl font-semibold hover:bg-[#F6E7EA] hover:border-[#702C3E]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={!canAccept || isSubmitting}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-[#702C3E] to-[#8B3A4F] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-[#5E2333] hover:to-[#702C3E] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Accept & Continue</span>
                  <FiArrowUpRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-[#6B5B5B] text-center mt-4">
            You must accept both terms to continue
          </p>
        </div>
      </div>
    </div>
  );
}
