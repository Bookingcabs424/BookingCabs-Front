"use client";

import { Search } from "lucide-react";

// Remove local state and useForm, use the passed props instead
export default function GeneralQuotationForm({ 
  formData, 
  onFormDataChange, 
  onClear 
}: any) {
  const bookingTypes = [
    { value: "1", label: "Rental" },
    { value: "2", label: "City Taxi" },
    { value: "3", label: "Airport Transfer" },
    { value: "4", label: "Outstation" },
    { value: "5", label: "One Way" },
    { value: "6", label: "Activity" },
    { value: "7", label: "Transport Package" },
  ];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    onFormDataChange({ [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Data is already in parent component, no need to do anything
    console.log("Form submitted with:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 p-3 sm:p-6 gap-3 lg:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col py-1">
          <label htmlFor="Id" className="text-[12px]">
            Quotation ID
          </label>
          <input
            type="text"
            placeholder="Enter Quotation ID"
            value={formData.id || ""}
            onChange={(e) => handleInputChange("id", e.target.value)}
            className="border border-gray-300 py-1 px-2 outline-none rounded-sm w-full text-[10px]"
          />
        </div>

        <div className="flex flex-col py-1">
          <label htmlFor="bookingType" className="text-[12px]">
            Booking Type
          </label>
          <select
            value={formData.booking_type || ""}
            onChange={(e) => handleInputChange("booking_type", e.target.value)}
            className="border border-gray-300 py-1 px-2 outline-none rounded-sm w-full text-[10px]"
          >
            <option value="">Select Booking Type</option>
            {bookingTypes.map(({ value, label }) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col py-1">
          <label htmlFor="initialRequestData" className="text-[12px]">
            Initial Request Data
          </label>
          <div className="grid grid-cols-2 items-center gap-1">
            <input
              type="date"
              value={formData.date_since || ""}
              onChange={(e) => handleInputChange("date_since", e.target.value)}
              className="border border-gray-300 py-1 px-2 outline-none rounded-sm w-full text-[10px]"
            />
            <input
              type="date"
              value={formData.date_to || ""}
              onChange={(e) => handleInputChange("date_to", e.target.value)}
              className="border border-gray-300 py-1 px-2 outline-none rounded-sm w-full text-[10px]"
            />
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
          className="text-[10px] cursor-pointer py-1 px-3 rounded-sm bg-[#00A65A] text-white flex items-center gap-1"
        >
          <Search className="h-3 w-3" /> Search
        </button>
      </div>
    </form>
  );
}