import { useState } from "react";
import ActivityDetailUpdatePopup from "./ActivityDetailUpdatePopup";
import DriverDetailUpdatePopup from "./DriverDetailUpdatePopup";
import GuideDetailUpdatePopup from "./GuideDetailUpdatePopup";
import SightSeeingCard from "./SightSeeingCard";
import { X } from "lucide-react";

export default function SightseeingSummaryPanel({ isEdit = true }) {
  const [isOpen, setIsOpen] = useState<string>("");



  return (
    <>
      <div className="sight-update-details w-[100%] lg:block py-3">
        <h1>
          Sight Seeing Details{" "}
          {isEdit && (
            <span className="text-gray-500 cursor-pointer hover:text-gray-600">
              (Modify)
            </span>
          )}
        </h1>
        <h1 className="my-4">Delhi Sightseeing</h1>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {Array(5)
            .fill("a")
            .map((item, idx) => (
              <SightSeeingCard key={idx} isEdit={isEdit} />
            ))}
        </div>
        <h1 className="my-4">Agra Sightseeing</h1>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {Array(3)
            .fill("a")
            .map((item, idx) => (
              <SightSeeingCard key={idx} isEdit={isEdit} />
            ))}
        </div>

        <h1 className="my-4">Driver & Guide Detail</h1>
        <div className="driver-guide border border-gray-300 rounded-md p-2 flex flex-col gap-1">
          <div className="flex items-center">
            <h1 className="text-[12px] w-[50%]">
              English Speaking & Understanding Driver
            </h1>
            <h1 className="text-[12px] w-[25%] text-center"> ₹ 500</h1>
            {isEdit && (
              <button
                className="border border-[#dfad08] text-[13px] rounded-sm px-3 py-1 font-[500] cursor-pointer flex"
                onClick={() => setIsOpen("driver-update")}
              >
                Edit
              </button>
            )}
          </div>
          <div className="flex items-center">
            <h1 className="text-[12px] w-[50%]">
              English Speaking & Understanding Guide
            </h1>
            <h1 className="text-[12px] w-[25%] text-center"> ₹ 500</h1>
            {isEdit && (
              <button
                className="border border-[#dfad08] text-[13px] rounded-sm px-3 py-1 font-[500] cursor-pointer"
                onClick={() => setIsOpen("guide-update")}
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <h1 className="my-4">Attraction Activity Detail</h1>
        <div className="attraction-guide border border-gray-300 rounded-md p-2 flex flex-col gap-1">
          <div className="flex items-center gap-9">
            <h1 className="text-[12px] w-[50%]">
              Travel via Yamuna Expressway :
            </h1>
            <h1 className="text-[12px] w-[25%] text-center"> ₹ 500</h1>
          </div>
          <div className="flex items-center gap-9">
            <h1 className="text-[12px] w-[50%]">
              Light and Sound Show, @ Agra Fort- a UNESCO world heritage site,
              Agra
            </h1>
            <h1 className="text-[12px] w-[25%] text-center"> ₹ 500</h1>
          </div>
          <div className="flex items-center gap-9">
            <h1 className="text-[12px] w-[50%]">
              Light and Sound Show, @ Agra Fort- a UNESCO world heritage site,
              Agra
            </h1>
            <h1 className="text-[12px] w-[25%] text-center"> ₹ 500</h1>
          </div>
          {isEdit && (
            <button
              className="border border-[#dfad08] text-[13px] rounded-sm px-3 py-1 font-[500] cursor-pointer w-[max-content] mx-3 my-2"
              onClick={() => setIsOpen("activity")}
            >
              Modify
            </button>
          )}
        </div>
      </div>
      {isOpen !== "" && (
        <div
          className="fixed inset-0 bg-[#00000099] bg-opacity-0 flex items-center justify-center z-50"
          onClick={() => setIsOpen("")}
        >
          <div
            className="bg-white bg-red-200 p-6 rounded-lg shadow-lg relative !max-h-[400px] overflow-y-auto w-[300px] sm:w-[600px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen("")}
              className="absolute top-2 right-2 text-gray-600 hover:text-black cursor-pointer"
            >
              <X />
            </button>

            {isOpen === "activity" && <ActivityDetailUpdatePopup />}
            {isOpen === "driver-update" && <DriverDetailUpdatePopup />}
            {isOpen === "guide-update" && <GuideDetailUpdatePopup />}
          </div>
        </div>
      )}

    </>
  );
}
