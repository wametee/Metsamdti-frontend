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

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);
      setError(null);

      // Validation
      if (!email) {
        throw new Error('Email is required');
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // TODO: Call forgot password service when backend is ready
      // const result = await authService.forgotPassword({ email });
      // if (!result.success) {
      //   throw new Error(result.message || 'Failed to send reset email');
      // }

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true };
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Password reset link sent to your email!", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'An error occurred';
      setError(errorMessage);
      setIsSubmitting(false);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center justify-center px-4 py-10">

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
        {!isSubmitted ? (
          <p className="text-sm text-center text-[#6B5B5B] mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        ) : (
          <p className="text-sm text-center text-[#6B5B5B] mb-8">
            Check your email for a password reset link. If you don't see it, check your spam folder.
          </p>
        )}

        {/* Form */}
        {!isSubmitted ? (
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

            {/* Error Message */}
            {error && (
              <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

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
              {isSubmitting ? 'Sending...' : 'Send Reset Link'} <FiArrowUpRight className="w-4 h-4" />
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
        ) : (
          <div className="flex flex-col gap-4">
            {/* Success Message */}
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm text-center">
              Password reset link has been sent to <strong>{email}</strong>
            </div>

            {/* Back to Login Button */}
            <button
              onClick={() => router.push("/login")}
              className="
                mt-4 bg-[#702C3E] text-white
                py-3 rounded-md
                flex items-center justify-center gap-2
                hover:bg-[#5E2333] transition
              "
            >
              Back to Login <FiArrowUpRight className="w-4 h-4" />
            </button>

            {/* Resend Link */}
            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
                setError(null);
              }}
              className="
                text-center text-xs text-[#702C3E] hover:underline
              "
            >
              Didn't receive the email? Try again
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6 max-w-xs">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </section>
  );
}

