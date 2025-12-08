import { useGetCompanyDetail } from "@/hooks/useCommon";
import { useAuth } from "@/store/auth";
import { useSelectedVehicle } from "@/store/common";
import { CheckCircle } from "lucide-react";
import React, { useState, useEffect } from "react";

interface Traveller {
  id: number;
  first_name: string;
  last_name: string;
  nationality: string;
  gender: string;
  day: string;
  month: string;
  year: string;
  date_of_birth: string;
  age: string;
  mobile: string;
  id_proof: string;
  id_proof_type?: string;
  documentFile?: File | null;
  placcard_name?: string;
  agent_reference?: string;
  booked_by_name?: string;
  booked_by_contact?: string;
  gst_company_name?: string;
  gst_no?: string;
}

const TravellerForm = () => {
  const { booking, setBooking } = useSelectedVehicle();
  const [travellers, setTravellers] = useState<Traveller[]>([]);
  const { user } = useAuth();
  const [bookForOthers, setBookForOthers] = useState(false);
  const [companyGST, setCompanyGST] = useState(true);
      const { data: company } = useGetCompanyDetail();

  console.log({ user });
  console.log("booking in traveller form:", booking);

  // Initialize travellers array based on number of adults
  useEffect(() => {
    if (booking?.adults && travellers.length === 0) {
      console.log("Initializing travellers for adults:", booking.adults);
      const initialTravellers: Traveller[] = Array.from(
        { length: Number(booking.adults) },
        (_, index) => ({
          id: index + 1,
          first_name: index === 0 ? user?.first_name || "" : "",
          last_name: index === 0 ? user?.last_name || "" : "",
          nationality: index === 0 ? "Indian" : "",
          gender: "",
          day: "",
          month: "",
          year: "",
          date_of_birth: "",
          age: "",
          mobile: index === 0 ? user?.mobile || "" : "",
          id_proof: "",
          documentFile: null,
          placcard_name: index === 0 ? user?.first_name || "" : "",
          agent_reference: "",
          booked_by_name: "",
          booked_by_contact: "",
          gst_company_name: "",
          gst_no: "",
        })
      );
      console.log("Setting initial travellers:", initialTravellers);
      setTravellers(initialTravellers);
    }
  }, [booking?.adults, user?.first_name, user?.last_name, user?.mobile]);

  // Update a specific traveller's field
  const updateTraveller = (
    index: number,
    field: keyof Traveller,
    value: string | File | null
  ) => {
    console.log(index, field, value);
    setTravellers((prev) =>
      prev.map((traveller, i) =>
        i === index ? { ...traveller, [field]: value } : traveller
      )
    );
  };
  useEffect(() => {
    if(companyGST && company){
      updateTraveller(0,"gst_company_name", company.company_name || "");
      updateTraveller(0,"gst_no", company.service_tax_gst || "");
    }else{
      updateTraveller(0,"gst_company_name", "");
      updateTraveller(0,"gst_no", "");
    }
  }, [companyGST,company]);
  // Handle file upload
  const handleFileUpload = (index: number, file: File | null) => {
    updateTraveller(index, "documentFile", file);
  };
  const [verified, setVerified] = useState(false);

  // Calculate age based on date of birth
  const calculateAge = (day: string, month: string, year: string): string => {
    if (!day || !month || !year) return "";

    const birthDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust age if birthday hasn't occurred this year
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age.toString();
  };

  // Format date as YYYY-MM-DD
  const formatDateOfBirth = (
    day: string,
    month: string,
    year: string
  ): string => {
    if (!day || !month || !year) return "";

    const formattedMonth = month.padStart(2, "0");
    const formattedDay = day.padStart(2, "0");
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  // Auto-update age and date_of_birth when date changes
  useEffect(() => {
    if (travellers.length === 0) return;

    const updatedTravellers = travellers.map((traveller) => {
      if (traveller.day && traveller.month && traveller.year) {
        const calculatedAge = calculateAge(
          traveller.day,
          traveller.month,
          traveller.year
        );
        const dateOfBirth = formatDateOfBirth(
          traveller.day,
          traveller.month,
          traveller.year
        );
        return {
          ...traveller,
          age: calculatedAge,
          date_of_birth: dateOfBirth,
        };
      }
      return traveller;
    });

    // Only update if something actually changed
    const hasChanges = updatedTravellers.some(
      (traveller, index) =>
        traveller.age !== travellers[index]?.age ||
        traveller.date_of_birth !== travellers[index]?.date_of_birth
    );

    if (hasChanges) {
      setTravellers(updatedTravellers);
    }
  }, [travellers.map((t) => `${t.day}-${t.month}-${t.year}`).join(";")]);

  // Update booking with traveller details
  useEffect(() => {
    console.log("All travellers:", travellers);
    console.log("Travellers length:", travellers.length);
    setBooking({ ...booking, travellerDetails: travellers });
  }, [travellers]);

  useEffect(() => {
    console.log("Updated booking with travellers:", booking);
  }, [booking]);

  // Handle book for others checkbox change
  const handleBookForOthersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookForOthers(e.target.checked);
    if (!e.target.checked && user) {
      // Reset first traveller details to user info
      setTravellers(prev => prev.map((traveller, index) => 
        index === 0 ? {
          ...traveller,
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          mobile: user.mobile || "",
          placcard_name: user.first_name || ""
        } : traveller
      ));
    }
  };

  // Show loading only if we have booking but no travellers initialized yet
  if (!booking?.adults || travellers.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">
          {!booking?.adults
            ? "Loading booking information..."
            : "Initializing traveller forms..."}
        </div>
      </div>
    );
  }

  console.log({ travellers });

  return (
    <div className="w-full">
      <h1 className="text-[14px] font-semibold my-3">Traveller Details</h1>

      <div className="border border-gray-300 rounded-md p-3 relative">
        {/* Book for Others Checkbox */}
        <div className="book-for-others-select absolute top-[10px] left-[10px] flex items-center gap-2 col-span-1">
          <input
            type="checkbox"
            id="book-for-others"
            checked={bookForOthers}
            onChange={handleBookForOthersChange}
          />
          <label htmlFor="book-for-others" className="text-[12px]">
            Book For Others
          </label>
        </div>

        {/* Plac Card Name for first traveller */}
        <div className="first-name-input flex items-end absolute right-[10px] top-[10px] justify-end gap-2 mt-5 md:mt-0 lg:w-[50%]">
          <label
            className="text-sm whitespace-nowrap text-[12px]"
            htmlFor="placcard-name"
          >
            Plac Card Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={travellers[0]?.placcard_name || ""}
            onChange={(e) => updateTraveller(0, "placcard_name", e.target.value)}
            placeholder="Enter Plac Card Name"
            className="w-full border-b border-gray-300 outline-none focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px] py-1 px-2"
          />
        </div>

        <div className="mt-14 md:mt-6 space-y-6">
          {/* Main Traveller (Index 0) */}
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
              Primary Traveller
            </h3>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={travellers[0]?.first_name || ""}
                  onChange={(e) => updateTraveller(0, "first_name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={travellers[0]?.last_name || ""}
                  onChange={(e) => updateTraveller(0, "last_name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={travellers[0]?.mobile || ""}
                  onChange={(e) => updateTraveller(0, "mobile", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                  placeholder="Enter mobile number"
                />
              </div>
            </div>

            {/* Nationality and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-2">
                  Nationality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={travellers[0]?.nationality || ""}
                  onChange={(e) => updateTraveller(0, "nationality", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                  placeholder="Enter nationality"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={travellers[0]?.gender || ""}
                  onChange={(e) => updateTraveller(0, "gender", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                >
                  <option value="">--Select Gender--</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-2">
                  Date of Birth (Formatted)
                </label>
                <input
                  type="text"
                  value={travellers[0]?.date_of_birth || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none text-[12px]"
                  readOnly
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>

            {/* Date of Birth and Age */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-3">
                <label className="block text-[12px] font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={travellers[0]?.day || ""}
                      onChange={(e) => updateTraveller(0, "day", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                      placeholder="DD"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={travellers[0]?.month || ""}
                      onChange={(e) => updateTraveller(0, "month", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                      placeholder="MM"
                    />
                  </div>
                  <div>
                    <select
                      value={travellers[0]?.year || ""}
                      onChange={(e) => updateTraveller(0, "year", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                    >
                      <option value="">YYYY</option>
                      {Array.from({ length: 70 }, (_, i) => 2025 - i).map(
                        (year) => (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="text"
                  value={travellers[0]?.age || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none text-[12px]"
                  readOnly
                />
              </div>
            </div>

            {/* ID Proof and Document Upload */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-2">
                  Select ID Proof <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-[10px] block mt-1 font-normal">
                    (e.g., passport, national ID, driver's license)
                  </span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                  value={travellers[0]?.id_proof_type || ""}
                  onChange={(e) => updateTraveller(0, "id_proof_type", e.target.value)}
                >
                  <option value="">Select ID Proof Type</option>
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID</option>
                  <option value="drivers_license">Driver's License</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-2">
                  ID Proof Number <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-[10px] block mt-1 font-normal">
                    (e.g., passport, national ID, driver's license)
                  </span>
                </label>
                <input
                  type="text"
                  value={travellers[0]?.id_proof || ""}
                  onChange={(e) => updateTraveller(0, "id_proof", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                  placeholder="Enter ID proof number"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-2">
                  Upload Document <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-[10px] block mt-1 font-normal">
                    (Max 5MB, PDF, JPG, PNG)
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileUpload(0, e.target.files?.[0] || null)
                    }
                    className="hidden"
                    id={`document-upload-0`}
                  />
                  <label
                    htmlFor={`document-upload-0`}
                    className="flex-1 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all text-center text-[12px]"
                  >
                    <span className="text-[12px] text-gray-600">
                      {travellers[0]?.documentFile
                        ? travellers[0].documentFile.name
                        : "Choose file..."}
                    </span>
                  </label>
                  {travellers[0]?.documentFile && (
                    <button
                      type="button"
                      onClick={() => handleFileUpload(0, null)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all text-[12px]"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>


            {/* File preview for images */}
            {travellers[0]?.documentFile &&
              travellers[0].documentFile.type.startsWith("image/") && (
                <div className="mt-4">
                  <label className="block text-[12px] font-medium text-gray-700 mb-2">
                    Document Preview
                  </label>
                  <div className="max-w-xs border border-gray-200 rounded-lg p-2">
                    <img
                      src={URL.createObjectURL(travellers[0].documentFile)}
                      alt="Document preview"
                      className="w-full h-auto rounded"
                    />
                  </div>
                </div>
              )}
          </div>

          {/* Additional Travellers */}
          {travellers.length > 1 && travellers.slice(1).map((traveller, index) => (
            <div
              key={traveller.id}
              className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm"
            >
              <h3 className="text-base font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-100">
                Traveller {index + 2}
              </h3>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={traveller.first_name}
                    onChange={(e) =>
                      updateTraveller(index + 1, "first_name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={traveller.last_name}
                    onChange={(e) =>
                      updateTraveller(index + 1, "last_name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={traveller.mobile}
                    onChange={(e) =>
                      updateTraveller(index + 1, "mobile", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              {/* Nationality and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-2">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={traveller.nationality}
                    onChange={(e) =>
                      updateTraveller(index + 1, "nationality", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                    placeholder="Enter nationality"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={traveller.gender}
                    onChange={(e) =>
                      updateTraveller(index + 1, "gender", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                  >
                    <option value="">--Select Gender--</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-2">
                    Date of Birth (Formatted)
                  </label>
                  <input
                    type="text"
                    value={traveller.date_of_birth}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none text-[12px]"
                    readOnly
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>

              {/* Date of Birth and Age */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-3">
                  <label className="block text-[12px] font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={traveller.day}
                        onChange={(e) =>
                          updateTraveller(index + 1, "day", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                        placeholder="DD"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={traveller.month}
                        onChange={(e) =>
                          updateTraveller(index + 1, "month", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                        placeholder="MM"
                      />
                    </div>
                    <div>
                      <select
                        value={traveller.year}
                        onChange={(e) =>
                          updateTraveller(index + 1, "year", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                      >
                        <option value="">YYYY</option>
                        {Array.from({ length: 70 }, (_, i) => 2025 - i).map(
                          (year) => (
                            <option key={year} value={year.toString()}>
                              {year}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="text"
                    value={traveller.age}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none text-[12px]"
                    readOnly
                  />
                </div>
              </div>

              {/* ID Proof and Document Upload */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-2">
                    Select ID Proof <span className="text-red-500">*</span>
                    <span className="text-gray-500 text-[10px] block mt-1 font-normal">
                      (e.g., passport, national ID, driver's license)
                    </span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                    value={traveller.id_proof_type || ""}
                    onChange={(e) =>
                      updateTraveller(index + 1, "id_proof_type", e.target.value)
                    }
                  >
                    <option value="">Select ID Proof Type</option>
                    <option value="passport">Passport</option>
                    <option value="national_id">National ID</option>
                    <option value="drivers_license">Driver's License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-2">
                    ID Proof Number <span className="text-red-500">*</span>
                    <span className="text-gray-500 text-[10px] block mt-1 font-normal">
                      (e.g., passport, national ID, driver's license)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={traveller.id_proof}
                    onChange={(e) =>
                      updateTraveller(index + 1, "id_proof", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[12px]"
                    placeholder="Enter ID proof number"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-2">
                    Upload Document <span className="text-red-500">*</span>
                    <span className="text-gray-500 text-[10px] block mt-1 font-normal">
                      (Max 5MB, PDF, JPG, PNG)
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileUpload(index + 1, e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id={`document-upload-${index + 1}`}
                    />
                    <label
                      htmlFor={`document-upload-${index + 1}`}
                      className="flex-1 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all text-center text-[12px]"
                    >
                      <span className="text-[12px] text-gray-600">
                        {traveller.documentFile
                          ? traveller.documentFile.name
                          : "Choose file..."}
                      </span>
                    </label>
                    {traveller.documentFile && (
                      <button
                        type="button"
                        onClick={() => handleFileUpload(index + 1, null)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all text-[12px]"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* File preview for images */}
              {traveller.documentFile &&
                traveller.documentFile.type.startsWith("image/") && (
                  <div className="mt-4">
                    <label className="block text-[12px] font-medium text-gray-700 mb-2">
                      Document Preview
                    </label>
                    <div className="max-w-xs border border-gray-200 rounded-lg p-2">
                      <img
                        src={URL.createObjectURL(traveller.documentFile)}
                        alt="Document preview"
                        className="w-full h-auto rounded"
                      />
                    </div>
                  </div>
                )}
            </div>
          ))}
          <div               className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm"
>
                        {/* Additional Fields for Primary Traveller */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="agent-reference-input flex flex-col gap-1">
                <label className="text-[12px]" htmlFor="agent-reference">
                  Agent Reference
                </label>
                <input
                  type="text"
                  value={travellers[0]?.agent_reference || ""}
                  onChange={(e) => updateTraveller(0, "agent_reference", e.target.value)}
                  placeholder="Enter Agent Reference"
                  className="border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
                />
              </div>

              <div className="booked-by-name-input flex flex-col gap-1">
                <label className="text-[12px]" htmlFor="booked_by_name">
                  Booked By (Name)
                </label>
                <input
                  type="text"
                  value={travellers[0]?.booked_by_name || ""}
                  onChange={(e) => updateTraveller(0, "booked_by_name", e.target.value)}
                  placeholder="Booked By(Name)"
                  className="border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
                />
              </div>

              <div className="booked-by-contact-input flex flex-col gap-1">
                <label className="text-[12px]" htmlFor="booked_by_contact">
                  Booked By (Contact)
                </label>
                <input
                  type="text"
                  value={travellers[0]?.booked_by_contact || ""}
                  onChange={(e) => updateTraveller(0, "booked_by_contact", e.target.value)}
                  placeholder="Booked By(Email/mobile)"
                  className="border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
                />
              </div>
            </div>

            {/* Company GST Section for Primary Traveller */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center gap-3 col-span-1 mb-4">
                <label htmlFor="company-gst-toggle" className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="company-gst-toggle"
                      className="sr-only"
                      checked={companyGST}
                      onChange={(e) => setCompanyGST(e.target.checked)}
                    />
                    <div className={`block w-10 h-5 rounded-full transition 
                        ${companyGST ? "bg-indigo-600" : "bg-gray-300"}`}>
                    </div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition 
                        ${companyGST ? "translate-x-5" : ""}`}
                    ></div>
                  </div>
                  <span className="text-[12px]">
                    {companyGST ? "Company's GST" : "Traveller's GST"}
                  </span>
                </label>
              </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="gst-company-name-input flex flex-col gap-1">
    <label className="text-[12px]" htmlFor="gst_company_name">
      Company Name
    </label>
    <input
      type="text"
      value={travellers[0]?.gst_company_name || ""}
      onChange={(e) => updateTraveller(0, "gst_company_name", e.target.value)}
      placeholder="Company Name"
      className="w-full border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
    />
  </div>
  
  <div className="gst-no-input flex flex-col gap-1">
    <label className="text-[12px]" htmlFor="gst_no">
      GST No.
    </label>
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={travellers[0]?.gst_no || ""}
        onChange={(e) => updateTraveller(0, "gst_no", e.target.value)}
        placeholder="GST No."
        className="flex-1 border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
      />
      {verified === false ? (
        <button
          onClick={() => setVerified(true)}
          type="button"
          className="bg-[#dfad08] text-xs px-3 py-1 rounded cursor-pointer hover:bg-[#9d7a20] transition whitespace-nowrap"
        >
          Verify
        </button>
      ) : (
        <CheckCircle className="text-green-700 cursor-auto flex-shrink-0" size={20} />
      )}
    </div>
  </div>
</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TravellerForm;