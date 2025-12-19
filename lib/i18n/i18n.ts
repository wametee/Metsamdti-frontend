import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import ti from './ti.json';
import sv from './sv.json';

const resources = {
  en: { translation: en },
  ti: { translation: ti },
  sv: { translation: sv },
};

// Export resources for direct access in fallback
export { resources };

// Initialize i18n immediately for SSR compatibility
// This ensures translations are available right away
if (!i18n.isInitialized) {
  if (typeof window !== 'undefined') {
    // Client-side: initialize with LanguageDetector
    i18n
      .use(initReactI18next)
      .use(LanguageDetector)
      .init({
        resources,
        fallbackLng: 'en',
        supportedLngs: ['en', 'sv', 'ti'],
        defaultNS: 'translation',
        lng: 'en',
        interpolation: { 
          escapeValue: false,
        },
        react: { 
          useSuspense: false,
          bindI18n: 'languageChanged loaded',
          bindI18nStore: 'added removed',
        },
        detection: {
          order: ['localStorage', 'navigator'],
          caches: ['localStorage'],
          lookupLocalStorage: 'language',
        },
        initImmediate: true, // Initialize immediately
      });
  } else {
    // Server-side: initialize without LanguageDetector
    i18n
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: 'en',
        supportedLngs: ['en', 'sv', 'ti'],
        defaultNS: 'translation',
        lng: 'en',
        interpolation: { 
          escapeValue: false,
        },
        react: { 
          useSuspense: false,
        },
        initImmediate: true, // Initialize immediately
      });
  }
}

export async function initI18n() {
  if (i18n.isInitialized) return i18n;
  
  // Ensure initialization
  if (!i18n.isInitialized) {
    await i18n
      .use(initReactI18next)
      .use(LanguageDetector)
      .init({
        resources,
        fallbackLng: 'en',
        supportedLngs: ['en', 'sv', 'ti'],
        defaultNS: 'translation',
        lng: 'en',
        interpolation: { 
          escapeValue: false,
        },
        react: { 
          useSuspense: false,
        },
        detection: {
          order: ['localStorage', 'navigator'],
          caches: ['localStorage'],
          lookupLocalStorage: 'language',
        },
      });
  }
  
  return i18n;
}

export default i18n;
