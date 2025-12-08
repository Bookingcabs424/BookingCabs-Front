"use client";

import { useBiddingMutation } from "@/hooks/useCommon";
import { useEffect } from "react";

export default function Bidding() {
  const { data: bidding, mutate: getBiddings } = useBiddingMutation();

  useEffect(() => {
    getBiddings({});
  }, []);

  console.log(bidding);

  const biddings = [
    {
      from: "Bhilai",
      to: "Raipur",
      price: 1060,
    },
    {
      from: "Bengaluru-Bangalore",
      to: "Mysore",
      price: 1476,
    },
    {
      from: "Ahmednagar",
      to: "Pune",
      price: 1716,
    },
    {
      from: "Coimbatore",
      to: "Erode",
      price: 1060,
    },
    {
      from: "Bhilai",
      to: "Raipur",
      price: 1060,
    },
    {
      from: "Bhilai",
      to: "Raipur",
      price: 1060,
    },
    {
      from: "Bhilai",
      to: "Raipur",
      price: 1060,
    },
    {
      from: "Bhilai",
      to: "Raipur",
      price: 1060,
    },
    {
      from: "Bhilai",
      to: "Raipur",
      price: 1060,
    },
    {
      from: "Bhilai",
      to: "Raipur",
      price: 1060,
    },

    {
      from: "Bhilai",
      to: "Raipur",
      price: 1060,
    },
  ];
  return (
    <div>
      <h1 className="text-xl font-bold sm:text-2xl dark:text-black">
        Oneway City
      </h1>

      <div className="border border-gray-300 rounded-sm mt-4">
        <div className="bg-[#333333]  py-3 rounded-t-sm px-4">
          <div className="grid grid-cols-6 items-center gap-3">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="From City"
                className="text-white border-b border-white w-full outline-none pb-[2px] px-1 text-[12px]"
              />
            </div>
            <div className="col-span-2">
              <input
                type="text"
                placeholder="To City"
                className="text-white border-b border-white w-full outline-none pb-[2px] px-1 text-[12px]"
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <button className="text-[12px] font-semibold bg-[#f6dfb7] px-3 py-1 rounded-sm cursor-pointer hover:bg-[#dfad08] transitions dark:text-black">
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="biddings-list h-[256px] overflow-y-auto custom-scroll px-3 py-4 dark:text-black">
          {biddings.map((bidding, idx) => (
            <div className="grid grid-cols-5" key={idx}>
              <div className="col-span-2 my-[2px]">
                <span className="font-[500] text-[12px]">
                  {bidding.from}
                </span>
              </div>
              <div className="col-span-1 my-[2px]">
                <span className="font-[500] text-[12px]">
                  {bidding.to}
                </span>
              </div>
              <div className="col-span-1 my-[2px]">
                <span className="font-semibold text-[12px]">
                  ₹ {bidding.price}
                </span>
              </div>
              <div className="col-span-1 my-[2px] text-center">
                <button className="text-[12px] font-[500] bg-[#dfad08] px-3 py-[2px] rounded-sm cursor-pointer hover:bg-[#9d7a20] transition">
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
