"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  FiSearch,
  FiFilter,
  FiEye,
  // FiMessageCircle,
  // FiCheck,
  FiX,
  // FiClock,
  FiAlertTriangle,
  FiCalendar,
  FiDollarSign,
  // FiSend,
} from "react-icons/fi";
import toast from "react-hot-toast";

// Dispute type definition
type Dispute = {
  id: number;
  title: string;
  customer: {
    uid: string;
    email: string;
    phone: string | null;
    connectId: string | null;
    created_at: string;
    display_name: string;
    stripeUserId: string | null;
    last_sign_in_at: string;
    profile_image_url: string | null;
    isDocumentSubmitted: boolean;
    isConnectAccVerified: boolean;
  };
  vendor: {
    uid: string;
    email: string;
    phone: string | null;
    connectId: string | null;
    created_at: string;
    display_name: string;
    stripeUserId: string | null;
    last_sign_in_at: string;
    profile_image_url: string | null;
    isDocumentSubmitted: boolean;
    isConnectAccVerified: boolean;
  };
  amount: string;
  status: string;
  date: string;
  order_id: string;
  created_at: string | null;
  updated_at: string | null;
  resolution?: string;
};

enum DisputeStatus {
  pending = "Pending Review",
  resolvedToBuyer = "Refunded to Buyer",
  resolvedToSeller = "Payment Released to Seller",
}

