"use client";

import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiMessageCircle, FiClock, FiHeart } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { getMatches, getCompatibility, proposeMatch, getUsers, type User as APIUser, type Match } from "@/lib/api/admin";
import { toast } from "react-toastify";
import { useAuthGuard } from "@/hooks/useAuthGuard";

type DisplayStatus = "all" | "talking" | "pending" | "married";

export default function AdminMatches() {
  const { user: currentUser } = useAuthGuard({ allowRoles: ['admin', 'superAdmin'] });
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DisplayStatus>("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  const statusOptions: { value: DisplayStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "talking", label: "Talking" },
    { value: "pending", label: "Pending" },
    { value: "married", label: "Married" },
  ];

  // Map display status to database status for filtering
  const mapDisplayStatusToDbStatus = (displayStatus: DisplayStatus): string | undefined => {
    switch (displayStatus) {
      case "talking":
        return "active"; // Active matches where users are talking
      case "pending":
        return "proposed"; // Matches waiting for user response
      case "married":
        return "active"; // We'll filter by a flag or use active status
      case "all":
      default:
        return undefined;
    }
  };

  // Fetch matches
  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const dbStatus = mapDisplayStatusToDbStatus(statusFilter);
      const response = await getMatches({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        status: dbStatus as any,
      });

      if (response.success) {
        // Fetch compatibility scores for each match
        const matchesWithCompatibility = await Promise.all(
          response.matches.map(async (match) => {
            try {
              const compatResponse = await getCompatibility(match.user1Id, match.user2Id);
              if (compatResponse.success) {
                return {
                  ...match,
                  compatibility: compatResponse.compatibility,
                };
              }
            } catch (error) {
              console.error('[AdminMatches] Error fetching compatibility:', error);
            }
            return match;
          })
        );

        setMatches(matchesWithCompatibility);
        setPagination(response.pagination);
      } else {
        toast.error(response.error || "Failed to fetch matches");
        setMatches([]);
      }
    } catch (error: any) {
      console.error("[AdminMatches] Error fetching matches:", error);
      toast.error("Failed to load matches. Please try again.");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, pagination.page, pagination.limit]);

  // Fetch matches on mount and when filters change
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Debounce search query - reset to page 1 when search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get status tag styles based on match status
  const getStatusTagStyles = (match: Match) => {
    // Map database status to display status
    if (match.status === "active" && match.user1Accepted && match.user2Accepted) {
      // Both users accepted - could be "Talking" or "Married"
      // For now, we'll use "Talking" for active accepted matches
      return "bg-[#702C3E] text-white border-[#702C3E]"; // Accepted/Talking
    } else if (match.status === "proposed") {
      return "bg-white text-[#702C3E] border-[#702C3E]"; // Pending
    } else if (match.status === "active") {
      return "bg-[#702C3E] text-white border-[#702C3E]"; // Talking
    } else if (match.status === "accepted") {
      return "bg-[#702C3E] text-white border-[#702C3E]"; // Accepted/Talking
    }
    return "bg-white text-[#702C3E] border-[#702C3E]"; // Default/Pending
  };

  // Get status label based on match status
  const getStatusLabel = (match: Match): "Talking" | "Pending" | "Married" => {
    if (match.status === "active" && match.user1Accepted && match.user2Accepted) {
      return "Talking";
    } else if (match.status === "proposed") {
      return "Pending";
    } else if (match.status === "active") {
      return "Talking";
    } else if (match.status === "accepted") {
      return "Talking";
    }
    // TODO: Add logic to check for successful/married matches when is_successful field is available
    return "Pending";
  };

  // Get status icon based on match status
  const getStatusIcon = (match: Match) => {
    const statusLabel = getStatusLabel(match);
    switch (statusLabel) {
      case "Talking":
        return <FiMessageCircle className="w-3 h-3" />;
      case "Pending":
        return <FiClock className="w-3 h-3" />;
      case "Married":
        return <FiHeart className="w-3 h-3" />;
      default:
        return <FiClock className="w-3 h-3" />;
    }
  };

  // Format user name
  const getUserName = (match: Match, userNum: 1 | 2) => {
    const user = userNum === 1 ? match.user1 : match.user2;
    const profile = userNum === 1 ? match.profile1 : match.profile2;
    return profile?.display_name || profile?.full_name || user?.display_name || user?.real_name || user?.email || "Unknown";
  };

  // Format user full name
  const getUserFullName = (match: Match, userNum: 1 | 2) => {
    const profile = userNum === 1 ? match.profile1 : match.profile2;
    return profile?.full_name || "Unknown";
  };

  // Get user details
  const getUserDetails = (match: Match, userNum: 1 | 2) => {
    const profile = userNum === 1 ? match.profile1 : match.profile2;
    if (!profile) return null;
    
    const parts = [];
    if (profile.age) parts.push(`${profile.age} yrs`);
    if (profile.gender) parts.push(profile.gender);
    if (profile.current_location) parts.push(profile.current_location);
    
    return parts.length > 0 ? parts.join(" • ") : null;
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#702C3E] mb-6">
          Matches
        </h1>

        {/* Search and Status Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <FiSearch className="w-5 h-5 text-[#5A4A4A]" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-transparent rounded-2xl border border-[#E2B5B2] text-[#5A4A4A] placeholder:text-[#5A4A4A] placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#702C3E] focus:ring-opacity-50"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="w-full sm:w-48 px-4 py-3 bg-transparent rounded-lg border border-[#E2B5B2] text-[#5A4A4A] flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#702C3E] focus:ring-opacity-50"
            >
              <span>
                {statusFilter === "all"
                  ? "Status"
                  : statusOptions.find((opt) => opt.value === statusFilter)?.label}
              </span>
              <RiArrowDropDownLine className="w-5 h-5" />
            </button>

            {statusDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setStatusDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-[#F6E7EA] rounded-lg shadow-lg z-20 border border-[#E6DADA] overflow-hidden">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setStatusDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 bg-[#F6E7EA] hover:bg-[#EDD4D3] transition-colors ${
                        statusFilter === option.value
                          ? "bg-[#EDD4D3] text-[#702C3E] font-medium"
                          : "text-[#5A4A4A]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Matches List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#702C3E] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-[#F6E7EA] rounded-lg p-8 text-center">
          <p className="text-[#5A4A4A]">
            {searchQuery ? "No matches found matching your search." : "No matches found."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match, index) => {
            const user1Name = getUserName(match, 1);
            const user1FullName = getUserFullName(match, 1);
            const user1Details = getUserDetails(match, 1);
            const user2Name = getUserName(match, 2);
            const user2FullName = getUserFullName(match, 2);
            const user2Details = getUserDetails(match, 2);
            const compatibility = match.compatibility?.compatibilityScore || 0;
            const statusTag = getStatusTagStyles(match);
            const statusLabel = getStatusLabel(match);
            const statusIcon = getStatusIcon(match);

            return (
              <div
                key={match.id}
                className="bg-[#F6E7EA] rounded-lg p-4 sm:p-6"
              >
                {/* User 1 */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4 pb-4 border-b border-[#E2B5B2]">
                  {/* Left: Name and Status */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 sm:gap-6 mb-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#702C3E]">
                        {user1Name}
                      </h2>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${statusTag}`}>
                        {statusIcon}
                        {statusLabel}
                      </span>
                    </div>
                    <p className="text-base sm:text-lg text-[#5A4A4A] mb-1">
                      {user1FullName}
                    </p>
                    {user1Details && (
                      <p className="text-sm text-[#AB574F]">
                        {user1Details}
                      </p>
                    )}
                  </div>

                  {/* Right: Compatibility and Status */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center">
                    <div className="text-center sm:text-left">
                      <p className="text-xs sm:text-sm text-[#9B8A8A] font-medium mb-1">
                        Compatibility
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-[#702C3E]">
                        {compatibility}%
                      </p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xs sm:text-sm text-[#9B8A8A] font-medium mb-1">
                        Status
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-[#702C3E]">
                        {statusLabel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* User 2 */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  {/* Left: Name and Status */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 sm:gap-6 mb-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#702C3E]">
                        {user2Name}
                      </h2>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${statusTag}`}>
                        {statusIcon}
                        {statusLabel}
                      </span>
                    </div>
                    <p className="text-base sm:text-lg text-[#5A4A4A] mb-1">
                      {user2FullName}
                    </p>
                    {user2Details && (
                      <p className="text-sm text-[#AB574F]">
                        {user2Details}
                      </p>
                    )}
                  </div>

                  {/* Right: Compatibility and Status */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center">
                    <div className="text-center sm:text-left">
                      <p className="text-xs sm:text-sm text-[#9B8A8A] font-medium mb-1">
                        Compatibility
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-[#702C3E]">
                        {compatibility}%
                      </p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xs sm:text-sm text-[#9B8A8A] font-medium mb-1">
                        Status
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-[#702C3E]">
                        {statusLabel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

