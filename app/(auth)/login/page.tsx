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

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);
      setError(null);

      // Validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Call login service
      const result = await authService.login({ email, password });

      if (!result.success) {
        throw new Error(result.message || 'Login failed');
      }

      return result;
    },
    onSuccess: () => {
      // Redirect to perfect match page after successful login
      router.push('/perfect-match');
    },
    onError: (error: any) => {
      setError(error.message || 'An error occurred');
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center pt-24 pb-10 md:py-20 px-4">

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

          {/* Error Message */}
          {error && (
            <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

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

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#D6C2C2]" />
            <span className="text-xs text-[#6B5B5B]">or</span>
            <div className="flex-1 h-px bg-[#D6C2C2]" />
          </div>

          {/* Google Button */}
          <button
            className="
              w-full bg-white
              border border-[#E4D6D6]
              py-3 rounded-md
              text-sm text-[#491A26]
              hover:bg-[#FAF3F3] transition
            "
          >
            Continue with Google
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
