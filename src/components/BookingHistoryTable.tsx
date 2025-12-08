"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { NotepadText } from "lucide-react"; // Lucide icon
type Booking = {
  itineraryId: number;
  id: number;
  pickupTime: string;
  bookingType: string;
  partner: string;
  client: string;
  departure: string;
  dropAddress: string;
  status: string;
  action: string;
};

const data: Booking[] = [
  {
    itineraryId: 1,
    id: 1,
    pickupTime: "2025-05-18",
    bookingType: "Round Trip",
    partner: "ABC",
    client: "ABC",
    departure: "Delhi",
    dropAddress: "Agra",
    status: "Confirmed",
    action: "View",
  },
  {
    itineraryId: 2,
    id: 2,
    pickupTime: "2025-05-20",
    bookingType: "One Way",
    partner: "ABC",
    client: "ABC",
    departure: "Mumbai",
    dropAddress: "Pune",
    status: "Pending",
    action: "View",
  },
];

const columns: ColumnDef<Booking>[] = [
  { accessorKey: "itineraryId", header: "Itinerary ID" },
  { accessorKey: "id", header: "ID" },
  { accessorKey: "pickupTime", header: "Pickup Time" },
  { accessorKey: "bookingType", header: "Booking Type" },
  { accessorKey: "partner", header: "Partner" },
  { accessorKey: "client", header: "Client" },
  { accessorKey: "departure", header: "Departure" },
  { accessorKey: "dropAddress", header: "Drop Address" },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusClasses =
        status === "Confirmed"
          ? "bg-green-100 text-green-800"
          : status === "Pending"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-gray-100 text-gray-700";

      return (
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusClasses}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <button
        className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
        onClick={() => alert(`Viewing ${row.original.client}`)}
      >
        {row.original.action}
      </button>
    ),
  },
];

export default function BookingHistoryTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="px-6 py-4 sm:px-12">
      <div className="bg-white rounded-md shadow-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 sm:text-xl">
            <NotepadText className="w-6 h-6 text-pink-600" />
            Booking History List
          </div>
          <span className="text-sm text-gray-500">Total: {data.length}</span>
        </div>
        <div className="flex  justify-between gap-2 px-3 flex-col sm:flex-row sm:items-center">
          <span className="text-sm">
            Show{" "}
            <select
              name="entries"
              id=""
              className="border border-gray-400 rounded-sm text-sm mx-2 my-2"
            >
              <option value={10} defaultValue={10}>
                10
              </option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            entries
          </span>

          <div className="flex items-center gap-3">
            <label htmlFor="search" className="text-sm">
              Search:
            </label>
            <input
              type="text"
              className="border border-gray-400 rounded-sm text-sm outline-none px-2 py-[2px]"
              placeholder=""
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-700 font-semibold">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left whitespace-nowrap"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2 whitespace-nowrap text-gray-700"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
