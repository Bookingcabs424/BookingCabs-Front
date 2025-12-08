"use client";

import { useEffect, useState } from "react";
import {
  Logs,
  CircleUserRound,
  BusFront,
  MapPin,
  Funnel,
  Search,
  RefreshCw 
} from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
// import { quotationSchema } from "@/app/(with-sidebar)/transport/page";
import z from "zod";
import { useGetCitiesbyStateId, useGetStatesbyCountryId } from "../hooks/useCommon";
const bookingTypes = [
  {name:"Rental",id:1},
  {name:"City Taxi",id:2},
  {name:"Airport Transfer",id:3},
  {name:"Outstation",id:4},
  {name:"Oneway",id:5},
 {name: "Activity",id:6},
  {name:"Transport Package",id:7},
];

const vehicleTypes = [
  "Hatch Back",
  "Comfort Sedan",
  "Prime Compact",
  "Prime",
  "Prime Plus",
  "Prime SUV Plus",
  "Premium Sedan",
  "Luxury Sedan",
  "Luxury Sedan II",
  "Super Luxury Sedan",
  "Super Luxury Sedan II",
  "Compact MUV",
  "Luxury SUV",
  "Delux Van (9 Seats)",
  "Luxury Van",
  "Luxury Van Plus",
  "Mini Coach (9 Seats)",
  "Mini Coach (12 Seats)",
  "Mini Coach (16 Seater)",
  "Mini Coach (20 Seater)",
  "Mini Coach (27 Seats)",
  "Deluxe Coach (35 Seater)",
  "Deluxe Coach (41 Seats)",
  "Mini Coach (12 Seater)",
  "Luxury Coach (45 Seater)",
  "Super Cars",
  "Deluxe Coach (27 Seats)",
];

const indianState = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kenmore",
  "Kerala",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Narora",
  "Natwar",
  "Odisha",
  "Paschim Medinipur",
  "Pondicherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "Vaishali",
  "West Bengal",
];
const quotationSchema = z.object({
  booking_id: z.string().optional(),
  booking_type: z.string().optional(),
  since: z.string().optional(),
  to: z.string().optional(),
  client_first_name: z.string().optional(),
  client_last_name: z.string().optional(),
  client_id: z.string().optional(),
  client_mobile_no: z.string().optional(),
  client_email: z.string().optional(),
  vehicleType: z.string().optional(),
  state_name: z.string().optional(),
  city_name: z.string().optional(),
  pickup: z.string().optional(),
  dropOff: z.string().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
});
type QuotationFormValues = z.infer<typeof quotationSchema>;

