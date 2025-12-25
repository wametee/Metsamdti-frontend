"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminRouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'superAdmin')[];
}

/**
 * Admin Route Guard Component
 * 
 * Protects admin-only routes and redirects unauthorized users
 * 
 * Usage:
 * <AdminRouteGuard>
 *   <AdminComponent />
 * </AdminRouteGuard>
 */
export default function AdminRouteGuard({ 
  children, 
  allowedRoles = ['admin', 'superAdmin'] 
}: AdminRouteGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, role } = useAuthGuard({
    redirectTo: '/dashboard',
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated && role) {
      // Check if user has required admin role
      // superAdmin always has access
      // admin has access if 'admin' is in allowedRoles
      const hasAdminAccess = 
        role === 'superAdmin' || 
        (role === 'admin' && allowedRoles.includes('admin'));

      if (!hasAdminAccess) {
        // Redirect to dashboard (user will see user dashboard)
        router.push('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, role, allowedRoles, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EDD4D3]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#702C3E] mx-auto"></div>
          <p className="mt-4 text-[#491A26]">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user has admin access
  if (!isAuthenticated || !role) {
    return null;
  }

  // superAdmin always has access
  // admin has access if 'admin' is in allowedRoles
  const hasAdminAccess = 
    role === 'superAdmin' || 
    (role === 'admin' && allowedRoles.includes('admin'));

  if (!hasAdminAccess) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}

