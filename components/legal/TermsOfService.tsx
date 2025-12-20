"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TermsOfService() {
  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EDD4D3] to-[#FCF8F8]">
        <Header />

        <div className="relative z-10 px-6 pt-24 pb-20 md:pt-28 md:pb-24">
          <div className="mx-auto max-w-4xl">
            {/* Title */}
            <div className="text-center mb-16">
              <h1 className="text-[34px] sm:text-5xl md:text-6xl font-bold leading-[1.02] text-[#702C3E] mb-6">
                Terms of Service
              </h1>
              <div className="h-px w-24 bg-[#702C3E]/30 mx-auto"></div>
            </div>

            {/* Content Card */}
            <div className="bg-white border-2 border-[#EBD9D8] shadow-xl rounded-tl-[32px] rounded-br-[32px] rounded-tr-[24px] rounded-bl-[24px] px-8 py-12 md:px-16 md:py-20">
              {/* Introduction */}
              <div className="mb-12 pb-10 border-b-2 border-[#EBD9D8]">
                <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                  Welcome to Metsamdti ("we", "us", "our", or "the Service").
                </p>
                <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mt-5">
                  These Terms of Service govern your access to and use of the Metsamdti matchmaking platform.
                </p>
                <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mt-5">
                  By creating an account, submitting an application, or using Metsamdti in any way, you agree to be bound by these Terms of Service.
                </p>
                <div className="mt-8 p-4 bg-[#F6E8EB]/50 border-l-4 border-[#702C3E] rounded-r-md">
                  <p className="text-base md:text-lg text-[#702C3E] leading-relaxed font-semibold">
                    If you do not agree, you must not use the Service.
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-14">
                {/* Section 1 */}
                <section className="pb-10 border-b border-[#EBD9D8]/60">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6E8EB] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-[#702C3E]">1</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#702C3E] mb-6">
                        Purpose of Metsamdti
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-6">
                        Metsamdti is a serious-relationship matchmaking platform intended for people seeking a long-term partner.
                      </p>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-semibold mb-4">
                        Users are required to:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Create a personal profile</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Complete a CV-style background questionnaire</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Complete an emotional compatibility questionnaire</span>
                        </li>
                      </ul>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-3">
                        Metsamdti does not function like traditional dating apps.
                      </p>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        Users cannot browse or search other profiles.
                      </p>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-semibold mb-4">
                        Matches are provided only after:
                      </p>
                      <ul className="space-y-3 mb-4">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Algorithmic compatibility analysis</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Manual review by Metsamdti administration</span>
                        </li>
                      </ul>
                      <div className="mt-6 p-4 bg-[#F6E8EB]/30 border-l-4 border-[#702C3E] rounded-r-md">
                        <p className="text-base md:text-lg text-[#702C3E] leading-relaxed font-semibold">
                          Only approved matches are shown to users.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 2 */}
                <section className="pb-10 border-b border-[#EBD9D8]/60">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6E8EB] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-[#702C3E]">2</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#702C3E] mb-6">
                        Eligibility
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        To use Metsamdti, you must:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Be at least 22 years old</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Be legally capable of entering into this agreement</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Provide truthful, accurate, and complete information</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Use the Service solely for serious relationship purposes</span>
                        </li>
                      </ul>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                        Metsamdti reserves the right to request proof of age or identity if false information is suspected.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 3 */}
                <section className="pb-10 border-b border-[#EBD9D8]/60">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6E8EB] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-[#702C3E]">3</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#702C3E] mb-6">
                        User Account Responsibilities
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        You are responsible for:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Maintaining the confidentiality of your login credentials</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">All activity conducted under your account</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Ensuring all submitted information is accurate and up to date</span>
                        </li>
                      </ul>
                      <div className="mt-6 p-4 bg-red-50/50 border-l-4 border-red-400 rounded-r-md">
                        <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-semibold">
                          Providing false, misleading, or incomplete information may result in immediate account suspension or deletion.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 4 */}
                <section className="pb-10 border-b border-[#EBD9D8]/60">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6E8EB] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-[#702C3E]">4</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#702C3E] mb-6">
                        "Background Check" Clarification
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        When Metsamdti refers to a "background check", this means:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Reviewing user-submitted CV-style background information</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Reviewing lifestyle, family situation, relationship history, and preferences</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Evaluating emotional compatibility answers</span>
                        </li>
                      </ul>
                      <p className="text-base md:text-lg text-[#702C3E] leading-relaxed font-semibold mb-4">
                        Metsamdti does NOT perform:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Criminal or police background checks</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Government identity verification</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Financial or credit checks</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Employment verification</span>
                        </li>
                      </ul>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                        All information is self-reported by users, and Metsamdti does not guarantee its accuracy.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 5 */}
                <section className="pb-10 border-b border-[#EBD9D8]/60">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6E8EB] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-[#702C3E]">5</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#702C3E] mb-6">
                        Matching Process
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        A match is provided only after:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Completion of all required questionnaires</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Algorithmic compatibility analysis</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Manual admin review</span>
                        </li>
                      </ul>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        When a match is approved:
                      </p>
                      <ul className="space-y-3 mb-4">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">The user receives a preview</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">The user may accept the match</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Acceptance requires a one-time payment</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Upon payment, a private 24-hour chat window is unlocked.</span>
                        </li>
                      </ul>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                        After 24 hours, the chat closes automatically and cannot be reopened.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 6 */}
                <section className="pb-10 border-b border-[#EBD9D8]/60">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6E8EB] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-[#702C3E]">6</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#702C3E] mb-6">
                        Pay-Per-Match Model
                      </h2>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Payments are required to unlock full profile visibility and chat</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Each payment applies to one match only</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">The Service is considered fully delivered once the chat opens</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 7 */}
                <section className="pb-10 border-b border-[#EBD9D8]/60">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6E8EB] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-[#702C3E]">7</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#702C3E] mb-6">
                        Refund Policy
                      </h2>
                      <div className="mb-6 p-5 bg-red-50/50 border-l-4 border-red-400 rounded-r-md">
                        <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-semibold">
                          All payments on Metsamdti are non-refundable.
                        </p>
                      </div>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        No refunds will be issued for:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Disliking a match</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Changing your mind</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Not using the chat</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Chat expiration</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Relationship outcomes</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Personal dissatisfaction with compatibility</span>
                        </li>
                      </ul>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        Refunds may occur only if required by law, including:
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Accidental double payment</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Technical failure preventing access to the service</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Payment processor error</span>
                        </li>
                      </ul>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mt-6">
                        These exceptions apply only where consumer law legally requires a refund.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 8 */}
                <section className="pb-10 border-b border-[#EBD9D8]/60">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6E8EB] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-[#702C3E]">8</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#702C3E] mb-6">
                        User Conduct
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        Users must not:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Harass, threaten, or abuse others</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Upload explicit, violent, hateful, or discriminatory content</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Impersonate another person</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Use the Service for scams, fraud, or illegal activity</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Misuse or share another user's private information</span>
                        </li>
                      </ul>
                      <div className="mt-6 p-4 bg-red-50/50 border-l-4 border-red-400 rounded-r-md">
                        <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-semibold">
                          Violation of these rules may result in immediate account removal.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 9 */}
                <section className="pb-10 border-b border-[#EBD9D8]/60">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6E8EB] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-[#702C3E]">9</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#702C3E] mb-6">
                        Account Suspension and Deletion
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        Metsamdti may suspend or permanently delete an account if:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">The account is reported by users more than twice</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">The account appears fake, misleading, or unsafe</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Fraud, harassment, or harmful behavior is suspected</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">False information is provided (including age or relationship status)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">The user violates these Terms</span>
                        </li>
                      </ul>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                        For safety reasons, Metsamdti is not required to give prior notice before removal.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 10 */}
                <section className="pb-10 border-b border-[#EBD9D8]/60">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6E8EB] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-[#702C3E]">10</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#702C3E] mb-6">
                        Safety Disclaimer
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        Metsamdti does not guarantee:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Relationship success</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Emotional compatibility</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Accuracy of user-submitted information</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Safety of offline meetings</span>
                        </li>
                      </ul>
                      <div className="mt-6 p-4 bg-amber-50/50 border-l-4 border-amber-400 rounded-r-md">
                        <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-semibold">
                          Users are solely responsible for their interactions, decisions, and meetings.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 11 */}
                <section className="pb-10 border-b border-[#EBD9D8]/60">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6E8EB] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-[#702C3E]">11</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#702C3E] mb-6">
                        Limitation of Liability
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        To the fullest extent permitted by law, Metsamdti is not liable for:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">User behavior</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Emotional, financial, or personal damages</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Loss of data</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Technical interruptions</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-500 font-bold text-lg mt-0.5">✕</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Outcomes of matches or relationships</span>
                        </li>
                      </ul>
                      <div className="mt-6 p-4 bg-amber-50/50 border-l-4 border-amber-400 rounded-r-md">
                        <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-semibold">
                          Use of the Service is at your own risk.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 12 */}
                <section className="pb-10 border-b border-[#EBD9D8]/60">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6E8EB] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-[#702C3E]">12</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#702C3E] mb-6">
                        Privacy
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-3">
                        Personal data is processed according to our Privacy Policy.
                      </p>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                        By using Metsamdti, you consent to this processing.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 13 */}
                <section className="pb-10 border-b border-[#EBD9D8]/60">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6E8EB] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-[#702C3E]">13</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#702C3E] mb-6">
                        Governing Law
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                        These Terms of Service are governed by the laws of Sweden, with consideration for international users.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 14 */}
                <section>
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6E8EB] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-[#702C3E]">14</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#702C3E] mb-6">
                        Changes to These Terms
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-3">
                        Metsamdti may update these Terms at any time.
                      </p>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                        Continued use of the Service constitutes acceptance of the updated Terms.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
