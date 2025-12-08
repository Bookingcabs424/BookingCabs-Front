"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Plus, X } from "lucide-react"; // Lucide icon
type Booking = {
  sno: number;
  firstName: string;
  lastName: string;
  email: string;
  assignModuleName: string;
  mobile: string;
  role: string;
  department: string;
  status: string;
  action: string;
};

const data: Booking[] = [
  {
    sno: 1,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@exmple.com",
    assignModuleName: "Neeraj",
    mobile: "9876543210",
    role: "User",
    department: "Admin",
    status: "Confirmed",
    action: "View",
  },
];

const columns: ColumnDef<Booking>[] = [
  { accessorKey: "sno", header: "S.No" },
  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "lastName", header: "Last Name" },
  { accessorKey: "email", header: "email" },
  { accessorKey: "assignModuleName", header: "Assign Module Name" },
  { accessorKey: "mobile", header: "Mobile" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "department", header: "Department" },
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
        onClick={() => alert(`Viewing ${row.original.sno}`)}
      >
        {row.original.action}
      </button>
    ),
  },
];

interface StaffInterface {
  setActiveStaffForm: React.Dispatch<React.SetStateAction<string>>;
}

export default function StaffRecordTable({ setActiveStaffForm }: StaffInterface) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="membership-form-btns flex flex-col items-end w-full pt-6 px-6">
        <div className="flex gap-2 justify-end items-end">
          <button
            type="button"
            onClick={() => setActiveStaffForm("StaffForm")}
            className="StatementAccounts flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#367FA9] text-white font-semibold"
          >
            <Plus className="w-5 h-5" /> Add
          </button>
        </div>
      </div>
      <div className="px-6 py-12 sm:px-12">
        <div className="bg-white rounded-md shadow-md overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 sm:text-xl">
              View/Update Records
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
                  <tr
                    key={row.id}
                    className="hover:bg-blue-50 transition-colors"
                  >
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
    </>
  );
}
