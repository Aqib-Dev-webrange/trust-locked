import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/sidebar/sidebar";
import { Poppins } from "next/font/google";

const fontPoppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "TrustLockd Admin Panel",
  description: "Multi-vendor admin panel for TrustLockd platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontPoppins.variable}>
      <body className={`${fontPoppins.className} antialiased text-black bg-gray-50`}>
        <div className="flex min-h-screen">
          {/* Fixed Sidebar */}
          <div className="fixed top-0 left-0 h-full w-80 z-50 bg-white shadow-lg">
            <Sidebar />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 ml-80">
            {/* Header */}
            <header className="p-6 pb-0">
              <div className="bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] rounded-xl p-6 text-white mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Welcome to TrustLockd Admin</h1>
                    <p className="text-white/90">Monitor and manage your multi-vendor platform with confidence</p>
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
            
            {/* Page Content */}
            <main className="px-6 pb-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
