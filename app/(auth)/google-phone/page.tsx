"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight, FiPhone } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import { authService } from '@/services';
import { useMutation } from '@tanstack/react-query';
import { toast } from "react-toastify";

export default function GooglePhonePage() {
  const router = useRouter();
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1"); // Default to US
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comprehensive list of all countries with flags and codes
  const countryCodes = [
    { code: "+1", country: "United States", flag: "🇺🇸" },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
    { code: "+254", country: "Kenya", flag: "🇰🇪" },
    { code: "+234", country: "Nigeria", flag: "🇳🇬" },
    { code: "+27", country: "South Africa", flag: "🇿🇦" },
    { code: "+233", country: "Ghana", flag: "🇬🇭" },
    { code: "+255", country: "Tanzania", flag: "🇹🇿" },
    { code: "+256", country: "Uganda", flag: "🇺🇬" },
    { code: "+250", country: "Rwanda", flag: "🇷🇼" },
    { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
    { code: "+212", country: "Morocco", flag: "🇲🇦" },
    { code: "+20", country: "Egypt", flag: "🇪🇬" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+82", country: "South Korea", flag: "🇰🇷" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+60", country: "Malaysia", flag: "🇲🇾" },
    { code: "+62", country: "Indonesia", flag: "🇮🇩" },
    { code: "+66", country: "Thailand", flag: "🇹🇭" },
    { code: "+84", country: "Vietnam", flag: "🇻🇳" },
    { code: "+63", country: "Philippines", flag: "🇵🇭" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+64", country: "New Zealand", flag: "🇳🇿" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+39", country: "Italy", flag: "🇮🇹" },
    { code: "+34", country: "Spain", flag: "🇪🇸" },
    { code: "+31", country: "Netherlands", flag: "🇳🇱" },
    { code: "+32", country: "Belgium", flag: "🇧🇪" },
    { code: "+41", country: "Switzerland", flag: "🇨🇭" },
    { code: "+43", country: "Austria", flag: "🇦🇹" },
    { code: "+46", country: "Sweden", flag: "🇸🇪" },
    { code: "+47", country: "Norway", flag: "🇳🇴" },
    { code: "+45", country: "Denmark", flag: "🇩🇰" },
    { code: "+358", country: "Finland", flag: "🇫🇮" },
    { code: "+351", country: "Portugal", flag: "🇵🇹" },
    { code: "+30", country: "Greece", flag: "🇬🇷" },
    { code: "+48", country: "Poland", flag: "🇵🇱" },
    { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
    { code: "+36", country: "Hungary", flag: "🇭🇺" },
    { code: "+40", country: "Romania", flag: "🇷🇴" },
    { code: "+7", country: "Russia", flag: "🇷🇺" },
    { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+974", country: "Qatar", flag: "🇶🇦" },
    { code: "+965", country: "Kuwait", flag: "🇰🇼" },
    { code: "+973", country: "Bahrain", flag: "🇧🇭" },
    { code: "+968", country: "Oman", flag: "🇴🇲" },
    { code: "+961", country: "Lebanon", flag: "🇱🇧" },
    { code: "+962", country: "Jordan", flag: "🇯🇴" },
    { code: "+972", country: "Israel", flag: "🇮🇱" },
    { code: "+90", country: "Turkey", flag: "🇹🇷" },
    { code: "+52", country: "Mexico", flag: "🇲🇽" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+54", country: "Argentina", flag: "🇦🇷" },
    { code: "+56", country: "Chile", flag: "🇨🇱" },
    { code: "+57", country: "Colombia", flag: "🇨🇴" },
    { code: "+51", country: "Peru", flag: "🇵🇪" },
    { code: "+58", country: "Venezuela", flag: "🇻🇪" },
    { code: "+593", country: "Ecuador", flag: "🇪🇨" },
    { code: "+595", country: "Paraguay", flag: "🇵🇾" },
    { code: "+598", country: "Uruguay", flag: "🇺🇾" },
    { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
    { code: "+507", country: "Panama", flag: "🇵🇦" },
    { code: "+502", country: "Guatemala", flag: "🇬🇹" },
    { code: "+504", country: "Honduras", flag: "🇭🇳" },
    { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
    { code: "+503", country: "El Salvador", flag: "🇸🇻" },
    { code: "+1", country: "Canada", flag: "🇨🇦" },
  ].sort((a, b) => {
    if (a.country < b.country) return -1;
    if (a.country > b.country) return 1;
    return 0;
  });

  const mutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);

      // Validate phone number (required)
      if (!phoneNumber.trim()) {
        toast.error('Phone number is required');
        throw new Error('Phone number is required');
      }

      // Validate phone number format (should contain only digits)
      const phoneDigits = phoneNumber.trim().replace(/\s+/g, '');
      if (!/^\d+$/.test(phoneDigits) || phoneDigits.length < 6) {
        toast.error('Please enter a valid phone number');
        throw new Error('Please enter a valid phone number');
      }

      const fullPhoneNumber = `${phoneCountryCode}${phoneDigits}`;

      // Update user phone number
      const result = await authService.updatePhone(
        fullPhoneNumber,
        phoneCountryCode
      );

      if (!result.success) {
        throw new Error(result.message || 'Failed to save phone number');
      }

      return result;
    },
    onSuccess: () => {
      // Show success toast
      toast.success("Phone number saved successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      
      // Redirect to onboarding basics so user can set their own name
      // This ensures Google users can set their own full name and display name
      setTimeout(() => {
        router.push("/onboarding/basics");
      }, 500);
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'An error occurred';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center justify-center pt-20 pb-10 md:py-20 px-4">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute left-4 md:left-6 top-4 md:top-6 p-2 rounded-md text-[#702C3E] hover:bg-white/60 z-40 transition-colors"
        aria-label="Go back"
      >
        <FaArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
      </button>

      {/* Outer Card - Centered */}
      <div className="
        w-full max-w-lg md:max-w-2xl
        bg-[#EDD4D3] 
        border-2 border-white 
        rounded-2xl 
        py-8 md:py-10 px-6 md:px-12 lg:px-20
        shadow-md
        mx-auto
      ">
        {/* Logo - Responsive */}
        <div className="flex items-center justify-center mb-4 md:mb-6">
          <Image 
            src={logo} 
            alt="Logo" 
            className="w-12 h-12 md:w-14 md:h-14 opacity-90 object-contain" 
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2 md:mb-3 text-center">
          Add Your Phone Number
        </h2>

        {/* Subtitle */}
        <p className="text-xs md:text-sm text-[#5A4A4A] max-w-lg mb-6 md:mb-8 leading-relaxed font-medium text-center mx-auto px-2">
          Phone number is required for account recovery and verification
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
          {/* Phone Number Input */}
          <div className="flex flex-col gap-2 md:gap-3">
            <label className="text-sm md:text-base text-[#491A26] font-semibold flex items-center gap-2">
              <FiPhone className="w-4 h-4 md:w-5 md:h-5" />
              Phone Number
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Country Code Select - Responsive */}
              <div className="relative w-full sm:w-auto sm:min-w-[200px] md:w-48">
                <select
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                  className="
                    w-full bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-3 md:px-4 text-sm text-[#491A26]
                    outline-none appearance-none cursor-pointer
                    focus:ring-2 focus:ring-[#702C3E]
                    truncate
                  "
                >
                  {countryCodes.map((country, index) => (
                    <option key={`${country.code}-${country.country}-${index}`} value={country.code}>
                      {country.flag} {country.code} {country.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone Number Input */}
              <input
                type="tel"
                placeholder="e.g., 705049364"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                className="
                  flex-1 bg-[#F6E7EA] border border-[#E4D6D6]
                  rounded-md py-3 px-4 text-sm md:text-base text-black outline-none
                  focus:ring-2 focus:ring-[#702C3E]
                  min-w-0
                "
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-2 md:mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                bg-[#702C3E] text-white
                px-6 md:px-8 py-2.5 md:py-3 rounded-md
                flex items-center gap-2 text-sm md:text-base
                hover:bg-[#5E2333] transition
                disabled:opacity-50 disabled:cursor-not-allowed
                w-full sm:w-auto
              "
            >
              {isSubmitting ? 'Saving...' : 'Save & Continue'} 
              <FiArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#6B5B5B] mt-4 md:mt-6 px-4 max-w-lg mx-auto">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </section>
  );
}

