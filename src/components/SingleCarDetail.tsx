"use client";
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
  Wine,
} from "lucide-react";

export default function SingleCarDetail() {
  return (
    <div className="border border-gray-300 h-full py-1 px-3 rounded-md flex items-center flex-col md:flex-row gap-3 cursor-pointer">
      {/* Car Image & Name */}
      <div className="w-1/2 md:w-[25%] flex justify-center flex-col items-center justify-center">
        <div className="relative w-[200px] h-[150px] sm:w-[150px] sm:h-[100px]">
          <Image
            src="/images/car_model/Economy (Hatch Back)/Baleno.png"
            alt="Slider Background"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 py-1">
          <h1 className="text-lg sm:text-md font-[600] text-black">
            Baleno
          </h1>
          <span className="text-[10px] bg-[#dfad0a] px-2 py-1 rounded-full font-medium">
            Hatchback
          </span>
        </div>
      </div>
    {/* Car Details */}
      <div className="right-car-details w-full md:w-[75%] py-2 flex flex-col sm:flex-row gap-2 px-3">
       <div className="flex flex-col w-full gap-3 sm:gap-6">
         <div className="services flex flex-wrap gap-4 ">
          <div className="feature flex gap-1 items-center cursor-pointer group">
            <div className="border border-gray-500 p-[3px] rounded-full group-hover:border-[#9d7a20]">
              <User className="w-4 h-4 text-gray-500 group-hover:text-[#9d7a20]" />
            </div>
            <span className="text-sm text-gray-500">4+D</span>
          </div>

          <div className="feature flex gap-1 items-center cursor-pointer group">
            <div className="border border-gray-500 p-[3px] rounded-full group-hover:border-[#9d7a20]">
              <Luggage className="w-4 h-4 text-gray-500 group-hover:text-[#9d7a20]" />
            </div>
            <span className="text-sm text-gray-500">1+2</span>
          </div>

          <div className="feature flex gap-1 items-center cursor-pointer group">
            <div className="border border-gray-500 p-[3px] rounded-full group-hover:border-[#9d7a20]">
              <Fan className="w-4 h-4 text-gray-500 group-hover:text-[#9d7a20]" />
            </div>
            <span className="text-sm text-gray-500">N/AC</span>
          </div>

          <div className="feature flex gap-1 items-center cursor-pointer group">
            <div className="border border-gray-500 p-[3px] rounded-full group-hover:border-[#9d7a20]">
              <Fuel className="w-4 h-4 text-gray-500 group-hover:text-[#9d7a20]" />
            </div>
            <span className="text-sm text-gray-500">Petrol</span>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="text-sm text-gray-500 pt-2 w-full  xl:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Delhi-NCR</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleGauge className="w-4 h-4" />
              <span>40 KM</span>
            </div>
             <div className="flex items-center gap-2 cursor-pointer hover:text-red-500">
              <Wine className="w-4 h-4" />
              <span>Amenities</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>21-05-2025</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>11:03:30</span>
            </div>
          </div>
        </div>
       </div>
          <div className="flex flex-row sm:flex-col justify-between sm:items-center gap-2 items-stretch">
            <h1 className="text-lg font-semibold">₹ 1050.00</h1>
            <button className="bg-[#dfad0a] text-sm px-6 py-2 rounded-sm cursor-pointer font-medium hover:bg-[#9d7a20] transition">
              Select
            </button>
          </div>
      </div>
    </div>
  );
}


