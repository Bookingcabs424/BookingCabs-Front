"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  RowSelectionState,
} from "@tanstack/react-table";

import { Trash, Plus, CircleCheck, CircleX } from "lucide-react";

type Department = {
  id: number;
  sno: number;
  category: string;
  userName: string;
  country: string;
  state: string;
  city: string;
  bookingModule: string;
  currency: string;
  gradeType: string;
  amount: number;
  base: number;
  extraHour: number;
  extraKM: number;
  status: string;
  action: string;
};

const data: Department[] = [
  {
    id: 1,
    sno: 1,
    category: "Rental",
    userName: "John Doe",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    bookingModule: "",
    currency: "INR",
    gradeType: "A",
    amount: 1000,
    base: 500,
    extraHour: 1,
    extraKM: 40,
    status: "Confirmed",
    action: "View",
  },
];

interface CabMarkupInterface {
  setActiveCabMarkupForm: React.Dispatch<React.SetStateAction<string>>;
}


export default function TransportMarkupTable({setActiveCabMarkupForm}:CabMarkupInterface) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns: ColumnDef<Department>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "sno", header: "S.No" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "userName", header: "User Name" },
    { accessorKey: "country", header: "Country" },
    { accessorKey: "state", header: "State" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "bookingModule", header: "Booking Module" },
    { accessorKey: "currency", header: "Currency" },
    { accessorKey: "gradeType", header: "Grade Type" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "base", header: "Base" },
    { accessorKey: "extraHour", header: "Extra Hour" },
    { accessorKey: "extraKM", header: "Extra KM" },

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
          onClick={() => alert(`Viewing ${row.original.id}`)}
        >
          {row.original.action}
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  });

  return (
    <div className="px-6 sm:px-12">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-end">
        <button onClick={() => setActiveCabMarkupForm("CabMarkupForm")} className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#367FA9] border border-gray-300 text-white font-semibold">
          <Plus className="w-5 h-5" /> Add New Transport Markup
        </button>
        <button className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#009551] text-white font-semibold">
          <CircleCheck className="w-5 h-5" /> Publish
        </button>
        <button className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#bcd46a] text-black font-semibold">
          <CircleX className="w-5 h-5" /> Unpublish
        </button>
        <button className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#ff5500] text-black font-semibold">
          <Trash className="w-5 h-5" /> Delete
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-md my-6 shadow-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="text-lg font-semibold text-gray-800 sm:text-xl">
            View/Update Records
          </div>
          <span className="text-sm text-gray-500">Total: {data.length}</span>
        </div>

        <div className="overflow-x-auto">
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
