import { useState, Fragment } from "react";
import { FC } from "react";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  useFieldArray,
} from "react-hook-form";
import { bookingFormData } from "./BookingForm";

import { Plus } from "lucide-react";
import { Trash } from "lucide-react";
import DateTimePicker from "./DateTimePicker";
import TimePicker from "./TimePicker";
import DateTimePicker1 from "./DateTimePicker1";
import TimePicker1 from "./TimePicker1";

type OutstationType = "roundtrip" | "oneway" | "multicity";

interface OutstationFormInputProps {
  register: UseFormRegister<bookingFormData>;
  control: Control<bookingFormData>;
  errors: FieldErrors<bookingFormData>;
  outstation: OutstationType;
  setOutstation: React.Dispatch<React.SetStateAction<OutstationType>>;
  selectedFeature: string;
}
const OutstationFormInput1: FC<OutstationFormInputProps> = ({
  register,
  errors,
  control,
  outstation,
  setOutstation,
  selectedFeature,
}) => {
  const [comingMode, setComingMode] = useState<boolean>(false);
  const [cityCount, setCityCount] = useState<number>(2);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "multicity",
  });

  // Toggle function
  const handleOutstationToggle = (buttonId: OutstationType) => {
    setOutstation((prev) => (prev === buttonId ? "roundtrip" : buttonId));
  };

  return (
    <>
      {selectedFeature !== "Oneway" && (
        <>
          <div className="gap-2 grid grid-cols-3  md:grid-cols-3 gap-4 px-4 py-1 lg:grid-cols-3 py-1 dark:text-black">
            {[
              { id: "oneway", label: "Oneway" },
              { id: "roundtrip", label: "Round Trip" },
              { id: "multicity", label: "Multicity" },
            ].map((option) => (
              <div key={option.id} className="flex gap-3 items-center text-sm ">
                <div
                  onClick={() =>
                    handleOutstationToggle(option.id as OutstationType)
                  }
                  className={`rounded-full border-2 border-[#dfad0a] cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300
        ${outstation === option.id ? "justify-end" : "justify-start"}
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
          <hr className="border rounded-md border-gray-200 my-2 mx-4" />
        </>
      )}
      {/* City Package Pickup Location */}
      <div
        className={`grid grid-cols-2 ${
          outstation === "oneway" ? "lg:grid-cols-4" : "lg:grid-cols-4"
        } sm:px-6 sm:grid-cols-3 dark:text-black`}
      >
        {(outstation === "oneway" || outstation === "roundtrip") && (
          <>
            <div className="from_input flex flex-col px-3 py-1 dark:text-black lg:p-1">
              <label
                htmlFor="from"
                className="font-[500] text-[12px] sm:text-[14px] dark:text-black"
              >
                From <span className="text-red-500">*</span>
              </label>
              <input
                autoComplete="off"
                type="text"
                {...register("from")}
                placeholder="From"
                className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
              />
              {errors.from && (
                <p className="text-[10px] text-red-600 sm:text-xs">
                  {errors.from.message}
                </p>
              )}
            </div>
            <div className="to flex flex-col px-3 py-1 dark:text-black lg:p-1">
              <label
                htmlFor="to"
                className="font-[500] text-[12px] sm:text-[14px]"
              >
                To <span className="text-red-500">*</span>
              </label>
              <input
                autoComplete="off"
                type="text"
                {...register("to")}
                id="to"
                placeholder="To"
                className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
              />
              {errors?.to && (
                <p className="text-[10px] text-red-600 sm:text-xs">
                  {errors?.to?.message}
                </p>
              )}
            </div>

            <div className="px-3 col-span-1 lg:px-0 dark:text-black">
              <DateTimePicker1
                control={control}
                errors={errors}
                name="date_and_time_from"
                title="Date & Time"
                isRequired={true}
              />
            </div>
          </>
        )}

        {/* Extra field of Days*/}
        {outstation === "roundtrip" && (
          <div className="days_input flex flex-col px-3 py-1  lg:p-1">
            <label
              htmlFor="days"
              className="font-[500] text-[12px] sm:text-[14px]"
            >
              Days <span className="text-red-500">*</span>
            </label>
            <input
              autoComplete="off"
              type="text"
              {...register("days")}
              placeholder="Enter Days"
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
            />
            {errors?.days && (
              <p className="text-[10px] text-red-600 sm:text-xs">
                {errors?.days?.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Extra Column & fields in RoundTrip */}
      {outstation === "roundtrip" && (
        <div
          className={`grid grid-cols-2 sm:px-3 sm:grid-cols-3  lg:grid-cols-4`}
        >
          <div className="from_input flex flex-col px-3 py-1  lg:p-1">
            <label
              htmlFor="from"
              className="font-[500] text-[12px] sm:text-[14px]"
            >
              From <span className="text-red-500">*</span>
            </label>
            <input
              autoComplete="off"
              type="text"
              id="from"
              {...register("round_from")}
              placeholder="From"
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
            />
            {errors?.round_from && (
              <p className="text-[10px] text-red-600 sm:text-xs">
                {errors?.round_from?.message}
              </p>
            )}
          </div>
          <div className="to_input flex flex-col px-3 py-1  lg:p-1">
            <label
              htmlFor="to"
              className="font-[500] text-[12px] sm:text-[14px]"
            >
              To <span className="text-red-500">*</span>
            </label>
            <input
              autoComplete="off"
              type="text"
              {...register("round_to")}
              id="to"
              placeholder="To"
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
            />
            {errors?.round_to && (
              <p className="text-[10px] text-red-600 sm:text-xs">
                {errors?.round_to?.message}
              </p>
            )}
          </div>

          <div className="px-3 col-span-1 lg:px-0">
            <DateTimePicker1
              control={control}
              errors={errors}
              name="date_and_time"
              title="Date & Time"
              isRequired={true}
            />
          </div>
        </div>
      )}

      {/* Extra Column & fields in RoundTrip */}
      {outstation === "multicity" &&
        Array(cityCount)
          .fill("a")
          .map((_, idx) => (
            <Fragment key={idx}>
              <div className={`grid grid-cols-2 sm:px-3 lg:grid-cols-4`}>
                <div className="from_input flex flex-col px-3 py-1 dark:text-black lg:p-1">
                  <label
                    htmlFor={`multicity.${idx}.from`}
                    className="font-[500] text-[12px] sm:text-[14px]"
                  >
                    From <span className="text-red-500">*</span>
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    {...register(`multicity.${idx}.from`)}
                    placeholder="From"
                    className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
                  />
                  {errors.multicity?.[idx]?.from && (
                    <p className="text-[10px] text-red-600 sm:text-xs">
                      {errors.multicity[idx].from?.message}
                    </p>
                  )}
                </div>
                <div className="to_input flex flex-col px-3 py-1 dark:text-black lg:p-1">
                  <label
                    htmlFor={`multicity.${idx}.to`}
                    className="font-[500] text-[12px] sm:text-[14px]"
                  >
                    To <span className="text-red-500">*</span>
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    id="to"
                    {...register(`multicity.${idx}.to`)}
                    placeholder="To"
                    className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
                  />
                  {errors.multicity?.[idx]?.to && (
                    <p className="text-[10px] text-red-600 sm:text-xs">
                      {errors.multicity[idx].to?.message}
                    </p>
                  )}
                </div>

                <div className="col-span-1 px-3  lg:px-0">
                  <DateTimePicker1
                    control={control}
                    errors={errors}
                    name={`multicity.${idx}.date_and_time` as const}
                    title="Date & Time"
                    isRequired={true}
                  />
                </div>
                <div className="nights_input flex flex-col px-3 py-1 dark:text-black lg:p-1">
                  <div className="flex flex-col  w-full lg:w-[80%]">
                    <label
                      htmlFor={`multicity.${idx}.nights`}
                      className="font-[500] text-[12px] sm:text-[14px]"
                    >
                      No. of Days <span className="text-red-500">*</span>
                    </label>
                    <input
                      autoComplete="off"
                      id="nights"
                      {...register(`multicity.${idx}.nights`)}
                      type="number"
                      placeholder="No. of Days"
                      className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm"
                      min={1}
                    />
                    {errors.multicity?.[idx]?.nights && (
                      <p className="text-[10px] text-red-600 sm:text-xs">
                        {errors.multicity[idx].nights?.message}
                      </p>
                    )}
                  </div>

                  {idx >= 2 && (
                    <button
                      type="button"
                      onClick={() => setCityCount(cityCount - 1)}
                      className="text-red-500 hover:text-red-700 transition mt-[6px] cursor-pointer"
                      title="Remove city"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {idx !== cityCount - 1 && (
                <hr className="border rounded-md border-gray-200  my-2" />
              )}
            </Fragment>
          ))}

      {outstation === "multicity" && (
        <div className="py-1 px-3 sm:px-6 dark:text-black">
          <button
            type="button"
            className="h-full px-3 py-1 text-[12px] rounded-md my-1 bg-[#dfad0a] text-sm font-[600] cursor-pointer hover:bg-[#9d7a20] transition flex items-center gap-1 sm:py-2 sm:text-md px-5"
            onClick={() => setCityCount(cityCount + 1)}
          >
            Add City <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Pickup & Nationality */}
      <div className="grid grid-cols-2  sm:px-3 lg:grid-cols-3 py-1 dark:text-black">
        <div className="city-input flex flex-col px-3 py-1  col-span-1">
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
        <div className="city-input flex flex-col px-3 py-1 dark:text-black">
          <label
            htmlFor="nationality"
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

      {/* Drop Address  */}
      {outstation === "oneway" && (
        <div className="grid grid-cols-1 sm:px-3 py-1 dark:text-black">
          <div className="city-input flex flex-col px-3 py-1  col-span-2">
            <label
              htmlFor="pickup_address"
              className="font-[500] text-[12px] sm:text-[14px]"
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
            {errors?.drop_address && (
              <p className="text-[10px] text-red-600 sm:text-xs">
                {errors?.drop_address?.message}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 lg:px-6 py-1 items-center">
        <div
          className="coming-mode h-full w-full flex px-3 py-1 gap-3 items-center justify-start sm:px-4 dark:text-black"
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
            <div className="flight_no_input flex flex-col px-3 py-2 lg:px-3 lg:py-1 dark:text-black">
              <label
                htmlFor="flight_no_input"
                className="font-medium text-[12px] sm:text-sm "
              >
                Flight No.
              </label>
              <input
                autoComplete="off"
                type="text"
                placeholder="Enter Flight No."
                className="border rounded-md border-gray-400 text-[9px] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] outline-none sm:text-sm"
              />
            </div>
            <TimePicker1 />
          </>
        )}
      </div>
    </>
  );
};

export default OutstationFormInput1;
