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
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<number | "">("");
  // Use fixed-length arrays (5 slots) with undefined for empty slots
  // This ensures file inputs stay aligned with their indices
  const [photos, setPhotos] = useState<(File | undefined)[]>(Array(5).fill(undefined));
  const [photoPreviews, setPhotoPreviews] = useState<(string | undefined)[]>(Array(5).fill(undefined));
  const [ageError, setAgeError] = useState<string>("");

  // Auto-generate display name from full name
  useEffect(() => {
    if (fullName.trim()) {
      const generated = generateDisplayName(fullName);
      setUsername(generated);
    } else {
      setUsername('');
    }
  }, [fullName]);

  // Load saved data or current user data (for Google sign-up users)
  useEffect(() => {
    const saved = getOnboardingData();
    if (saved) {
      setFullName(saved.fullName || '');
      setAge(saved.age || '');
      // Note: Username will be auto-generated from fullName
      // Note: Photos from localStorage would need to be converted back to File objects
      // For now, we'll just load the previews if they exist as URLs
    } else {
      // If no saved data, try to get current user data (for Google sign-up users)
      // This allows them to see their Google name and change it if needed
      const loadUserData = async () => {
        try {
          const authService = (await import('@/services/auth/authService')).default;
          const userResult = await authService.getCurrentUser();
          if (userResult.success && userResult.user && userResult.user.real_name) {
            // Pre-fill with Google user data, but allow them to change it
            setFullName(userResult.user.real_name);
            // Display name will be auto-generated from full name
          }
        } catch (error: any) {
          // Silently fail - 401 is expected if user isn't logged in yet
          // This is normal during onboarding, so we don't show any errors
          if (error?.status !== 401 && error?.code !== 'UNAUTHORIZED') {
            // Only log non-401 errors in development
            if (process.env.NODE_ENV === 'development') {
              console.log('Could not load user data for pre-fill:', error);
            }
          }
        }
      };
      loadUserData();
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
  const removePhoto = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent triggering the file input
    }
    
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

  // Handle clicking on photo to replace it
  const handlePhotoClick = (index: number) => {
    const fileInput = document.getElementById(`photo-upload-${index}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Reset to allow selecting the same file
      fileInput.click();
    }
  };


  // Custom submit function
  const submitBasicsWithSuggestions = async (data: { username: string; fullName: string; age: number; photos?: File[] }) => {
    return await onboardingService.submitBasics(data, '');
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

    // Validate photos - filter out undefined values
    const validPhotos = photos.filter((p): p is File => p !== undefined);
    const photosValidation = validatePhotos(validPhotos, 5);
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

          {/* Full Name - comes first */}
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

          {/* Display Name - auto-generated, read-only */}
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
                <div 
                  className="w-32 h-32 rounded-xl flex items-center justify-center overflow-hidden relative border border-[#E4D6D6] cursor-pointer hover:border-[#702C3E] transition-colors group"
                  onClick={() => handlePhotoClick(0)}
                >
                  {photoPreviews[0] ? (
                    <>
                      <Image 
                        src={photoPreviews[0]} 
                        alt="Main photo" 
                        width={128} 
                        height={128} 
                        className="object-cover w-full h-full" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to change
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Image 
                        src={upload} 
                        alt="Upload" 
                        width={128} 
                        height={128} 
                        className="object-contain opacity-50" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IoMdAdd className="w-8 h-8 text-[#702C3E] opacity-50" />
                      </div>
                    </>
                  )}
                </div>
                <input
                  id="photo-upload-0"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoChange(0, e)}
                />
              </div>

              {/* Five Small Upload Boxes */}
              <div className="col-span-3 grid grid-cols-3 gap-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex flex-col items-center relative">
                    <div 
                      className="w-28 h-28 rounded-xl flex items-center justify-center mx-auto overflow-hidden border border-dashed border-gray-300 relative cursor-pointer hover:border-[#702C3E] transition-colors group"
                      onClick={() => handlePhotoClick(index)}
                    >
                      {photoPreviews[index] ? (
                        <>
                          <Image 
                            src={photoPreviews[index]} 
                            alt={`Upload ${index + 1}`} 
                            width={112} 
                            height={112} 
                            className="object-cover w-full h-full" 
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to change
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => removePhoto(index, e)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                            title="Remove photo"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <>
                          <Image 
                            src={upload} 
                            alt="Upload" 
                            width={112} 
                            height={112} 
                            className="object-contain opacity-50" 
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <IoMdAdd className="w-6 h-6 text-[#702C3E] opacity-50" />
                          </div>
                        </>
                      )}
                    </div>
                    <input
                      id={`photo-upload-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoChange(index, e)}
                    />
                  </div>
                ))}
              </div>

              <div className="col-span-3 flex justify-center gap-4">
                {[3, 4].map((index) => (
                  <div key={index} className="flex flex-col items-center relative">
                    <div 
                      className="w-28 h-28 rounded-xl flex items-center justify-center overflow-hidden border border-dashed border-gray-300 relative cursor-pointer hover:border-[#702C3E] transition-colors group"
                      onClick={() => handlePhotoClick(index)}
                    >
                      {photoPreviews[index] ? (
                        <>
                          <Image 
                            src={photoPreviews[index]} 
                            alt={`Upload ${index + 1}`} 
                            width={112} 
                            height={112} 
                            className="object-cover w-full h-full" 
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to change
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => removePhoto(index, e)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                            title="Remove photo"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <>
                          <Image 
                            src={upload} 
                            alt="Upload" 
                            width={112} 
                            height={112} 
                            className="object-contain opacity-50" 
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <IoMdAdd className="w-6 h-6 text-[#702C3E] opacity-50" />
                          </div>
                        </>
                      )}
                    </div>
                    <input
                      id={`photo-upload-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoChange(index, e)}
                    />
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
      </div>

      {/* Footer Text */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6">
        By continuing, you agree to our <span className="underline">Terms of Use</span> and <span className="underline">Privacy Policy</span>.
      </p>
    </section>
  );
}
