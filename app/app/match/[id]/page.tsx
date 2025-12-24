"use client";

import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function MatchPage({ params }: { params: { id: string } }) {
  // Initialize Google Translate
  useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on match page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  return (
    <main className="container mx-auto px-4 py-16 max-w-2xl relative">
      {/* Hidden Google Translate Element - must exist for translation to work */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}></div>
      
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <h1 className="text-2xl font-bold mb-4">You Have a Match!</h1>
      <div className="border rounded-lg p-6 mb-6">
        <div className="mb-4">
          <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto"></div>
        </div>
        <p className="text-gray-600 mb-4">
          Admin note: Why we think you're a good match...
        </p>
        <a
          href={`/app/match/${params.id}/unlock`}
          className="block w-full bg-blue-600 text-white py-3 rounded-lg text-center font-medium hover:bg-blue-700"
        >
          Unlock Chat
        </a>
      </div>
    </main>
  );
}

