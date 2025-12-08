"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { NotebookPen } from "lucide-react"; 
type Statement = {
  sno: number;
  itineraryId: string;
  bookingnumber: string;
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
  billAmount: string;
  action: string;
};

const data: Statement[] = [
  {
    sno: 1,
    itineraryId: "IT001",
    bookingnumber: "BK001",
    bookingType: "One Way",
    vehicleType: "Sedan",
    bookedCity: "Delhi",
    agentReference: "AG001",
    passengerName: "John Doe",
    address: "123 Main St, Delhi",
    travelDate: "2023-10-01",
    bookingDate: "2023-09-25",
    bookingStatus: "Confirmed",
    paymentStates: "Paid",
    billAmount: "$100",
    action: "View",
  },
  {
    sno: 2,
    itineraryId: "IT002",
    bookingnumber: "BK002",
    bookingType: "One Way",
    vehicleType: "Sedan",
    bookedCity: "Delhi",
    agentReference: "AG001",
    passengerName: "John Doe",
    address: "123 Main St, Delhi",
    travelDate: "2023-10-01",
    bookingDate: "2023-09-25",
    bookingStatus: "Confirmed",
    paymentStates: "Paid",
    billAmount: "$100",
    action: "View",
  },
];

const columns: ColumnDef<Statement>[] = [
  { accessorKey: "sno", header: "S.No" },
  { accessorKey: "itineraryId", header: "Itinerary ID" },
  { accessorKey: "bookingnumber", header: "Booking Number" },
  { accessorKey: "bookingType", header: "Booking Type" },
  { accessorKey: "vehicleType", header: "Vehicle Type" },
  { accessorKey: "bookedCity", header: "Booked City" },
  { accessorKey: "agentReference", header: "Agent Reference" },
  { accessorKey: "passengerName", header: "Passenger Name" },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "travelDate", header: "Travel Date" },
  { accessorKey: "bookingDate", header: "Booking Date" },
  { accessorKey: "bookingStatus", header: "Booking Status" },
  { accessorKey: "paymentStates", header: "Payment States" },
  { accessorKey: "billAmount", header: "Bill Amount" },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <button
        className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
        onClick={() => alert(`Viewing ${row.original.itineraryId}`)}
      >
        {row.original.action}
      </button>
    ),
  },
];

export default function AccountStatement() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="min-h-screen w-full ">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <NotebookPen className="w-5 h-5 text-green-600" />
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
