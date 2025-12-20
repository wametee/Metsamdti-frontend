
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import { FiArrowUpRight } from 'react-icons/fi';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { onboardingService } from '@/services';
import { useOnboardingSubmit } from '@/hooks/useOnboardingSubmit';
import { getOnboardingData } from '@/lib/utils/localStorage';
import { StepProgressBar } from './ProgressBar';
import { validateBirthday, validateRequired, showValidationError, validationMessages } from '@/lib/utils/validation';
import { useOnboardingStepValidation } from '@/hooks/useOnboardingStepValidation';

export default function BackgroundSeriesOne() {
  // ============================================================================
  // CRITICAL: ALL HOOKS MUST BE CALLED UNCONDITIONALLY AND IN THE SAME ORDER
  // ============================================================================
  // React's Rules of Hooks require:
  // 1. Hooks must be called in the same order on every render
  // 2. Hooks cannot be called conditionally or after early returns
  // 3. All hooks must be called before any conditional logic
  // 
  // IMPORTANT: The order of hooks here is FIXED and must NEVER change.
  // Any reordering will cause React to throw a "Rules of Hooks" error.
  // ============================================================================
  
  // Hook 1: Router (Next.js navigation)
  const router = useRouter();
  
  // Hook 2: Step validation
  // Internally calls: useRouter(), usePathname(), useState(), useState(), useEffect()
  const { isValidating, isValid } = useOnboardingStepValidation();
  
  // Hooks 3-6: Component state (must be in this exact order)
  const [gender, setGender] = useState<string>('');
  const [languages, setLanguages] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [ageError, setAgeError] = useState<string>("");

  // Hook 7: Submit handler - CRITICAL: Must be called before ANY conditional returns
  // Internally calls:
  //   - useRouter() (duplicate, but React handles this)
  //   - useOnboardingSession() -> useState(), useEffect()
  //   - useState() (isSubmitting)
  //   - useState() (error)
  //   - useMutation() -> useContext() (accesses QueryClient)
  // 
  // This hook MUST be called on every render, even if we return early.
  // If this hook is not called, React will detect a hook order mismatch.
  const { handleSubmit, isSubmitting, error } = useOnboardingSubmit<
    { birthday: string; gender: string; languages: string[] }
  >(
    (data) => onboardingService.submitBackgroundSeriesOne(data, ''),
    '/onboarding/background-series-two'
  );

  // Hook 8: Load saved data from localStorage
  // This useEffect must be called on every render, even if we return early
  useEffect(() => {
    const saved = getOnboardingData();
    if (saved) {
      setGender(saved.gender || '');
      // Handle languages - could be string or string[]
      const savedLanguages = saved.languages;
      if (Array.isArray(savedLanguages)) {
        setLanguages(savedLanguages[0] || '');
      } else if (typeof savedLanguages === 'string') {
        setLanguages(savedLanguages);
      } else {
        setLanguages('');
      }
      setBirthday(saved.birthday || '');
    }
  }, []);

  // ============================================================================
  // CONDITIONAL RENDERING - ONLY AFTER ALL HOOKS HAVE BEEN CALLED
  // ============================================================================
  // All 8 hooks above have been called. Now we can safely do conditional returns.
  // The key is that ALL hooks are called BEFORE any return statement.
  
  if (isValidating) {
    return (
      <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center pt-24 pb-10 md:py-20 px-4">
        <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-1xl bg-[#EDD4D3] border-2 border-white rounded-2xl py-10 px-6 md:px-20 shadow-md">
          <p className="text-center text-[#702C3E]">Loading...</p>
        </div>
      </section>
    );
  }

  if (!isValid) {
    return null;
  }

  // Calculate age from birthday
  const calculateAge = (birthDate: string): number | null => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate birthday and age
    const birthdayValidation = validateBirthday(birthday);
    if (!birthdayValidation.isValid) {
      showValidationError(birthdayValidation.message!);
      setAgeError(birthdayValidation.message!);
      return;
    }
    setAgeError("");

    // Validate gender
    const genderValidation = validateRequired(gender, 'gender');
    if (!genderValidation.isValid) {
      showValidationError(validationMessages.gender);
      return;
    }

    // Validate languages
    const languagesValidation = validateRequired(languages, 'language preference');
    if (!languagesValidation.isValid) {
      showValidationError(validationMessages.languages);
      return;
    }

    // Convert languages to array format
    const languagesArray = languages === 'One' ? ['One'] : 
                          languages === 'Two' ? ['Two'] : 
                          ['Three or more'];

    handleSubmit({
      birthday,
      gender,
      languages: languagesArray,
    }, e);
  };

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

        {/* Progress Bar */}
        <StepProgressBar className="mb-10" />

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
          Background & Identity
        </h2>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-[#5A4A4A] max-w-lg mb-6 leading-relaxed font-medium">
          Everyone has a story. Share a bit about your background and identity so your 
          matches understand you better. These details help us find the most meaningful 
          connections for you.
        </p>

  {/* Form Container */}
  <form onSubmit={onSubmit} className="py-6 px-0 md:py-8 md:px-0 flex flex-col gap-10 bg-[#EDD4D3]/60">

          {/* AGE */}
          <p className="text-[#5A5959] font-medium text-base mb-0">Hello! Just for context.</p>
          <div className="flex flex-col gap-2">
              <label className="text-base text-[#491A26] mb-2 font-semibold">
              What's your birthday?
            </label>
            <input
              type="date"
              aria-label="Your birthday"
              value={birthday}
              onChange={(e) => {
                const selectedDate = e.target.value;
                setBirthday(selectedDate);
                
                // Calculate and validate age
                if (selectedDate) {
                  const today = new Date();
                  const birth = new Date(selectedDate);
                  let age = today.getFullYear() - birth.getFullYear();
                  const monthDiff = today.getMonth() - birth.getMonth();
                  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                    age--;
                  }
                  
                  if (age < 22) {
                    setAgeError("You must be at least 22 years old to use Metsamdti. We focus on serious relationships and require users to be 22 or older.");
                  } else {
                    setAgeError("");
                  }
                } else {
                  setAgeError("");
                }
              }}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 22)).toISOString().split('T')[0]}
              className={`w-full md:w-2/3 bg-[#F6E7EA] border ${
                ageError ? "border-red-400" : "border-[#E4D6D6]"
              } rounded-md py-3 px-4 text-sm text-black outline-none`}
            />
            {ageError ? (
              <p className="text-sm text-red-600 mt-1">{ageError}</p>
            ) : (
              <p className="text-xs text-[#6B5B5B] mt-1">
                Select your birth date — tap the field to open the calendar. You must be at least 22 years old to use Metsamdti.
              </p>
            )}
          </div>


            {/* GENDER */}
      <p className="text-[#5A5959] font-medium text-base mb-0">I hope you don’t mind me asking.</p>
      <div className="w-full gap-3">
        <label className="text-base text-[#491A26] mb-4 block font-semibold">
        What gender do you identify with?
      </label>

            <div className="flex flex-col gap-3">

                {/* Male */}
    <label
                onClick={() => setGender("Male")}
                className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4
                    flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                "
                >
        <input
          type="radio"
          name="gender"
          checked={gender === "Male"}
          onChange={() => setGender("Male")}
          className="w-4 h-4 accent-[#702C3E]"
        />
  <span className="text-base text-[#491A26] ml-3 font-semibold">Male</span>
                </label>

                {/* Female */}
    <label
                onClick={() => setGender("Female")}
                className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-3 px-4
                    flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                "
                >
        <input
          type="radio"
          name="gender"
          checked={gender === "Female"}
          onChange={() => setGender("Female")}
          className="w-4 h-4 accent-[#702C3E]"
        />
  <span className="text-base text-[#491A26] ml-3 font-semibold">Female</span>
                </label>

               

            </div>
            </div>

      
  {/* LANGUAGES */}
  <p className="text-[#5A5959] font-medium text-sm mb-0">And tell me,</p>
