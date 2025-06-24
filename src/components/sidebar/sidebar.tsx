"use client";
import { useState, useEffect } from "react";
import SidebarItem from "./sidebarItem";
import SidebarSection from "./sidebarSection";
import { sidebarData } from "@/utils/data/sidebarData";
import Image from "next/image";
import { IMAGES } from "@/constants/image";
import { FiMenu, FiX } from "react-icons/fi";

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleClick = (label: string) => {
    setActive(label);
    // Close sidebar on mobile after clicking
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto close sidebar on mobile
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle overlay click (mobile)
  const handleOverlayClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] bg-gradient-to-r from-[#20d5c7] to-[#1bb5a7] text-white p-3 rounded-lg shadow-lg"
      >
        {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-[#081420] text-white shadow-lg z-50 transition-all duration-300 ease-in-out
          ${isMobile ? 'w-80' : 'w-72'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          rounded-r-[20px] lg:rounded-r-[20px]
        `}
      >
        <div className="h-full overflow-y-auto p-6 space-y-2">
          {/* Close button for mobile (top right) */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 lg:hidden text-white hover:text-gray-300 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          )}

          {/* Logo */}
          <div className="flex justify-center items-center text-4xl font-bold mb-6 mt-4 lg:mt-0">
            <Image 
              src={IMAGES.logo}
              alt="Logo"
              width={800}
              height={800}
              className={`object-cover transition-all duration-300 ${
                isMobile ? 'w-28 h-28' : 'w-36 h-36'
              }`}
            />
          </div>

          {/* Sidebar Items */}
          <div className="space-y-2">
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
          </div>
        </div>
      </aside>
    </>
  );
}
