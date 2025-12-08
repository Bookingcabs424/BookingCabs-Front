"use client";
import AddMembershipForm from "../../../components/AddMembershipForm";
import MembershipPackageTable from "../../../components/MembershipPackageTable";
import { useState } from "react";

export default function MembershipPackagePage() {
  const [activeForm, setActiveForm] = useState<string>("package");
  return (
    <div className="bg-gray-100 min-h-screen">
      {activeForm === "package" ? (
        <MembershipPackageTable
          activeForm={activeForm}
          setActiveForm={setActiveForm}
        />
      ) : (
        <AddMembershipForm
          activeForm={activeForm}
          setActiveForm={setActiveForm}
        />
      )}
    </div>
  );
}
