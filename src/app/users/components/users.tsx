"use client";
import { useState } from "react";
import { FiSearch, FiFilter, FiMessageCircle, FiEdit, FiTrash2, FiUser, FiCheck, FiX, FiSend } from "react-icons/fi";

// Mock user data - replace with actual API data
const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/avatars/user1.jpg",
    status: "active",
    unreadMessages: 3,
    role: "Customer",
    joinedDate: "2024-01-15",
    Verified: "Yes",
    location: "New York, USA",
    phone: "+1 234 567 8901"
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    avatar: "/avatars/user2.jpg",
    status: "inactive",
    unreadMessages: 0,
    role: "Vendor",
    joinedDate: "2023-12-20",
    Verified: "No",
    location: "London, UK",
    phone: "+44 123 456 789"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    avatar: "/avatars/user3.jpg",
    status: "active",
    lastSeen: "Online now",
    unreadMessages: 1,
    role: "Customer",
    joinedDate: "2024-02-10",
    Verified: "Yes",
    location: "Toronto, Canada",
    phone: "+1 416 555 0123"
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma.davis@example.com",
    avatar: "/avatars/user4.jpg",
    status: "active",
    lastSeen: "5 minutes ago",
    unreadMessages: 0,
    role: "Vendor",
    joinedDate: "2023-11-05",
    Verified: "No",
    location: "Sydney, Australia",
    phone: "+61 2 1234 5678"
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@example.com",
    avatar: "/avatars/user5.jpg",
    status: "inactive",
    lastSeen: "3 days ago",
    unreadMessages: 2,
    role: "Customer",
    joinedDate: "2024-03-01",
    Verified: "No",
    location: "Berlin, Germany",
    phone: "+49 30 12345678"
  },
  {
    id: 6,
    name: "Olivia Smith",
    email: "olivia.smith@example.com",
    avatar: "/avatars/user6.jpg",
    status: "active",
    unreadMessages: 5,
    role: "Customer",
    joinedDate: "2024-02-20",
    Verified: "Yes",
    location: "San Francisco, USA",
    phone: "+1 415 555 0123"
  },
  {
    id: 7,
    name: "James Wilson",
    email: "james.wilson@example.com",
    avatar: "/avatars/user7.jpg",
    status: "inactive",
    unreadMessages: 2,
    role: "Vendor",
    joinedDate: "2024-01-10",
    Verified: "No",
    location: "Los Angeles, USA",
    phone: "+1 310 555 0123"
  }
];

type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  status: "active" | "inactive";
  unreadMessages: number;
  role: string;
  joinedDate: string;
  Verified: "Yes" | "No";
  location: string;
  phone: string;
  lastSeen?: string;
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: ""
  });
  const [chatMessage, setChatMessage] = useState("");
  type ChatMessage = {
    id: number;
    sender: "user" | "admin";
    message: string;
    time: string;
  };
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleVerificationToggle = (userId: number) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, Verified: user.Verified === "Yes" ? "No" : "Yes" }
          : user
      )
    );
  };

  const handleStatusToggle = (userId: number) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === "active" ? "inactive" : "active" }
          : user
      )
    );
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedUser) return;
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...editForm }
          : user
      )
    );
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleChatClick = (user: User) => {
    setSelectedUser(user);
    setChatMessages([
      { id: 1, sender: "user", message: "Hello, I need help with my order", time: "10:30 AM" },
      { id: 2, sender: "admin", message: "Hi! I'd be happy to help you. What's your order number?", time: "10:32 AM" }
    ]);
    setShowChatModal(true);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: chatMessages.length + 1,
        sender: "admin",
        message: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage("");
    }
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedUser) return;
    setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage all registered users and their status</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {filteredUsers.length} users found
          </span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 flex-1">
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
          
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 font-semibold text-gray-900">User</th>
              <th className="text-left p-4 font-semibold text-gray-900">Contact</th>
              <th className="text-left p-4 font-semibold text-gray-900">Status</th>
              <th className="text-left p-4 font-semibold text-gray-900">Verified</th>
              {/* <th className="text-left p-4 font-semibold text-gray-900">Messages</th> */}
              <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                {/* User Info */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#20d5c7] to-[#1bb5a7] rounded-full flex items-center justify-center text-white font-medium">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.location}</div>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-600">{user.phone}</div>
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <button
                    onClick={() => handleStatusToggle(user.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </td>

                {/* Verified */}
                <td className="p-4">
                  <button
                    onClick={() => handleVerificationToggle(user.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      user.Verified === 'Yes'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    {user.Verified === 'Yes' ? (
                      <>
                        <FiCheck className="w-3 h-3" />
                        Verified
                      </>
                    ) : (
                      <>
                        <FiX className="w-3 h-3" />
                        Unverified
                      </>
                    )}
                  </button>
                </td>

                {/* Messages */}
                {/* <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">{user.unreadMessages}</span>
                    {user.unreadMessages > 0 && (
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </div>
                </td> */}

                {/* Actions */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleChatClick(user)}
                      className="p-2 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white rounded-lg hover:from-[#1bb5a7] hover:to-[#179a8e] transition-all duration-300"
                      title="Chat with user"
                    >
                      <FiMessageCircle className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Edit user"
                    >
                      <FiEdit className="w-4 h-4 text-gray-600" />
                    </button>
                    
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
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
      )}

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg h-96 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#20d5c7] to-[#1bb5a7] rounded-full flex items-center justify-center text-white font-medium text-sm">
                {selectedUser?.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-medium text-gray-900">{selectedUser?.name}</div>
                <div className="text-sm text-gray-600">Online</div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="ml-auto p-1 hover:bg-gray-100 rounded"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.sender === 'admin' 
                      ? 'bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="text-sm">{msg.message}</div>
                    <div className={`text-xs mt-1 ${msg.sender === 'admin' ? 'text-white/70' : 'text-gray-500'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white rounded-lg hover:from-[#1bb5a7] hover:to-[#179a8e] transition-all duration-300"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delete User</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedUser?.name}</strong>? This action cannot be undone.
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

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Table Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 bg-[#20d5c7] text-white rounded-lg text-sm hover:bg-[#1bb5a7]">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}