"use client";

import { Calendar, Users, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import { useAddCoworker, useDeleteCoworker, useGetCoworkerList, useUpdateCoworker } from "../hooks/useCommon";
import { useQueryClient } from "@tanstack/react-query";
import BookingTable from "./common/Table";
import Swal from "sweetalert2";

// ✅ Zod Schema for single coworker
const coworkerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  email: z.string().email("Invalid email"),
  mobile: z.string().min(10, "Mobile must be 10 digits"),
  dob: z.string().min(1, "DOB is required"),
  referral_code: z.string().optional(),
});

type FormData = z.infer<typeof coworkerSchema>;

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: any;
  render?: (value: any, row?: any) => React.ReactNode;
  hidden?: boolean;
}

export default function UserCoworkerForm() {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(coworkerSchema),
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      relationship: "",
      email: "",
      mobile: "",
      dob: "",
      referral_code: "",
    },
  });

  const { mutate: addCoworker, isPending: isAdding } = useAddCoworker();
  const { mutate: updateCoworker, isPending: isUpdating } = useUpdateCoworker();
  const { data: coworkerList } = useGetCoworkerList();

  const isPending = isAdding || isUpdating;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        title: data.title,
        relationship: data.relationship,
        mobile: data.mobile,
        email: data.email,
        dob: data.dob,
        referral_code: data.referral_code || "",
      };

      if (isEditing && editingId) {
        // Update existing coworker
        await updateCoworker({ ...payload, id: editingId });
        alert("Co-worker updated successfully!");
      } else {
        // Add new coworker
        await addCoworker(payload);
        alert("Co-worker added successfully!");
      }

      reset();
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error ${isEditing ? 'updating' : 'adding'} co-worker. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (row: any) => {
    console.log("Editing row:", row);
    
    // Set form values from the selected row
    setValue("title", row.title || "");
    setValue("firstName", row.first_name || "");
    setValue("lastName", row.last_name || "");
    setValue("relationship", row.relationship || "");
    setValue("email", row.email || "");
    setValue("mobile", row.mobile || "");
    setValue("dob", row.dob || "");
    setValue("referral_code", row.referral_code || "");

    // Set editing state
    setIsEditing(true);
    setEditingId(row.id);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    reset();
    setIsEditing(false);
    setEditingId(null);
  };
