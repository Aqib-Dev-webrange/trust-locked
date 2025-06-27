"use client";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import {
  FiSearch,
  FiTrash2,
  FiUser,
  FiCheck,
  FiX,
  FiFilter,
} from "react-icons/fi";

// User type matches your Supabase table
type User = {
  uid: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  display_name: string | null;
  stripeUserId: string | null;
  connectId: string | null;
  ratings: number | null;
  isConnectAccVerified: boolean | null;
  isDocumentSubmitted: boolean | null;
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states (edit, chat, delete)
  // const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [verifiedFilter, setVerifiedFilter] = useState<
    "all" | "verified" | "unverified"
  >("all");
  const [documentFilter, setDocumentFilter] = useState<
    "all" | "submitted" | "not_submitted"
  >("all");
  // const [editForm, setEditForm] = useState({
  //   display_name: "",
  //   email: "",
  // });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Change this to show more/less per page

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from("users").select("*");
      if (data) setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Filter by display_name or email
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesVerified =
      verifiedFilter === "all" ||
      (verifiedFilter === "verified" && user.isConnectAccVerified) ||
      (verifiedFilter === "unverified" && !user.isConnectAccVerified);

    const matchesDocument =
      documentFilter === "all" ||
      (documentFilter === "submitted" && user.isDocumentSubmitted) ||
      (documentFilter === "not_submitted" && !user.isDocumentSubmitted);

    return matchesSearch && matchesVerified && matchesDocument;
  });

  // Edit modal logic
  // const handleEditUser = (user: User) => {
  //   setSelectedUser(user);
  //   setEditForm({
  //     display_name: user.display_name ?? "",
  //     email: user.email ?? "",
  //   });
  //   setShowEditModal(true);
  // };

  // Save edit (local only, add Supabase update if needed)
  // const handleSaveEdit = () => {
  //   if (!selectedUser) return;
  //   setUsers((prev) =>
  //     prev.map((u) =>
  //       u.uid === selectedUser.uid
  //         ? { ...u, display_name: editForm.display_name, email: editForm.email }
  //         : u
  //     )
  //   );
  //   setShowEditModal(false);
  //   setSelectedUser(null);
  // };

  // Chat modal logic

  // Delete modal logic
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedUser) return;
    setUsers((prev) => prev.filter((u) => u.uid !== selectedUser.uid));
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <svg
          className="animate-spin h-20 w-20 text-[#20d5c7] mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="text-[#20d5c7] text-lg font-medium animate-pulse">
          Processing ..
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">
            Users Management
          </h1>
          <p className="text-gray-600">
            Manage all registered users and their status
          </p>
        </div>
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <span className="text-sm text-gray-500">
            {filteredUsers.length} users found
          </span>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400 w-5 h-5" />
            <select
              value={verifiedFilter}
              onChange={(e) =>
                setVerifiedFilter(
                  e.target.value as "all" | "verified" | "unverified"
                )
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
          <select
            value={documentFilter}
            onChange={(e) =>
              setDocumentFilter(
                e.target.value as "all" | "submitted" | "not_submitted"
              )
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
          >
            <option value="all">All Documents</option>
            <option value="submitted">Submitted</option>
            <option value="not_submitted">Not Submitted</option>
          </select>
        </div>
      </div>

      {/* Users Table (desktop/tablet) */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2 sm:p-4 font-semibold text-gray-900">
                Full Name
              </th>
              <th className="text-left p-2 sm:p-4 font-semibold text-gray-900">
                Email
              </th>
              <th className="text-left p-2 sm:p-4 font-semibold text-gray-900">
                Date
              </th>
              <th className="text-left p-2 sm:p-4 font-semibold text-gray-900">
                Verified
              </th>
              <th className="text-left p-2 sm:p-4 font-semibold text-gray-900">
                Document
              </th>
              <th className="text-left p-2 sm:p-4 font-semibold text-gray-900">
                Ratings
              </th>
              <th className="text-left p-2 sm:p-4 font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.uid}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-2 sm:p-4">
                  {user.display_name ?? (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="p-2 sm:p-4">
                  {user.email ?? <span className="text-gray-400">N/A</span>}
                </td>
                <td className="p-2 sm:p-4">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="p-2 sm:p-4">
                  {user.isConnectAccVerified ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <FiCheck className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <FiX className="w-3 h-3" /> Not Verified
                    </span>
                  )}
                </td>
                <td className="p-2 sm:p-4">
                  {user.isDocumentSubmitted ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Submitted
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                      Not Submitted
                    </span>
                  )}
                </td>
                <td className="p-2 sm:p-4">
                  {user.ratings ?? <span className="text-gray-400">N/A</span>}
                </td>
                <td className="p-2 sm:p-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* <button
                      onClick={() => handleChatClick(user)}
                      className="p-2 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white rounded-lg hover:from-[#1bb5a7] hover:to-[#179a8e] transition-all duration-300"
                      title="Chat with user"
                    >
                      <FiMessageCircle className="w-4 h-4" />
                    </button> */}
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                      title="Delete user"
                    >
                      <FiTrash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users Card View (mobile) */}
      <div className="block sm:hidden space-y-4">
        {currentUsers.map((user) => (
          <div
            key={user.uid}
            className="bg-gray-50 rounded-xl p-4 shadow border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-900">
                {user.display_name ?? (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* <button
                  onClick={() => handleChatClick(user)}
                  className="p-2 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white rounded-lg"
                  title="Chat with user"
                >
                  <FiMessageCircle className="w-4 h-4" />
                </button> */}
                <button
                  onClick={() => handleDeleteUser(user)}
                  className="p-2 border border-gray-300 rounded-lg"
                  title="Delete user"
                >
                  <FiTrash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1">
              {user.email ?? <span className="text-gray-400">N/A</span>}
            </div>
            <div className="text-xs text-gray-500 mb-2">
              Joined: {new Date(user.created_at).toLocaleDateString()}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {user.isConnectAccVerified ? (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <FiCheck className="w-3 h-3" /> Verified
                </span>
              ) : (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <FiX className="w-3 h-3" /> Not Verified
                </span>
              )}
              {user.isDocumentSubmitted ? (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  Doc Submitted
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                  No Doc
                </span>
              )}
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                Rating:{" "}
                {user.ratings ?? <span className="text-gray-400">N/A</span>}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {/* {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={editForm.display_name}
                  onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white py-2 rounded-lg hover:from-[#1bb5a7] hover:to-[#179a8e] transition-all duration-300"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Delete User
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>{selectedUser?.display_name}</strong>? This action cannot
              be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3">
        <div className="text-sm text-gray-500">
          Showing{" "}
          {filteredUsers.length === 0
            ? "0"
            : `${indexOfFirstUser + 1}-${Math.min(
                indexOfLastUser,
                filteredUsers.length
              )} of ${filteredUsers.length}`}{" "}
          users
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#20d5c7] text-white rounded-lg disabled:bg-gray-300 transition-all duration-300 hover:bg-[#1bb5a7] hover:to-[#179a8e] disabled:hover:to-gray-300 disabled:hover:bg-gray-200"
          >
            <FaChevronLeft className="mr-1" />
          </button>
          <span className="px-4 py-2 bg-[#20d5c7] text-white rounded-lg">
            {currentPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#20d5c7] text-white rounded-lg disabled:bg-gray-300 transition-all duration-300 hover:bg-[#1bb5a7] hover:to-[#179a8e]"
          >
            <FaChevronLeft className="transform rotate-180 ml-1" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No users found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
