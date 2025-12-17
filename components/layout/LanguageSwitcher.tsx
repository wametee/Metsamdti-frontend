"use client";

import { useState, useEffect } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { initI18n } from '@/lib/i18n/i18n';
import i18n from 'i18next';

const LANG_LABEL: Record<string, string> = {
  en: 'English',
  sv: 'Swedish',
  ti: 'Tigrinya',
};

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // initialize i18n on client
    initI18n().then(() => {
      if (i18n.language && i18n.language !== language) {
        // keep provider and i18n in sync
        changeLanguage(i18n.language as any);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function select(lang: 'en' | 'sv' | 'ti') {
    changeLanguage(lang);
    i18n.changeLanguage(lang);
    setOpen(false);
  }

  return (
    <div className="relative">
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
        <div role="menu" className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-md z-50">
          {(['en', 'sv', 'ti'] as const).map((lng) => (
            <button
              key={lng}
              role="menuitem"
              onClick={() => select(lng)}
              className={`w-full text-left text-black px-4 py-2 hover:bg-[#F6E7EA] ${language === lng ? 'font-semibold' : ''}`}
            >
              {LANG_LABEL[lng]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
