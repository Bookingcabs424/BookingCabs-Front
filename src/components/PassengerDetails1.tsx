
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { bookingFormData } from "./BookingForm";
import { FC } from "react";
import { Luggage, PersonStanding, CarFront } from "lucide-react";


interface PassengerInputProps {
  register: UseFormRegister<bookingFormData>;
  errors: FieldErrors<bookingFormData>;
}

const PassengerDetails1: FC<PassengerInputProps> = ({ register, errors }) => {
    return(
        <div className="flex flex-wrap items-end gap-2 pl-3 sm:md:gap-4 sm:pl-6 dark:text-black">
              <div className="w-[17%] flex flex-col ">
                <label htmlFor="adults" className="text-lg font-medium">
                  <span className="flex items-center gap-1 text-[7px] sm:text-[11px]">
                    <PersonStanding className="text-gray-600 w-5 h-5 sm:w-6 h-6" /> Adults
                  </span>
                </label>
                <input
                  id="adults"
                  type="number"
                  min={1}
                  {...register("adults")}
                  className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [MozAppearance:textfield] border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] px-2 dark:text-black"
                />
                {errors.adults && (
                  <p className="text-[10px] text-red-600 sm:text-xs">
                    {errors.adults.message}
                  </p>
                )}
              </div>

             <div className="w-[17%] flex flex-col ">
                <label htmlFor="small-luggage" className="font-medium">
                   <span className="flex items-center gap-1 text-[7px] sm:text-[11px]">
                    <PersonStanding className="text-gray-600 w-5 h-5 sm:w-6 h-6" />Children
                  </span>
                </label>
                <input
                  id="children"
                  type="number"
                  {...register("children")}
                   className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [MozAppearance:textfield] border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] px-2 dark:text-black"
                  min={0}
                />
                {errors.children && (
                  <p className="text-[10px] text-red-600 mt-1 sm:text-xs">
                    {errors.children.message}
                  </p>
                )}
              </div>

              <div className="w-[17%] flex flex-col ">
                <label htmlFor="big_luggage" className="text-lg font-medium">
                  <span className="flex items-center gap-1 text-[7px] sm:text-[11px]">
                    <Luggage className="text-gray-600 w-5 h-5 sm:w-6 h-6" /> Big Luggage
                  </span>
                </label>
                <input
                  id="big_luggage"
                  type="number"
                  {...register("big_luggage")}
                  min={0}
                   className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [MozAppearance:textfield] border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] px-2"
                />
                {errors.big_luggage && (
                  <p className="text-[10px] text-red-600 mt-1 sm:text-xs">
                    {errors.big_luggage.message}
                  </p>
                )}
              </div>
            <div className="w-[17%] flex flex-col ">
                <label htmlFor="small_luggage" className="text-lg font-medium">
                   <span className="flex items-center gap-1 text-[7px] sm:text-[11px]">
                    <Luggage className="text-gray-600 w-5 h-5 sm:w-6 h-6" /> Small Luggage
                  </span>
                </label>
                <input
                  id="small_luggage"
                  type="number"
                  min={0}
                  {...register("small_luggage")}
                  className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [MozAppearance:textfield] border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] px-2"
                />
                {errors.small_luggage && (
                  <p className="text-[10px] text-red-600 mt-1 sm:text-xs">
                    {errors.small_luggage.message}
                  </p>
                )}
              </div>

              <div className="w-[17%] flex flex-col ">
                <label htmlFor="vehicles" className="text-lg font-medium">
                   <span className="flex items-center gap-1 text-[7px] sm:text-[11px]">
                    <CarFront className="text-gray-600 w-5 h-5 sm:w-6 h-6" />
                    Vehicles
                  </span>
                </label>
                <input
                  id="vehicles"
                  type="number"
                  min={0}
                  {...register("vehicles")}
                  className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [MozAppearance:textfield] border rounded-md border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] px-2"
                />
                {errors.vehicles && (
                  <p className="text-[10px] text-red-600 mt-1 sm:text-xs">
                    {errors.vehicles.message}
                  </p>
                )}
              </div>
            </div>
    )
}

export default PassengerDetails1;