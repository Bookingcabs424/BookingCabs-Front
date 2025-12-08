"use client";

import { ChevronLeft, Plus } from "lucide-react";
import BookingTable from "./common/Table";
import {ColumnConfig} from "./common/Types"
import React, { useEffect, useState } from "react";
import { useGetUserStaff } from "../hooks/useCommon";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import Link from "next/link";

interface biillingManagementRow {
  sno: string;
  first_name: string;
  last_name: string;
  email: string;
  referral_key: string;
  assign_module_name: string;
  mobile: string;
  role: string;
  department: string;
  status: string;
  login_status: string;
  action: string;
}
interface StaffTableProps{
  setStaffPageType: React.Dispatch<React.SetStateAction<string>>;
}

interface Column {
  key: string;
  header: number | React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: any;
  render?: (value: any, row?: any) => React.ReactNode;
  hidden?: boolean;
  generated?:boolean;
}
export default function StaffTable({setStaffPageType}: StaffTableProps) {
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const {
    mutate: fetchUserStaff,
    data: userStaffData,
    isPending,
    isError,
  } = useGetUserStaff();
const {user}=useAuth();
console.log({user})
let userId= user?.id || 0;
useEffect(() => { 
    fetchUserStaff(
        { user_id: userId },
        {
          onSuccess: (data: any) => {
            if (data?.status == "success") {
              toast.info("User Staff data feteched.");
            }
          },
          onError: () => {
            toast.error("Something went wrong while fetching staff data");
          },
        }
      );
}, [userId]);
  const handleCheckboxChange = (
    sno: number,
    isChecked: boolean,
    route_id: number
  ) => {
    setSelectedRowIds((prev) =>
      isChecked ? [...prev, sno] : prev.filter((id) => id !== sno)
    );
  };

  const creditLimitData: biillingManagementRow[] = [
    {
      sno: "1",
      first_name: "1",
      last_name: "1",
      email: "1970-01-01 00:00:00",
      referral_key: "1",
      assign_module_name: "1",
      mobile: "$1",
      role: "$1",
      department: "$1",
      status: "1",
      login_status: "",
      action: "",
    },
  ];

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      const allIds = creditLimitData?.map((row: any) => row.route_id);
      setSelectedRowIds(allIds);
    } else {
      setSelectedRowIds([]);
    }
  };
  const allRowsSelected =
    creditLimitData?.length > 0 &&
    selectedRowIds?.length === creditLimitData?.length;

  const creditLimitColumn: Column[] = [
  
    { key: "sno", header: "S.No", sortable: true, generated: true },
    { key: "first_name", header: "First Name", sortable: true },
    { key: "last_name", header: "Last Name", sortable: true },
    { key: "email", header: "Email", sortable: true },
    { key: "referral_key", header: "Referral Key", sortable: true },
    { key: "module_name", header: "Assign Module Name", sortable: true,
      render: (row: string) => (
        <div className="max-w-xs whitespace-normal break-words">
          {row || "N/A"}
        </div>
      )
     },
    { key: "mobile", header: "Mobile", sortable: true },
    { key: "role", header: "Role", sortable: true },
    { key: "department_name", header: "Department", sortable: true },

    {
      key: "signup_status",
      header: "Status",
      sortable: true,
      render: (value: number) => {
        const isOnline = Number(value) == 1;

        return (
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>
        );
      },
    },
    {
      key: "login_status",
      header: "Login Status",
      sortable: true,
      render: (value: number) => {
        const isOnline = Number(value) == 1;

        return (
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>
        );
      },
    },
    {
      key: "user_id",
      header: "Action",
      sortable: false,
      render: (value: any) => (
        <div className="flex flex-col items-start space-y-1">
          <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
            Profile
          </button>
          <Link href={`/edit-staff?user_id=${value}`}>
          <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
            Edit
          </button>
          </Link>

          <button className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
            Status
          </button>
        </div>
      ),
    },
  ];
useEffect(() => {
  console.log({userStaffData})
}, [userStaffData]);
  return (
    <>
      <div className="flex justify-end w-full">
        <button onClick={()=> setStaffPageType("form")} className="cursor-pointer flex items-center justify-end font-[500] bg-[#367FA9] text-white px-4 py-2 text-sm rounded-md text-sm my-3 mx-6">
        <Plus /> Add
      </button>
      </div>
      <div className="max-w-7xl mx-4 gap-6">
        <BookingTable
          data={userStaffData?.data?.results}
          columns={creditLimitColumn as ColumnConfig[]}
          searchable={false}
          filterable={false}
          sortable={false}
        />
      </div>
    </>
  );
}
