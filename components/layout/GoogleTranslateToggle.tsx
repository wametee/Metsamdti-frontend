/**
 * GoogleTranslateToggle Component
 * Production-ready language switcher with stable state management
 */

"use client";
import { useState, useEffect, useRef } from 'react';
import { 
  changeLanguage, 
  getCurrentLanguage,
  languageDetails 
} from '@/lib/services/googleTranslateService';
import { FiGlobe } from 'react-icons/fi';

export default function GoogleTranslateToggle() {
  const [currentLang, setCurrentLang] = useState<'en' | 'sv' | 'ti'>('en');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize current language from multiple sources
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Get language from the most authoritative source
    const lang = getCurrentLanguage();
    setCurrentLang(lang);
  }, []);

  // Monitor Google Translate select field for changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateCurrentLang = () => {
      const lang = getCurrentLanguage();
      if (lang !== currentLang) {
        setCurrentLang(lang);
      }
    };

    // Check periodically
    const interval = setInterval(updateCurrentLang, 1000);

    // Also listen for changes on the select field
    const selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectField) {
      selectField.addEventListener('change', updateCurrentLang);
    }

    return () => {
      clearInterval(interval);
      if (selectField) {
        selectField.removeEventListener('change', updateCurrentLang);
      }
    };
  }, [currentLang]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleLanguageChange = (lang: 'en' | 'sv' | 'ti') => {
    if (lang === currentLang) {
      setOpen(false);
      return; // Already selected
    }
    
    setCurrentLang(lang);
    setOpen(false);
    changeLanguage(lang);
  };

  const languages: Array<'en' | 'sv' | 'ti'> = ['en', 'sv', 'ti'];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-[#EBD9D8] bg-white/90 hover:bg-white text-[#2F2E2E] transition-colors text-sm font-regular"
        aria-label="Change language"
        aria-expanded={open}
      >
        <FiGlobe className="w-4 h-4" />
        <span className="hidden sm:inline">{languageDetails[currentLang].nativeName}</span>
        <span className="sm:hidden">{languageDetails[currentLang].code.toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-[#EBD9D8] rounded-md shadow-lg z-50">
          <div className="py-1">
            {languages.map((lang) => {
              const details = languageDetails[lang];
              const isSelected = currentLang === lang;
              return (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F6E8EB] transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-[#F6E8EB] text-[#702C3E] font-semibold' : 'text-[#2F2E2E]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{details.name}</span>
                    <span className="text-xs text-gray-500">{details.nativeName}</span>
                  </div>
                  {isSelected && (
                    <svg className="w-4 h-4 text-[#702C3E]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
