"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import Matches from "@/components/dashboard/Matches";
import AdminMatches from "@/components/dashboard/AdminMatches";

export default function MatchesPage() {
  const { user, isLoading } = useAuthGuard({ allowRoles: ['users', 'admin', 'superAdmin'] });

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#702C3E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show AdminMatches for admins, regular Matches for users
  if (user && (user.role === 'admin' || user.role === 'superAdmin')) {
    return <AdminMatches />;
  }

  return <Matches />;
}

