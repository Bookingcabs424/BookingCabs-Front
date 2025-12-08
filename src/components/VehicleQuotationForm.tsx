"use client";

import { vehicleTypes } from "@/constants/formSelectConstants";

export default function VehicleQuotationForm({ 
  formData, 
  onFormDataChange, 
  onClear 
}: any) {
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    onFormDataChange({ [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Vehicle form submitted with:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 p-3 sm:p-6 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col py-1">
          <label htmlFor="vehicleType" className="text-[10px]">
            Vehicle Type
          </label>
          <select
            value={formData.vehicle_type || ""}
            onChange={(e) => handleInputChange("vehicle_type", e.target.value)}
            className="w-full border text-[10px] border-gray-300 focus:outline-none py-1 px-2 rounded-sm"
          >
            <option value="">Select Vehicle Type</option>
            {vehicleTypes.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col py-1">
          <label htmlFor="vehicleNo" className="text-[10px]">
            Vehicle Number
          </label>
          <input
            type="text"
            placeholder="Enter Vehicle Number"
            value={formData.vehicleNo || ""}
            onChange={(e) => handleInputChange("vehicleNo", e.target.value)}
            className="w-full border text-[10px] border-gray-300 focus:outline-none py-1 px-2 rounded-sm"
          />
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