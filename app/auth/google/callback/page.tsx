"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const isNewUser = searchParams.get("isNewUser") === "true";
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google authentication failed", {
        position: "top-right",
        autoClose: 3000,
      });
      router.push("/login");
      return;
    }

    if (token) {
      // Store token
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
      }

      toast.success(
        isNewUser
          ? "Account created successfully! Welcome!"
          : "Successfully signed in with Google!",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );

      // Redirect to perfect match page
      setTimeout(() => {
        router.push("/perfect-match");
      }, 500);
    } else {
      toast.error("No token received", {
        position: "top-right",
        autoClose: 3000,
      });
      router.push("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDD4D3]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#702C3E] mx-auto"></div>
        <p className="mt-4 text-[#491A26]">Completing sign in...</p>
      </div>
    </div>
  );
}