const {mutate: deleteCoworker, isPending: isDeleting } = useDeleteCoworker();
const handleDelete = (row: any) => {
  console.log("Deleting row:", row);
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
         deleteCoworker(row.id)
          Swal.fire("Deleted!", "Your Co Worker has been deleted.", "success");
        }
      });
}
  const titleOptions = ["Mr", "Mrs", "Ms", "Miss", "Master"];
  const relationshipOptions = [
    "parent",
    "spouse",
    "child",
    "in-law",
    "sibling",
    "friend",
    "colleague",
    "manager",
    "team-member",
  ];

  // Table columns configuration
  const coworkerColumns: Column[] = [
    { 
      key: "id", 
      header: "ID", 
      sortable: true, 
      filterable: true 
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      filterable: true,
    },
    {
      key: "first_name",
      header: "First Name",
      sortable: true,
      filterable: true,
    },
    {
      key: "last_name",
      header: "Last Name",
      sortable: true,
      filterable: true,
    },
    {
      key: "relationship",
      header: "Relationship",
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "spouse" 
            ? 'bg-purple-100 text-purple-800' 
            : value === "sibling"
            ? 'bg-blue-100 text-blue-800'
            : value === "colleague"
            ? 'bg-green-100 text-green-800'
            : value === "manager"
            ? 'bg-orange-100 text-orange-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
      filterable: true,
    },
    {
      key: "mobile",
      header: "Mobile",
      sortable: true,
      filterable: true,
    },
    {
      key: "dob",
      header: "Date of Birth",
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <span className="text-xs">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "referral_code",
      header: "Referral Code",
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <span className="text-xs">
          {value || "-"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created Date",
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <span className="text-xs">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      sortable: false,
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 hover:underline text-sm flex items-center gap-1"
            onClick={() => handleEdit(row)}
          >
            <Edit className="w-3 h-3" />
            Edit
          </button>
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 hover:underline text-sm flex items-center gap-1"
            onClick={() => handleDelete(row)}
          >
            <Edit className="w-3 h-3" />
           Delete
          </button>
          
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 overflow-hidden w-full">
          <div className="p-8 space-y-1">
            {/* Header with Edit Indicator */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Users className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-[16px] font-semibold text-gray-800">
                  {isEditing ? `Edit Co-worker #${editingId}` : "Co-Worker Details"}
                </h3>
              </div>
              {isEditing && (
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  Editing Mode
                </span>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-3 items-center gap-3 mb-2">
              {/* Title */}
              <div className="space-y-1">
                <label className="block text-[10px] font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("title")}
                  className="border border-gray-300 p-2 px-3 rounded-sm w-full text-[10px] outline-none"
                >
                  <option value="">Select Title</option>
                  {titleOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.title && (
                  <p className="text-[10px] text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* First Name */}
              <div className="space-y-1">
                <label className="block text-[10px] font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("firstName")}
                  className="border border-gray-300 p-2 px-3 rounded-sm w-full text-[10px] outline-none"
                  placeholder="Enter First Name"
                />
                {errors.firstName && (
                  <p className="text-[10px] text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <label className="block text-[10px] font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("lastName")}
                  className="border border-gray-300 p-2 px-3 rounded-sm w-full text-[10px] outline-none"
                  placeholder="Enter Last Name"
                />
                {errors.lastName && (
                  <p className="text-[10px] text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Relationship */}
              <div className="space-y-1">
                <label className="block text-[10px] font-medium text-gray-700">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("relationship")}
                  className="border border-gray-300 p-2 px-3 rounded-sm w-full text-[10px] outline-none"
                >
                  <option value="">Select Relationship</option>
                  {relationshipOptions.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.relationship && (
                  <p className="text-[10px] text-red-500">
                    {errors.relationship.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[10px] font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="border border-gray-300 p-2 px-3 rounded-sm w-full text-[10px] outline-none"
                  placeholder="Enter Email"
                />
                {errors.email && (
                  <p className="text-[10px] text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Mobile */}
              <div className="space-y-1">
                <label className="block text-[10px] font-medium text-gray-700">
                  Mobile No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register("mobile")}
                  className="border border-gray-300 p-2 px-3 rounded-sm w-full text-[10px] outline-none"
                  placeholder="Enter Mobile No."
                />
                {errors.mobile && (
                  <p className="text-[10px] text-red-500">{errors.mobile.message}</p>
                )}
              </div>

              {/* DOB */}
              <div className="space-y-1 relative">
                <label className="block text-[10px] font-medium text-gray-700">
                  DOB <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("dob")}
                  max={today}
                  className="border border-gray-300 p-2 px-3 rounded-sm w-full text-[10px] outline-none cursor-pointer"
                />
                
                {errors.dob && (
                  <p className="text-[10px] text-red-500">{errors.dob.message}</p>
                )}
              </div>

              {/* Referral Code */}
              <div className="space-y-1">
                <label className="block text-[10px] font-medium text-gray-700">
                  Referral Code
                </label>
                <input
                  type="text"
                  {...register("referral_code")}
                  className="border border-gray-300 p-2 px-3 rounded-sm w-full text-[10px] outline-none"
                  placeholder="Enter Referral Code"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-end mt-10 gap-4 pt-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting || isPending}
                className="text-[10px] py-1 px-3 border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditing ? 'Cancel Edit' : 'Reset'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isPending}
                className="text-[10px] py-1 px-3 cursor-pointer border border-transparent rounded-md shadow-md font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting || isPending 
                  ? "Saving..." 
                  : isEditing 
                    ? "Update Co-worker" 
                    : "Save Co-worker"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Co-worker List Table */}
      <div className="mt-8">
        <BookingTable
          data={coworkerList}
          columns={coworkerColumns}
          heading={[{ heading: "Co-worker List" }]}
          searchable={true}
          filterable={true}
          sortable={true}
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}