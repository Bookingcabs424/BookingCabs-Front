"use client";

import {
  Area,
  AreaChart as ReAreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

interface AreaChartProps {
  title: string;
  data: { name: string; uv: number }[];
  color: string;
}

const AreaChartComponent: React.FC<AreaChartProps> = ({ title, data, color }) => {
  const gradientId = `gradient-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="w-full h-[400px] bg-white px-5 pt-5 pb-0 rounded shadow flex flex-col">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ReAreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke={color}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
            />
          </ReAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaChartComponent;
