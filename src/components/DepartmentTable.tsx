"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  useDepartmentsQuery,
  useUpdateDepartmentStatus,
} from "../hooks/useCommon";
import { Trash, Plus, CircleCheck, CircleX, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import DepartmentForm from "./DepartmentForm";
type Department = {
  id: number;
  departmentName: string;
  description: string;
  status: string;
};

interface DepartmentTableInterface {
  activeDepartmentForm: string;
  setActiveDepartmentForm: React.Dispatch<React.SetStateAction<string>>;
}

export default function DepartmentTable({
  activeDepartmentForm,
  setActiveDepartmentForm,
}: DepartmentTableInterface) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data, isLoading, isError, refetch } = useDepartmentsQuery();
  const { mutate: updateStatusMutate } = useUpdateDepartmentStatus();
  const tableData: Department[] = useMemo(() => {
    if (!data) return [];
    return data?.rows?.map((d: any) => ({
      id: d.id,
      departmentName: d.department_name,
      description: d.description,
      status: d.status,
    }));
  }, [data]);

  const selectedIds = useMemo(() => {
    return Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => tableData[Number(key)]?.id)
      .filter(Boolean) as number[];
  }, [rowSelection, tableData]);

  const onEditHandler = (row: Department) => {
    localStorage.setItem("editDepartment", JSON.stringify(row));
    setActiveDepartmentForm("member");
  };

  const onStatusChanged = (status_id: number, row_id?: number) => {
    const ids = row_id ? [row_id] : selectedIds;
    if (ids.length === 0) {
      toast.info("Please select at least one record.");
      return;
    }

    updateStatusMutate(
      {
        status: status_id,
        id: ids,
      },
      {
        onSuccess: (data) => {
          if (data.status == "success") {
            status_id == 2 ? "Data deleted successully" : data?.message;
          }
          refetch();
        },
        onError: (error) => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  const columns: ColumnDef<Department>[] = [
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
    { accessorKey: "departmentName", header: "Department Name" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.status == "1" ? (
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          ) : (
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          )}
          {/* <span>{row.original.status}</span> */}
        </div>
      ),
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => onEditHandler(row.original)}
          >
            <Edit size={15} />
          </button>
          <button
            onClick={() => onStatusChanged(0, row.original.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  });

  if (isLoading) {
    return <div className="p-6">Loading departments...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load departments.</div>;
  }
  return (
    <div className="px-12 py-6 space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-end">
        <button
          onClick={() => setActiveDepartmentForm("member")}
          className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#eff7ff] border border-gray-300 text-black font-semibold"
        >
          <Plus className="w-5 h-5" /> Add New
        </button>
        <button
          className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#009551] text-white font-semibold"
          onClick={() => onStatusChanged(1)}
        >
          <CircleCheck className="w-5 h-5" /> Publish
        </button>
        <button
          className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#bcd46a] text-black font-semibold"
          onClick={() => onStatusChanged(2)}
        >
          <CircleX className="w-5 h-5" /> Unpublish
        </button>
        <button
          className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#ff5500] text-black font-semibold"
          onClick={() => onStatusChanged(0)}
        >
          <Trash className="w-5 h-5" /> Delete
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-md my-12 shadow-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="text-lg font-semibold text-gray-800 sm:text-xl">
            View/Update Records
          </div>
          <span className="text-sm text-gray-500">
            Total: {data?.rows?.length}
          </span>
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
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-4 text-gray-500"
                  >
                    No departments found.
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
