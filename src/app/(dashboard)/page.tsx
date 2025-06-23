import { statusData } from "@/utils/data/statusData";
import StatusCard from "./components/statusCard";
import { 
  FiTrendingUp, 
  FiUsers, 
  FiShoppingBag, 
  FiDollarSign,
  FiMessageCircle,
  FiAlertCircle,
  FiCreditCard,
  FiStar
} from "react-icons/fi";

export default function Dashboard() {
  
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Header with TrustLockd Branding */}
      

      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statusData.map((item, index) => (
          <StatusCard
            key={index}
            icon={item.icon}
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
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <div className="flex items-center gap-2 text-[#20d5c7]">
              <FiTrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">+12.5%</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Today</span>
              <span className="font-semibold text-gray-900">$2,847.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">This Week</span>
              <span className="font-semibold text-gray-900">$18,920.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold text-gray-900">$78,450.00</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <button className="text-[#20d5c7] text-sm font-medium hover:text-[#1bb5a7]">
              View All
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FiShoppingBag className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New order received</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FiUsers className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New vendor registered</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <FiAlertCircle className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Payment dispute opened</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FiMessageCircle className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New support ticket</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
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
            <span className="text-sm text-green-600 font-medium">+8.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">98.5%</h3>
          <p className="text-gray-600 text-sm">Payment Success Rate</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#20d5c7] to-[#1bb5a7] rounded-lg flex items-center justify-center">
              <FiStar className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-green-600 font-medium">+0.3</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">4.8</h3>
          <p className="text-gray-600 text-sm">Average Rating</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#20d5c7] to-[#1bb5a7] rounded-lg flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-green-600 font-medium">+15.7%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">89.2%</h3>
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
            <h3 className="text-lg font-semibold text-gray-900">TrustLockd Platform Health</h3>
            <p className="text-gray-600 text-sm">Real-time platform security and trust metrics</p>
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