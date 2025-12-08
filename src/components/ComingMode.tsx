"use client";
import { useRef, useState } from "react";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { bookingFormData } from "./BookingForm";
import TimePicker from "./TimePicker";
import DatePicker from "./DatePicker";

interface ComingModeProps {
  register: UseFormRegister<bookingFormData>;
  errors: FieldErrors<bookingFormData>;
  watch?: UseFormRegister<bookingFormData>;
  control: Control<bookingFormData>;
  setValue?: any;
}
export default function ComingMode({
  register,
  errors,
  watch,
  control,
  setValue,
}: ComingModeProps) {
  const comingFlightFromDateInputRef = useRef<HTMLInputElement>(null);

  const { ref: comingFlightFromTimeRef, ...comingFlightTimeRest } =
    register("time");

  const comingFlightToDateInputRef = useRef<HTMLInputElement>(null);

  const [comingMode, setComingMode] = useState<boolean>(false);

  const { ref: comingFlightFromDateRef, ...comingFlightFromRest } =
    register("time");

  const { ref: comingFlightToDateRef, ...comingFlightToRest } =
    register("time");

  return (
    <div className="flex flex-col px-3 sm:px-8 py-1">
      <div className="coming-mode flex py-1 gap-3 items-center justify-start">
        <input
          type="checkbox"
          placeholder="Enter Drop Address"
          className="border border-gray-400 py-2 rounded-md outline-none w-4 h-4"
          checked={comingMode}
          onChange={() => setComingMode(!comingMode)}
        />
        <label
          htmlFor="flight_mode"
          className=" select-none cursor-pointer text-[10px] sm:text-[12px]"
          onClick={() => setComingMode(!comingMode)}
        >
          Coming Mode is Flight
        </label>
      </div>
      {comingMode === true && (
        <div className="items-center gap-2 grid grid-cols-3 lg:grid-cols-5">
          <div className="flight_no_input flex flex-col py-1 lg:py-3 w-full">
            <label
              htmlFor="flight_no_input"
              className="text-[12px]"
            >
              Flight No.
            </label>
            <input
              {...register("flight_no")}
              type="text"
              placeholder="Enter Flight No."
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
            />
          </div>
          {/*<div
            onClick={() => comingFlightTimeInputRef.current?.showPicker()}
            className="flight_time_input flex flex-col py-1 lg:py-3 w-full"
          >
            <label
              htmlFor="flight_time_input"
              className="text-[12px] sm:text-[14px] "
            >
              Flight Time
            </label>
            <input
              type="time"
              id="flight_time_input"
              ref={(el) => {
                comingFlightFromTimeRef(el);
                comingFlightTimeInputRef.current = el;
              }}
              {...comingFlightTimeRest}
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm dark:text-black"
            />
          </div>*/}
          <TimePicker
            title="Pickup Time"
            name="flight_time"
            control={control}
            errors={errors}
          />
          <div className="flight_time_input flex flex-col py-1 lg:py-3 w-full">
            <label
              htmlFor="flight_time_input"
              className="text-[12px]"
            >
              Terminal
            </label>
            <input
              {...register("terminal")}
              type="text"
              placeholder="Enter Terminal"
              id="terminal"
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
            />
          </div>
          {/* <div
            onClick={() => comingFlightFromDateInputRef.current?.showPicker()}
            className="from_input flex flex-col py-1 lg:py-3 w-full"
          >
            <label htmlFor="from" className="text-[12px] sm:text-[14px] ">
              From
            </label>
            <input
              type="date"
              {...register("coming_from")}
              id="from_input"
              ref={(el) => {
                comingFlightFromDateRef(el);
                comingFlightFromDateInputRef.current = el;
              }}
              {...comingFlightFromRest}
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm dark:text-black"
            />
          </div> */}
          {/* <div
            onClick={() => comingFlightToDateInputRef.current?.showPicker()}
            className="flight_time_input flex flex-col py-1 lg:py-3 w-full"
          >
            <label
              htmlFor="to_input"
              className="text-[12px] sm:text-[14px] "
            >
              To
            </label>
            <input
              {...register("coming_to")}
              type="date"
              id="to_input"
              ref={(el) => {
                comingFlightToDateRef(el);
                comingFlightToDateInputRef.current = el;
              }}
              {...comingFlightToRest}
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm dark:text-black"
            />
          </div> */}

          {/* <DatePicker
            title="From"
            name="coming_from"
            register={register}
            errors={errors}
          />

          <DatePicker
            title="To"
            name="coming_to"
            register={register}
            errors={errors}
          /> */}

          <div className="coming_from_input flex flex-col py-1 lg:py-3 w-full">
            <label
              htmlFor="coming_from"
              className="text-[12px]"
            >
              From City
            </label>
            <input
              {...register("coming_from")}
              type="text"
              placeholder="Enter From City"
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
            />
          </div>

          <div className="coming_to_input flex flex-col py-1 lg:py-3 w-full">
            <label htmlFor="coming_to" className="text-[12px]">
              To City
            </label>
            <input
              {...register("coming_to")}
              type="text"
              placeholder="Enter To City"
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
            />
          </div>
        </div>
      )}
    </div>
  );
}
