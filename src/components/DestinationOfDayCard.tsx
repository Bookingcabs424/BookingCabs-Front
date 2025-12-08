import Image from "next/image";
import { MapPin, Clock, Star } from "lucide-react";

export default function DestinationOfDayCard() {
  return (
    <div className="destination w-full pb-1 max-h-[275px] rounded-md overflow-hidden cursor-pointer border border-gray-300 mx-auto">
      <Image
        src="/images/explor-city/red-fort.jpg"
        alt="Vehicle"
        width={240}
        height={140}
        className="w-full object-contain transition-transform"
      />
      <div className="destination-details flex justify-center pt-4 flex flex-col mx-3 sm:gap-1 sm:mx-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[2px] dark:text-black">
            <MapPin className="w-3 h-3 text-gray-500 sm:w-4 sm:h-4 dark:text-black" />
            <span className="text-gray-500 font-[500] text-[10px] sm:text-[12px] dark:text-black">
              Delhi NCR
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>
              <span className="font-semibold text-[13px] dark:text-black">4.9</span>
              <span className="text-[13px] dark:text-black">/5</span>
            </span>
          </div>
        </div>
        <h1 className="font-semibold text-[13px] sm:text-[15px] dark:text-black">Red Fort</h1>
        <div className="flex items-center gap-[3px]">
          <Clock className="w-3 h-3 text-gray-500 sm:w-4 sm:h-4 dark:text-black" />
          <span className="text-gray-500 text-[10px] font-[500] lg:text-[10.5px] dark:text-black">
            25mins - 1hr 50mins
          </span>
        </div>

        <button className="border border-[#dfad08] bg-gray-100 rounded-md py-[2px] mt-2 font-semibold cursor-pointer text-[10px] sm:py-1 sm:text-[12px] dark:text-black">Starting From ₹ 1500</button>
      </div>
    </div>
  );
}
