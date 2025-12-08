"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useState, useMemo, useEffect, Suspense } from "react";
import {
  useAddUserVehicleMutation,
  getVehicleNameTypeList,
  getVehicleColorList,
  getVehicleUserList,
} from "../hooks/useCommon";
import { debounce, flatMap } from "lodash";
import {
  vehicleColor,
  ignitionType,
  amenities,
} from "../constants/formSelectConstants";
import { useAuth } from "../store/auth";
// Validation Schema
const vehicleDetailsFormSchema = z.object({
  vehicle_name: z.string().min(1, "Vehicle Name is required"),
  ignition_type_id: z.string().min(1, "Ingnititon Type is required"),
  color: z.string().optional(),
  carrier: z.string().optional(),
  owner: z.string().optional(),
  model_year: z.string().optional(),
  vehicle_code: z.string().optional(),
  vehicle_reg_no: z.string().optional(),
  owner_name: z.string().optional(),
  vehicle_name_id: z.string().optional(),
  permit_expiry: z.string().optional(),
  fleet: z.coerce.number().min(1, "Fleet is required"),
});

type VehicleFormData = z.infer<typeof vehicleDetailsFormSchema>;

const carrierTypes = [
  { id: "yes", label: "YES" },
  { id: "no", label: "NO" },
];

const ownerTypes = [
  { id: "owned", label: "Owned" },
  { id: "attached", label: "Attached" },
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 21 }, (_, i) => currentYear - 20 + i);

const VehicleDetailsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleDetailsFormSchema),
    defaultValues: {
      carrier: "yes",
      owner: "owned",
    },
  });
  const { data: vehicleDetail, refetch } = getVehicleNameTypeList();
  const { data: vehicleColorData, refetch: colorRefetch } =
    getVehicleColorList();

  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const mobile = searchParams.get("mobile");
  const typeId = searchParams.get("typeId");

  const [carrier, setCarrier] = useState<string>("yes");
  const [owner, setOwner] = useState("owned");
  const { mutate: addFormMutate } = useAddUserVehicleMutation();

  const handleCarrierToggle = (buttonId: string) => {
    setValue("carrier", buttonId);
    setCarrier((prev) => (prev === buttonId ? "yes" : buttonId));
  };
  const handleOwnerTypeToggle = (buttonId: string) => {
    setCarrier((prev) => (prev === buttonId ? "owned" : buttonId));
  };
  useEffect(() => {
    refetch();
    colorRefetch();
  }, []);
  const [vehicleInput, setVehicleNameInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedVehcileId, setSelectedVehicleId] = useState<string>("");

  const router = useRouter();
  const inputClass =
    "text-black w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none text-sm";

  const onSubmit = (data: any) => {
    addFormMutate(
      {
        user_email: email,
        user_mobile: mobile,
        typeId: typeId,
        ...data,
      },
      {
        onSuccess: (res: any) => {
          toast.success("Vehicle added successfully");
          if (typeId == "1") {
            router.push(`/login`);
          } else {
            router.push(
              `/duty-info?email=${encodeURIComponent(
                email || ""
              )}&mobile=${encodeURIComponent(
                mobile || ""
              )}&typeId=${encodeURIComponent(typeId || 0)}`
            );
          }
        },
        onError: () => {
          toast.error("Failed to add vehicle");
        },
      }
    );
  };
  const handleOwnerToggle = (buttonId: string) => {
    setOwner((prev) => (prev === buttonId ? "owned" : buttonId));
    setValue("owner", buttonId);
  };
  const debounceGetVehicleName = useMemo(() => {
    return debounce((val: string) => {
      if (!val) {
        return;
      }
    }, 500);
  }, [vehicleDetail]);
  const handleVehicleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVehicleNameInput(value);
    setShowSuggestions(true);
    debounceGetVehicleName(value);
  };

  const filteredVehicles = useMemo(() => {
    if (!vehicleInput) return [];
    return vehicleDetail?.filter((v: any) =>
      v.name?.toLowerCase().includes(vehicleInput.toLowerCase())
    );
  }, [vehicleInput, vehicleDetail]);
  const handleVehicleSelect = (name: any, id: string) => {
    setSelectedVehicleId(id);
    setVehicleNameInput(name);
    setValue("vehicle_name", name);
    setValue("vehicle_name_id", id);
    setShowSuggestions(false);
  };

  return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto bg-white rounded-md p-4 space-y-3"
      >
        {/* No.of Fleet */}
        <div className="space-y-1 w-full">
          <label className="block text-sm font-semibold text-gray-800">
            No. of Fleet <span className="text-red-600">*</span>
          </label>
          <input
            {...register("fleet")}
            type="number"
            min={1}
            placeholder="Enter No. of Fleet"
            className={inputClass}
          />
          {errors.fleet && (
            <p className="text-xs text-red-600 ">{errors.fleet.message}</p>
          )}
        </div>

        {/* Name Of Vehicle */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-800">
            Name of Vehicle <span className="text-red-600">*</span>
          </label>
          <input
            {...register("vehicle_name")}
            type="text"
            placeholder="Type vehicle Name"
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onChange={handleVehicleInputChange}
            value={vehicleInput}
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] focus:ring-[#b9004b] transition-all duration-200"
          />
          {showSuggestions && filteredVehicles?.length > 0 && (
            <ul className="border rounded bg-white shadow-md max-h-40 overflow-y-auto text-sm text-gray-800">
              {filteredVehicles?.map((vehicle: any, idx: number) => (
                <li
                  key={idx}
                  onClick={() =>
                    handleVehicleSelect(`${vehicle.name}`, `${vehicle.id}`)
                  }
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {`${vehicle.name}`}
                </li>
              ))}
            </ul>
          )}
          {errors.vehicle_name && (
            <p className="text-xs text-red-600 mt-1">
              {errors.vehicle_name.message}
            </p>
          )}
        </div>

        {/* Ignition Type */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-800">
            Ignition Type <span className="text-red-600">*</span>
          </label>
          <select
            {...register("ignition_type_id")}
            name="ignition_type_id"
            id=""
            className="border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
          >
            {ignitionType.map((type) => (
              <option value={type.id} key={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.ignition_type_id && (
            <p className="text-xs text-red-600 mt-1">
              {errors.ignition_type_id.message}
            </p>
          )}
        </div>

        {/* Carrier */}
        <div className="space-y-1">
          <label htmlFor="carrier" className="font-semibold text-sm text-sm">
            Carrier <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-2 gap-8 py-2 sm:gap-4 sm:grid-cols-3 md:flex md:items-center">
            {[
              { id: "yes", label: "Yes" },
              { id: "no", label: "No" },
            ].map((option) => (
              <div
                key={option.id}
                className="flex gap-1 items-center text-sm sm:gap-2"
              >
                <div
                  onClick={() => handleCarrierToggle(option.id)}
                  className={`rounded-full border-2 border-gray-500 cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300
        ${carrier === option.id ? "justify-end" : "justify-start"}
        min-w-10 min-h-5 sm:min-w-14 sm:min-h-7`}
                >
                  <div className="h-3.5 w-3.5 sm:h-5 sm:w-5 rounded-full bg-gray-500 shadow-md transition-all duration-300" />
                </div>
                <p className="text-[12px] font-[500]">{option.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle No. */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-800">
            Vehicle No. <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center gap-1">
            <input
              {...register("vehicle_code")}
              type="text"
              placeholder="DL"
              className="text-black w-[25%] px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none text-sm"
            />

            <input
              {...register("vehicle_reg_no")}
              type="text"
              placeholder="10F1530"
              className={inputClass}
            />
          </div>
          {errors.vehicle_name && (
            <p className="text-xs text-red-600 ">
              {errors.vehicle_name.message}
            </p>
          )}
        </div>

        {/* Vehicle Color */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-800">
            Vehicle Color
          </label>
          <select
            {...register("color")}
            name="vehicle_color"
            id=""
            className="border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
          >
            {vehicleColorData?.map((color: any) => (
              <option value={color.colour_id} key={color.colour_id}>
                {color.colour_name}
              </option>
            ))}
          </select>
          {errors.color && (
            <p className="text-xs text-red-600 mt-1">{errors.color.message}</p>
          )}
        </div>

        {/* Vehicle Model */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-800">
            Vehicle Model
          </label>
          <select
            {...register("model_year")}
            name="model_year"
            id=""
            className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
          >
            {years.map((year) => (
              <option value={year} key={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle Owner */}
        <div className="space-y-1">
          <label htmlFor="carrier" className="font-semibold text-sm text-sm">
            Vehicle Owner <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-2 gap-8 py-2 sm:gap-4 sm:grid-cols-3 md:flex md:items-center">
            {[
              { id: "owned", label: "Owner" },
              { id: "attached", label: "Attached" },
            ].map((option) => (
              <div key={option.id} className="flex gap-1 items-center text-sm">
                <div
                  onClick={() => handleOwnerToggle(option.id)}
                  className={`rounded-full border-2 border-gray-500 cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300
            ${owner === option.id ? "justify-end" : "justify-start"}
            min-w-10 min-h-5 sm:min-w-14 sm:min-h-7`}
                >
                  <div className="h-3.5 w-3.5 sm:h-5 sm:w-5 rounded-full bg-gray-500 shadow-md transition-all duration-300" />
                </div>
                <p className="text-[12px] font-[500]">{option.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-800">
            Permit Expiry Date
          </label>
          <input
            {...register("permit_expiry")}
            type="date"
            className={inputClass}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#87e64b] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#4ec400] transition"
        >
          Continue
        </button>
      </form>
  );
};

export default VehicleDetailsForm;
