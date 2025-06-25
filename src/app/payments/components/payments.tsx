"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  FiSearch,
  FiFilter,
  FiDollarSign,
  FiClock,
  FiPause,
  FiDownload,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

enum OrderStatus {
  Offer = "Offer",
  PaymentConfirmed = "Payment Confirmed",
  Shipped = "Shipped",
  AwaitingReceived = "Awaiting Received",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

// Payment type definition
type Payment = {
  id: string;
  created_at: string;
  status: string;
  price: number;
  owner: {
    uid: string;
    email: string;
    ratings: number | null;
    connectId: string | null;
    created_at: string;
    display_name: string;
    stripeUserId: string | null;
    last_sign_in_at: string;
    isDocumentSubmitted: boolean;
    isConnectAccVerified: boolean;
  };
  purchaser: {
    uid: string;
    email: string;
    ratings: number | null;
    connectId: string | null;
    created_at: string;
    display_name: string;
    stripeUserId: string | null;
    last_sign_in_at: string;
    isDocumentSubmitted: boolean;
    isConnectAccVerified: boolean;
  };
};

export default function PaymentsSystem() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5;

  useEffect(() => {
    const fetchPayments = async () => {
      const { data, error } = await supabase.rpc("payments").select("*");
      if (error) {
        setPayments([]);
      } else {
        setPayments(data as Payment[]);
      }
      setLoading(false);
    };
    fetchPayments();
  }, []);

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.owner.display_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.purchaser.display_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      payment.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const indexOfLast = currentPage * paymentsPerPage;
  const indexOfFirst = indexOfLast - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirst, indexOfLast);

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Calculate totals (basic, since no type field)
  // Total Revenue: Completed + Payment Confirmed
  const totalRevenue = payments
    .filter(
      (p) =>
        p.status === OrderStatus.Completed ||
        p.status === OrderStatus.PaymentConfirmed
    )
    .reduce((sum, p) => sum + Number(p.price), 0);

  // Pending: Offer + AwaitingReceived
  const pendingAmount = payments
    .filter(
      (p) =>
        p.status === OrderStatus.Offer ||
        p.status === OrderStatus.AwaitingReceived
    )
    .reduce((sum, p) => sum + Number(p.price), 0);

  // Held: Shipped
  const heldAmount = payments
    .filter((p) => p.status === OrderStatus.Shipped)
    .reduce((sum, p) => sum + Number(p.price), 0);

  // Refunds: Cancelled
  const totalRefunds = payments
    .filter((p) => p.status === OrderStatus.Cancelled)
    .reduce((sum, p) => sum + Math.abs(Number(p.price)), 0);

  function convertToCSV(data: Payment[]) {
    const header = [
      "Order ID",
      "Owner Name",
      "Owner Email",
      "Purchaser Name",
      "Purchaser Email",
      "Amount",
      "Status",
      "Date",
    ];
    const rows = data.map((p) => [
      p.id,
      p.owner.display_name,
      p.owner.email,
      p.purchaser.display_name,
      p.purchaser.email,
      p.price,
      p.status,
      new Date(p.created_at).toLocaleDateString(),
    ]);
    return [header, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
  }

  function downloadCSV(data: Payment[]) {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

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
    <div className="p-6 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Payments</h1>
          <p className="text-gray-600">
            Monitor and manage all platform transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white px-4 py-2 rounded-lg hover:from-[#1bb5a7] hover:to-[#179a8e] transition-all duration-300"
            onClick={() => downloadCSV(filteredPayments)}
          >
            <FiDownload className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <FiTrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-800">
                ${totalRevenue.toFixed(2)}
              </div>
              <div className="text-sm text-green-600">Total Revenue</div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-3">
            <FiClock className="w-8 h-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold text-yellow-800">
                ${pendingAmount.toFixed(2)}
              </div>
              <div className="text-sm text-yellow-600">Pending</div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-3">
            <FiPause className="w-8 h-8 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-800">
                ${heldAmount.toFixed(2)}
              </div>
              <div className="text-sm text-red-600">Held</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <FiTrendingDown className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-800">
                ${totalRefunds.toFixed(2)}
              </div>
              <div className="text-sm text-blue-600">Refunds</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search transactions..."
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
            <option value={OrderStatus.Offer}>{OrderStatus.Offer}</option>
            <option value={OrderStatus.PaymentConfirmed}>
              {OrderStatus.PaymentConfirmed}
            </option>
            <option value={OrderStatus.Shipped}>{OrderStatus.Shipped}</option>
            <option value={OrderStatus.AwaitingReceived}>
              {OrderStatus.AwaitingReceived}
            </option>
            <option value={OrderStatus.Completed}>
              {OrderStatus.Completed}
            </option>
            <option value={OrderStatus.Cancelled}>
              {OrderStatus.Cancelled}
            </option>
          </select>
        </div>
      </div>

      {/* Payments Table (desktop/tablet) */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 font-semibold text-gray-900">
                Order ID
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                Owner
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                Purchaser
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                Amount
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                Status
              </th>
              <th className="text-left p-4 font-semibold text-gray-900">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-4 font-medium text-[#20d5c7]">{payment.id}</td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">
                    {payment.owner.display_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {payment.owner.email}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">
                    {payment.purchaser.display_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {payment.purchaser.email}
                  </div>
                </td>
                <td className="p-4 text-green-600 font-medium">
                  ${payment.price.toFixed(2)}
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {payment.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(payment.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payments Card View (mobile) */}
      <div className="block sm:hidden space-y-4">
        {currentPayments.map((payment) => (
          <div
            key={payment.id}
            className="bg-gray-50 rounded-xl p-4 shadow border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-[#20d5c7]">{payment.id}</div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {payment.status}
              </span>
            </div>
            <div className="mb-1">
              <span className="block text-xs text-gray-500">Owner</span>
              <span className="block font-medium text-gray-900">
                {payment.owner.display_name}
              </span>
              <span className="block text-xs text-gray-600">
                {payment.owner.email}
              </span>
            </div>
            <div className="mb-1">
              <span className="block text-xs text-gray-500">Purchaser</span>
              <span className="block font-medium text-gray-900">
                {payment.purchaser.display_name}
              </span>
              <span className="block text-xs text-gray-600">
                {payment.purchaser.email}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div>
                <span className="block text-xs text-gray-500">Amount</span>
                <span className="block text-green-600 font-semibold">
                  ${payment.price.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="block text-xs text-gray-500">Date</span>
                <span className="block text-gray-600">
                  {new Date(payment.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {currentPayments.length} of {filteredPayments.length} payments
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-[#20d5c7] text-white rounded-lg text-sm">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiDollarSign className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No payments found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
