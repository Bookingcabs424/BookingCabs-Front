import { useCompanydetails } from "../hooks/useCommon";
import { Forward, Printer } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";

interface PlacModalProps {
  openInnerModal: string;
  setOpenInnerModal: React.Dispatch<React.SetStateAction<string>>;
  companyDetailsnew: any;
  bookingDetails:any
}

export default function PlacModal({
  openInnerModal,
  setOpenInnerModal,
  companyDetailsnew,
  bookingDetails
}: PlacModalProps) {
  // Extract company details from props
  const companyData = companyDetailsnew?.companyData?.[0] || {};

  return (
    <div id="printable-area1">
      <h1 className="text-lg mb-3">
        Plac Card <strong>(BCYF01801)</strong>
      </h1>
      <hr className="border-t border-gray-200" />
      <div className="border border-gray-300 my-4 rounded-md bg-white relative">
        <div className="flex flex-col gap-3 justify-between">
          <div className="flex justify-between items-start">
            <div className="w-2/5 sm:w-2/8 lg:w-2/7 mx-4 my-4">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={160}
                height={45}
                priority
              />
            </div>
            
            {/* Company Details Section */}
            <div className="mx-4 my-4 text-right">
              <h2 className="text-xl font-semibold">{companyData.company_name || 'Company Name'}</h2>
              <p className="text-sm">{companyData.brand_name || 'Brand Name'}</p>
              <p className="text-sm">{companyData.company_address || 'Company Address'}</p>
              <p className="text-sm">
                {[companyData.city_name, companyData.state_id, companyData.pincode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <p className="text-sm">{companyData.country_name || 'Country'}</p>
              <p className="text-sm">Contact: {companyData.contact_person_name || 'Contact Person'}</p>
              <p className="text-sm">Email: {companyData.email || 'Email'}</p>
              <p className="text-sm">Phone: {companyData.landline_no || 'Phone'}</p>
              {companyData.website_url && (
                <p className="text-sm">
                  Website: <a href={companyData.website_url} target="_blank" rel="noopener noreferrer">
                    {companyData.website_url}
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div>
              <h1 className="text-4xl py-12 font-semibold">Welcome</h1>
            </div>

            <div>
             <h1 className="text-4xl py-12 font-[500]">
               Flight: ETA: {`${bookingDetails?.flight_number || ""} ${bookingDetails?.flight_time || ""}`}
             </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 no-print" id="no-print-btns">
        <button
          onClick={() => window.print()}
          className="px-3 cursor-pointer flex items-center gap-1 bg-[#1E2939] text-white border text-sm py-2 rounded-sm no-print"
        >
          <Printer className="w-4 h-4" /> Print
        </button>
        <button
          onClick={() => setOpenInnerModal("share_plac_card")}
          className="px-3 cursor-pointer flex items-center gap-1 bg-[#1E2939] text-white border text-sm py-2 rounded-sm no-print"
        >
          <Forward className="w-4 h-4" /> Share
        </button>

        <button className="px-3 cursor-pointer flex items-center gap-1 bg-[#1E2939] text-white border text-sm py-2 rounded-sm no-print">
          <Forward className="w-4 h-4" /> Generate PDF
        </button>
      </div>
    </div>
  );
}
