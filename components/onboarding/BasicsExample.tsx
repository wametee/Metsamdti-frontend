"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import { IoMdAdd } from "react-icons/io";
import logo from "@/assets/logo2.png";
import upload from "@/assets/upload.png";
import { onboardingService } from "@/services";
import { useOnboardingSession } from "@/hooks/useOnboardingSession";
import { saveOnboardingData, getOnboardingData, updateOnboardingProgress } from "@/lib/utils/localStorage";
import { useMutation } from "@tanstack/react-query";

/**
 * Example: Updated Basics component with API integration
 * This demonstrates the pattern for all onboarding components
 */
export default function Basics() {
  const router = useRouter();
  const sessionId = useOnboardingSession();
  const [displayName, setDisplayName] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const saved = getOnboardingData();
    if (saved) {
      setDisplayName(saved.displayName || "");
      setFullName(saved.fullName || "");
      setAge(saved.age || "");
      if (saved.photos) {
        setPhotoPreviews(saved.photos);
      }
    }
  }, []);

  // Handle photo selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + photos.length > 6) {
      alert("Maximum 6 photos allowed");
      return;
    }

    setPhotos([...photos, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);
      
      // Save to localStorage first
      saveOnboardingData({
        displayName,
        fullName,
        age: typeof age === "number" ? age : undefined,
        photos: photoPreviews,
      });

      // Get userId from localStorage (should be set during onboarding initialization)
      const userId = typeof window !== "undefined" 
        ? localStorage.getItem("onboarding_user_id") || sessionId
        : sessionId;
      
      if (!userId) {
        throw new Error("User ID not available. Please refresh the page.");
      }

      // Submit to backend
      const result = await onboardingService.submitBasics({
        username: displayName || fullName, // Use displayName as username, fallback to fullName
        fullName,
        age: typeof age === "number" ? age : 0,
        photos: photos.length > 0 ? photos : undefined,
      }, userId);

      if (!result.success) {
        throw new Error(result.message || "Failed to submit");
      }

      // Update progress
      updateOnboardingProgress("basics");

      return result;
    },
    onSuccess: () => {
      // Success - navigation handled by hook
      router.push("/onboarding/background-series-one");
    },
    onError: (error: any) => {
      alert(error.message || "Failed to save basics");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!displayName.trim()) {
      alert("Display name is required");
      return;
    }
    if (!fullName.trim()) {
      alert("Full name is required");
      return;
    }
    if (!age || typeof age !== "number" || age < 18 || age > 100) {
      alert("Please enter a valid age (18-100)");
      return;
    }

    submitMutation.mutate();
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

      {/* White Outer Card */}
      <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-1xl bg-[#EDD4D3] border-2 border-white rounded-2xl py-10 px-6 md:px-20 shadow-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <Image src={logo} alt="Logo" className="w-14 opacity-90" />
        </div>

        {/* Progress Bar */}
        <div className="w-full md:w-11/12 lg:w-10/12 h-2 md:h-3 bg-[#F6E7EA] rounded-full mb-10 md:mb-12 px-2 ml-0">
          <div className="h-full w-[14%] md:w-[8%] lg:w-[6%] bg-[#702C3E] rounded-full"></div>
        </div>

        {/* Header Text */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#491A26] mb-2">
          Your Basics
        </h2>
        <p className="text-sm md:text-base text-[#5A4A4A] font-medium mb-8">
          Let's collect the essential details about you.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-0 md:px-0">
          {/* Display Name */}
          <div>
            <label className="text-base md:text-base text-[#491A26] block mb-1 font-semibold">
              Display Name*
            </label>
            <input
              type="text"
              placeholder="Enter Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-3/4 md:w-2/3 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-black outline-none"
              required
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="text-base md:text-base text-[#491A26] block mb-1 font-semibold">
              Full Name*
            </label>
            <input
              type="text"
              placeholder="Enter Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-3/4 md:w-2/3 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-black outline-none"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="text-base md:text-base text-[#491A26] block mb-1 font-semibold">
              Age*
            </label>
            <input
              type="number"
              placeholder="Enter Age"
              value={age}
              onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : "")}
              min={18}
              max={100}
              className="w-3/4 md:w-2/3 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-black outline-none"
              required
            />
          </div>

          {/* Image Upload Section */}
          <div className="flex flex-col items-center mt-6">
            <p className="self-start text-sm text-[#491A26] mb-2 font-medium">
              Upload your photos (up to 6)
            </p>

            <div className="grid grid-cols-3 gap-4 w-full">
              {/* Photo Previews */}
              {photoPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <Image
                    src={preview}
                    alt={`Photo ${index + 1}`}
                    width={112}
                    height={112}
                    className="w-28 h-28 rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
                      setPhotos(photos.filter((_, i) => i !== index));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              {photoPreviews.length < 6 && (
                <label className="w-28 h-28 rounded-xl flex items-center justify-center bg-[#F6E7EA] border-2 border-dashed border-[#E4D6D6] cursor-pointer hover:bg-[#EDD4D3] transition">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <IoMdAdd className="w-8 h-8 text-[#702C3E]" />
                </label>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#702C3E] text-white px-10 py-3 rounded-md flex items-center gap-2 hover:bg-[#5E2333] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}{" "}
              <FiArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Footer Text */}
        <p className="text-center text-xs text-[#6B5B5B] mt-6">
          By continuing, you agree to our{" "}
          <span className="underline">Terms of Use</span> and{" "}
          <span className="underline">Privacy Policy</span>.
        </p>
      </div>
    </section>
  );
}

