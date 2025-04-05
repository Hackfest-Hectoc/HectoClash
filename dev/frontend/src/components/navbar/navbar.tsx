import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar() {



  const location = useLocation();
  return (
    <div className=" flex  bg-green-900/20  backdrop-blur-sm flex-row justify-center shadow-md w-full max-w-[220px] max-xl:max-w-[200px] max-md:max-w-[60px] border-r-4 border-rounded-md border-green-900/20 rounded-r-md">
      <div className="w-[262px] h-auto min-h-screen relative max-md:w-full">
        {/* Logo */}
        <div className="flex items-center h-[88px] gap-2 p-4">
          <img
            className="w-[31px] h-[37px] object-cover"
            alt="Logo"
            src="https://c.animaapp.com/qPkGEBgG/img/image-1@2x.png"
          />
          <p className="text-[22px] font-extrabold text-white tracking-wide max-md:hidden">
            <span>Hecto</span>
            <span className="text-[#a9f99e]">Clash</span>
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="mt-20 space-y-4">
          {/* Home */}
          <NavItem
            label="Home"
            icon="https://c.animaapp.com/qPkGEBgG/img/vector.png"
            isActive={location.pathname === "/home"}
          />
          {/* Settings */}
          <NavItem
            label="Settings"
            icon="https://c.animaapp.com/qPkGEBgG/img/ant-design-setting-outlined.svg"
            isActive={location.pathname === "/settings"}
          />
          {/* Profile */}
          <NavItem
            label="Profile"
            icon="https://c.animaapp.com/qPkGEBgG/img/group@2x.png"
            isActive={location.pathname === "/profile"}
          />
          {/* Leader Board */}
          <NavItem
            label="LeaderBoard"
            icon="https://c.animaapp.com/qPkGEBgG/img/material-symbols-leaderboard-outline-rounded.svg"
            isActive={location.pathname === "/leaderboard"}
          />
        </nav>
      </div>
    </div>
  );
}
const NavItem = ({ label, icon, isActive }: { label: string; icon: string; isActive?: boolean }) => {
  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
  };
    return (

      <div
      onClick={() => handleNavigation(label.toLowerCase())}
        className={`flex items-center gap-4 mr-2 px-4 py-2 rounded-r-lg
          ${
          isActive
            ? "bg-gradient-to-r from-[#69c8c1] to-[#a9f99e] text-black"
            : "bg-gray-700 text-white hover:bg-gradient-to-r hover:from-[#69c8c1] hover:to-[#a9f99e] hover:text-black"
        } transition-all duration-300`}
      >
        <img className="w-5 h-5" alt={label} src={icon} />
        <span className="text-lg font-semibold   max-md:hidden ">
          {label}
        </span>
      </div>
    );
  };