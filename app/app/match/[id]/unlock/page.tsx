"use client";

import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function UnlockPage({ params }: { params: { id: string } }) {
  // Initialize Google Translate
  useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on unlock page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  return (
    <main className="container mx-auto px-4 py-16 max-w-md relative">
      {/* Hidden Google Translate Element - must exist for translation to work */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}></div>
      
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <h1 className="text-2xl font-bold mb-4">Unlock Chat</h1>
      <p className="text-gray-600 mb-6">
        Pay to unlock a temporary chat window with your match.
      </p>
      <form className="space-y-4">
        {/* Stripe payment form will go here */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          Pay & Unlock
        </button>
      </form>
    </main>
  );
}

