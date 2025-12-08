// app/friend-requests/page.tsx
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

// type Invitation = {
//   id: number;
//   name: string;
//   email?: string;
//   mobile?: string;
// };

type Invitation = {
  id: number;
  name: string;
  email?: string;
  mobile?: string;
  action?: string;
};

const data: Invitation[] = [
  {
    id: 1,
    name: "Ananya Sharma",
    email: "ananya.sharma@gmail.com",
    mobile: "+91 98765 43210",
  },
  {
    id: 2,
    name: "Rahul Verma",
    email: "rahul.verma@gmail.com",
    mobile: "+91 98765 43211",
  },
  {
    id: 3,
    name: "Priya Mehta",
    email: "priya.mehta@gmail.com",
    mobile: "+91 98765 43212",
    action: "View",
  },
];

export default function InvitationList() {
  const [requests, setRequests] = useState<Invitation[]>(data);

  const handleAccept = (id: number) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
    alert("Invitation Request accepted.");
  };

  const handleCancel = (id: number) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
    alert("Invitation Request cancelled.");
  };

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns: ColumnDef<Invitation>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "sent_date", header: "Sent Date" },
    { accessorKey: "accepted_date", header: "Accepted Date" },
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
    <>
      {/* <div className="w-full mx-auto p-6">
      <h1 className="text-xl font-[500] mb-6">Company Invites</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        <ul className="space-y-2">
          {requests.map((req) => (
            <li
              key={req.id}
              className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md shadow-xs bg-white"
            >
              <div className="flex items-center gap-4">
                
                <div>
                  <p className="font-[400] text-sm">{req.name} <span className="text-gray-500 text-[12px]">({req.mobile})</span></p>
                  <p className="text-[12px] text-gray-500">
                  {req.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(req.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] px-3 py-1 rounded cursor-pointer"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleCancel(req.id)}
                  className="bg-gray-200 hover:bg-gray-300 text-[12px] px-3 py-1 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div> */}
      <div className="overflow-x-auto p-5">
        <table className="min-w-full divide-y divide-gray-300 shadow-md rounded-md text-sm">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
