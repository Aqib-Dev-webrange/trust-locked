"use client";
import Image from "next/image";
import React from "react";
import { Logout } from "../../../public/icons/icons";

interface User {
  name: string;
  role: string;
  avatarUrl: string;
}

const getCurrentDate = () => {
  const date = new Date();
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
};

const Header: React.FC<{ user: User }> = ({ user }) => {
  const firstName = user.name.split(" ")[0];

  return (
    <div className="flex justify-between items-center px-4 mb-4">
      {/* Left - Greeting */}
      <div>
        <p className="text-sm text-gray-500">{getCurrentDate()}</p>
        <h1 className="text-3xl font-bold mt-1">Good Evening, {firstName}</h1>
      </div>

      {/* Right - User Profile */}
      <div className="flex items-center gap-4 shadow border rounded-xl p-3 justify-between min-w-[250px]"
        style={{ borderWidth: 2, borderStyle: "dashed", borderColor: "#e5e7eb" }}
      >
        <Image
          src={user.avatarUrl || "/images/avatar.png"}
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full bg-slate-400 w-12 h-12 object-cover"
        />
        <div className="flex flex-col">
          <p className="font-semibold leading-none text-sm">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
        <button className="text-gray-400 hover:text-black transition">
         <Logout/>
        </button>
      </div>
    </div>
  );
};

export default Header;
