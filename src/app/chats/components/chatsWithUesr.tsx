"use client";
import { useState } from "react";
import { 
  FiMessageCircle, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar, 
  FiShoppingBag, 
  FiStar,
  FiClock,
  FiX,
  FiSend,
  FiMoreHorizontal,
  FiCheck,
  FiSearch
} from "react-icons/fi";

// User type definition
type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastSeen: string;
  unreadMessages: number;
  role: "Customer" | "Vendor";
  location: string;
  phone: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent?: number;
  rating?: number;
  verified: boolean;
  bio?: string;
  lastMessage?: {
    text: string;
    time: string;
    sender: "user" | "admin";
  };
};

// Mock users data
const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    status: "online",
    lastSeen: "Now",
    unreadMessages: 3,
    role: "Customer",
    location: "New York, USA",
    phone: "+1 234 567 8901",
    joinedDate: "2024-01-15",
    totalOrders: 12,
    totalSpent: 2540.99,
    rating: 4.8,
    verified: true,
    bio: "Tech enthusiast and frequent online shopper. Love discovering new gadgets and electronics.",
    lastMessage: {
      text: "Hi, I need help with my recent order",
      time: "2 min ago",
      sender: "user"
    }
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    status: "offline",
    lastSeen: "2 hours ago",
    unreadMessages: 0,
    role: "Vendor",
    location: "London, UK",
    phone: "+44 123 456 789",
    joinedDate: "2023-12-20",
    totalOrders: 156,
    rating: 4.9,
    verified: true,
    bio: "Fashion boutique owner specializing in sustainable and eco-friendly clothing.",
    lastMessage: {
      text: "Thanks for the quick response!",
      time: "1 day ago",
      sender: "admin"
    }
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    status: "away",
    lastSeen: "30 min ago",
    unreadMessages: 1,
    role: "Customer",
    location: "Toronto, Canada",
    phone: "+1 416 555 0123",
    joinedDate: "2024-02-10",
    totalOrders: 8,
    totalSpent: 899.50,
    rating: 4.5,
    verified: false,
    bio: "Sports enthusiast looking for quality equipment and gear.",
    lastMessage: {
      text: "When will my order be shipped?",
      time: "30 min ago",
      sender: "user"
    }
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma.davis@example.com",
    status: "online",
    lastSeen: "Now",
    unreadMessages: 2,
    role: "Vendor",
    location: "Sydney, Australia",
    phone: "+61 2 1234 5678",
    joinedDate: "2023-11-05",
    totalOrders: 89,
    rating: 4.7,
    verified: true,
    bio: "Digital artist and handmade crafts seller. Creating unique pieces for special occasions.",
    lastMessage: {
      text: "I've updated the product listing",
      time: "5 min ago",
      sender: "user"
    }
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@example.com",
    status: "offline",
    lastSeen: "1 day ago",
    unreadMessages: 0,
    role: "Customer",
    location: "Berlin, Germany",
    phone: "+49 30 12345678",
    joinedDate: "2024-03-01",
    totalOrders: 3,
    totalSpent: 234.99,
    rating: 4.2,
    verified: false,
    bio: "New to the platform, exploring different vendors and products."
  }
];

// Mock chat messages
const mockChatMessages = [
  { id: 1, sender: "user", message: "Hello, I need help with my order", time: "10:30 AM", name: "John Doe" },
  { id: 2, sender: "admin", message: "Hi John! I'd be happy to help you. What's your order number?", time: "10:32 AM", name: "Admin" },
  { id: 3, sender: "user", message: "It's ORD-2024-001", time: "10:33 AM", name: "John Doe" },
  { id: 4, sender: "admin", message: "I can see your order. It's currently being processed and will ship tomorrow.", time: "10:35 AM", name: "Admin" }
];

export default function ChatsWithUser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(mockChatMessages);

  // Filter users based on search
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleChatClick = (user: User) => {
    setSelectedUser(user);
    setShowChatModal(true);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: "admin" as const,
        message: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        name: "Admin"
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getStatusText = (status: string, lastSeen: string) => {
    switch (status) {
      case "online": return "Online";
      case "away": return "Away";
      case "offline": return `Last seen ${lastSeen}`;
      default: return lastSeen;
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chat with Users</h1>
          <p className="text-gray-600">Connect and communicate with platform users</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredUsers.length} users available
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:border-[#20d5c7]/30 cursor-pointer"
          >
            {/* User Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#20d5c7] to-[#1bb5a7] rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserClick(user);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiMoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Status and Role */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                <span className="text-sm text-gray-600">{getStatusText(user.status, user.lastSeen)}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.role === 'Vendor' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {user.role}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-900">{user.totalOrders}</div>
                <div className="text-xs text-gray-600">Orders</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-900">{user.unreadMessages}</div>
                <div className="text-xs text-gray-600">Messages</div>
              </div>
            </div>

            {/* Last Message Preview */}
            {user.lastMessage && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Last message:</div>
                <div className="text-sm text-gray-900 truncate">{user.lastMessage.text}</div>
                <div className="text-xs text-gray-500 mt-1">{user.lastMessage.time}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChatClick(user);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white py-2 px-3 rounded-lg hover:from-[#1bb5a7] hover:to-[#179a8e] transition-all duration-300"
              >
                <FiMessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Chat</span>
                {user.unreadMessages > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {user.unreadMessages}
                  </span>
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserClick(user);
                }}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="View Profile"
              >
                <FiUser className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#20d5c7] to-[#1bb5a7] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${getStatusColor(selectedUser.status)}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                    {selectedUser.verified && (
                      <FiCheck className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.role === 'Vendor' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedUser.role}
                    </span>
                    <span className="text-sm text-gray-600">{getStatusText(selectedUser.status, selectedUser.lastSeen)}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {selectedUser.bio && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedUser.bio}</p>
                </div>
              )}

              {/* Contact Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <FiMail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium text-gray-900">{selectedUser.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiPhone className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium text-gray-900">{selectedUser.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Location</div>
                      <div className="font-medium text-gray-900">{selectedUser.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiCalendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Joined</div>
                      <div className="font-medium text-gray-900">{new Date(selectedUser.joinedDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <FiShoppingBag className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">{selectedUser.totalOrders}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  {selectedUser.totalSpent && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <FiClock className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">${selectedUser.totalSpent.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                  )}
                  {selectedUser.rating && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <FiStar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">{selectedUser.rating}</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  )}
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <FiMessageCircle className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">{selectedUser.unreadMessages}</div>
                    <div className="text-sm text-gray-600">Unread</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    handleChatClick(selectedUser);
                  }}
                  className="flex-1 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white py-3 rounded-lg hover:from-[#1bb5a7] hover:to-[#179a8e] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiMessageCircle className="w-5 h-5" />
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg h-96 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#20d5c7] to-[#1bb5a7] rounded-full flex items-center justify-center text-white font-medium">
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${getStatusColor(selectedUser.status)}`} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{selectedUser.name}</div>
                <div className="text-sm text-gray-600">{getStatusText(selectedUser.status, selectedUser.lastSeen)}</div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
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

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMessageCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}