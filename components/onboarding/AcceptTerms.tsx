"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { FiArrowUpRight, FiCheck, FiFileText, FiShield } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import { acceptTerms } from "@/lib/api/auth";
import authService from "@/services/auth/authService";

export default function AcceptTerms() {
  const router = useRouter();
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const canAccept = termsChecked && privacyChecked;

  // Prevent hydration mismatch - show loading state on initial render
  if (!isMounted) {
    return (
      <section className="min-h-screen w-full bg-gradient-to-b from-[#FCF8F8] to-[#F6E7EA] flex flex-col items-center justify-center px-4 py-8 relative">
        <div className="w-full max-w-[320px] sm:max-w-[340px] md:max-w-[450px] lg:max-w-[460px] bg-white rounded-2xl shadow-xl p-8 mt-12 md:mt-0">
          <div className="flex items-center justify-center">
            <div className="inline-block w-8 h-8 border-4 border-[#702C3E] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  const handleAccept = async () => {
    if (!canAccept) return;
    
    setIsSubmitting(true);
    try {
      // Check if user has a token first (avoid unnecessary API calls)
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      if (token) {
        // User might be authenticated - try to save to database
        try {
          const userResult = await authService.getCurrentUser();
          if (userResult.success && userResult.user) {
            // User is authenticated - save to database
            try {
              const result = await acceptTerms();
              if (result.success) {
                // Proceed to thank you page
                router.push('/onboarding/thankyou');
                return;
              }
            } catch (apiError) {
              // If API call fails, fall back to localStorage
              console.warn('API call failed, saving to localStorage:', apiError);
            }
          }
        } catch (error) {
          // If getCurrentUser fails, fall back to localStorage
          console.warn('getCurrentUser failed, saving to localStorage:', error);
        }
      }
      
      // User is not authenticated or API calls failed - save to localStorage
      // When they sign up, we'll record it in the database
      localStorage.setItem('terms_accepted', 'true');
      // Proceed to thank you page
      router.push('/onboarding/thankyou');
    } catch (error) {
      console.error('Error accepting terms:', error);
      // Fallback: save to localStorage even if there's an error
      localStorage.setItem('terms_accepted', 'true');
      router.push('/onboarding/thankyou');
    }
  };

  const handleDecline = () => {
    // If user declines, redirect them to home page
    router.push('/');
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-[#FCF8F8] to-[#F6E7EA] flex flex-col items-center justify-center px-4 py-8 relative">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="absolute left-4 top-4 md:left-6 md:top-6 p-2 rounded-md text-[#702C3E] hover:bg-white/60 z-30 transition-colors"
      >
        <FaArrowLeft className="h-5 w-5" />
      </button>

      {/* Main Content Card */}
      <div className="w-full max-w-[320px] sm:max-w-[340px] md:max-w-[450px] lg:max-w-[460px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] mt-12 md:mt-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#702C3E] to-[#8B3A4F] px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0 mt-0.5">
              <Image src={logo} alt="Metsamdti" width={24} height={24} className="opacity-90" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-white mb-1">
                Terms & Privacy Policy
              </h1>
              <p className="text-white/90 text-xs">
                Please review and accept to continue
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Introduction */}
          <div className="mb-4">
            <p className="text-sm text-[#2F2E2E] leading-relaxed font-medium mb-2">
              Welcome to <span className="font-bold text-[#702C3E]">Metsamdti</span>
            </p>
            <p className="text-xs text-[#6B5B5B] leading-relaxed mb-2">
              Before you begin your journey, we need your consent to our Terms of Service and Privacy Policy.
            </p>
            <p className="text-xs text-[#6B5B5B] leading-relaxed">
              These documents outline how we protect your privacy and handle your personal data. Your privacy and security are our top priorities.
            </p>
          </div>

          {/* Terms Checkbox - Enhanced Design */}
          <div className="mb-3 p-3 bg-gradient-to-br from-[#F6E7EA] to-[#F9F0F2] rounded-lg border-2 border-[#E4D6D6] hover:border-[#702C3E]/40 transition-all duration-200 shadow-sm">
            <label className="flex items-start gap-2 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shadow-sm ${
                  termsChecked 
                    ? 'bg-[#702C3E] border-[#702C3E] scale-105' 
                    : 'bg-white border-[#E4D6D6] group-hover:border-[#702C3E] group-hover:scale-105'
                }`}>
                  {termsChecked && (
                    <FiCheck className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="p-1 bg-[#702C3E]/10 rounded-md flex-shrink-0">
                    <FiFileText className="w-4 h-4 text-[#702C3E]" />
                  </div>
                  <span className="text-sm font-bold text-[#491A26]">
                    Terms of Service
                  </span>
                </div>
                <p className="text-xs text-[#6B5B5B] leading-relaxed">
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
                  {" "}that govern the use of the Metsamdti platform.
                </p>
              </div>
            </label>
          </div>

          {/* Privacy Checkbox - Enhanced Design */}
          <div className="mb-3 p-3 bg-gradient-to-br from-[#F6E7EA] to-[#F9F0F2] rounded-lg border-2 border-[#E4D6D6] hover:border-[#702C3E]/40 transition-all duration-200 shadow-sm">
            <label className="flex items-start gap-2 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={privacyChecked}
                  onChange={(e) => setPrivacyChecked(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shadow-sm ${
                  privacyChecked 
                    ? 'bg-[#702C3E] border-[#702C3E] scale-105' 
                    : 'bg-white border-[#E4D6D6] group-hover:border-[#702C3E] group-hover:scale-105'
                }`}>
                  {privacyChecked && (
                    <FiCheck className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="p-1 bg-[#702C3E]/10 rounded-md flex-shrink-0">
                    <FiShield className="w-4 h-4 text-[#702C3E]" />
                  </div>
                  <span className="text-sm font-bold text-[#491A26]">
                    Privacy Policy
                  </span>
                </div>
                <p className="text-xs text-[#6B5B5B] leading-relaxed">
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
                  {" "}that explains how we collect, use, and protect your personal information.
                </p>
              </div>
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-[#F6E7EA] to-[#F9F0F2] border-l-4 border-[#702C3E] rounded-r-lg p-3 mb-3 shadow-sm">
            <p className="text-xs text-[#491A26] leading-relaxed">
              <span className="font-bold text-[#702C3E]">Important:</span> By accepting these terms, you acknowledge that you have read, understood, and agree to be bound by our Terms of Service and Privacy Policy. Your privacy and data security are our top priorities.
            </p>
          </div>
        </div>

        {/* Action Buttons - Professional Footer */}
        <div className="border-t-2 border-[#E4D6D6] bg-gradient-to-b from-white to-[#FAF9F9] px-4 py-4">
          {/* Buttons in a row - always in row */}
          <div className="flex flex-row gap-2 mb-2">
            {/* Decline Button */}
            <button
              onClick={handleDecline}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border-2 border-[#E4D6D6] text-[#702C3E] rounded-md font-semibold text-xs hover:bg-[#F6E7EA] hover:border-[#702C3E]/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Decline
            </button>
            
            {/* Accept & Continue Button */}
            <button
              onClick={handleAccept}
              disabled={!canAccept || isSubmitting}
              className="flex-1 px-4 py-2.5 bg-[#702C3E] text-white rounded-md font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#5E2333] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Accept & Continue</span>
                  <FiArrowUpRight className="w-3 h-3 flex-shrink-0" />
                </>
              )}
            </button>
          </div>
          
          <p className="text-xs text-[#6B5B5B] text-center">
            You must accept both terms to continue
          </p>
        </div>
      </div>
    </section>
  );
}
