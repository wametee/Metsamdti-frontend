"use client";

import { useState, useEffect, useRef } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { useLanguage } from '@/components/providers/LanguageProvider';

const LANG_LABEL: Record<string, string> = {
  en: 'English',
  sv: 'Swedish',
  ti: 'Tigrinya',
};

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  async function select(lang: 'en' | 'sv' | 'ti') {
    await changeLanguage(lang);
    setOpen(false);
    // Force a page refresh to ensure all components update
    // This is a fallback - ideally components should re-render via i18n events
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('languagechange'));
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 text-[#702C3E] text-sm px-3 py-1 rounded-md border border-transparent hover:bg-white/70 transition"
      >
        <span className="font-medium">{LANG_LABEL[language]}</span>
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
                language === lng 
                  ? 'font-semibold bg-[#F6E7EA] text-[#702C3E]' 
                  : 'text-gray-700'
              }`}
            >
              {LANG_LABEL[lng]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
