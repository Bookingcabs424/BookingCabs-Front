"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

type StatementAccounts = {
  sno: number;
  itineraryId: string;
  bookingNumber: number;
  bookingType: string;
  vehicleType: string;
  bookedCity: string;
  agentReference: string;
  passengerName: string;
  address: string;
  travelDate: string;
  bookingDate: string;
  bookingStatus: string;
  paymentStates: string;
  billAmount: number;
};

const data: StatementAccounts[] = [
  {
    sno: 1,
    itineraryId: "2025-05-16",
    bookingNumber: 1,
    bookingType: "Online",
    vehicleType: "Online",
    bookedCity: "Delhi",
    agentReference: "Neeraj Rustagi",
    passengerName: "John Doe",
    address: "Delhi",
    travelDate: "2025-05-16",
    bookingDate: "2025-05-16",
    bookingStatus: "Completed",
    paymentStates: 'abc',
    billAmount: 1000,
  },
];
const columns: ColumnDef<StatementAccounts>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center gap-1"> 
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
        <span>All</span></div>
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    { accessorKey: "sno", header: "S.No" },
    { accessorKey: "itineraryId", header: "Itinerary ID" },
    { accessorKey: "bookingNumber", header: "Booking Number" },
    { accessorKey: "bookingType", header: "Booking Type" },
    { accessorKey: "vehicleType", header: "Vehicle Type" },
    { accessorKey: "bookedCity", header: "Booked City" },
    { accessorKey: "agentReference", header: "Agent Reference" },
    { accessorKey: "passengerName", header: "Passenger Name" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "travelDate", header: "Travel Date" },
    { accessorKey: "bookingDate", header: "Booking Date" },
    { accessorKey: "paymentStates", header: "Payment States" },
    { accessorKey: "billAmount", header: "Bill Amount" },
  ];

export default function StatementAccountsTable() {
    const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="px-6 py-4">
      <div className="bg-white rounded-md shadow-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 sm:text-xl">
            Manage Statement of Account
          </div>
          <span className="text-sm text-gray-500">Total: {data.length}</span>
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
