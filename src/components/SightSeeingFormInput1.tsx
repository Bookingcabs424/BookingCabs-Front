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

interface CityTaxiFormInputProps {
  register: UseFormRegister<bookingFormData>;
  errors: FieldErrors<bookingFormData>;
  control: Control<bookingFormData>;
  watch: any;
  setValue: any;
}

const SightSeeingFormInput1: FC<CityTaxiFormInputProps> = ({
  register,
  errors,
  control,
  watch,
  setValue,
}) => {
  return (
    <>
      {/* City Tour Type Nationality */}
      <div className="grid grid-cols-2 sm:px-3  lg:grid-cols-3 lg:px-6 dark:text-black">
        <div className="city-input flex flex-col px-3 lg:p-1">
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
            className="border-b border-gray-400 px-0 py-2  outline-none text-[10px] focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all sm:text-sm"
          />
          {errors?.city && (
            <p className="text-[10px] text-red-600 sm:text-xs">
              {errors?.city?.message}
            </p>
          )}
        </div>

        <div className="pickup_location-input flex flex-col px-3 lg:p-1">
          <label
            htmlFor="pickup_location"
            className="font-[500] text-[12px] sm:text-[14px]"
          >
            Tour Type <span className="text-red-500">*</span>
          </label>
          <input
            autoComplete="off"
            type="text"
            {...register("pickup_area")}
            placeholder="Enter Tour Type"
            className="border-b border-gray-400 px-0 py-2  outline-none text-[10px] focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all sm:text-sm"
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
            {...register("pickup_area")}
            placeholder="Enter Nationality"
            className="border-b border-gray-400 px-0 py-2  outline-none text-[10px] focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all sm:text-sm"
          />
          {errors?.pickup_area && (
            <p className="text-[10px] text-red-600 sm:text-xs">
              {errors?.pickup_area?.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 py-1 px-3 sm:px-6 dark:text-black">
        <div className="city-input flex flex-col ">
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
            className="border-b border-gray-400 px-0 py-2  outline-none text-[10px] focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all sm:text-sm"
          />
          {errors?.pickup_address && (
            <p className="text-[10px] text-red-600 sm:text-xs">
              {errors?.pickup_address?.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid  px-3 grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 dark:text-black">
        <div className="grid col-span-3 py-1 col-span-3 sm:px-3 lg:col-span-1">
          <DateTimePicker
            control={control}
            errors={errors}
            name="date_and_time"
            title="Date & Time"
            isRequired={false}
          />
        </div>
      </div>
    </>
  );
};

export default SightSeeingFormInput1;


