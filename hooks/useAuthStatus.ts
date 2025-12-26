"use client";

import { useState, useEffect } from 'react';
import { authService } from '@/services';
import { isSessionExpired } from '@/lib/utils/authUtils';

interface AuthStatus {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  role: 'users' | 'admin' | 'superAdmin' | null;
}

/**
 * Auth Status Hook
 * 
 * Checks authentication status without redirecting (for public pages)
 * Useful for conditional rendering based on auth state
 * 
 * Performance optimizations:
 * - Single API call per component mount
 * - Caches user data in component state
 * - Non-blocking (doesn't redirect)
 * 
 * Usage:
 * const { isAuthenticated, isLoading, user, role } = useAuthStatus();
 */
export function useAuthStatus(): AuthStatus {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    role: null,
  });

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // Fast check: token exists?
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          
          if (!token) {
            if (isMounted) {
              setAuthStatus({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                role: null,
              });
            }
            return;
          }

          // Check if session has expired (24 hours)
          if (isSessionExpired()) {
            // Session expired - clear everything
            authService.logout();
            
            if (isMounted) {
              setAuthStatus({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                role: null,
              });
            }
            return;
          }
        }

        // Verify token with backend (single API call)
        const result = await authService.getCurrentUser();

        if (!isMounted) return;

        if (!result.success || !result.user) {
          // Clear invalid token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
          }
          
          setAuthStatus({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            role: null,
          });
          return;
        }

        const user = result.user;
        const userRole = (user.role || 'users') as 'users' | 'admin' | 'superAdmin';

        // User is authenticated
        setAuthStatus({
          isAuthenticated: true,
          isLoading: false,
          user,
          role: userRole,
        });
      } catch (error) {
        console.error('Auth status check error:', error);
        
        if (isMounted) {
          setAuthStatus({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            role: null,
          });
          
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
          }
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return authStatus;
}






