
"use client";
import { useEffect, useState } from "react";
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
  Car,
  Wine,
  BadgeIndianRupee,
  Scroll,
  Hourglass,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useBookingSearchForm, useSelectedVehicle } from "../store/common";
import FareRules from "./FareRules";
import SeatingCapacity from "./SeatingCapacity";
import Amenities from "./Amenities";
import CancellationPolicy from "./CancellationPolicy";
import LuggagePage from "./Luggage";
import MeetingPoint from "./MeetingPoint";
import CarItineraryCard from "./CarItineraryCard";

interface CarDetailCardProps {
  item: any; // Replace 'any' with a specific type if available
  selected: any;
  setSelected: (item: any) => void; // Replace 'any' with a specific type if available
}

export default function CarDetailCard({
  item,
  selected,
  setSelected,
}: CarDetailCardProps) {
  const [isOpen, setIsOpen] = useState<string>("");
  const [openCard, setIsOpenCard] = useState<boolean>(false);
  const { form } = useBookingSearchForm();
  const { booking, setBooking } = useSelectedVehicle();
   

  const parts = item?.basePath
    ?.split(",")
    .map((p: string) => p.replace(/^'+|'+$/g, "").trim());
  const basePath = parts.join("/");

  return (
    <>
      <div
        className={`border border-gray-300 w-full min-h-[130px] h-[max-content] grid grid-cols-12 py-1 rounded-md ${
          item?.edit_total_value === selected?.edit_total_value
            ? "outline outline-2 outline-[#dfad0a]"
            : ""
        }`}
      >
        <div className="left-car-details col-span-3 h-full border-r border-gray-300 relative flex items-center justify-center flex-col my-auto">
          <div className="w-full h-[60px] relative sm:h-[75px]">
            {item?.vehicle_image ? (
              <img
                src={`${basePath}/${item?.vehicle_image}`}
                alt="Slider Background"
                // fill
                className="object-contain"
                // priority
              />
            ) : (
              <img src={"/images/car_model/Economy (Hatch Back)/Baleno.png"} />
            )}
          </div>

          <div className="flex flex-col gap-[0px] items-center justify-center w-full">
            <h1 className="font-bold text-[14px] text-center text-gray-800 mt-1">
              {item?.vehicle_type}
            </h1>
            <small
              title={item?.vehicle_name}
              className="text-[10px] text-center overflow-hidden"
            >
              {item?.vehicle_name.substr(0, 20) + "..."}-({item?.vehicle_model})
              {/* {item?.vehicle_name}-({item?.vehicle_model}) */}
            </small>
          </div>
        </div>

        <div className="right-car-details col-span-9 px-2">
          <div className="relative grid grid-cols-12 left-services-details w-full items-center h-full">
            <div className="grid grid-rows-3 gap-0 items-center justify-center col-span-3">
              <div className="flex items-center gap-1 my-[1px]">
                <MapPin className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                  {/* Delhi-NCR */}
                  {form.cityList?.[0].pickup_city || form?.city}
                </span>
              </div>
              <div className="flex items-center gap-1 my-[1px]">
                <Calendar className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                  {/* 23-05-2025 */}
                  {item?.start_date}
                </span>
              </div>
              <div className="flex items-center gap-1 my-[1px]">
                <Clock className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                  {form?.pickup_time}
                </span>
              </div>
            </div>
              {booking?.master_package_id != 1 && (
                <div className="grid grid-rows-3 gap-0 items-center justify-center col-span-3">
                  {
                    <div className="flex items-center gap-1 my-[1px]">
                      <MapPin className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
                      <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                        {/* Delhi-NCR */}

                        {form.cityList?.[form.cityList.length - 1].drop_city ||
                          form.cityList?.[form.cityList.length - 1]
                            .pickup_city ||
                          form?.city}
                      </span>
                    </div>
                  }
                  <div className="flex items-center gap-1 my-[1px]">
                    <Calendar className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
                    <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                      {/* 23-05-2025 */}
                      {item?.end_date}
                    </span>
                  </div>
                  {form?.return_time && (
                    <div className="flex items-center gap-1 my-[1px]">
                      <Clock className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
                      <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                        {form?.return_time}
                      </span>
                    </div>
                  )}
                </div>
              )}
            <div className="grid grid-rows-3 gap-0 items-center justify-center col-span-3">
              <div className="flex items-center gap-1 my-[1px]">
                <CircleGauge className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                  {item?.estimated_distance} KM
                </span>
              </div>
              <div className="flex items-center gap-1 my-[1px]">
                <Hourglass className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                  {item?.local_pkg_name || item?.duration}
                  <br />

                  {/* ({item?.package_mode}) */}
                </span>
              </div>
            </div>

            {
              booking?.master_package_id == 1 && <div></div>
            }

            <div className="services w-[max-content] grid grid-rows-1 absolute bottom-[38px] right-[120px] sm:right-[250px]">
              <div className="flex items-center justify-center gap-[1px] mt-1 sm:gap-3">
                <button
                  title={`${item?.vmodel_seating_capacity} +D`}
                  className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 w-6 h-6"
                >
                  <User className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
                </button>

                <button
                  title={item?.vmodel_smallluggage + "+" + item?.vmodel_luggage}
                  className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 w-6 h-6"
                >
                  <Luggage className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
                </button>
                <button
                  title={item?.vmodel_vehicle_ac_nonac}
                  className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 h-6 w-6"
                >
                  <Fan className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
                </button>
                <button
                  title="Petrol"
                  className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 w-6 h-6"
                >
                  <Fuel className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
                </button>
              </div>
            </div>

            <div className="grid grid-rows-2 gap-4 items-between col-span-3 justify-end">
              <div className="flex flex-col items-center">
                <h1 className="font-[600] text-[14px] whitespace-nowrap  sm:text-[14px]">
                  ₹ {item?.total_price}
                  <br />
                </h1>
                <h1 className="text-[6px] text-end text-gray-500 sm:text-[10px]">
                  inclusive of GST
                </h1>
              </div>
              <button
                onClick={() => {
                  setSelected(item);
                  setBooking(item);
                }}
                className={`${
                  item?.edit_total_value === selected?.edit_total_value
                    ? "bg-[#9d7a20]"
                    : "bg-[#dfad0a]"
                } text-[10px] font-[500] px-1 rounded-md cursor-pointer h-[max-content] py-1 sm:py-1 hover:bg-[#9d7a20] transition sm:text-[12px]`}
              >
                {item?.edit_total_value === selected?.edit_total_value
                  ? "Selected"
                  : "Select"}
              </button>
            </div>

            <hr className="col-span-12 border-t-2 border-gray-200 h-[max-content]" />
            {/* <hr className="border-t border-gray-200" /> */}
            {booking?.master_package_id == 1 && (
              <div className="flex gap-3 mt-1 w-full">
                <div
                  className="feature flex gap-1 items-center cursor-pointer group text-center"
                  onClick={() => setIsOpen("fare-rules")}
                >
                  <button
                    title="Fare Rules"
                    className="rounded-full group-hover:border-[#9d7a20]"
                  >
                    <BadgeIndianRupee className="w-4 h-4 text-gray-500 group-hover:text-[#9d7a20]" />
                  </button>
                  <span className="text-gray-500 text-[0px] lg:text-[10px] group-hover:text-[#9d7a20]">
                    Fare Rules
                  </span>
                </div>
                <div
                  className="feature flex gap-1 items-center cursor-pointer group text-center"
                  onClick={() => setIsOpen("cancellation")}
                >
                  <button
                    title="Cancellation Policy"
                    className="rounded-full group-hover:border-[#9d7a20]"
                  >
                    <Scroll className="w-3 h-3 text-gray-500 group-hover:text-[#9d7a20]" />
                  </button>
                  <span className="text-gray-500 text-[0px] lg:text-[10px] group-hover:text-[#9d7a20]">
                    Cancellation Policy
                  </span>
                </div>
                <div
                  className="feature flex gap-1 items-center cursor-pointer group"
                  onClick={() => setIsOpen("meeting-point")}
                >
                  <button
                    title="Meeting Point"
                    className="rounded-full group-hover:border-[#9d7a20]"
                  >
                    <MapPin className="w-4 h-4 text-gray-500 group-hover:text-[#9d7a20]" />
                  </button>
                  <span className="text-gray-500 text-[0px] lg:text-[10px] group-hover:text-[#9d7a20]">
                    Meeting Point
                  </span>
                </div>
                <div
                  className="feature flex gap-1 items-center cursor-pointer group"
                  onClick={() => setIsOpen("luggage")}
                >
                  <button
                    title="Luggage"
                    className="rounded-full group-hover:border-[#9d7a20]"
                  >
                    <Luggage className="w-4 h-4 text-gray-500 group-hover:text-[#9d7a20]" />
                  </button>
                  <span className="text-gray-500 text-[0px] lg:text-[10px] group-hover:text-[#9d7a20]">
                    Luggage
                  </span>
                </div>
                <div
                  className="feature flex gap-1 items-center cursor-pointer group"
                  onClick={() => setIsOpen("seating")}
                >
                  <button
                    title="Seating Capacity"
                    className="rounded-full group-hover:border-[#9d7a20]"
                  >
                    <Car className="w-4 h-4 text-gray-500 group-hover:text-[#9d7a20]" />
                  </button>
                  <span className="text-gray-500 text-[0px] lg:text-[10px] group-hover:text-[#9d7a20]">
                    Seating Capacity
                  </span>
                </div>
                <div
                  className="feature flex gap-1 items-center cursor-pointer group"
                  onClick={() => setIsOpen("amenities")}
                >
                  <button
                    title="Amenities"
                    className="rounded-full group-hover:border-[#9d7a20]"
                  >
                    <Wine className="w-4 h-4 text-gray-500 group-hover:text-[#9d7a20]" />
                  </button>
                  <span className="text-gray-500 text-[0px] lg:text-[10px] group-hover:text-[#9d7a20]">
                    Amenities
                  </span>
                </div>
              </div>
            )}
            {/* Rules & Listing */}
            {booking?.master_package_id != 1 && (
              <div className="col-span-12 flex gap-2 justify-center my-1">
                {!openCard ? (
                  <ChevronDown
                    onClick={() => setIsOpenCard(true)}
                    className="bg-[#dfad0a] rounded-full cursor-pointer"
                  />
                ) : (
                  <ChevronUp
                    onClick={() => setIsOpenCard(false)}
                    className="bg-[#dfad0a] rounded-full cursor-pointer"
                  />
                )}
              </div>
            )}
          </div>
        </div>
        {/* Outstation Oneway Car List Details */}
        {openCard && (
          <div className="grid-cols-12 col-span-12 px-3 border-t border-gray-300">
            <CarItineraryCard/>
          </div>

        )}
      </div>

      {isOpen !== "" && (
        <div
          className="fixed inset-0 bg-[#00000099] bg-opacity-0 flex items-center justify-center z-50"
          onClick={() => setIsOpen("")}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-[90%] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen("")}
              className="absolute top-2 right-2 text-gray-600 hover:text-black cursor-pointer"
            >
              <X />
            </button>

            {isOpen === "fare-rules" && (
              <div className="max-h-[350px] overflow-y-auto text-gray-800">
                <h2 className="text-md font-semibold mb-2">Fare Rules</h2>
                <hr className="border-t border-gray-300" />
                <h1 className="mt-2 text-sm font-semibold">
                  Inclusions & Exclusions
                </h1>
                <h1 className="text-sm font-semibold">Inclusions</h1>
                <ul className="text-[12px] list-disc list-inside">
                  <li>
                    Distance Package 4Hrs - 40km Km for the exact Itinerary
                    listed above
                  </li>
                  <li>
                    No Route Deviation allowed Unless Listed in Itinerary GST
                  </li>
                </ul>
                <h1 className="text-sm font-semibold mt-2">Exclusions</h1>
                <ul className="text-[12px] list-disc list-inside">
                  <li>Toll Taxes (As Per Actual)</li>
                  <li>Parking (As Per Actual)</li>
                  <li>Night Pickup Allowance excluded</li>
                  <li>Night Drop off Allowance excluded</li>
                  <li>Peak Charges & Waiting Charges as per Tariff</li>
                </ul>

                <p className="text-[12px] mt-2">
                  Driver Allowance (Night Charges) Applicable. Vehicle Fare
                  Rule: Approx Distance 4Hrs - 40km (As Per Quote).
                  <br />
                  Minimum Charged: ₹2000 (As per Min Distance)
                  <br />
                  Per Km Rate: ₹25
                  <br />
                  Per Hour Rate: ₹300
                  <br />
                  Driver Allowance: ₹300 (Per Day)
                  <br />
                  <strong>Extra Charges:</strong>
                  <br />
                  • Distance: If you exceed 4Hrs - 40km, ₹25/km extra
                  <br />
                  • Time: Post 21:00 Hrs, extra ₹300 Driver Allowance applies
                  <br />
                  <strong>Note:</strong> One day = One calendar day (00:00 to
                  23:59).
                  <br />
                  Garage-to-garage calculation. AC may be off in hills.
                  <br />
                  If driving between 21:00–05:00, extra ₹300 Night Charges
                  apply.
                </p>
              </div>
            )}
            {isOpen !== "" && (
              <div
                className="fixed inset-0 bg-[#00000099] bg-opacity-0 flex items-center justify-center z-50"
                onClick={() => setIsOpen("")}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg max-w-md w-[90%] relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setIsOpen("")}
                    className="absolute top-2 right-2 text-gray-600 hover:text-black cursor-pointer"
                  >
                    <X />
                  </button>

                  <div className="max-h-[350px] overflow-y-auto text-gray-800">
                    {isOpen === "fare-rules" && <FareRules />}
                    {isOpen === "seating" && (
                      <SeatingCapacity images={item?.images} />
                    )}
                    {isOpen === "amenities" && (
                      <Amenities amenities_name={item?.amenities_name} />
                    )}
                    {isOpen === "cancellation" && <CancellationPolicy />}
                    {isOpen === "luggage" && <LuggagePage />}
                    {isOpen === "meeting-point" && <MeetingPoint />}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

