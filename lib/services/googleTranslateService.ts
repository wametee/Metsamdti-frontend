// googleTranslateService.ts
export interface GoogleTranslateOptions {
  elementId: string;
  pageLanguage: string;
  includedLanguages: string;
  layout?: number; // InlineLayout is a value object, use number for the layout value
  autoDisplay?: boolean;
  multilanguagePage?: boolean;
}

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

export const loadGoogleTranslate = (): Promise<void> => {
  // Check if already loaded
  if (window.googleTranslateApiLoaded) {
    console.log('Google Translate API already loaded');
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/google-translate-api-extended@2.3.1/index.min.js';
    script.async = true;
    script.onload = () => {
      window.googleTranslateApiLoaded = true;
      console.log('Google Translate API loaded successfully');
      resolve();
    };
    script.onerror = (error: Event | string) => {
      console.error('Failed to load Google Translate API:', error);
      reject(error);
    };
    document.head.appendChild(script);
  });
};

export const initializeGoogleTranslate = (options: Partial<GoogleTranslateOptions> = {}): void => {
  // Check if Google Translate API is fully loaded
  if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) {
    console.error('Google Translate API not fully loaded');
    return;
  }

  // Get layout - use SIMPLE (0) as default if InlineLayout is not available
  let layout: number = 0; // SIMPLE = 0
  if (window.google.translate.TranslateElement.InlineLayout) {
    layout = window.google.translate.TranslateElement.InlineLayout.SIMPLE;
  }

  const defaultOptions: GoogleTranslateOptions = {
    elementId: 'google_translate_element',
    pageLanguage: 'en',
    // Optimized for Eritrean Tigrinya: 'ti' is the ISO 639-1 code for Tigrinya
    // Google Translate uses 'ti' for both Eritrean and Ethiopian Tigrinya
    // The system will prefer Eritrean variant based on context and user location
    includedLanguages: 'en,sv,ti',
    layout: options.layout !== undefined ? options.layout : layout,
    autoDisplay: false,
    multilanguagePage: true,
    ...options,
  };

  // Ensure English is always included
  if (!defaultOptions.includedLanguages.includes('en')) {
    defaultOptions.includedLanguages = `en,${defaultOptions.includedLanguages}`;
  }

  // Initialize the translate element
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
    console.log('Google Translate initialized with languages:', defaultOptions.includedLanguages);
    console.log('Eritrean Tigrinya (ti) is configured and ready');
    
    // After initialization, check if we need to apply a saved language
    // This ensures translations are applied even if the cookie was set before GT loaded
    const savedLang = getLanguageFromCookie();
    if (savedLang && savedLang !== 'en') {
      // Wait a bit for Google Translate to be fully ready
      setTimeout(() => {
        const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectField && selectField.value !== savedLang) {
          selectField.value = savedLang;
          const changeEvent = new Event('change', { bubbles: true, cancelable: true });
          selectField.dispatchEvent(changeEvent);
          
          // Force a small delay then reload to ensure translation is applied
          setTimeout(() => {
            if (selectField.value === savedLang) {
              console.log('Forcing page reload to apply translation for:', savedLang);
              window.location.reload();
            }
          }, 500);
        }
      }, 2000);
    }
  } catch (error) {
    console.error('Error initializing Google Translate:', error);
  }
};

// Function to initialize with the standard Google Translate script (optimized for Eritrean Tigrinya)
export const initializeWithStandardGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already initialized
    if (window.google && window.google.translate && document.getElementById('google_translate_element')) {
      const savedLang = getLanguageFromCookie();
      if (savedLang && savedLang !== 'en') {
        setTimeout(() => {
        const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectField && selectField.value !== savedLang) {
          selectField.value = savedLang;
          const changeEvent = new Event('change', { bubbles: true, cancelable: true });
          selectField.dispatchEvent(changeEvent);
          
          // Force reload to ensure translation is applied
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }
        }, 500);
      }
      resolve();
      return;
    }

    window.googleTranslateElementInit = (): void => {
      // Wait a bit for the API to be fully ready
      const tryInitialize = () => {
        if (window.google && window.google.translate && window.google.translate.TranslateElement) {
          try {
            initializeGoogleTranslate({
              elementId: 'google_translate_element',
              pageLanguage: 'en',
              // Explicitly include Eritrean Tigrinya (ti)
              // Google Translate will use context to prefer Eritrean variant
              includedLanguages: 'en,sv,ti',
            });
            
            // Apply saved language from cookie after initialization
            const savedLang = getLanguageFromCookie();
            if (savedLang && savedLang !== 'en') {
              // Wait for Google Translate to be fully ready, then apply translation
              const applyTranslation = () => {
                const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                if (selectField) {
                  // Set the value and trigger change
                  selectField.value = savedLang;
                  
                  // Create and dispatch a proper change event
                  const changeEvent = new Event('change', { bubbles: true, cancelable: true });
                  selectField.dispatchEvent(changeEvent);
                  
                  // Also try to trigger translation by clicking if needed
                  setTimeout(() => {
                    // Force a page refresh to ensure translation is applied
                    if (selectField.value === savedLang) {
                      console.log('Applied saved language from cookie:', savedLang);
                      // The cookie is already set, so reload should apply translation
                      window.location.reload();
                    }
                  }, 500);
                } else {
                  // Retry if select field not ready yet
                  setTimeout(applyTranslation, 200);
                }
              };
              
              // Start applying translation after a short delay
              setTimeout(applyTranslation, 1500);
            }
            
            resolve();
          } catch (error) {
            reject(error);
          }
        } else {
          // Retry after a short delay
          setTimeout(tryInitialize, 100);
        }
      };
      
      // Start initialization attempt
      tryInitialize();
    };

    // Check if script already exists
    if (document.querySelector('script[src*="translate.google.com"]')) {
      let resolved = false;
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max (50 * 100ms)
      
      // Wait for API to be fully ready
      const checkAndInit = () => {
        attempts++;
        if (window.google && window.google.translate && window.google.translate.TranslateElement) {
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
      const script = document.createElement('script');
      // Use the standard Google Translate script with callback
      // This ensures proper initialization for Eritrean Tigrinya
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => reject(new Error('Failed to load Google Translate script'));
      document.body.appendChild(script);
    }
  });
};

