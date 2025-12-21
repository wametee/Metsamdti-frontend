"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import authService from "@/services/auth/authService";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import httpClient from "@/lib/httpClient";
import { getImageUrl, isLocalImage, extractStorageInfo, extractStorageKeyFromUrl } from "@/lib/utils/imageUrl";

interface ProfileData {
  display_name?: string;
  full_name?: string;
  age?: number;
  birthday?: string;
  gender?: string;
  languages?: string[];
  current_location?: string;
  birth_location?: string;
  living_situation?: string;
  education?: string;
  occupation?: string;
  previously_married?: boolean;
  has_children?: boolean;
  open_to_partner_with_children?: boolean;
  preferred_age_range_min?: number;
  preferred_age_range_max?: number;
  ideal_marriage_timeline?: string;
  weekend_activities?: string;
  core_values?: string[];
  conflict_handling?: string;
  love_language?: string;
  one_thing_to_understand?: string;
  faith_importance?: string;
  gender_roles_in_marriage?: string;
  prefer_own_background?: boolean;
  future_family_vision?: string;
  biggest_deal_breaker?: string;
  marital_history?: string;
  // Emotional Series fields (now stored as columns)
  emotional_balance?: string;
  conflict_emotional_response?: string;
  decision_making_guide?: string;
  preferred_emotional_energy?: string;
  feels_loved?: string;
  deep_connection?: string;
  confidence_moments?: string;
  show_love?: string;
  disagreement_response?: string;
  loved_one_upset_response?: string;
  refill_emotional_energy?: string;
  communication_style?: string;
  life_approach?: string;
  valued_relationship?: string;
  // Legacy questionnaire_data (for backward compatibility)
  questionnaire_data?: {
    background?: any;
    emotional?: any;
  };
  photos?: Array<{ 
    storage_key?: string; 
    url?: string; 
    bucket?: string;
    order?: number;
  }>;
}

// Field options mapping (matching onboarding question structure exactly)
// Defined outside component to ensure it's available for normalization
const FIELD_OPTIONS: Record<string, string[]> = {
  gender: ['Male', 'Female'],
  living_situation: ['Alone', 'With family', 'With roommates'],
  education: ['Primary', 'Secondary', 'University', 'Other'], // Matches BackgroundSeriesThree
  ideal_marriage_timeline: ['1 year', '1–2 years', 'Open-ended'],
  faith_importance: ['Very important', 'Somewhat', 'Not important'],
  gender_roles_in_marriage: ['Traditional', 'Equal partnership', 'Flexible', 'Not sure'], // Matches BackgroundSeriesEight
  conflict_handling: ['Talk it out', 'Take space', 'Seek mediation'],
  love_language: ['Words', 'Acts', 'Touch', 'Quality time', 'Gifts'], // Matches BackgroundSeriesSeven
  weekend_activities: ['Quiet at home', 'Socializing', 'Outdoors', 'Hobbies or studying'], // Matches BackgroundSeriesSix
};

