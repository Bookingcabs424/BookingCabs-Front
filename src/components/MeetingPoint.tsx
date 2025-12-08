"use client";
import { useBookingSearchForm, useSelectedVehicle } from "../store/common";
import { useState } from "react";

export default function MeetingPoint() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { booking } = useSelectedVehicle();
  const { form } = useBookingSearchForm();

  const rules = [
    {
      title: "Inclusions",
      points: [
        `${booking?.total_travel_days || 1} Days trip Rental for ${
          form?.city || booking?.pickup_city || "your destination"
        } By ${booking?.no_of_vehicles || 1} ${
          booking?.vehicle_type || "vehicle"
        }`,
        `Distance Package ${
          booking?.local_pkg_name || "as per itinerary"
        } for the exact Itinerary listed above`,
        "No Route Deviation allowed Unless Listed in Itinerary",
        `Driver Allowance ₹${
          booking?.night_rate_value || 0
        } (Night Charges) Applicable for the Vehicle`,
        `GST (${booking?.tax_percentage || 0}%) included`,
      ],
    },
    {
      title: "Exclusions",
      points: [
        "Toll Taxes (As Per Actual)",
        "Parking (As Per Actual)",
        "Night Pickup Allowance excluded",
        "Night Drop off Allowance excluded",
        `Peak Charges & Waiting Charges as per Tariff (₹${
          booking?.per_hr_charge || 0
        }/hr)`,
      ],
    },
    {
      title: "Fare Rules",
      points: [
        `${booking?.travel_days || 1} Days trip Rental for ${
          form?.city || booking?.pickup_city || "your destination"
        }`,
        `Approx Distance ${
          form?.master_package_id === 1
            ? booking?.local_pkg_name
            : `${booking?.estimated_distance || 0} km`
        }`,
        `Minimum Charged ₹${booking?.base_fare || 0} (As per Min Distance)`,
        `Per Km Rates ₹${booking?.per_km_charge || 0}`,
        `Per Hour Rates ₹${booking?.per_hr_charge || 0}`,
        `Night Charges (${booking?.night_rate_begins || "20:00"} to ${
          booking?.night_rate_ends || "05:00"
        }) ₹${booking?.night_rate_value || 0}`,
      ],
    },
  ];

  const extraChargesText = `Extra Charges: Distance - If you use Vehicle more than the Estimated Km (${
    booking?.local_pkg_name || "4Hrs - 40km"
  }), ₹${booking?.per_km_charge || 15} Per Extra Km Rates & ₹${
    booking?.per_hr_charge || 175
  } Per Extra Hrs will be Charged.`;

  const nightChargesText = `Time - If you drop the Vehicle after ${
    booking?.night_rate_begins || "21:00"
  } Hrs, extra Driver Allowance (₹${
    booking?.night_rate_value || 0
  }) will be Applicable`;

  return (
    <div className="flex items-center justify-between">
      <div className="w-full border border-gray-300 rounded-md py-3 px-6">
        <h1 className="text-[14px] font-semibold mt-3">
          Meeting Point <span className="text-red-500">*</span>
        </h1>
        <h2 className="text-[12px] text-gray-600">
          {booking?.booking_address || "New Delhi, India"}
        </h2>
        <hr className="border-t border-gray-300 my-2" />

        <h3 className="text-[12px] font-semibold">Inclusions & Exclusions</h3>
 
        {rules.map((rule, index) => (
          <div key={index} className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer text-[10px]"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <h4 className="text-[12px] font-semibold mb-1">{rule.title}</h4>
            </div>
            {(openIndex === index || openIndex === null) && (
              <ul className="list-disc list-inside text-sm space-y-1 text-[10px]">
                {rule.points.map((item, i) => (
                  <li className="text-[12px]" key={i}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="mb-3">
          <p className="text-[12px]">
            <strong>{extraChargesText}</strong>
          </p>
          <p className="text-[12px] mt-1">{nightChargesText}</p>
        </div>

        <h4 className="text-sm font-semibold mb-1 my-3">Note:</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li className="text-[12px]">
            One Day Means One Calendar day from Midnight (12:00:00 Midnight to
            23:59:00 Midnight).
          </li>
          <li className="text-[12px]">
            Kilometers (Km) and Hours will be Calculated from Garage to Garage
            or Specified Location
          </li>
          <li className="text-[12px]">
            Air Conditioning will be switched off in Hill Areas
          </li>
          <li className="text-[12px]">
            If Driver Drives Vehicle between{" "}
            {booking?.night_rate_begins || "20:00"} to{" "}
            {booking?.night_rate_ends || "05:00"}, Driver Allowance/Night
            Charges (₹{booking?.night_rate_value || 0}) will be Applicable
          </li>
          {booking?.cancellation_fare_rule?.map((rule: any, index: any) => (
            <div key={index} className="p-2 border-b">
              <h3 className="font-bold">{rule.rule_name}</h3>
              <p>{rule.rule_description}</p>
            </div>
          ))}
        </ul>

        {booking?.remark && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="text-sm font-semibold">Special Remarks:</h4>
            <p className="text-[12px]">{booking.remark}</p>
          </div>
        )}
      </div>
    </div>
  );
}
