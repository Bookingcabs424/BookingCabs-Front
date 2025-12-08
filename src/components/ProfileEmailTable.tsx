"use client";
import { useEffect, useState } from "react";
import { useUnAssignedBookingMutation } from "../hooks/useCommon";

interface Email {
  sno: number;
  time: string;
  header: string[];
  body: string;
  cost: string;
  status: string;
}
export default function ProfileEmailTable() {
  const { mutate: unAssignedBookingMutate, data: getUnAssignedBookingData } =
    useUnAssignedBookingMutation();

  const [emailData, setEmailData] = useState<Email[]>([]);

  useEffect(() => {
    if (getUnAssignedBookingData?.length) {
      const mapped = getUnAssignedBookingData.map(
        (item: any, index: number) => ({
          sno: index + 1,
          time: item.time || "N/A",
          header: Array.isArray(item.header) ? item.header : [item.header, ""],
          body: item.body || "",
          cost: item.cost || "N/A",
          status: item.status || "N/A",
        })
      );
      setEmailData(mapped);
    }
  }, [getUnAssignedBookingData]);

  return (
    <div className="space-y-3 w-full bg-white p-8 pt-10 h-full">
      <div className="w-full bg-white rounded-md">
        <h2 className="text-xl font-medium mb-4">User Email Logs</h2>

        <div className="overflow-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm table-auto border-collapse">
            <thead className="bg-gray-100 text-left text-[12px]">
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
              {emailData.length > 0 ? (
                emailData.map((item, index) => (
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
                      <div className="font-medium">{item.body}</div>
                      <button className="text-blue-600 hover:underline text-xs">
                        View Details
                      </button>
                    </td>
                    <td className="px-2 py-2">₹{item.cost}</td>
                    <td className="px-2 py-2">{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No email data found.
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
