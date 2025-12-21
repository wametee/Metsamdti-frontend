import { toast } from "react-toastify";

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Friendly validation messages for onboarding forms
 */
export const validationMessages = {
  required: (fieldName: string) => `Please provide your ${fieldName.toLowerCase()}. This helps us get to know you better!`,
  age: "You must be at least 22 years old to use Metsamdti. We focus on serious relationships and require users to be 22 or older.",
  photos: {
    required: "Please upload 5 photos of yourself. This helps others see the real you!",
    count: (count: number, required: number) => 
      count < required 
        ? `Please upload ${required} photos. You've uploaded ${count} so far.`
        : `Please upload exactly ${required} photos. You've uploaded ${count}.`,
  },
  birthday: "Please select your birthday so we can verify you meet our age requirement.",
  gender: "Please let us know your gender. This helps us find the right matches for you.",
  languages: "Please tell us how many languages you speak. This helps us understand your communication style.",
  select: (fieldName: string) => `Please select a ${fieldName.toLowerCase()}. We'd love to learn more about you!`,
  email: {
    required: "Please enter your email address. We'll use this to keep you updated on your matches.",
    invalid: "Please enter a valid email address. This helps us keep your account secure.",
  },
  password: {
    required: "Please create a password to secure your account.",
    minLength: "Your password should be at least 8 characters long for better security.",
    match: "Your passwords don't match. Please make sure they're the same.",
  },
};

/**
 * Show friendly validation error using toast
 */
export function showValidationError(message: string) {
  toast.error(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  });
}

/**
 * Validate required field
 */
export function validateRequired(value: any, fieldName: string): ValidationResult {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return {
      isValid: false,
      message: validationMessages.required(fieldName),
    };
  }
  return { isValid: true };
}

/**
 * Validate age
 */
export function validateAge(age: number | string): ValidationResult {
  const ageNum = typeof age === 'string' ? parseInt(age) : age;
  if (!ageNum || isNaN(ageNum) || ageNum < 22 || ageNum > 100) {
    return {
      isValid: false,
      message: validationMessages.age,
    };
  }
  return { isValid: true };
}

/**
 * Validate email
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || !email.trim()) {
    return {
      isValid: false,
      message: validationMessages.email.required,
    };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: validationMessages.email.invalid,
    };
  }
  return { isValid: true };
}

/**
 * Validate password
 */
export function validatePassword(password: string, minLength: number = 8): ValidationResult {
  if (!password || !password.trim()) {
    return {
      isValid: false,
      message: validationMessages.password.required,
    };
  }
  if (password.length < minLength) {
    return {
      isValid: false,
      message: validationMessages.password.minLength,
    };
  }
  return { isValid: true };
}

/**
 * Validate photos count
 */
export function validatePhotos(photos: File[] | string[], required: number = 5): ValidationResult {
  if (!photos || photos.length === 0) {
    return {
      isValid: false,
      message: validationMessages.photos.required,
    };
  }
  if (photos.length !== required) {
    return {
      isValid: false,
      message: validationMessages.photos.count(photos.length, required),
    };
  }
  return { isValid: true };
}

/**
 * Validate birthday and age from date
 */
export function validateBirthday(birthday: string): ValidationResult {
  if (!birthday) {
    return {
      isValid: false,
      message: validationMessages.birthday,
    };
  }
  
  const today = new Date();
  const birth = new Date(birthday);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  if (age < 22) {
    return {
      isValid: false,
      message: validationMessages.age,
    };
  }
  
  return { isValid: true };
}






