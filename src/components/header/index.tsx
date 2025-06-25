"use client";

export const Header = () => {
  return (
    <header className="p-4 pb-0">
      <div className="bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold font-poppins mb-2">
              Welcome to TrustLockd Admin
            </h1>
            <p className="text-white/90">
              Monitor and manage your multi-vendor platform with confidence
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#20d5c7] font-bold text-lg">TL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
