"use client";

import { useState } from "react";
import EditProfileStaffForm from "./EditProfileStaffForm";
import EditUserLoginStaffForm from "./EditUserLoginStaffForm";
import EditDutyInfoStaffForm from "./EditDutyInfoStaffForm";
import EditSignatureStaffForm from "./EditSignatureStaffForm";

const profileNavBtns = [
  { key: "profile", label: "Profile" },
  { key: "user_login", label: "User Login" },
  { key: "duty_info", label: "Duty Information" },
  { key: "sign", label: "Signature" },
];
export default function EditStaffForm() {
  const [editStaffForm, setEditStaffForm] = useState<string>("profile");

  return (
    <div className="bg-white">
      <div className="flex gap-6 px-4 py-6 flex-col lg:flex-row">
        {/* Left Navigation Bar */}
        <div className="left-bar lg:pl-4 ">
          <ul className="grid grid-cols-3 sm:flex sm:items-start sm:flex-row lg:flex-col">
            {profileNavBtns.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setEditStaffForm(key)}
                className={`border h-12 max-w-[200px] sm:w-[200px] text-start px-3 border-gray-300 cursor-pointer text-[12px] font-[500] ${
                  editStaffForm === key ? "bg-[#101828] text-white" : "bg-white"
                }`}
              >
                {label}
              </button>
            ))}
          </ul>
        </div>

        {editStaffForm === "profile" && <EditProfileStaffForm />}
        {editStaffForm === "user_login" && <EditUserLoginStaffForm />}
        {editStaffForm === "duty_info" && <EditDutyInfoStaffForm />}
        {editStaffForm === "sign" && <EditSignatureStaffForm />}
      </div>
    </div>
  );
}
