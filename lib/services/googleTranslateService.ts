/**
 * Google Translate Service
 * Production-ready, stable implementation for three languages: English, Swedish, Tigrinya
 * 
 * Features:
 * - Robust cookie management across all domain variations
 * - Synchronized state between localStorage and cookies
 * - Proper initialization order handling
 * - Race condition prevention
 * - Comprehensive error handling
 */

export interface GoogleTranslateOptions {
  elementId: string;
  pageLanguage: string;
  includedLanguages: string;
  layout?: number;
  autoDisplay?: boolean;
  multilanguagePage?: boolean;
}

export type SupportedLanguage = 'en' | 'sv' | 'ti';

// Declare global types for Google Translate
declare global {
  interface Window {
    googleTranslateApiLoaded?: boolean;
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout?: number;
            autoDisplay?: boolean;
            multilanguagePage?: boolean;
          },
          elementId: string
        ) => void;
      } & {
        TranslateElement: {
          InlineLayout: {
            SIMPLE: number;
            HORIZONTAL: number;
            VERTICAL: number;
          };
        };
      };
    };
    translateAPI?: {
      translate: (text: string, options: { to: string }) => Promise<{ text: string }>;
    };
  }
}

// Constants
const COOKIE_NAME = 'googtrans';
const STORAGE_KEY = 'google_translate_lang';
const VARIANT_KEY = 'google_translate_variant';
const COOKIE_EXPIRY_DAYS = 365;
const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'sv', 'ti'];
const PAGE_LANGUAGE = 'en';

/**
 * Get all possible domain variations for cookie management
 */
function getAllDomainVariations(): string[] {
  if (typeof window === 'undefined') return [];
  
  const hostname = window.location.hostname;
  const baseDomain = hostname.replace(/^www\./, '');
  
  return [
    hostname,           // www.metsamdti.com
    `.${hostname}`,     // .www.metsamdti.com
    baseDomain,         // metsamdti.com
    `.${baseDomain}`,   // .metsamdti.com
  ].filter(dom => dom && dom !== 'localhost' && !dom.includes('localhost'));
}

/**
 * Delete a cookie across all domain variations
 */
function deleteCookieEverywhere(name: string): void {
  if (typeof document === 'undefined') return;
  
  const paths = ['/', window.location.pathname];
  const domains = getAllDomainVariations();
  const pastDate = 'Thu, 01 Jan 1970 00:00:00 GMT';
  
  paths.forEach(path => {
    // Delete without domain (current domain)
    document.cookie = `${name}=; path=${path}; expires=${pastDate}; SameSite=Lax`;
    document.cookie = `${name}=; path=${path}; max-age=0; SameSite=Lax`;
    
    // Delete with all domain variations
    domains.forEach(domain => {
      document.cookie = `${name}=; path=${path}; domain=${domain}; expires=${pastDate}; SameSite=Lax`;
      document.cookie = `${name}=; path=${path}; domain=${domain}; max-age=0; SameSite=Lax`;
    });
  });
}

/**
 * Set a cookie across all domain variations
 */
function setCookieEverywhere(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  
  const maxAge = COOKIE_EXPIRY_DAYS * 24 * 60 * 60; // Convert days to seconds
  const domains = getAllDomainVariations();
  
  // Set without domain (current domain)
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  
  // Set with all domain variations
  domains.forEach(domain => {
    document.cookie = `${name}=${value}; path=/; domain=${domain}; max-age=${maxAge}; SameSite=Lax`;
  });
}

/**
 * Get language from cookie - robust implementation
 */
export function getLanguageFromCookie(): SupportedLanguage | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(`${COOKIE_NAME}=`)) {
      const value = cookie.substring(COOKIE_NAME.length + 1);
      
      // Parse cookie value
      if (value === '/en/sv') return 'sv';
      if (value === '/en/ti') return 'ti';
      // Empty, deleted, or /en/en means English (original)
      if (value === '' || value === '/en' || value === '/en/en') return 'en';
    }
  }
  
  // No cookie found means English (original language)
  return 'en';
}

