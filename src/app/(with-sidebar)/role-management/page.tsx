"use client";
import RoleManagementTable from "../../../components/RoleManagementTable";
import RoleSettingForm from "../../../components/RoleSettingForm";
import { useState } from "react";

export default function RoleManagementPage() {
  const [activeRoleForm, setActiveRoleForm] = useState<string>("RoleList");
  return (
    <div className="bg-gray-100 min-h-screen">
      {activeRoleForm === "RoleList" ? (
        <RoleManagementTable
          activeRoleForm={activeRoleForm}
          setActiveRoleForm={setActiveRoleForm}
        />
      ) : (
        <RoleSettingForm
          activeRoleForm={activeRoleForm}
          setActiveRoleForm={setActiveRoleForm}
        />
      )}
    </div>
  );
}
