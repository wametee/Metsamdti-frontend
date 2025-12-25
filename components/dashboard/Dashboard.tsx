"use client";

import { useState, useEffect } from "react";
import { authService } from "@/services";

type UserRole = 'superAdmin' | 'admin' | 'users';

export default function Dashboard() {
  const [userRole, setUserRole] = useState<UserRole>('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await authService.getCurrentUser();
        if (result.success && result.user) {
          const role = result.user.role || 'users';
          setUserRole(role as UserRole);
        }
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const isAdmin = userRole === 'admin' || userRole === 'superAdmin';

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="text-[#702C3E]">Loading...</div>
      </div>
    );
  }

  // Admin Dashboard
  if (isAdmin) {
    return (
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#491A26] mb-4 sm:mb-6">Dashboard</h1>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium mb-2">Scheduled Interviews</h3>
            <p className="text-2xl sm:text-3xl font-bold">10</p>
          </div>
          <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium mb-2">This week's New Users</h3>
            <p className="text-2xl sm:text-3xl font-bold">2</p>
          </div>
          <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium mb-2">Total Earned</h3>
            <p className="text-2xl sm:text-3xl font-bold">$1000</p>
          </div>
          <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium mb-2">Active Matches</h3>
            <p className="text-2xl sm:text-3xl font-bold">50</p>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Match Analytics */}
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E6DADA]">
            <h2 className="text-lg sm:text-xl font-semibold text-[#491A26] mb-4">Match Analytics</h2>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#F5E5E4"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#702C3E"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56 * 0.7} ${2 * Math.PI * 56 * 0.3}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#702C3E]">70%</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#F5E5E4] rounded"></div>
                  <span className="text-sm text-[#5A4A4A]">Total Matches</span>
                </div>
                <span className="text-sm font-semibold text-[#491A26]">1000</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#702C3E] rounded"></div>
                  <span className="text-sm text-[#5A4A4A]">Successful Matches</span>
                </div>
                <span className="text-sm font-semibold text-[#491A26]">700</span>
              </div>
            </div>
          </div>

          {/* User Profiles */}
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E6DADA]">
            <h2 className="text-lg sm:text-xl font-semibold text-[#491A26] mb-4">User Profiles</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5A4A4A]">Completed</span>
                <span className="text-sm font-semibold text-[#491A26]">1000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5A4A4A]">Incompleted</span>
                <span className="text-sm font-semibold text-[#491A26]">200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5A4A4A]">Flagged</span>
                <span className="text-sm font-semibold text-[#491A26]">20</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5A4A4A]">Awaiting Approval</span>
                <span className="text-sm font-semibold text-[#491A26]">400</span>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Gender Distribution */}
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E6DADA]">
            <h2 className="text-lg sm:text-xl font-semibold text-[#491A26] mb-4">Gender Distribution</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#5A4A4A]">Male</span>
                  <span className="text-sm font-semibold text-[#491A26]">700 (70%)</span>
                </div>
                <div className="w-full bg-[#F5E5E4] rounded-full h-4">
                  <div className="bg-[#702C3E] h-4 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#5A4A4A]">Female</span>
                  <span className="text-sm font-semibold text-[#491A26]">300 (30%)</span>
                </div>
                <div className="w-full bg-[#F5E5E4] rounded-full h-4">
                  <div className="bg-[#EDD4D3] h-4 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* User Demographics */}
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E6DADA]">
            <h2 className="text-lg sm:text-xl font-semibold text-[#491A26] mb-4">User Demographics</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5A4A4A]">20 - 30</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#5A4A4A]">70%</span>
                  <span className="text-sm font-semibold text-[#491A26]">700</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5A4A4A]">31 - 70</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#5A4A4A]">30%</span>
                  <span className="text-sm font-semibold text-[#491A26]">300</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User Dashboard
  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#491A26] mb-4 sm:mb-6">Dashboard</h1>
      
      {/* User Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium mb-2">My Matches</h3>
          <p className="text-2xl sm:text-3xl font-bold">5</p>
        </div>
        <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium mb-2">Active Chats</h3>
          <p className="text-2xl sm:text-3xl font-bold">2</p>
        </div>
        <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium mb-2">Total Spent</h3>
          <p className="text-2xl sm:text-3xl font-bold">$40</p>
        </div>
        <div className="bg-[#702C3E] text-white rounded-lg p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium mb-2">Profile Views</h3>
          <p className="text-2xl sm:text-3xl font-bold">12</p>
        </div>
      </div>

      {/* User Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Match Status */}
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E6DADA]">
          <h2 className="text-lg sm:text-xl font-semibold text-[#491A26] mb-4">My Match Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5A4A4A]">Pending</span>
              <span className="text-sm font-semibold text-[#491A26]">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5A4A4A]">Accepted</span>
              <span className="text-sm font-semibold text-[#491A26]">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5A4A4A]">Rejected</span>
              <span className="text-sm font-semibold text-[#491A26]">0</span>
            </div>
          </div>
        </div>

        {/* Profile Status */}
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E6DADA]">
          <h2 className="text-lg sm:text-xl font-semibold text-[#491A26] mb-4">Profile Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5A4A4A]">Completion</span>
              <span className="text-sm font-semibold text-[#491A26]">100%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5A4A4A]">Status</span>
              <span className="text-sm font-semibold text-green-600">Approved</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5A4A4A]">Photos</span>
              <span className="text-sm font-semibold text-[#491A26]">5</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E6DADA]">
          <h2 className="text-lg sm:text-xl font-semibold text-[#491A26] mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5A4A4A]">Last Match</span>
              <span className="text-sm font-semibold text-[#491A26]">2 days ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5A4A4A]">Last Message</span>
              <span className="text-sm font-semibold text-[#491A26]">1 hour ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5A4A4A]">Profile Updated</span>
              <span className="text-sm font-semibold text-[#491A26]">1 week ago</span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E6DADA]">
          <h2 className="text-lg sm:text-xl font-semibold text-[#491A26] mb-4">Payment Summary</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5A4A4A]">This Month</span>
              <span className="text-sm font-semibold text-[#491A26]">$40</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5A4A4A]">Total Spent</span>
              <span className="text-sm font-semibold text-[#491A26]">$40</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5A4A4A]">Unlocked Chats</span>
              <span className="text-sm font-semibold text-[#491A26]">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
