"use client";

import { useUnAssignedBookingMutation } from "../hooks/useCommon";
import { ArrowDownToLine, Printer } from "lucide-react";
import { useEffect, useState } from "react";

interface Driver {
  id: string;
  pickup_time: string;
  vehicle: string;
  booking_type: string;
  partner: string;
  client: string;
  departure: string;
  drop_area: string;
  status: string;
  c_share: string;
  d_share: string;
  p_share: string;
}
interface Column {
  key: string;
  header?: string | React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: any;
  render?: (value: any, row?: any) => React.ReactNode;
  hidden?: boolean;
}
export default function ProfileBookingHistory() {
  const { data: getUnAssignedBookingData } = useUnAssignedBookingMutation();
  const [driverData, setDriverData] = useState<Driver[]>([]);

  useEffect(() => {
    if (getUnAssignedBookingData?.length) {
      const transformed = getUnAssignedBookingData.map(
        (item: any, index: number) => ({
          id: index + 1,
          pickup_time: item?.pickup_time || "N/A",
          vehicle: item?.vehicle || "N/A",
          booking_type: item?.booking_type || "N/A",
          partner: item?.partner || "N/A",
          client: item?.client || "N/A",
          departure: item?.departure || "N/A",
          drop_area: item?.drop_area || "N/A",
          status: item?.status || "N/A",
          c_share: item?.c_share || "0",
          d_share: item?.d_share || "0",
          p_share: item?.p_share || "0",
        })
      );
      setDriverData(transformed);
    }
  }, [getUnAssignedBookingData]);
  return (
    <div className="space-y-3 w-full bg-white p-4 pt-10 h-full">
      <div className="border border-gray-200">
        <div className="w-full bg-gray-200 text-[10px] border-x border-gray-200 mb-2 py-2 px-2 font-[500]">
          Driver History Details
        </div>
        <div className="py-1 max-w-[100%] overflow-x-auto">
          <table className="w-full table-auto text-[10px] border-collapse">
            <thead className="bg-gray-100">
              <tr className="bg-gray-200">
                <th className="px-2 py-1">ID</th>
                <th className="px-2 py-1">Pickup Time</th>
                <th className="px-2 py-1">Vehicle</th>
                <th className="px-2 py-1">Booking Type</th>
                <th className="px-2 py-1">Partner</th>
                <th className="px-2 py-1">Client</th>
                <th className="px-2 py-1">Departure</th>
                <th className="px-2 py-1">Drop Area</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">C Share</th>
                <th className="px-2 py-1">D Share</th>
                <th className="px-2 py-1">P Share</th>
              </tr>
            </thead>
            <tbody>
              {driverData.length > 0 ? (
                driverData.map((row, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-2 py-1">{row.id}</td>
                    <td className="px-2 py-1">{row.pickup_time}</td>
                    <td className="px-2 py-1">{row.vehicle}</td>
                    <td className="px-2 py-1">{row.booking_type}</td>
                    <td className="px-2 py-1">{row.partner}</td>
                    <td className="px-2 py-1">{row.client}</td>
                    <td className="px-2 py-1">{row.departure}</td>
                    <td className="px-2 py-1">{row.drop_area}</td>
                    <td className="px-2 py-1 text-gray-700">
                      <span
                        className="truncate block max-w-[60px] text-[10px]"
                        title={row.status}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-2 py-1">{row.c_share}</td>
                    <td className="px-2 py-1">{row.d_share}</td>
                    <td className="px-2 py-1">{row.p_share}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="text-center py-4 text-gray-500">
                    No driver booking history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
         <div className="flex items-center gap-6 my-4">
          <button className="flex items-center gap-2 text-[10px] bg-gray-200 border border-gray-500 px-2 py-1 rounded cursor-pointer hover:bg-gray-300">
            <ArrowDownToLine className="w-3 h-3 text-gray-600" />
            Download CSV
          </button>
          <button className="flex items-center gap-2 text-[10px] bg-gray-200 border border-gray-500 px-2 py-1 rounded cursor-pointer hover:bg-gray-300">
            <Printer className="w-3 h-3 text-gray-600" />
            Print
          </button>
        </div>
    </div>
  );
}
