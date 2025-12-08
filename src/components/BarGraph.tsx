"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    net: 100,
    revenue: 200,
    cashFlow: 300,
  },
  {
    name: "Feb",
    net: 150,
    revenue: 180,
    cashFlow: 250,
  },
  {
    name: "Mar",
    net: 120,
    revenue: 220,
    cashFlow: 280,
  },
];

export default function BarGraph() {
  return (
    <div className="bg-white flex flex-col w-full h-full rounded-md shadow-md">
      <h1 className="text-2xl p-4 pb-10 font-semibold">Monthly History</h1>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="net" fill="#8884d8" />
            <Bar dataKey="revenue" fill="#82ca9d" />
            <Bar dataKey="cashFlow" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
