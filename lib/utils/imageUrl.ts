/**
 * Utility functions for constructing image URLs from storage keys
 * Handles both Supabase Storage (production) and local backend (development)
 */

interface ImageUrlOptions {
  storage_key?: string;
  url?: string;
  bucket?: string;
}

/**
 * Constructs a valid image URL from storage information
 * 
 * Priority:
 * 1. If `url` is provided and is a valid URL, use it directly
 * 2. If `storage_key` is provided:
 *    - For Supabase (production): Construct Supabase Storage public URL
 *    - For local backend (development): Construct local API URL
 * 
 * @param photo - Photo object with storage_key, url, and/or bucket
 * @returns Valid image URL or null if construction fails
 */
export function getImageUrl(photo: ImageUrlOptions): string | null {
  // Priority 1: Use provided URL if it's already a valid URL
  if (photo.url) {
    try {
      const url = new URL(photo.url);
      // If it's a valid URL, use it
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return photo.url;
      }
    } catch {
      // Not a valid URL, continue to construct from storage_key
    }
  }

  // Priority 2: Construct from storage_key
  if (!photo.storage_key) {
    return null;
  }

  const storageKey = photo.storage_key;
  const bucket = photo.bucket || 'uploads';

  // Check if storage_key is already a full URL
  if (storageKey.startsWith('http://') || storageKey.startsWith('https://')) {
    try {
      new URL(storageKey);
      return storageKey;
    } catch {
      // Invalid URL format, continue
    }
  }

  // Check if we should use Supabase Storage (production) or local storage (development)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  // Determine if this is a Supabase URL (not localhost)
  const isSupabaseStorage = supabaseUrl && !supabaseUrl.includes('localhost') && !supabaseUrl.includes('127.0.0.1');
  
  if (isSupabaseStorage) {
    try {
      // Clean storage_key: remove leading/trailing slashes
      let cleanKey = storageKey.trim();
      
      // Remove leading slash
      if (cleanKey.startsWith('/')) {
        cleanKey = cleanKey.slice(1);
      }
      
      // Remove trailing slash
      if (cleanKey.endsWith('/')) {
        cleanKey = cleanKey.slice(0, -1);
      }
      
      // IMPORTANT: Files are uploaded to Supabase with path "public/filename.jpg"
      // The storage_key should preserve this path structure
      // DO NOT remove 'public/' prefix - it's part of the actual file path in Supabase
      
      // Remove bucket name if it's in the key (e.g., "uploads/public/filename.jpg" -> "public/filename.jpg")
      if (cleanKey.startsWith(`${bucket}/`)) {
        cleanKey = cleanKey.replace(new RegExp(`^${bucket}/`), '');
      }
      
      // If storage_key doesn't start with 'public/', add it
      // This ensures compatibility with files uploaded via file-uploads.ts
      // which uploads to path "public/filename.jpg"
      if (!cleanKey.startsWith('public/')) {
        cleanKey = `public/${cleanKey}`;
      }
      
      // Construct Supabase Storage public URL
      // Format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
      // Where [path] includes "public/" prefix if that's how the file was uploaded
      const url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanKey}`;
      
      // Validate URL
      new URL(url);
      return url;
    } catch (e) {
      console.warn('[imageUrl] Failed to construct Supabase URL:', e, {
        storage_key: storageKey,
        bucket,
        supabaseUrl
      });
    }
  }

  // Fallback: Local backend URL (development)
  let apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // If no API URL is set, try to construct from current origin (for development)
  if (!apiUrl && typeof window !== 'undefined') {
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
    
    // Clean storage_key for localhost:
    // - Remove leading/trailing slashes
    // - Remove 'public/' prefix (not used in local storage paths)
    // - Remove bucket name if present (e.g., "uploads/filename.jpg" -> "filename.jpg")
    // - Final result should be just the filename
    let cleanKey = storageKey.trim();
    if (cleanKey.startsWith('/')) {
      cleanKey = cleanKey.slice(1);
    }
    if (cleanKey.endsWith('/')) {
      cleanKey = cleanKey.slice(0, -1);
    }
    // Remove 'public/' prefix for local URLs (not used in local storage)
    if (cleanKey.startsWith('public/')) {
      cleanKey = cleanKey.replace(/^public\//, '');
    }
    // Remove bucket name if present (e.g., "uploads/filename.jpg" -> "filename.jpg")
    if (cleanKey.startsWith(`${bucket}/`)) {
      cleanKey = cleanKey.replace(new RegExp(`^${bucket}/`), '');
    }
    // Remove any remaining "uploads/" prefix
    if (cleanKey.startsWith('uploads/')) {
      cleanKey = cleanKey.replace(/^uploads\//, '');
    }
    
    // Local storage URL format: http://localhost:3001/uploads/filename.jpg
    const url = `${cleanApiUrl}/uploads/${cleanKey}`;
    
    // Validate URL
    new URL(url);
    return url;
  } catch (e) {
    console.warn('[imageUrl] Failed to construct API URL:', e, {
      storage_key: storageKey,
      apiUrl
    });
  }
  
  return null;
}

/**
 * Checks if an image URL is from localhost (development)
 */
export function isLocalImage(url: string): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'localhost' || 
           urlObj.hostname === '127.0.0.1' ||
           urlObj.hostname.includes('localhost');
  } catch {
    return url.includes('localhost') || url.includes('127.0.0.1');
  }
}

/**
 * Extracts storage_key and bucket from a URL
 * Useful when processing uploaded images
 * 
 * @param url - Image URL (Supabase Storage or local)
 * @returns Object with storage_key and bucket, or null if extraction fails
 */
export function extractStorageInfo(url: string): { storage_key: string; bucket: string } | null {
  return extractStorageKeyFromUrl(url);
}

/**
 * Extracts storage_key from a Supabase Storage URL
 * Useful for saving storage_key when we only have the URL
 */
export function extractStorageKeyFromUrl(url: string): { storage_key: string; bucket: string } | null {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    
    // Supabase Storage URL format: /storage/v1/object/public/[bucket]/[key]
    const supabaseMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/);
    if (supabaseMatch) {
      const bucket = supabaseMatch[1];
      let key = supabaseMatch[2];
      
      // Remove 'public/' prefix if present in the key
      if (key.startsWith('public/')) {
        key = key.replace(/^public\//, '');
      }
      
      return {
        storage_key: key,
        bucket
      };
    }
    
    // Local uploads URL format: /uploads/[filename]
    const uploadsMatch = urlObj.pathname.match(/\/uploads\/(.+)$/);
    if (uploadsMatch) {
      return {
        storage_key: uploadsMatch[1],
        bucket: 'uploads'
      };
    }
    
    return null;
  } catch {
    return null;
  }
}
