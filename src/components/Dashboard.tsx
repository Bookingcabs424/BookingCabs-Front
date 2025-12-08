import React from "react";
import { useAuth } from "../store/auth";
import CreditBalanceTable from "./CreditBalanceTable";
import ReferralTable from "./ReferralTable";
import RecentBookingTable from "./RecentBookingTable";

const cardData = [
  { label: "Current", value: 12, color: "bg-blue-500" },
  { label: "Future", value: 8, color: "bg-green-500" },
  { label: "Completed", value: 25, color: "bg-purple-500" },
  { label: "Cancelled", value: 3, color: "bg-red-500" },
  { label: "Total", value: 48, color: "bg-yellow-500" },
];

function capitalize(str?: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  console.log("usersssssss", user);
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 py-8 px-4">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">
          Welcome,{" "}
          {user?.first_name && user?.last_name
            ? `${capitalize(user.first_name)} ${capitalize(user.last_name)}`
            : "User"}
        </h1>
      </header>

      {/* Cards Row */}
      <section className="max-w-8xl mx-auto grid grid-cols-5 gap-6 mb-10">
        {cardData.map(({ label, value, color }) => (
          <div
            key={label}
            className={`${color} text-white rounded-lg p-6 flex flex-col items-center justify-center shadow-lg`}
          >
            <span className="uppercase text-sm">{label}</span>
            <span className="text-4xl font-bold">{value}</span>
          </div>
        ))}
      </section>

      <div className="mt-10 flex gap-4">
        <div className="w-1/2">
          <CreditBalanceTable />
        </div>
        <div className="w-1/2">
          <ReferralTable />
        </div>
      </div>

      <div className="mt-10">
        <RecentBookingTable />
      </div>
    </div>
  );
};

export default Dashboard;
