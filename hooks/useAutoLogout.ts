"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services';
import { isSessionExpired, getRemainingSessionTime, clearLoginTimestamp } from '@/lib/utils/authUtils';
import { toast } from 'react-toastify';

/**
 * Auto Logout Hook
 * 
 * Automatically logs out user after 24 hours of inactivity
 * 
 * Features:
 * - Checks session expiration every minute
 * - Shows warning toast 5 minutes before expiration
 * - Automatically logs out when 24 hours have passed
 * - Cleans up on unmount
 * 
 * Usage:
 * Call this hook in your main layout or dashboard component
 */
export function useAutoLogout() {
  const router = useRouter();
  const warningShownRef = useRef(false);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check immediately on mount
    const checkSession = () => {
      if (isSessionExpired()) {
        // Session expired - logout immediately
        handleLogout();
        return;
      }

      // Check if we're within 5 minutes of expiration
      const remaining = getRemainingSessionTime();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (remaining <= fiveMinutes && remaining > 0 && !warningShownRef.current) {
        // Show warning toast
        const minutes = Math.ceil(remaining / (60 * 1000));
        toast.warning(
          `Your session will expire in ${minutes} minute${minutes !== 1 ? 's' : ''}. Please save your work.`,
          {
            position: "top-right",
            autoClose: 60000, // Show for 1 minute
            hideProgressBar: false,
          }
        );
        warningShownRef.current = true;
      }
    };

    // Check session immediately
    checkSession();

    // Set up interval to check every minute
    checkIntervalRef.current = setInterval(() => {
      checkSession();
    }, 60 * 1000); // Check every minute

    // Cleanup on unmount
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [router]);

  const handleLogout = () => {
    // Clear token and timestamp
    authService.logout();
    clearLoginTimestamp();

    // Show logout message
    toast.info("Your session has expired. Please log in again.", {
      position: "top-right",
      autoClose: 3000,
    });

    // Redirect to login
    router.push('/login');
  };

  return null; // This hook doesn't return anything, it just handles side effects
}

