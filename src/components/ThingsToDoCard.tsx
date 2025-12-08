import Image from "next/image";
import { Coffee, CarFront, Utensils, Mail, Scale, Heart } from "lucide-react";
import React from "react";

export default function ThingsToDoCard() {
  const services = [
    {
      title: "Car Pickup",
      icon: <CarFront />,
    },
    {
      title: "Breakfast",
      icon: <Coffee />,
    },
    {
      title: "Lunch",
      icon: <Utensils />,
    },
    {
      title: "Dinner",
      icon: <Utensils />,
    },
  ];

  return (
    <div className="tour max-h-[275px] pb-1 border border-gray-300 rounded-md overflow-hidden cursor-pointer relative">
      <Image
        src="/images/explor-city/red-fort.jpg"
        alt="Tour"
        width={140}
        height={100}
        className="w-full h-[max-content] object-contain p-2"
      />
      <div className="tour-details flex flex-col px-2">
        <h1 className=" text-center font-semibold text-[14px] sm:text-[18px] dark:text-black">Red Fort</h1>
        <ul className="flex gap-3 items-center justify-between my-1">
          <li className="font-[500] text-gray-500 text-[12px] sm:text-sm dark:text-black">Delhi NCR</li>
          <li className="font-[500] text-gray-500 text-[12px] sm:text-sm dark:text-black">13:00</li>
        </ul>

        <div className="services flex items-center gap-2">
          {services.map((service, index) => (
            <div
              key={index}
              title={service.title}
              className="service bg-gray-300 rounded-sm p-1 dark:text-black"
            >
              {React.cloneElement(service.icon, { className: "w-3 h-3 sm:w-4 sm:h-4" })}
            </div>
          ))}
        </div>
       

        <hr className="border-t border-gray-300 my-2" />
        <div className="price flex items-center justify-between">
          <h1 className="font-semibold text-[14px] sm:text-[16px] dark:text-black">₹ 1500</h1>
          <button className="bg-[#dfad08] text-[#000] cursor-pointer font-[500] px-3 rounded-md py-1 hover:bg-[#9d7a20] transition text-[12px] sm:text-sm">
            Book
          </button>
        </div>
      </div>
    </div>
  );
}
