"use client";

import { useState } from "react";
import {
  Binoculars,
  Car,
  CarTaxiFront,
  MapPinned,
  MoveUp,
  Plane,
} from "lucide-react";

export default function FindQuotationDateTimeSelect() {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(formattedDate);
  const [selectedBookingType, setSelectedBookingType] =
    useState<string>("book_2");
  const [selectedHour, setSelectedHour] = useState<number>(0);

  const futureDates = Array.from({ length: 15 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  return (
    <div className="mx-auto px-12 py-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Select Date</h2>
      <div className="overflow-x-auto whitespace-nowrap pb-2">
        {futureDates.map((date) => {
          const display = new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          });
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`inline-block mx-1 p-2 rounded border cursor-pointer text-sm min-w-[60px] text-center ${
                selectedDate === date
                  ? "bg-[#155dfc] text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              {display}
            </button>
          );
        })}
      </div>

      {/* Hour selection */}
      <h2 className="text-lg font-semibold my-4 text-gray-700">Select Hour</h2>
      <div className="overflow-x-auto whitespace-nowrap pb-2">
        {Array.from({ length: 24 }, (_, hour) => (
          <button
            key={hour}
            onClick={() => setSelectedHour(hour)}
            className={`inline-block mx-1 p-2 cursor-pointer rounded text-sm border min-w-[60px] text-center ${
              selectedHour === hour
                ? "bg-[#155dfc] text-white"
                : "bg-white hover:bg-gray-200"
            }`}
          >
            {hour}:00
          </button>
        ))}
      </div>

      <div className="grid  bg-gray-100 mt-5 gap-2 grid-cols-2  sm:grid-cols-3 md:grid-cols-5 lg:gap-4">
        <div
          className={`col-span-1  max-w-xs cursor-pointer rounded-md py-4 px-2 lg:px-4 text-center transition-all border 
    ${
      selectedBookingType === "book_1"
        ? "bg-blue-100 border-blue-500 shadow-md"
        : "bg-white border-gray-200 shadow-sm hover:shadow-md"
    } 
    quotation_book_type book_1`}
          onClick={() => setSelectedBookingType("book_1")}
        >
          <h5 className="text-[12px] lg:text-base font-semibold text-gray-700 flex justify-center items-center gap-2">
            Rental <Car className="h-5 w-5 sm:w-6 sm:h-6" />
          </h5>
          <span
            id="span_1"
            className="text-blue-600 font-bold text-lg mt-2 block"
          >
            0
          </span>
        </div>

        <div
          className={`col-span-1  max-w-xs cursor-pointer rounded-md py-4 px-2 lg:px-4 text-center transition-all border 
    ${
      selectedBookingType === "book_2"
        ? "bg-blue-100 border-blue-500 shadow-md"
        : "bg-white border-gray-200 shadow-sm hover:shadow-md"
    } 
    quotation_book_type book_2`}
          onClick={() => setSelectedBookingType("book_2")}
        >
          <h5 className="text-[12px] lg:text-base font-semibold text-gray-700 flex justify-center items-center gap-2">
            City Taxi <CarTaxiFront className="h-5 w-5 sm:w-6 sm:h-6" />
          </h5>
          <span
            id="span_1"
            className="text-blue-600 font-bold text-lg mt-2 block"
          >
            0
          </span>
        </div>

        <div
          className={`col-span-1  max-w-xs cursor-pointer rounded-md py-4 px-2 lg:px-4 text-center transition-all border 
    ${
      selectedBookingType === "book_3"
        ? "bg-blue-100 border-blue-500 shadow-md"
        : "bg-white border-gray-200 shadow-sm hover:shadow-md"
    } 
    quotation_book_type book_3`}
          onClick={() => setSelectedBookingType("book_3")}
        >
          <h5 className="text-[12px] lg:text-base font-semibold text-gray-700 flex justify-center items-center gap-2">
            Airport <Plane className="h-5 w-5 sm:w-6 sm:h-6" />
          </h5>
          <span
            id="span_1"
            className="text-blue-600 font-bold text-lg mt-2 block"
          >
            0
          </span>
        </div>

        <div
          className={`col-span-1  max-w-xs cursor-pointer rounded-md py-4 px-2 lg:px-4 text-center transition-all border 
    ${
      selectedBookingType === "book_4"
        ? "bg-blue-100 border-blue-500 shadow-md"
        : "bg-white border-gray-200 shadow-sm hover:shadow-md"
    } 
    quotation_book_type book_4`}
          onClick={() => setSelectedBookingType("book_4")}
        >
          <h5 className="text-[12px] lg:text-base font-semibold text-gray-700 flex justify-center items-center gap-2">
            Outstation <MapPinned className="h-5 w-5 sm:w-6 sm:h-6" />
          </h5>
          <span
            id="span_1"
            className="text-blue-600 font-bold text-lg mt-2 block"
          >
            0
          </span>
        </div>

        <div
          className={`col-span-1  max-w-xs cursor-pointer rounded-md py-4 px-2 lg:px-4 text-center transition-all border 
    ${
      selectedBookingType === "book_5"
        ? "bg-blue-100 border-blue-500 shadow-md"
        : "bg-white border-gray-200 shadow-sm hover:shadow-md"
    } 
    quotation_book_type book_5`}
          onClick={() => setSelectedBookingType("book_5")}
        >
          <h5 className="text-[12px] lg:text-base font-semibold text-gray-700 flex justify-center items-center gap-2">
            Outstation <MoveUp className="h-5 w-5 sm:w-6 sm:h-6" />
          </h5>
          <span
            id="span_1"
            className="text-blue-600 font-bold text-lg mt-2 block"
          >
            0
          </span>
        </div>
      </div>
    </div>
  );
}
