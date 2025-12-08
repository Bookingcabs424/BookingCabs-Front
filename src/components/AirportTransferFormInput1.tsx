import { useState } from "react";
import { FC } from "react";
import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { bookingFormData } from "./BookingForm";
import DateTimePicker from "./DateTimePicker";
import DateTimePicker1 from "./DateTimePicker1";

interface AirportTransferFormInputProps {
  register: UseFormRegister<bookingFormData>;
  errors: FieldErrors<bookingFormData>;
  control: Control<bookingFormData>;
}

const AirportTransferFormInput1: FC<AirportTransferFormInputProps> = ({
  register,
  errors,
  control,
}) => {
  const airportTrainOptions = [
    { id: "going-to", label: "Going to Airport/Train" },
    { id: "coming-from", label: "Coming from Airport/Train" },
  ];

  const pickupTimeOptions = [
    { id: "pickup-now", label: "Pick Now (Within 30 Minutes)" },
    { id: "pickup-after", label: "Pick Later (After 1 Hr.)" },
  ];

  const [airportTrainToggle, setAirportTrainToggle] = useState(
    airportTrainOptions[0].id
  );
  const [pickupToggle, setPickupToggle] = useState(pickupTimeOptions[0].id);

  const handleToggleGeneric = (
    selectedId: string,
    options: { id: string }[],
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter((prev) => (prev === selectedId ? options[0].id : selectedId));
  };

  return (
    <>
      {/* Airport/Train Toggle */}
      <div className="px-8 grid grid-cols-2 gap-4 px-4 py-1 lg:grid-cols-3 dark:text-black">
        {airportTrainOptions.map((option) => (
          <div key={option.id} className="flex gap-3 items-center text-sm">
            <div
              onClick={() =>
                handleToggleGeneric(
                  option.id,
                  airportTrainOptions,
                  setAirportTrainToggle
                )
              }
              className={`rounded-full border-2 border-[#dfad0a] cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300
    ${airportTrainToggle === option.id ? "justify-end" : "justify-start"}
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
      <hr className="border rounded-md border-gray-200 mx-5 my-2" />
      {/* City Package Pickup Location */}
      <div className="grid grid-cols-2 md:px-6 lg:grid-cols-3 lg:px-6 dark:text-black">
        <div className="city_input flex flex-col px-3 py-1 lg:p-1">
          <label
            htmlFor="city"
            className="text-[11px] font-[500] sm:text-[14px] "
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
        <div className="airport_or_railway_station-input flex flex-col px-3 py-1 lg:p-1">
          <label
            htmlFor="airport_or_railway_station"
            className="text-[10px] font-[500] sm:text-[14px] "
          >
            Airport/Railway Station <span className="text-red-500">*</span>
          </label>
          <input
            autoComplete="off"
            type="text"
            id="airport_or_railway_station"
            placeholder="Enter Airport/Railway Station"
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
            {...register("airport_or_railway_station")}
          />
          {errors?.airport_or_railway_station && (
            <p className="text-[10px] text-red-600 sm:text-xs">
              {errors?.airport_or_railway_station?.message}
            </p>
          )}
        </div>
        <div className="flight_or_train_no_input flex flex-col px-3 py-1 lg:p-1">
          <label
            htmlFor="flight_or_train_no_input"
            className="text-[11px] font-[500] sm:text-[14px] "
          >
            Flight/Train No.
          </label>
          <input
            autoComplete="off"
            type="text"
            id="flight_or_train_no_input"
            placeholder="Enter Flight/Train No."
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
          />
        </div>
        <div className="flight_time_input flex flex-col px-3 py-1 lg:p-1">
          <label
            htmlFor="flight_time_input"
            className="text-[11px] font-[500] sm:text-[14px] "
          >
            Flight Time
          </label>
          <input
            autoComplete="off"
            type="text"
            id="flight_time_input"
            placeholder="Enter Flight Time"
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
          />
        </div>
        <div className="flight_time_input flex flex-col px-3 py-1 lg:p-1">
          <label
            htmlFor="pickup_location_input"
            className="text-[11px] font-[500] sm:text-[14px] "
          >
            Pickup Location <span className="text-red-500">*</span>
          </label>
          <input
            autoComplete="off"
            type="text"
            {...register("pickup_location")}
            id="pickup_location_input"
            placeholder="Enter Pickup Location"
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
          />
          {errors.pickup_location && (
            <p className="text-[10px] text-red-600 sm:text-xs">
              {errors.pickup_location.message}
            </p>
          )}
        </div>
        <div className="city-input flex flex-col px-3 py-1">
          <label
            htmlFor="nationality"
            className="text-[11px] font-[500] sm:text-[14px] "
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
          {errors.nationality && (
            <p className="text-[10px] text-red-600 sm:text-xs">
              {errors.nationality.message}
            </p>
          )}
        </div>
      </div>

      {/* Pickup & Nationality */}
      <div className="grid grid-cols-3 md:px-6 lg:grid-cols-3 lg:px-3 py-1 dark:text-black">
        {airportTrainToggle === "going-to" ? (
          <div className="city-input flex flex-col px-3 py-1 col-span-2">
            <label
              htmlFor="pickup_address"
              className="text-[11px] font-[500] sm:text-[14px] "
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
            {errors.pickup_address && (
              <p className="text-[10px] text-red-600 sm:text-xs">
                {errors.pickup_address.message}
              </p>
            )}
          </div>
        ) : (
          <div className="drop_input flex flex-col px-4 py-1 col-span-2">
            <label
              htmlFor="drop_address"
              className="text-[11px] font-[500] sm:text-[14px] "
            >
              Drop Address <span className="text-red-500">*</span>
            </label>
            <input
              autoComplete="off"
              type="text"
              {...register("drop_address")}
              placeholder="Enter Drop Address"
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
            />
            {errors.drop_address && (
              <p className="text-[10px] text-red-600 sm:text-xs">
                {errors.drop_address.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Toggle */}
      <div className="px-8 grid grid-cols-2 md:grid-cols-2 gap-2 py-1 sm:gap-4 lg:grid-cols-3 lg:px-8 lg:px-8 lg:py-1 dark:text-black">
        {pickupTimeOptions.map((option) => (
          <div key={option.id} className="flex gap-3 items-center text-sm">
            <div
              onClick={() =>
                handleToggleGeneric(
                  option.id,
                  pickupTimeOptions,
                  setPickupToggle
                )
              }
              className={`rounded-full border-2 border-[#dfad0a] cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300
    ${pickupToggle === option.id ? "justify-end" : "justify-start"}
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
      {pickupToggle === "pickup-after" && (
        <div className="grid grid-cols-1 px-6 py-2 dark:text-black">
          <div className="px-3 col-span-3 lg:col-span-1 xl:w-[30%]">
            <DateTimePicker1
              control={control}
              errors={errors}
              name="airport_date"
              title="Date & Time"
              isRequired={true}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AirportTransferFormInput1;
