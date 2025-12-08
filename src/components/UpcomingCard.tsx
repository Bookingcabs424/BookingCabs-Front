"use client";
import Image from "next/image";

export default function UpcomingCard() {
  return (
    <div className="bg-gray-100 rounded-md p-3 py-6 shadow-lg">
      <div className="flex items-center justify-center">
        <Image
          src="/images/icon/avance-booking-1.png"
          alt="Upcoming"
          width={30}
          height={50}
          className="w-[100px] h-[90px] object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="upcoming-card-details p-2 pt-0">
        <h1 className="font-semibold text-center my-3 dark:text-black">Advanced Booking</h1>
        <p className="text-center text-[12px] dark:text-black">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio
          deserunt 
        </p>
      </div>
    </div>
  );
}
