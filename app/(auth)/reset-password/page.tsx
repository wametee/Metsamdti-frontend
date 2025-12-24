"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight, FiLock } from "react-icons/fi";
import { FiEye, FiEyeOff } from '@/lib/icons';
import Image from "next/image";
import logo from "@/assets/logo2.png";
import { useMutation } from '@tanstack/react-query';
import { toast } from "react-toastify";
import httpClient from '@/lib/httpClient';
import { validatePassword, showValidationError, validationMessages } from '@/lib/utils/validation';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-focus first input when page loads
  useEffect(() => {
    if (inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, []);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      router.push('/forgot-password');
    }
  }, [email, router]);

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);

    if (digits.length === 6) {
      const newCode = digits.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const resendCode = async () => {
    if (countdown > 0 || !email) {
      return;
    }

    setIsResending(true);
    try {
      const response = await httpClient.post('/password-reset/resend', { email });
      if (response.data.success) {
        setCountdown(60);
        toast.success('Reset code resent successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        throw new Error(response.data.message || 'Failed to resend code');
      }
    } catch (error: any) {
      console.error('Error resending code:', error);
      toast.error(error.response?.data?.message || 'Failed to resend reset code', {
        position: 'top-right',
      });
    } finally {
      setIsResending(false);
    }
  };

  const resetMutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);

      const verificationCode = code.join('');
      
      if (verificationCode.length !== 6) {
        const errorMsg = 'Please enter the complete 6-digit code';
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(errorMsg);
      }

      // Validate password
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        const errorMsg = passwordValidation.message!;
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(errorMsg);
      }

      // Validate password match
      if (newPassword !== confirmPassword) {
        const errorMsg = validationMessages.password.match;
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(errorMsg);
      }

      // Call reset password API
      const response = await httpClient.post('/password-reset/reset', {
        email,
        code: verificationCode,
        newPassword,
      });

      if (!response.data.success) {
        const errorMsg = response.data.message || 'Failed to reset password';
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(errorMsg);
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success("Password reset successfully! Redirecting to login...", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        router.push('/login');
      }, 500);
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
      // Clear code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetMutation.mutate();
  };

  // Initialize Google Translate
  useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on reset password page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  if (!email) {
    return null; // Will redirect
  }

  return (
    <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center pt-24 pb-10 md:py-20 px-4">
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
      <div className="w-full max-w-md bg-[#EDD4D3] border-2 border-white rounded-2xl px-6 py-10 shadow-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src={logo} alt="Logo" className="w-14 opacity-90" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-[#491A26] mb-2">
          Reset Password
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-center text-[#6B5B5B] mb-8">
          Enter the code sent to <strong>{email}</strong> and your new password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Code Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#491A26] mb-4 text-center">
              Enter the 6-digit code
            </label>
            <div className="flex gap-3 justify-center">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="
                    w-12 h-14
                    text-center text-2xl font-bold
                    text-black
                    bg-[#F6E7EA] border-2 border-[#E4D6D6]
                    rounded-lg
                    focus:border-[#702C3E] focus:outline-none
                    transition-colors
                  "
                />
              ))}
            </div>
          </div>

          {/* Resend Code */}
          <div className="text-center mb-4">
            <button
              type="button"
              onClick={resendCode}
              disabled={isResending || countdown > 0}
              className="text-sm text-[#702C3E] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? 'Sending...' : countdown > 0 ? `Resend code in ${countdown}s` : "Didn't receive the code? Resend"}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A6A] z-10" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="
                w-full bg-[#F6E7EA]
                border border-[#E4D6D6]
                rounded-md
                py-3 pl-11 pr-12
                text-sm text-black
                outline-none
              "
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6A6A] hover:text-[#702C3E] transition-colors z-10 p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A6A] z-10" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="
                w-full bg-[#F6E7EA]
                border border-[#E4D6D6]
                rounded-md
                py-3 pl-11 pr-12
                text-sm text-black
                outline-none
              "
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6A6A] hover:text-[#702C3E] transition-colors z-10 p-1"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || code.join('').length !== 6}
            className="
              mt-4 bg-[#702C3E] text-white
              py-3 rounded-md
              flex items-center justify-center gap-2
              hover:bg-[#5E2333] transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'} <FiArrowUpRight className="w-4 h-4" />
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

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

