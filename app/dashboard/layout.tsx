"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect dashboard routes - require authentication
  const { isAuthenticated, isLoading } = useAuthGuard({
    redirectTo: '/login',
  });

  // Auto-logout after 24 hours
  useAutoLogout();

  // Show loading state while checking authentication
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

  // Don't render dashboard if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <DashboardHeader />
      {children}
    </DashboardLayout>
  );
}



