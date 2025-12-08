"use client";
import { Star } from "lucide-react";
import Image from "next/image";

export default function PackageCard() {
  return (
    <div className="tour h-[310px] border border-gray-300 rounded-md overflow-hidden cursor-pointer relative">
      <Image
        src="/images/explor-city/red-fort.jpg"
        alt="Tour"
        width={140}
        height={100}
        className="w-full h-[max-content] object-contain p-2"
      />
      <div className="tour-details flex flex-col px-2">
        <h1 className="text-[16px] font-semibold dark:text-black">Red Fort</h1>
        <ul className="flex gap-3">
          <li className="text-[12px] text-gray-500 dark:text-black">Flights</li>
          <li className="text-[12px] text-gray-500 dark:text-black">3 Nights</li>
        </ul>

       <div className="flex gap-[1px] my-2">
         {Array(5).fill('s').map((_,idx) => (
            <Star key={idx} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        ))}
       </div>
        <div className="price flex justify-end absolute bottom-[10px] right-[5px]">
          <button className="border border-[#dfad08] text-[#000] font-[500] text-sm px-3 rounded-md py-1 dark:text-black">
            Add 
          </button>
        </div>
      </div>
    </div>
  );
}
