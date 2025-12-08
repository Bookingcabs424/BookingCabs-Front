"use client";

import {
  Menu,
  Home,
  Users,
  Settings,
  CalendarX2,
  BookUser,
  CircleUserRound,
  Calendar,
  Banknote,
  X,
  Tag,
  SquareUserRound,
  ChevronUp,
  ChevronDown,
  ChartArea,
  ShieldUser,
  Building,
  ContactRound,
  Building2,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import clsx from "clsx";
import { useState } from "react";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const [activeMenus, setActiveMenus] = useState<string[]>([]);
  const toggleMenu = (label: string) => {
    setActiveMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (label: string) => activeMenus.includes(label);

  return (
    <div
      className={clsx(
        "absolute top-0 left-0 z-20 h-full overflow-y-auto bg-[#101828] transition-all duration-300 scrollbar-hide",
        isSidebarOpen ? "w-[300px]" : "lg:w-[80px] w-[0px]"
      )}
    >
      {/* Cross button always visible */}
      <div className="flex items-center justify-end p-2 lg:hidden ">
        <button
          className="p-2 cursor-pointer rounded-full hover:bg-[#3c4557]"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* App title — show only when open */}
      {isSidebarOpen && (
        <div className="p-6 text-2xl font-bold border-b border-gray-600 text-white">
          BookingCabs
        </div>
      )}
      {!isSidebarOpen && (
        <div className="p-6 text-2xl font-bold border-b border-gray-600 text-white">
          🚗
        </div>
      )}

      <nav className="flex-1 p-2 space-y-2 flex flex-col">
        <SidebarItem
          icon={Home}
          label={isSidebarOpen ? "Dashboard" : ""}
          href="/dashboard"
        />

        {/* Quotation Menu */}
        <div>
          <button
            className="flex items-center cursor-pointer text-sm justify-between w-full px-3 py-2 text-left hover:bg-gray-800 text-gray-300 rounded"
            onClick={() => toggleMenu("Quotation")}
          >
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              {isSidebarOpen && <span>Quotation</span>}
            </div>
            {isSidebarOpen &&
              (isActive("Quotation") ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              ))}
          </button>
          {isSidebarOpen && isActive("Quotation") && (
            <div className="pl-5 mt-1 text-sm space-y-1 text-gray-300">
              <SidebarItem
                icon={Calendar}
                label="Transport"
                href="/transport"
              />
            </div>
          )}
        </div>

        {/* Repeat this pattern for all expandable sections */}

        {/* cancellation deadline */}
        <SidebarItem
          icon={CalendarX2}
          label={isSidebarOpen ? "Cancellation Deadline" : ""}
          href="/cancellation-deadline"
        />

        {/* User Management */}
        <div>
          <button
            className="flex items-center cursor-pointer text-sm justify-between w-full px-3 py-2 text-left hover:bg-gray-800 text-gray-300 rounded"
            onClick={() => toggleMenu("User Management")}
          >
            <div className="flex items-center gap-2">
              <BookUser size={18} />
              {isSidebarOpen && <span>User Management</span>}
            </div>
            {isSidebarOpen &&
              (isActive("User Management") ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              ))}
          </button>
          {isSidebarOpen && isActive("User Management") && (
            <div className="pl-5 mt-1 text-sm space-y-1 text-gray-300">
              {/* <SidebarItem
                icon={CircleUserRound}
                label="Add Users"
                href="/add-user"
              /> */}
              <SidebarItem icon={Users} label="Users" href="/user" />
            </div>
          )}
        </div>
        {/* staff */}
        <div>
          <button
            className="flex items-center cursor-pointer text-sm justify-between w-full px-3 py-2 text-left hover:bg-gray-800 text-gray-300 rounded"
            onClick={() => toggleMenu("Staff")}
          >
            <div className="flex items-center gap-2">
              <BookUser size={18} />
              {isSidebarOpen && <span>Staff</span>}
            </div>
            {isSidebarOpen &&
              (isActive("Staff") ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              ))}
          </button>
          {isSidebarOpen && isActive("Staff") && (
            <div className="pl-5 mt-1 text-sm space-y-1 text-gray-300">
              <SidebarItem icon={Users} label="Staff" href="/add-staff" />
              <SidebarItem
                icon={CircleUserRound}
                label="Role Management"
                href="/role-management"
              />
              <SidebarItem
                icon={Building2}
                label="Department"
                href="/department"
              />
            </div>
          )}
        </div>

        {/* Finance */}
        <div>
          <button
            className="flex items-center cursor-pointer text-sm justify-between w-full px-3 py-2 text-left hover:bg-gray-800 text-gray-300 rounded"
            onClick={() => toggleMenu("Finance")}
          >
            <div className="flex items-center gap-2">
              <Banknote size={18} />
              {isSidebarOpen && <span>Finance</span>}
            </div>
            {isSidebarOpen &&
              (isActive("Finance") ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              ))}
          </button>
          {isSidebarOpen && isActive("Finance") && (
            <div className="pl-5 mt-1 text-sm space-y-1 text-gray-300">
              <SidebarItem
                icon={ChartArea}
                label="Statement of Account"
                href="/statement-account"
              />
            </div>
          )}
        </div>

        <SidebarItem
          icon={SquareUserRound}
          label={isSidebarOpen ? "Membership Package" : ""}
          href="/membership-package"
        />

        <SidebarItem
          icon={ContactRound}
          label={isSidebarOpen ? "Company Invites" : ""}
          href="/invites"
        />
      </nav>
    </div>
  );
};

export default Sidebar;
