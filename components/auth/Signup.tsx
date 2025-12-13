"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import { FiMail, FiLock } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/logo2.png";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center pt-24 pb-10 md:py-20 px-4">

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute left-6 top-6 p-2 rounded-md text-[#702C3E] hover:bg-white/60 z-40"
      >
        <FaArrowLeft className="w-5 h-5" />
      </button>

      {/* Language Switcher */}
      <div className="absolute right-6 top-6 text-[#702C3E] text-sm cursor-pointer select-none">
        EN ▾
      </div>

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
          Create Application
        </h2>

        {/* Form */}
        <div className="flex flex-col gap-4">

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
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A6A]" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full bg-[#F6E7EA]
                border border-[#E4D6D6]
                rounded-md
                py-3 pl-11 pr-4
                text-sm text-black
                outline-none
              "
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A6A]" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="
                w-full bg-[#F6E7EA]
                border border-[#E4D6D6]
                rounded-md
                py-3 pl-11 pr-4
                text-sm text-black
                outline-none
              "
            />
          </div>

          {/* Sign Up Button */}
          <button
            className="
              mt-4 bg-[#702C3E] text-white
              py-3 rounded-md
              flex items-center justify-center gap-2
              hover:bg-[#5E2333] transition
            "
          >
            Sign Up <FiArrowUpRight className="w-4 h-4" />
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
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-[#702C3E] cursor-pointer hover:underline"
            >
              Log in
            </span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6 max-w-xs">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </section>
  );
}