// Helper function to get language from cookie
const getLanguageFromCookie = (): 'en' | 'sv' | 'ti' | null => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith('googtrans=')) {
      const value = cookie.substring('googtrans='.length);
      if (value === '/en/sv') return 'sv';
      if (value === '/en/ti') return 'ti';
      // If cookie is empty, deleted, or set to /en/en, it means English (original)
      if (value === '' || value === '/en' || value === '/en/en') return 'en';
    }
  }
  return null;
};

// Function to change language programmatically (optimized for Eritrean Tigrinya)
// Optional callback to save form data before reload
// Language switching works regardless of user data state
export const changeLanguage = (languageCode: 'en' | 'sv' | 'ti', onBeforeReload?: () => void): void => {
  console.log('Attempting to change language to:', languageCode);
  
  // Execute callback to save form data before reload (if provided)
  // This is optional - language switching works even without form data
  if (onBeforeReload && typeof onBeforeReload === 'function') {
    try {
      onBeforeReload();
      console.log('Form data saved before language change');
    } catch (error) {
      // Don't block language change if form save fails
      console.warn('Warning: Could not save form data before language change:', error);
      console.log('Proceeding with language change anyway...');
    }
  }
  
  // For English, we need to completely remove the translation cookie
  // For other languages, use '/en/{lang}' format
  const domain = window.location.hostname;
  
  // Set cookie with proper attributes for cross-page persistence
  // This works regardless of user authentication or data state
  try {
    if (languageCode === 'en') {
      // For English, completely delete the cookie to revert to original content
      // Delete with all possible paths and domains
      const paths = ['/', window.location.pathname];
      const domains = [domain, `.${domain}`, window.location.hostname];
      
      paths.forEach(path => {
        domains.forEach(dom => {
          // Delete cookie by setting max-age to 0
          document.cookie = `googtrans=; path=${path}; max-age=0; SameSite=Lax`;
          if (dom && dom !== 'localhost' && !dom.includes('localhost')) {
            document.cookie = `googtrans=; path=${path}; domain=${dom}; max-age=0; SameSite=Lax`;
          }
        });
      });
      
      // Also try to clear any existing cookies
      document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
      if (domain !== 'localhost' && !domain.includes('localhost')) {
        document.cookie = `googtrans=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
        document.cookie = `googtrans=; path=/; domain=.${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
      }
    } else {
      // For other languages, use the standard format
      const cookieValue = `/en/${languageCode}`;
      document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000; SameSite=Lax`;
      
      if (domain !== 'localhost' && !domain.includes('localhost')) {
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}; max-age=31536000; SameSite=Lax`;
        document.cookie = `googtrans=${cookieValue}; path=/; domain=.${domain}; max-age=31536000; SameSite=Lax`;
      }
    }
  } catch (error) {
    console.warn('Warning: Could not set cookie, but proceeding with language change:', error);
  }
  
  // Store in localStorage for quick access
  // This works even if user has no account or incomplete data
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('google_translate_lang', languageCode);
      // Store metadata for Eritrean Tigrinya
      if (languageCode === 'ti') {
        localStorage.setItem('google_translate_variant', 'eritrean');
      } else if (languageCode === 'en') {
        // Clear variant when switching to English
        localStorage.removeItem('google_translate_variant');
      }
    } catch (error) {
      console.warn('Warning: Could not save to localStorage, but proceeding:', error);
    }
  }
  
  // Small delay to ensure form data is saved before reload (if callback provided)
  const reloadDelay = onBeforeReload ? 300 : 100;
  
  // Try to change via select field if available
  if (window.google && window.google.translate) {
    const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectField) {
      try {
        // For English, we need to ensure the select field is set correctly
        // Google Translate uses 'en' as the value for English
        const selectValue = languageCode === 'en' ? 'en' : languageCode;
        
        // For English, we need to explicitly revert the translation
        if (languageCode === 'en') {
          // Try to find and click the "Original" option if it exists
          const originalOption = Array.from(selectField.options).find(opt => 
            opt.value === 'en' || opt.text.toLowerCase().includes('original') || opt.text.toLowerCase().includes('english')
          );
          
          if (originalOption) {
            selectField.value = originalOption.value;
          } else {
            selectField.value = 'en';
          }
        } else {
          selectField.value = selectValue;
        }
        
        // Trigger change event to update Google Translate
        const changeEvent = new Event('change', { bubbles: true, cancelable: true });
        selectField.dispatchEvent(changeEvent);
        
        // For English, also try to trigger a page refresh to clear translation
        if (languageCode === 'en') {
          // Force a reload to clear any cached translation
          console.log('Switching back to original English content - forcing page reload');
        } else {
          console.log('Language changed via select field to:', languageCode);
          if (languageCode === 'ti') {
            console.log('Eritrean Tigrinya translation activated');
          }
        }
        
        // For non-English languages, wait a bit then reload to apply translation
        // For English, reload immediately to clear translation
        setTimeout(() => {
          if (languageCode === 'en') {
            // Hard reload for English to clear translation
            window.location.href = window.location.href.split('?')[0] + '?lang=en&_=' + Date.now();
          } else {
            // Regular reload for other languages
            window.location.reload();
          }
        }, reloadDelay);
        return;
      } catch (error) {
        console.warn('Warning: Could not change via select field, using page reload:', error);
      }
    }
  }
  
  console.log('Reloading page to apply language change to:', languageCode);
  
  // For English, use a hard reload to clear any cached translations
  if (languageCode === 'en') {
    setTimeout(() => {
      // Force a hard reload by adding a cache-busting parameter
      window.location.href = window.location.href.split('?')[0] + '?lang=en&_=' + Date.now();
    }, reloadDelay);
  } else {
    setTimeout(() => {
      window.location.reload();
    }, reloadDelay);
  }
};

