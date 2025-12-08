import { CarFront, Luggage, PersonStanding } from "lucide-react";
import { useState } from "react";

export default function VehiclesListForm() {
  const [activePickup, setActivePickup] = useState<string>("pickup-now");
  const packages = ["package1", "package2", "package3"];

   // Toggle function
  const handleToggle = (buttonId: string) => {
    setActivePickup((prev) => (prev === buttonId ? "pickup-now" : buttonId));
  };


  return (
    <>
      <div className="grid grid-cols-1 px-6 lg:grid-cols-3">
        <div className="city-input flex flex-col px-3 py-2 gap-2 lg:p-3">
          <label htmlFor="city" className="text-[14px] font-[500]">
            City
          </label>
          <input
            type="text"
            placeholder="Enter City"
            defaultValue=""
            className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
          />
        </div>
        <div className="package-input flex flex-col px-3 py-2 gap-2 lg:p-3">
          <label htmlFor="package" className="text-[14px] font-[500]">
            Package
          </label>
          <select
            id="package"
            defaultValue=""
            className="border border-gray-400 px-3 py-2 rounded-md outline-none text-gray-500 text-sm"
          >
            <option value="" disabled>
              Select Package
            </option>
            {packages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="pickup_location-input flex flex-col px-3 py-2 gap-2 lg:p-3">
          <label htmlFor="pickup_location" className="text-[14px] font-[500]">
            Pickup Location
          </label>
          <input
            type="text"
            id="pickup_location"
            placeholder="Enter Pickup Location"
            className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
          />
        </div>
      </div>

      {/* Pickup & Nationality */}
      <div className="grid grid-cols-1 px-6 lg:grid-cols-3 px-6 py-1">
        <div className="city-input flex flex-col px-3 py-2 gap-2 col-span-2">
          <label htmlFor="pickup_address" className="text-[14px] font-[500]">
            Pickup Address
          </label>
          <input
            type="text"
            placeholder="Enter Pickup Address"
            className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
          />
        </div>
        <div className="city-input flex flex-col p-3 gap-2">
          <label htmlFor="nationality" className="text-[14px] font-[500]">
            Nationality
          </label>
          <input
            type="text"
            placeholder="Enter Nationality"
            className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
          />
        </div>
      </div>

      {/* Toggle  */}
      <div className="px-8 grid grid-cols-1  md:grid-cols-2 gap-4 px-4 py-2 lg:grid-cols-3 py-3">
        {[
          { id: "pickup-now", label: "Pick Now (Within 30 Minutes)" },
          { id: "pickup-after", label: "Pick Later (After 1 Hr.)" },
          { id: "pickup-multiple", label: "Pick for multiple days" },
        ].map((option) => (
          <div key={option.id} className="flex gap-2 items-center">
            <div
              onClick={() => handleToggle(option.id)}
              className={`w-16 h-8 rounded-full border-2 border-[#dfad0a] cursor-pointer bg-white flex items-center px-1 transition-all duration-300 ${
                activePickup === option.id ? "justify-end" : "justify-start"
              }`}
            >
              <div className="h-6 w-6 rounded-full bg-[#dfad0a] shadow-md transition-all duration-300" />
            </div>
            <p className="text-sm font-medium">{option.label}</p>
          </div>
        ))}
      </div>

      {/* Pickup After */}
      {activePickup === "pickup-after" && (
        <div className="grid grid-cols-2 px-6 py-2 xl:grid-cols-3">
          <div className="date-input flex flex-col p-2 gap-2">
            <label htmlFor="date" className="text-[14px] font-[500]">
              Date
            </label>
            <input
              type="date"
              className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
            />
          </div>
          <div className="city-input flex flex-col p-3 gap-2">
            <label htmlFor="time" className="text-[14px] font-[500]">
              Time
            </label>
            <input
              type="time"
              className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
            />
          </div>
        </div>
      )}
      {/* Pickup Multiple */}
      {activePickup === "pickup-multiple" && (
        <div className="md:grid grid-cols-2 lg:grid-cols-3 xl:flex flex-wrap gap-4 px-6 py-5">
          <div className="w-full flex py-2 flex-col gap-2 xl:w-[18%]">
            <label htmlFor="from" className="text-[14px] font-medium">
              From
            </label>
            <input
              id="from"
              type="date"
              placeholder="From"
              className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
            />
          </div>

          <div className="w-full flex py-2 flex-col gap-2 xl:w-[18%]">
            <label htmlFor="time" className="text-[14px] font-medium">
              Time
            </label>
            <input
              id="time"
              type="time"
              className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
            />
          </div>

          <div className="w-full flex py-2 flex-col gap-2 xl:w-[18%]">
            <label htmlFor="to" className="text-[14px] font-medium">
              To
            </label>
            <input
              id="to"
              type="date"
              placeholder="To"
              className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
            />
          </div>

          <div className="w-full flex py-2 flex-col gap-2 xl:w-[18%]">
            <label htmlFor="time" className="text-[14px] font-medium">
              Time
            </label>
            <input
              id="time"
              type="time"
              className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
            />
          </div>

          <div className="w-full flex py-2 flex-col gap-2 xl:w-[18%]">
            <label htmlFor="days" className="text-[14px] font-medium ">
              Days
            </label>
            <input
              id="days"
              type="number"
              min={1}
              placeholder="Enter Days"
              className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:flex flex-wrap gap-4 px-6 py-6">
        <div className="w-[95%] flex flex-col gap-2 xl:w-[18%]">
          <label htmlFor="adults" className="text-lg font-medium">
            <span className="flex items-center gap-1 text-[16px]">
              <PersonStanding className="text-gray-600" /> Adults
            </span>
          </label>
          <input
            id="adults"
            type="number"
            min={1}
            className="border border-gray-400 px-3 py-2 rounded-md outline-none"
          />
        </div>

        <div className="w-[95%] flex flex-col gap-2 xl:w-[18%]">
          <label htmlFor="small-luggage" className="font-medium">
            <span className="flex items-center gap-1 whitespace-nowrap text-[14px]">
              <PersonStanding className="text-gray-600" /> Children
            </span>
          </label>
          <input
            id="children"
            type="number"
            className="border border-gray-400 px-3 py-2 rounded-md outline-none"
            min={0}
          />
        </div>

        <div className="w-[95%] flex flex-col gap-2 xl:w-[18%]">
          <label htmlFor="big_luggage" className="text-lg font-medium">
            <span className="flex items-center gap-1 text-[14px]">
              <Luggage className="text-gray-600" /> Big Luggage
            </span>
          </label>
          <input
            id="big_luggage"
            type="number"
            min={0}
            className="border border-gray-400 px-3 py-2 rounded-md outline-none"
          />
        </div>

        <div className="w-[95%] flex flex-col gap-2 xl:w-[18%]">
          <label htmlFor="small_luggage" className="text-lg font-medium">
            <span className="flex items-center gap-1 text-[14px]">
              <Luggage className="text-gray-600" /> Small Luggage
            </span>
          </label>
          <input
            id="small_luggage"
            type="number"
            min={0}
            className="border border-gray-400 px-3 py-2 rounded-md outline-none"
          />
        </div>

        <div className="w-[95%] flex flex-col gap-2 xl:w-[18%]">
          <label htmlFor="vehicles" className="text-lg font-medium">
            <span className="flex items-center gap-1 text-[14px]">
              <CarFront className="text-gray-600" />
              Vehicles
            </span>
          </label>
          <input
            id="vehicles"
            type="number"
            min={0}
            className="border border-gray-400 px-3 py-2 rounded-md outline-none"
          />
        </div>
      </div>
      <div className="submit-btn px-6 py-4 flex items-center justify-center w-full">
        <button
          type="submit"
          className="w-[60%] h-full py-2 rounded-md bg-[#dfad0a] text-lg font-[600] cursor-pointer hover:bg-[#9d7a20] transition"
        >
          Search a Car
        </button>
      </div>
    </>
  );
}
