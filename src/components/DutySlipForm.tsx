"use client";

import { handleBookingListMutation } from "../hooks/useCommon";
import { Forward, Printer } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";

interface DutySlipProps {
  setOpenInnerModal: React.Dispatch<React.SetStateAction<string>>;
  companyDetails:any
}

export default function DutySlip({ setOpenInnerModal,companyDetails }: DutySlipProps) {
  const { mutate: assignedBookingMutate, data: getAssignedBookingData } =
   handleBookingListMutation();
   
  const hadleAssignBooking = () => {
    assignedBookingMutate({
      id: "2",
      driver_id: "85",
    });
  };

  useEffect(()=>{
    hadleAssignBooking();
  },[])

  const bookingData = getAssignedBookingData?.[0] || {};
  const {
    pickup_date,
    pickup_time,
    pickup_area,
    drop_address,
    driver_name,
    vehicle_no,
    vehicle_name,
    amount,
    booking_amt_paid,
    booking_amt_balance,
    payment_type,
    domain_name,
    gst_no,
    client_name,
    client_mobile
  } = bookingData;

  const formattedDate = pickup_date ? new Date(pickup_date).toLocaleDateString('en-IN') : '..................................';

  return (
    <>
      <h1 className="text-xl mb-3">
        Duty Slip <strong>(BCYF01801)</strong>
      </h1>
      <hr className="border-t border-gray-200" />
      <div
        className="border border-gray-300 my-4 rounded-md bg-white relative"
        id="printable-area2"
      >
        <div className="flex gap-3 justify-between">
          <div className="w-2/5 sm:w-2/8 lg:w-2/7 mx-4 my-4">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={160}
              height={45}
              priority
            />
          </div>
          <div className="flex flex-col items-end pr-3 py-3">
            <span className="text-[12px]">
              <strong>{domain_name || 'Bookingcabs.com'}</strong>
            </span>
            <span className="text-[12px]">
              <strong>29-30 DB Gupta Market Karol</strong>
            </span>
            <span className="text-[12px]">
              <strong>Bagh New Delhi-110005</strong>
            </span>
            <span className="text-[12px]">
              <strong>Delhi-NCR (Delhi)- 110005</strong>
            </span>
            <span className="text-[12px]">
              <strong>M</strong> : {client_mobile || '42424242'}
            </span>
            <span className="text-[12px]">
              <strong>GST No</strong> : {gst_no || '07AAACR0769G2ZE'}
            </span>
          </div>
        </div>
        {/* Booking Info */}
        <div className="grid grid-cols-2 gap-y-2 text-sm mb-6 px-3">
          <div className="text-[12px]">
            No: <span className="underline decoration-dotted">BCYF01801</span>
          </div>
          <div className="text-right text-[12px]">
            Dated: {formattedDate}
          </div>
          <div className="text-[12px]">Duty Type: Rental</div>
          <div className="text-right text-[12px]">
            Vehicle Name: {vehicle_name || 'Comfort Sedan'}
          </div>
          <div className="text-[12px]">Driver's Name: {driver_name || '-'}</div>
          <div className="text-right text-[12px] pr-28">Vehicle No: {vehicle_no || '-'}</div>
          <div className="text-[12px]">
            Name: <strong>{client_name || '-'}</strong>
          </div>
          <div className="col-span-2 text-[12px]">
            Reporting Address: {pickup_area || 'Hotel Gulf, Colaba Causeway, Colaba, Mumbai, Maharashtra, India'}
          </div>
          <div className="col-span-2 text-[12px]">
            Drop Address: {drop_address || 'Hotel Gulf, Colaba Causeway, Colaba, Mumbai, Maharashtra, India'}
          </div>
          <div className="col-span-2 text-[12px]">
            Name of Company: {domain_name || 'Bookingcabs.com'}
          </div>
          <div className="col-span-2 text-[12px]">
            Address:
            ...................................................................................................................................................................................
          </div>
        </div>

        {/* Meter + Time Info */}
        <div className="grid grid-cols-2 gap-y-2 text-sm mb-6 px-3">
          <div className="text-[12px]">
            Closing Meter: <span className="ml-6">0</span>
          </div>
          <div className="text-[12px]">
            Releasing Time: <span className="ml-6">{pickup_time || '00:00:00'}</span>
          </div>
          <div className="text-[12px]">
            Starting Meter: <span className="ml-6">0</span>
          </div>
          <div className="text-[12px]">
            Starting Time: <span className="ml-6">{pickup_time || '00:00:00'}</span>
          </div>
          <div className="text-[12px]">
            Total Kilometer: <span className="ml-6">0</span>
          </div>
          <div className="text-[12px]">
            Total Hrs: <span className="ml-6">00:00:00</span>
          </div>
          <div className="text-[12px]">Advance: {booking_amt_paid || '..............'}</div>
          <div className="text-[12px]">Balance: {booking_amt_balance || '..............'}</div>
        </div>

        {/* Remarks and Booked By */}
        <div className="mb-4">
          <p className="text-[12px] px-3">
            Remarks:
            ...................................................................................................................
          </p>
          <p className="text-right mt-2 text-[12px] px-3">
            Booked By: {client_name || '................................'}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 text-sm px-3">
          <div className="col-span-12">
            <strong>Terms & Conditions</strong>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li className="text-[12px]">
                Time & Kilometer will be charged from Garage to Garage.
              </li>
              <li className="text-[12px]">
                Parking, Toll Tax & State Taxes will be charged extra.
              </li>
              <li className="text-[12px]">
                Please check the meter & time when starting & releasing the
                vehicle.
              </li>
            </ul>
          </div>
          <br />
          <div className="flex flex-col items-end col-span-12 justify-end  text-[12px] whitespace-nowrap">
            Customer Signature:
            <br />
            <br />
            ...............................................................
          </div>
        </div>

        {/* Image Upload/Placeholder Sections */}
        <div className="mt-10 grid grid-cols-1 gap-6 text-sm p-3">
          <div className="text-[12px]">Starting Meter Image</div>
          <div className="text-[12px]">Closing Meter Image</div>
          <div className="text-[12px]">Parking Image</div>
          <div className="text-[12px]">Toll Image</div>
          <div className="text-[12px]">Extra Image</div>
          <div className="text-[12px]">Client Image</div>
        </div>
      </div>

      <div className="flex items-center gap-2 py-2 no-print" id="no-print-btns">
        <button
          onClick={() => window.print()}
          className="px-3 cursor-pointer flex items-center gap-1 bg-[#1E2939] text-white border text-sm py-2 rounded-sm no-print"
        >
          <Printer className="w-4 h-4" /> Print
        </button>
        <button
          onClick={() => setOpenInnerModal("share_duty_slip")}
          className="px-3 cursor-pointer flex items-center gap-1 bg-[#1E2939] text-white border text-sm py-2 rounded-sm no-print"
        >
          <Forward className="w-4 h-4" /> Share
        </button>
        <button className="px-3 cursor-pointer flex items-center gap-1 bg-[#1E2939] text-white border text-sm py-2 rounded-sm no-print">
          <Forward className="w-4 h-4" /> Generate PDF
        </button>
      </div>
    </>
  );
}
