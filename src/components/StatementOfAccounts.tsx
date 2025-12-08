"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, XCircle } from "lucide-react";

const bookingStatusOptions = ["Pending", "Confirmed", "Cancelled"] as const;
const bookingTypeOptions = ["One Way", "Round Trip", "Multi City"] as const;
const vehicleTypeOptions = ["Sedan", "SUV", "Van"] as const;

const schema = z.object({
  bookingReference: z.string().optional(),
  bookingStatus: z.enum(bookingStatusOptions).optional(),
  agentReference: z.string().optional(),
  bookedCity: z.string().optional(),
  passengerFirstName: z.string().optional(),
  passengerLastName: z.string().optional(),
  bookingType: z.enum(bookingTypeOptions).optional(),
  vehicleType: z.enum(vehicleTypeOptions).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function BookingSearchForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
  };

  return (
    <div className="min-h-screen w-full dark:text-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md space-y-6"
      >
        <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          Manage Statement of Account
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Booking Reference",
              name: "bookingReference",
              placeholder: "Booking Reference",
            },
            {
              label: "Agent Reference",
              name: "agentReference",
              placeholder: "Agent Reference",
            },
            {
              label: "Booked City",
              name: "bookedCity",
              placeholder: "Booked City",
            },
            {
              label: "Passenger First Name",
              name: "passengerFirstName",
              placeholder: "First Name",
            },
            {
              label: "Passenger Last Name",
              name: "passengerLastName",
              placeholder: "Last Name",
            },
          ].map(({ label, name, placeholder }) => (
            <div key={name}>
              <label className="block mb-1 font-medium text-gray-700">
                {label}
              </label>
              <input
                type="text"
                {...register(name as keyof FormData)}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-invalid={!!errors[name as keyof FormData]}
              />
              {errors[name as keyof FormData] && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors[name as keyof FormData] as any)?.message}
                </p>
              )}
            </div>
          ))}

          {/* Booking Status */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Booking Status
            </label>
            <select
              {...register("bookingStatus")}
              defaultValue=""
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-invalid={!!errors.bookingStatus}
            >
              <option value="" disabled>
                Select Booking Status
              </option>
              {bookingStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.bookingStatus && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bookingStatus.message}
              </p>
            )}
          </div>

          {/* Booking Type */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Booking Type
            </label>
            <select
              {...register("bookingType")}
              defaultValue=""
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>
                --Select Booking Type--
              </option>
              {bookingTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Vehicle Type
            </label>
            <select
              {...register("vehicleType")}
              defaultValue=""
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>
                Select Vehicle Type
              </option>
              {vehicleTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              {...register("fromDate")}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              To Date
            </label>
            <input
              type="date"
              {...register("toDate")}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 justify-end">
          <button
            type="button"
            onClick={() => reset()}
            className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            <XCircle size={18} /> Clear
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded"
          >
            <Search size={18} /> Search
          </button>
        </div>
      </form>
    </div>
  );
}
