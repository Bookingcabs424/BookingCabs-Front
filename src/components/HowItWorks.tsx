"use client";
import Image from "next/image";

export default function HowItWorks() {
  return (
    <>
    <h1 className="text-xl font-bold sm:text-2xl my-4 dark:text-black">How it Works</h1>
    <div className="flex items-center justify-center my-5">
      <div className="process cursor-pointer">
        <Image
          src="/images/icon/avance-booking-1.png"
          alt="Upcoming"
          width={50}
          height={80}
          className="w-[120px] h-[50px] object-contain  transition-transform duration-500 group-hover:scale-105 sm:p-2 sm:h-[100px]"
        />
      </div>
      <div className="border-2 border-[#23c5c8] border-dotted w-[50px]" />
      <div className="process cursor-pointer">
        <Image
          src="/images/icon/clean-wel-man-1.png"
          alt="Upcoming"
          width={50}
          height={80}
          className="w-[120px] h-[50px] object-contain  transition-transform duration-500 group-hover:scale-105 sm:p-2 sm:h-[100px]"
        />
      </div>
      <div className="border-2 border-[#23c5c8] border-dotted w-[50px]" />
      <div className="process cursor-pointer">
        <Image
          src="/images/icon/fix-pricing-1.png"
          alt="Upcoming"
          width={50}
          height={80}
          className="w-[120px] h-[50px] object-contain  transition-transform duration-500 group-hover:scale-105 sm:p-2 sm:h-[100px]"
        />
      </div>
      <div className="border-2 border-[#23c5c8] border-dotted w-[50px]" />
      <div className="process cursor-pointer">
        <Image
          src="/images/icon/avance-booking-1.png"
          alt="Upcoming"
          width={50}
          height={80}
          className="w-[120px] h-[50px] object-contain  transition-transform duration-500 group-hover:scale-105 sm:p-2 sm:h-[100px]"
        />
      </div>
      
    </div>
    </>
  );
}
