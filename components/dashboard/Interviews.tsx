"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FiSearch, FiCalendar, FiX } from "react-icons/fi";
import { 
  getInterviews, 
  scheduleInterview, 
  updateInterview,
  deleteInterview,
  type Interview as APIInterview 
} from "@/lib/api/admin";
import { getUsers, type User as APIUser } from "@/lib/api/admin";
import { toast } from "react-toastify";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface Interview {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  adminId: string;
  adminName: string;
  scheduledAt: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show';
  notes?: string;
}

export default function Interviews() {
  const { user: currentUser } = useAuthGuard({ allowRoles: ['admin', 'superAdmin'] });
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleUserSearch, setScheduleUserSearch] = useState("");
  const [scheduleUserResults, setScheduleUserResults] = useState<APIUser[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<APIUser | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<APIUser | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [scheduleNotes, setScheduleNotes] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [admins, setAdmins] = useState<APIUser[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  // Fetch interviews
  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInterviews({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        status: 'all',
      });

      if (response.success) {
        setInterviews(response.interviews);
        setPagination(response.pagination);
      } else {
        toast.error(response.error || "Failed to fetch interviews");
        setInterviews([]);
      }
    } catch (error: any) {
      console.error("[Interviews] Error fetching interviews:", error);
      toast.error("Failed to load interviews. Please try again.");
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, pagination.page, pagination.limit]);

  // Fetch admins for schedule modal
  const fetchAdmins = useCallback(async () => {
    try {
      const response = await getUsers({
        limit: 1000,
        role: 'admin', // This will get both admin and superAdmin
      });

      if (response.success) {
        // Filter to only admins and superAdmins
        const adminUsers = response.users.filter(
          (user: APIUser) => user.role === 'admin' || user.role === 'superAdmin'
        );
        setAdmins(adminUsers);
        
        // Set current user as default admin if they are an admin
        if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'superAdmin')) {
          const currentAdmin = adminUsers.find((a: APIUser) => a.id === currentUser.id);
          if (currentAdmin) {
            setSelectedAdmin(currentAdmin);
          }
        }
      }
    } catch (error: any) {
      console.error("[Interviews] Error fetching admins:", error);
    }
  }, [currentUser]);

  // Search for users to schedule interview
  const searchUsers = useCallback(async () => {
    if (!scheduleUserSearch.trim()) {
      setScheduleUserResults([]);
      return;
    }

    setSearchingUsers(true);
    try {
      const response = await getUsers({
        search: scheduleUserSearch,
        limit: 10,
        includeTemp: false,
      });

      if (response.success) {
        // Filter out admins from results
        const regularUsers = response.users.filter(
          (user: APIUser) => user.role === 'users'
        );
        setScheduleUserResults(regularUsers);
      } else {
        setScheduleUserResults([]);
      }
    } catch (error: any) {
      console.error("[Interviews] Error searching users:", error);
      setScheduleUserResults([]);
    } finally {
      setSearchingUsers(false);
    }
  }, [scheduleUserSearch]);

  // Debounce user search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [scheduleUserSearch, searchUsers]);

  // Fetch interviews on mount and when filters change
  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // Fetch admins when modal opens
  useEffect(() => {
    if (showScheduleModal) {
      fetchAdmins();
    }
  }, [showScheduleModal, fetchAdmins]);

  // Debounce search query - reset to page 1 when search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[date.getDay()];
    const month = date.getMonth() + 1;
    const dayNum = date.getDate();
    const year = date.getFullYear();
    return `${day}, ${month}/${dayNum} ${year}`;
  };

  // Handle schedule interview
  const handleScheduleInterview = async () => {
    if (!selectedUser || !selectedAdmin || !selectedDate || !selectedTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Combine date and time into ISO string
    const scheduledAt = new Date(`${selectedDate}T${selectedTime}`).toISOString();

    setScheduling(true);
    try {
      const response = await scheduleInterview({
        userId: selectedUser.id,
        adminId: selectedAdmin.id,
        scheduledAt,
        notes: scheduleNotes || undefined,
      });

      if (response.success) {
        toast.success("Interview scheduled successfully");
        setShowScheduleModal(false);
        // Reset form
        setSelectedUser(null);
        setSelectedAdmin(null);
        setSelectedDate("");
        setSelectedTime("");
        setScheduleNotes("");
        setScheduleUserSearch("");
        setScheduleUserResults([]);
        // Refresh interviews list
        fetchInterviews();
      } else {
        toast.error(response.error || "Failed to schedule interview");
      }
    } catch (error: any) {
      console.error("[Interviews] Error scheduling interview:", error);
      toast.error("Failed to schedule interview. Please try again.");
    } finally {
      setScheduling(false);
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    setShowScheduleModal(false);
    setSelectedUser(null);
    setSelectedAdmin(null);
    setSelectedDate("");
    setSelectedTime("");
    setScheduleNotes("");
    setScheduleUserSearch("");
    setScheduleUserResults([]);
  };

  // Filter interviews by search query
  const filteredInterviews = interviews.filter((interview) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      interview.userName.toLowerCase().includes(searchLower) ||
      interview.userEmail.toLowerCase().includes(searchLower) ||
      interview.adminName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[#702C3E]">
          Interviews
        </h1>
        
        {/* Schedule Interview Button */}
        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-[#702C3E] text-white rounded-lg font-medium hover:bg-[#5E2333] transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <FiCalendar className="w-4 h-4" />
          Schedule Interview
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-4xl">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <FiSearch className="w-5 h-5 text-[#5A4A4A]" />
          </div>
          <input
            type="text"
            placeholder="Search name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E2B5B2] text-[#5A4A4A] placeholder:text-[#5A4A4A] placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#702C3E] focus:ring-opacity-50"
          />
        </div>
      </div>

      {/* Interviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#702C3E] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="bg-[#F6E7EA] border border-[#FFFFFF] rounded-lg p-6 text-center">
          <p className="text-[#5A4A4A]">No interviews found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInterviews.map((interview, index) => (
            <div
              key={interview.id}
              className={`${
                index % 2 === 0 ? "bg-[#F6E7EA]" : "bg-transparent"
              } border border-[#FFFFFF] rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6`}
            >
              {/* Column 1: User Name and Email */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-[#702C3E] mb-1">
                  {interview.userName}
                </h2>
                <p className="text-base sm:text-lg text-[#702C3E] font-medium">
                  {interview.userEmail}
                </p>
              </div>

              {/* Column 2: Admin Name */}
              <div className="flex-1 min-w-0">
                <span className="text-xs sm:text-sm text-[#9B8A8A] font-medium block mb-1">
                  Admin
                </span>
                <p className="text-base sm:text-lg text-[#702C3E] font-medium">
                  {interview.adminName}
                </p>
              </div>

              {/* Column 3: Time */}
              <div className="flex-1 min-w-0">
                <span className="text-xs sm:text-sm text-[#9B8A8A] font-medium block mb-1">
                  Time
                </span>
                <p className="text-base sm:text-lg text-[#702C3E] font-medium">
                  {formatDate(interview.scheduledAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E6DADA]">
              <h2 className="text-2xl font-bold text-[#702C3E]">Schedule Interview</h2>
              <button
                onClick={handleCloseModal}
                className="text-[#5A4A4A] hover:text-[#702C3E] transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Search for User */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#702C3E] mb-2">
                  Search for user by name or email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <FiSearch className="w-5 h-5 text-[#5A4A4A]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search name or email"
                    value={scheduleUserSearch}
                    onChange={(e) => setScheduleUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#F6E7EA] rounded-lg border-none text-[#5A4A4A] placeholder-[#9B8A8A] focus:outline-none focus:ring-2 focus:ring-[#702C3E] focus:ring-opacity-50"
                  />
                </div>
              </div>

              {/* Search Results */}
              {searchingUsers && (
                <div className="text-center py-4">
                  <div className="w-8 h-8 border-4 border-[#702C3E] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-[#5A4A4A]">Searching...</p>
                </div>
              )}

              {!searchingUsers && scheduleUserResults.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
                  {scheduleUserResults.map((user) => (
                    <div
                      key={user.id}
                      className="bg-[#F6E7EA] rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-[#702C3E]">
                          {user.fullName || user.alias || 'Unknown'}
                        </p>
                        <p className="text-sm text-[#5A4A4A]">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setScheduleUserSearch(user.fullName || user.alias || user.email);
                          setScheduleUserResults([]);
                        }}
                        className="px-4 py-2 bg-[#702C3E] text-white rounded-lg hover:bg-[#5E2333] transition-colors text-sm font-medium"
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!searchingUsers && scheduleUserSearch && scheduleUserResults.length === 0 && (
                <div className="text-center py-8 mb-6">
                  <p className="text-[#5A4A4A]">No users found matching your search.</p>
                </div>
              )}

              {!scheduleUserSearch && (
                <div className="text-center py-8 mb-6">
                  <p className="text-[#5A4A4A]">Start typing to search for users...</p>
                </div>
              )}

              {/* Selected User Display */}
              {selectedUser && (
                <div className="mb-6 p-4 bg-[#F6E7EA] rounded-lg">
                  <p className="text-sm font-medium text-[#702C3E] mb-1">Selected User:</p>
                  <p className="font-semibold text-[#702C3E]">
                    {selectedUser.fullName || selectedUser.alias || 'Unknown'}
                  </p>
                  <p className="text-sm text-[#5A4A4A]">{selectedUser.email}</p>
                </div>
              )}

              {/* Select Admin */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#702C3E] mb-2">
                  Admin
                </label>
                <select
                  value={selectedAdmin?.id || ''}
                  onChange={(e) => {
                    const admin = admins.find((a) => a.id === e.target.value);
                    setSelectedAdmin(admin || null);
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-[#E2B5B2] text-[#5A4A4A] bg-white focus:outline-none focus:ring-2 focus:ring-[#702C3E] focus:ring-opacity-50"
                >
                  <option value="">Select an admin</option>
                  {admins.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.fullName || admin.alias || admin.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#702C3E] mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-lg border border-[#E2B5B2] text-[#5A4A4A] bg-white focus:outline-none focus:ring-2 focus:ring-[#702C3E] focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#702C3E] mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#E2B5B2] text-[#5A4A4A] bg-white focus:outline-none focus:ring-2 focus:ring-[#702C3E] focus:ring-opacity-50"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#702C3E] mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={scheduleNotes}
                  onChange={(e) => setScheduleNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-[#E2B5B2] text-[#5A4A4A] placeholder:text-[#9B8A8A] bg-white focus:outline-none focus:ring-2 focus:ring-[#702C3E] focus:ring-opacity-50"
                  placeholder="Add any notes about this interview..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-[#E6DADA]">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-[#E2B5B2] rounded-lg text-[#5A4A4A] hover:bg-[#F6E7EA] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleInterview}
                disabled={scheduling || !selectedUser || !selectedAdmin || !selectedDate || !selectedTime}
                className="flex-1 px-4 py-2 bg-[#702C3E] text-white rounded-lg hover:bg-[#5E2333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {scheduling ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  'Schedule Interview'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
