"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services';
import { isSessionExpired, clearLoginTimestamp } from '@/lib/utils/authUtils';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requiredRole?: 'users' | 'admin' | 'superAdmin';
  allowRoles?: ('users' | 'admin' | 'superAdmin')[];
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  role: 'users' | 'admin' | 'superAdmin' | null;
}

/**
 * Auth Guard Hook
 * 
 * Scalable authentication guard for client-side route protection
 * 
 * Performance optimizations:
 * - Single API call per route load
 * - Caches user data in memory
 * - Non-blocking redirects
 * - Role-based access control
 * 
 * Usage:
 * const { isAuthenticated, isLoading, user, role } = useAuthGuard({
 *   requiredRole: 'admin',
 *   redirectTo: '/login'
 * });
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const {
    redirectTo = '/login',
    requiredRole,
    allowRoles,
  } = options;

  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    role: null,
  });

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // Check if token exists in localStorage (fast check)
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          
          if (!token) {
            if (isMounted) {
              setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                role: null,
              });
              router.push(redirectTo);
            }
            return;
          }

          // Check if session has expired (24 hours)
          if (isSessionExpired()) {
            // Session expired - clear everything and redirect
            authService.logout();
            clearLoginTimestamp();
            
            if (isMounted) {
              setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                role: null,
              });
              router.push(redirectTo);
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
          
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            role: null,
          });
          
          router.push(redirectTo);
          return;
        }

        const user = result.user;
        const userRole = (user.role || 'users') as 'users' | 'admin' | 'superAdmin';

        // Check role-based access
        if (requiredRole) {
          const hasRequiredRole = 
            userRole === requiredRole ||
            (requiredRole === 'admin' && (userRole === 'admin' || userRole === 'superAdmin')) ||
            userRole === 'superAdmin';

          if (!hasRequiredRole) {
            // Redirect to dashboard (user will see appropriate content based on role)
            router.push('/dashboard');
            return;
          }
        }

        // Check allowed roles
        if (allowRoles && allowRoles.length > 0) {
          if (!allowRoles.includes(userRole)) {
            const roleBasedRedirect = 
              userRole === 'admin' || userRole === 'superAdmin' 
                ? '/dashboard' 
                : '/dashboard';
            
            router.push(roleBasedRedirect);
            return;
          }
        }

        // User is authenticated and authorized
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user,
          role: userRole,
        });
      } catch (error) {
        console.error('Auth guard error:', error);
        
        if (isMounted) {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            role: null,
          });
          
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
          }
          
          router.push(redirectTo);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router, redirectTo, requiredRole, allowRoles]);

  return authState;
}


