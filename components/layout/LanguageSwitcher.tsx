"use client";

import { useState, useEffect, useRef } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { changeLanguage, getCurrentLanguage, languageDetails } from '@/lib/services/googleTranslateService';

const LANG_LABEL: Record<string, string> = {
  en: 'English',
  sv: 'Swedish',
  ti: 'Tigrinya',
};

interface LanguageSwitcherProps {
  onBeforeLanguageChange?: () => void;
}

export default function LanguageSwitcher({ onBeforeLanguageChange }: LanguageSwitcherProps = {}) {
  const [currentLang, setCurrentLang] = useState<'en' | 'sv' | 'ti'>('en');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize from localStorage or cookie on client side only
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const getInitialLanguage = (): 'en' | 'sv' | 'ti' => {
      const saved = localStorage.getItem('google_translate_lang') as 'en' | 'sv' | 'ti' | null;
      if (saved && ['en', 'sv', 'ti'].includes(saved)) {
        return saved;
      }
      
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith('googtrans=')) {
          const value = cookie.substring('googtrans='.length);
          if (value === '/en/sv') return 'sv';
          if (value === '/en/ti') return 'ti';
          if (value === '' || value === '/en') return 'en';
        }
      }
      return 'en';
    };
    setCurrentLang(getInitialLanguage());
  }, []);

  // Monitor language changes from Google Translate
  useEffect(() => {
    const checkLanguage = () => {
      const lang = getCurrentLanguage();
      if (lang && lang !== currentLang) {
        setCurrentLang(lang);
      }
    };

    let checkInterval: NodeJS.Timeout | null = null;
    let fallbackInterval: NodeJS.Timeout | null = null;
    let selectField: HTMLSelectElement | null = null;
    let observer: MutationObserver | null = null;

    const waitForGoogleTranslate = () => {
      const maxAttempts = 20;
      let attempts = 0;
      
      checkInterval = setInterval(() => {
        attempts++;
        selectField = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        
        if (selectField) {
          if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
          }
          checkLanguage();
          
          selectField.addEventListener('change', checkLanguage);
          
          observer = new MutationObserver(() => {
            checkLanguage();
          });
          
          observer.observe(selectField, { attributes: true, attributeFilter: ['value'] });
          
          fallbackInterval = setInterval(checkLanguage, 1000);
        } else if (attempts >= maxAttempts) {
          if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
          }
        }
      }, 200);
    };

    waitForGoogleTranslate();

    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
      if (selectField) {
        selectField.removeEventListener('change', checkLanguage);
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, [currentLang]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  function select(lang: 'en' | 'sv' | 'ti') {
    // Language switching always works, regardless of user data state
    // Save form data before language change (if callback provided)
    // This is optional - language change proceeds even if callback fails
    try {
      if (onBeforeLanguageChange) {
        onBeforeLanguageChange();
      }
    } catch (error) {
      // Don't block language change if form save fails
      console.warn('Could not save form data, but proceeding with language change:', error);
    }
    
    // Always proceed with language change
    changeLanguage(lang, onBeforeLanguageChange);
    setCurrentLang(lang);
    setOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 text-[#702C3E] text-sm px-3 py-1 rounded-md border border-transparent hover:bg-white/70 transition"
      >
        <span className="font-medium">{LANG_LABEL[currentLang]}</span>
        <RiArrowDropDownLine className="w-5 h-5" />
      </button>

      {open && (
        <div 
          role="menu" 
          className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 border border-gray-200"
        >
          {(['en', 'sv', 'ti'] as const).map((lng) => (
            <button
              key={lng}
              role="menuitem"
              onClick={() => select(lng)}
              className={`w-full text-left px-4 py-2 hover:bg-[#F6E7EA] transition-colors first:rounded-t-md last:rounded-b-md ${
                currentLang === lng 
                  ? 'font-semibold bg-[#F6E7EA] text-[#702C3E]' 
                  : 'text-gray-700'
              }`}
            >
              {LANG_LABEL[lng]}
              {currentLang === lng && (
                <span className="ml-2 text-[#702C3E]">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
