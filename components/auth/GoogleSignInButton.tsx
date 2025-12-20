"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { authService } from "@/services";
import { toast } from "react-toastify";

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  className = "",
  children,
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      setIsLoading(true);

      // Get user info from Google using access token
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
      );

      if (!userInfoResponse.ok) {
        throw new Error("Failed to get user info from Google");
      }

      const userInfo = await userInfoResponse.json();

      // For now, we'll use the access token as the ID token
      // In production, you should request the ID token from Google
      // For a more secure approach, use the authorization code flow on the backend
      const result = await authService.googleAuth(tokenResponse.access_token);

      if (!result.success) {
        throw new Error(result.message || "Google authentication failed");
      }

      toast.success("Successfully signed in with Google!", {
        position: "top-right",
        autoClose: 2000,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        // Default redirect
        router.push("/perfect-match");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Google authentication failed";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (error) => {
      console.error("Google login error:", error);
      const errorMessage = "Failed to sign in with Google";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      if (onError) {
        onError(errorMessage);
      }
      setIsLoading(false);
    },
  });

  return (
    <button
      onClick={() => {
        setIsLoading(true);
        login();
      }}
      disabled={isLoading}
      className={`
        w-full bg-white
        border border-[#E4D6D6]
        py-3 rounded-md
        text-sm text-[#491A26]
        hover:bg-[#FAF3F3] transition
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-[#702C3E]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Signing in...
        </>
      ) : (
        children || "Continue with Google"
      )}
    </button>
  );
}

