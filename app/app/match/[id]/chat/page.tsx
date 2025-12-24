"use client";

import { useGoogleTranslate } from '@/hooks/useGoogleTranslate';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function ChatPage({ params }: { params: { id: string } }) {
  // Initialize Google Translate
  useGoogleTranslate({
    onInitialized: () => {
      console.log('Google Translate ready on chat page');
    },
    onError: (error) => {
      console.error('Google Translate initialization error:', error);
    },
  });

  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl relative">
      {/* Hidden Google Translate Element - must exist for translation to work */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}></div>
      
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="border rounded-lg h-96 flex flex-col">
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="font-semibold">Chat with Match</h2>
          <div className="text-sm text-gray-500">
            Time remaining: 2h 30m
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Chat messages will go here */}
          <p className="text-gray-500 text-center">No messages yet</p>
        </div>
        <div className="border-t p-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
    </main>
  );
}

