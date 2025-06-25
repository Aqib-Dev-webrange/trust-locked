import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/sidebar/sidebar";
import { Poppins } from "next/font/google";
import Header from "@/components/header";

const fontPoppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "TrustLockd Admin Panel",
  description: "Multi-vendor admin panel for TrustLockd platform",
  icons: {
    icon: "/images/logo.png", // <-- Correct path for favicon
  },
};

//change the favicon use image from public folder

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontPoppins.variable}>
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${fontPoppins.className} antialiased text-black bg-gray-50`}>
        <div className="flex min-h-screen">
          {/* Fixed Sidebar */}
          <div className="fixed top-0 left-0 h-full w-80 z-50 ">
            <Sidebar />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 lg:ml-72">
            {/* Header */}
            <Header />
            {/* Page Content */}
            <main className="px-4 pb-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