/**
 * Get current language from multiple sources (cookie, localStorage, select field)
 * Returns the most authoritative source
 */
export function getCurrentLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';
  
  // Priority 1: Check Google Translate select field (most accurate)
  try {
    const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectField?.value && SUPPORTED_LANGUAGES.includes(selectField.value as SupportedLanguage)) {
      return selectField.value as SupportedLanguage;
    }
  } catch (e) {
    // Ignore errors
  }
  
  // Priority 2: Check cookie
  const cookieLang = getLanguageFromCookie();
  if (cookieLang) return cookieLang;
  
  // Priority 3: Check localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored;
    }
  } catch (e) {
    // Ignore errors
  }
  
  // Default to English
  return 'en';
}

/**
 * Synchronize language state across all storage mechanisms
 */
function syncLanguageState(language: SupportedLanguage): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Update localStorage
    localStorage.setItem(STORAGE_KEY, language);
    
    // Update variant metadata for Tigrinya
    if (language === 'ti') {
      localStorage.setItem(VARIANT_KEY, 'eritrean');
    } else {
      localStorage.removeItem(VARIANT_KEY);
    }
    
    // Update cookies
    if (language === 'en') {
      // Delete all translation cookies for English
      deleteCookieEverywhere(COOKIE_NAME);
    } else {
      // Set translation cookie for other languages
      const cookieValue = `/en/${language}`;
      setCookieEverywhere(COOKIE_NAME, cookieValue);
    }
  } catch (error) {
    console.warn('[GoogleTranslate] Failed to sync language state:', error);
  }
}

/**
 * Initialize Google Translate element
 */
export function initializeGoogleTranslate(options: Partial<GoogleTranslateOptions> = {}): void {
  if (!window.google?.translate?.TranslateElement) {
    console.error('[GoogleTranslate] API not fully loaded');
    return;
  }

  const layout = window.google.translate.TranslateElement.InlineLayout?.SIMPLE || 0;
  
  const defaultOptions: GoogleTranslateOptions = {
    elementId: 'google_translate_element',
    pageLanguage: PAGE_LANGUAGE,
    includedLanguages: 'en,sv,ti',
    layout,
    autoDisplay: false,
    multilanguagePage: true,
    ...options,
  };

  // Ensure English is always included
  if (!defaultOptions.includedLanguages.includes('en')) {
    defaultOptions.includedLanguages = `en,${defaultOptions.includedLanguages}`;
  }

  try {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: defaultOptions.pageLanguage,
        includedLanguages: defaultOptions.includedLanguages,
        layout: defaultOptions.layout,
        autoDisplay: defaultOptions.autoDisplay,
        multilanguagePage: defaultOptions.multilanguagePage,
      },
      defaultOptions.elementId
    );
    
    console.log('[GoogleTranslate] Initialized with languages:', defaultOptions.includedLanguages);
  } catch (error) {
    console.error('[GoogleTranslate] Initialization error:', error);
    throw error;
  }
}

/**
 * Apply saved language after Google Translate initializes
 */
function applySavedLanguage(): void {
  const savedLang = getLanguageFromCookie();
  
  if (!savedLang || savedLang === 'en') {
    return; // English is default, no translation needed
  }
  
  // Wait for Google Translate to be fully ready
  const maxAttempts = 20;
  let attempts = 0;
  
  const tryApply = () => {
    attempts++;
    const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    
    if (selectField && selectField.options.length > 0) {
      // Select field is ready
      if (selectField.value !== savedLang) {
        selectField.value = savedLang;
        const changeEvent = new Event('change', { bubbles: true, cancelable: true });
        selectField.dispatchEvent(changeEvent);
        console.log('[GoogleTranslate] Applied saved language:', savedLang);
      }
    } else if (attempts < maxAttempts) {
      // Retry after short delay
      setTimeout(tryApply, 200);
    }
  };
  
  // Start trying after initial delay
  setTimeout(tryApply, 1000);
}

/**
 * Initialize Google Translate with standard script
 */
