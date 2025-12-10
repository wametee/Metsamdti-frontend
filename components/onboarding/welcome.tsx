import Header from '@/components/layout/Header';
import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';
import Image from 'next/image';
import logo from '@/assets/logo2.png';

export default function Welcome() {
  return (
    <section className="min-h-screen w-full bg-[#FCF8F8] flex flex-col md:justify-center relative">
      {/* Top Right Language Switch */}
      <div className="absolute top-6 right-6 text-sm text-[#2F2E2E]">
        <div className="border border-[#E0D2D2] rounded-md px-3 py-1 cursor-pointer hover:bg-white/60 transition">
          EN ▾
        </div>
      </div>

     

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center text-center px-6 pt-40 sm:pt-40 md:pt-1 pb-10">        
        {/* Logo + Title */}

        {/* Render the logo here */}
        <div className="mt-1">
          <div className="flex items-center justify-center gap-2 mx-auto">
            <Image src={logo} alt="Metsamdti" width={80} height={80} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#702C3E]">
            Welcome to <span className="text-[#702C3E]">Metsamdti</span>
          </h1>

          <p className="mt-4 max-w-lg mx-auto text-sm sm:text-base md:text-lg leading-relaxed text-[#2F2E2E] font-regular">
            This is a space created with intention — a place to slow down, reflect, and honor the kind of 
            connection you seek.<br />Your journey begins here.
          </p>
        </div>

        {/* Begin Button */}
        <div className="mt-10">
          <Link
            href="/onboarding/thankyou"
            className="group inline-flex items-center gap-2 bg-[#702C3E] text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-[#702C3E]/90 transition"
          >
            Begin
            <FiArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        {/* Terms (removed inline for mobile/tables — moved to bottom for all sizes) */}
      </div>

      {/* Terms positioned at the bottom for all screen sizes (mobile & tablets included) */}
      <div className="absolute bottom-6 w-full text-center px-4 z-20">
        <p className="text-xs text-[#2F2E2E] mx-auto max-w-2xl">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="underline">Terms of Service</Link>{' '}and{' '}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
}
