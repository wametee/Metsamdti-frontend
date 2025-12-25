"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import Hero from "@/assets/hero.jpg"
import Jebena from "@/assets/Jebena.jpeg"
import { FiArrowUpRight, GiJourney, GiMeditation, GiLovers, AiFillCaretLeft } from '@/lib/icons';
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';
import { useAuthStatus } from '@/hooks/useAuthStatus';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();

  const { isLoaded } = useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on home page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const questions = [
    'Are you tired of casual dating and ready for something real?',
    'Do you long for security and meaning in your relationships?',
    'Are you searching not just for love, but for a lifelong partner?',
    'Do you want a relationship guided by shared values and purpose?',
    'Are you ready to begin a new chapter with clarity and intention?'
  ];

  // Show loading state while checking auth (prevents flash of content)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EDD4D3]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#702C3E] mx-auto"></div>
          <p className="mt-4 text-[#491A26]">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render home page if user is authenticated (redirect will happen)
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}></div>
      
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EDD4D3] to-[#FCF8F8]">

        <Header />

        <div className="relative z-10 px-6 pt-24 pb-20 md:pt-28 md:pb-24">
          <div className="mx-auto max-w-6xl">

            {/* 1) TOP BLOCK: title + subtitle (stacked column) */}
            <div className="text-center">
              <h1 className="text-[34px] sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] text-[#702C3E]">
                Metsamdti — Soulmates,<br />
                <span className="text-[#702C3E] font-bold">Partner for Life</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-regular text-left sm:text-lg md:text-xl leading-relaxed text-[#2F2E2E] font-medium">
                A guided matchmaking website for those who seek a lifelong partner, not casual dating.
              </p>
            </div>

            {/* 2) BELOW BLOCK: left = Ask Yourself + 5 cards, right = image */}
            <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
              {/* LEFT: Ask Yourself + cards */}
              <div className="order-1 lg:order-none">
                <h4
                  className="text-[#491A26] text-lg sm:text-xl font-regular mb-5"
                  style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
                >
                  Ask Yourself
                </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                  {questions.map((q) => (
                    <div
                      key={q}
                      className="
                        rounded-tl-4xl
                        rounded-tr-xl
                        rounded-bl-xl
                        rounded-br-4xl
                        bg-white/80 
                        border border-[#EBD9D8] 
                        shadow-[0_2px_6px_rgba(0,0,0,0.08)] 
                        p-4 
                        text-[#2F2E2E] 
                        text-sm 
                        leading-relaxed
                        font-regular
                      "
                    >
                      {q}
                    </div>
                  ))}
                </div>

              </div>

              {/* RIGHT: image (matches “image on right” requirement) */}
              <div className="order-2 lg:order-none flex justify-center lg:justify-end">
                <div className="relative w-[92%] sm:w-[75%] md:w-[68%] lg:w-[430px] aspect-[4/5] rounded-tr-[48px] rounded-bl-[48px] rounded-tl-[120px] rounded-br-[120px] overflow-hidden shadow-xl">
                  <Image
                    src={Hero} 
                    alt="Couple at a cafe"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 430px, (min-width: 640px) 68vw, 92vw"
                    priority
                    quality={90}
                  />

                  {/* optional bottom text overlay (matches your screenshot vibe) */}
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white text-3xl leading-snug bg-gradient-to-t from-black/65 via-black/15 to-transparent font-regular">
                    If your answer is yes,<br />Metsamdti is here for you.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* subtle bottom divider line like the screenshot */}
        <div className="absolute bottom-8 left-1/2 h-px w-32 -translate-x-1/2 bg-[#702C3E]/30" />
      </section>
      <section className="w-full max-w-6xl mx-auto mt-20 px-6 relative">

      {/* Header */}
      <h2 className="text-[#702C3E] font-title font-bold text-3xl md:text-4xl mb-6">
        How Metsamdti Works
      </h2>

          <div className="relative flex flex-col md:flex-row md:items-start gap-10">

            {/* Left Image */}
            <div className="relative w-full md:w-[460px]   h-[565px] sm:h-[565px] md:h-[565px]">
             <Image
                src={Jebena}
                alt="HowItWorks"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 460px, 100vw"
                loading="lazy"
                quality={85}
              />
            </div>

            {/* Pink Oval Background */}
            <div className="absolute right-0 top-10 w-[530px] h-[420px] bg-[#F6E8EB] rounded-full opacity-60 blur-[1px] hidden md:block"></div>

            {/* Cards Container */}
          {/* Cards Container */}
  <div className="relative flex flex-col gap-6 md:pl-6 min-h-[520px] md:min-h-[640px]">

          {/* Card 1 */}
            <div className="md:absolute md:top-7 md:-left-48 md:z-40 flex items-center md:items-start gap-4 bg-white/90 border border-[#EBD9D8] shadow-md 
                          rounded-tl-[20px] rounded-br-[20px] rounded-tr-[20px] rounded-bl-[20px]
                          p-4 w-[98%] sm:w-[420px] md:w-[576px] min-h-[100px] md:min-h-[110px]">
            <span className="text-[#702C3E99] font-title font-regular text-[36px] md:text-[48px]">01</span>
            <div className="md:self-center">
              <h3 className="text-[#702C3E] font-title font-regular text-lg">
                We ask the hard questions
              </h3>
              <p className="text-[#333] text-sm leading-relaxed mt-1 font-regular">
                The ones people avoid in casual dating, but that matter for a lifetime.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="md:absolute md:top-40 md:-left-30 md:z-30 flex items-center md:items-start gap-4 bg-white/90 border border-[#EBD9D8] shadow-md 
                         rounded-tl-[20px] rounded-br-[20px] rounded-tr-[20px] rounded-bl-[20px]
                          p-4 w-[98%] sm:w-[420px] md:w-[576px] min-h-[100px] md:min-h-[110px]">
            <span className="text-[#702C3E99] font-title font-regular text-[36px] md:text-[48px]">02</span>
            <div className="md:self-center">
              <h3 className="text-[#702C3E] font-title font-regular text-lg">
                We check backgrounds carefully
              </h3>
              <p className="text-[#333] text-sm leading-relaxed mt-1 font-regular">
                So you know who you're really meeting.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="md:absolute md:top-75 md:-left-10 md:z-20 flex items-center md:items-start gap-4 bg-white/90 border border-[#EBD9D8] shadow-md 
                        rounded-tl-[20px] rounded-br-[20px] rounded-tr-[20px] rounded-bl-[20px]
                          p-4 w-[98%] sm:w-[420px] md:w-[576px] min-h-[100px] md:min-h-[110px]">
            <span className="text-[#702C3E99] font-title font-regular text-[36px] md:text-[48px]">03</span>
            <div className="md:self-center">
              <h3 className="text-[#702C3E] font-title font-regular text-lg">
                We curate matches for you
              </h3>
              <p className="text-[#333] text-sm leading-relaxed mt-1 font-regular">
                No swiping, no endless searching.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="md:absolute md:top-110 md:left-0 md:z-10 flex items-center md:items-start gap-4 bg-white/90 border border-[#EBD9D8] shadow-md 
                          rounded-tl-[20px] rounded-br-[20px] rounded-tr-[20px] rounded-bl-[20px]
                          p-4 w-[98%] sm:w-[420px] md:w-[576px] min-h-[100px] md:min-h-[110px]">
            <span className="text-[#702C3E99] font-title font-regular text-[36px] md:text-[48px]">04</span>
            <div className="md:self-center">
              <h3 className="text-[#702C3E] font-title font-regular text-lg">
                We prevent heartbreak
              </h3>
              <p className="text-[#333] text-sm leading-relaxed mt-1 font-regular">
                By ensuring both partners share the same values from the start.
              </p>
            </div>
          </div>

        </div>

          </div>
        </section>
        {/* Sets us apart section */}
        {/* Sets us apart section */}
        <section className="w-full max-w-6xl mx-auto mt-28 px-6">
          {/* Header */}
          <div className="text-center mb-14">
            <h2 className="text-[#702C3E] font-title font-bold text-3xl md:text-4xl leading-tight">
              What set’s us apart?
            </h2>
            <p className="mt-4 text-sm md:text-base text-left text-[#2F2E2E] max-w-xl mx-auto leading-relaxed font-regular">
              Where other dating apps focus on swipes, casual flirting and endless options,
              we focus on intentional love, trust, and lifelong commitment.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white/90 border border-[#EBD9D8] shadow-md 
                            rounded-tl-[28px] rounded-br-[28px] rounded-tr-[20px] rounded-bl-[20px]
                            px-6 py-7 text-center">
              <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center 
                              rounded-lg bg-[#F6E8EB]">
                <GiJourney className="h-8 w-8 text-[#702C3E]" />
              </div>
              <h3 className="text-[#702C3E] font-title font-semibold text-base mb-2">
                Guided journeys
              </h3>
              <p className="text-[#2F2E2E] text-left text-sm leading-relaxed text-regular">
                A guided path for people who are serious about marriage, not games.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/90 border border-[#EBD9D8] shadow-md 
                            rounded-tl-[28px] rounded-br-[28px] rounded-tr-[12px] rounded-bl-[12px]
                            px-6 py-7 text-center">
              <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center 
                              rounded-full bg-[#F6E8EB]">
                <GiMeditation className="h-8 w-8 text-[#702C3E]" />
              </div>
              <h3 className="text-[#702C3E] font-title font-semibold text-base mb-2">
                Deep protection
              </h3>
              <p className="text-[#2F2E2E] text-left text-sm leading-relaxed text-regular">
                Background checks and personal verification to ensure real, honest people.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/90 border border-[#EBD9D8] shadow-md 
                            rounded-tl-[28px] rounded-br-[28px] rounded-tr-[12px] rounded-bl-[12px]
                            px-6 py-7 text-center">
              <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center 
                              rounded-full bg-[#F6E8EB]">
                <GiLovers className="h-8 w-8 text-[#702C3E]" />
              </div>
              <h3 className="text-[#702C3E] font-title font-semibold text-base mb-2">
                Curated matches
              </h3>
              <p className="text-[#2F2E2E] text-sm text-left leading-relaxed text-regular">
                You are not shown random people, only carefully selected matches.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white/90 border border-[#EBD9D8] shadow-md 
                            rounded-tl-[28px] rounded-br-[28px] rounded-tr-[12px] rounded-bl-[12px]
                            px-6 py-7 text-center">
              <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center 
                              rounded-full bg-[#F6E8EB]">
                <AiFillCaretLeft className="h-8 w-8 text-[#702C3E]"/>
              </div>
              <h3 className="text-[#702C3E] font-title font-semibold text-base mb-2">
                Core direction
              </h3>
              <p className="text-[#2F2E2E] text-sm text-left leading-relaxed text-regular">
                Every connection is built on purpose, values, and clear intention.
              </p>
            </div>

          </div>
        </section>

        {/* For Love That Lasts */}
        {/* For Love That Lasts */}
        <section className="w-full mt-28 bg-[#F0DBDA]">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center gap-6 text-center md:text-left">
            
            <h2 className="text-[#702C3E] font-title font-bold text-2xl md:text-3xl lg:text-4xl">
              For Love That Lasts
            </h2>

            <p className=" text-[#2F2E2E] text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto text-left">
              Metsamdti is not for casual dating. If you’re looking for short-term
              connections, silent conversations, or situationships, this is not the place.
              We exist for those who are ready to build real commitment, deep connection,
              and a lifetime journey with the right person.
            </p>

          </div>
        </section>


        <Footer />


      {/* Mobile CTA (optional) */}
      <div className="fixed bottom-6 left-1/2 z-50 hidden -translate-x-1/2 md:block md:hidden">
        <a
          href="/onboarding/welcome"
          className="group flex items-center gap-2 rounded-full bg-[#702C3E] px-8 py-4 font-semibold text-white shadow-2xl transition hover:bg-[#702C3E]/90"
        >
          Get Started
          <FiArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
      </div>
    </>
  );
}
