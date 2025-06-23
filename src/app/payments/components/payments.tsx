"use client";
import { useState } from "react";
import { 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiDollarSign, 
  FiCreditCard, 
  FiClock, 
  FiX, 
  FiPause, 
  FiPlay,
  FiDownload,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertCircle
} from "react-icons/fi";

// Payment type definition
type Payment = {
  id: number;
  transactionId: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    id: number;
  };
  vendor: {
    name: string;
    email: string;
    id: number;
  };
  amount: number;
  fee: number;
  netAmount: number;
  paymentMethod: string;
  status: "completed" | "pending" | "held" | "refunded" | "failed" | "processing";
  type: "payment" | "refund" | "chargeback";
  currency: string;
  gateway: string;
  createdDate: string;
  processedDate: string | null;
  holdReason?: string;
  refundReason?: string;
  notes?: string;
};

// Mock payment data
const mockPayments: Payment[] = [
  {
    id: 1,
    transactionId: "TXN-2024-001",
    orderId: "ORD-2024-001",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      id: 101
    },
    vendor: {
      name: "Tech Store Plus",
      email: "contact@techstore.com",
      id: 201
    },
    amount: 299.99,
    fee: 8.99,
    netAmount: 291.00,
    paymentMethod: "Credit Card",
    status: "completed",
    type: "payment",
    currency: "USD",
    gateway: "Stripe",
    createdDate: "2024-06-20",
    processedDate: "2024-06-20"
  },
  {
    id: 2,
    transactionId: "TXN-2024-002",
    orderId: "ORD-2024-002",
    customer: {
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      id: 102
    },
    vendor: {
      name: "Electronics Hub",
      email: "support@electronicshub.com",
      id: 202
    },
    amount: 149.99,
    fee: 4.49,
    netAmount: 145.50,
    paymentMethod: "PayPal",
    status: "held",
    type: "payment",
    currency: "USD",
    gateway: "PayPal",
    createdDate: "2024-06-21",
    processedDate: null,
    holdReason: "Suspicious activity detected"
  },
  {
    id: 3,
    transactionId: "TXN-2024-003",
    orderId: "ORD-2024-003",
    customer: {
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      id: 103
    },
    vendor: {
      name: "Fashion World",
      email: "info@fashionworld.com",
      id: 203
    },
    amount: 79.99,
    fee: 2.39,
    netAmount: 77.60,
    paymentMethod: "Credit Card",
    status: "pending",
    type: "payment",
    currency: "USD",
    gateway: "Stripe",
    createdDate: "2024-06-22",
    processedDate: null
  },
  {
    id: 4,
    transactionId: "REF-2024-001",
    orderId: "ORD-2024-004",
    customer: {
      name: "Emma Davis",
      email: "emma.davis@example.com",
      id: 104
    },
    vendor: {
      name: "Digital Services Co",
      email: "billing@digitalservices.com",
      id: 204
    },
    amount: -49.99,
    fee: 0,
    netAmount: -49.99,
    paymentMethod: "Credit Card",
    status: "refunded",
    type: "refund",
    currency: "USD",
    gateway: "Stripe",
    createdDate: "2024-06-23",
    processedDate: "2024-06-23",
    refundReason: "Customer not satisfied"
  },
  {
    id: 5,
    transactionId: "TXN-2024-005",
    orderId: "ORD-2024-005",
    customer: {
      name: "David Brown",
      email: "david.brown@example.com",
      id: 105
    },
    vendor: {
      name: "Home Goods Store",
      email: "orders@homegoods.com",
      id: 205
    },
    amount: 199.99,
    fee: 5.99,
    netAmount: 194.00,
    paymentMethod: "Bank Transfer",
    status: "processing",
    type: "payment",
    currency: "USD",
    gateway: "Bank",
    createdDate: "2024-06-23",
    processedDate: null
  }
];