export function initializeWithStandardGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already initialized
    if (window.google?.translate && document.getElementById('google_translate_element')) {
      applySavedLanguage();
      resolve();
      return;
    }

    // Set up initialization callback
    window.googleTranslateElementInit = (): void => {
      const tryInitialize = () => {
        if (window.google?.translate?.TranslateElement) {
          try {
            initializeGoogleTranslate({
              elementId: 'google_translate_element',
              pageLanguage: PAGE_LANGUAGE,
              includedLanguages: 'en,sv,ti',
            });
            
            // Apply saved language after initialization
            applySavedLanguage();
            
            resolve();
          } catch (error) {
            reject(error);
          }
        } else {
          // Retry after short delay
          setTimeout(tryInitialize, 100);
        }
      };
      
      tryInitialize();
    };

    // Check if script already exists
    if (document.querySelector('script[src*="translate.google.com"]')) {
      let resolved = false;
      let attempts = 0;
      const maxAttempts = 50;
      
      const checkAndInit = () => {
        attempts++;
        if (window.google?.translate?.TranslateElement) {
          if (!resolved) {
            resolved = true;
            window.googleTranslateElementInit?.();
          }
        } else if (attempts < maxAttempts) {
          setTimeout(checkAndInit, 100);
        } else if (!resolved) {
          resolved = true;
          reject(new Error('Google Translate API not available after timeout'));
        }
      };
      
      checkAndInit();
    } else {
      // Load the script
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => reject(new Error('Failed to load Google Translate script'));
      document.body.appendChild(script);
    }
  });
}

/**
 * Change language - main entry point
 * Handles all state synchronization and ensures proper translation
 */
export function changeLanguage(
  languageCode: SupportedLanguage,
  onBeforeReload?: () => void
): void {
  console.log('[GoogleTranslate] Changing language to:', languageCode);
  
  // Validate language code
  if (!SUPPORTED_LANGUAGES.includes(languageCode)) {
    console.error('[GoogleTranslate] Unsupported language:', languageCode);
    return;
  }
  
  // Execute callback if provided
  if (onBeforeReload) {
    try {
      onBeforeReload();
    } catch (error) {
      console.warn('[GoogleTranslate] Callback error:', error);
    }
  }
  
  // Synchronize state across all storage mechanisms
  syncLanguageState(languageCode);
  
  // Try to update Google Translate select field if available
  if (window.google?.translate) {
    const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectField) {
      try {
        selectField.value = languageCode;
        const changeEvent = new Event('change', { bubbles: true, cancelable: true });
        selectField.dispatchEvent(changeEvent);
      } catch (error) {
        console.warn('[GoogleTranslate] Could not update select field:', error);
      }
    }
  }
  
  // Reload page to apply changes
  const reloadDelay = onBeforeReload ? 300 : 100;
  
  setTimeout(() => {
    if (languageCode === 'en') {
      // Hard reload for English to clear translation cache
      const url = new URL(window.location.href);
      url.searchParams.set('lang', 'en');
      url.searchParams.set('_', Date.now().toString());
      window.location.href = url.toString();
    } else {
      // Regular reload for other languages
      window.location.reload();
    }
  }, reloadDelay);
}

/**
 * Restore saved language from localStorage
 * Called before Google Translate initializes
 */
export function restoreSavedLanguage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const savedLang = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
    
    if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
      // Sync state (sets cookie before GT loads)
      syncLanguageState(savedLang);
      console.log('[GoogleTranslate] Restored language:', savedLang);
    } else {
      // No saved language, ensure English state
      syncLanguageState('en');
    }
  } catch (error) {
    console.warn('[GoogleTranslate] Failed to restore language:', error);
    // Fallback: ensure English state
    syncLanguageState('en');
  }
}

/**
 * Language details
 */
export const languageDetails = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  sv: { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  ti: { 
    code: 'ti', 
    name: 'Tigrinya (Eritrean)', 
    nativeName: 'ትግርኛ',
    script: 'Ethiopic',
    region: 'Eritrea'
  },
} as const;

/**
 * Check if language is supported
 */
export function isLanguageSupported(languageCode: string): languageCode is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(languageCode as SupportedLanguage);
}
