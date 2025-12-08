"use client";

import { CircleCheckBig } from "lucide-react";
import { useEffect, useState } from "react";
import ProfilePersonalForm from "../../../components/ProfilePersonalForm";
import ProfileBankForm from "../../../components/ProfileBankForm";
import ProfileCompanyForm from "../../../components/ProfileCompanyForm";
import ProfilePasswordForm from "../../../components/ProfilePasswordForm";
import ProfilePaymentForm from "../../../components/ProfilePaymentForm";
import ProfileSecurityForm from "../../../components/ProfileSecurityForm";

import UserCoworkerForm from "../../../components/UserCoworkerForm";
import ProfileVehicleForm from "../../../components/ProfileVehicleForm";
import ProfileDutyForm from "../../../components/ProfileDutyForm";
import ProfileKYCForm from "../../../components/ProfileKYCForm";
import ProfilePaymentUploadForm from "../../../components/ProfilePaymentForm";
import ProfileLicenseDetailForm from "../../../components/ProfileLicenseDetailForm";
import ProfileOtherDetailsForm from "../../../components/ProfileOtherDetailsForm";
import ProfileStatus from "../../../components/ProfileStatusFormDetails";
import ProfileSMSTable from "../../../components/ProfileSMSTable";
import ProfileEmailTable from "../../../components/ProfileEmailTable";
import ProfileStatusHistory from "../../../components/ProfileStatusHistory";
import ProfileAllocationHistory from "../../../components/ProfileAllocationHistory";
import ProfileBookingHistory from "../../../components/ProfileBookingHistory";
import ProfilePaymentHistory from "../../../components/ProfilePaymentHistory";

// const profileNavBtns = [
//   { key: "personal", label: "Personal Detail" },
//   { key: "company", label: "Company Detail" },
//   { key: "password", label: "Change Password" },
//   { key: "security", label: "Security" },
//   { key: "bank", label: "Bank Detail" },
//   { key: "friends_and_family", label: "Friends & Family" },
//   { key: "payment", label: "Payment Upload" },
//   { key: "completed", label: "Completed" },
// ];

const profileNavBtns = [
  { key: "personal-detail", label: "Personal Detail" },
  { key: "company-detail", label: "Company Detail" },
  // { key: "vehicle-detail", label: "Vehicle Detail" },
  { key: "duty-payment-details", label: "Preferences" },
  { key: "kyc-verify", label: "KYC Verify" },
  { key: "change-password", label: "Change Password" },
  { key: "bank-detail", label: "Bank Detail" },
  { key: "payment-upload", label: "Payment Upload" },
  { key: "co-worker", label: "Coworker" },
  // { key: "license-details", label: "License Details" },
  // { key: "other-details", label: "Other Details" },
  // { key: "smses", label: "SMSes" },
  // { key: "emails", label: "Emails" },
  // { key: "status-history", label: "Status History" },
  // { key: "allocation-history", label: "Allocation History" },
  // { key: "booking-history", label: "Booking History" },
  // { key: "driver-ledger", label: "Driver Ledger" },
  // { key: "payment-history", label: "Payment History" },
  // { key: "status", label: "Status" },
  { key: "completed", label: "Completed" },
];

export default function ProfilePage() {
  const [profilePage, setProfilePage] = useState<string>("personal-detail");
  const [profilePercentage, setProfilePercentage] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<string[]>([
    "personal",
  ]);

  const handleComplete = (sectionKey: string) => {
    setCompletedSections((prev) =>
      prev.includes(sectionKey) ? prev : [...prev, sectionKey]
    );
  };

  useEffect(() => {
    setProfilePercentage(Number((100 / profileNavBtns.length - 1).toFixed(1)));
  }, []);

  useEffect(() => {
    const percentage = (completedSections.length / profileNavBtns.length) * 100;
    setProfilePercentage(parseFloat(percentage.toFixed(1)));
  }, [completedSections]);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="flex gap-2 flex-col lg:flex-row">
        {/* Left Navigation Bar */}
        <div className="left-bar p-4 bg-white w-full lg:w-[25%] h-max mb-4 lg:mb-0">
          <h2 className="text-[12px] font-semibold text-gray-800 mb-3">
            FILL PROFILE IN FEW STEPS
          </h2>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-600 font-medium mb-1">
              <span className="text-[10px]">Overall Progress</span>
              <span className="text-[10px]">{profilePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${profilePercentage}%` }}
              />
            </div>
          </div>

          {/* Steps Navigation */}
          <ul className="space-y-3 relative">
            {profileNavBtns.map(({ key, label }) => {
              const isCompleted = completedSections.includes(key);
              const isActive = profilePage === key;

              return (
                <li key={key} className="group">
                  <button
                    onClick={() => setProfilePage(key)}
                    className={`flex items-center w-full px-3 py-2 text-left text-sm font-medium border rounded-md transition-colors duration-150 
              ${
                isActive
                  ? "bg-[#101828] text-white border-[#101828]"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
              }
            `}
                  >
                    <div className="flex items-center gap-2 text-[10px]">
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border 
                  ${
                    isCompleted
                      ? "bg-green-400 text-white border-green-400"
                      : isActive
                      ? "text-white bg-white border-white"
                      : "bg-white text-gray-400 border-gray-400"
                  }`}
                      >
                        {isCompleted ? "✓" : ""}
                      </span>
                      {label}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Form Details */}
        {profilePage === "personal-detail" && <ProfilePersonalForm />}
        {profilePage === "company-detail" && <ProfileCompanyForm />}
        {/* {profilePage === "vehicle-detail" && <ProfileVehicleForm />} */}
        {profilePage === "duty-payment-details" && <ProfileDutyForm />}
        {profilePage === "kyc-verify" && <ProfileKYCForm />}
        {profilePage === "change-password" && <ProfilePasswordForm />}
        {profilePage === "bank-detail" && <ProfileBankForm />}
        {profilePage === "security" && <ProfileSecurityForm />}
        {profilePage === "payment-upload" && <ProfilePaymentUploadForm />}
        {profilePage === "license-details" && <ProfileLicenseDetailForm />}
        {profilePage === "other-details" && <ProfileOtherDetailsForm />}
        {profilePage === "status" && <ProfileStatus />}
        {profilePage === "smses" && <ProfileSMSTable />}
        {profilePage === "emails" && <ProfileEmailTable />}
        {profilePage === "status-history" && <ProfileStatusHistory />}
        {profilePage === "allocation-history" && <ProfileAllocationHistory />}
        {profilePage === "booking-history" && <ProfileBookingHistory />}
        {profilePage === "driver-ledger" && <ProfileBookingHistory />}
        {profilePage === "payment-history" && <ProfilePaymentHistory />}

        {profilePage === "co-worker" && (
          <UserCoworkerForm />
        )}
      </div>
    </div>
  );
}
