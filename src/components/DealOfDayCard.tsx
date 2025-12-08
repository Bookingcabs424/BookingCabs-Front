import Image from "next/image";
import { MapPin, Clock, Star, X } from "lucide-react";

export default function DealOfDay({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-full flex items-center justify-center p-10">
      <div className="relative flex w-full bg-white rounded-md shadow-lg overflow-hidden border border-gray-300 max-w-2xl md:max-w-3xl">
        <button
          className="absolute right-[10px] top-[10px] cursor-pointer z-10 bg-[#dfad08] rounded-full p-2 dark:text-black"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-[40%] lg:w-1/2 h-[200px] sm:h-auto">
            <Image
              src="/images/explor-city/red-fort.jpg"
              alt="Red Fort"
              fill
              className="object-cover p-5"
            />
          </div>

          <div className="flex flex-col justify-between p-5 w-full sm:w-[60%] lg:w-1/2 gap-2 sm:p-6">
            <div className="bg-red-500 text-white text-md font-bold px-3 py-1 w-[max-content]">
              🔥 Deal of the Day
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Red Fort, Delhi
              </h2>
              <p className="text-sm text-gray-700 mt-1">
                Explore the rich heritage of Mughal India in this timeless
                landmark.
              </p>
            </div>

            <ul className="text-sm text-gray-800 font-[500] space-y-1 mt-3">
              <li className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-white fill-blue-500" />
                Duration: 2–3 hours
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-white fill-red-500" />
                Location: Delhi NCR
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                4.9 Rating (1,234 reviews)
              </li>
            </ul>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[18px] font-bold text-green-600 sm:text-[24px]">
                From ₹ 1,500
              </span>
              <button className="bg-[#dfad08] cursor-pointer hover:bg-[#9d7a20] text-black text-sm font-semibold py-2 px-4 rounded-md transition">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
