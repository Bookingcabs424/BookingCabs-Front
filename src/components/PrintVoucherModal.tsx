"use client";

import CancellationRule from "../components/CancellationRule";
import Image from "next/image";
import Link from "next/link";
import { Forward, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleBookingListMutation, useGetBookingInfo } from "../hooks/useCommon";


type TravelData = {
  id: string;
  details: string;
  adult: number;
  child: number;
  infant: number;
  luggage: number;
};

const rules = [
  {
    title: "Inclusions",
    points: [
      "1 Days trip Rental for Delhi-NCR By 1 Hatch Back",
      "Distance Package 4Hrs - 40km Km for the exact Itinerary listed above",
      "No Route Deviation allowed Unless Listed in Itinerary",
      "Driver Allowance (Night Charges) Applicable is the Vehicle",
      "GST",
    ],
  },
  {
    title: "Exclusions",
    points: [
      "Toll Taxes ( As Per Actual)",
      "Parking ( As Per Actual)",
      "Night Pickup Allowance excluded",
      "Night Drop off Allowance excluded",
      "Peak Charges & Waiting Charges as per Tariff",
    ],
  },
  {
    title: "Fare Rules",
    points: [
      "1 Days trip Rental for Delhi-NCR By 1 Hatch Back",
      "Approx Distance 4Hrs - 40km ( As Per Quote)",
      "Minimum Charged  ₹ 1000 ( As per Min Distance )",
      "Per Km Rates ₹ 15 ( As Per Per Km Rates )",
      "Per Hour Rates ₹ 175 ( As Per Per Hrs Rates )",
      "Driver Allowance  ( Per Day)",
    ],
  },
];

type PrintVoucherModalProps = {
  bookingDetails: any; 
  companyDetails:any;
};

