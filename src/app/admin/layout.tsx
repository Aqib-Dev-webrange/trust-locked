import React from "react";
import Sidebar from "@/components/sidebar/sidebar";
import Header from "@/components/header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 w-64">
        <Sidebar />
      </div>
      {/* Main content with left margin for sidebar */}
      <div className="flex-1 flex flex-col ml-0 md:ml-72">
        <Header />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}