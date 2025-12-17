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
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function Basics() {
  const router = useRouter();

  return (
    <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center 
  pt-24 pb-10 md:py-20 px-4">


      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute left-6 top-6 p-2 rounded-md text-[#702C3E] hover:bg-white/60 z-40"
      >
        <FaArrowLeft className="w-5 h-5" />
      </button>

      {/* Language Switcher */}
      <div className="absolute right-6 top-6">
        <LanguageSwitcher />
      </div>
      
      {/* White Outer Card: slightly wider on medium (laptop) screens */}
      <div className="
        w-full max-w-3xl md:max-w-4xl lg:max-w-1xl
        bg-[#EDD4D3] 
        border-2 border-white 
        rounded-2xl 
        py-10 px-6 md:px-20
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

        {/* Progress Bar (taller and padded on md, narrower on md/lg) */}
        <div className="w-full md:w-11/12 lg:w-10/12 h-2 md:h-3 bg-[#F6E7EA] rounded-full mb-10 md:mb-12 px-2 ml-0">
          <div className="h-full w-[14%] md:w-[8%] lg:w-[6%] bg-[#702C3E] rounded-full"></div>
        </div>

        {/* Header Text */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#491A26] mb-2">
          Your Basics
        </h2>
        <p className="text-sm md:text-base text-[#5A4A4A] font-medium mb-8">
          Let’s collect the essential details about you.
        </p>

        {/* Form Fields */}
  <div className="flex flex-col gap-6 px-0 md:px-0">

          {/* Display Name */}
          <div>
            <label className="text-base md:text-base text-[#491A26] block mb-1 font-semibold">Display Name*</label>
            <input
              type="text"
              placeholder="Enter Display Name"
              className="w-3/4 md:w-2/3 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-black outline-none"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="text-base md:text-base text-[#491A26] block mb-1 font-semibold">Full Name*</label>
            <input
              type="text"
              placeholder="Enter Full Name"
              className="w-3/4 md:w-2/3 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-black outline-none"
            />
          </div>

          {/* Age */}
          <div>
            <label className="text-base md:text-base text-[#491A26] block mb-1 font-semibold">Age*</label>
            <input
              type="number"
              placeholder="Enter Age"
              className="w-3/4 md:w-2/3 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-black outline-none"
            />
          </div>

          {/* Image Upload Section */}
          <div className="flex flex-col items-center mt-6">
            <p className="self-start text-sm text-[#491A26] mb-2 font-medium">Upload your photos</p>

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
