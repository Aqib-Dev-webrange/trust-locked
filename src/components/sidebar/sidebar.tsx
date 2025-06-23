"use client";
import { useState } from "react";
import SidebarItem from "./sidebarItem";
import SidebarSection from "./sidebarSection";
import { sidebarData } from "@/utils/data/sidebarData";
import Image from "next/image";
import { IMAGES } from "@/constants/image";

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");
  const handleClick = (label: string) => setActive(label);

  return (
    <aside className="absolute w-80 h-screen bg-[#1a2332] text-white p-6 rounded-[20px] space-y-2 border border-[#2a3441]">
      {/* Logo */}
      <div className="flex justify-center items-center text-4xl font-bold rounded-xl mb-10 mt-2 mx-auto w-[190px] h-[86px] bg-gradient-to-br from-[#20d5c7] to-[#1bb5a7] p-4">
        <Image 
          src={IMAGES.logo}
          alt="Logo"
          width={100}
          height={100}
          className="w-20 h-20 object-cover"
        />
      </div>

      {/* Sidebar Render */}
      {sidebarData.map((item, index) => {
        if (item.type === "item") {
          return (
            <SidebarItem
              key={index}
              label={item.label}
              icon={item.icon}
              count={item.count}
              active={active === item.label}
              link={item.link}
              onClick={() => handleClick(item.label)}
            />
          );
        }

        if (item.type === "section") {
          return (
            <SidebarSection key={index} title={item.title} icon={item.icon}>
              {item.children?.map((child, idx) => {
                if (child.type === "button") {
                  return (
                    <div
                      key={idx}
                      className="flex justify-center gap-3 items-center bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] border border-[#20d5c7] text-[1rem] py-1.5 px-3 rounded-lg cursor-pointer hover:from-[#1bb5a7] hover:to-[#179a8e] transition-all duration-300"
                    >
                      <span className="text-white font-medium">{child.label}</span>
                      <span className="text-white text-lg">+</span>
                    </div>
                  );
                }
                return (
                  <SidebarItem
                    key={idx}
                    label={child.label}
                    icon={child.icon}
                    count={child.count}
                    active={active === child.label}
                    link={child.link}
                    onClick={() => handleClick(child.label)}
                  />
                );
              })}
            </SidebarSection>
          );
        }

        return null;
      })}
    </aside>
  );
}
