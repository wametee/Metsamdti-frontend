"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useEffect, useState, useRef } from "react";
import { getAdminDashboardStats, type AdminDashboardStats } from "@/lib/api/admin";
import { getUserDashboardStats, type UserDashboardStats } from "@/lib/api/auth";

export default function Dashboard() {
  const { user, role, isLoading: authLoading } = useAuthGuard({ allowRoles: ['users', 'admin', 'superAdmin'] });
  const [adminStats, setAdminStats] = useState<AdminDashboardStats | null>(null);
  const [userStats, setUserStats] = useState<UserDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      // Don't fetch if auth is still loading
      if (authLoading) {
        return;
      }

      // If auth is done but no user/role, don't fetch (redirect will happen)
      if (!user || !role) {
        setLoading(false);
        hasFetchedRef.current = false;
        userIdRef.current = null;
        return;
      }

      // Get stable user ID for comparison
      const userId = user.id || user.user_id || null;

      // If we've already fetched for this user, don't fetch again
      if (hasFetchedRef.current && userIdRef.current === userId) {
        return;
      }

      // Mark as fetching
      hasFetchedRef.current = true;
      userIdRef.current = userId;
      setLoading(true);

      try {
        if (role === 'admin' || role === 'superAdmin') {
          const result = await getAdminDashboardStats();
          if (result.success && result.stats) {
            setAdminStats(result.stats);
          } else {
            setAdminStats(null);
          }
        } else {
          const result = await getUserDashboardStats();
          if (result.success && result.stats) {
            setUserStats(result.stats);
          } else {
            setUserStats(null);
          }
        }
      } catch (error) {
        console.error('[Dashboard] Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authLoading, user?.id || user?.user_id, role]);

  // Show loading while auth is checking or stats are loading
  if (authLoading) {
    return (
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#702C3E]"></div>
          <p className="ml-3 text-[#702C3E] font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#702C3E]"></div>
          <p className="ml-3 text-[#702C3E] font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (role === 'admin' || role === 'superAdmin') {
    const stats = adminStats || {
      scheduledInterviews: 0,
      weeklyNewUsers: 0,
      totalEarned: 0,
      totalMatches: 0,
      successfulMatches: 0,
      matchSuccessRate: 0,
      completedProfiles: 0,
      incompleteProfiles: 0,
      flaggedProfiles: 0,
      pendingApprovalProfiles: 0,
      maleUsers: 0,
      femaleUsers: 0,
      ageGroups: {},
    };

    const totalUsers = stats.maleUsers + stats.femaleUsers;
    const malePercentage = totalUsers > 0 ? Math.round((stats.maleUsers / totalUsers) * 100) : 0;
    const femalePercentage = totalUsers > 0 ? Math.round((stats.femaleUsers / totalUsers) * 100) : 0;

    // Process age groups
    const ageGroup20_30 = stats.ageGroups['20-30'] || { count: 0, percentage: 0 };
    const ageGroup31_70 = {
      count: (stats.ageGroups['31-40']?.count || 0) + 
             (stats.ageGroups['41-50']?.count || 0) + 
             (stats.ageGroups['51-60']?.count || 0) + 
             (stats.ageGroups['61-70']?.count || 0) + 
             (stats.ageGroups['31-70']?.count || 0),
      percentage: (stats.ageGroups['31-40']?.percentage || 0) + 
                  (stats.ageGroups['41-50']?.percentage || 0) + 
                  (stats.ageGroups['51-60']?.percentage || 0) + 
                  (stats.ageGroups['61-70']?.percentage || 0) + 
                  (stats.ageGroups['31-70']?.percentage || 0),
    };

    return (
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#702C3E] mb-4 sm:mb-6">Dashboard</h1>
        
        <>
        
            {/* Admin Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
                <h3 className="text-sm font-medium mb-2">Scheduled Interviews</h3>
                <p className="text-2xl sm:text-3xl font-bold">{stats.scheduledInterviews}</p>
              </div>
              <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
                <h3 className="text-sm font-medium mb-2">This week's New Users</h3>
                <p className="text-2xl sm:text-3xl font-bold">{stats.weeklyNewUsers}</p>
              </div>
              <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
                <h3 className="text-sm font-medium mb-2">This week's New Users</h3>
                <p className="text-2xl sm:text-3xl font-bold">{stats.weeklyNewUsers}</p>
              </div>
              <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
                <h3 className="text-sm font-medium mb-2">Total Earned</h3>
                <p className="text-2xl sm:text-3xl font-bold">${stats.totalEarned.toLocaleString()}</p>
              </div>
            </div>

            {/* First Row: Match Analytics & User Profiles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Match Analytics */}
              <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E6DADA]">
                <h2 className="text-lg sm:text-xl font-semibold text-[#702C3E] mb-4">Match Analytics</h2>
                <div className="flex items-center gap-6">
                  {/* Donut Chart */}
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#F6E7EA"
                        strokeWidth="8"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#702C3E"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - stats.matchSuccessRate / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#702C3E]">{Math.round(stats.matchSuccessRate)}%</p>
                        <p className="text-xs text-[#5A4A4A] font-medium">Success</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-[#F6E7EA] rounded"></div>
                      <div>
                        <p className="text-sm text-[#5A4A4A] font-medium">Total Matches</p>
                        <p className="text-lg font-bold text-[#702C3E]">{stats.totalMatches}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-[#702C3E] rounded"></div>
                      <div>
                        <p className="text-sm text-[#5A4A4A] font-medium">Successful Matches</p>
                        <p className="text-lg font-bold text-[#702C3E]">{stats.successfulMatches}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Profiles */}
              <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E6DADA]">
                <h2 className="text-lg sm:text-xl font-semibold text-[#702C3E] mb-4">User Profiles</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#5A4A4A] font-medium">Completed</span>
                    <span className="text-sm font-semibold text-[#702C3E]">{stats.completedProfiles}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#5A4A4A] font-medium">Incompleted</span>
                    <span className="text-sm font-semibold text-[#702C3E]">{stats.incompleteProfiles}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#5A4A4A] font-medium">Flagged</span>
                    <span className="text-sm font-semibold text-[#702C3E]">{stats.flaggedProfiles}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#5A4A4A] font-medium">Awaiting Approval</span>
                    <span className="text-sm font-semibold text-[#702C3E]">{stats.pendingApprovalProfiles}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Row: Gender Distribution & User Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Gender Distribution */}
              <div className="rounded-lg p-4 sm:p-6 border border-white">
                <h2 className="text-lg sm:text-xl font-semibold text-[#702C3E] mb-4">Gender Distribution</h2>
                <div>
                  {/* Male and Female in a row */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#702C3E] rounded"></div>
                      <span className="text-sm text-[#702C3E] font-medium">Male {stats.maleUsers}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#F6E7EA] rounded"></div>
                      <span className="text-sm text-[#702C3E] font-medium">Female {stats.femaleUsers}</span>
                    </div>
                  </div>

                  {/* Horizontal Bar Chart */}
                  {totalUsers > 0 && (
                    <div className="mt-6">
                      <div className="w-full h-8 flex overflow-hidden rounded-full">
                        <div className="h-full bg-[#702C3E]" style={{ width: `${malePercentage}%` }}></div>
                        <div className="h-full bg-[#F6E7EA]" style={{ width: `${femalePercentage}%` }}></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-[#5A4A4A]">({malePercentage}%)</span>
                        <span className="text-xs text-[#5A4A4A]">({femalePercentage}%)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* User Demographics */}
              <div className="rounded-lg p-4 sm:p-6 border border-white">
                <h2 className="text-lg sm:text-xl font-semibold text-[#702C3E] mb-4">User Demographics</h2>
                <div className="space-y-3">
                  {/* Age Group 20-30 */}
                  {ageGroup20_30.count > 0 && (
                    <div className="bg-[#F6E7EA] rounded-lg p-3">
                      <p className="text-sm text-[#702C3E] mb-1 font-medium">20 - 30 ({ageGroup20_30.percentage}%)</p>
                      <p className="text-lg font-semibold text-[#702C3E]">{ageGroup20_30.count}</p>
                    </div>
                  )}
                  
                  {/* Age Group 31-70 */}
                  {ageGroup31_70.count > 0 && (
                    <div className="bg-[#F6E7EA] rounded-lg p-3">
                      <p className="text-sm text-[#702C3E] mb-1 font-medium">31 - 70 ({ageGroup31_70.percentage}%)</p>
                      <p className="text-lg font-semibold text-[#702C3E]">{ageGroup31_70.count}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </>
      </div>
    );
  }

  // User Dashboard
  const userStatsData = userStats || {
    myMatches: 0,
    activeChats: 0,
    totalSpent: 0,
    thisMonthSpent: 0,
    profileViews: 0,
    pendingMatches: 0,
    acceptedMatches: 0,
    rejectedMatches: 0,
    photos: 0,
    profileCompletion: 0,
    profileStatus: 'pending',
    lastMatchDate: null,
    lastMessageDate: null,
    profileUpdatedDate: null,
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-[#702C3E] mb-4 sm:mb-6">Dashboard</h1>
      
      <>
          {/* User Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
              <h3 className="text-sm font-medium mb-2">My Matches</h3>
              <p className="text-2xl sm:text-3xl font-bold">{userStatsData.myMatches}</p>
            </div>
            <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
              <h3 className="text-sm font-medium mb-2">Active Chats</h3>
              <p className="text-2xl sm:text-3xl font-bold">{userStatsData.activeChats}</p>
            </div>
            <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
              <h3 className="text-sm font-medium mb-2">Total Spent</h3>
              <p className="text-2xl sm:text-3xl font-bold">${userStatsData.totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
              <h3 className="text-sm font-medium mb-2">Profile Views</h3>
              <p className="text-2xl sm:text-3xl font-bold">{userStatsData.profileViews}</p>
            </div>
          </div>

          {/* User Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Match Status */}
            <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E6DADA]">
              <h2 className="text-lg sm:text-xl font-semibold text-[#702C3E] mb-4">My Match Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A4A4A] font-medium">Pending</span>
                  <span className="text-sm font-semibold text-[#702C3E]">{userStatsData.pendingMatches}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A4A4A] font-medium">Accepted</span>
                  <span className="text-sm font-semibold text-[#702C3E]">{userStatsData.acceptedMatches}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A4A4A] font-medium">Rejected</span>
                  <span className="text-sm font-semibold text-[#702C3E]">{userStatsData.rejectedMatches}</span>
                </div>
              </div>
            </div>

            {/* Profile Status */}
            <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E6DADA]">
              <h2 className="text-lg sm:text-xl font-semibold text-[#702C3E] mb-4">Profile Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A4A4A] font-medium">Completion</span>
                  <span className="text-sm font-semibold text-[#702C3E]">{userStatsData.profileCompletion}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A4A4A] font-medium">Status</span>
                  <span className={`text-sm font-semibold ${
                    userStatsData.profileStatus === 'approved' ? 'text-green-600' : 'text-[#702C3E]'
                  }`}>
                    {userStatsData.profileStatus.charAt(0).toUpperCase() + userStatsData.profileStatus.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A4A4A] font-medium">Photos</span>
                  <span className="text-sm font-semibold text-[#702C3E]">{userStatsData.photos}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E6DADA]">
              <h2 className="text-lg sm:text-xl font-semibold text-[#702C3E] mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A4A4A] font-medium">Last Match</span>
                  <span className="text-sm font-semibold text-[#702C3E]">
                    {userStatsData.lastMatchDate || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A4A4A] font-medium">Last Message</span>
                  <span className="text-sm font-semibold text-[#702C3E]">
                    {userStatsData.lastMessageDate || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A4A4A] font-medium">Profile Updated</span>
                  <span className="text-sm font-semibold text-[#702C3E]">
                    {userStatsData.profileUpdatedDate || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E6DADA]">
              <h2 className="text-lg sm:text-xl font-semibold text-[#702C3E] mb-4">Payment Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A4A4A] font-medium">This Month</span>
                  <span className="text-sm font-semibold text-[#702C3E]">${userStatsData.thisMonthSpent.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A4A4A] font-medium">Total Spent</span>
                  <span className="text-sm font-semibold text-[#702C3E]">${userStatsData.totalSpent.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
      </>
    </div>
  );
}
