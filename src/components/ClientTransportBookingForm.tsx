"use client";

import { Search } from "lucide-react";

const ratings = [1, 2, 3, 4, 5];

export default function ClientTransportBookingForm({ 
  formData, 
  onFormDataChange, 
  onClear 
}: any) {
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    onFormDataChange({ [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Client form submitted with:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 p-3 sm:p-6 sm:gap-3 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col py-1">
          <label htmlFor="client_first_name" className="text-[10px]">
            Client First Name
          </label>
          <input
            type="text"
            placeholder="Enter Client First Name"
            value={formData?.client_first_name || ""}
            onChange={(e) => handleInputChange("client_first_name", e.target.value)}
            className="border border-gray-300 py-1 px-2 outline-none rounded-sm w-full text-[10px]"
          />
        </div>

        <div className="flex flex-col py-1">
          <label htmlFor="client_last_name" className="text-[10px]">
            Client Last Name
          </label>
          <input
            type="text"
            placeholder="Enter Client Last Name"
            value={formData?.client_last_name || ""}
            onChange={(e) => handleInputChange("client_last_name", e.target.value)}
            className="border border-gray-300 py-1 px-2 outline-none rounded-sm w-full text-[10px]"
          />
        </div>

        <div className="flex flex-col py-1">
          <label htmlFor="client_id" className="text-[10px]">
            Client ID
          </label>
          <input
            type="text"
            placeholder="Enter Client ID"
            value={formData?.client_id || ""}
            onChange={(e) => handleInputChange("client_id", e.target.value)}
            className="border border-gray-300 py-1 px-2 outline-none rounded-sm w-full text-[10px]"
          />
        </div>

        <div className="flex flex-col py-1">
          <label htmlFor="rating" className="text-[10px]">
            Rating
          </label>
          <select
            value={formData?.rating || ""}
            onChange={(e) => handleInputChange("rating", e.target.value)}
            className="border border-gray-300 py-1 px-2 outline-none rounded-sm w-full text-[10px]"
          >
            <option value="">Select Rating</option>
            {ratings.map((r) => (
              <option key={r} value={r.toString()}>
                {`${"★".repeat(r)}${"☆".repeat(5 - r)}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col py-1">
          <label htmlFor="clientMobile" className="text-[10px]">
            Mobile
          </label>
          <div className="relative">
            <input
              type="tel"
              placeholder="Enter Mobile"
              value={formData?.client_mobile_no || ""}
              onChange={(e) => handleInputChange("client_mobile_no", e.target.value)}
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

        <div className="flex flex-col py-1">
          <label htmlFor="clientEmail" className="text-[10px]">
            Client Email
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="Enter Client Email"
              value={formData?.client_email || ""}
              onChange={(e) => handleInputChange("client_email", e.target.value)}
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