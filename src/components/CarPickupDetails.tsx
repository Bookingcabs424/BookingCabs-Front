"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Check } from "lucide-react";
import { useBookingSearchForm, useSelectedVehicle } from "../store/common";

interface CarPickupDetailsProps {
  isEdit?: boolean;
}

export default function CarPickupDetails({ isEdit = true }: CarPickupDetailsProps) {
  const [editJourneyDetails, setEditJourneyDetails] = useState(false);
  const { form } = useBookingSearchForm();
  const { booking } = useSelectedVehicle();
  

  const [editableFields, setEditableFields] = useState({
    pickupAddress: booking?.booking_address || form?.pickup_address || "",
    pickupDate: booking?.start_date || form?.pickup_date || "",
    pickupTime: booking?.start_time || form?.pickup_time || "",
    dropAddress: form?.drop_adress || booking?.booking_address || form?.pickup_address || "",
    package: booking?.local_pkg_name || "Outstation (Roundtrip)",
    end_date: booking?.end_date  || "",
  });

  useEffect(() => {
    if (booking) {
      setEditableFields(prev => ({
        ...prev,
        pickupAddress: booking.booking_address || prev.pickupAddress,
        pickupDate: booking.start_date || prev.pickupDate,
        pickupTime: booking.start_time || prev.pickupTime,
        package: booking.local_pkg_name || prev.package,
        end_date: booking.end_date||prev.end_date ,
      }));
    }
  }, [booking]);

  const handleFieldChange = (field: keyof typeof editableFields, value: string) => {
    setEditableFields(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveJourneyDetails = () => {
    // Here you would typically save the changes to your state or API
    setEditJourneyDetails(false);
  };

  // Calculate luggage count
  const luggageCount = Number(form?.small_luggage || 0) + Number(form?.big_luggage || 0);

  return (
    <>
      <div className="w-2/5 sm:w-2/8 lg:w-2/7">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={160}
          height={45}
          priority
        />
      </div>
      
      {/* {booking?.cancellation_fare_rule?.length ? (
        <h1 className="text-center my-3 text-[12px] sm:text-sm">
          <strong>Last Cancellation Date</strong>: {booking.end_date} {booking.start_time}
        </h1>
      ) : null} */}

      <h1 className="text-[14px] font-semibold mb-2">Car & Pickup Details</h1>
      
      <div className="w-full overflow-x-auto mt-3">
        <table className="min-w-full border border-gray-300 border-b-none text-[12px] text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 sm:px-4 sm:py-2">S.No</th>
              <th className="border border-gray-300 p-2 sm:px-4 sm:py-2">Details</th>
              <th className="border border-gray-300 p-2 sm:px-4 sm:py-2">Adult</th>
              <th className="border border-gray-300 p-2 sm:px-4 sm:py-2">Child</th>
              <th className="border border-gray-300 p-2 sm:px-4 sm:py-2">Luggage</th>
              {isEdit && (
                <th className="border border-gray-300 p-2 sm:px-4 sm:py-2">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr className="even:bg-gray-50 text-[12px]">
              <td className="border border-gray-300 p-2 sm:px-4 sm:py-2">01</td>
              <td className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                {booking?.vehicle_type || "N/A"}
              </td>
              <td className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                {form?.adults || booking?.adults || 1}
              </td>
              <td className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                {form?.children || booking?.childs || 0}
              </td>
              <td className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                {luggageCount || booking?.luggages || 0}
              </td>
              {isEdit && (
                <td className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                  <button
                    className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => setEditJourneyDetails(true)}
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="w-full relative border border-gray-300 px-5 py-4 flex mb-3 rounded-md">
  <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* Left column */}
    <div className="grid gap-2">
      {/* Pickup Address */}
      <div className="grid grid-cols-[140px_1fr] items-center">
        <span className="text-[12px] font-semibold">Pickup Address:</span>
        {editJourneyDetails ? (
          <input
            type="text"
            value={editableFields.pickupAddress}
            onChange={(e) => handleFieldChange("pickupAddress", e.target.value)}
            className="text-[12px] py-[1px] border-b border-gray-300 outline-none px-1"
          />
        ) : (
          <span className="text-[12px]">{editableFields.pickupAddress}</span>
        )}
      </div>

      {/* Pickup Date */}
      <div className="grid grid-cols-[140px_1fr] items-center">
        <span className="text-[12px] font-semibold">Pickup Date:</span>
        {editJourneyDetails ? (
          <input
            type="date"
            value={editableFields.pickupDate}
            onChange={(e) => handleFieldChange("pickupDate", e.target.value)}
            className="text-[12px] py-[1px] border-b border-gray-300 outline-none px-1"
          />
        ) : (
          <span className="text-[12px]">{editableFields.pickupDate}</span>
        )}
      </div>

      {/* Pickup Time */}
      <div className="grid grid-cols-[140px_1fr] items-center">
        <span className="text-[12px] font-semibold">Pickup Time:</span>
        {editJourneyDetails ? (
          <input
            type="time"
            value={editableFields.pickupTime}
            onChange={(e) => handleFieldChange("pickupTime", e.target.value)}
            className="text-[12px] py-[1px] border-b border-gray-300 outline-none px-1"
          />
        ) : (
          <span className="text-[12px]">{editableFields.pickupTime}</span>
        )}
      </div>
   

      {/* Package */}
      <div className="grid grid-cols-[140px_1fr] items-center">
        <span className="text-[12px] font-semibold">Package:</span>
        {editJourneyDetails ? (
          <input
            type="text"
            value={editableFields.package}
            onChange={(e) => handleFieldChange("package", e.target.value)}
            className="text-[12px] py-[1px] border-b border-gray-300 outline-none px-1"
          />
        ) : (
          <span className="text-[12px]">{editableFields.package}</span>
        )}
      </div>

      {/* End Date */}
      <div className="grid grid-cols-[140px_1fr] items-center">
        <span className="text-[12px] font-semibold">End Date:</span>
        <span className="text-[12px]">{booking?.end_date || editableFields.pickupDate}</span>
      </div>
    </div>

    {/* Right column */}
    <div className="grid gap-2">
      {/* Drop Address */}
      <div className="grid grid-cols-[140px_1fr] items-center">
        <span className="text-[12px] font-semibold">Drop Address:</span>
        {editJourneyDetails ? (
          <input
            type="text"
            value={editableFields.dropAddress}
            onChange={(e) => handleFieldChange("dropAddress", e.target.value)}
            className="text-[12px] py-[1px] border-b border-gray-300 outline-none px-1"
          />
        ) : (
          <span className="text-[12px]">{editableFields.dropAddress}</span>
        )}
      </div>

      {/* Expected Time */}
      <div className="grid grid-cols-[140px_1fr] items-center">
        <span className="text-[12px] font-semibold">Expected Time:</span>
        <span className="text-[12px]">{booking?.estimated_time || 0} Hrs</span>
      </div>

      {/* Expected Distance */}
      <div className="grid grid-cols-[140px_1fr] items-center">
        <span className="text-[12px] font-semibold">Expected Distance:</span>
        <span className="text-[12px]">{booking?.estimated_distance || 0} Km</span>
      </div>

      {/* Per Km Charge */}
      {booking?.per_km_charge && (
        <div className="grid grid-cols-[140px_1fr] items-center">
          <span className="text-[12px] font-semibold">Per Km Charge:</span>
          <span className="text-[12px]">₹{booking.per_km_charge}</span>
        </div>
      )}
    </div>
  </div>

  {isEdit && (
    <button
      className="absolute bottom-[10px] right-[10px] p-[5px] bg-[#dfad08] cursor-pointer rounded-full flex items-center justify-center"
      title={editJourneyDetails ? "Save" : "Edit"}
      onClick={editJourneyDetails ? handleSaveJourneyDetails : () => setEditJourneyDetails(true)}
    >
      {editJourneyDetails ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
    </button>
  )}
</div>

    </>
  );
}