export default function PrintVoucherModal({ bookingDetails,companyDetails }: PrintVoucherModalProps) {
  const router = useRouter();
  const [data, setData] = useState<TravelData[]>([
    {
      id: "01",
      details: "Hatch Back",
      adult: 1,
      child: 0,
      infant: 0,
      luggage: 0,
    },
  ]);

  const { mutate: assignedBookingMutate, data: bookingData } =
    useGetBookingInfo();
    
  const hadleAssignBooking = () => {
    assignedBookingMutate({
    itinerary_id: bookingDetails?.itineraryId,
      driver_id: bookingDetails?.driver_id,
    });
  };
  
  useEffect(() => {
    hadleAssignBooking();
  }, []);


  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  const company = companyDetails; 
  // Format time for display
  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    return timeString.split('.')[0]; // Remove milliseconds if present
  };


  return (
    <div className="my-2 mx-1 relative" id="printable-area">
      <h1 className="text-xl mb-3">
        Booking <strong>{bookingDetails?.booking_id}</strong>
      </h1>
      <hr className="border-t border-gray-200" />
      
      <div className="border border-gray-300 p-3 rounded-md bg-white relative">
        <div className="w-2/5 sm:w-2/8 lg:w-2/7 mb-4">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={160}
            height={45}
            priority
          />
        </div>
        <p className="text-[12px] py-1">Dear Mr {bookingData?.user_name || 'Guest'},</p>
       <div>
      <p className="text-[12px] py-1">
        Greetings from{" "}
        <strong>{company?.company_name || "Bookingcabs"}</strong>{" "}
        !!
      </p>

      <p className="text-[12px] py-1">
        This is <strong>{company?.contact_person_name || "Neeraj"}</strong> and I will be
        working with you to plan your trip for{" "}
        <strong>{bookingData?.local_pkg_name || "1 Days trip Rental"}</strong>
      </p>

      <p className="text-[12px] py-1">
        Please find below details for your trip and feel free to call me at{" "}
        <Link href={`tel:${company?.landline_no || "8130334242"}`}>
          <strong>{company?.landline_no || "8130334242"}</strong>
        </Link>{" "}
        or click here to view more details about this trip.
      </p>
    </div>
        <table className="mt-4 min-w-full bg-white border border-gray-300 border-b-none text-[12px] text-left max-w-[100%] overflow-x-scroll">
          <thead className="bg-[#C52D2F] text-white">
            <tr>
              <th className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                S.No
              </th>
              <th className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                Details
              </th>
              <th className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                Adult
              </th>
              <th className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                Child
              </th>
              <th className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                Infant
              </th>
              <th className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                Luggage
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row.id} className="even:bg-gray-50">
                <td className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                  {row.id}
                </td>
                <td className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                  {bookingData?.driver_vehicle_type || row.details}
                </td>
                <td className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                  {row.adult}
                </td>
                <td className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                  {row.child}
                </td>
                <td className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                  {row.infant}
                </td>
                <td className="border border-gray-300 p-2 sm:px-4 sm:py-2">
                  {row.luggage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="mt-4 min-w-full bg-white border border-gray-300 text-[12px] text-left">
          <tbody>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2 font-semibold">
                Pickup Date
              </td>
              <td className="border border-gray-300 p-2">
                {(bookingData?.ordertime) || 'N/A'}
              </td>
              <td className="border border-gray-300 p-2 font-semibold">
                Pickup Address
              </td>
              <td className="border border-gray-300 p-2">
                {bookingData?.pickup_area ||bookingData?.departure|| ''}
              </td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2 font-semibold">
                Drop Date
              </td>
              <td className="border border-gray-300 p-2">
                {formatDate(bookingData?.drop_date) || 'N/A'}
              </td>
              <td className="border border-gray-300 p-2 font-semibold">
                Drop Address
              </td>
              <td className="border border-gray-300 p-2">
                {bookingData?.drop_area ||bookingData?.departure|| ''}
              </td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2 font-semibold">
                Pickup Time
              </td>
              <td className="border border-gray-300 p-2">
                {formatTime(bookingData?.booking_time) || 'N/A'}
              </td>
              <td className="border border-gray-300 p-2 font-semibold">
                Package
              </td>
              <td className="border border-gray-300 p-2">
                {bookingData?.local_pkg_name || ''}
              </td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2 font-semibold">
                No of Days / Hrs
              </td>
              <td className="border border-gray-300 p-2">
                1 Days / 10:0:0 Hrs
              </td>
              <td className="border border-gray-300 p-2 font-semibold">
                Expected Distance
              </td>
              <td className="border border-gray-300 p-2">
                {bookingData?.estimated_distance ? `${bookingData.estimated_distance} Km` : ''}
              </td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2 font-semibold">
                Extra Km
              </td>
              <td className="border border-gray-300 p-2">₹ 12.5</td>
              <td className="border border-gray-300 p-2 font-semibold">
                Extra Hr
              </td>
              <td className="border border-gray-300 p-2">₹ 115</td>
            </tr>
          </tbody>
        </table>

        <table className="mt-4 min-w-full bg-white border border-gray-300 text-[12px] text-left">
          <tbody>
            <tr className="bg-gray-100">
              <td colSpan={4} className="p-2 font-semibold text-[13px]">
                Traveller Details
              </td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2 font-semibold">Name</td>
              <td className="border border-gray-300 p-2">
                {bookingData?.user_name || 'Sanjay kumar gupta'}
              </td>
              <td className="border border-gray-300 p-2 font-semibold">
                Nationality
              </td>
              <td className="border border-gray-300 p-2">
                {bookingData?.user_nationality || 'Indian'}
              </td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2 font-semibold">Age</td>
              <td className="border border-gray-300 p-2">40</td>
              <td className="border border-gray-300 p-2 font-semibold">
                ID Proof
              </td>
              <td className="border border-gray-300 p-2"></td>
            </tr>
            <tr className="bg-gray-100">
              <td colSpan={4} className="p-2 font-semibold text-[13px]">
                Contact Details
              </td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2 font-semibold">
                Mobile
              </td>
              <td className="border border-gray-300 p-2">
                {bookingData?.user_mobile || '9818409711'}
              </td>
              <td className="border border-gray-300 p-2 font-semibold">
                Alt Mobile No
              </td>
              <td className="border border-gray-300 p-2">
                {bookingData?.user_alt_mobile || ''}
              </td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2 font-semibold">
                Email
              </td>
              <td className="border border-gray-300 p-2">
                {bookingData?.user_email || 'anshtravelplanner@gmail.com'}
              </td>
              <td className="border border-gray-300 p-2 font-semibold">
                Agent Reference
              </td>
              <td className="border border-gray-300 p-2"></td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2 font-semibold">
                GST No.
              </td>
              <td className="border border-gray-300 p-2">
                {bookingData?.gst_registration_number || ''}
              </td>
              <td className="border border-gray-300 p-2 font-semibold">
                GST Company Name.
              </td>
              <td className="border border-gray-300 p-2"></td>
            </tr>
          </tbody>
        </table>

        <table className="mt-4 min-w-full bg-white border border-gray-300 text-[12px] text-left">
          <thead className="bg-gray-100">
            <tr>
          
              <th className="border border-gray-300 p-2 text-right">
                Total Cost
              </th>
              <th className="border border-gray-300 p-2 text-end">
                {bookingData?.currency || 'Indian Rupee (INR)'} {bookingData?.currency_symbol || '₹'}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="even:bg-gray-50">
         
              <td className="border border-gray-300 p-2 text-right font-semibold">
                Total Package Cost:
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {bookingData?.amount || '2670'}
              </td>
            </tr>
            <tr className="even:bg-gray-50">
      
              <td className="border border-gray-300 p-2 text-right font-semibold">
                Discount Price:
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {bookingData?.discount_price || '0'}
              </td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2 text-right font-semibold">
                Total Tax:
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {bookingData?.total_tax_price || '134'}
              </td>
            </tr>
            <tr className="even:bg-gray-50">
          
              <td className="border border-gray-300 p-2 text-right font-semibold">
                Total (including GST):
              </td>
              <td dangerouslySetInnerHTML={{ __html: `${bookingData?.currency} ${bookingData?.estimateprice_before_discount}` }} className="border border-gray-300 p-2 text-right font-semibold">
              </td>
            </tr>
          </tbody>
        </table>

        <div className="w-full border border-gray-300 rounded-md py-3 px-6">
          <h1 className="text-md font-semibold mt-3">Meeting Point</h1>
          <p className="text-[12px] mt-2">
            Driver: {bookingData?.driver_name || 'Not assigned'} ({bookingData?.driver_mobile || 'N/A'})<br />
            Vehicle: {bookingData?.vehicle_name || 'N/A'} ({bookingData?.vehicle_no || 'N/A'})
          </p>

          <h3 className="text-sm font-semibold mt-2">
            Inclusions & Exclusions
          </h3>

          {rules.map((rule, index) => (
            <div key={index} className="mb-4">
              <h4 className="text-sm font-semibold mb-1">{rule.title}</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {rule.points.map((item, i) => (
                  <li className="text-[12px]" key={i}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div>
            <p className="text-[12px]">
              <strong>Extra Charges</strong> :- Distance :- If you use Vehicle
              more than the Estimated Km (4Hrs - 40km) (₹ 15) Per Extra Km Rates
              & ₹ 175 Per Extra Hrs will be Charged.
            </p>
            <p className="text-[12px]">
              Time :- If you drop the Vehicle after 21:00 Hrs extra Driver
              Allowance will be Applicable
            </p>
          </div>

          <h4 className="text-sm font-semibold mb-1 my-3">Note :-</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li className="text-[12px]">
              One Day Means One Calendar day from Midnight (12:00:00 Midnight to
              23:59:00 Mid Night).
            </li>
            <li className="text-[12px]">
              Kilometers ( Km) and Hours will be Calculated from Garage to
              Garage or Specified
            </li>
            <li className="text-[12px]">
              Air Con will be switch off in Hill Areas
            </li>
            <li className="text-[12px]">
              If Driver Drive Vehicle between to , Driver Allowance / Night
              Charges will be Applicable
            </li>
          </ul>
        </div>

        <CancellationRule />

        <div className="remarks">
          <span className="text-md font-semibold">Remark</span>
        </div>

        <div className="absolute right-0 top-0 flex flex-col items-end pr-3 py-3">
          <span className="text-[12px]">
            <strong>Booking Status</strong> : {bookingData?.status || "N/A"}
          </span>
          <span className="text-[12px]">
            <strong>Itinerary No.</strong> : {(bookingData?.itinerary_id) || 'N/A'}
          </span>
          <span className="text-[12px]">
            <strong>Booking No</strong> : {(bookingData?.booking_transaction_no) || 'N/A'}
          </span>
           <span className="text-[12px]">
            <strong>Booking Date</strong> : {(bookingData?.booking_date) || '14:47:39'}
          </span>
           <span className="text-[12px]">
            <strong>Booking Time</strong> : {formatTime(bookingData?.booking_time) || '14:47:39'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 no-print" id="no-print-btns">
        <button
          onClick={() => window.print()}
          className="px-3 cursor-pointer flex items-center gap-1 bg-[#1E2939] text-white border text-sm py-2 rounded-sm no-print"
        >
          <Printer className="w-4 h-4" /> Print
        </button>
        <button className="px-3 cursor-pointer flex items-center gap-1 bg-[#1E2939] text-white border text-sm py-2 rounded-sm no-print">
          <Forward className="w-4 h-4" /> Share
        </button>
      </div>
    </div>
  );
}
