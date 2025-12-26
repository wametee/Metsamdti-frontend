"use client";

import { useState, useEffect, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FiUser, FiFlag, FiHeart, FiCheckCircle, FiMail, FiUsers, FiEdit } from "react-icons/fi";
import { getUsers, updateUserStatus, type User as APIUser } from "@/lib/api/admin";
import { toast } from "react-toastify";
import UserDetail from "./UserDetail";

type UserStatus = "verified" | "flagged" | "unmatched" | "matched";

interface User {
  id: string;
  alias: string;
  fullName: string;
  age: number | null;
  gender: string;
  location: string;
  status: UserStatus;
  recommendedMatches: number;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [openActionsMenu, setOpenActionsMenu] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  const statusOptions: { value: UserStatus | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "verified", label: "Verified" },
    { value: "flagged", label: "Flagged" },
    { value: "unmatched", label: "Unmatched" },
    { value: "matched", label: "Matched" },
  ];

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        status: statusFilter === "all" ? undefined : statusFilter,
        includeTemp: false, // Exclude temp users by default
      });

      if (response.success) {
        // Transform API users to component format
        const transformedUsers: User[] = response.users.map((user: APIUser) => ({
          id: user.id,
          alias: user.alias,
          fullName: user.fullName,
          age: user.age,
          gender: user.gender,
          location: user.location,
          status: user.status,
          recommendedMatches: user.recommendedMatches,
        }));

        setUsers(transformedUsers);
        setPagination(response.pagination);
      } else {
        toast.error(response.error || "Failed to fetch users");
        setUsers([]);
      }
    } catch (error: any) {
      console.error("[Users] Error fetching users:", error);
      toast.error("Failed to load users. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, pagination.page, pagination.limit]);

  // Fetch users on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [searchQuery, statusFilter, pagination.page]);

  // Debounce search query - reset to page 1 when search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.actions-menu-container')) {
        setOpenActionsMenu(null);
      }
    };

    if (openActionsMenu !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionsMenu]);

  const getStatusTagStyles = (status: UserStatus) => {
    switch (status) {
      case "verified":
        return "bg-[#702C3E] text-white border-[#702C3E]";
      case "flagged":
        return "bg-white text-[#702C3E] border-[#702C3E]";
      case "matched":
        return "bg-[#047704] text-white border-[#047704]";
      case "unmatched":
        return "bg-white text-[#702C3E] border-[#702C3E]";
      default:
        return "bg-white text-[#702C3E] border-[#702C3E]";
    }
  };

  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case "verified":
        return <FiUser className="w-3 h-3" />;
      case "flagged":
        return <FiFlag className="w-3 h-3" />;
      case "matched":
        return <FiHeart className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: UserStatus) => {
    switch (status) {
      case "verified":
        return "Verified";
      case "flagged":
        return "Flagged";
      case "matched":
        return "Matched";
      case "unmatched":
        return "Unmatched";
      default:
        return status;
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto  min-h-screen">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#702C3E] mb-6">
        Users
      </h1>

      {/* Search and Filter Section */}
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

      {/* User Cards List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#702C3E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#5A4A4A]">Loading users...</p>
          </div>
        </div>
      ) : selectedUserId ? (
        <UserDetail 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)} 
        />
      ) : (
        <div className="space-y-4">
          {users.map((user, index) => (
          <div
            key={user.id}
            className={`${
              index % 2 === 0 ? "bg-[#F6E7EA]" : "bg-transparent"
            } border border-[#FFFFFF] rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity`}
            onClick={() => setSelectedUserId(user.id)}
          >
            {/* Left Section: Alias, Status, Full Name, Details */}
            <div className="flex-1 min-w-0">
              {/* Alias and Status Tag */}
              <div className="flex items-center gap-4 sm:gap-6 mb-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-[#702C3E]">
                  {user.alias}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusTagStyles(
                    user.status
                  )}`}
                >
                  {getStatusIcon(user.status)}
                  {getStatusLabel(user.status)}
                </span>
              </div>

              {/* Full Name */}
              <p className="text-base sm:text-lg text-[#702C3E] mb-2 font-medium">
                {user.fullName}
              </p>

              {/* Details: Age, Gender, Location */}
              <div className="flex items-center gap-2 text-sm sm:text-base text-[#AB574F] flex-wrap">
                {user.age && <span>{user.age} yrs</span>}
                {user.age && <span className="text-[#AB574F]">•</span>}
                <span>{user.gender}</span>
                <span className="text-[#AB574F]">•</span>
                <span>{user.location}</span>
              </div>
            </div>

            {/* Center Section: Recommended Matches */}
            <div className="flex-1 flex justify-center items-center">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-[#5A4A4A] mb-1">
                  Recommended Matches
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-[#702C3E]">
                  {user.recommendedMatches}
                </p>
              </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center relative actions-menu-container" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenActionsMenu(openActionsMenu === index ? null : index)}
                className={`px-4 sm:px-6 py-2 sm:py-3 border border-[#702C3E] rounded-lg text-[#702C3E] font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                  index % 2 === 0
                    ? "bg-[#F6E7EA] hover:bg-[#EDD4D3]"
                    : "bg-transparent hover:bg-[#F6E7EA]"
                }`}
              >
                Actions
              </button>

              {/* Actions Dropdown Menu */}
              {openActionsMenu === index && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg z-50 border border-[#E6DADA] overflow-hidden">
                  {/* Modal Title */}
                  <div className="px-4 py-3 border-b border-[#E6DADA]">
                    <h3 className="text-sm font-semibold text-[#702C3E] text-center">
                      Actions Modal
                    </h3>
                  </div>

                  {/* Action Items */}
                  <div className="py-2">
                    <button
                      onClick={async () => {
                        try {
                          const result = await updateUserStatus(user.id, { verified: true });
                          if (result.success) {
                            toast.success("Account verified successfully");
                            fetchUsers(); // Refresh list
                          } else {
                            toast.error(result.error || "Failed to verify account");
                          }
                        } catch (error) {
                          toast.error("Failed to verify account");
                        }
                        setOpenActionsMenu(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F6E7EA] transition-colors text-left"
                    >
                      <FiCheckCircle className="w-5 h-5 text-[#5A4A4A]" />
                      <span className="text-sm text-[#5A4A4A]">Verify Account</span>
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          const result = await updateUserStatus(user.id, { status: 'suspended' });
                          if (result.success) {
                            toast.success("Account flagged successfully");
                            fetchUsers(); // Refresh list
                          } else {
                            toast.error(result.error || "Failed to flag account");
                          }
                        } catch (error) {
                          toast.error("Failed to flag account");
                        }
                        setOpenActionsMenu(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F6E7EA] transition-colors text-left"
                    >
                      <FiFlag className="w-5 h-5 text-[#5A4A4A]" />
                      <span className="text-sm text-[#5A4A4A]">Flag Account</span>
                    </button>

                    <button
                      onClick={() => {
                        console.log("Send Message", user);
                        setOpenActionsMenu(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F6E7EA] transition-colors text-left"
                    >
                      <FiMail className="w-5 h-5 text-[#5A4A4A]" />
                      <span className="text-sm text-[#5A4A4A]">Send Message</span>
                    </button>

                    <button
                      onClick={() => {
                        console.log("Schedule Interview", user);
                        setOpenActionsMenu(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F6E7EA] transition-colors text-left"
                    >
                      <FiUsers className="w-5 h-5 text-[#5A4A4A]" />
                      <span className="text-sm text-[#5A4A4A]">Schedule Interview</span>
                    </button>

                    <button
                      onClick={() => {
                        console.log("Write Note", user);
                        setOpenActionsMenu(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F6E7EA] transition-colors text-left"
                    >
                      <FiEdit className="w-5 h-5 text-[#5A4A4A]" />
                      <span className="text-sm text-[#5A4A4A]">Write Note</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

          {users.length === 0 && !loading && (
            <div className="bg-[#F6E7EA] rounded-lg p-8 text-center">
              <p className="text-[#5A4A4A]">No users found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