export default function ProfileView() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ProfileData | null>(null);
  const [saving, setSaving] = useState(false);
  const [editPhotos, setEditPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const result = await authService.getCurrentUserProfile();
        
        if (result.success && result.profile) {
          console.log('Profile data received:', result.profile);
          console.log('Profile display_name:', result.profile.display_name);
          console.log('Profile full_name:', result.profile.full_name);
          console.log('Profile status:', result.profile.status);
          console.log('Profile photos:', result.profile.photos);
          console.log('Questionnaire data:', result.profile.questionnaire_data);
          console.log('Background data:', result.profile.questionnaire_data?.background);
          console.log('Emotional data:', result.profile.questionnaire_data?.emotional);
          console.log('Emotional series keys:', Object.keys(result.profile.questionnaire_data?.emotional || {}));
          
          // Ensure profile has all required fields, even if NULL
          const completeProfile = {
            ...result.profile,
            display_name: result.profile.display_name || 'User',
            full_name: result.profile.full_name || null,
            photos: result.profile.photos || [],
          };
          
          // Normalize string values and map to correct option values from database
          // This ensures database values match the exact option strings from background series
          const normalizeFieldValue = (value: any, fieldName: string): string | null => {
            if (!value) return null;
            const strValue = String(value).trim();
            if (!strValue) return null;
            
            // Get the correct options for this field
            const options = FIELD_OPTIONS[fieldName] || [];
            
            // Try exact match first
            if (options.includes(strValue)) {
              return strValue;
            }
            
            // Try case-insensitive match and return the correct option value
            const matchedOption = options.find(opt => 
              opt.toLowerCase() === strValue.toLowerCase()
            );
            if (matchedOption) {
              return matchedOption; // Return the correct option value from FIELD_OPTIONS
            }
            
            // If no match found, return the original value (might be from old data)
            return strValue;
          };
          
          const normalizedProfile = {
            ...completeProfile,
            education: normalizeFieldValue(completeProfile.education, 'education'),
            weekend_activities: normalizeFieldValue(completeProfile.weekend_activities, 'weekend_activities'),
            love_language: normalizeFieldValue(completeProfile.love_language, 'love_language'),
            gender_roles_in_marriage: normalizeFieldValue(completeProfile.gender_roles_in_marriage, 'gender_roles_in_marriage'),
            living_situation: normalizeFieldValue(completeProfile.living_situation, 'living_situation'),
            ideal_marriage_timeline: normalizeFieldValue(completeProfile.ideal_marriage_timeline, 'ideal_marriage_timeline'),
            conflict_handling: normalizeFieldValue(completeProfile.conflict_handling, 'conflict_handling'),
            faith_importance: normalizeFieldValue(completeProfile.faith_importance, 'faith_importance'),
          };
          
          setProfileData(normalizedProfile);
          setEditData({ ...normalizedProfile }); // Deep copy to ensure independence
          
          // Initialize photos from existing profile
          if (completeProfile.photos && completeProfile.photos.length > 0) {
            const existingPhotoUrls = completeProfile.photos
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .map((photo: any) => getImageUrl(photo))
              .filter((url: string | null): url is string => url !== null);
            setPhotoPreviews(existingPhotoUrls);
            console.log('Initialized photo previews:', existingPhotoUrls);
          } else {
            console.log('No photos found in profile');
            setPhotoPreviews([]);
          }
        } else {
          console.error('Profile fetch failed:', result.message);
          setError(result.message || "No profile found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle edit mode toggle
  const handleEdit = () => {
    setIsEditing(true);
    // Deep copy to ensure all values are preserved
    setEditData(profileData ? { ...profileData } : null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profileData);
    setEditPhotos([]);
    // Reset photo previews to original
    if (profileData?.photos && profileData.photos.length > 0) {
      const existingPhotoUrls = profileData.photos
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        .map((photo: any) => {
          // Try to construct URL from photo object
          if (photo.url) return photo.url;
          if (photo.storage_key) {
            const bucket = photo.bucket || 'uploads';
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            if (supabaseUrl) {
              return `${supabaseUrl}/storage/v1/object/public/${bucket}/${photo.storage_key}`;
            }
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            return `${apiUrl}/uploads/${photo.storage_key}`;
          }
          return '';
        });
      setPhotoPreviews(existingPhotoUrls.filter((url: string) => url));
    } else {
      setPhotoPreviews([]);
    }
  };

  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...photoPreviews];
      newPreviews[index] = reader.result as string;
      setPhotoPreviews(newPreviews);
    };
    reader.readAsDataURL(file);

    // Store file
    const newPhotos = [...editPhotos];
    newPhotos[index] = file;
    setEditPhotos(newPhotos);
  };

  // Handle photo removal
  const handlePhotoRemove = (index: number) => {
    const newPreviews = [...photoPreviews];
    newPreviews.splice(index, 1);
    setPhotoPreviews(newPreviews);

    const newPhotos = [...editPhotos];
    newPhotos.splice(index, 1);
    setEditPhotos(newPhotos);
  };

  // Handle form field changes - use functional update to prevent focus loss
  const handleFieldChange = useCallback((field: string, value: any) => {
    setEditData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  }, []);

  // Handle array field changes (like languages, core_values) - use functional update
  const handleArrayFieldChange = useCallback((field: string, value: string[]) => {
    setEditData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  }, []);

  // Handle save
  const handleSave = async () => {
    if (!editData) return;

    try {
      setSaving(true);

      // Upload new photos first if any
      let uploadedPhotoData: Array<{ url: string; path?: string; bucket?: string }> = [];
      const newPhotos = editPhotos.filter((photo): photo is File => photo instanceof File);
      
      if (newPhotos.length > 0) {
        const formData = new FormData();
        newPhotos.forEach((photo) => {
          formData.append("uploaded_file", photo);
        });

        try {
          const uploadResponse = await httpClient.post("/onboarding/upload-photos", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          
          // Get file data with path and bucket information
          const fileData = uploadResponse.data.fileUrl || [];
          uploadedPhotoData = fileData.map((f: any) => ({
            url: f.url || f,
            path: f.path,
            bucket: f.bucket,
          }));
          
          console.log('Uploaded photo data:', uploadedPhotoData);
        } catch (uploadError: any) {
          console.error('Photo upload error:', uploadError);
          alert('Failed to upload photos: ' + (uploadError.message || 'Unknown error'));
          setSaving(false);
          return;
        }
      }

      // Prepare photos data - combine existing and new photos
      const photosData: any[] = [];
      let uploadedIndex = 0;
      
      photoPreviews.forEach((preview, index) => {
        const photo = editPhotos[index];
        if (photo instanceof File) {
          // New uploaded photo - use path and bucket from upload response
          if (uploadedPhotoData[uploadedIndex]) {
            const photoInfo = uploadedPhotoData[uploadedIndex];
            let storageKey = '';
            let bucket = photoInfo.bucket || 'uploads';
            
            // Extract storage_key from path if available, otherwise from URL
            if (photoInfo.path) {
              // Path format: "public/filename.jpg" or "uploads/filename.jpg"
              // For Supabase, storage_key should be the path after bucket, or just filename
              const pathParts = photoInfo.path.split('/');
              if (pathParts[0] === 'public' && pathParts.length > 1) {
                // Supabase format: public/filename.jpg -> storage_key: filename.jpg
                storageKey = pathParts.slice(1).join('/');
              } else {
                // Local format: uploads/filename.jpg -> storage_key: filename.jpg
                storageKey = pathParts[pathParts.length - 1];
              }
            } else if (photoInfo.url) {
              // Use utility function to extract storage info
              const extracted = extractStorageInfo(photoInfo.url);
              if (extracted) {
                storageKey = extracted.storage_key;
                bucket = extracted.bucket;
              } else {
                // Fallback: use filename
                storageKey = photoInfo.url.split('/').pop() || `photo-${index}`;
              }
            } else {
              storageKey = `photo-${index}-${Date.now()}`;
            }
            
            console.log(`Photo ${index + 1} - URL: ${photoInfo.url}, Path: ${photoInfo.path}, Storage Key: ${storageKey}, Bucket: ${bucket}`);
            
            photosData.push({
              url: photoInfo.url,
              storage_key: storageKey,
              bucket: bucket,
              order: index,
            });
            uploadedIndex++;
          }
        } else {
          // Existing photo - try to extract URL from preview or use existing photo data
              const existingPhoto = profileData?.photos?.find((p: any) => {
            const photoUrl = getImageUrl(p);
            return photoUrl === preview || p.url === preview;
          });
          
          if (existingPhoto) {
            photosData.push({
              url: existingPhoto.url || preview,
              storage_key: existingPhoto.storage_key,
              bucket: existingPhoto.bucket || 'uploads',
              order: index,
            });
          } else {
            // Try to extract storage key from preview URL using utility function
            const extracted = extractStorageInfo(preview);
            if (extracted) {
              photosData.push({
                url: preview,
                storage_key: extracted.storage_key,
                bucket: extracted.bucket,
                order: index,
              });
            } else {
              // Fallback: use preview as URL and extract filename
              const storageKey = preview.split('/').pop() || `photo-${index}`;
              photosData.push({
                url: preview,
                storage_key: storageKey,
                bucket: 'uploads',
                order: index,
              });
            }
          }
        }
      });
      
      console.log('Photos data to send:', photosData);

      // Prepare update data - only include valid profile fields
      // Exclude system fields and questionnaire_data (stored in individual columns)
      const editDataAny = editData as any;
      const { 
        photos: _, 
        id: __id, 
        user_id: __user_id, 
        created_at: __created_at,
        questionnaire_data: __questionnaire_data,
        ...profileUpdateData 
      } = editDataAny || {};
      
      // Remove any undefined/null values, but keep empty strings for text fields
      // Also ensure boolean values are properly converted
      const cleanProfileData: any = {};
      for (const [key, value] of Object.entries(profileUpdateData)) {
        if (value !== undefined && value !== null) {
          // For boolean fields, ensure they're actual booleans
          if (key === 'previously_married' || key === 'has_children' || 
              key === 'open_to_partner_with_children' || key === 'prefer_own_background') {
            // These should already be booleans from handleFieldChange, but ensure they are
            cleanProfileData[key] = typeof value === 'boolean' ? value : (value === true || value === 'true' || value === 'Yes');
          }
          // For number fields, ensure they're numbers
          else if (key === 'age' || key === 'preferred_age_range_min' || key === 'preferred_age_range_max') {
            cleanProfileData[key] = typeof value === 'number' ? value : (value === '' ? null : Number(value));
          }
          // For array fields, ensure they're arrays
          else if (key === 'languages' || key === 'core_values') {
            if (Array.isArray(value)) {
              cleanProfileData[key] = value;
            } else if (typeof value === 'string' && value.trim() !== '') {
              // If it's a string (comma-separated), split it
              cleanProfileData[key] = value.split(',').map(v => v.trim()).filter(v => v);
            } else {
              // Empty array is valid - user might want to clear the field
              cleanProfileData[key] = [];
            }
          }
          // For string fields, allow empty strings (they might want to clear a field)
          else {
            cleanProfileData[key] = value;
          }
        }
      }
      
      const updateData = {
        ...cleanProfileData,
        photos: photosData,
      };

      console.log('Update data being sent:', { 
        profileFields: Object.keys(cleanProfileData),
        profileDataSample: Object.fromEntries(Object.entries(cleanProfileData).slice(0, 5)),
        photosCount: photosData.length 
      });

      console.log('Sending update request with data keys:', Object.keys(updateData));
      console.log('Update data sample (first 10 fields):', Object.fromEntries(Object.entries(updateData).slice(0, 10)));

      const result = await authService.updateProfile(updateData);

      if (result.success && result.profile) {
        setProfileData(result.profile);
        setIsEditing(false);
        setEditPhotos([]);
        // Refresh photo previews
        if (result.profile.photos && result.profile.photos.length > 0) {
          const existingPhotoUrls = result.profile.photos
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
            .map((photo: any) => getImageUrl(photo))
            .filter((url: string | null): url is string => url !== null);
          setPhotoPreviews(existingPhotoUrls);
        } else {
          setPhotoPreviews([]);
        }
        alert('Profile updated successfully!');
      } else {
        console.error('Update failed:', result);
        const errorMsg = result.message || 'Failed to update profile. Please check the console for details.';
        alert(errorMsg);
      }
    } catch (err: any) {
      console.error('Save error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack,
      });
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error occurred';
      alert(`Failed to update profile: ${errorMsg}\n\nPlease check the browser console and backend logs for more details.`);
    } finally {
      setSaving(false);
    }
  };

  // Helper function to format boolean values
  const formatBoolean = (value: boolean | null | undefined): string => {
    if (value === null || value === undefined) return "Not specified";
    return value ? "Yes" : "No";
  };

  // Helper function to format array values
  const formatArray = (value: string[] | null | undefined): string => {
    if (!value || value.length === 0) return "Not specified";
    return value.join(", ");
  };

  // Use the field options constant
  const fieldOptions = FIELD_OPTIONS;

  // Helper component to render editable field
  const EditableField = ({ 
    label, 
    field, 
    value, 
    type = 'text',
    options,
    isArray = false,
    useRadioButtons = false,
  }: {
    label: string;
    field: string;
    value: any;
    type?: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'boolean';
    options?: string[];
    isArray?: boolean;
    useRadioButtons?: boolean;
  }) => {
    if (isEditing) {
      // Use radio buttons if options are available and useRadioButtons is true
      const fieldOptionsList = options || fieldOptions[field];
      if (useRadioButtons && fieldOptionsList && fieldOptionsList.length > 0) {
        // Normalize value for comparison (trim whitespace, case-insensitive matching)
        // First try exact match, then try case-insensitive match
        const normalizedValue = value ? String(value).trim() : '';
        return (
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm text-[#6B5B5B] font-medium">{label}</label>
            <div className="flex flex-col gap-2">
              {fieldOptionsList.map((opt) => {
                const normalizedOpt = String(opt).trim();
                // Try exact match first, then case-insensitive match
                const isChecked = normalizedValue === normalizedOpt || 
                                 normalizedValue.toLowerCase() === normalizedOpt.toLowerCase();
                return (
                  <label
                    key={opt}
                    onClick={() => handleFieldChange(field, opt)}
                    className={`
                      w-full md:w-3/4 border rounded-md py-2 px-3
                      flex items-center gap-3 cursor-pointer
                      hover:brightness-105 transition
                      ${isChecked 
                        ? 'bg-[#F6E7EA] border-[#702C3E] border-2' 
                        : 'bg-[#F6E7EA] border-[#E4D6D6]'}
                    `}
                  >
                    <input
                      type="radio"
                      name={field}
                      checked={isChecked}
                      onChange={() => handleFieldChange(field, opt)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 accent-[#702C3E]"
                    />
                    <span className="text-sm text-[#491A26] ml-3">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      }
      
      if (type === 'textarea') {
        return (
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm text-[#6B5B5B] font-medium">{label}</label>
            <textarea
              key={`textarea-${field}`}
              value={value ?? ''}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="px-3 py-2 border border-[#E4D6D6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#702C3E] text-base text-[#2F2E2E]"
              rows={3}
              autoComplete="off"
            />
          </div>
        );
      }
      if (type === 'select' && (options || fieldOptionsList)) {
        const selectOptions = options || fieldOptionsList || [];
        // Normalize value for comparison
        const normalizedValue = value ? String(value).trim() : '';
        return (
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#6B5B5B] font-medium">{label}</label>
            <select
              key={`select-${field}`}
              value={normalizedValue}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="px-3 py-2 border border-[#E4D6D6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#702C3E] text-base text-[#2F2E2E] bg-white"
            >
              <option value="">Select...</option>
              {selectOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        );
      }
      if (type === 'boolean') {
        return (
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm text-[#6B5B5B] font-medium">{label}</label>
            <div className="flex flex-col gap-2">
              {['Yes', 'No'].map((opt) => (
                <label
                  key={opt}
                  onClick={() => handleFieldChange(field, opt === 'Yes')}
                  className="
                    w-full md:w-3/4 bg-[#F6E7EA] border border-[#E4D6D6]
                    rounded-md py-2 px-3
                    flex items-center gap-3 cursor-pointer
                    hover:brightness-105 transition
                  "
                >
                  <input
                    type="radio"
                    name={field}
                    checked={(value === true && opt === 'Yes') || (value === false && opt === 'No')}
                    onChange={() => handleFieldChange(field, opt === 'Yes')}
                    className="w-4 h-4 accent-[#702C3E]"
                  />
                  <span className="text-sm text-[#491A26] ml-3">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        );
      }
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm text-[#6B5B5B] font-medium">{label}</label>
          <input
            key={`input-${field}`}
            type={type}
            value={value ?? ''}
            onChange={(e) => {
              const newValue = type === 'number' 
                ? (e.target.value === '' ? null : parseInt(e.target.value) || null)
                : e.target.value;
              handleFieldChange(field, newValue);
            }}
            className="px-3 py-2 border border-[#E4D6D6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#702C3E] text-base text-[#2F2E2E]"
            autoComplete="off"
          />
        </div>
      );
    }
    // Display value - handle empty strings, null, undefined
    const displayValue = (value !== null && value !== undefined && value !== '') 
      ? String(value) 
      : 'Not specified';
    
    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm text-[#6B5B5B] font-medium">{label}</span>
        <span className="text-base text-[#2F2E2E] font-semibold">
          {displayValue}
        </span>
      </div>
    );
  };

  // Get display name or fallback
  const displayName = profileData?.display_name || "User";

  // Get photos - handle both storage_key and url formats using utility function
  const profilePhotos = profileData?.photos || [];
  const photoUrls = profilePhotos
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((photo) => getImageUrl(photo))
    .filter((url): url is string => url !== null);

  if (loading) {
    return (
      <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center justify-center pt-24 pb-10 md:py-20 px-4">
        <div className="text-[#702C3E]">Loading profile...</div>
      </section>
    );
  }

  if (error || !profileData) {
    return (
      <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center justify-center pt-24 pb-10 md:py-20 px-4">
        <div className="text-red-600">{error || "Profile not found"}</div>
        <button
          onClick={() => router.back()}
          className="mt-4 text-[#702C3E] hover:underline"
        >
          Go back
        </button>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full bg-[#EDD4D3] relative flex flex-col items-center 
    pt-24 pb-10 md:py-20 px-4">

      {/* Header with Profile Name and Language Switcher */}
      <div className="absolute top-6 right-6 flex items-center gap-4 text-[#702C3E] text-sm z-40">
        {/* Profile Name Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-1 border border-[#E5D5D5] rounded-md px-3 py-1.5 cursor-pointer bg-white/60 hover:bg-white/80 transition"
          >
            <span className="font-medium">{displayName}</span>
            <RiArrowDropDownLine className="w-5 h-5" />
          </button>
        </div>
        
        {/* Language Switcher */}
        <LanguageSwitcher />
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute left-6 top-6 p-2 rounded-md text-[#702C3E] hover:bg-white/60 z-40"
      >
        <FaArrowLeft className="w-5 h-5" />
      </button>

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

        {/* Title and Edit Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            About {displayName}
          </h2>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-[#702C3E] text-white rounded-md hover:bg-[#8B3A4F] transition"
            >
              Edit Profile
            </button>
          )}
          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border-2 border-[#702C3E] text-[#702C3E] rounded-md hover:bg-[#702C3E]/10 transition"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#702C3E] text-white rounded-md hover:bg-[#8B3A4F] transition disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Profile Photos Section */}
        <div className="w-full mb-8">
          <h3 className="text-xl font-semibold text-[#702C3E] mb-4">Photos</h3>
          {isEditing ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 max-w-2xl mx-auto px-2 md:px-0">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-dashed border-[#E4D6D6] bg-white/50 hover:border-[#702C3E] transition-colors">
                  {photoPreviews[index] ? (
                    <>
                      <img
                        src={photoPreviews[index]}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handlePhotoRemove(index)}
                        className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full w-7 h-7 md:w-6 md:h-6 flex items-center justify-center text-base md:text-xs hover:bg-red-600 transition-colors shadow-md"
                        aria-label="Remove photo"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-[#E4D6D6]/30 active:bg-[#E4D6D6]/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoChange(e, index)}
                        ref={index === 0 ? fileInputRef : undefined}
                      />
                      <span className="text-[#702C3E] text-3xl md:text-2xl font-light">+</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          ) : (
            photoUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 max-w-2xl mx-auto px-2 md:px-0">
                {photoUrls.map((photoUrl, index) => {
                  const isLocalhost = isLocalImage(photoUrl);
                  return (
                    <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden border border-[#E4D6D6] shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                      {isLocalhost ? (
                        <img
                          src={photoUrl}
                          alt={`Profile photo ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Failed to load image:', photoUrl);
                            const target = e.target as HTMLImageElement;
                            if (target.parentElement) {
                              target.parentElement.style.display = 'none';
                            }
                          }}
                        />
                      ) : (
                        <Image
                          src={photoUrl}
                          alt={`Profile photo ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 33vw, 150px"
                          onError={(e) => {
                            console.error('Failed to load image:', photoUrl);
                            const target = e.target as HTMLImageElement;
                            if (target.parentElement) {
                              target.parentElement.style.display = 'none';
                            }
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* Profile Sections */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E4D6D6]">
            <h3 className="text-xl font-semibold text-[#702C3E] mb-4 pb-2 border-b border-[#E4D6D6]">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableField
                label="Full Name"
                field="full_name"
                value={isEditing ? editData?.full_name : profileData?.full_name}
                type="text"
              />
              <EditableField
                label="Age"
                field="age"
                value={isEditing ? editData?.age : profileData?.age}
                type="number"
              />
              <EditableField
                label="Birthday"
                field="birthday"
                value={isEditing ? editData?.birthday : profileData?.birthday}
                type="date"
              />
              <EditableField
                label="Gender"
                field="gender"
                value={isEditing ? editData?.gender : profileData?.gender}
                type="select"
                options={['Male', 'Female']}
                useRadioButtons={true}
              />
              <EditableField
                label="Current Location"
                field="current_location"
                value={isEditing ? editData?.current_location : profileData?.current_location}
                type="text"
              />
              <EditableField
                label="Birth Location"
                field="birth_location"
                value={isEditing ? editData?.birth_location : profileData?.birth_location}
                type="text"
              />
              {isEditing ? (
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#6B5B5B] font-medium">Languages (comma-separated)</label>
                  <input
                    type="text"
                    value={editData?.languages?.join(', ') || ''}
                    onChange={(e) => handleArrayFieldChange('languages', e.target.value.split(',').map(l => l.trim()).filter(l => l))}
                    className="px-3 py-2 border border-[#E4D6D6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#702C3E] text-base text-[#2F2E2E]"
                    placeholder="English, Spanish, French"
                  />
                </div>
              ) : (
                profileData.languages && profileData.languages.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#6B5B5B] font-medium">Languages</span>
                    <span className="text-base text-[#2F2E2E] font-semibold">{formatArray(profileData.languages)}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Education & Career */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E4D6D6]">
            <h3 className="text-xl font-semibold text-[#702C3E] mb-4 pb-2 border-b border-[#E4D6D6]">Education & Career</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableField
                label="Education"
                field="education"
                value={isEditing ? editData?.education : profileData?.education}
                type="select"
                useRadioButtons={true}
              />
              <EditableField
                label="Occupation"
                field="occupation"
                value={isEditing ? editData?.occupation : profileData?.occupation}
                type="text"
              />
            </div>
          </div>

          {/* Relationship Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E4D6D6]">
            <h3 className="text-xl font-semibold text-[#702C3E] mb-4 pb-2 border-b border-[#E4D6D6]">Relationship Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableField
                label="Marital History"
                field="previously_married"
                value={isEditing ? editData?.previously_married : profileData?.previously_married}
                type="boolean"
              />
              <EditableField
                label="Has Children"
                field="has_children"
                value={isEditing ? editData?.has_children : profileData?.has_children}
                type="boolean"
              />
              <EditableField
                label="Open to Partner with Children"
                field="open_to_partner_with_children"
                value={isEditing ? editData?.open_to_partner_with_children : profileData?.open_to_partner_with_children}
                type="boolean"
              />
              <EditableField
                label="Living Situation"
                field="living_situation"
                value={isEditing ? editData?.living_situation : profileData?.living_situation}
                type="select"
                useRadioButtons={true}
              />
            </div>
          </div>

          {/* Relationship Preferences */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E4D6D6]">
            <h3 className="text-xl font-semibold text-[#702C3E] mb-4 pb-2 border-b border-[#E4D6D6]">Relationship Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isEditing ? (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-[#6B5B5B] font-medium">Preferred Age Range (Min)</label>
                    <input
                      type="number"
                      value={editData?.preferred_age_range_min || ''}
                      onChange={(e) => handleFieldChange('preferred_age_range_min', parseInt(e.target.value) || null)}
                      className="px-3 py-2 border border-[#E4D6D6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#702C3E] text-base text-[#2F2E2E]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-[#6B5B5B] font-medium">Preferred Age Range (Max)</label>
                    <input
                      type="number"
                      value={editData?.preferred_age_range_max || ''}
                      onChange={(e) => handleFieldChange('preferred_age_range_max', parseInt(e.target.value) || null)}
                      className="px-3 py-2 border border-[#E4D6D6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#702C3E] text-base text-[#2F2E2E]"
                    />
                  </div>
                </>
              ) : (
                (profileData.preferred_age_range_min || profileData.preferred_age_range_max) && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#6B5B5B] font-medium">Preferred Age Range</span>
                    <span className="text-base text-[#2F2E2E] font-semibold">
                      {profileData.preferred_age_range_min && profileData.preferred_age_range_max
                        ? `${profileData.preferred_age_range_min} - ${profileData.preferred_age_range_max} years`
                        : profileData.preferred_age_range_min
                        ? `${profileData.preferred_age_range_min}+ years`
                        : profileData.preferred_age_range_max
                        ? `Up to ${profileData.preferred_age_range_max} years`
                        : "Not specified"}
                    </span>
                  </div>
                )
              )}
              <EditableField
                label="Ideal Marriage Timeline"
                field="ideal_marriage_timeline"
                value={isEditing ? editData?.ideal_marriage_timeline : profileData?.ideal_marriage_timeline}
                type="select"
                useRadioButtons={true}
              />
              <EditableField
                label="Cultural Preference"
                field="prefer_own_background"
                value={isEditing ? editData?.prefer_own_background : profileData?.prefer_own_background}
                type="boolean"
              />
            </div>
          </div>

          {/* Lifestyle & Values */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E4D6D6]">
            <h3 className="text-xl font-semibold text-[#702C3E] mb-4 pb-2 border-b border-[#E4D6D6]">Lifestyle & Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableField
                label="Weekend Activities"
                field="weekend_activities"
                value={isEditing ? editData?.weekend_activities : profileData?.weekend_activities}
                type="select"
                useRadioButtons={true}
              />
              {isEditing ? (
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#6B5B5B] font-medium">Core Values (comma-separated)</label>
                  <input
                    type="text"
                    value={editData?.core_values?.join(', ') || ''}
                    onChange={(e) => handleArrayFieldChange('core_values', e.target.value.split(',').map(v => v.trim()).filter(v => v))}
                    className="px-3 py-2 border border-[#E4D6D6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#702C3E] text-base text-[#2F2E2E]"
                    placeholder="Honesty, Creativity, Stability"
                  />
                </div>
              ) : (
                profileData.core_values && profileData.core_values.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-[#6B5B5B] font-medium">Core Values</span>
                    <span className="text-base text-[#2F2E2E] font-semibold">{formatArray(profileData.core_values)}</span>
                  </div>
                )
              )}
              <EditableField
                label="Conflict Handling"
                field="conflict_handling"
                value={isEditing ? editData?.conflict_handling : profileData?.conflict_handling}
                type="select"
                useRadioButtons={true}
              />
              <EditableField
                label="Love Language"
                field="love_language"
                value={isEditing ? editData?.love_language : profileData?.love_language}
                type="select"
                useRadioButtons={true}
              />
            </div>
          </div>

          {/* Faith & Beliefs */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E4D6D6]">
            <h3 className="text-xl font-semibold text-[#702C3E] mb-4 pb-2 border-b border-[#E4D6D6]">Faith & Beliefs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableField
                label="Faith Importance"
                field="faith_importance"
                value={isEditing ? editData?.faith_importance : profileData?.faith_importance}
                type="select"
                useRadioButtons={true}
              />
              <EditableField
                label="Gender Roles in Marriage"
                field="gender_roles_in_marriage"
                value={isEditing ? editData?.gender_roles_in_marriage : profileData?.gender_roles_in_marriage}
                type="select"
                useRadioButtons={true}
              />
            </div>
          </div>

          {/* Personal Insights */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E4D6D6]">
            <h3 className="text-xl font-semibold text-[#702C3E] mb-4 pb-2 border-b border-[#E4D6D6]">Personal Insights</h3>
            <div className="space-y-4">
              <EditableField
                label="One Thing to Understand About Me"
                field="one_thing_to_understand"
                value={isEditing ? editData?.one_thing_to_understand : profileData?.one_thing_to_understand}
                type="textarea"
              />
              <EditableField
                label="Future Family Vision"
                field="future_family_vision"
                value={isEditing ? editData?.future_family_vision : profileData?.future_family_vision}
                type="textarea"
              />
              <EditableField
                label="Biggest Deal-Breaker"
                field="biggest_deal_breaker"
                value={isEditing ? editData?.biggest_deal_breaker : profileData?.biggest_deal_breaker}
                type="textarea"
              />
            </div>
          </div>

          {/* Emotional & Personality Evaluation */}
          {(isEditing || 
            profileData.emotional_balance || 
            profileData.conflict_emotional_response || 
            profileData.decision_making_guide ||
            profileData.preferred_emotional_energy ||
            profileData.feels_loved ||
            profileData.deep_connection ||
            profileData.confidence_moments ||
            profileData.show_love ||
            profileData.disagreement_response ||
            profileData.loved_one_upset_response ||
            profileData.refill_emotional_energy ||
            profileData.communication_style ||
            profileData.life_approach ||
            profileData.valued_relationship) ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E4D6D6]">
              <h3 className="text-xl font-semibold text-[#702C3E] mb-4 pb-2 border-b border-[#E4D6D6]">Emotional & Personality Evaluation</h3>
              <div className="space-y-6">
                {/* Emotional Series One */}
                {(isEditing || profileData.emotional_balance || profileData.conflict_emotional_response || profileData.decision_making_guide) && (
                  <div>
                    <h4 className="text-base font-semibold text-[#702C3E] mb-3">Emotional Balance & Decision Making</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <EditableField
                        label="Emotional Balance"
                        field="emotional_balance"
                        value={isEditing ? editData?.emotional_balance : profileData?.emotional_balance}
                        type="text"
                      />
                      <EditableField
                        label="Conflict Emotional Response"
                        field="conflict_emotional_response"
                        value={isEditing ? editData?.conflict_emotional_response : profileData?.conflict_emotional_response}
                        type="text"
                      />
                      <EditableField
                        label="Decision Making Guide"
                        field="decision_making_guide"
                        value={isEditing ? editData?.decision_making_guide : profileData?.decision_making_guide}
                        type="textarea"
                      />
                    </div>
                  </div>
                )}

                {/* Emotional Series Two */}
                {(isEditing || profileData.preferred_emotional_energy || profileData.feels_loved || profileData.deep_connection) && (
                  <div>
                    <h4 className="text-base font-semibold text-[#702C3E] mb-3">Emotional Energy & Connection</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <EditableField
                        label="Preferred Emotional Energy"
                        field="preferred_emotional_energy"
                        value={isEditing ? editData?.preferred_emotional_energy : profileData?.preferred_emotional_energy}
                        type="text"
                      />
                      <EditableField
                        label="Feels Loved When"
                        field="feels_loved"
                        value={isEditing ? editData?.feels_loved : profileData?.feels_loved}
                        type="text"
                      />
                      <EditableField
                        label="Deep Connection"
                        field="deep_connection"
                        value={isEditing ? editData?.deep_connection : profileData?.deep_connection}
                        type="textarea"
                      />
                    </div>
                  </div>
                )}

                {/* Emotional Series Three */}
                {(isEditing || profileData.confidence_moments || profileData.show_love) && (
                  <div>
                    <h4 className="text-base font-semibold text-[#702C3E] mb-3">Confidence & Love Expression</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <EditableField
                        label="Confidence Moments"
                        field="confidence_moments"
                        value={isEditing ? editData?.confidence_moments : profileData?.confidence_moments}
                        type="text"
                      />
                      <EditableField
                        label="Shows Love By"
                        field="show_love"
                        value={isEditing ? editData?.show_love : profileData?.show_love}
                        type="text"
                      />
                    </div>
                  </div>
                )}

                {/* Emotional Series Four */}
                {(isEditing || profileData.disagreement_response || profileData.loved_one_upset_response || profileData.refill_emotional_energy) && (
                  <div>
                    <h4 className="text-base font-semibold text-[#702C3E] mb-3">Conflict & Emotional Recovery</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <EditableField
                        label="Disagreement Response"
                        field="disagreement_response"
                        value={isEditing ? editData?.disagreement_response : profileData?.disagreement_response}
                        type="text"
                      />
                      <EditableField
                        label="When Loved One is Upset"
                        field="loved_one_upset_response"
                        value={isEditing ? editData?.loved_one_upset_response : profileData?.loved_one_upset_response}
                        type="text"
                      />
                      <EditableField
                        label="Refills Emotional Energy By"
                        field="refill_emotional_energy"
                        value={isEditing ? editData?.refill_emotional_energy : profileData?.refill_emotional_energy}
                        type="textarea"
                      />
                    </div>
                  </div>
                )}

                {/* Emotional Series Five */}
                {(isEditing || profileData.communication_style || profileData.life_approach || profileData.valued_relationship) && (
                  <div>
                    <h4 className="text-base font-semibold text-[#702C3E] mb-3">Communication & Relationship Values</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <EditableField
                        label="Communication Style"
                        field="communication_style"
                        value={isEditing ? editData?.communication_style : profileData?.communication_style}
                        type="text"
                      />
                      <EditableField
                        label="Life Approach"
                        field="life_approach"
                        value={isEditing ? editData?.life_approach : profileData?.life_approach}
                        type="text"
                      />
                      <EditableField
                        label="Most Valued in Relationship"
                        field="valued_relationship"
                        value={isEditing ? editData?.valued_relationship : profileData?.valued_relationship}
                        type="textarea"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E4D6D6]">
              <h3 className="text-xl font-semibold text-[#702C3E] mb-4 pb-2 border-b border-[#E4D6D6]">Emotional & Personality Evaluation</h3>
              <div className="text-center py-8">
                <p className="text-[#6B5B5B] text-base">Emotional evaluation data is not yet available.</p>
                <p className="text-[#6B5B5B] text-sm mt-2">Complete the emotional series questionnaires to see your evaluation here.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#6B5B5B] mt-6">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </section>
  );
}
