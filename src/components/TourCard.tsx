"use client";
import Image from "next/image";

export default function TourCard() {
  return (
    <div className="tour h-[310px] border border-gray-300 rounded-md overflow-hidden cursor-pointer relative">
      <Image
        src="/images/explor-city/red-fort.jpg"
        alt="Tour"
        width={140}
        height={100}
        className="w-full h-1/2 object-cover rounded-t-md sm:h-[max-content] sm:object-contain"
      />
      <div className="tour-details flex flex-col p-2">
        <h1 className="text-[13px] font-semibold dark:text-black">Red Fort</h1>

        <hr className="border-t border-gray-300 my-2 " />
        <div className="grid grid-cols-1 justify-between">
          <div className="grid grid-rows-3 gap-0">
            <li className="text-[11px] text-gray-600 list-disc">
              Round Trip Flights
            </li>
            <li className="text-[11px] text-gray-600 list-disc">
              3 Star Hotels
            </li>
            <li className="text-[11px] text-gray-600 list-disc">
              3 Activities
            </li>
            <li className="text-[11px] text-gray-600 list-disc">
              Intercity Car Transfer
            </li>
           
          </div>
        </div>
        <div className="price flex justify-end absolute bottom-[10px] right-[5px]">
          <span className="flex items-center">
            <span className="font-bold dark:text-black">₹27,882</span>
            <span className="text-[11px] text-gray-500">/Person</span>
          </span>
        </div>
      </div>
    </div>
  );
}
