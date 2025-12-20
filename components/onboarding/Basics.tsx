"use client";
import { useState, useEffect } from 'react';
import upload from '@/assets/upload.png';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import { FiArrowUpRight } from 'react-icons/fi';
import Image from 'next/image';
import { IoMdAdd } from 'react-icons/io';
import logo from '@/assets/logo2.png';
import { onboardingService } from '@/services';
import { useOnboardingSubmit } from '@/hooks/useOnboardingSubmit';
import { getOnboardingData } from '@/lib/utils/localStorage';
import { validateRequired, validateAge, validatePhotos, showValidationError } from '@/lib/utils/validation';
import { StepProgressBar } from './ProgressBar';

export default function Basics() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<number | "">("");
  // Use fixed-length arrays (5 slots) with undefined for empty slots
  // This ensures file inputs stay aligned with their indices
  const [photos, setPhotos] = useState<(File | undefined)[]>(Array(5).fill(undefined));
  const [photoPreviews, setPhotoPreviews] = useState<(string | undefined)[]>(Array(5).fill(undefined));
  const [ageError, setAgeError] = useState<string>("");
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // Load saved data
  useEffect(() => {
    const saved = getOnboardingData();
    if (saved) {
      setUsername(saved.username || saved.displayName || ''); // Support both for backward compatibility
      setFullName(saved.fullName || '');
      setAge(saved.age || '');
      // Note: Photos from localStorage would need to be converted back to File objects
      // For now, we'll just load the previews if they exist as URLs
    }
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

  // Debounced username check for real-time validation
  useEffect(() => {
    const checkUsernameAvailability = async () => {
      const trimmedUsername = username.trim();
      
      // Don't check if username is too short (less than 3 characters)
      if (trimmedUsername.length < 3) {
        setShowSuggestions(false);
        setUsernameSuggestions([]);
        setIsCheckingUsername(false);
        return;
      }

      setIsCheckingUsername(true);
      setShowSuggestions(false);

      try {
        const result = await onboardingService.checkUsername(trimmedUsername);
        
        // Always show suggestions if available (proactive UX like Facebook/Google)
        if (result.suggestions && result.suggestions.length > 0) {
          setUsernameSuggestions(result.suggestions);
          setShowSuggestions(true);
        } else {
          setUsernameSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error: any) {
        console.error('Error checking username:', error);
        // Show error but don't block user
        setShowSuggestions(false);
        setUsernameSuggestions([]);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    // Debounce the check - wait 500ms after user stops typing
    const timeoutId = setTimeout(checkUsernameAvailability, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  // Check username uniqueness on blur (fallback)
  const handleUsernameBlur = async () => {
    if (!username.trim()) {
      setShowSuggestions(false);
      setUsernameSuggestions([]);
      return;
    }
    
    // The useEffect will handle the check, but we can also do it here as a fallback
    if (usernameSuggestions.length === 0 && !isCheckingUsername) {
      try {
        const result = await onboardingService.checkUsername(username.trim());
        if (!result.isAvailable && result.suggestions.length > 0) {
          setUsernameSuggestions(result.suggestions);
          setShowSuggestions(true);
        }
      } catch (error) {
        // Ignore - will be checked on submit
      }
    }
  };

  // Custom submit function that handles username suggestions
  const submitBasicsWithSuggestions = async (data: { username: string; fullName: string; age: number; photos?: File[] }) => {
    try {
      return await onboardingService.submitBasics(data, '');
    } catch (err: any) {
      // Check if error contains suggestions
      if (err.response?.data?.suggestions) {
        setUsernameSuggestions(err.response.data.suggestions);
        setShowSuggestions(true);
        // Throw error with suggestions attached
        const errorWithSuggestions = new Error('This username is already taken. Please choose from the suggestions below.');
        (errorWithSuggestions as any).suggestions = err.response.data.suggestions;
        throw errorWithSuggestions;
      }
      throw err;
    }
  };

  const { handleSubmit, isSubmitting, error: submitError } = useOnboardingSubmit<
    { username: string; fullName: string; age: number; photos?: File[] }
  >(
    submitBasicsWithSuggestions,
    '/onboarding/background-series-one'
  );

  // Watch for errors with suggestions
  useEffect(() => {
    if (submitError && submitError.includes('username')) {
      // Error message already set, suggestions will be shown if they exist
    }
  }, [submitError]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear suggestions
    setShowSuggestions(false);
    setUsernameSuggestions([]);
    
    // Validate username
    const usernameValidation = validateRequired(username, 'display name');
    if (!usernameValidation.isValid) {
      showValidationError(usernameValidation.message!);
      return;
    }

    // Validate full name
    const fullNameValidation = validateRequired(fullName, 'full name');
    if (!fullNameValidation.isValid) {
      showValidationError(fullNameValidation.message!);
      return;
    }

    // Validate age
    const ageValidation = validateAge(age);
    if (!ageValidation.isValid) {
      showValidationError(ageValidation.message!);
      return;
    }

    // Validate photos
    const photosValidation = validatePhotos(photos, 5);
    if (!photosValidation.isValid) {
      showValidationError(photosValidation.message!);
      return;
    }

    handleSubmit({
      username,
      fullName,
      age: age as number,
      photos: photos.filter((p): p is File => p !== undefined),
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

        {/* Header Text */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#491A26] mb-2">
          Your Basics
        </h2>
        <p className="text-sm md:text-base text-[#5A4A4A] font-medium mb-8">
          Let’s collect the essential details about you.
        </p>

        {/* Form Fields */}
  <form onSubmit={onSubmit} className="flex flex-col gap-6 px-0 md:px-0">

          {/* Display Name */}
          <div>
            <label className="text-base md:text-base text-[#491A26] block mb-1 font-semibold">Display Name*</label>
            <input
              type="text"
              placeholder="Enter Display Name"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                // Don't clear suggestions immediately - let useEffect handle it
                // This allows real-time checking as user types
              }}
              onBlur={handleUsernameBlur}
              className={`w-3/4 md:w-2/3 bg-[#F6E7EA] border ${
                showSuggestions ? "border-red-400" : isCheckingUsername ? "border-blue-400" : "border-[#E4D6D6]"
              } rounded-md py-3 px-4 text-sm text-black outline-none`}
              required
            />
            {isCheckingUsername && (
              <p className="text-xs text-[#6B5B5B] mt-1 w-3/4 md:w-2/3 flex items-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-[#702C3E] border-t-transparent rounded-full animate-spin"></span>
                Checking availability...
              </p>
            )}
            {!isCheckingUsername && username.trim().length >= 3 && !showSuggestions && (
              <p className="text-xs text-green-600 mt-1 w-3/4 md:w-2/3 flex items-center gap-1">
                <span>✓</span> Username is available
              </p>
            )}
            {showSuggestions && usernameSuggestions.length > 0 && (
              <div className="mt-2 w-3/4 md:w-2/3">
                <p className="text-sm text-[#702C3E] mb-2 font-medium">Suggested usernames:</p>
                <div className="flex flex-wrap gap-2">
                  {usernameSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setUsername(suggestion);
                        setShowSuggestions(false);
                        setUsernameSuggestions([]);
                      }}
                      className="px-3 py-1.5 bg-[#702C3E] text-white text-sm rounded-md hover:bg-[#5E2333] transition shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {submitError && submitError.includes('username') && !showSuggestions && (
              <p className="text-sm text-red-600 mt-2 w-3/4 md:w-2/3">{submitError}</p>
            )}
          </div>

          {/* Full Name */}
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
          </div>

          {/* Age */}
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
            {photos.filter(p => p !== undefined).length > 0 && photos.filter(p => p !== undefined).length < 5 && (
              <p className="text-xs text-red-600 mt-2">Please upload exactly 5 photos ({photos.filter(p => p !== undefined).length}/5)</p>
            )}
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

        {/* Footer Text */}
        <p className="text-center text-xs text-[#6B5B5B] mt-6">
          By continuing, you agree to our <span className="underline">Terms of Use</span> and <span className="underline">Privacy Policy</span>.
        </p>

      </div>
    </section>
  );
}
