"use client";

import Image from "next/image";
import BookingFormNavButtons from "./BookingFormNavButtons";

export default function Hero() {
  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
      <Image
        src="/images/slider/bg3.jpg"
        alt="Slider Background"
        fill
        className="object-cover"
        priority
        // unoptimized
      />
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="absolute z-0 flex top-[10%] left-[20px]  lg:hidden">
        <BookingFormNavButtons/>
      </div>
    </div>
  );
}
