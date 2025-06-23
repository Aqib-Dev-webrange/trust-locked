// components/SidebarSection.jsx
"use client";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function SidebarSection({ title, icon ,children }: SidebarSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full text-sm px-4 py-2 text-left"
      >
        <div className="flex items-center gap-2">
          { icon}
          <span>{title}</span>
          
        </div>
        <ChevronRightIcon className={`w-4 h-4 transform transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && <div className="space-y-1 pl-6">{children}</div>}
    </div>
  );
}

