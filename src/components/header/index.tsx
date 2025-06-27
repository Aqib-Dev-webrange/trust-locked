"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FiUser, 
  // FiShield, 
  FiLogOut } from "react-icons/fi";

export const Header = () => {
  const adminName = "Aqib ";
  // const adminRole = "Super Admin";
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      setShowLogoutModal(false);
      setTimeout(() => {
        router.push("/auth/login");
        // fallback for hard reload
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 500);
      }, 300);
    }
  };

  return (
    <header className="p-4 pb-0">
      <div className="bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] rounded-xl p-6 text-white ">
        <div className="flex items-center justify-between">
          {/* Left: Title and subtitle */}
          <div className="hidden md:block">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#20d5c7] font-bold text-md">TL</span>
              </div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-center">
            <h1 className="text-3xl font-semibold text-center font-poppins  gap-2">
              Welcome to TrustLockd Admin
            </h1>
            {/* <p className="text-white/90">
              Monitor and manage your multi-vendor platform with confidence
            </p> */}
          </div>
          {/* Right: Admin info and logout */}
          <div className="lg:flex items-center gap-4 mt-3 sm:mt-0 hidden md:block">
            <div className="text-left flex flex-col gap-2 items-left p-2">
              <div className="flex items-center gap-1 font-semibold">
                <FiUser className="w-5 h-5 text-white/80" />
                {adminName}
              </div>
              {/* <div className="flex gap-1 text-xs text-white/80">
                <FiShield className="w-5 h-5" />
                {adminRole}
              </div> */}
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="ml-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium flex items-center gap-2 transition"
            >
              <FiLogOut className="w-5 h-5 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-xs shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Confirm Logout
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white font-medium hover:from-[#1bb5a7] hover:to-[#179a8e] transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
