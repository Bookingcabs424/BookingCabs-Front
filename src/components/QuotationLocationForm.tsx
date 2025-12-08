"use client";

import { indianStates } from "@/constants/formSelectConstants";
import { Search } from "lucide-react";

export default function QuotationLocationForm({ 
  formData, 
  onFormDataChange, 
  onClear 
}: any) {
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    onFormDataChange({ [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Location form submitted with:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 p-3 sm:p-6 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col py-1">
          <label htmlFor="state" className="text-[12px] text-sm">
            State
          </label>
          <select
            value={formData.state || ""}
            onChange={(e) => handleInputChange("state", e.target.value)}
            className="border border-gray-300 py-1 px-2 outline-none rounded-sm w-full text-[10px]"
          >
            <option value="">Select State</option>
            {indianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col py-1">
          <label htmlFor="city" className="text-[12px] text-sm">
            City
          </label>
          <select
            value={formData.city || ""}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className="border border-gray-300 py-1 px-2 outline-none rounded-sm w-full text-[10px]"
          >
            <option value="">Select City</option>
            {/* You would typically populate this based on the selected state */}
          </select>
        </div>

        <div className="flex flex-col py-1">
          <label htmlFor="pickup" className="text-[12px] text-sm">
            Pickup
          </label>
          <input
            type="text"
            placeholder="Enter Pickup"
            value={formData.pickup || ""}
            onChange={(e) => handleInputChange("pickup", e.target.value)}
            className="border border-gray-300 py-1 px-2 outline-none rounded-sm w-full text-[10px]"
          />
        </div>

        <div className="flex flex-col py-1">
          <label htmlFor="dropOff" className="text-[12px] text-sm">
            Drop Off
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Drop Off"
              value={formData.dropOff || ""}
              onChange={(e) => handleInputChange("dropOff", e.target.value)}
              className="border border-gray-300 py-1 px-2 outline-none rounded-sm w-full text-[10px]"
            />
            <button 
              type="button"
              className="absolute cursor-pointer p-1 bg-gray-100 rounded-sm border border-gray-500 h-full right-0"
            >
              <Search className="h-[10px] w-[10px]" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-end p-4 pt-0">
        <button
          type="button"
          onClick={onClear}
          className="text-[10px] cursor-pointer py-1 px-3 rounded-sm bg-[#E08E0B] text-white"
        >
          Clear
        </button>
        <button
          type="submit"
          className="text-[10px] cursor-pointer py-1 px-3 rounded-sm bg-[#00A65A] text-white"
        >
          Search
        </button>
      </div>
    </form>
  );
}