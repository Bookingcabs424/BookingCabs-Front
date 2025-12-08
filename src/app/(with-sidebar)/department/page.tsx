"use client";
import DepartmentForm from "../../../components/DepartmentForm";
import DepartmentTable from "../../../components/DepartmentTable";
import RoleSettingForm from "../../../components/RoleSettingForm";
import { useState } from "react";

export default function DepartmentPage() {
  const [activeDepartmentForm, setActiveDepartmentForm] =
    useState<string>("DepartmentList");
  return (
    <div className="bg-gray-100 min-h-screen">
      {activeDepartmentForm === "DepartmentList" ? (
        <DepartmentTable
          activeDepartmentForm={activeDepartmentForm}
          setActiveDepartmentForm={setActiveDepartmentForm}
        />
      ) : (
        <DepartmentForm
          activeDepartmentForm={activeDepartmentForm}
          setActiveDepartmentForm={setActiveDepartmentForm}
        />
      )}
    </div>
  );
}
