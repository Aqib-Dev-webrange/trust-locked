"use client";
import React, { useEffect, useState } from "react";
import {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiCreditCard,
  FiStar,
  FiShoppingBag,
  FiMessageCircle,
  FiAlertCircle,
} from "react-icons/fi";
import StatusCard from "./components/statusCard";

// Dummy fetch functions
function fetchRevenueStats() {
  return Promise.resolve({
    today: 2847,
    week: 18920,
    month: 78450,
    percent: 12.5,
    progress: 75,
  });
}
function fetchRecentActivities() {
  return Promise.resolve([
    {
      icon: <FiShoppingBag className="w-4 h-4 text-green-600" />,
      bg: "bg-green-100",
      text: "New order received",
      timeAgo: "2 minutes ago",
    },
    {
      icon: <FiUsers className="w-4 h-4 text-blue-600" />,
      bg: "bg-blue-100",
      text: "New vendor registered",
      timeAgo: "15 minutes ago",
    },
    {
      icon: <FiAlertCircle className="w-4 h-4 text-yellow-600" />,
      bg: "bg-yellow-100",
      text: "Payment dispute opened",
      timeAgo: "1 hour ago",
    },
    {
      icon: <FiMessageCircle className="w-4 h-4 text-purple-600" />,
      bg: "bg-purple-100",
      text: "New support ticket",
      timeAgo: "2 hours ago",
    },
  ]);
}
function fetchPlatformMetrics() {
  return Promise.resolve({
    paymentSuccess: { value: 98.5, change: 8.2 },
    avgRating: { value: 4.8, change: 0.3 },
    retention: { value: 89.2, change: 15.7 },
  });
}

// Example: Replace statusData with dynamic data
const statusData = [
  {
    label: "Total Orders",
    count: 50, // fetched from backend
    color: "green",
  },
  {
    label: "Total Users",
    count: 100, // fetched from backend
    color: "blue",
  },
  {
    label: "Vendors",
    count: 25 , // fetched from backend
    color: "purple",
  },
  {
    label: "Disputes",
    count: 5, // fetched from backend
    color: "yellow",
  },
  {
    label: "Support Tickets",
    count: 10, // fetched from backend
    color: "red",
  },
];

export default function Dashboard() {
  // Revenue
  const [revenue, setRevenue] = useState({
    today: 0,
    week: 0,
    month: 0,
    percent: 0,
    progress: 0,
  });
  // Activities
  const [activities, setActivities] = useState<
    { icon: React.ReactNode; bg: string; text: string; timeAgo: string }[]
  >([]);
  // Metrics
  const [metrics, setMetrics] = useState({
    paymentSuccess: { value: 0, change: 0 },
    avgRating: { value: 0, change: 0 },
    retention: { value: 0, change: 0 },
  });

  useEffect(() => {
    // Fetch all dashboard data
    fetchRevenueStats().then(setRevenue);
    fetchRecentActivities().then(setActivities);
    fetchPlatformMetrics().then(setMetrics);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statusData.map((item, index) => (
          <StatusCard
            key={index}
            // icon={item.icon}
            label={item.label}
            count={item.count}
            color={item.color}
          />
        ))}
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue Overview
            </h3>
            <div className="flex items-center gap-2 text-[#20d5c7]">
              <FiTrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">+{revenue.percent}%</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Today</span>
              <span className="font-semibold text-gray-900">
                ${revenue.today.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">This Week</span>
              <span className="font-semibold text-gray-900">
                ${revenue.week.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold text-gray-900">
                ${revenue.month.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] h-2 rounded-full"
                style={{ width: `${revenue.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activities
            </h3>
            <button className="text-[#20d5c7] text-sm font-medium hover:text-[#1bb5a7]">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {activities.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 ${activity.bg} rounded-full flex items-center justify-center`}
                >
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.timeAgo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#20d5c7] to-[#1bb5a7] rounded-lg flex items-center justify-center">
              <FiCreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-green-600 font-medium">
              +{metrics.paymentSuccess.change}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {metrics.paymentSuccess.value}%
          </h3>
          <p className="text-gray-600 text-sm">Payment Success Rate</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#20d5c7] to-[#1bb5a7] rounded-lg flex items-center justify-center">
              <FiStar className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-green-600 font-medium">
              +{metrics.avgRating.change}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {metrics.avgRating.value}
          </h3>
          <p className="text-gray-600 text-sm">Average Rating</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#20d5c7] to-[#1bb5a7] rounded-lg flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-green-600 font-medium">
              +{metrics.retention.change}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {metrics.retention.value}%
          </h3>
          <p className="text-gray-600 text-sm">Customer Retention</p>
        </div>
      </div>

      {/* TrustLockd Trust Indicators */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-[#20d5c7] to-[#1bb5a7] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">TL</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              TrustLockd Platform Health
            </h3>
            <p className="text-gray-600 text-sm">
              Real-time platform security and trust metrics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900">Security Score</h4>
            <p className="text-2xl font-bold text-green-600 mb-1">A+</p>
            <p className="text-xs text-gray-500">All systems secure</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-white" />
              </div>
            </div>
            <h4 className="font-semibold text-gray-900">Trust Level</h4>
            <p className="text-2xl font-bold text-blue-600 mb-1">High</p>
            <p className="text-xs text-gray-500">Verified vendors</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <FiDollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            <h4 className="font-semibold text-gray-900">Payment Safety</h4>
            <p className="text-2xl font-bold text-purple-600 mb-1">100%</p>
            <p className="text-xs text-gray-500">Transactions secured</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <FiStar className="w-5 h-5 text-white" />
              </div>
            </div>
            <h4 className="font-semibold text-gray-900">Platform Rating</h4>
            <p className="text-2xl font-bold text-orange-600 mb-1">4.9</p>
            <p className="text-xs text-gray-500">User satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
}