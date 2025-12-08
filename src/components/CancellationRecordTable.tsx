"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { X } from "lucide-react"; // Lucide icon
type Booking = {
  sno: number;
  bookingReference: string;
  client: string;
  pickupTime: string;
  vehicle: string;
  bookingType: string;
  departure: string;
  dropAddress: string;
  bookingAutoReleaseDate: string;
  status: string;
  action: string;
};

const data: Booking[] = [
  {
    sno: 1,
    bookingReference: "IT001",
    client: "BK001",
    pickupTime: "2025-05-18",
    vehicle: "Sedan",
    bookingType: "Round Trip",
    departure: "Delhi",
    dropAddress: "Agra",
    bookingAutoReleaseDate: "2025-05-18",
    status: "Confirmed",
    action: "View",
  },
  {
    sno: 2,
    bookingReference: "IT002",
    client: "BK002",
    pickupTime: "2025-05-20",
    vehicle: "SUV",
    bookingType: "One Way",
    departure: "Mumbai",
    dropAddress: "Pune",
    bookingAutoReleaseDate: "2025-05-18",
    status: "Pending",
    action: "View",
  },
];

const columns: ColumnDef<Booking>[] = [
  { accessorKey: "sno", header: "S.No" },
  { accessorKey: "bookingReference", header: "Booking Reference" },
  { accessorKey: "client", header: "Client" },
  { accessorKey: "pickupTime", header: "Pickup Time" },
  { accessorKey: "vehicle", header: "Vehicle" },
  { accessorKey: "bookingType", header: "Booking Type" },
  { accessorKey: "departure", header: "Departure" },
  { accessorKey: "dropAddress", header: "Drop Address" },
  {
    accessorKey: "bookingAutoReleaseDate",
    header: "Booking Auto Release Date",
  },
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

export default function CancellationRecordTable() {
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
            <X className="w-6 h-6 text-red-600" />
            List Records
          </div>
          <span className="text-sm text-gray-500">Total: {data.length}</span>
        </div>
        <div className="flex items-center justify-between gap-2 px-3">
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
            <label htmlFor="search" className="text-sm">Search:</label>
          <input type="text" className="border border-gray-400 rounded-sm text-sm outline-none px-2 py-[2px]" placeholder="" />
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
