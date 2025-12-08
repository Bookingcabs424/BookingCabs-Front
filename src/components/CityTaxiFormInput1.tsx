import { useState } from "react";
import { FC } from "react";
import {
  UseFormRegister,
  FieldValues,
  FieldErrors,
  Control,
} from "react-hook-form";
import { bookingFormData } from "./BookingForm";
import DateTimePicker from "./DateTimePicker";
import DateTimePicker1 from "./DateTimePicker1";

interface CityTaxiFormInputProps {
  register: UseFormRegister<bookingFormData>;
  errors: FieldErrors<bookingFormData>;
  control: Control<bookingFormData>;
}

const CityTaxiFormInput1: FC<CityTaxiFormInputProps> = ({
  register,
  errors,
  control,
}) => {
  const [activePickup, setActivePickup] = useState<string>("pickup-now");

  // Toggle function
  const handleToggle = (buttonId: string) => {
    setActivePickup((prev) => (prev === buttonId ? "pickup-now" : buttonId));
  };
  return (
    <>
      {/* City Package Pickup Location */}
      <div className="grid grid-cols-2  sm:px-6 lg:grid-cols-3 dark:text-black">
        <div className="city-input flex flex-col px-3 py-1  lg:p-1">
          <label
            htmlFor="city"
            className="font-[500] text-[12px] sm:text-[14px]"
          >
            City <span className="text-red-500">*</span>
          </label>
          <input
            autoComplete="off"
            type="text"
            {...register("city")}
            placeholder="Enter City"
            defaultValue=""
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
          />
          {errors?.city && (
            <p className="text-[10px] text-red-600 sm:text-xs">
              {errors?.city?.message}
            </p>
          )}
        </div>

        <div className="pickup_location-input flex flex-col px-3 py-1  lg:p-1">
          <label
            htmlFor="pickup_location"
            className="font-[500] text-[12px] sm:text-[14px]"
          >
            Pickup Area <span className="text-red-500">*</span>
          </label>
          <input
            autoComplete="off"
            type="text"
            {...register("pickup_area")}
            placeholder="Enter Pickup Area"
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
          />
          {errors?.pickup_area && (
            <p className="text-[10px] text-red-600 sm:text-xs">
              {errors?.pickup_area?.message}
            </p>
          )}
        </div>
        <div className="pickup_location-input flex flex-col px-3 lg:p-1">
          <label
            htmlFor="pickup_location"
            className="font-[500] text-[12px] sm:text-[14px]"
          >
            Nationality <span className="text-red-500">*</span>
          </label>
          <input
            autoComplete="off"
            type="text"
            {...register("nationality")}
            placeholder="Enter Nationality"
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
          />
          {errors?.nationality && (
            <p className="text-[10px] text-red-600 sm:text-xs">
              {errors?.nationality?.message}
            </p>
          )}
        </div>
      </div>

      {/* Pickup Area */}
      <div className="grid grid-cols-1  py-1 md:px-6 lg:px-3 dark:text-black">
        <div className="city-input flex flex-col px-3 py-1 ">
          <label
            htmlFor="pickup_address"
            className="font-[500] text-[12px] sm:text-[14px]"
          >
            Pickup Address <span className="text-red-500">*</span>
          </label>
          <input
            autoComplete="off"
            type="text"
            {...register("pickup_address")}
            placeholder="Enter Pickup Address"
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
          />
          {errors?.pickup_address && (
            <p className="text-[10px] text-red-600 sm:text-xs">
              {errors?.pickup_address?.message}
            </p>
          )}
        </div>
      </div>

      {/* Drop Area */}
      <div className="grid grid-cols-1 py-1 md:px-6 lg:px-3 dark:text-black">
        <div className="city-input flex flex-col px-3 py-1 ">
          <label
            htmlFor="pickup_address"
            className="font-[500] text-[12px] sm:text-[14px]"
          >
            Drop Area / Address <span className="text-red-500">*</span>
          </label>
          <input
            autoComplete="off"
            type="text"
            {...register("drop_address")}
            placeholder="Enter Drop Area / Address"
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
          />
          {errors?.drop_address && (
            <p className="text-[10px] text-red-600 sm:text-xs">
              {errors?.drop_address?.message}
            </p>
          )}
        </div>
      </div>

      {/* Toggle  */}
      <div className="px-3 my-2 grid grid-cols-2 gap-2  py-1 sm:gap-4 lg:grid-cols-3 py-1 lg:px-6 dark:text-black">
        {[
          { id: "pickup-now", label: "Pick Now (Within 30 Minutes)" },
          { id: "pickup-after", label: "Pick Later (After 1 Hr.)" },
        ].map((option) => (
          <div key={option.id} className="flex gap-3 items-center text-sm ">
            <div
              onClick={() => handleToggle(option.id)}
              className={`rounded-full border-2 border-[#dfad0a] cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300
        ${activePickup === option.id ? "justify-end" : "justify-start"}
        min-w-10 min-h-5 sm:min-w-14 sm:min-h-7`}
            >
              <div className="h-3.5 w-3.5 sm:h-5 sm:w-5 rounded-full bg-[#dfad0a] shadow-md transition-all duration-300" />
            </div>
            <p className="text-[8px] md:text-[11px] lg:text-[13px]">
              {option.label}
            </p>
          </div>
        ))}
      </div>

      {/* Pickup After */}
      {activePickup === "pickup-after" && (
        <div className="py-1 px-3 lg:w-[40%] lg:px-6 dark:text-black">
          <div className="">
            <DateTimePicker1
              control={control}
              errors={errors}
              name="date_and_time"
              title="Date & Time"
              isRequired={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CityTaxiFormInput1;
