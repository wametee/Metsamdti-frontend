"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";
import { initI18n, resources } from "@/lib/i18n/i18n";
import i18n from "@/lib/i18n/i18n";

type Language = "en" | "ti" | "sv";

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => Promise<void>;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isReady, setIsReady] = useState(false);

  // Initialize i18n on mount
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        await initI18n();
        
        if (!mounted) return;

        // Get saved language or detect from browser
        const saved = localStorage.getItem('language') as Language | null;
        const detected = i18n.language?.split('-')[0] as Language;
        const initialLang = (saved && ['en', 'ti', 'sv'].includes(saved)) 
          ? saved 
          : (detected && ['en', 'ti', 'sv'].includes(detected))
          ? detected
          : 'en';

        // Set language in both state and i18n
        setLanguage(initialLang);
        await i18n.changeLanguage(initialLang);
        
        if (saved !== initialLang) {
          localStorage.setItem('language', initialLang);
        }

        setIsReady(true);

        // Listen for language changes from i18n
        i18n.on('languageChanged', (lng) => {
          const lang = lng.split('-')[0] as Language;
          if (['en', 'ti', 'sv'].includes(lang)) {
            setLanguage(lang);
            localStorage.setItem('language', lang);
          }
        });
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        setIsReady(true); // Still set ready to prevent blocking
      }
    };

    initialize();

    return () => {
      mounted = false;
      i18n.off('languageChanged');
    };
  }, []);

  const changeLanguage = useCallback(async (lang: Language) => {
    if (!['en', 'ti', 'sv'].includes(lang)) return;
    
    try {
      setLanguage(lang);
      localStorage.setItem('language', lang);
      await i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

/**
 * Combined hook that provides both language context and translation function
 * This is the recommended way to use translations in components
 * Automatically re-renders when language changes
 */
export function useAppTranslation() {
  const { language, changeLanguage, isReady } = useLanguage();
  
  // useTranslation automatically subscribes to language changes and re-renders
  // It will wait for i18n to be initialized
  const { t, i18n: i18nInstance, ready: i18nReady } = useI18nTranslation(undefined, {
    useSuspense: false, // Don't use suspense to avoid blocking
  });

  // Helper function to get translation from resources directly
  const getFallbackTranslation = (key: string, i18nInstance: any): string => {
    const lang = i18nInstance?.language || language || 'en';
    
    // Try to get from i18n store first
    const store = i18nInstance?.store;
    if (store) {
      const storeResources = store.data?.[lang]?.translation;
      if (storeResources) {
        const keys = key.split('.');
        let value: any = storeResources;
        for (const k of keys) {
          value = value?.[k];
          if (value === undefined) break;
        }
        if (typeof value === 'string') {
          return value;
        }
      }
    }
    
    // Fallback to direct resources access (imported at top)
    try {
      const langResources = (resources as any)[lang]?.translation;
      if (langResources) {
        const keys = key.split('.');
        let value: any = langResources;
        for (const k of keys) {
          value = value?.[k];
          if (value === undefined) break;
        }
        if (typeof value === 'string') {
          return value;
        }
      }
    } catch (e) {
      // Resources not available, continue to last resort
    }
    
    // Last resort: return the last part of the key
    return key.split('.').pop() || key;
  };

  // Create a safe translation function that always returns a string
  // If i18n is not ready, try to get translation from resources directly
  const safeT = (key: string, options?: any): string => {
    // Always try fallback first to ensure we get a translation
    const fallback = getFallbackTranslation(key, i18nInstance);
    
    // If i18n is initialized and ready, use the normal translation function
    if (i18nInstance.isInitialized && i18nReady) {
      const translation = t(key, options);
      // If translation returns the key (not found), use fallback
      if (typeof translation === 'string' && translation === key) {
        return fallback;
      }
      // Ensure we return a string
      return typeof translation === 'string' ? translation : String(translation);
    }
    
    // Fallback: use direct resources access
    return fallback;
  };

  return {
    t: safeT,
    language,
    changeLanguage,
    isReady: isReady && i18nReady && i18nInstance.isInitialized,
    i18n: i18nInstance,
  };
}


