// components/SidebarItem.jsx
"use client";
import Link from "next/link";
import React from "react";

interface SidebarItemProps {
  label: string;
  icon?: React.ReactNode;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  link: string;
}
export default function SidebarItem({ label, icon, count, active, link, onClick }: SidebarItemProps) {
  return (
    <Link href={link} onClick={onClick}>
      <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
        active 
          ? 'bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white shadow-lg' 
          : 'hover:bg-[#2a3441] text-gray-300 hover:text-white'
      }`}>
        <span className={active ? 'text-white' : 'text-[#20d5c7]'}>{icon}</span>
        <span className="font-medium">{label}</span>
        {count && (
          <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
            active 
              ? 'bg-white/20 text-white' 
              : 'bg-[#20d5c7]/20 text-[#20d5c7]'
          }`}>
            {count}
          </span>
        )}
      </div>
    </Link>
  );
}
