"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import { FiMail } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import { useMutation } from '@tanstack/react-query';
import { toast } from "react-toastify";
import httpClient from '@/lib/httpClient';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);

      // Validation
      if (!email) {
        const errorMsg = 'Email is required';
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(errorMsg);
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        const errorMsg = 'Please enter a valid email address';
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(errorMsg);
      }

      // Call password reset API
      const response = await httpClient.post('/password-reset/send', { email });
      
      if (!response.data.success) {
        const errorMsg = response.data.message || 'Failed to send reset code';
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(errorMsg);
      }

      return response.data;
    },
    onSuccess: (data) => {
      setIsSubmitted(true);
      toast.success(data.message || "Password reset code sent to your email!", {
        position: "top-right",
        autoClose: 3000,
      });
      // Redirect to reset password page with email
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1500);
    },
    onError: (error: any) => {
      setIsSubmitting(false);
      // Show error toast if not already shown
      if (!error.toastShown) {
        const errorMessage = error.message || 'An error occurred';
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  // Initialize Google Translate
  useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on forgot password page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  return (
    <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center justify-center px-4 py-10">
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}></div>

      {/* Language Toggle - Top Right */}
      <div className="absolute top-6 right-6 text-sm text-[#2F2E2E] z-50">
        <LanguageSwitcher />
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute left-6 top-6 p-2 rounded-md text-[#702C3E] hover:bg-white/60 z-40"
      >
        <FaArrowLeft className="w-5 h-5" />
      </button>

      {/* Card */}
      <div
        className="
          w-full max-w-md
          bg-[#EDD4D3]
          border-2 border-white
          rounded-2xl
          px-6 py-10
          shadow-md
        "
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src={logo} alt="Logo" className="w-14 opacity-90" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-[#491A26] mb-2">
          Forgot Password
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-center text-[#6B5B5B] mb-8">
          Enter your email address and we'll send you a code to reset your password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A6A]" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full bg-[#F6E7EA]
                  border border-[#E4D6D6]
                  rounded-md
                  py-3 pl-11 pr-4
                  text-sm text-black
                  outline-none
                "
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                mt-4 bg-[#702C3E] text-white
                py-3 rounded-md
                flex items-center justify-center gap-2
                hover:bg-[#5E2333] transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Code'} <FiArrowUpRight className="w-4 h-4" />
            </button>

            {/* Back to Login Link */}
            <p className="text-center text-xs text-[#6B5B5B] mt-4">
              Remember your password?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-[#702C3E] cursor-pointer hover:underline"
              >
                Sign in
              </span>
            </p>
          </form>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6 max-w-xs">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </section>
  );
}

