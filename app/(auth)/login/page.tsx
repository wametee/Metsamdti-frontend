"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import { FiMail, FiLock } from "react-icons/fi";
import { FiEye, FiEyeOff } from '@/lib/icons';
import Image from "next/image";
import logo from "@/assets/logo2.png";
import { authService } from '@/services';
import { useMutation } from '@tanstack/react-query';
import { toast } from "react-toastify";
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);

      // Validation
      if (!email || !password) {
        const errorMsg = 'Email and password are required';
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(errorMsg);
      }

      // Call login service
      const result = await authService.login({ email, password });

      if (!result.success) {
        // Always show generic error message for security
        const errorMsg = result.message || 'Wrong email or password';
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(errorMsg);
      }

      return result;
    },
    onSuccess: () => {
      // Show success toast
      toast.success("Login successful! Redirecting...", {
        position: "top-right",
        autoClose: 2000,
      });
      // Redirect to match-time page after successful login
      setTimeout(() => {
        router.push('/match-time');
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
    },
  });

  // Initialize Google Translate
  useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on login page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center pt-24 pb-10 md:py-20 px-4">
      {/* Hidden Google Translate Element - must exist for translation to work */}
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
        <h2 className="text-2xl font-semibold text-center text-[#491A26] mb-8">
         Login
        </h2>

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
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A6A] z-10" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full bg-[#F6E7EA]
                border border-[#E4D6D6]
                rounded-md
                py-3 pl-11 pr-12
                text-sm text-black
                outline-none
              "
              required
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

          {/* Forgot Password Link */}
          <div className="flex justify-end -mt-2 mb-2">
            <button
              type="button"
              onClick={() => router.push('/forgot-password')}
              className="text-xs text-[#702C3E] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
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
            {isSubmitting ? 'Signing in...' : 'Sign in'} <FiArrowUpRight className="w-4 h-4" />
          </button>

          {/* Login Link */}
          <p className="text-center text-xs text-[#6B5B5B] mt-4">
            Dont have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-[#702C3E] cursor-pointer hover:underline"
            >
              Sign up
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
