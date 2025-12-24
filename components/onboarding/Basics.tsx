"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import upload from '@/assets/upload.png';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import { FiArrowUpRight } from 'react-icons/fi';
import Image from 'next/image';
import { IoMdAdd } from 'react-icons/io';
import logo from '@/assets/logo2.png';
import { onboardingService } from '@/services';
import { useOnboardingSubmit } from '@/hooks/useOnboardingSubmit';
import { useOnboardingUser } from '@/hooks/useOnboardingUser';
import { getOnboardingData, saveBasicsFormData, restoreBasicsPhotos } from '@/lib/utils/localStorage';
import { validateRequired, validateAge, validatePhotos, showValidationError } from '@/lib/utils/validation';
import { StepProgressBar } from './ProgressBar';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';

// Function to generate display name from full name (creates a unique name that's not close to the original)
function generateDisplayName(fullName: string): string {
  if (!fullName || fullName.trim().length === 0) {
    return '';
  }
  
  // Split name into parts
  const nameParts = fullName
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(part => part.length > 0)
    .map(part => part.replace(/[^a-z]/g, '')); // Remove non-letters
  
  if (nameParts.length === 0) {
    return '';
  }
  
  // If only one name part, use first 3-4 letters
  if (nameParts.length === 1) {
    const part = nameParts[0];
    return part.length > 4 ? part.substring(0, 4) : part;
  }
  
  // For multiple name parts, create a unique combination
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  
  // Strategy: Create a display name that's not obviously the full name
  // Option 1: First 2-3 letters of first name + first 2-3 letters of last name
  // Option 2: First letter of first name + last name (shortened if needed)
  // Option 3: First name (shortened) + first letter of last name
  
  // Use a combination that makes it less obvious
  let displayName = '';
  
  if (firstName.length >= 3 && lastName.length >= 3) {
    // Take first 2-3 letters of first name + first 2-3 letters of last name
    const firstPart = firstName.substring(0, Math.min(3, firstName.length));
    const lastPart = lastName.substring(0, Math.min(3, lastName.length));
    displayName = firstPart + lastPart;
  } else if (firstName.length >= 2 && lastName.length >= 2) {
    // Shorter names: combine what we have
    displayName = firstName.substring(0, 2) + lastName.substring(0, 2);
  } else {
    // Fallback: use first name if available, otherwise last name
    displayName = firstName || lastName;
  }
  
  // Ensure minimum length of 3 characters
  if (displayName.length < 3 && firstName.length + lastName.length >= 3) {
    // Combine more letters if needed
    displayName = (firstName.substring(0, 2) + lastName.substring(0, Math.max(1, 3 - firstName.length))).substring(0, 6);
  }
  
  return displayName;
}

