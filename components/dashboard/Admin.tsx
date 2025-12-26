"use client";

import { useState, useEffect, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { FiArrowUpRight } from "react-icons/fi";
import { FiCheckCircle, FiFlag, FiMail, FiUsers, FiEdit, FiX, FiTrash2, FiMessageSquare } from "react-icons/fi";
import { getUsers, updateUserStatus, type User as APIUser } from "@/lib/api/admin";
import { toast } from "react-toastify";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superAdmin';
}

export default function Admin() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openActionsMenu, setOpenActionsMenu] = useState<number | null>(null);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [searchResults, setSearchResults] = useState<APIUser[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Fetch admins (users with admin or superAdmin role)
  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all users and filter for admins/superAdmins
      // We can't filter by multiple roles in one query, so we'll fetch all and filter
      const response = await getUsers({
        limit: 1000, // Get a large number to ensure we get all admins
      });

      if (response.success) {
        // Filter to only admins and superAdmins, transform to AdminUser format
        const adminUsers: AdminUser[] = response.users
          .filter((user: APIUser) => user.role === 'admin' || user.role === 'superAdmin')
          .map((user: APIUser) => ({
            id: user.id,
            name: user.fullName || user.alias || 'Unknown',
            email: user.email,
            role: user.role as 'admin' | 'superAdmin',
          }));

        setAdmins(adminUsers);
      } else {
        toast.error(response.error || "Failed to fetch admins");
        setAdmins([]);
      }
    } catch (error: any) {
      console.error("[Admin] Error fetching admins:", error);
      toast.error("Failed to load admins. Please try again.");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search for users to promote to admin
  const searchUsers = useCallback(async () => {
    if (!searchUserQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchingUsers(true);
    try {
      const response = await getUsers({
        search: searchUserQuery,
        role: 'users', // Only search regular users
        limit: 10,
      });

      if (response.success) {
        setSearchResults(response.users);
      } else {
        setSearchResults([]);
      }
    } catch (error: any) {
      console.error("[Admin] Error searching users:", error);
      setSearchResults([]);
    } finally {
      setSearchingUsers(false);
    }
  }, [searchUserQuery]);

  // Debounce user search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchUserQuery, searchUsers]);

  // Fetch admins on mount
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

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

  // Filter admins by search query
  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Promote user to admin
  const handlePromoteToAdmin = async (userId: string, userEmail: string) => {
    try {
      const result = await updateUserStatus(userId, { role: 'admin' });
      if (result.success) {
        toast.success(`${userEmail} has been promoted to admin`);
        setShowAddAdminModal(false);
        setSearchUserQuery("");
        setSearchResults([]);
        fetchAdmins(); // Refresh admin list
      } else {
        toast.error(result.error || "Failed to promote user to admin");
      }
    } catch (error) {
      toast.error("Failed to promote user to admin");
    }
  };

  // Open delete confirmation modal
  const handleDeleteClick = (admin: AdminUser) => {
    setAdminToDelete(admin);
    setShowDeleteModal(true);
    setDeleteConfirmText("");
    setOpenActionsMenu(null);
  };

  // Confirm and execute delete
  const handleConfirmDelete = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm");
      return;
    }

    if (!adminToDelete) return;

    try {
      // For now, we'll demote to regular user (soft delete)
      // In the future, you might want to implement actual deletion
      const result = await updateUserStatus(adminToDelete.id, { role: 'users' });
      if (result.success) {
        toast.success(`${adminToDelete.email} has been removed as admin`);
        setShowDeleteModal(false);
        setAdminToDelete(null);
        setDeleteConfirmText("");
        fetchAdmins(); // Refresh admin list
      } else {
        toast.error(result.error || "Failed to remove admin");
      }
    } catch (error) {
      toast.error("Failed to remove admin");
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[#702C3E]">Admin</h1>
        
        {/* Add Admin Button */}
        <button
          onClick={() => setShowAddAdminModal(true)}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-[#702C3E] text-white rounded-lg font-medium hover:bg-[#5E2333] transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          Add Admin
          <FiArrowUpRight className="w-4 h-4" />
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
            className="w-full pl-10 pr-4 py-3 bg-transparent rounded-2xl border border-[#E2B5B2] text-[#5A4A4A] placeholder:text-[#5A4A4A] placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#702C3E] focus:ring-opacity-50"
          />
        </div>
      </div>

      {/* Admin List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#702C3E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#5A4A4A]">Loading admins...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAdmins.map((admin, index) => (
            <div
              key={admin.id}
              className={`${
                index % 2 === 0 ? "bg-[#F6E7EA]" : "bg-transparent"
              } border border-[#FFFFFF] rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4`}
            >
              {/* Name and Email */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs sm:text-sm text-[#9B8A8A] font-medium">Name:</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#702C3E]">
                      {admin.name}
                    </h2>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs sm:text-sm text-[#9B8A8A] font-medium">Email:</span>
                    <p className="text-base sm:text-lg text-[#702C3E] font-medium">
                      {admin.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions Button */}
              <div className="flex items-center relative actions-menu-container w-full sm:w-auto">
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
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-[#E6DADA] overflow-hidden">
                    <div className="py-2">
                      <button
                        onClick={() => {
                          console.log("Edit", admin);
                          setOpenActionsMenu(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F6E7EA] transition-colors text-left text-sm text-[#5A4A4A]"
                      >
                        <FiEdit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(admin)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F6E7EA] transition-colors text-left text-sm text-[#5A4A4A]"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                      <button
                        onClick={() => {
                          console.log("Message", admin);
                          setOpenActionsMenu(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F6E7EA] transition-colors text-left text-sm text-[#5A4A4A]"
                      >
                        <FiMessageSquare className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredAdmins.length === 0 && !loading && (
            <div className="bg-[#F6E7EA] rounded-lg p-8 text-center">
              <p className="text-[#5A4A4A]">
                {searchQuery ? "No admins found matching your search." : "No admins found."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E6DADA]">
              <h2 className="text-2xl font-bold text-[#702C3E]">Add Admin</h2>
              <button
                onClick={() => {
                  setShowAddAdminModal(false);
                  setSearchUserQuery("");
                  setSearchResults([]);
                }}
                className="text-[#5A4A4A] hover:text-[#702C3E] transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Search Users */}
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
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)}
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

              {!searchingUsers && searchResults.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchResults.map((user) => (
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
                        onClick={() => handlePromoteToAdmin(user.id, user.email)}
                        className="px-4 py-2 bg-[#702C3E] text-white rounded-lg hover:bg-[#5E2333] transition-colors text-sm font-medium"
                      >
                        Promote to Admin
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!searchingUsers && searchUserQuery && searchResults.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-[#5A4A4A]">No users found matching your search.</p>
                </div>
              )}

              {!searchUserQuery && (
                <div className="text-center py-8">
                  <p className="text-[#5A4A4A]">Start typing to search for users...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && adminToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl border border-[#E6DADA] pointer-events-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E6DADA]">
              <h2 className="text-xl font-bold text-[#702C3E]">Delete Admin</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setAdminToDelete(null);
                  setDeleteConfirmText("");
                }}
                className="text-[#5A4A4A] hover:text-[#702C3E] transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-[#5A4A4A] mb-4">
                Are you sure you want to remove <span className="font-semibold text-[#702C3E]">{adminToDelete.email}</span> as an admin?
              </p>
              <p className="text-sm text-[#5A4A4A] mb-4">
                This action will demote them to a regular user. Type <span className="font-semibold text-[#702C3E]">DELETE</span> to confirm.
              </p>
              
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full px-4 py-3 bg-[#F6E7EA] rounded-lg border border-[#E2B5B2] text-[#5A4A4A] placeholder:text-[#9B8A8A] focus:outline-none focus:ring-2 focus:ring-[#702C3E] focus:ring-opacity-50 mb-4"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setAdminToDelete(null);
                    setDeleteConfirmText("");
                  }}
                  className="flex-1 px-4 py-2 border border-[#E2B5B2] rounded-lg text-[#5A4A4A] hover:bg-[#F6E7EA] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteConfirmText !== "DELETE"}
                  className="flex-1 px-4 py-2 bg-[#702C3E] text-white rounded-lg hover:bg-[#5E2333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
