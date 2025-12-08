"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import {TrendingUp,TrendingDown} from 'lucide-react'

interface RadialGraphProps {
  value: number;
  total: number;
  label: string;
  color: string;
  percent: number;
  isProfit: boolean;
}

const RadialGraph: React.FC<RadialGraphProps> = ({ value, total, label, color,percent,isProfit }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  const adjustedValue = Math.min(value, total - 0.001)/2;

  const data = [
    {
      name: "Remaining",
      value: total - adjustedValue,
      fill: "#d1d5db",
    },
    {
      name: "Completed",
      value: adjustedValue,
      fill: color,
    },
  ];

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-3 pb-4 flex flex-col justify-center">
      <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-600">{label}</h1>
       {isProfit ? (
            <span className="bg-green-100 p-1 flex items-center gap-1 text-[12px] rounded-sm">
              <TrendingUp className="text-green-600 w-5 h-5" /> 
              <span className="text-green-900 font-[500]">+ 12%</span>
            </span>
          ) : (
             <span className="bg-red-100 p-1 flex items-center gap-1 text-[12px]">
              <TrendingDown className="text-red-600 w-5 h-5" /> 
              <span className="text-red-900 font-[500]">+ 12%</span>
            </span>
          )}

      </div>
      <div className="w-35 h-35 relative mx-auto cursor-pointer">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            barSize={12}
            data={data}
            startAngle={90}
            endAngle={450}
          >
            <RadialBar
              dataKey="value"
              background
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold text-black">
        {value > 1000 ? `${((value/1000).toFixed(1))}K` : value}
        </div>
      </div>
     
    </div>
  );
};

export default RadialGraph;