<div className="w-full flex-col gap-2">
  <label className="text-base text-[#491A26] mb-3 block font-semibold">
    How many languages do you speak fluently?
  </label>

  <div className="flex flex-col gap-3">

    {/* One */}
    <label
      onClick={() => setLanguages("One")}
      className="
        w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
        rounded-md py-3 px-4
        flex items-center gap-3 cursor-pointer
        hover:brightness-105 transition
      "
    >
      <input
        type="radio"
        name="lang"
        checked={languages === "One"}
        onChange={() => setLanguages("One")}
        className="w-4 h-4 accent-[#702C3E]"
      />
      <span className="text-base text-[#491A26] ml-3 font-semibold">One</span>
    </label>

    {/* Two */}
    <label
      onClick={() => setLanguages("Two")}
      className="
        w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
        rounded-md py-3 px-4
        flex items-center gap-3 cursor-pointer
        hover:brightness-105 transition
      "
    >
      <input
        type="radio"
        name="lang"
        checked={languages === "Two"}
        onChange={() => setLanguages("Two")}
        className="w-4 h-4 accent-[#702C3E]"
      />
      <span className="text-base text-[#491A26] ml-3 font-semibold">Two</span>
    </label>

    {/* Three or more */}
    <label
      onClick={() => setLanguages("Three or more")}
      className="
        w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
        rounded-md py-3 px-4
        flex items-center gap-3 cursor-pointer
        hover:brightness-105 transition
      "
    >
      <input
        type="radio"
        name="lang"
        checked={languages === "Three or more"}
        onChange={() => setLanguages("Three or more")}
        className="w-4 h-4 accent-[#702C3E]"
      />
      <span className="text-base text-[#491A26] ml-3 font-semibold">Three or more</span>
    </label>

  </div>
</div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
        </div>
          )}

        {/* Submit Button */}
        <div className="flex justify-center mt-10">
          <button
              type="submit"
              disabled={isSubmitting}
            className="
              bg-[#702C3E] text-white
              px-8 py-3 rounded-md
              flex items-center gap-2
              hover:bg-[#5E2333] transition
                disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
              {isSubmitting ? 'Submitting...' : 'Next'}  <FiArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6">
        Your information is safe with us and only used for matchmaking purposes.
      </p>
    </section>
  );
}
