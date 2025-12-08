"use client";
import { Fan, Fuel, Luggage, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface VehicleTypeCard {
  data: any;
}

export default function VehicleTypeCard({ data }: VehicleTypeCard) {
  const b2bUrl = process.env.NEXT_PUBLIC_B2B_URL;

  const DEFAULT_IMG = "/images/car_model/Economy (Hatch Back)/Baleno.png";

  // Validate & Fix URL
  const fixImageUrl = (path: string | null | undefined) => {
    if (!path) return DEFAULT_IMG;

    // absolute URL? Keep as it is
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // Local image but missing leading slash → add it
    if (!path.startsWith("/")) {
      return `${b2bUrl}/${path}`;
    }

    // Already valid local path
    return `${b2bUrl}${path}`;
  };

  const [imgSrc, setImgSrc] = useState<string>(
    fixImageUrl(data?.vehicle_image)
  );

  useEffect(() => {
    setImgSrc(fixImageUrl(data?.vehicle_image));
  }, [data?.vehicle_image]);

  return (
    <div className="vehicle w-full max-w-[210px] sm:max-w-[240px] rounded-md overflow-hidden cursor-pointer group border border-gray-300 py-3 mx-auto dark:text-black">
      <Image
        src={imgSrc}
        alt="Vehicle"
        width={240}
        height={140}
        onError={() => setImgSrc(DEFAULT_IMG)}
        className="w-full object-contain transition-transform duration-300 group-hover:scale-105"
      />

      <div className="vehicle-details flex justify-center pt-4 flex flex-col mx-3 gap-1 sm:mx-4">
        <h1
          title={data?.vehicle_type ?? "Luxury SUV"}
          className="font-semibold text-[12px] sm:text-[14px] text-center"
        >
          {data?.vehicle_type
            ? data?.vehicle_type?.length > 15
              ? data.vehicle_type.substr(0, 15) + "..."
              : data.vehicle_type
            : "Luxury SUV"}
        </h1>

        <hr className="border-b border-gray-200 h-[1px] w-full" />

        <div className="services w-full">
          <div className="flex items-center gap-[1px] mt-1 sm:gap-2 dark:text-black">
            {/* Seating */}
            <div className="flex flex-col items-center">
              <button className="p-[3px] w-[max-content] rounded-full sm:border border-gray-500">
                <User className="w-3 h-2 text-gray-500 sm:w-4 h-4" />
              </button>
              <span className="font-semibold text-gray-500 text-[0px] xl:text-[11px]">
                {data?.seating_capacity ?? "4"} + D
              </span>
            </div>

            {/* Luggage */}
            <div className="flex flex-col items-center">
              <button className="p-[3px] w-[max-content] rounded-full sm:border border-gray-500">
                <Luggage className="w-3 h-2 text-gray-500 sm:w-4 h-4" />
              </button>
              <span className="font-semibold text-gray-500 text-[0px] xl:text-[11px]">
                1 + {data?.luggage ?? "1"}
              </span>
            </div>

            {/* AC / Non-AC */}
            <div className="flex flex-col items-center">
              <button className="p-[3px] w-[max-content] rounded-full sm:border border-gray-500">
                <Fan className="w-3 h-2 text-gray-500 sm:w-4 h-4" />
              </button>
              <span className="font-semibold text-gray-500 text-[0px] xl:text-[11px]">
                {data?.vehicle_ac_nonac ?? "N/AC"}
              </span>
            </div>

            {/* Fuel */}
            <div className="flex flex-col items-center">
              <button className="p-[3px] w-[max-content] rounded-full sm:border border-gray-500">
                <Fuel className="w-3 h-2 text-gray-500 sm:w-4 h-4" />
              </button>
              <span className="font-semibold text-gray-500 text-[0px] xl:text-[11px]">
                {data?.fuel_type ?? "Petrol"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center mt-1">
          <span className="text-[10px]">
            Rental Charges: ₹ {data?.local_pkg_fare}
          </span>
          <span className="text-[10px]">
            Per KM Charges: ₹ {data?.minimum_charge}/KM
          </span>
        </div>

        <div className="flex items-end justify-between pt-3 w-full">
          <button className="font-[500] bg-[#dfad08] w-full rounded-sm cursor-pointer hover:bg-[#9d7a20] transition px-1 py-1 text-[12px] xl:text-sm xl:px-3 xl:py-1">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