type Props = {
  register: UseFormRegister<QuotationFormValues>
  errors: FieldErrors<QuotationFormValues>
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  onClear: () => void;
  watch:any
};
export default function FindQuotationForm({
  register,
  errors,
  watch,
  onSubmit,
  onClear,
}:Props){
  const [quotationFormType, setQuotationFormType] = useState<string>("general");
  const [CityId,setCityId]=useState<number>()
  const {data:indianStates,isSuccess}= useGetStatesbyCountryId(101)
    const {data:Cities,refetch}= useGetCitiesbyStateId(watch('state_name'))

  useEffect(()=>{
    refetch()

  },[watch('state_name')])
  return (
 <div className="py-5">
  {JSON.stringify(errors)}
      <form
        onSubmit={onSubmit}
        className="find-quotation-for bg-white shadow-md border border-gray-300 m-6 mb-3 rounded-sm sm:m-12"
      >
        <h1 className="bg-gray-300 py-3 px-5 font-semibold flex items-center gap-2 text-sm sm:text-base">
          <Funnel className="h-4 w-4 sm:w-5 sm:h-5" />
          Find Quotation
        </h1>

        {/* Tabs */}
        <div className="form grid grid-cols-2 gap-4 px-6 pt-3 sm:grid-cols-4 lg:flex">
          {[
            { type: "general", icon: <Logs className="w-5 h-5" />, label: "General" },
            { type: "client", icon: <CircleUserRound className="w-5 h-5" />, label: "Client" },
            { type: "vehicle", icon: <BusFront className="w-5 h-5" />, label: "Vehicle" },
            { type: "location", icon: <MapPin className="w-5 h-5" />, label: "Location" },
          ].map((btn) => (
            <button
              key={btn.type}
              type="button"
              onClick={() => setQuotationFormType(btn.type)}
              className={`text-[12px] sm:text-sm cursor-pointer py-2 px-4 rounded-sm border border-[#101828] flex items-center gap-2 hover:bg-[#101828] hover:text-white ${
                quotationFormType === btn.type
                  ? "bg-[#101828] text-white"
                  : "text-[#101828]"
              }`}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>

        {/* Sections */}
        {quotationFormType === "general" && (
          <div className="grid grid-cols-1 px-6 py-6 gap-3 sm:px-9 md:grid-cols-2">
            <div>
              <label className="font-semibold text-[12px] sm:text-sm">
                Quotation ID
              </label>
              <input
                {...register("booking_id")}
                className="border p-2 w-full text-sm"
              />
              {errors.booking_id && (
                <span className="text-red-500 text-xs">
                  {errors.booking_id.message}
                </span>
              )}
            </div>
            <div>
              <label className="font-semibold text-[12px] sm:text-sm">
                Booking Type
              </label>
              <select {...register("booking_type")} className="border p-2 w-full text-sm">
                <option value="">Select</option>
                {bookingTypes.map((i) => (
                  <option key={i?.id} value={i?.id}>
                    {i?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 px-6 pb-9 sm:px-9">
              <div className="flex justify-between flex-col col-span-2 gap-3 md:flex-row md:items-end md:gap-9 md:col-span-1">
                <label
                  htmlFor="requestData"
                  className="whitespace-nowrap font-semibold text-[12px] sm:text-sm"
                >
                  Initial Request Data
                </label>
                <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                  <label
                    htmlFor="since"
                    className="block text-[12px] sm:text-sm text-gray-500"
                  >
                    Since
                  </label>
                  <input
                    className="border border-gray-300 w-full px-2 rounded-sm text-[12px] sm:text-sm py-2 outline-none"
                    type="date"
                    name="since"
                    placeholder="since"
                    id=""
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                  <label
                    htmlFor="to"
                    className="block text-[12px] sm:text-sm text-gray-500"
                  >
                    To
                  </label>
                  <input
                    className="border border-gray-300 w-full px-2 rounded-sm text-[12px] sm:text-sm py-2 outline-none"
                    type="date"
                    name="to"
                    placeholder="to"
                    id=""
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {quotationFormType === "client" && (
          <div className="grid grid-cols-1 p-6 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <input placeholder="First Name" {...register("client_first_name")} className="border p-2 text-sm" />
            <input placeholder="Last Name" {...register("client_last_name")} className="border p-2 text-sm" />
            <input placeholder="Client ID" {...register("client_id")} className="border p-2 text-sm" />
            <input placeholder="Mobile" {...register("client_mobile_no")} className="border p-2 text-sm" />
            <input placeholder="Email" {...register("client_email")} type="email" className="border p-2 text-sm" />
          </div>
        )}

        {quotationFormType === "vehicle" && (
          <div className="p-6">
            <select {...register("vehicleType")} className="border p-2 w-full text-sm">
              <option value="">Select Vehicle Type</option>
              {vehicleTypes.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        )}

        {quotationFormType === "location" && (
          <div className="grid grid-cols-1 p-6 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <select {...register("state_name")} className="border p-2 text-sm">
              <option value="">Select State</option>
              {indianStates.map((s:any) => (
                <option key={s?.id} value={s?.id}>
                  {s?.name}
                </option>
              ))}
            </select>
             <select {...register("city_name")} className="border p-2 text-sm">
              <option value="">Select City</option>
              {Cities?.map((s:any) => (
                <option key={s?.id} value={s?.id}>
                  {s?.name}
                </option>
              ))}
            </select>
            {/* <input placeholder="City" {...register("city_name")} className="border p-2 text-sm" /> */}
            <input placeholder="Pickup" {...register("pickup")} className="border p-2 text-sm" />
            <input placeholder="Drop Off" {...register("dropOff")} className="border p-2 text-sm" />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 justify-end p-4">
          <button
            type="button"
            onClick={onClear}
            className="py-2 px-6 rounded-sm bg-gray-400 text-white text-sm"
          >
            Clear
          </button>
          <button
            type="submit"
            className="py-2 px-6 rounded-sm bg-[#101828] text-white text-sm"
          >
            Search
          </button>
        </div>
      </form>

      {/* Refresh */}
      <button
        type="button"
        onClick={() => location.reload()}
        className="text-[12px] sm:text-sm cursor-pointer py-2 px-4 rounded-sm bg-[#101828] text-white mx-6 flex items-center gap-1 sm:mx-12"
      >
        <RefreshCw className="w-5 h-5" /> Refresh
      </button>
    </div>
  );
}
