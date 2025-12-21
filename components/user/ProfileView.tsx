"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import authService from "@/services/auth/authService";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import httpClient from "@/lib/httpClient";

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
          console.log('Questionnaire data:', result.profile.questionnaire_data);
          console.log('Background data:', result.profile.questionnaire_data?.background);
          console.log('Emotional data:', result.profile.questionnaire_data?.emotional);
          console.log('Emotional series keys:', Object.keys(result.profile.questionnaire_data?.emotional || {}));
          setProfileData(result.profile);
          setEditData(result.profile);
          // Initialize photos from existing profile
          if (result.profile.photos && result.profile.photos.length > 0) {
            const existingPhotoUrls = result.profile.photos
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .map((photo: any) => photo.url || photo.storage_key || '');
            setPhotoPreviews(existingPhotoUrls.filter((url: string) => url));
          }
        } else {
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
    setEditData(profileData);
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

  // Handle form field changes
  const handleFieldChange = (field: string, value: any) => {
    if (!editData) return;
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  // Handle array field changes (like languages, core_values)
  const handleArrayFieldChange = (field: string, value: string[]) => {
    if (!editData) return;
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  // Handle save
  const handleSave = async () => {
    if (!editData) return;

    try {
      setSaving(true);

      // Upload new photos first if any
      let uploadedPhotoUrls: string[] = [];
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
          uploadedPhotoUrls = uploadResponse.data.urls || uploadResponse.data.fileUrl?.map((f: any) => f.url) || [];
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
          // New uploaded photo
          if (uploadedPhotoUrls[uploadedIndex]) {
            photosData.push({
              url: uploadedPhotoUrls[uploadedIndex],
              order: index,
            });
            uploadedIndex++;
          }
        } else {
          // Existing photo - try to extract URL from preview or use existing photo data
          const existingPhoto = profileData?.photos?.find((p: any) => {
            const photoUrl = p.url || (p.storage_key ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${p.bucket || 'uploads'}/${p.storage_key}` : '');
            return photoUrl === preview || p.url === preview;
          });
          
          if (existingPhoto) {
            photosData.push({
              url: existingPhoto.url || preview,
              storage_key: existingPhoto.storage_key,
              bucket: existingPhoto.bucket,
              order: index,
            });
          } else {
            photosData.push({
              url: preview,
              order: index,
            });
          }
        }
      });

      // Prepare update data
      const { photos: _, ...profileUpdateData } = editData;
      const updateData = {
        ...profileUpdateData,
        photos: photosData,
      };

      const result = await authService.updateProfile(updateData);

      if (result.success && result.profile) {
        setProfileData(result.profile);
        setIsEditing(false);
        setEditPhotos([]);
        // Refresh photo previews
        if (result.profile.photos && result.profile.photos.length > 0) {
          const existingPhotoUrls = result.profile.photos
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
            .map((photo: any) => {
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
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Save error:', err);
      alert(err.message || 'Failed to update profile');
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

  // Helper component to render editable field
  const EditableField = ({ 
    label, 
    field, 
    value, 
    type = 'text',
    options,
    isArray = false,
  }: {
    label: string;
    field: string;
    value: any;
    type?: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'boolean';
    options?: string[];
    isArray?: boolean;
  }) => {
    if (isEditing) {
      if (type === 'textarea') {
        return (
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm text-[#6B5B5B] font-medium">{label}</label>
            <textarea
              value={value || ''}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="px-3 py-2 border border-[#E4D6D6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#702C3E] text-base text-[#2F2E2E]"
              rows={3}
            />
          </div>
        );
      }
      if (type === 'select' && options) {
        return (
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#6B5B5B] font-medium">{label}</label>
            <select
              value={value || ''}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="px-3 py-2 border border-[#E4D6D6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#702C3E] text-base text-[#2F2E2E] bg-white"
            >
              <option value="">Select...</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );
      }
      if (type === 'boolean') {
        return (
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#6B5B5B] font-medium">{label}</label>
            <select
              value={value === true ? 'Yes' : value === false ? 'No' : ''}
              onChange={(e) => handleFieldChange(field, e.target.value === 'Yes')}
              className="px-3 py-2 border border-[#E4D6D6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#702C3E] text-base text-[#2F2E2E] bg-white"
            >
              <option value="">Not specified</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        );
      }
      return (
        <div className="flex flex-col gap-1">
          <label className="text-sm text-[#6B5B5B] font-medium">{label}</label>
          <input
            type={type}
            value={value || ''}
            onChange={(e) => handleFieldChange(field, type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
            className="px-3 py-2 border border-[#E4D6D6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#702C3E] text-base text-[#2F2E2E]"
          />
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm text-[#6B5B5B] font-medium">{label}</span>
        <span className="text-base text-[#2F2E2E] font-semibold">
          {value !== null && value !== undefined ? String(value) : 'Not specified'}
        </span>
      </div>
    );
  };

  // Get display name or fallback
  const displayName = profileData?.display_name || "User";

  // Get photos - handle both storage_key and url formats
  const profilePhotos = profileData?.photos || [];
  const photoUrls = profilePhotos
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((photo) => {
      // If URL is already provided and is a valid URL, use it
      if (photo.url) {
        // Check if it's already a full URL
        if (photo.url.startsWith('http://') || photo.url.startsWith('https://')) {
          return photo.url;
        }
        // If it's a relative path, might need to construct full URL
      }
      
      // If storage_key is provided, construct Supabase public URL
      if (photo.storage_key) {
        const bucket = photo.bucket || 'uploads';
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        
        // Check if storage_key is already a full URL
        if (photo.storage_key.startsWith('http://') || photo.storage_key.startsWith('https://')) {
          return photo.storage_key;
        }
        
        // If we have Supabase URL, construct the public storage URL
        if (supabaseUrl) {
          // Ensure storage_key doesn't start with / and bucket is included in path
          const cleanStorageKey = photo.storage_key.startsWith('/') 
            ? photo.storage_key.slice(1) 
            : photo.storage_key;
          
          // Construct Supabase Storage public URL
          // Format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[key]
          try {
            const url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanStorageKey}`;
            // Validate URL
            new URL(url);
            return url;
          } catch (e) {
            console.warn('Failed to construct Supabase URL:', e);
          }
        }
        
        // Fallback: if no Supabase URL, try to use API endpoint
        // This assumes photos might be served from the backend
        let apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        // If no API URL is set, try to construct from current origin (for development)
        if (!apiUrl && typeof window !== 'undefined') {
          // Try to get API URL from current origin
          const origin = window.location.origin;
          // Replace port if it's 3000 (Next.js) with 3001 (backend)
          apiUrl = origin.replace(/:\d+$/, ':3001');
        }
        
        // Final fallback
        if (!apiUrl) {
          apiUrl = 'http://localhost:3001';
        }
        
        try {
          // Remove trailing slash if present
          const cleanApiUrl = apiUrl.replace(/\/$/, '');
          // Ensure storage_key doesn't have leading slash
          const cleanStorageKey = photo.storage_key.startsWith('/') 
            ? photo.storage_key.slice(1) 
            : photo.storage_key;
          const url = `${cleanApiUrl}/uploads/${cleanStorageKey}`;
          // Validate URL by creating URL object
          new URL(url);
          return url;
        } catch (e) {
          console.warn('Failed to construct API URL:', e, 'storage_key:', photo.storage_key, 'apiUrl:', apiUrl);
        }
        
        // Last resort: return null (will be filtered out)
        return null;
      }
      
      return null;
    })
    .filter((url): url is string => {
      // Filter out null/undefined and validate URL format
      if (!url || typeof url !== 'string') return false;
      
      // Check if it's a valid URL format
      if (url.startsWith('http://') || url.startsWith('https://')) {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      }
      
      // If it's a relative path starting with /, it's valid for Next.js
      if (url.startsWith('/')) {
        return true;
      }
      
      return false;
    });

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
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-2xl mx-auto">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-dashed border-[#E4D6D6] bg-white/50">
                  {photoPreviews[index] ? (
                    <>
                      <img
                        src={photoPreviews[index]}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handlePhotoRemove(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-[#E4D6D6]/30 transition">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoChange(e, index)}
                        ref={index === 0 ? fileInputRef : undefined}
                      />
                      <span className="text-[#702C3E] text-2xl">+</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          ) : (
            photoUrls.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-2xl mx-auto">
                {photoUrls.map((photoUrl, index) => {
                  const isLocalhost = photoUrl.includes('localhost') || photoUrl.includes('127.0.0.1');
                  return (
                    <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden border border-[#E4D6D6] shadow-sm hover:shadow-md transition-shadow">
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
                options={['Male', 'Female', 'Other']}
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
                type="text"
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
                options={['Alone', 'With family', 'With roommates', 'Other']}
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
                type="text"
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
                type="text"
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
                type="text"
              />
              <EditableField
                label="Love Language"
                field="love_language"
                value={isEditing ? editData?.love_language : profileData?.love_language}
                type="text"
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
                type="text"
              />
              <EditableField
                label="Gender Roles in Marriage"
                field="gender_roles_in_marriage"
                value={isEditing ? editData?.gender_roles_in_marriage : profileData?.gender_roles_in_marriage}
                type="text"
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
