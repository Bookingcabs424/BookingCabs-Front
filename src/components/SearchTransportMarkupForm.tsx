"use client";
import { useState } from "react";
import { countryNames } from "../constants/countryNames";
import { CircleCheck, CircleX, Plus, Trash } from "lucide-react";

const userTypes = ["A", "B", "C", "D", "E"];
const bookingTypes = [
  "Rental",
  "City Taxi",
  "Airport Transfer",
  "Outstation",
  "Oneway",
  "Activity",
  "Transport Package",
];

export default function SearchTransportMarkupForm() {
  const [status, setStatus] = useState<string>("state");
  const handleToggle = (buttonId: string) => {
    setStatus((prev) => (prev === buttonId ? "state" : buttonId));
  };

  const onSubmit = () => {};
  return (
    <div className="p-6 sm:p-12 sm:pb-6">
      <div className="search-transport-form bg-white shadow-md border border-gray-300  rounded-sm">
        <h1 className="bg-gray-300 py-3 px-5  font-semibold flex items-center gap-2 text-sm sm:text-base">
          Search Transport Markup
        </h1>

       <div className="grid grid-cols-3 gap-8 py-1 px-5 pt-6 sm:gap-4 sm:px-12 md:flex md:items-center">
          {[
            { id: "country", label: "Country" },
            { id: "state", label: "State" },
            { id: "city", label: "City" },
            { id: "bookingType", label: "Booking Type" },
            { id: "user", label: "User" },
          ].map((option) => (
            <div
              key={option.id}
              className="flex gap-1 items-center text-sm sm:gap-2"
            >
              <div
                onClick={() => handleToggle(option.id)}
                className={`rounded-full border-2 border-gray-500 cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300
        ${status === option.id ? "justify-end" : "justify-start"}
        min-w-10 min-h-5 sm:min-w-14 sm:min-h-7`}
              >
                <div className="h-3.5 w-3.5 sm:h-5 sm:w-5 rounded-full bg-gray-500 shadow-md transition-all duration-300" />
              </div>
              <p className="text-[12px] font-[500]">{option.label}</p>
            </div>
          ))}
        </div>
        {status === "state" && (
          <div className="grid grid-cols-1 gap-1 p-3 px-5 sm:px-12 sm:p-6 sm:grid-cols-2 md:grid-cols-3 sm:gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="name"
                className="font-semibold text-[12px] text-sm"
              >
                Name
              </label>
              <input
                type="text"
                className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] col-span-2 sm:text-sm lg:col-span-1"
                placeholder="Enter Name"
              />
            </div>

            <div className="flex flex-col py-1">
              <label
                htmlFor="country"
                className="font-semibold text-[12px] text-sm"
              >
                Country
              </label>
              <select
                name="country"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option value="Select Country" defaultValue="Select Country">
                  Select Country
                </option>
                {countryNames.map((country) => (
                  <option value={country} key={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col py-1">
              <label
                htmlFor="state"
                className="font-semibold text-[12px] text-sm"
              >
                State
              </label>
              <select
                name="state"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option value="Select State" defaultValue="Select State">
                  Select State
                </option>
              </select>
            </div>

            <div className="flex flex-col py-1">
              <label
                htmlFor="city"
                className="font-semibold text-[12px] text-sm"
              >
                City
              </label>
              <select
                name="city"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option value="Select City" defaultValue="Select City">
                  Select City
                </option>
              </select>
            </div>

            <div className="flex flex-col py-1">
              <label
                htmlFor="userGrade"
                className="font-semibold text-[12px] text-sm"
              >
                User Grade Type
              </label>
              <select
                name="userGrade"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option
                  value="Select User Grade"
                  defaultValue="Select User Grade"
                >
                  Select User Grade
                </option>
                {userTypes.map((type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col py-1">
              <label
                htmlFor="bookingType"
                className="font-semibold text-[12px] text-sm"
              >
                Booking Type
              </label>
              <select
                name="bookingType"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option
                  value="Select Booking Type"
                  defaultValue="Select Booking Type"
                >
                  Select Booking Type
                </option>
                {bookingTypes.map((bookingType) => (
                  <option value={bookingType} key={bookingType}>
                    {bookingType}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {status === "country" && (
          <div className="grid grid-cols-1 gap-1 p-3 px-5 sm:px-12 sm:grid-cols-2 md:grid-cols-3 sm:p-6 sm:gap-3">
            <div className="flex flex-col py-1">
              <label
                htmlFor="country"
                className="font-semibold text-[12px] text-sm"
              >
                Country
              </label>
              <select
                name="country"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option value="Select Country" defaultValue="Select Country">
                  Select Country
                </option>
                {countryNames.map((country) => (
                  <option value={country} key={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col py-1">
              <label
                htmlFor="userGrade"
                className="font-semibold text-[12px] text-sm"
              >
                User Grade Type
              </label>
              <select
                name="userGrade"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option
                  value="Select User Grade"
                  defaultValue="Select User Grade"
                >
                  Select User Grade
                </option>
                {userTypes.map((type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col py-1">
              <label
                htmlFor="bookingType"
                className="font-semibold text-[12px] text-sm"
              >
                Booking Type
              </label>
              <select
                name="bookingType"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option
                  value="Select Booking Type"
                  defaultValue="Select Booking Type"
                >
                  Select Booking Type
                </option>
                {bookingTypes.map((bookingType) => (
                  <option value={bookingType} key={bookingType}>
                    {bookingType}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {status === "city" && (
          <div className="grid  p-3 px-5 grid-cols-1 sm:grid-cols-2 sm:px-12 sm:p-6 sm:gap-3 md:grid-cols-3">
            <div className="flex flex-col py-1">
              <label
                htmlFor="country"
                className="font-semibold text-[12px] text-sm"
              >
                Country
              </label>
              <select
                name="country"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option value="Select Country" defaultValue="Select Country">
                  Select Country
                </option>
                {countryNames.map((country) => (
                  <option value={country} key={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col py-1">
              <label
                htmlFor="state"
                className="font-semibold text-[12px] text-sm"
              >
                State
              </label>
              <select
                name="state"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option value="Select State" defaultValue="Select State">
                  Select State
                </option>
              </select>
            </div>

            <div className="flex flex-col py-1">
              <label
                htmlFor="city"
                className="font-semibold text-[12px] text-sm"
              >
                City
              </label>
              <select
                name="city"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option value="Select City" defaultValue="Select City">
                  Select City
                </option>
              </select>
            </div>

            <div className="flex flex-col py-1">
              <label
                htmlFor="userGrade"
                className="font-semibold text-[12px] text-sm"
              >
                User Grade Type
              </label>
              <select
                name="userGrade"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option
                  value="Select User Grade"
                  defaultValue="Select User Grade"
                >
                  Select User Grade
                </option>
                {userTypes.map((type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col py-1">
              <label
                htmlFor="bookingType"
                className="font-semibold text-[12px] text-sm"
              >
                Booking Type
              </label>
              <select
                name="bookingType"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option
                  value="Select Booking Type"
                  defaultValue="Select Booking Type"
                >
                  Select Booking Type
                </option>
                {bookingTypes.map((bookingType) => (
                  <option value={bookingType} key={bookingType}>
                    {bookingType}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {status === "bookingType" && (
          <div className="grid  p-3 px-5 grid-cols-1 sm:grid-cols-2 sm:px-12 sm:p-6 sm:gap-3 md:grid-cols-3">
            <div className="flex flex-col py-1">
              <label
                htmlFor="userGrade"
                className="font-semibold text-[12px] text-sm"
              >
                User Grade Type
              </label>
              <select
                name="userGrade"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option
                  value="Select User Grade"
                  defaultValue="Select User Grade"
                >
                  Select User Grade
                </option>
                {userTypes.map((type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col py-1">
              <label
                htmlFor="bookingType"
                className="font-semibold text-[12px] text-sm"
              >
                Booking Type
              </label>
              <select
                name="bookingType"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option
                  value="Select Booking Type"
                  defaultValue="Select Booking Type"
                >
                  Select Booking Type
                </option>
                {bookingTypes.map((bookingType) => (
                  <option value={bookingType} key={bookingType}>
                    {bookingType}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {status === "user" && (
          <div className="grid  p-3 px-5 grid-cols-1 sm:grid-cols-2 sm:px-12 sm:p-6 sm:gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="name"
                className="font-semibold text-[12px] text-sm"
              >
                Name
              </label>
              <input
                type="text"
                className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] col-span-2 sm:text-sm lg:col-span-1"
                placeholder="Enter Name"
              />
            </div>
            <div className="flex flex-col py-1">
              <label
                htmlFor="userGrade"
                className="font-semibold text-[12px] text-sm"
              >
                User Grade Type
              </label>
              <select
                name="userGrade"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option
                  value="Select User Grade"
                  defaultValue="Select User Grade"
                >
                  Select User Grade
                </option>
                {userTypes.map((type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col py-1">
              <label
                htmlFor="bookingType"
                className="font-semibold text-[12px] text-sm"
              >
                Booking Type
              </label>
              <select
                name="bookingType"
                id=""
                className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
              >
                <option
                  value="Select Booking Type"
                  defaultValue="Select Booking Type"
                >
                  Select Booking Type
                </option>
                {bookingTypes.map((bookingType) => (
                  <option value={bookingType} key={bookingType}>
                    {bookingType}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end p-4 pt-0">
          <button className="text-[12px] sm:text-sm cursor-pointer py-2 px-4 rounded-sm bg-[#101828] text-white">
            Search
          </button>
          <button className="text-[12px] sm:text-sm cursor-pointer py-2 px-4 rounded-sm bg-[#101828] text-white">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
