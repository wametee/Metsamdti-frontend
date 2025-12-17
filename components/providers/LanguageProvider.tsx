"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ti" | "sv";

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // lazy init i18n on client
    import('@/lib/i18n/i18n').then(({ initI18n, default: i18n }) => {
      initI18n().then(() => {
        const saved = localStorage.getItem('language') as Language | null;
        if (saved === 'en' || saved === 'ti' || saved === 'sv') {
          setLanguage(saved);
          i18n.changeLanguage(saved);
        } else if (i18n.language) {
          const lng = (i18n.language.split('-')[0] || 'en') as Language;
          setLanguage(lng);
          localStorage.setItem('language', lng);
        }
      });
    });
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    // also change i18n language if initialized
    import('i18next').then((i18n) => {
      if (i18n && typeof i18n.changeLanguage === 'function') {
        i18n.changeLanguage(lang);
      }
    });
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
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


