"use client";
import { useEffect, useState, useCallback, useRef } from 'react';
import { initializeWithStandardGoogleScript } from '@/lib/services/googleTranslateService';

interface UseGoogleTranslateOptions {
  onInitialized?: () => void;
  onError?: (error: Error | string) => void;
  hideDefaultUI?: boolean;
}

// Singleton pattern for style element to avoid conflicts
let styleElementRef: HTMLStyleElement | null = null;
let styleRefCount = 0;

export const useGoogleTranslate = (options: UseGoogleTranslateOptions = {}) => {
  const { onInitialized, onError, hideDefaultUI = true } = options;
  const [isLoaded, setIsLoaded] = useState(false);
  const styleId = 'google-translate-hide-styles';
  const observerRef = useRef<MutationObserver | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Restore saved language from localStorage and set cookie BEFORE Google Translate loads
  // Optimized for Eritrean Tigrinya preference detection
  // Works regardless of user data state - language preference is independent
  const restoreSavedLanguage = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedLang = localStorage.getItem('google_translate_lang') as 'en' | 'sv' | 'ti' | null;
      const variant = localStorage.getItem('google_translate_variant');
      
      if (savedLang && ['en', 'sv', 'ti'].includes(savedLang)) {
        if (savedLang === 'en') {
          // For English, clear the cookie
          try {
            document.cookie = `googtrans=; path=/; max-age=0; SameSite=Lax`;
            document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
          } catch (error) {
            console.warn('Could not clear language cookie:', error);
          }
        } else {
          // For other languages, set the translation cookie
          const cookieValue = `/en/${savedLang}`;
          const domain = window.location.hostname;
          try {
            document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000; SameSite=Lax`;
            if (domain !== 'localhost' && !domain.includes('localhost')) {
              document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}; max-age=31536000; SameSite=Lax`;
              document.cookie = `googtrans=${cookieValue}; path=/; domain=.${domain}; max-age=31536000; SameSite=Lax`;
            }
            console.log('Restored language from localStorage:', savedLang);
            if (savedLang === 'ti' && variant === 'eritrean') {
              console.log('Eritrean Tigrinya preference detected and restored');
            }
          } catch (error) {
            // Cookie setting might fail in some contexts, but that's okay
            console.warn('Could not set language cookie, but language preference is saved:', error);
          }
        }
      }
    } catch (error) {
      // localStorage access might fail in some contexts, but that's okay
      // Language switching will still work via cookies
      console.warn('Could not restore language from localStorage:', error);
    }
  }, []);

  // Apply styles to hide Google Translate UI elements (singleton pattern)
  const applyHideStyles = useCallback(() => {
    if (typeof document === 'undefined' || !hideDefaultUI) return;

    // Use singleton pattern - only create style once
    if (styleElementRef && styleElementRef.parentNode === document.head) {
      styleRefCount++;
      return;
    }

    try {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Hide all Google Translate UI elements */
        .goog-te-banner-frame, .goog-te-balloon-frame, .goog-te-banner-frame.skiptranslate, .skiptranslate, .goog-te-spinner-pos, .goog-te-spinner, .goog-te-banner, .goog-te-menu-frame, .goog-te-menu-value, .goog-te-menu2, .goog-te-ftab, .goog-te-ftab-link, #google_translate_element, .goog-te-combo {
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
        /* Prevent body shift when translate banner appears */
        body {
          top: 0 !important; 
          margin-top: 0 !important;
          padding-top: 0 !important;
        }
        body.top { 
          top: 0 !important; 
        }
      /* Hide any iframes created by Google Translate */
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
      /* Ensure form elements are translatable - remove notranslate if present */
      form, form *, label, input, textarea, select, button, p, span, div:not(.notranslate) {
        /* Allow Google Translate to translate these elements */
      }
    `;
      if (document.head) {
        document.head.appendChild(style);
        styleElementRef = style;
        styleRefCount = 1;
      }
    } catch (e) {
      console.warn('Failed to apply Google Translate hide styles:', e);
    }
  }, [hideDefaultUI, styleId]);

  // Monitor and hide any dynamically added Google Translate elements (optimized)
  useEffect(() => {
    if (typeof document === 'undefined' || !hideDefaultUI) return;

    let timeoutId: NodeJS.Timeout | null = null;
    let isProcessing = false;

    const hideGoogleTranslateElements = () => {
      if (isProcessing) return;
      isProcessing = true;

      requestAnimationFrame(() => {
        const selectors = [
          '.goog-te-banner-frame', '.goog-te-balloon-frame', '.goog-te-banner', '.skiptranslate',
          '.goog-te-spinner-pos', '.goog-te-spinner', '.goog-te-menu-frame', '.goog-te-menu-value',
          '.goog-te-menu2', '.goog-te-ftab', '.goog-te-ftab-link', '#google_translate_element', '.goog-te-combo',
          'iframe[src*="translate"]'
        ];

        selectors.forEach(selector => {
          try {
            document.querySelectorAll(selector).forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              if (!htmlEl || !htmlEl.style || !htmlEl.parentNode) return;
              
              // Skip React-managed #google_translate_element - it's handled by React
              // Only hide Google Translate's dynamically created elements
              if (htmlEl.id === 'google_translate_element') {
                // Don't manipulate React-managed element
                return;
              }
              
              // Hide Google Translate's own elements
              if (htmlEl.classList.contains('goog-te') ||
                  (htmlEl.tagName === 'IFRAME' && htmlEl.getAttribute('src')?.includes('translate'))) {
                try {
                  htmlEl.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; height: 0 !important; width: 0 !important; overflow: hidden !important; position: absolute !important; left: -9999px !important; border: none !important;';
                } catch (e) {
                  // Element might have been removed by React
                }
              }
            });
          } catch (e) { 
            // Ignore errors - element might have been removed by React
          }
        });

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
      timeoutId = setTimeout(hideGoogleTranslateElements, 50);
    };

    hideGoogleTranslateElements(); // Run immediately

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
    intervalRef.current = setInterval(hideGoogleTranslateElements, 2000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observerRef.current) observerRef.current.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hideDefaultUI]);

  // Ensure form elements are translatable
  const ensureFormElementsTranslatable = useCallback(() => {
    if (typeof document === 'undefined') return;
    
    // Remove notranslate class from form elements to allow translation
    // Google Translate automatically translates text content, but we ensure forms are not blocked
    try {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        // Remove notranslate class if present
        if (form.classList.contains('notranslate')) {
          form.classList.remove('notranslate');
        }
        
        // Ensure form elements (labels, inputs, etc.) are translatable
        const formElements = form.querySelectorAll('label, input[placeholder], textarea[placeholder], button, p, span');
        formElements.forEach(el => {
          if (el.classList.contains('notranslate')) {
            el.classList.remove('notranslate');
          }
        });
      });
    } catch (e) {
      // Ignore errors
    }
  }, []);

  // Initialize Google Translate
  useEffect(() => {
    if (typeof window === 'undefined') return;
    isMountedRef.current = true;

    // Restore saved language before initializing
    restoreSavedLanguage();

    // Apply hide styles immediately
    applyHideStyles();

    // Ensure form elements are translatable
    ensureFormElementsTranslatable();

    // Initialize Google Translate (optimized for Eritrean Tigrinya)
    const initTranslate = async () => {
      if (!isMountedRef.current) return;
      
      try {
        await initializeWithStandardGoogleScript();
        if (isMountedRef.current) {
          setIsLoaded(true);
          // Ensure forms are translatable after initialization
          setTimeout(() => {
            ensureFormElementsTranslatable();
          }, 1000);
          onInitialized?.();
          console.log('Google Translate initialized successfully with Eritrean Tigrinya support');
        }
      } catch (error) {
        if (isMountedRef.current) {
          const err = error instanceof Error ? error : new Error(String(error));
          console.error('Failed to initialize Google Translate:', err);
          onError?.(err);
        }
      }
    };

    initTranslate();

    return () => {
      isMountedRef.current = false;
      
      // Decrement ref count for style element
      styleRefCount = Math.max(0, styleRefCount - 1);
      
      // Only remove style if no components are using it and it exists in DOM
      if (styleRefCount <= 0 && styleElementRef) {
        try {
          // Check if element still exists and has a parent before removing
          if (styleElementRef.parentNode && document.head.contains(styleElementRef)) {
            document.head.removeChild(styleElementRef);
          }
          styleElementRef = null;
          styleRefCount = 0;
        } catch (e) {
          // Element might have been removed by React or another process
          // Silently handle - this is expected in some cases
          styleElementRef = null;
          styleRefCount = 0;
        }
      }
      
      if (observerRef.current) {
        try {
          observerRef.current.disconnect();
        } catch (e) {
          // Ignore disconnect errors - observer might already be disconnected
        }
        observerRef.current = null;
      }
      
      if (intervalRef.current) {
        try {
          clearInterval(intervalRef.current);
        } catch (e) {
          // Ignore clear interval errors
        }
        intervalRef.current = null;
      }
    };
  }, [restoreSavedLanguage, applyHideStyles, ensureFormElementsTranslatable, onInitialized, onError, styleId]);

  return { isLoaded };
};


