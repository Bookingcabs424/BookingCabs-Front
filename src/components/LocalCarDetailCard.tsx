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
  Car,
  Wine,
  BadgeIndianRupee,
  Scroll,
  Hourglass,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export default function LocalCarDetailCard() {
  const [isOpen, setIsOpen] = useState<string>("");
  const [openCard, setIsOpenCard] = useState<boolean>(false);
  return (
    <>
      <div className="border border-gray-300 w-full min-h-[130px] h-[max-content] grid grid-cols-12 py-1 rounded-md">
        <div className="left-car-details col-span-3 h-full border-r border-gray-300 relative flex items-center justify-center flex-col my-auto">
          <div className="w-full h-[60px] relative sm:h-[75px]">
            <Image
              src="/images/car_model/Economy (Hatch Back)/Baleno.png"
              alt="Slider Background"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col gap-[0px] items-center justify-center w-full dark:text-black">
            <div className="services w-full dark:text-black">
              <div className="flex items-center justify-center gap-[1px] mt-1 sm:gap-3">
                <button
                  title="4+D"
                  className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500"
                >
                  <User className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
                </button>
                <button
                  title="1+2"
                  className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500"
                >
                  <Luggage className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
                </button>
                <button
                  title="N/AC"
                  className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500"
                >
                  <Fan className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
                </button>
                <button
                  title="Petrol"
                  className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500"
                >
                  <Fuel className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
                </button>
              </div>
            </div>
            <h1 className="font-bold text-base text-gray-800 mt-1">Baleno</h1>
          </div>
        </div>

        <div className="right-car-details col-span-9 px-2">
          <div className="grid grid-cols-12 left-services-details w-full items-center h-full">
            <div className="grid grid-rows-4 gap-0 items-center justify-center col-span-3">
              <div className="flex items-center gap-1 my-[1px]">
                <MapPin className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px] dark:text-black">
                  Delhi-NCR
                </span>
              </div>
              <div className="flex items-center gap-1 my-[1px]">
                <Calendar className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px] dark:text-black">
                  23-05-2025
                </span>
              </div>
              <div className="flex items-center gap-1 my-[1px]">
                <Clock className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px] dark:text-black">
                  11:42:07
                </span>
              </div>
            </div>

            <div className="grid grid-rows-3 gap-0 items-center justify-center col-span-4">
              <div className="flex items-center gap-1 my-[1px]">
                <CircleGauge className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px] dark:text-black">
                  40KM
                </span>
              </div>
              <div className="flex items-center gap-1 my-[1px]">
                <Hourglass className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px] dark:text-black">
                  4Hrs - 40km
                </span>
              </div>
            </div>

            <div className="grid grid-rows-2 gap-4 items-between col-span-4 items-end justify-end">
              <div className="flex flex-col items-center">
                <h1 className="font-[600] text-[15px] whitespace-nowrap  sm:text-[18px] dark:text-black">
                  ₹ 1050
                </h1>
                <h1 className="text-[6px] text-end text-gray-500 sm:text-[10px] dark:text-black">
                  inclusive of GST
                </h1>
              </div>
              <button className="bg-[#dfad0a] text-[12px] font-[500] rounded-md cursor-pointer h-[max-content] py-1 sm:py-2 hover:bg-[#9d7a20] transition sm:text-text-[14px]">
                Select
              </button>
            </div>

            <hr className="col-span-12 border-t-2 border-gray-200 h-[max-content]" />

            <div className="flex gap-2 mt-1 w-full col-span-12">
              <div
                className="feature flex gap-1 items-center cursor-pointer group"
                onClick={() => setIsOpen("fare-rules")}
              >
                <button
                  title="Fare Rules"
                  className="rounded-full group-hover:border-[#9d7a20] dark:text-black"
                >
                  <BadgeIndianRupee className="w-4 h-4 text-gray-500 group-hover:text-[#9d7a20] dark:text-black" />
                </button>
                <span className="text-gray-500 text-[0px] lg:text-[10px] group-hover:text-[#9d7a20] dark:text-black">
                  Fare Rules
                </span>
              </div>
              <div
                className="feature flex gap-1 items-center cursor-pointer group"
                onClick={() => setIsOpen("cancellation-policy")}
              >
                <button
                  title="Cancellation Policy"
                  className="rounded-full group-hover:border-[#9d7a20]"
                >
                  <Scroll className="w-3 h-3 text-gray-500 group-hover:text-[#9d7a20] dark:text-black" />
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
                  <MapPin className="w-4 h-4 text-gray-500 group-hover:text-[#9d7a20] dark:text-black" />
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
                  <Luggage className="w-4 h-4 text-gray-500 group-hover:text-[#9d7a20] dark:text-black" />
                </button>
                <span className="text-gray-500 text-[0px] lg:text-[10px] group-hover:text-[#9d7a20] dark:text-black">
                  Luggage
                </span>
              </div>
              <div
                className="feature flex gap-1 items-center cursor-pointer group"
                onClick={() => setIsOpen("seating-capacity")}
              >
                <button
                  title="Seating Capacity"
                  className="rounded-full group-hover:border-[#9d7a20]"
                >
                  <Car className="w-4 h-4 text-gray-500 group-hover:text-[#9d7a20] dark:text-black" />
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
                  className="rounded-full group-hover:border-[#9d7a20] dark:text-black"
                >
                  <Wine className="w-4 h-4 text-gray-500 group-hover:text-[#9d7a20] dark:text-black" />
                </button>
                <span className="text-gray-500 text-[0px] lg:text-[10px] group-hover:text-[#9d7a20]">
                  Amenities
                </span>
              </div>
            </div>
          </div>
        </div>
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
          </div>
        </div>
      )}
    </>
  );
}
