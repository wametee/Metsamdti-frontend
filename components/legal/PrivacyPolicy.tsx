"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EDD4D3] to-[#FCF8F8]">
        <Header />

        <div className="relative z-10 px-6 pt-24 pb-20 md:pt-28 md:pb-24">
          <div className="mx-auto max-w-4xl">
            {/* Title */}
            <div className="text-center mb-16">
              <h1 className="text-[34px] sm:text-5xl md:text-6xl font-bold leading-[1.02] text-[#702C3E] mb-6">
                Privacy Policy
              </h1>
              <div className="h-px w-24 bg-[#702C3E]/30 mx-auto"></div>
            </div>

            {/* Content Card */}
            <div className="bg-white border-2 border-[#EBD9D8] shadow-xl rounded-tl-[32px] rounded-br-[32px] rounded-tr-[24px] rounded-bl-[24px] px-8 py-12 md:px-16 md:py-20">
              {/* Introduction */}
              <div className="mb-12 pb-10 border-b-2 border-[#EBD9D8]">
                <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                  This Privacy Policy explains how Metsamdti collects, uses, stores, and protects personal data.
                </p>
                <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mt-5">
                  Metsamdti is based in Sweden and complies with the General Data Protection Regulation (GDPR).
                </p>
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
                        Personal Data We Collect
                      </h2>
                      
                      <div className="mb-8">
                        <h3 className="text-xl md:text-2xl font-semibold text-[#702C3E] mb-4">
                          A. Information You Provide
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Name</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Email address</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Age (22+)</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Country and region</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Profile information</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Photos</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Relationship preferences</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Living situation</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Family status</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">CV-style background questionnaire answers</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Emotional compatibility questionnaire answers</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Match responses</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Chat messages during the 24-hour chat window</span>
                          </li>
                        </ul>
                      </div>

                      <div className="mb-8">
                        <h3 className="text-xl md:text-2xl font-semibold text-[#702C3E] mb-4">
                          B. Automatically Collected Data
                        </h3>
                        <ul className="space-y-3 mb-4">
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">IP address</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Device and browser type</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Usage data and timestamps</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                            <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Cookie data</span>
                          </li>
                        </ul>
                        <div className="mt-4 p-4 bg-[#F6E8EB]/30 border-l-4 border-[#702C3E] rounded-r-md">
                          <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                            We do not collect precise GPS location data.
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold text-[#702C3E] mb-4">
                          C. Payment Data
                        </h3>
                        <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-3">
                          Payments are processed by third-party providers.
                        </p>
                        <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                          Metsamdti does not store credit or debit card details.
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
                        How We Use Personal Data
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        We use your data to:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Create and manage accounts</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Analyze compatibility</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Deliver matches</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Conduct admin review</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Enable chat functionality</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Process payments</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Improve the Service</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Prevent fraud and misuse</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Ensure user safety</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Comply with legal obligations</span>
                        </li>
                      </ul>
                      <div className="mt-6 p-4 bg-[#F6E8EB]/30 border-l-4 border-[#702C3E] rounded-r-md">
                        <p className="text-base md:text-lg text-[#702C3E] leading-relaxed font-semibold">
                          We do not sell personal data.
                        </p>
                      </div>
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
                        Legal Basis for Processing (GDPR)
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        Data processing is based on:
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Consent</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Contractual necessity</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Legitimate interests (service improvement and safety)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Legal obligations</span>
                        </li>
                      </ul>
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
                        Data Sharing
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        We may share data with:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Hosting providers</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Payment processors</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Email and analytics services</span>
                        </li>
                      </ul>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-3">
                        We share only what is necessary.
                      </p>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                        User data is shared with other users only after a match is accepted.
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
                        Cookies
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        Cookies are used to:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Maintain sessions</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Save preferences</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Improve performance</span>
                        </li>
                      </ul>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                        You may disable cookies in your browser, though some features may not work.
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
                        Data Retention
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        Data is retained:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">While your account is active</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Up to 12 months after deletion for legal and safety purposes</span>
                        </li>
                      </ul>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                        After this, data is deleted or anonymised.
                      </p>
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
                        Your Rights (GDPR)
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        You have the right to:
                      </p>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Access your data</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Correct inaccurate data</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Request deletion</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Withdraw consent</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">Request data portability</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-[#702C3E] font-bold text-lg mt-0.5">•</span>
                          <span className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">File a complaint with a data protection authority</span>
                        </li>
                      </ul>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-3">
                        Requests can be sent to:
                      </p>
                      <div className="p-4 bg-[#F6E8EB]/30 border-l-4 border-[#702C3E] rounded-r-md">
                        <p className="text-base md:text-lg text-[#702C3E] leading-relaxed font-semibold">
                          support@metsamdti.com
                        </p>
                      </div>
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
                        Data Security
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-3">
                        We use reasonable technical and organisational measures to protect data.
                      </p>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                        No system is completely secure.
                      </p>
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
                        Account Safety
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                        Accounts may be reviewed, suspended, or deleted to protect user safety and platform integrity.
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
                        International Use
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-3">
                        Metsamdti operates globally.
                      </p>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                        Data may be processed outside your country but always under GDPR-level protection.
                      </p>
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
                        Changes to This Policy
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-3">
                        This Privacy Policy may be updated.
                      </p>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular">
                        Material changes will be communicated to users.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 12 */}
                <section>
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6E8EB] flex items-center justify-center">
                      <span className="text-xl md:text-2xl font-bold text-[#702C3E]">12</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#702C3E] mb-6">
                        Contact
                      </h2>
                      <p className="text-base md:text-lg text-[#2F2E2E] leading-relaxed font-regular mb-4">
                        For privacy questions or data requests:
                      </p>
                      <div className="p-4 bg-[#F6E8EB]/30 border-l-4 border-[#702C3E] rounded-r-md">
                        <p className="text-base md:text-lg text-[#702C3E] leading-relaxed font-semibold">
                          support@metsamdti.com
                        </p>
                      </div>
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
