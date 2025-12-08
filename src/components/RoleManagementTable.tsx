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

type Membership = {
  id: number;
  rollno: number;
  description: string;
  createdBy: string;
  status: string;
  action: string;
};

const data: Membership[] = [
  {
    id: 1,
    rollno: 1200,
    description: "Sedan",
    createdBy: "Round Trip",
    status: "Confirmed",
    action: "View",
  },
];

interface RoleManagementTableInterface {
  activeRoleForm: string;
  setActiveRoleForm: React.Dispatch<React.SetStateAction<string>>;
}

export default function RoleManagementTable({
  activeRoleForm,
  setActiveRoleForm,
}: RoleManagementTableInterface) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns: ColumnDef<Membership>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
          <span>All</span>
        </div>
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    { accessorKey: "id", header: "ID" },
    { accessorKey: "rollno", header: "Roll No." },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "createdBy", header: "Created By" },
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
    <div className="px-12 py-6 space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-end">
        <button
          onClick={() => setActiveRoleForm("member")}
          className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#eff7ff] border border-gray-300 text-black font-semibold"
        >
          <Plus className="w-5 h-5" /> Add New
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
      <div className="bg-white rounded-md my-12 shadow-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="text-lg font-semibold text-gray-800 sm:text-xl">
            View/Update Records
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
