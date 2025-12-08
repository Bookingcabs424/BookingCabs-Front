"use client";
import { ChevronLeft, RefreshCcw, Save, Upload } from "lucide-react";
import { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


interface RoleSettingInterface {
  activeRoleForm: string;
  setActiveRoleForm: React.Dispatch<React.SetStateAction<string>>;
}




// Validation Schema
const RoleSettingSchema = z.object({
  role_title: z.string().min(1, "Role Title is required"),
  brief_description: z.string().min(1, "Brief Description is required"),
});

type UserFormData = z.infer<typeof RoleSettingSchema>;

export default function RoleSettingForm({
  activeRoleForm,
  setActiveRoleForm,
}: RoleSettingInterface) {

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
      } = useForm<UserFormData>({
        resolver: zodResolver(RoleSettingSchema),
      });


  const [status, setStatus] = useState<string>("active");
  const handleToggle = (buttonId: string) => {
    setStatus((prev) => (prev === buttonId ? "active" : buttonId));
  };

   const onSubmit = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="membership-form-btns flex flex-col items-end w-full py-6 px-6">
        <div className="flex gap-2 justify-end items-end">
          <button
          type="button"
            onClick={() => setActiveRoleForm("RoleList")}
            className="StatementAccounts flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#367FA9] text-white font-semibold"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>

          <button type="button" className="StatementAccounts flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#009551] text-white font-semibold">
            <RefreshCcw className="w-5 h-5" /> Reset
          </button>

          <button type="submit" className="StatementAccounts flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#E08E0B] text-white font-semibold">
            <Save className="w-5 h-5" /> Save
          </button>
        </div>
      </div>

      <div className="add-member-form bg-white shadow-md border border-gray-300 m-6 mb-3 mt-0 rounded-sm sm:m-12 sm:mb-3 sm:mt-0">
        <h1 className="bg-gray-300 py-3 px-5  font-semibold flex items-center gap-2 text-sm sm:text-base">
          Role Management Settings
        </h1>
        <div className="grid grid-cols-2 p-3 px-5 sm:px-12 sm:p-6 gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="bookingReference"
              className="font-semibold text-[12px] text-sm"
            >
              Role Title <span className="text-red-500">*</span>
            </label>
            <input
            {...register("role_title")}
              type="text"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] col-span-2 sm:text-sm lg:col-span-1"
              placeholder="Enter Role Title"
            />
            {errors.role_title && (
            <p className="text-xs text-red-600 mt-1">
              {errors.role_title.message}
            </p>
          )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="pickupFrom"
              className="font-semibold text-[12px] text-sm"
            >
              Role Description <span className="text-red-500">*</span>
            </label>
            <input
            {...register("brief_description")}
              type="text"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] col-span-2 sm:text-sm lg:col-span-1"
              placeholder="Enter Role Description"
            />
            {errors.brief_description && (
            <p className="text-xs text-red-600 mt-1">
              {errors.brief_description.message}
            </p>
          )}
          </div>

          <div className="py-3 flex items-center gap-12 py-1">
            <span className="font-semibold text-[12px] text-sm">Status</span>
            {[
              { id: "active", label: "Active" },
              { id: "deactive", label: "De-Active" },
            ].map((option) => (
              <div
                key={option.id}
                className="flex gap-1 items-center text-sm sm:gap-3 "
              >
                <div
                  onClick={() => handleToggle(option.id)}
                  className={`rounded-full border-2 border-gray-500 cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300
        ${status === option.id ? "justify-end" : "justify-start"}
        min-w-10 min-h-5 sm:min-w-14 sm:min-h-7`}
                >
                  <div className="h-3.5 w-3.5 sm:h-5 sm:w-5 rounded-full bg-gray-500 shadow-md transition-all duration-300" />
                </div>
                <p className="text-sm font-[500]">
                  {option.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
