"use client";
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import logo from "@/assets/logo2.png";
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';

export default function ThankYou() {
  const router = useRouter();

  const { isLoaded } = useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on thank you page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  return (
      <section className="min-h-screen w-full bg-[#FCF8F8] relative flex flex-col items-center">
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}></div>

      {/* Top-right language switcher (fixed to top-right across breakpoints) */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Top Bar */}
      <div className="w-full relative flex items-center justify-center px-6 pt-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-2 mx-auto">
          <Image src={logo} alt="Metsamdti Logo" width={80} height={80} />
        </div>
      </div>

      {/* Back button (top-left) */}
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="absolute left-6 top-6 p-2 rounded-md text-[#702C3E] hover:bg-white/60 z-30"
      >
        <FaArrowLeft className="h-5 w-5" />
      </button>

      {/* Background Diagonal Shape */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-[#DDB1B5] opacity-60 clip-path-diagonal"></div>

      {/* Center Card */}
      <div className="relative z-10 mt-24 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] w-[90%] max-w-[620px] p-10 text-center">
        {/* Small Circle Icon */}
        {/* Progress Bar */}
        {/* No progress at the moment but this is here the application process starts, 
          . Profile phase where user inputs  name, username, age and pictures
           Personality evaluation and Emotional evaluation stage is the second phase
           Complete application stage is the third phase where they input signup details and create their account
           In the BackgroundSeriesone, BackgroundSeriesTwo, BackgroundSeriesThree, BackgroundSeriesFour, BackgroundSeriesFive, BackgroundSeriesSix, BackgroundSeriesSeven, BackgroundSeriesEight, BackgroundSeriesNine, EmotionalSeriesOne, EmotionalSeriesTwo, EmotionalSeriesThree, EmotionalSeriesFour, EmotionalSeriesFive, CompleteApplication, 
           we have have the progress bar on each of this components do the matchs and update as user completes each i have added the comments ncalled progress bar
           THe we have the GreatStart.jsx and , completeapplication.jsx which show 1/3, 2/3 then the page after signup and login shows full progress
           they are the steps that the user goes through to complete their application
            */}
        <div className="w-10 h-10 rounded-full border border-[#702C3E] mx-auto mb-6" />

        <h1 className="text-black text-3xl sm:text-4xl md:text-5xl font-bold font-title mb-4">
          Thank you for being here
        </h1>

        <p className="text-[#2F2E2E] text-sm sm:text-base leading-relaxed max-w-md mx-auto font-medium mb-8 text-left">
          As you move through these questions, answer honestly and thoughtfully. Your words will guide us toward someone who shares your values, your vision, and your heart.
        </p>

        {/* Continue Button */}
        <button
          type="button"
          onClick={() => router.push('/onboarding/basics')}
          className="flex items-center gap-2 mx-auto bg-[#702C3E] text-white text-sm font-semibold px-6 py-3 rounded-md hover:bg-[#702C3E]/90 transition"
        >
          Continue
          <FiArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Terms */}
      <p className="absolute bottom-8 text-xs text-[#2F2E2E] text-center w-full px-4">
        By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>
      </p>

      {/* Custom Diagonal Clip */}
      <style>{`
        .clip-path-diagonal {
          clip-path: polygon(40% 0, 100% 0, 100% 100%, 10% 100%);
        }
      `}</style>
    </section>
  );
}
