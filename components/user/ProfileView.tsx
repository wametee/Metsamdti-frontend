"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";
import logo from "@/assets/logo2.png";

export default function ProfileView() {
  const router = useRouter();

  // Static profile data for now
  const profileData = {
    name: "Sunshine",
    children: "Has children",
    partnerWithChildren: "Not Open",
    marriageTimeline: "Ready soon",
    maritalHistory: "Never married",
    conflictHandling: "Communicator",
    loveLanguage: "Words",
    faithImportance: "Faith-centered",
    culturalPreference: "Different culture",
    weekendStyle: "Introvert",
    livingSituation: "Family-based",
    educationLevel: "University/Other",
    languagesSpoken: "Multilingual",
    images: [
      "image1.png",
      "image2.png",
      "image3.png",
      "image4.png",
      "image5.png",
    ],
  };

  return (
    <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center 
    pt-24 pb-10 md:py-20 px-4">

      {/* Header with Profile Name and Language Switcher */}
      <div className="absolute top-6 right-6 flex items-center gap-4 text-[#702C3E] text-sm z-40">
        <div className="flex items-center gap-1 border border-[#E5D5D5] rounded-md px-3 py-1 cursor-pointer bg-white/60">
          <span>John</span>
          <span className="text-xs">▾</span>
        </div>

        <div className="flex items-center gap-1 border border-[#E5D5D5] rounded-md px-3 py-1 cursor-pointer bg-white/60">
          <span>EN</span>
          <span className="text-xs">▾</span>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute left-6 top-6 p-2 rounded-md text-[#702C3E] hover:bg-white/60 z-40"
      >
        <FaArrowLeft className="w-5 h-5" />
      </button>

      {/* Outer Card */}
      <div className="
        w-full max-w-3xl md:max-w-4xl lg:max-w-1xl
        bg-[#EDD4D3] 
        border-2 border-white 
        rounded-2xl 
        py-10 px-6 md:px-20
        shadow-md 
      ">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <Image src={logo} alt="Logo" className="w-14 opacity-90" />
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
          About {profileData.name}
        </h2>

        {/* Horizontal line below title */}
        <div className="w-full h-px bg-[#E4D6D6] mb-6"></div>

        {/* Profile Details - Two Column Layout */}
        <div className="border border-[#E4D6D6] rounded-lg p-6 md:p-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              {/* Children */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#6B5B5B] font-medium">Children:</span>
                <span className="text-base text-[#2F2E2E] font-semibold">
                  {profileData.children}
                </span>
              </div>

              {/* Marriage timeline */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#6B5B5B] font-medium">Marriage timeline:</span>
                <span className="text-base text-[#2F2E2E] font-semibold">
                  {profileData.marriageTimeline}
                </span>
              </div>

              {/* Conflict handling */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#6B5B5B] font-medium">Conflict handling:</span>
                <span className="text-base text-[#2F2E2E] font-semibold">
                  {profileData.conflictHandling}
                </span>
              </div>

              {/* Faith Importance */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#6B5B5B] font-medium">Faith Importance:</span>
                <span className="text-base text-[#2F2E2E] font-semibold">
                  {profileData.faithImportance}
                </span>
              </div>

              {/* Weekend style */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#6B5B5B] font-medium">Weekend style:</span>
                <span className="text-base text-[#2F2E2E] font-semibold">
                  {profileData.weekendStyle}
                </span>
              </div>

              {/* Education level */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#6B5B5B] font-medium">Education level:</span>
                <span className="text-base text-[#2F2E2E] font-semibold">
                  {profileData.educationLevel}
                </span>
              </div>

              {/* Images - Left Column (first 3) */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#6B5B5B] font-medium">Images:</span>
                <div className="flex flex-col gap-1 mt-1">
                  {profileData.images.slice(0, 3).map((image, index) => (
                    <span key={index} className="text-base text-[#2F2E2E] font-semibold">
                      {image}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Vertical divider - positioned between columns */}
            <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-px bg-[#E4D6D6] -translate-x-1/2"></div>

            {/* Right Column */}
            <div className="flex flex-col gap-6 relative">
              {/* Partner with children */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#6B5B5B] font-medium">partner with children:</span>
                <span className="text-base text-[#2F2E2E] font-semibold">
                  {profileData.partnerWithChildren}
                </span>
              </div>

              {/* Marital history */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#6B5B5B] font-medium">Marital history:</span>
                <span className="text-base text-[#2F2E2E] font-semibold">
                  {profileData.maritalHistory}
                </span>
              </div>

              {/* Love language */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#6B5B5B] font-medium">Love language:</span>
                <span className="text-base text-[#2F2E2E] font-semibold">
                  {profileData.loveLanguage}
                </span>
              </div>

              {/* Cultural preference */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#6B5B5B] font-medium">Cultural preference:</span>
                <span className="text-base text-[#2F2E2E] font-semibold">
                  {profileData.culturalPreference}
                </span>
              </div>

              {/* Living situation */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#6B5B5B] font-medium">Living situation:</span>
                <span className="text-base text-[#2F2E2E] font-semibold">
                  {profileData.livingSituation}
                </span>
              </div>

              {/* Languages spoken */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#6B5B5B] font-medium">Languages spoken:</span>
                <span className="text-base text-[#2F2E2E] font-semibold">
                  {profileData.languagesSpoken}
                </span>
              </div>

              {/* Images - Right Column (last 2) */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#6B5B5B] font-medium opacity-0">Images:</span>
                <div className="flex flex-col gap-1 mt-1">
                  {profileData.images.slice(3, 5).map((image, index) => (
                    <span key={index} className="text-base text-[#2F2E2E] font-semibold">
                      {image}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </section>
  );
}
