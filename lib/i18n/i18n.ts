import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import ti from './ti.json';
import sv from './sv.json';

const resources = {
  en: en,
  ti: ti,
  sv: sv,
};

export async function initI18n() {
  if ((i18n as any).isInitialized) return i18n;

  await i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources,
      fallbackLng: 'en',
      supportedLngs: ['en', 'sv', 'ti'],
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });

  return i18n;
}

export default i18n;