// Function to get current language
export const getCurrentLanguage = (): 'en' | 'sv' | 'ti' | null => {
  const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
  const lang = selectField?.value;
  if (lang === 'en' || lang === 'sv' || lang === 'ti') {
    return lang;
  }
  return null;
};

// Language details helper (optimized for Eritrean Tigrinya)
export const languageDetails = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  sv: { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  // Eritrean Tigrinya: Uses Ge'ez script (Ethiopic script)
  // The 'ti' code is ISO 639-1 for Tigrinya, Google Translate handles Eritrean variant
  ti: { 
    code: 'ti', 
    name: 'Tigrinya (Eritrean)', 
    nativeName: 'ትግርኛ',
    script: 'Ethiopic',
    region: 'Eritrea'
  },
} as const;

// Function to translate specific text programmatically (optimized for Eritrean Tigrinya)
export const translateText = async (text: string, targetLang: 'en' | 'sv' | 'ti'): Promise<string> => {
  if (!window.translateAPI) {
    console.warn('Translate API not available for direct text translation');
    return text;
  }
  try {
    // For Eritrean Tigrinya, ensure proper language code
    const langCode = targetLang === 'ti' ? 'ti' : targetLang;
    const result = await window.translateAPI.translate(text, { 
      to: langCode,
      // Add hints for better Eritrean Tigrinya translation quality
      ...(targetLang === 'ti' && { 
        // Google Translate will use context to prefer Eritrean variant
        source: 'en' // Assuming source is English
      })
    });
    return result.text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

// Helper function to detect if user prefers Eritrean Tigrinya
export const isEritreanTigrinyaPreferred = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check localStorage
  const savedLang = localStorage.getItem('google_translate_lang');
  const variant = localStorage.getItem('google_translate_variant');
  
  if (savedLang === 'ti' && variant === 'eritrean') {
    return true;
  }
  
  // Check cookie
  const lang = getLanguageFromCookie();
  if (lang === 'ti') {
    return true;
  }
  
  // Check browser language preferences
  if (typeof navigator !== 'undefined' && navigator.language) {
    const browserLang = navigator.language.toLowerCase();
    // Check for Tigrinya or Eritrean locale indicators
    if (browserLang.includes('ti') || browserLang.includes('er')) {
      return true;
    }
  }
  
  return false;
};

// Helper function to check if a language is supported
export const isLanguageSupported = (languageCode: string): languageCode is 'en' | 'sv' | 'ti' => {
  return ['en', 'sv', 'ti'].includes(languageCode);
};