export default function PaymentsSystem() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [holdReason, setHoldReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesType = filterType === "all" || payment.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate totals
  const totalRevenue = payments.filter(p => p.type === 'payment' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalRefunds = payments.filter(p => p.type === 'refund').reduce((sum, p) => sum + Math.abs(p.amount), 0);
  const heldAmount = payments.filter(p => p.status === 'held').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  const handleHoldPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowHoldModal(true);
  };

  const handleReleasePayment = (paymentId: number) => {
    setPayments(prev => 
      prev.map(payment => 
        payment.id === paymentId 
          ? { 
              ...payment, 
              status: "completed", 
              processedDate: new Date().toISOString().split('T')[0],
              holdReason: undefined
            }
          : payment
      )
    );
  };

  const handleRefundPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setRefundAmount(payment.amount.toString());
    setShowRefundModal(true);
  };

  const confirmHold = () => {
    if (selectedPayment && holdReason.trim()) {
      setPayments(prev => 
        prev.map(payment => 
          payment.id === selectedPayment.id 
            ? { ...payment, status: "held", holdReason: holdReason }
            : payment
        )
      );
      setHoldReason("");
      setShowHoldModal(false);
    }
  };

  const confirmRefund = () => {
    if (selectedPayment && refundAmount && refundReason.trim()) {
      const refundTransaction: Payment = {
        id: payments.length + 1,
        transactionId: `REF-${Date.now()}`,
        orderId: selectedPayment.orderId,
        customer: selectedPayment.customer,
        vendor: selectedPayment.vendor,
        amount: -parseFloat(refundAmount),
        fee: 0,
        netAmount: -parseFloat(refundAmount),
        paymentMethod: selectedPayment.paymentMethod,
        status: "refunded",
        type: "refund",
        currency: selectedPayment.currency,
        gateway: selectedPayment.gateway,
        createdDate: new Date().toISOString().split('T')[0],
        processedDate: new Date().toISOString().split('T')[0],
        refundReason: refundReason
      };
      
      setPayments(prev => [refundTransaction, ...prev]);
      setRefundAmount("");
      setRefundReason("");
      setShowRefundModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "held": return "bg-red-100 text-red-800";
      case "refunded": return "bg-blue-100 text-blue-800";
      case "failed": return "bg-red-100 text-red-800";
      case "processing": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "payment": return <FiTrendingUp className="w-4 h-4 text-green-600" />;
      case "refund": return <FiTrendingDown className="w-4 h-4 text-red-600" />;
      case "chargeback": return <FiAlertCircle className="w-4 h-4 text-orange-600" />;
      default: return <FiDollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">Monitor and manage all platform transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white px-4 py-2 rounded-lg hover:from-[#1bb5a7] hover:to-[#179a8e] transition-all duration-300">
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="held">Held</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
            <option value="processing">Processing</option>
          </select>
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
        >
          <option value="all">All Types</option>
          <option value="payment">Payments</option>
          <option value="refund">Refunds</option>
          <option value="chargeback">Chargebacks</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 font-semibold text-gray-900">Transaction</th>
              <th className="text-left p-4 font-semibold text-gray-900">Customer</th>
              <th className="text-left p-4 font-semibold text-gray-900">Vendor</th>
              <th className="text-left p-4 font-semibold text-gray-900">Amount</th>
              <th className="text-left p-4 font-semibold text-gray-900">Method</th>
              <th className="text-left p-4 font-semibold text-gray-900">Status</th>
              <th className="text-left p-4 font-semibold text-gray-900">Date</th>
              <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                {/* Transaction */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(payment.type)}
                    <div>
                      <div className="font-medium text-[#20d5c7]">{payment.transactionId}</div>
                      <div className="text-sm text-gray-600">Order: {payment.orderId}</div>
                    </div>
                  </div>
                </td>

                {/* Customer */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#20d5c7] to-[#1bb5a7] rounded-full flex items-center justify-center text-white text-sm">
                      {payment.customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{payment.customer.name}</div>
                      <div className="text-sm text-gray-600">{payment.customer.email}</div>
                    </div>
                  </div>
                </td>

                {/* Vendor */}
                <td className="p-4">
                  <div className="font-medium text-gray-900">{payment.vendor.name}</div>
                  <div className="text-sm text-gray-600">{payment.vendor.email}</div>
                </td>

                {/* Amount */}
                <td className="p-4">
                  <div className="space-y-1">
                    <div className={`flex items-center gap-1 font-medium ${
                      payment.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <FiDollarSign className="w-4 h-4" />
                      <span>{Math.abs(payment.amount).toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Fee: ${payment.fee.toFixed(2)} | Net: ${payment.netAmount.toFixed(2)}
                    </div>
                  </div>
                </td>

                {/* Payment Method */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <FiCreditCard className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.paymentMethod}</div>
                      <div className="text-xs text-gray-600">{payment.gateway}</div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                  {payment.holdReason && (
                    <div className="text-xs text-red-600 mt-1">Hold: {payment.holdReason}</div>
                  )}
                </td>

                {/* Date */}
                <td className="p-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <FiCalendar className="w-4 h-4" />
                    <span>{payment.createdDate}</span>
                  </div>
                  {payment.processedDate && (
                    <div className="text-xs text-gray-500">Processed: {payment.processedDate}</div>
                  )}
                </td>

                {/* Actions */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white rounded-lg hover:from-[#1bb5a7] hover:to-[#179a8e] transition-all duration-300"
                      title="View Details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    
                    {payment.status === "completed" && payment.type === "payment" && (
                      <button
                        onClick={() => handleRefundPayment(payment)}
                        className="p-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Process Refund"
                      >
                        <FiTrendingDown className="w-4 h-4" />
                      </button>
                    )}
                    
                    {payment.status === "pending" && (
                      <button
                        onClick={() => handleHoldPayment(payment)}
                        className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Hold Payment"
                      >
                        <FiPause className="w-4 h-4" />
                      </button>
                    )}
                    
                    {payment.status === "held" && (
                      <button
                        onClick={() => handleReleasePayment(payment.id)}
                        className="p-2 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                        title="Release Payment"
                      >
                        <FiPlay className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Transaction ID</label>
                  <div className="text-[#20d5c7] font-medium">{selectedPayment.transactionId}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Order ID</label>
                  <div className="text-gray-900">{selectedPayment.orderId}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Amount</label>
                  <div className="text-gray-900">${selectedPayment.amount.toFixed(2)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Net Amount</label>
                  <div className="text-gray-900">${selectedPayment.netAmount.toFixed(2)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Payment Method</label>
                  <div className="text-gray-900">{selectedPayment.paymentMethod}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Gateway</label>
                  <div className="text-gray-900">{selectedPayment.gateway}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Customer</label>
                  <div className="text-gray-900">{selectedPayment.customer.name}</div>
                  <div className="text-sm text-gray-600">{selectedPayment.customer.email}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Vendor</label>
                  <div className="text-gray-900">{selectedPayment.vendor.name}</div>
                  <div className="text-sm text-gray-600">{selectedPayment.vendor.email}</div>
                </div>
              </div>

              {selectedPayment.holdReason && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Hold Reason</label>
                  <div className="mt-1 p-3 bg-red-50 rounded-lg text-red-800">
                    {selectedPayment.holdReason}
                  </div>
                </div>
              )}

              {selectedPayment.refundReason && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Refund Reason</label>
                  <div className="mt-1 p-3 bg-blue-50 rounded-lg text-blue-800">
                    {selectedPayment.refundReason}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hold Modal */}
      {showHoldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hold Payment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Hold</label>
                <textarea
                  value={holdReason}
                  onChange={(e) => setHoldReason(e.target.value)}
                  placeholder="Enter reason for holding this payment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={confirmHold}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Hold Payment
              </button>
              <button
                onClick={() => setShowHoldModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Process Refund</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  step="0.01"
                  max={selectedPayment?.amount}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Refund Reason</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Enter reason for refund..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#20d5c7] focus:border-transparent outline-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={confirmRefund}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Process Refund
              </button>
              <button
                onClick={() => setShowRefundModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiDollarSign className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}