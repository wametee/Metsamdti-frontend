"use client";

import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function WaitingPage() {
  // Initialize Google Translate
  useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on waiting page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  return (
    <main className="container mx-auto px-4 py-16 text-center relative">
      {/* Hidden Google Translate Element - must exist for translation to work */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}></div>
      
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <h1 className="text-3xl font-bold mb-4">Awaiting Your Match</h1>
      <p className="text-lg text-gray-600 mb-8">
        We're carefully reviewing profiles to find your perfect match. You'll be
        notified as soon as we have a match for you.
      </p>
      <div className="text-gray-500 italic">
        "Good things come to those who wait..."
      </div>
    </main>
  );
}

