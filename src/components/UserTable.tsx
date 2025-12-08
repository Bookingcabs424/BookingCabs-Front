"use client";
import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { usegetStaffMutation } from "../hooks/useCommon";
import { useAuth } from "../store/auth";
import { Search } from "lucide-react";
import { countryNames } from "../constants/countryNames";
import { Plus } from "lucide-react";
import Link from "next/link";

type User = {
  sno: number;
  userId: string | number;
  name: string;
  email: string;
  mobile: string;
  country: string;
  city: string;
  userType: string;
  pendingDoc: string;
  userStatus: string;
  loginStatus: string;
  signupStatus: string;
};

type Filters = {
  user_id?: string;
  first_name?: string;
  mobile?: string;
  email?: string;
  country?: string;
  state?: string;
  city?: string;
  userType?: string;
  status?: string;
};

export default function UserTable() {
  const userTypeOptions = [
    "Normal User",
    "Un-registered User",
    "Corporate",
    "Travel Agent",
    "Hotel",
  ];
  const statusOptions = [
    "Active",
    "On Hold",
    "Black Listed",
    "Inactive",
    "Unapproved",
    "Deleted",
  ];
  const { data: Tdata, mutate } = usegetStaffMutation();
  const { user } = useAuth();

  const [filters, setFilters] = useState<Filters>({});

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    mutate({
      user_id: user?.id,
      ...filters,
    });
  };

  const handleClear = () => {
    setFilters({});
    mutate({ user_id: user?.id });
  };

  useEffect(() => {
    mutate({ user_id: user?.id });
  }, []);

  const tableData = React.useMemo(() => {
    if (!Tdata) return [];

    return Tdata?.data?.results?.map((user: any, index: number) => ({
      sno: index + 1,
      userId: user.user_id,
      name: user?.first_name + "" + user?.last_name,
      email: user.email,
      mobile: user.mobile,
      country: user.country_name || "N/A",
      city: user.city_name || "N/A",
      userType: user.user_type_name,
      pendingDoc: "N/A",
      userStatus: user.isActive === 1 ? "Active" : "In-Active",
      loginStatus: user.login_status === 1 ? "Logged In" : "Logged Out",
      signupStatus: user.signup_status !== 10 ? "Pending" : "Completed",
    }));
  }, [Tdata]);

  const columns: ColumnDef<User>[] = [
    { accessorKey: "sno", header: "S.No" },
    { accessorKey: "userId", header: "User ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "country", header: "Country" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "userType", header: "User Type" },
    { accessorKey: "pendingDoc", header: "Pending Document" },
    { accessorKey: "userStatus", header: "User Status" },
    { accessorKey: "loginStatus", header: "Login Status" },
    { accessorKey: "signupStatus", header: "Sign up Status" },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <React.Fragment>
      <div className="add-user-form bg-white shadow-md border border-gray-300 m-6 mb-3 mt-0 rounded-sm sm:m-12 sm:mb-3 sm:mt-0">
        <h1 className="bg-gray-300 py-3 px-5 font-semibold flex items-center gap-2 text-sm sm:text-base">
          <Search /> Search User
        </h1>
        <div className="grid grid-cols-1 p-3 sm:p-6 gap-3 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col py-1">
            <label
              htmlFor="userId"
              className="font-semibold text-[10px] text-sm"
            >
              User ID
            </label>
            <input
              type="text"
              name="user_id"
              placeholder="Enter User ID"
              className="border  border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-sm"
              value={filters.user_id || ""}
              onChange={handleFilterChange}
            />
          </div>

          <div className="flex flex-col py-1">
            <label
              htmlFor="first_name"
              className="font-semibold text-[10px] text-sm"
            >
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              placeholder="Enter First Name"
              className="border  border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-sm"
              value={filters.first_name || ""}
              onChange={handleFilterChange}
            />
          </div>

          <div className="flex flex-col py-1">
            <label
              htmlFor="mobile"
              className="font-semibold text-[10px] text-sm"
            >
              Mobile
            </label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter Mobile No."
              className="border  border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-sm"
              value={filters.mobile || ""}
              onChange={handleFilterChange}
            />
          </div>

          <div className="flex flex-col py-1">
            <label
              htmlFor="email"
              className="font-semibold text-[10px] text-sm"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              className="border  border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-sm"
              placeholder="Enter Email"
              value={filters.email || ""}
              onChange={handleFilterChange}
            />
          </div>

          <div className="flex flex-col py-1">
            <label
              htmlFor="country"
              className="font-semibold text-[10px] text-sm"
            >
              Country
            </label>
            <select
              name="country"
              className="w-full  border text-[10px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              value={filters.country || ""}
              onChange={handleFilterChange}
            >
              <option value="">Select Country</option>
              {countryNames.map((country) => (
                <option value={country} key={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col py-1">
            <label
              htmlFor="state"
              className="font-semibold text-[10px] text-sm"
            >
              State
            </label>
            <select
              name="state"
              className="w-full  border text-[10px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              value={filters.state || ""}
              onChange={handleFilterChange}
            >
              <option value="">Select State</option>
            </select>
          </div>

          <div className="flex flex-col py-1">
            <label htmlFor="city" className="font-semibold text-[10px] text-sm">
              City
            </label>
            <select
              name="city"
              className="w-full  border text-[10px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              value={filters.city || ""}
              onChange={handleFilterChange}
            >
              <option value="">Select City</option>
            </select>
          </div>

          <div className="flex flex-col py-1">
            <label
              htmlFor="userType"
              className="font-semibold text-[10px] text-sm"
            >
              User Type
            </label>
            <select
              name="userType"
              className="w-full  border text-[10px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              value={filters.userType || ""}
              onChange={handleFilterChange}
            >
              <option value="">Select User Type</option>
              {userTypeOptions.map((user) => (
                <option value={user} key={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col py-1">
            <label
              htmlFor="status"
              className="font-semibold text-[10px] text-sm"
            >
              Status
            </label>
            <select
              name="status"
              className="w-full  border text-[10px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              value={filters.status || ""}
              onChange={handleFilterChange}
            >
              <option value="">Select Status</option>
              {statusOptions.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end p-4 pt-0">
          <button
            className="text-[10px] sm:text-sm cursor-pointer  px-3 py-[3px] bg-[#dfad0a] rounded-sm "
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            className="text-[10px] sm:text-sm cursor-pointer  px-3 py-[3px] bg-[#dfad0a] rounded-sm"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex justify-end px-6 sm:px-12 mt-6">
        <Link
          href="/add-user"
          className="flex items-center gap-2 bg-[#dfad0a] text-white text-[10px] sm:text-sm font-medium px-4 py-2 rounded-sm hover:bg-[#9d7a20] transition"
        >
          <Plus className="w-4 h-4" />
          Add User
        </Link>
      </div>

      <div className="py-4 px-6 sm:px-12">
        <div className="bg-white rounded md shadow-md overflow-hidden">
          <div className="flex flex-col justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-md font-semibold text-gray-800 sm:text-lg">
              View/Update User Records
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
                      className="hover:bg-pink-50 transition-colors"
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
      </div>
    </React.Fragment>
  );
}
