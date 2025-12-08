import { useState } from "react";
import { FC } from "react";
import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { bookingFormData } from "./BookingForm";
import DateTimePicker from "./DateTimePicker";
import DateTimePicker1 from "./DateTimePicker1";
import TimePicker from "./TimePicker";
import TimePicker1 from "./TimePicker1";

interface RentalFormInputProps {
  register: UseFormRegister<bookingFormData>;
  errors: FieldErrors<bookingFormData>;
  control: Control<bookingFormData>;
}
const RentalFormInput1: FC<RentalFormInputProps> = ({
  register,
  errors,
  control,
}) => {
  const [activePickup, setActivePickup] = useState<string>("pickup-now");
  const packages = ["package1", "package2", "package3"];
  const [comingMode, setComingMode] = useState<boolean>(false);

  // Toggle function
  const handleToggle = (buttonId: string) => {
    setActivePickup((prev) => (prev === buttonId ? "pickup-now" : buttonId));
  };

  return (
    <>
      {/* City Package Pickup Location */}
      <div className="grid grid-cols-2 px-0 sm:px-6 lg:grid-cols-3">
        <div className="city-input flex flex-col px-3 py-1 lg:p-3">
          <label
            htmlFor="city"
            className="font-[500] text-[12px] sm:text-[14px]"
          >
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("city")}
            placeholder="Enter City"
            defaultValue=""
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
          />
          {errors.city && (
            <p className="text-[10px] text-red-600 sm:text-xs">{errors.city.message}</p>
          )}
        </div>
        <div className="package-input flex flex-col px-3 py-1 lg:p-3">
          <label
            htmlFor="package"
            className="font-[500] text-[12px] sm:text-[14px]"
          >
            Package <span className="text-red-500">*</span>
          </label>
          <select
            id="package"
            defaultValue=""
            {...register("package")}
             className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
          >
            <option value="" disabled>
              Select Package
            </option>
            {packages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.package && (
            <p className="text-[10px] text-red-600 sm:text-xs">{errors.package.message}</p>
          )}
        </div>

        <div className="pickup_location-input flex flex-col px-3 py-1  lg:p-3">
          <label
            htmlFor="pickup_location"
            className="font-[500] text-[12px] sm:text-[14px]"
          >
            Pickup Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="pickup_location"
            placeholder="Enter Pickup Location"
            {...register("pickup_location")}
             className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
          />
          {errors.pickup_location && (
            <p className="text-[10px] text-red-600 sm:text-xs">
              {errors.pickup_location.message}
            </p>
          )}
        </div>
      </div>

      {/* Pickup & Nationality */}
      <div className="px-0 sm:px-6 grid grid-cols-2">
        <div className="pickup-address-input flex flex-col px-3 py-1 ">
          <label
            htmlFor="pickup_address"
            className="font-[500] text-[12px] sm:text-[14px]"
          >
            Pickup Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("pickup_address")}
            placeholder="Enter Pickup Address"
             className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
          />
          {errors.pickup_address && (
            <p className="text-[10px] text-red-600 sm:text-xs">
              {errors.pickup_address.message}
            </p>
          )}
        </div>
        <div className="nationality-input flex flex-col px-3 py-1">
          <label
            htmlFor="nationality"
            className="font-[500] text-[12px] sm:text-[14px]"
          >
            Nationality <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Nationality"
            {...register("nationality")}
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
          />
          {errors.nationality && (
            <p className="text-[10px] text-red-600 sm:text-xs">{errors.nationality.message}</p>
          )}
        </div>
      </div>

      {/* Toggle  */}
      <div className="grid  px-0 sm:px-8  gap-4 px-4 py-1 grid-cols-3 py-1">
        {[
          { id: "pickup-now", label: "Pick Now (Within 30 Minutes)" },
          { id: "pickup-after", label: "Pick Later (After 1 Hr.)" },
          { id: "pickup-multiple", label: "Pick for multiple days" },
        ].map((option) => (
          <div key={option.id} className="flex gap-1 items-center text-sm sm:gap-3 ">
            <div
              onClick={() => handleToggle(option.id)}
              className={`rounded-full border-2 border-[#dfad0a] cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300
        ${activePickup === option.id ? "justify-end" : "justify-start"}
        min-w-10 min-h-5 sm:min-w-14 sm:min-h-7`}
            >
              <div className="h-3.5 w-3.5 sm:h-5 sm:w-5 rounded-full bg-[#dfad0a] shadow-md transition-all duration-300" />
            </div>
            <p className="text-[8px] md:text-[11px] lg:text-[13px]">{option.label}</p>
          </div>
        ))}
      </div>

      {/* Pickup After */}
      {activePickup === "pickup-after" && (
        <div className="grid grid-cols-6 sm:grid-cols-4  px-0 sm:px-6 ">
          <div className="px-3 col-span-2 xl:w-[60%]">
            <DateTimePicker1
              control={control}
              errors={errors}
              name="rental_date"
              title="Date & Time"
              isRequired={true}
            />
          </div>
        </div>
      )}
      {/* Pickup Multiple */}
      {activePickup === "pickup-multiple" && (
        <div className="grid items-end px-3 py-1 sm:px-6 space-x-3 gap-4 py-1  grid-cols-3">
          <div className="w-full">
            <DateTimePicker1
              control={control}
              errors={errors}
              name="rental_date_from"
              title="From & Time"
              isRequired={true}
            />
          </div>

          <div className="w-full">
            <DateTimePicker1
              control={control}
              errors={errors}
              name="rental_date_to"
              title="To & Time"
              isRequired={true}
            />
          </div>

          <div className="flex py-1 flex-col w-full">
            <label
              htmlFor="from"
              className="font-medium text-[12px] sm:text-sm"
            >
              Days
            </label>
            <input
              id="days"
              type="number"
              min={1}
              placeholder="Enter Days"
              {...register("days")}
              className="border rounded-md border-gray-400 text-[9px] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20]  outline-none sm:text-[12px] sm:text-sm"
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 lg:px-6 py-1 items-center">
        <div
          className="coming-mode h-full w-full flex px-3 py-1 gap-3 items-center justify-start sm:px-4"
          onClick={() => setComingMode(!comingMode)}
        >
          <input
            type="checkbox"
            placeholder="Enter Drop Address"
            className="border rounded-md border-gray-400 py-2 h-4 w-4 outline-none sm:w-5 sm:h-5"
            checked={comingMode}
            onChange={() => setComingMode(!comingMode)}
          />
          <label
            htmlFor="flight_mode"
            className="text-[10px] font-[500] select-none cursor-pointer sm:text-[12px]"
          >
            Coming Mode is Flight
          </label>
        </div>
        {comingMode === true && (
          <>
            <div className="flight_no_input flex flex-col px-2 py-1 lg:px-3 lg:py-1">
              <label
                htmlFor="flight_no_input"
                className="font-medium text-[12px] sm:text-sm"
              >
                Flight No.
              </label>
              <input
                type="text"
                placeholder="Enter Flight No."
                className="border rounded-md border-gray-400 text-[9px] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20]  outline-none sm:text-[12px] sm:text-sm"
              />
            </div>
            <TimePicker1 />
          </>
        )}
      </div>
    </>
  );
};

export default RentalFormInput1;
