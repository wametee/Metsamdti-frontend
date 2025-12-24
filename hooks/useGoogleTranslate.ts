/**
 * useGoogleTranslate Hook
 * Production-ready React hook for Google Translate integration
 * 
 * Features:
 * - Singleton pattern for styles
 * - Proper cleanup
 * - Error handling
 * - State synchronization
 */

"use client";
import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  initializeWithStandardGoogleScript, 
  restoreSavedLanguage 
} from '@/lib/services/googleTranslateService';

interface UseGoogleTranslateOptions {
  onInitialized?: () => void;
  onError?: (error: Error | string) => void;
  hideDefaultUI?: boolean;
}

// Singleton pattern for style element
let styleElementRef: HTMLStyleElement | null = null;
let styleRefCount = 0;

export const useGoogleTranslate = (options: UseGoogleTranslateOptions = {}) => {
  const { onInitialized, onError, hideDefaultUI = true } = options;
  const [isLoaded, setIsLoaded] = useState(false);
  const styleId = 'google-translate-hide-styles';
  const observerRef = useRef<MutationObserver | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Restore saved language BEFORE Google Translate loads
  // This ensures the cookie is set before GT reads it
  const restoreLanguage = useCallback(() => {
    if (typeof window === 'undefined') return;
    restoreSavedLanguage();
  }, []);

  // Apply styles to hide Google Translate UI
  const applyHideStyles = useCallback(() => {
    if (typeof document === 'undefined' || !hideDefaultUI) return;

    // Singleton pattern - only create style once
    if (styleElementRef && styleElementRef.parentNode === document.head) {
      styleRefCount++;
      return;
    }

    try {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .goog-te-banner-frame, .goog-te-balloon-frame, .goog-te-banner-frame.skiptranslate, 
        .skiptranslate, .goog-te-spinner-pos, .goog-te-spinner, .goog-te-banner, 
        .goog-te-menu-frame, .goog-te-menu-value, .goog-te-menu2, .goog-te-ftab, 
        .goog-te-ftab-link, #google_translate_element, .goog-te-combo {
          display: none !important; 
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          overflow: hidden !important;
          position: absolute !important;
          left: -9999px !important;
          border: none !important;
        }
        body {
          top: 0 !important; 
          margin-top: 0 !important;
          padding-top: 0 !important;
        }
        body.top { 
          top: 0 !important; 
        }
        iframe[src*="translate"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          border: none !important;
          position: absolute !important;
          left: -9999px !important;
        }
      `;
      
      if (document.head) {
        document.head.appendChild(style);
        styleElementRef = style;
        styleRefCount = 1;
      }
    } catch (e) {
      console.warn('[useGoogleTranslate] Failed to apply hide styles:', e);
    }
  }, [hideDefaultUI, styleId]);

  // Monitor and hide dynamically added Google Translate elements
  useEffect(() => {
    if (typeof document === 'undefined' || !hideDefaultUI) return;

    let timeoutId: NodeJS.Timeout | null = null;
    let isProcessing = false;

    const hideElements = () => {
      if (isProcessing) return;
      isProcessing = true;

      requestAnimationFrame(() => {
        const selectors = [
          '.goog-te-banner-frame', '.goog-te-balloon-frame', '.goog-te-banner', 
          '.skiptranslate', '.goog-te-spinner-pos', '.goog-te-spinner', 
          '.goog-te-menu-frame', '.goog-te-menu-value', '.goog-te-menu2', 
          '.goog-te-ftab', '.goog-te-ftab-link', '.goog-te-combo',
          'iframe[src*="translate"]'
        ];

        selectors.forEach(selector => {
          try {
            document.querySelectorAll(selector).forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              if (!htmlEl?.parentNode) return;
              
              // Skip React-managed #google_translate_element
              if (htmlEl.id === 'google_translate_element') return;
              
              // Hide Google Translate's own elements
              if (htmlEl.classList.contains('goog-te') ||
                  (htmlEl.tagName === 'IFRAME' && htmlEl.getAttribute('src')?.includes('translate'))) {
                htmlEl.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; height: 0 !important; width: 0 !important; overflow: hidden !important; position: absolute !important; left: -9999px !important; border: none !important;';
              }
            });
          } catch (e) {
            // Ignore errors
          }
        });

        // Fix body positioning
        if (document.body && (document.body.style.top !== '0px' || document.body.classList.contains('top'))) {
          document.body.style.top = '0';
          document.body.style.marginTop = '0';
          document.body.style.paddingTop = '0';
          document.body.classList.remove('top');
        }
        
        isProcessing = false;
      });
    };

    const debouncedHide = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(hideElements, 50);
    };

    hideElements(); // Run immediately

    const observer = new MutationObserver((mutations) => {
      const hasGoogleTranslateElement = mutations.some(mutation => {
        const target = mutation.target as HTMLElement;
        return target && (
          target.classList?.contains('goog-te') ||
          target.id === 'google_translate_element' ||
          target.querySelector?.('.goog-te') ||
          (target.tagName === 'IFRAME' && target.getAttribute('src')?.includes('translate'))
        );
      });
      if (hasGoogleTranslateElement) debouncedHide();
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    observerRef.current = observer;
    intervalRef.current = setInterval(hideElements, 2000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observerRef.current) {
        try {
          observerRef.current.disconnect();
        } catch (e) {
          // Ignore
        }
        observerRef.current = null;
      }
      if (intervalRef.current) {
        try {
          clearInterval(intervalRef.current);
        } catch (e) {
          // Ignore
        }
        intervalRef.current = null;
      }
    };
  }, [hideDefaultUI]);

  // Initialize Google Translate
  useEffect(() => {
    if (typeof window === 'undefined') return;
    isMountedRef.current = true;

    // Step 1: Restore saved language (sets cookie before GT loads)
    restoreLanguage();

    // Step 2: Apply hide styles
    applyHideStyles();

    // Step 3: Initialize Google Translate
    const initTranslate = async () => {
      if (!isMountedRef.current) return;
      
      try {
        await initializeWithStandardGoogleScript();
        
        if (isMountedRef.current) {
          setIsLoaded(true);
          onInitialized?.();
          console.log('[useGoogleTranslate] Initialized successfully');
        }
      } catch (error) {
        if (isMountedRef.current) {
          const err = error instanceof Error ? error : new Error(String(error));
          console.error('[useGoogleTranslate] Initialization error:', err);
          onError?.(err);
        }
      }
    };

    initTranslate();

    return () => {
      isMountedRef.current = false;
      
      // Cleanup style element (singleton pattern)
      styleRefCount = Math.max(0, styleRefCount - 1);
      
      if (styleRefCount <= 0 && styleElementRef) {
        try {
          if (styleElementRef.parentNode && document.head.contains(styleElementRef)) {
            document.head.removeChild(styleElementRef);
          }
          styleElementRef = null;
          styleRefCount = 0;
        } catch (e) {
          styleElementRef = null;
          styleRefCount = 0;
        }
      }
      
      // Cleanup observer and interval
      if (observerRef.current) {
        try {
          observerRef.current.disconnect();
        } catch (e) {
          // Ignore
        }
        observerRef.current = null;
      }
      
      if (intervalRef.current) {
        try {
          clearInterval(intervalRef.current);
        } catch (e) {
          // Ignore
        }
        intervalRef.current = null;
      }
    };
  }, [restoreLanguage, applyHideStyles, onInitialized, onError]);

  return { isLoaded };
};