export default function Basics() {
  const router = useRouter();
  const userId = useOnboardingUser(); // Get userId for API calls
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<number | "">("");
  // Use fixed-length arrays (5 slots) with undefined for empty slots
  // This ensures file inputs stay aligned with their indices
  const [photos, setPhotos] = useState<(File | undefined)[]>(Array(5).fill(undefined));
  const [photoPreviews, setPhotoPreviews] = useState<(string | undefined)[]>(Array(5).fill(undefined));
  const [ageError, setAgeError] = useState<string>("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringRef = useRef(false);

  const { isLoaded } = useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on basics page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  // Function to save form data (debounced)
  const saveFormData = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveBasicsFormData({
        fullName,
        username,
        age,
        photos,
        photoPreviews,
      });
    }, 500); // Debounce: save 500ms after last change
  }, [fullName, username, age, photos, photoPreviews]);

  // Auto-save form data on changes
  useEffect(() => {
    if (!isRestoringRef.current) {
      saveFormData();
    }
  }, [fullName, username, age, photos, photoPreviews, saveFormData]);

  // Function to save form data immediately (for language change)
  const saveFormDataImmediately = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveBasicsFormData({
      fullName,
      username,
      age,
      photos,
      photoPreviews,
    });
  }, [fullName, username, age, photos, photoPreviews]);

  // Auto-generate display name from full name
  useEffect(() => {
    if (fullName.trim()) {
      const generated = generateDisplayName(fullName);
      setUsername(generated);
    } else {
      setUsername('');
    }
  }, [fullName]);

  // Load saved data on mount
  useEffect(() => {
    isRestoringRef.current = true;
    const saved = getOnboardingData();
    if (saved) {
      if (saved.fullName) {
        setFullName(saved.fullName);
      }
      if (saved.age !== undefined) {
        setAge(saved.age);
      }
      // Restore photo previews from base64 strings
      if (saved.photos && saved.photos.length > 0) {
        const restoredPreviews = restoreBasicsPhotos(saved.photos);
        setPhotoPreviews(restoredPreviews);
        // Note: File objects cannot be restored from localStorage
        // Photos will need to be re-uploaded, but previews are preserved
      }
      // Username will be auto-generated from fullName via useEffect
    }
    // Reset flag after a short delay to allow initial state to settle
    setTimeout(() => {
      isRestoringRef.current = false;
    }, 100);
  }, []);

  // Handle photo selection for a specific index
  const handlePhotoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Update photos array at specific index (maintain fixed length)
    const newPhotos = [...photos];
    newPhotos[index] = file;
    setPhotos(newPhotos);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...photoPreviews];
      newPreviews[index] = reader.result as string;
      setPhotoPreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  // Remove photo at specific index
  const removePhoto = (index: number) => {
    // Set to undefined instead of removing, to maintain fixed array length
    const newPhotos = [...photos];
    const newPreviews = [...photoPreviews];
    newPhotos[index] = undefined;
    newPreviews[index] = undefined;
    
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
    
    // Reset the file input so user can select the same file again
    const fileInput = document.getElementById(`photo-upload-${index}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };


  // Custom submit function
  const submitBasicsWithSuggestions = async (data: { username: string; fullName: string; age: number; photos?: File[] }) => {
    if (!userId) {
      throw new Error('User ID not available. Please refresh the page.');
    }
    return await onboardingService.submitBasics(data, userId);
  };

  const { handleSubmit, isSubmitting, error: submitError } = useOnboardingSubmit<
    { username: string; fullName: string; age: number; photos?: File[] }
  >(
    submitBasicsWithSuggestions,
    '/onboarding/background-series-one'
  );


  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate full name first (display name is auto-generated from it)
    const fullNameValidation = validateRequired(fullName, 'full name');
    if (!fullNameValidation.isValid) {
      showValidationError(fullNameValidation.message!);
      return;
    }

    // Validate display name (auto-generated, but should exist)
    const usernameValidation = validateRequired(username, 'display name');
    if (!usernameValidation.isValid) {
      showValidationError('Please enter a full name to generate your display name');
      return;
    }


    // Validate age
    const ageValidation = validateAge(age);
    if (!ageValidation.isValid) {
      showValidationError(ageValidation.message!);
      return;
    }

    // Validate photos - check both File objects and previews (for restored photos)
    const validPhotos = photos.filter((p): p is File => p !== undefined);
    const validPreviews = photoPreviews.filter((p): p is string => p !== undefined);
    
    // Check if photos were already uploaded (saved as URLs in localStorage)
    const savedData = getOnboardingData();
    const savedPhotoUrls = savedData?.photos || [];
    const hasUploadedPhotos = Array.isArray(savedPhotoUrls) && savedPhotoUrls.length === 5;
    
    // If we have File objects, validate those
    // If we only have previews (restored from localStorage), validate those
    const photosToValidate = validPhotos.length > 0 ? validPhotos : validPreviews;
    
    const photosValidation = validatePhotos(photosToValidate, 5);
    if (!photosValidation.isValid) {
      showValidationError(photosValidation.message!);
      return;
    }
    
    // Special case: If we have 5 previews but no File objects
    // This happens when photos are restored from localStorage after language change
    // If photos were already uploaded (URLs exist), we can proceed
    // Otherwise, user needs to re-select photos
    if (validPreviews.length === 5 && validPhotos.length === 0 && !hasUploadedPhotos) {
      showValidationError('Your photos were restored, but please re-select them to proceed. Click on each photo to select the file again.');
      return;
    }

    // Submit with File objects if available, otherwise empty array (photos already saved)
    // Note: If only previews exist, we still need File objects for submission
    // The backend will need to handle this case, or we need to convert base64 to File
    const photosToSubmit = photos.filter((p): p is File => p !== undefined);
    
    // If we have 5 previews but no File objects, we can't submit photos
    // But we'll still submit the form - backend should handle this gracefully
    handleSubmit({
      username,
      fullName,
      age: age as number,
      photos: photosToSubmit.length > 0 ? photosToSubmit : undefined,
    }, e);
  };

  return (
    <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center 
  pt-24 pb-10 md:py-20 px-4">
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}></div>

      {/* Language Toggle - Top Right */}
      <div className="absolute top-6 right-6 text-sm text-[#2F2E2E] z-50">
        <LanguageSwitcher onBeforeLanguageChange={saveFormDataImmediately} />
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute left-6 top-6 p-2 rounded-md text-[#702C3E] hover:bg-white/60 z-40"
      >
        <FaArrowLeft className="w-5 h-5" />
      </button>

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

        {/* Progress Bar */}
        <StepProgressBar className="mb-10" />

        {/* Header Text - Translatable by Google Translate */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#491A26] mb-2">
          Your Basics
        </h2>
        <p className="text-sm md:text-base text-[#5A4A4A] font-medium mb-8">
          Let's collect the essential details about you.
        </p>

        {/* Form Fields */}
  <form onSubmit={onSubmit} className="flex flex-col gap-6 px-0 md:px-0">

          {/* Full Name - comes first - Translatable by Google Translate */}
          <div>
            <label className="text-base md:text-base text-[#491A26] block mb-1 font-semibold">Full Name*</label>
            <input
              type="text"
              placeholder="Enter Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-3/4 md:w-2/3 bg-[#F6E7EA] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-black outline-none"
              required
            />
            <p className="text-xs text-[#6B5B5B] mt-1 w-3/4 md:w-2/3">
              Your display name will be automatically generated from your full name
            </p>
          </div>

          {/* Display Name - auto-generated, read-only - Translatable by Google Translate */}
          <div>
            <label className="text-base md:text-base text-[#491A26] block mb-1 font-semibold">Display Name*</label>
            <input
              type="text"
              placeholder="Display name will be generated automatically"
              value={username}
              readOnly
              disabled
              className="w-3/4 md:w-2/3 bg-[#E4D6D6] border border-[#E4D6D6] rounded-md py-3 px-4 text-sm text-[#6B5B5B] outline-none cursor-not-allowed"
              required
            />
            <p className="text-xs text-[#6B5B5B] mt-1 w-3/4 md:w-2/3">
              This is automatically generated from your full name (letters only, no numbers)
            </p>
          </div>

          {/* Age - Translatable by Google Translate */}
          <div>
            <label className="text-base md:text-base text-[#491A26] block mb-1 font-semibold">Age*</label>
            <input
              type="number"
              placeholder="Enter Age"
              value={age}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : "";
                setAge(value);
                if (value !== "" && typeof value === "number") {
                  if (value < 22) {
                    setAgeError("You must be at least 22 years old to use Metsamdti. We focus on serious relationships and require users to be 22 or older.");
                  } else if (value > 100) {
                    setAgeError("Please enter a valid age.");
                  } else {
                    setAgeError("");
                  }
                } else {
                  setAgeError("");
                }
              }}
              min={22}
              max={100}
              className={`w-3/4 md:w-2/3 bg-[#F6E7EA] border ${
                ageError ? "border-red-400" : "border-[#E4D6D6]"
              } rounded-md py-3 px-4 text-sm text-black outline-none`}
              required
            />
            {ageError && (
              <p className="text-sm text-red-600 mt-2 w-3/4 md:w-2/3">{ageError}</p>
            )}
            {!ageError && age === "" && (
              <p className="text-xs text-[#6B5B5B] mt-1 w-3/4 md:w-2/3">
                You must be at least 22 years old to use Metsamdti.
              </p>
            )}
          </div>

          {/* Image Upload Section */}
          <div className="flex flex-col items-center mt-6">
            <p className="self-start text-sm text-[#491A26] mb-2 font-medium">Upload your photos</p>

            {/* Upload Grid */}
            <div className="grid grid-cols-3 gap-4">

              {/* Main Large Image (reduced size) - shows first uploaded image */}
              <div className="col-span-3 flex justify-center">
                <div className="w-32 h-32 rounded-xl flex items-center justify-center overflow-hidden relative border border-[#E4D6D6]">
                  {photoPreviews[0] ? (
                    <Image 
                      src={photoPreviews[0]} 
                      alt="Main photo" 
                      width={128} 
                      height={128} 
                      className="object-cover w-full h-full" 
                    />
                  ) : (
                    <Image 
                      src={upload} 
                      alt="Upload" 
                      width={128} 
                      height={128} 
                      className="object-contain" 
                    />
                  )}
                </div>
              </div>

              {/* Five Small Upload Boxes */}
              <div className="col-span-3 grid grid-cols-3 gap-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex flex-col items-center relative">
                    <div className="w-28 h-28 rounded-xl flex items-center justify-center mx-auto overflow-hidden border border-dashed border-gray-300 relative">
                      {photoPreviews[index] ? (
                        <>
                          <Image 
                            src={photoPreviews[index]} 
                            alt={`Upload ${index + 1}`} 
                            width={112} 
                            height={112} 
                            className="object-cover w-full h-full" 
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <Image 
                          src={upload} 
                          alt="Upload" 
                          width={112} 
                          height={112} 
                          className="object-contain opacity-50" 
                        />
                      )}
                    </div>
                    <label 
                      htmlFor={`photo-upload-${index}`} 
                      className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-3 bg-white rounded-md p-1 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                    >
                      <IoMdAdd className="w-4 h-4 text-[#702C3E]" />
                      <input
                        id={`photo-upload-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoChange(index, e)}
                      />
                    </label>
                  </div>
                ))}
              </div>

              <div className="col-span-3 flex justify-center gap-4">
                {[3, 4].map((index) => (
                  <div key={index} className="flex flex-col items-center relative">
                    <div className="w-28 h-28 rounded-xl flex items-center justify-center overflow-hidden border border-dashed border-gray-300 relative">
                      {photoPreviews[index] ? (
                        <>
                          <Image 
                            src={photoPreviews[index]} 
                            alt={`Upload ${index + 1}`} 
                            width={112} 
                            height={112} 
                            className="object-cover w-full h-full" 
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <Image 
                          src={upload} 
                          alt="Upload" 
                          width={112} 
                          height={112} 
                          className="object-contain opacity-50" 
                        />
                      )}
                    </div>
                    <label 
                      htmlFor={`photo-upload-${index}`} 
                      className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-3 bg-white rounded-md p-1 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                    >
                      <IoMdAdd className="w-4 h-4 text-[#702C3E]" />
                      <input
                        id={`photo-upload-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoChange(index, e)}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {(() => {
              const validPhotos = photos.filter(p => p !== undefined).length;
              const validPreviews = photoPreviews.filter(p => p !== undefined).length;
              const totalCount = Math.max(validPhotos, validPreviews);
              
              if (totalCount > 0 && totalCount < 5) {
                return (
                  <p className="text-xs text-red-600 mt-2">
                    Please upload exactly 5 photos ({totalCount}/5)
                    {validPreviews > 0 && validPhotos === 0 && ' - Please re-select your photos'}
                  </p>
                );
              }
              return null;
            })()}
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {submitError}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                bg-[#702C3E] text-white 
                px-10 py-3 rounded-md 
                flex items-center gap-2
                hover:bg-[#5E2333] transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? 'Submitting...' : 'Submit'} <FiArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Footer Text */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6">
        By continuing, you agree to our <span className="underline">Terms of Use</span> and <span className="underline">Privacy Policy</span>.
      </p>
    </section>
  );
}
