"use client";
import React, { useEffect, useState } from "react";
import { useUnAssignedBookingMutation } from "../hooks/useCommon";

interface SMS {
  sno: number;
  time: string;
  header: string[];
  body: string;
  cost: string;
  status: string;
}

export default function ProfileSMSTable() {
  const { data: getUnAssignedBookingData, mutate } =
    useUnAssignedBookingMutation();
  const [smsData, setSmsData] = useState<SMS[]>([]);

  useEffect(() => {
    if (getUnAssignedBookingData?.length) {
      const mapped = getUnAssignedBookingData.map(
        (item: any, index: number) => ({
          sno: index + 1,
          time: item.time,
          header: item?.header || ["N/A", ""],
          body: item?.body,
          cost: item?.cost || "N/A",
          status: item?.status || "N/A",
        })
      );
      setSmsData(mapped);
    }
  }, [getUnAssignedBookingData]);

  return (
    <div className="w-full px-4 py-6">
      <div className="w-full bg-white rounded-lg shadow p-5">
        <h2 className="text-xl font-medium mb-4">User SMS Logs</h2>

        <div className="overflow-auto border border-gray-200 rounded-md">
          <table className="w-full text-sm table-auto border-collapse font-[400]">
            <thead className="bg-gray-100 text-left font-[400] text-[12px]">
              <tr className="bg-gray-200">
                <th className="px-2 py-2">S.No</th>
                <th className="px-2 py-2">Time</th>
                <th className="px-2 py-2">Header</th>
                <th className="px-2 py-2">Body</th>
                <th className="px-2 py-2">Cost</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {smsData.length > 0 ? (
                smsData.map((item, index) => (
                  <tr
                    key={index}
                    className="text-[12px] border-t hover:bg-gray-50"
                  >
                    <td className="px-2 py-2">{item.sno}</td>
                    <td className="px-2 py-2">{item.time}</td>
                    <td className="px-2 py-2 space-y-1">
                      <div>{item.header[0]}</div>
                      <div>{item.header[1]}</div>
                    </td>
                    <td className="px-2 py-2 space-y-1">
                      <div className="font-[500]">{item.body}</div>
                      <button className="text-blue-600 hover:underline text-xs">
                        Trip Detail
                      </button>
                    </td>
                    <td className="px-2 py-2">₹{item.cost}</td>
                    <td className="px-2 py-2">{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No SMS data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
