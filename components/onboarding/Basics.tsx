"use client";
import upload from '@/assets/upload.png';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';
import Image from 'next/image';
import { IoMdAdd } from 'react-icons/io';
import logo from '@/assets/logo2.png';

export default function Basics() {
  const router = useRouter();

  return (
    <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center py-10 md:py-20 px-4">
      
      {/* Back button (top-left of page) */}
      <button onClick={() => router.back()} className="absolute left-6 top-6 p-2 rounded-md text-[#702C3E] hover:bg-white/60 z-40">
        <FaArrowLeft className="w-5 h-5" />
      </button>

      {/* Language Switcher (top-right) */}
      <div className="absolute right-6 top-6 text-[#702C3E] text-sm cursor-pointer select-none">EN ▾</div>

      {/* White Outer Card */}
      <div className="
        w-full max-w-3xl 
        bg-[#EDD4D3] 
        border-2 border-white 
        rounded-2xl 
        py-10 px-6 md:px-12
        shadow-md
      ">
        
        {/* Logo (centered inside card) */}
        <div className="flex items-center justify-center mb-6">
          <Image 
            src={logo} 
            alt="Logo" 
            className="w-14 opacity-90"
          />
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#E7D3D1] rounded-full mb-10">
          <div className="h-full w-[20%] bg-[#702C3E] rounded-full"></div>
        </div>

        {/* Header Text */}
        <h2 className="text-2xl md:text-3xl font-semibold text-[#491A26] mb-2">
          Your Basics
        </h2>
        <p className="text-sm text-[#5A4A4A] mb-8">
          Let’s collect the essential details about you.
        </p>

        {/* Form Fields */}
        <div className="flex flex-col gap-6">

          {/* Display Name */}
          <div>
            <label className="text-sm text-[#491A26] block mb-1">Display Name*</label>
            <input
              type="text"
              placeholder="Enter Display Name"
              className="w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-black outline-none"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="text-sm text-[#491A26] block mb-1">Full Name*</label>
            <input
              type="text"
              placeholder="Enter Full Name"
              className="w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-black outline-none"
            />
          </div>

          {/* Age */}
          <div>
            <label className="text-sm text-[#491A26] block mb-1">Age*</label>
            <input
              type="number"
              placeholder="Enter Age"
              className="w-3/4 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-black outline-none"
            />
          </div>

          {/* Image Upload Section */}
          <div className="flex flex-col items-center mt-6">
            <p className="self-start text-sm text-[#491A26] mb-3">Upload your photos</p>

            {/* Upload Grid */}
            <div className="grid grid-cols-3 gap-4">

              {/* Main Large Image (reduced size) */}
              <div className="col-span-3 flex justify-center">
                <div className="w-32 h-32 rounded-xl flex items-center justify-center overflow-hidden">
                  <Image src={upload} alt="Upload" width={128} height={128} className="object-contain" />
                </div>
              </div>

              {/* Five Small Upload Boxes */}
              <div className="col-span-3 grid grid-cols-3 gap-4">
                {[1,2,3].map((i) => (
                  <div key={i} className="flex flex-col items-center relative">
                    <div className="w-28 h-28 rounded-xl flex items-center justify-center mx-auto overflow-hidden">
                      <Image src={upload} alt="Upload" width={112} height={112} className="object-contain" />
                    </div>
                    <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-3 bg-white rounded-md p-1 flex items-center justify-center">
                      <IoMdAdd className="w-4 h-4 text-[#702C3E]" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-span-3 flex justify-center gap-4">
                {[4,5].map((i) => (
                  <div key={i} className="flex flex-col items-center relative">
                    <div className="w-28 h-28 rounded-xl flex items-center justify-center overflow-hidden">
                      <Image src={upload} alt="Upload" width={112} height={112} className="object-contain" />
                    </div>
                    <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-3 bg-white rounded-md p-1 flex items-center justify-center">
                      <IoMdAdd className="w-4 h-4 text-[#702C3E]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={() => router.push('/onboarding/background-series-one')}
            className="
              bg-[#702C3E] text-white 
              px-10 py-3 rounded-md 
              flex items-center gap-2
              hover:bg-[#5E2333] transition
            "
          >
            Submit <FiArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-[#6B5B5B] mt-6">
          By continuing, you agree to our <span className="underline">Terms of Use</span> and <span className="underline">Privacy Policy</span>.
        </p>

      </div>
    </section>
  );
}
