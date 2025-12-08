"use client";

import { useState } from "react";

// Define the complete form data type
export type QuotationFormData = {
  // General filters
  id?: string;
  vehicleOwner?: string;
  booking_type?: string;
  driverFirstName?: string;
  partner?: string;
  date_since?: string;
  date_to?: string;
  
  // Vehicle filters
  vehicleType?: string;
  vehicleNo?: string;
  
  // Location filters
  state?: string;
  city?: string;
  pickup?: string;
  dropOff?: string;
  
  // Client filters
  clientFirstName?: string;
  clientLastName?: string;
  clientId?: string;
  rating?: string;
  clientMobile?: string;
  clientEmail?: string;
};

// Props for form components
export interface FormComponentProps {
  formData: QuotationFormData;
  onFormDataChange: (newData: Partial<QuotationFormData>) => void;
  onClear: () => void;
}

// Import all form components
import GeneralQuotationForm from "./GeneralQuotationForm" ;
import VehicleQuotationForm from "./VehicleQuotationForm";
import QuotationLocationForm from "./QuotationLocationForm";
import ClientTransportBookingForm from "./ClientTransportBookingForm";

// Define form types
type FormType = "general" | "client" | "vehicle" | "location";

// Define form icons
const formIcons = {
  general: <span className="text-[10px]">📋</span>,
  client: <span className="text-[10px]">👤</span>,
  vehicle: <span className="text-[10px]">🚗</span>,
  location: <span className="text-[10px]">📍</span>,
};

export default function QuotationFilters({mutate}: {mutate: any}) {
  // const { setBookingData } = useBookingStore();
  const [activeForm, setActiveForm] = useState<FormType>("general");
  const [formData, setFormData] = useState<QuotationFormData>({});

  // Handle form data changes from child components
  const handleFormDataChange = (newData: Partial<QuotationFormData>) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);
    // setBookingData(updatedData);
  };

  // Clear specific form section
  const clearFormSection = (section: FormType) => {
    let clearedData = { ...formData };
    
    switch(section) {
      case "general":
        clearedData = {
          ...clearedData,
          id: "",
          vehicleOwner: "",
          booking_type: "",
          driverFirstName: "",
          partner: "",
          date_since: "",
          date_to: "",
        };
        break;
      case "vehicle":
        clearedData = {
          ...clearedData,
          vehicleType: "",
          vehicleNo: "",
        };
        break;
      case "location":
        clearedData = {
          ...clearedData,
          state: "",
          city: "",
          pickup: "",
          dropOff: "",
        };
        break;
      case "client":
        clearedData = {
          ...clearedData,
          clientFirstName: "",
          clientLastName: "",
          clientId: "",
          rating: "",
          clientMobile: "",
          clientEmail: "",
        };
        break;
    }
    
    setFormData(clearedData);
    // setBookingData(clearedData);
  };

  // Clear all filters
  const handleClearAll = () => {
    setFormData({});
    // setBookingData({});
  };
  // Apply all filters
  const handleApplyAll = () => {
    // setBookingData(formData);
    mutate(formData)

    console.log("Applied filters:", formData);
  };

  // Render the active form
  const renderActiveForm = () => {
    const commonProps = {
      formData,
      onFormDataChange: handleFormDataChange,
      onClear: () => clearFormSection(activeForm),
    };

    switch(activeForm) {
      case "general":
        return <GeneralQuotationForm {...commonProps} />;
      case "vehicle":
        return <VehicleQuotationForm {...commonProps} />;
      case "location":
        return <QuotationLocationForm {...commonProps} />;
      case "client":
        return <ClientTransportBookingForm {...commonProps} />;
      default:
        return <GeneralQuotationForm {...commonProps} />;
    }
  };

  return (
    <div className="py-5">
      <div className="transport-booking-form bg-white shadow-md border border-gray-300 mb-3 mt-0 rounded-sm sm:m-8 sm:mb-3 sm:mt-0">
        <h1 className="bg-gray-300 py-2 px-4 flex items-center gap-2 text-[10px] sm:text-sm">
          Quotation Filters
        </h1>
        
        {/* Form selection tabs */}
        <div className="pt-3 px-3 flex gap-1 flex-wrap">
          {(["general", "vehicle", "location", "client"] as FormType[]).map((formType) => (
            <button
              key={formType}
              onClick={() => setActiveForm(formType)}
              className={`text-[10px] cursor-pointer py-2 px-4 rounded-sm border border-[#101828] text-[#101828] flex items-center gap-2 hover:bg-[#101828] hover:text-white ${
                activeForm === formType && "bg-[#101828] text-white"
              }`}
            >
              {formIcons[formType]}
              {formType.charAt(0).toUpperCase() + formType.slice(1)}
            </button>
          ))}
        </div>

        {/* Render the active form */}
        {renderActiveForm()}
      </div>

      {/* Summary of active filters */}
      <div className="bg-white p-4 border border-gray-300 rounded-sm sm:mx-8 mb-3">
        <h3 className="text-xs font-medium mb-2">Active Filters</h3>
        {Object.keys(formData).filter(key => formData[key as keyof QuotationFormData]).length === 0 ? (
          <p className="text-xs text-gray-500">No filters applied</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Object.entries(formData).map(([key, value]) => 
              value && (
                <span 
                  key={key} 
                  className="text-xs bg-gray-100 px-2 py-1 rounded-sm"
                >
                  {key}: {value}
                </span>
              )
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-end sm:mx-8">
        <button
          onClick={handleClearAll}
          className="text-[10px] cursor-pointer py-2 px-4 rounded-sm bg-[#E08E0B] text-white"
        >
          Clear All
        </button>
        <button
          onClick={handleApplyAll}
          className="text-[10px] cursor-pointer py-2 px-4 rounded-sm bg-[#00A65A] text-white"
        >
          Apply All Filters
        </button>
      </div>
    </div>
  );
}