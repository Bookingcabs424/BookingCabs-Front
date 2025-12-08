"use client";
import ApprovalPendingTable from "../../../components/ApprovalPendingTable";
import AreaChartComponent from "../../../components/AreaChart";
import BarGraph from "../../../components/BarGraph";
import CreditBalanceTable from "../../../components/CreditBalanceTable";
import RecentBookingTable from "../../../components/RecentBookingTable";
import ReferralTable from "../../../components/ReferralTable";
import { useAuth } from "../../../store/auth";
import { BarChart3, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";

const earnings = [
  { name: "Jan", uv: 100 },
  { name: "Feb", uv: 370 },
  { name: "Mar", uv: 200 },
  { name: "Apr", uv: 278 },
  { name: "May", uv: 189 },
];

const trips = [
  { name: "Jan", uv: 200 },
  { name: "Feb", uv: 170 },
  { name: "Mar", uv: 500 },
  { name: "Apr", uv: 78 },
  { name: "May", uv: 489 },
];

interface MetricCardProps {
  title: string;
  value: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
}

const metricsData: MetricCardProps[] = [
  {
    title: "Current",
    value: "24",
    trend: "up",
    icon: <Clock className="w-5 h-5 text-blue-200" />,
    color: "bg-blue-400",
  },
  {
    title: "Future",
    value: "156",
    trend: "up",
    icon: <Calendar className="w-5 h-5 text-green-200" />,
    color: "bg-[#3ca731]",
  },
  {
    title: "Completed",
    value: "1,247",
    trend: "up",
    icon: <CheckCircle className="w-5 h-5 text-emerald-200" />,
    color: "bg-[#55BD42]",
  },
  {
    title: "Cancelled",
    value: "23",
    trend: "down",
    icon: <XCircle className="w-5 h-5 text-red-200" />,
    color: "bg-orange-300",
  },
  {
    title: "Total",
    value: "1,450",
    trend: "up",
    icon: <BarChart3 className="w-5 h-5 text-purple-200" />,
    color: "bg-purple-300",
  },
  {
    title: "Total Revenue",
    value: "2,450",
    trend: "up",
    icon: <BarChart3 className="w-5 h-5 text-purple-200" />,
    color: "bg-pink-300",
  },
];

function capitalize(str?: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="dashboard-content p-4 bg-gray-100 !min-h-[calc(100vh - 81px)]">
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <h1 className="text-xl font-bold mb-1 sm:text-2xl">
          Welcome,{" "}
          {user?.first_name && user?.last_name
            ? `${capitalize(user.first_name)} ${capitalize(user.last_name)}`
            : "User"}
        </h1>

        <div className="grid grid-cols-6 justify-evenly gap-3">
          {metricsData.map(({ title, value, color }, index) => (
            <div
              key={index}
              className={` px-3 py-5 shadow-md cursor-pointer rounded-sm ${color} flex justify-between items-center`}
            >
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-gray-700">
                  {value}
                </span>
                <span className="text-gray-400 text-white font-[700] text-sm">
                  {title}
                </span>
              </div>
              <div className="graph">
                <div className="flex gap-1 items-end">
                  <div className="bg-white/30 h-6 w-2"></div>
                  <div className="bg-white/30 h-12 w-2"></div>
                  <div className="bg-white/30 h-8 w-2"></div>
                  <div className="bg-white/30 h-10 w-2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid my-5 w-full gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <div className="w-full">
            <BarGraph />
          </div>
          <div className="w-full">
            <AreaChartComponent title="Trips" data={trips} color="#17b3a3" />
          </div>
          <div className="w-full">
            <AreaChartComponent
              title="Earnings"
              data={earnings}
              color="#f92525"
            />
          </div>
        </div>

        {/* Tables */}
        <div className="mt-3 flex flex-col gap-1 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <CreditBalanceTable />
          </div>
          <div className="w-full lg:w-1/2">
            <ReferralTable />
          </div>
        </div>

        <ApprovalPendingTable />

        <RecentBookingTable />
      </div>
    </div>
  );
}
