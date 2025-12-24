"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import { FiMail, FiLock, FiPhone } from "react-icons/fi";
import { FiEye, FiEyeOff } from '@/lib/icons';
import Image from "next/image";
import logo from "@/assets/logo2.png";
import { onboardingService } from '@/services';
import { useOnboardingUser } from '@/hooks/useOnboardingUser';
import { useMutation } from '@tanstack/react-query';
import { toast } from "react-toastify";
import { validateEmail, validatePassword, showValidationError, validationMessages } from '@/lib/utils/validation';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';
import EmailVerificationModal from '@/components/auth/EmailVerificationModal';

export default function Signup() {
  const router = useRouter();
  const userId = useOnboardingUser();

  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1"); // Default to US
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingSignupData, setPendingSignupData] = useState<{
    email: string;
    password: string;
    phone: string;
    phone_country_code: string;
  } | null>(null);

  // Comprehensive list of all countries with flags and codes
  const countryCodes = [
    { code: "+1", country: "United States/Canada", flag: "🇺🇸" },
    { code: "+7", country: "Russia/Kazakhstan", flag: "🇷🇺" },
    { code: "+20", country: "Egypt", flag: "🇪🇬" },
    { code: "+27", country: "South Africa", flag: "🇿🇦" },
    { code: "+30", country: "Greece", flag: "🇬🇷" },
    { code: "+31", country: "Netherlands", flag: "🇳🇱" },
    { code: "+32", country: "Belgium", flag: "🇧🇪" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+34", country: "Spain", flag: "🇪🇸" },
    { code: "+36", country: "Hungary", flag: "🇭🇺" },
    { code: "+39", country: "Italy", flag: "🇮🇹" },
    { code: "+40", country: "Romania", flag: "🇷🇴" },
    { code: "+41", country: "Switzerland", flag: "🇨🇭" },
    { code: "+43", country: "Austria", flag: "🇦🇹" },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
    { code: "+45", country: "Denmark", flag: "🇩🇰" },
    { code: "+46", country: "Sweden", flag: "🇸🇪" },
    { code: "+47", country: "Norway", flag: "🇳🇴" },
    { code: "+48", country: "Poland", flag: "🇵🇱" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+51", country: "Peru", flag: "🇵🇪" },
    { code: "+52", country: "Mexico", flag: "🇲🇽" },
    { code: "+53", country: "Cuba", flag: "🇨🇺" },
    { code: "+54", country: "Argentina", flag: "🇦🇷" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+56", country: "Chile", flag: "🇨🇱" },
    { code: "+57", country: "Colombia", flag: "🇨🇴" },
    { code: "+58", country: "Venezuela", flag: "🇻🇪" },
    { code: "+60", country: "Malaysia", flag: "🇲🇾" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+62", country: "Indonesia", flag: "🇮🇩" },
    { code: "+63", country: "Philippines", flag: "🇵🇭" },
    { code: "+64", country: "New Zealand", flag: "🇳🇿" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+66", country: "Thailand", flag: "🇹🇭" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+82", country: "South Korea", flag: "🇰🇷" },
    { code: "+84", country: "Vietnam", flag: "🇻🇳" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+90", country: "Turkey", flag: "🇹🇷" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+92", country: "Pakistan", flag: "🇵🇰" },
    { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
    { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
    { code: "+95", country: "Myanmar", flag: "🇲🇲" },
    { code: "+98", country: "Iran", flag: "🇮🇷" },
    { code: "+212", country: "Morocco", flag: "🇲🇦" },
    { code: "+213", country: "Algeria", flag: "🇩🇿" },
    { code: "+216", country: "Tunisia", flag: "🇹🇳" },
    { code: "+218", country: "Libya", flag: "🇱🇾" },
    { code: "+220", country: "Gambia", flag: "🇬🇲" },
    { code: "+221", country: "Senegal", flag: "🇸🇳" },
    { code: "+222", country: "Mauritania", flag: "🇲🇷" },
    { code: "+223", country: "Mali", flag: "🇲🇱" },
    { code: "+224", country: "Guinea", flag: "🇬🇳" },
    { code: "+225", country: "Ivory Coast", flag: "🇨🇮" },
    { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
    { code: "+227", country: "Niger", flag: "🇳🇪" },
    { code: "+228", country: "Togo", flag: "🇹🇬" },
    { code: "+229", country: "Benin", flag: "🇧🇯" },
    { code: "+230", country: "Mauritius", flag: "🇲🇺" },
    { code: "+231", country: "Liberia", flag: "🇱🇷" },
    { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
    { code: "+233", country: "Ghana", flag: "🇬🇭" },
    { code: "+234", country: "Nigeria", flag: "🇳🇬" },
    { code: "+235", country: "Chad", flag: "🇹🇩" },
    { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
    { code: "+237", country: "Cameroon", flag: "🇨🇲" },
    { code: "+238", country: "Cape Verde", flag: "🇨🇻" },
    { code: "+239", country: "São Tomé and Príncipe", flag: "🇸🇹" },
    { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
    { code: "+241", country: "Gabon", flag: "🇬🇦" },
    { code: "+242", country: "Republic of the Congo", flag: "🇨🇬" },
    { code: "+243", country: "DR Congo", flag: "🇨🇩" },
    { code: "+244", country: "Angola", flag: "🇦🇴" },
    { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼" },
    { code: "+246", country: "British Indian Ocean Territory", flag: "🇮🇴" },
    { code: "+248", country: "Seychelles", flag: "🇸🇨" },
    { code: "+249", country: "Sudan", flag: "🇸🇩" },
    { code: "+250", country: "Rwanda", flag: "🇷🇼" },
    { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
    { code: "+252", country: "Somalia", flag: "🇸🇴" },
    { code: "+253", country: "Djibouti", flag: "🇩🇯" },
    { code: "+254", country: "Kenya", flag: "🇰🇪" },
    { code: "+255", country: "Tanzania", flag: "🇹🇿" },
    { code: "+256", country: "Uganda", flag: "🇺🇬" },
    { code: "+257", country: "Burundi", flag: "🇧🇮" },
    { code: "+258", country: "Mozambique", flag: "🇲🇿" },
    { code: "+260", country: "Zambia", flag: "🇿🇲" },
    { code: "+261", country: "Madagascar", flag: "🇲🇬" },
    { code: "+262", country: "Réunion", flag: "🇷🇪" },
    { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
    { code: "+264", country: "Namibia", flag: "🇳🇦" },
    { code: "+265", country: "Malawi", flag: "🇲🇼" },
    { code: "+266", country: "Lesotho", flag: "🇱🇸" },
    { code: "+267", country: "Botswana", flag: "🇧🇼" },
    { code: "+268", country: "Eswatini", flag: "🇸🇿" },
    { code: "+269", country: "Comoros", flag: "🇰🇲" },
    { code: "+290", country: "Saint Helena", flag: "🇸🇭" },
    { code: "+291", country: "Eritrea", flag: "🇪🇷" },
    { code: "+297", country: "Aruba", flag: "🇦🇼" },
    { code: "+298", country: "Faroe Islands", flag: "🇫🇴" },
    { code: "+299", country: "Greenland", flag: "🇬🇱" },
    { code: "+350", country: "Gibraltar", flag: "🇬🇮" },
    { code: "+351", country: "Portugal", flag: "🇵🇹" },
    { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
    { code: "+353", country: "Ireland", flag: "🇮🇪" },
    { code: "+354", country: "Iceland", flag: "🇮🇸" },
    { code: "+355", country: "Albania", flag: "🇦🇱" },
    { code: "+356", country: "Malta", flag: "🇲🇹" },
    { code: "+357", country: "Cyprus", flag: "🇨🇾" },
    { code: "+358", country: "Finland", flag: "🇫🇮" },
    { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
    { code: "+370", country: "Lithuania", flag: "🇱🇹" },
    { code: "+371", country: "Latvia", flag: "🇱🇻" },
    { code: "+372", country: "Estonia", flag: "🇪🇪" },
    { code: "+373", country: "Moldova", flag: "🇲🇩" },
    { code: "+374", country: "Armenia", flag: "🇦🇲" },
    { code: "+375", country: "Belarus", flag: "🇧🇾" },
    { code: "+376", country: "Andorra", flag: "🇦🇩" },
    { code: "+377", country: "Monaco", flag: "🇲🇨" },
    { code: "+378", country: "San Marino", flag: "🇸🇲" },
    { code: "+380", country: "Ukraine", flag: "🇺🇦" },
    { code: "+381", country: "Serbia", flag: "🇷🇸" },
    { code: "+382", country: "Montenegro", flag: "🇲🇪" },
    { code: "+383", country: "Kosovo", flag: "🇽🇰" },
    { code: "+385", country: "Croatia", flag: "🇭🇷" },
    { code: "+386", country: "Slovenia", flag: "🇸🇮" },
    { code: "+387", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
    { code: "+389", country: "North Macedonia", flag: "🇲🇰" },
    { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
    { code: "+421", country: "Slovakia", flag: "🇸🇰" },
    { code: "+423", country: "Liechtenstein", flag: "🇱🇮" },
    { code: "+500", country: "Falkland Islands", flag: "🇫🇰" },
    { code: "+501", country: "Belize", flag: "🇧🇿" },
    { code: "+502", country: "Guatemala", flag: "🇬🇹" },
    { code: "+503", country: "El Salvador", flag: "🇸🇻" },
    { code: "+504", country: "Honduras", flag: "🇭🇳" },
    { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
    { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
    { code: "+507", country: "Panama", flag: "🇵🇦" },
    { code: "+508", country: "Saint Pierre and Miquelon", flag: "🇵🇲" },
    { code: "+509", country: "Haiti", flag: "🇭🇹" },
    { code: "+590", country: "Guadeloupe", flag: "🇬🇵" },
    { code: "+591", country: "Bolivia", flag: "🇧🇴" },
    { code: "+592", country: "Guyana", flag: "🇬🇾" },
    { code: "+593", country: "Ecuador", flag: "🇪🇨" },
    { code: "+594", country: "French Guiana", flag: "🇬🇫" },
    { code: "+595", country: "Paraguay", flag: "🇵🇾" },
    { code: "+596", country: "Martinique", flag: "🇲🇶" },
    { code: "+597", country: "Suriname", flag: "🇸🇷" },
    { code: "+598", country: "Uruguay", flag: "🇺🇾" },
    { code: "+599", country: "Netherlands Antilles", flag: "🇧🇶" },
    { code: "+670", country: "East Timor", flag: "🇹🇱" },
    { code: "+672", country: "Antarctica", flag: "🇦🇶" },
    { code: "+673", country: "Brunei", flag: "🇧🇳" },
    { code: "+674", country: "Nauru", flag: "🇳🇷" },
    { code: "+675", country: "Papua New Guinea", flag: "🇵🇬" },
    { code: "+676", country: "Tonga", flag: "🇹🇴" },
    { code: "+677", country: "Solomon Islands", flag: "🇸🇧" },
    { code: "+678", country: "Vanuatu", flag: "🇻🇺" },
    { code: "+679", country: "Fiji", flag: "🇫🇯" },
    { code: "+680", country: "Palau", flag: "🇵🇼" },
    { code: "+681", country: "Wallis and Futuna", flag: "🇼🇫" },
    { code: "+682", country: "Cook Islands", flag: "🇨🇰" },
    { code: "+683", country: "Niue", flag: "🇳🇺" },
    { code: "+685", country: "Samoa", flag: "🇼🇸" },
    { code: "+686", country: "Kiribati", flag: "🇰🇮" },
    { code: "+687", country: "New Caledonia", flag: "🇳🇨" },
    { code: "+688", country: "Tuvalu", flag: "🇹🇻" },
    { code: "+689", country: "French Polynesia", flag: "🇵🇫" },
    { code: "+690", country: "Tokelau", flag: "🇹🇰" },
    { code: "+691", country: "Micronesia", flag: "🇫🇲" },
    { code: "+692", country: "Marshall Islands", flag: "🇲🇭" },
    { code: "+850", country: "North Korea", flag: "🇰🇵" },
    { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
    { code: "+853", country: "Macau", flag: "🇲🇴" },
    { code: "+855", country: "Cambodia", flag: "🇰🇭" },
    { code: "+856", country: "Laos", flag: "🇱🇦" },
    { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
    { code: "+886", country: "Taiwan", flag: "🇹🇼" },
    { code: "+960", country: "Maldives", flag: "🇲🇻" },
    { code: "+961", country: "Lebanon", flag: "🇱🇧" },
    { code: "+962", country: "Jordan", flag: "🇯🇴" },
    { code: "+963", country: "Syria", flag: "🇸🇾" },
    { code: "+964", country: "Iraq", flag: "🇮🇶" },
    { code: "+965", country: "Kuwait", flag: "🇰🇼" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+967", country: "Yemen", flag: "🇾🇪" },
    { code: "+968", country: "Oman", flag: "🇴🇲" },
    { code: "+970", country: "Palestine", flag: "🇵🇸" },
    { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
    { code: "+972", country: "Israel", flag: "🇮🇱" },
    { code: "+973", country: "Bahrain", flag: "🇧🇭" },
    { code: "+974", country: "Qatar", flag: "🇶🇦" },
    { code: "+975", country: "Bhutan", flag: "🇧🇹" },
    { code: "+976", country: "Mongolia", flag: "🇲🇳" },
    { code: "+977", country: "Nepal", flag: "🇳🇵" },
    { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
    { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
    { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
    { code: "+995", country: "Georgia", flag: "🇬🇪" },
    { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
    { code: "+998", country: "Uzbekistan", flag: "🇺🇿" },
  ].sort((a, b) => {
    // Sort by country name for easier browsing
    return a.country.localeCompare(b.country);
  });

  // Initialize Google Translate
  useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on signup page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  const mutation = useMutation({
    mutationFn: async (verificationCode?: string) => {
      setIsSubmitting(true);

      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        const errorMsg = emailValidation.message!;
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(errorMsg);
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        const errorMsg = passwordValidation.message!;
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(errorMsg);
      }

      // Validate password match
      if (password !== confirmPassword) {
        const errorMsg = validationMessages.password.match;
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(errorMsg);
      }

      // Validate phone number (required)
      if (!phoneNumber.trim()) {
        const errorMsg = 'Phone number is required';
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(errorMsg);
      }

      // Validate phone number format (should contain only digits)
      const phoneDigits = phoneNumber.trim().replace(/\s+/g, '');
      if (!/^\d+$/.test(phoneDigits) || phoneDigits.length < 6) {
        const errorMsg = 'Please enter a valid phone number';
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(errorMsg);
      }

      const fullPhoneNumber = `${phoneCountryCode}${phoneDigits}`;

      // Submit complete application with all onboarding data
      if (!userId) {
        throw new Error('User ID not available. Please refresh the page.');
      }
      
      const result = await onboardingService.completeApplication(
        { 
          email, 
          password,
          phone: fullPhoneNumber,
          phone_country_code: phoneCountryCode,
          verificationCode, // Include verification code if provided
        },
        userId
      );

      if (!result.success) {
        const errorMsg = result.message || 'Failed to complete application';
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 3000,
        });
        throw new Error(errorMsg);
      }

      return result;
    },
    onSuccess: () => {
      // Show success toast
      toast.success("Account created successfully! Redirecting to login...", {
        position: "top-right",
        autoClose: 2000,
      });
      // Close verification modal if open
      setShowVerificationModal(false);
      // Redirect to login page after successful signup
      setTimeout(() => {
        router.push('/login');
      }, 500);
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'An error occurred';
      
      // If error is EMAIL_VERIFICATION_REQUIRED, show verification modal
      if (errorMessage === 'EMAIL_VERIFICATION_REQUIRED' || error.response?.data?.error === 'EMAIL_VERIFICATION_REQUIRED') {
        setPendingSignupData({
          email,
          password,
          phone: `${phoneCountryCode}${phoneNumber.trim().replace(/\s+/g, '')}`,
          phone_country_code: phoneCountryCode,
        });
        setShowVerificationModal(true);
        setIsSubmitting(false);
        return;
      }
      
      setIsSubmitting(false);
      // Show error toast if not already shown
      if (!error.toastShown) {
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields first
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      showValidationError(emailValidation.message!);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      showValidationError(passwordValidation.message!);
      return;
    }

    if (password !== confirmPassword) {
      showValidationError(validationMessages.password.match);
      return;
    }

    if (!phoneNumber.trim()) {
      showValidationError('Phone number is required');
      return;
    }

    const phoneDigits = phoneNumber.trim().replace(/\s+/g, '');
    if (!/^\d+$/.test(phoneDigits) || phoneDigits.length < 6) {
      showValidationError('Please enter a valid phone number');
      return;
    }

    // Store signup data and show verification modal
    const fullPhoneNumber = `${phoneCountryCode}${phoneDigits}`;
    setPendingSignupData({
      email,
      password,
      phone: fullPhoneNumber,
      phone_country_code: phoneCountryCode,
    });
    setShowVerificationModal(true);
  };

  const handleVerificationSuccess = async () => {
    // After verification, complete the signup
    // The email is now verified in the backend, so completeApplication will succeed
    if (pendingSignupData && userId) {
      mutation.mutate(undefined); // This will now succeed since email is verified
    }
  };

  return (
    <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center pt-24 pb-10 md:py-20 px-4">
      {/* Hidden Google Translate Element - must exist for translation to work */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}></div>

      {/* Language Toggle - Top Right */}
      <div className="absolute top-6 right-6 text-sm text-[#2F2E2E] z-50">
        <LanguageSwitcher />
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute left-6 top-6 p-2 rounded-md text-[#702C3E] hover:bg-white/60 z-40"
      >
        <FaArrowLeft className="w-5 h-5" />
      </button>

      {/* Card */}
      <div
        className="
          w-full max-w-md
          bg-[#EDD4D3]
          border-2 border-white
          rounded-2xl
          px-6 py-10
          shadow-md
        "
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src={logo} alt="Logo" className="w-14 opacity-90" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-[#491A26] mb-8">
          Create Application
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A6A]" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full bg-[#F6E7EA]
                border border-[#E4D6D6]
                rounded-md
                py-3 pl-11 pr-4
                text-sm text-black
                outline-none
              "
              required
            />
          </div>

          {/* Phone Number */}
          <div className="flex gap-2">
            {/* Country Code Selector */}
            <div className="relative w-40 flex-shrink-0">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6A6A] z-10 pointer-events-none" />
              <select
                value={phoneCountryCode}
                onChange={(e) => setPhoneCountryCode(e.target.value)}
                className="
                  w-full bg-[#F6E7EA]
                  border border-[#E4D6D6]
                  rounded-md
                  py-3 pl-10 pr-8
                  text-sm text-black
                  outline-none
                  appearance-none
                  cursor-pointer
                  hover:border-[#702C3E]/40
                  transition-colors
                "
                required
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.code} {country.country}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-[#7A6A6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Phone Number Input */}
            <div className="relative flex-1">
              <input
                type="tel"
                placeholder="Phone Number *"
                value={phoneNumber}
                onChange={(e) => {
                  // Only allow numbers, spaces, dashes, and parentheses
                  const value = e.target.value.replace(/[^\d\s\-()]/g, '');
                  setPhoneNumber(value);
                }}
                className="
                  w-full bg-[#F6E7EA]
                  border border-[#E4D6D6]
                  rounded-md
                  py-3 px-4
                  text-sm text-black
                  outline-none
                  hover:border-[#702C3E]/40
                  transition-colors
                "
                required
                minLength={6}
              />
            </div>
          </div>
          <p className="text-xs text-[#6B5B5B] -mt-2">
            Phone number is required for account recovery and verification
          </p>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A6A] z-10" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full bg-[#F6E7EA]
                border border-[#E4D6D6]
                rounded-md
                py-3 pl-11 pr-12
                text-sm text-black
                outline-none
              "
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6A6A] hover:text-[#702C3E] transition-colors z-10 p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A6A] z-10" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="
                w-full bg-[#F6E7EA]
                border border-[#E4D6D6]
                rounded-md
                py-3 pl-11 pr-12
                text-sm text-black
                outline-none
              "
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6A6A] hover:text-[#702C3E] transition-colors z-10 p-1"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              mt-4 bg-[#702C3E] text-white
              py-3 rounded-md
              flex items-center justify-center gap-2
              hover:bg-[#5E2333] transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'} <FiArrowUpRight className="w-4 h-4" />
          </button>

          {/* Login Link */}
          <p className="text-center text-xs text-[#6B5B5B] mt-4">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-[#702C3E] cursor-pointer hover:underline"
            >
              Log in
            </span>
          </p>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6 max-w-xs">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>

      {/* Email Verification Modal */}
      {showVerificationModal && userId && (
        <EmailVerificationModal
          isOpen={showVerificationModal}
          onClose={() => {
            setShowVerificationModal(false);
            setPendingSignupData(null);
          }}
          email={email}
          userId={userId}
          onVerificationSuccess={handleVerificationSuccess}
        />
      )}
    </section>
  );
}
