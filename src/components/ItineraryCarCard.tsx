"use client";
import { useState } from "react";
import Image from "next/image";
import {
  User,
  Luggage,
  Fan,
  Fuel,
  MapPin,
  Calendar,
  Clock,
  CircleGauge,
  Hourglass,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ItineraryCard from "./ItineraryCard";
import { useBookingSearchForm, useSelectedVehicle } from "../store/common";

export default function ItineraryCarCard() {
  const [openItineraryCarCard, setOpenItineraryCarCard] =
    useState<boolean>(false);
  const { booking, setBooking } = useSelectedVehicle();
  const { form } = useBookingSearchForm();

  return (
    <>
      <div className="w-full  border-b border-gray-300 w-[max-content] h-[max-content] grid grid-cols-12 py-1 px-0 sm:px-2 ">
        <div className="left-car-details col-span-2 h-full relative flex items-center justify-center flex-col my-auto">
          <div className="w-full min-w-[50px] h-[50px] relative sm:h-[50px]">
            <Image
              src="/images/car_model/Economy (Hatch Back)/Baleno.png"
              alt="Slider Background"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className=" relative right-car-details col-span-10 px-2">
          <div className="grid grid-cols-12 left-services-details w-full">
            <div className="hidden sm:grid gap-0 items-center justify-center col-span-3">
              <div className="grid grid-cols-2 mt-1 lg:flex items-center justify-center gap-[6px] xl:gap-3">
                <div className="flex flex-col">
                  <button
                    title={booking?.vmodel_seating_capacity + `+D`}
                    className="p-[2px] w-[max-content] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 xl:p-[3px]"
                  >
                    <User className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] xl:w-4 h-4 cursor-pointer" />
                  </button>
                  <span className=" font-semibold text-gray-500 text-[0px] xl:text-[11px]">
                    {booking?.vmodel_seating_capacity + `+D`}{" "}
                  </span>
                </div>
                <div className="flex flex-col">
                  <button
                    title={
                      booking?.vmodel_luggage +
                      `+` +
                      booking?.vmodel_smallluggage
                    }
                    className="p-[2px] w-[max-content] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 xl:p-[3px]"
                  >
                    <Luggage className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] xl:w-4 h-4 cursor-pointer" />
                  </button>
                  <span className=" font-semibold text-gray-500 text-[0px] xl:text-[11px]">
                    {/* 1 + 2 */}
                    {                      booking?.vmodel_luggage +
                      `+` +
                      booking?.vmodel_smallluggage}
                  </span>
                </div>
                <div className="flex flex-col">
                  <button
                    title={booking?.vmodel_vehicle_ac_nonac}
                    className="p-[2px] w-[max-content] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 xl:p-[3px]"
                  >
                    <Fan className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] xl:w-4 h-4 cursor-pointer" />
                  </button>
                  <span className=" font-semibold text-gray-500 text-[0px] xl:text-[11px]">
                    N/AC
                  </span>
                </div>
                <div className="flex flex-col">
                  <button
                    title={booking?.ignition_type}
                    className="p-[2px] w-[max-content] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 xl:p-[3px]"
                  >
                    <Fuel className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] xl:w-4 h-4 cursor-pointer" />
                  </button>
                  <span className=" font-semibold text-gray-500 text-[0px] xl:text-[11px]">
                    {booking?.ignition_type}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-rows-2 gap-0 items-center justify-center col-span-4 sm:col-span-3">
              <div className="flex items-center gap-1 my-[1px]">
                <MapPin className="w-0 h-0 text-gray-500 lg:w-4 h-4" />
                <span className="text-gray-500 truncate w-20 text-[4px] whitespace-nowrap sm:text-[10px] lg:text-[10px]">
                  {form?.pickup_address}
                </span>
              </div>
              <div className="flex items-center gap-1 my-[1px]">
                <Calendar className="w-0 h-0 text-gray-500 lg:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                  {form?.pickup_date}
                </span>
              </div>
              <div className="flex items-center gap-1 my-[1px]">
                <Clock className="w-0 h-0 text-gray-500 lg:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                  {form?.pickup_time}
                </span>
              </div>
            </div>

            <div className="grid grid-rows-2 gap-0 items-center justify-center col-span-4 sm:col-span-3">
              <div className="flex items-center gap-1 my-[1px]">
                <MapPin className="w-0 h-0 text-gray-500 lg:w-4 h-4" />
                <span className="truncate w-20 text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                  {form?.drop_address || form?.pickup_address}
                </span>
              </div>
              <div className="flex items-center gap-1 my-[1px]">
                <Calendar className="w-0 h-0 text-gray-500 lg:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                  {form?.drop_date || form?.pickup_date}
                </span>
              </div>
              <div className="flex items-center gap-1 my-[1px]">
                <Clock className="w-0 h-0 text-gray-500 lg:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                  {form?.drop_time || form?.pickup_time}
                </span>
              </div>
            </div>

            <div className="grid grid-rows-3 gap-0 items-center justify-center col-span-4 sm:col-span-3">
              <div className="flex items-center gap-1 my-[1px]">
                <CircleGauge className="w-0 h-0 text-gray-500 lg:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                  {booking?.estimated_time} hr
                </span>
              </div>
              <div className="flex items-center gap-1 my-[1px]">
                <Hourglass className="w-0 h-0 text-gray-500 lg:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                  {booking?.estimated_distance}{" km"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpenItineraryCarCard(!openItineraryCarCard)}
            className="absolute right-[10px] bottom-[5px] cursor-pointer text-gray-800 bg-[#dfad08] rounded-full flex items-center justify-center p-[2px]"
          >
            {openItineraryCarCard ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
        {openItineraryCarCard && <ItineraryCard />}
      </div>
    </>
  );
}
