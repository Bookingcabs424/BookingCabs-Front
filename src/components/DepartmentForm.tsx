"use client";
import { ChevronLeft, RefreshCcw, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
} from "../hooks/useCommon";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";

interface DepartmentInterface {
  activeDepartmentForm: string;
  setActiveDepartmentForm: React.Dispatch<React.SetStateAction<string>>;
}

const RoleSettingSchema = z.object({
  department_name: z.string().min(1, "Department Name is required"),
  description: z.string().min(1, "Description is required"),
});

type UserFormData = z.infer<typeof RoleSettingSchema>;

export default function DepartmentForm({
  activeDepartmentForm,
  setActiveDepartmentForm,
}: DepartmentInterface) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(RoleSettingSchema),
  });

  const [status, setStatus] = useState<string>("active");
  const { user } = useAuth();
  const { mutate: addDepartment } = useAddDepartmentMutation();
  const { mutate: updateDepartment } = useUpdateDepartmentMutation();
  const [editId, setEditId] = useState<number | null>(null);

  const handleToggle = (buttonId: string) => {
    setStatus(buttonId);
  };

  useEffect(() => {
    const rowData = localStorage.getItem("editDepartment");
    if (rowData) {
      const data = JSON.parse(rowData);
      setValue("department_name", data.departmentName);
      setValue("description", data.description);
      setEditId(data.id);
      setStatus(data.status === 1 ? "active" : "deactive");
    }
  }, [setValue]);

  const onSubmit = (formData: UserFormData) => {
    const payload = {
      ...formData,
      status: status === "active" ? 1 : 0,
    };

    if (editId) {
      updateDepartment(
        { ...payload, id: editId, modified_by: user?.id ?? 1 },
        {
          onSuccess: (res) => {
            toast.success("Department updated successfully!");
            reset();
            localStorage.removeItem("editDepartment");
            setActiveDepartmentForm("DepartmentList");
          },
          onError: () => toast.error("Failed to update department"),
        }
      );
    } else {
      // 🔹 Add Department
      addDepartment(
        { ...payload, created_by: user?.id ?? 1 },
        {
          onSuccess: (res) => {
            toast.success("Department added successfully!");
            reset();
            setActiveDepartmentForm("DepartmentList");
          },
          onError: () => toast.error("Failed to add department"),
        }
      );
    }
  };
  const onBackClck = () => {
    localStorage.removeItem("editDepartment");
    setActiveDepartmentForm("DepartmentList");
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header Buttons */}
      <div className="membership-form-btns flex flex-col items-end w-full py-6 px-6">
        <div className="flex gap-2 justify-end items-end">
          <button
            type="button"
            onClick={onBackClck}
            className="StatementAccounts flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#367FA9] text-white font-semibold"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>

          <button
            type="button"
            onClick={() => reset()}
            className="StatementAccounts flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#009551] text-white font-semibold"
          >
            <RefreshCcw className="w-5 h-5" /> Reset
          </button>

          <button
            type="submit"
            className="StatementAccounts flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#E08E0B] text-white font-semibold disabled:opacity-50"
          >
            <Save className="w-5 h-5" /> {editId ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="add-member-form bg-white shadow-md border border-gray-300 m-6 mb-3 mt-0 rounded-sm sm:m-12 sm:mb-3 sm:mt-0">
        <h1 className="bg-gray-300 py-3 px-5 font-semibold flex items-center gap-2 text-sm sm:text-base">
          Role Department Management
        </h1>
        <div className="grid grid-cols-2 p-3 px-5 sm:px-12 sm:p-6 gap-3">
          {/* Department Name */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-[12px] text-sm">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("department_name")}
              type="text"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
              placeholder="Enter Department Name"
            />
            {errors.department_name && (
              <p className="text-xs text-red-600 mt-1">
                {errors.department_name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-[12px] text-sm">
              Role Description <span className="text-red-500">*</span>
            </label>
            <input
              {...register("description")}
              type="text"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
              placeholder="Enter Description"
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Status Toggle */}
          <div className="py-3 flex items-center gap-12">
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
                <p className="text-sm font-[500]">{option.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