export default function DisputesSystem() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<DisputeStatus | "all">("all");
  // const [filterPriority, setFilterPriority] = useState("all");
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  // const [showChatModal, setShowChatModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  // const [chatMessage, setChatMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
  disputeId: number;
  newStatus: "Pending Review" | "Refunded to Buyer" | "Payment Released to Seller" | "Rejected";
} | null>(null);
  // Chat message type definition
  // type ChatMessage = {
  //   id: number;
  //   sender: "customer" | "admin" | "vendor";
  //   message: string;
  //   time: string;
  //   name: string;
  // };

  // const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const fetchDisputes = async () => {
      const { data } = await supabase.from("disputes").select("*");
      if (data) setDisputes(data as Dispute[]);
      setLoading(false);
    };
    fetchDisputes();
  }, []);

  // Filter disputes
  const filteredDisputes = disputes.filter((dispute) => {
    const matchesSearch =
      dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.customer.display_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      dispute.vendor.display_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || dispute.status === filterStatus;
    // const matchesPriority = filterPriority === "all" || dispute.priority === filterPriority;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowDetailsModal(true);
  };

  // const handleOpenChat = (dispute: Dispute) => {
  //   setSelectedDispute(dispute);
  //   setChatMessages([
  //     {
  //       id: 1,
  //       sender: "customer",
  //       message: "I need help with my dispute",
  //       time: "10:30 AM",
  //       name: dispute.customer.display_name,
  //     },
  //     {
  //       id: 2,
  //       sender: "admin",
  //       message: "I'm looking into your case. Can you provide more details?",
  //       time: "10:32 AM",
  //       name: "Admin",
  //     },
  //     {
  //       id: 3,
  //       sender: "vendor",
  //       message: "We are willing to offer a full refund",
  //       time: "10:35 AM",
  //       name: dispute.vendor.display_name,
  //     },
  //   ]);
  //   setShowChatModal(true);
  // };

  const handleResolveDispute = () => {
    if (resolutionNote.trim()) {
      setDisputes((prev) =>
        prev.map((dispute) =>
          selectedDispute && dispute.id === selectedDispute.id
            ? {
                ...dispute,
                status: "resolvedToBuyer", // or "resolvedToSeller" depending on your logic
                resolution: resolutionNote,
                updated_at: new Date().toISOString(),
              }
            : dispute
        )
      );
      setResolutionNote("");
      setShowDetailsModal(false);
    }
  };

  // const handleSendMessage = () => {
  //   if (chatMessage.trim()) {
  //     const newMessage: ChatMessage = {
  //       id: chatMessages.length + 1,
  //       sender: "admin",
  //       message: chatMessage,
  //       time: new Date().toLocaleTimeString([], {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //       }),
  //       name: "Admin",
  //     };
  //     setChatMessages([...chatMessages, newMessage]);
  //     setChatMessage("");
  //   }
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case DisputeStatus.pending:
        return "bg-yellow-100 text-yellow-800";
      case DisputeStatus.resolvedToBuyer:
        return "bg-green-100 text-green-800";
      case DisputeStatus.resolvedToSeller:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":
        return DisputeStatus.pending;
      case "resolvedToBuyer":
        return DisputeStatus.resolvedToBuyer;
      case "resolvedToSeller":
        return DisputeStatus.resolvedToSeller;
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  // const getBackendStatus = (displayStatus: string) => {
  //   if (displayStatus === DisputeStatus.pending) return "Pending Review";
  //   if (displayStatus === DisputeStatus.resolvedToBuyer) return "Refunded to Buyer";
  //   if (displayStatus === DisputeStatus.resolvedToSeller) return "Payment Released to Seller";
  //   if (displayStatus === "Rejected") return "Rejected";
  //   return "Pending Review";
  // };

  // const getPriorityColor = (priority: string) => {
  //   switch (priority) {
  //     case "high": return "bg-red-100 text-red-800";
  //     case "medium": return "bg-yellow-100 text-yellow-800";
  //     case "low": return "bg-green-100 text-green-800";
  //     default: return "bg-gray-100 text-gray-800";
  //   }
  // };
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
            className="opacity-50"
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
  const handleStatusChangeRequest = (
    disputeId: number,
    newStatus: "Pending Review" | "Refunded to Buyer" | "Payment Released to Seller" | "Rejected"
  ) => {
    setPendingStatusChange({ disputeId, newStatus });
    setShowConfirmModal(true);
  };

  const handleConfirmStatusChange = async () => {
    if (pendingStatusChange) {
      const { error } = await supabase
        .from("disputes")
        .update({
          status: pendingStatusChange.newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", pendingStatusChange.disputeId)
        .select();

      if (!error) {
        setDisputes((prev) =>
          prev.map((dispute) =>
            dispute.id === pendingStatusChange.disputeId
              ? {
                  ...dispute,
                  status: pendingStatusChange.newStatus,
                  updated_at: new Date().toISOString(),
                }
              : dispute
          )
        );
        toast.success("Status changed successfully!");
      } else {
        console.error("Failed to update status:", error.message);
        toast.error("Failed to change status.");
      }
    }
    setShowConfirmModal(false);
    setPendingStatusChange(null);
  };

  const handleCancelStatusChange = () => {
    setShowConfirmModal(false);
    setPendingStatusChange(null);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dispute System</h1>
          <p className="text-gray-600">Manage and resolve customer disputes</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            {filteredDisputes.length} disputes found
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-3">
            <FiClock className="w-8 h-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold text-yellow-800">
                {disputes.filter((d) => d.status === "pending").length}
              </div>
              <div className="text-sm text-yellow-600">Pending</div>
            </div>
          </div>
        </div> */}

        {/* <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <FiCheck className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-800">
                {disputes.filter((d) => d.status === "resolvedToBuyer" || d.status === "resolvedToSeller").length}
              </div>
              <div className="text-sm text-green-600">Resolved</div>
            </div>
          </div>
        </div> */}
        {/* rejected */}
        {/* <div className="bg-red-50 p-4 rounded-lg border border-red-200 ">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-800">
                {disputes.filter((d) => d.status === "rejected").length}
              </div>
              <div className="text-sm text-red-600">Rejected</div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search disputes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-400 w-5 h-5" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as DisputeStatus | "all")}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
          >
            <option value="all">All Status</option>
            <option value={DisputeStatus.pending}>{DisputeStatus.pending}</option>
            <option value={DisputeStatus.resolvedToBuyer}>{DisputeStatus.resolvedToBuyer}</option>
            <option value={DisputeStatus.resolvedToSeller}>{DisputeStatus.resolvedToSeller}</option>
          </select>
        </div>

        {/* <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select> */}
      </div>

      {/* Disputes Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 font-semibold text-gray-900">
                Dispute ID
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                Order
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                Customer
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                Vendor
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                Amount
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                Status
              </th>
              {/* <th className="text-left p-4 font-semibold text-gray-900">Priority</th> */}
              <th className="text-left p-4 font-semibold text-gray-900">
                Date
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDisputes.map((dispute) => (
              <tr
                key={dispute.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                {/* Dispute ID */}
                <td className="p-4">
                  <div className="font-medium text-[#20d5c7]">{dispute.id}</div>
                  {/* <div className="text-sm text-gray-600">Order: {dispute.order_id}</div> */}
                </td>

                {/* Title */}
                <td className="p-4">
                  <div className="font-medium text-gray-900">
                    {dispute.title}
                  </div>
                  {/* <div className="text-sm text-gray-600">{dispute.category}</div> */}
                </td>

                {/* Customer */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#20d5c7] to-[#1bb5a7] rounded-full flex items-center justify-center text-white text-sm">
                      {dispute.customer.display_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {dispute.customer.display_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {dispute.customer.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Vendor */}
                <td className="p-4">
                  <div className="font-medium text-gray-900">
                    {dispute.vendor.display_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {dispute.vendor.email}
                  </div>
                </td>

                {/* Amount */}
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <FiDollarSign className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {parseFloat(dispute.amount).toFixed(2)}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <select
                    value={getStatusDisplay(dispute.status)}
                    onChange={(e) => {
                      handleStatusChangeRequest(
                        dispute.id,
                        e.target.value as "Pending Review" | "Refunded to Buyer" | "Payment Released to Seller" | "Rejected"
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium border-0 outline-none cursor-pointer ${getStatusColor(
                      dispute.status
                    )}`}
                  >
                    <option value={DisputeStatus.pending}>{DisputeStatus.pending}</option>
                    <option value={DisputeStatus.resolvedToBuyer}>{DisputeStatus.resolvedToBuyer}</option>
                    <option value={DisputeStatus.resolvedToSeller}>{DisputeStatus.resolvedToSeller}</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>

                {/* Priority */}
                {/* <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(dispute.priority)}`}>
                    {dispute.priority.charAt(0).toUpperCase() + dispute.priority.slice(1)}
                  </span>
                </td> */}

                {/* Date */}
                <td className="p-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <FiCalendar className="w-4 h-4" />
                    <span>{new Date(dispute.date).toLocaleDateString()}</span>
                  </div>
                  {/* <div className="text-xs text-gray-500">Updated: {new Date(dispute.updated_at!).toLocaleDateString()}</div> */}
                </td>

                {/* Actions */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(dispute)}
                      className="p-2 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white rounded-lg hover:from-[#1bb5a7] hover:to-[#179a8e] transition-all duration-300"
                      title="View Details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>

                    {/* <button
                      onClick={() => handleOpenChat(dispute)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Open Chat"
                    >
                      <FiMessageCircle className="w-4 h-4 text-gray-600" />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Dispute Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Dispute ID
                  </label>
                  <div className="text-[#20d5c7] font-medium">
                    {selectedDispute.id}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Order ID
                  </label>
                  <div className="text-gray-900">
                    {selectedDispute.order_id}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <div className="text-gray-900">
                    ${parseFloat(selectedDispute.amount).toFixed(2)}
                  </div>
                </div>
                {/* <div>
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <div className="text-gray-900">{selectedDispute.category}</div>
                </div> */}
              </div>

              {/* Description */}
              {/* <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-900">
                  {selectedDispute.description}
                </div>
              </div> */}

              {/* Evidence */}
              {/* <div>
                <label className="text-sm font-medium text-gray-700">Evidence</label>
                <div className="mt-1 space-y-2">
                  {selectedDispute.evidence.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <div className="text-sm text-gray-900">{file}</div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Resolution */}
              {(selectedDispute.status === "resolvedToBuyer" || selectedDispute.status === "resolvedToSeller") ? (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Resolution
                  </label>
                  <div className="mt-1 p-3 bg-green-50 rounded-lg text-green-800">
                    {selectedDispute.resolution}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Resolution Notes
                  </label>
                  <textarea
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Enter resolution details..."
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
                    rows={4}
                  />
                  <button
                    onClick={handleResolveDispute}
                    className="mt-2 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white px-4 py-2 rounded-lg hover:from-[#1bb5a7] hover:to-[#179a8e] transition-all duration-300"
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal
      {showChatModal && selectedDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg h-96 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">
                  Dispute Chat: {selectedDispute.id}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedDispute.title}
                </div>
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
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      msg.sender === "admin"
                        ? "bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white"
                        : msg.sender === "customer"
                        ? "bg-blue-100 text-blue-900"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">{msg.name}</div>
                    <div className="text-sm">{msg.message}</div>
                    <div
                      className={`text-xs mt-1 ${
                        msg.sender === "admin"
                          ? "text-white/70"
                          : "text-gray-500"
                      }`}
                    >
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
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
      )} */}

      {/* Empty State */}
      {filteredDisputes.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertTriangle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No disputes found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
      
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Confirm Status Change
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to change the status to{" "}
              <span className="font-semibold text-[#20d5c7]">
                {pendingStatusChange?.newStatus
                  ? getStatusDisplay(pendingStatusChange.newStatus)
                  : ""}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelStatusChange}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                className="px-4 py-2 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white rounded-lg hover:from-[#1bb5a7] hover:to-[#179a8e] transition-all duration-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
