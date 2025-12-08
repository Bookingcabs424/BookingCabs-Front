"use client";

import { useState } from "react";

const statusType = [
  { id: "active", label: "Active" },
  { id: "on-hold", label: "On Hold" },
  { id: "black-listed", label: "Black Listed" },
  { id: "inactive", label: "Inactive" },
  { id: "unapproved", label: "Unapproved" },
  { id: "deleted", label: "Deleted" },
];

export default function ProfileStatus() {
  const [status, setStatus] = useState<string>("active");

  const handleStatusToggle = (buttonId: string) => {
    setStatus((prev) => (prev === buttonId ? "active" : buttonId));
  };
  return (
    <div className="w-full bg-white h-full p-6">
      <label htmlFor="carrier" className="font-semibold text-[10px] text-sm">
        Status
      </label>
      <div className="grid grid-cols-2 gap-8 py-2 sm:gap-4 sm:grid-cols-3 md:flex md:items-center">
        {statusType.map((option) => (
          <div
            key={option.id}
            className="flex gap-1 items-center text-sm sm:gap-2"
          >
            <div
              onClick={() => handleStatusToggle(option.id)}
              className={`rounded-full border-2 border-gray-500 cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300
                ${status === option.id ? "justify-end" : "justify-start"}
                min-w-10 min-h-5`}
            >
              <div className="h-2.5 w-2.5 rounded-full bg-gray-500 shadow-md transition-all duration-300" />
            </div>
            <p className="text-[10px] font-[400]">{option.label}</p>
          </div>
        ))}
      </div>

      <button className="float-right bg-yellow-500 text-[10px] px-3 py-1 rounded cursor-pointer">
        Save
      </button>
    </div>
  );
}
