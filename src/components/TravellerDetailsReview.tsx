"use client";
import { useSelectedVehicle } from "../store/common";

interface TravellerDetails {
  firstName?: string;
  lastName?: string;
  gender?: string;
  dob?: string;
  email?: string;
  mobile?: string;
  altMobile?: string;
  nationality?: string;
  gstNo?: string;
  agentReference?: string;
  idProof?: string;
}

export default function TravellerDetailsReview() {
  const { booking } = useSelectedVehicle();
  
  const travellerDetails: TravellerDetails = {
    firstName: booking?.guest_first_name || "Not provided",
    lastName: booking?.guest_last_name || "Not provided",
    gender: booking?.guest_gender || "Not specified",
    email: booking?.guest_email || booking?.email || "Not provided",
    mobile: booking?.guest_mobile || booking?.vendor_mobile || "Not provided",
    altMobile: booking?.guest_alt_mobile || booking?.alt_mobile_number || "Not provided",
    gstNo: booking?.gst_number || "Not provided",
    agentReference: booking?.agent_reference || "Not provided",
    dob: booking.dob || "Not provided", 
    nationality: booking?.nationality ||  "Not provided", 
    idProof: booking.id_proof || "Not provided" 
  };

  return (
    <>
      <h1 className="my-3 font-bold">Traveller Details</h1>
      <div className="grid border border-gray-300 p-3 rounded-md grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Column 1 */}
        <div className="grid grid-rows-4 gap-2">
          <div className="flex gap-2">
            <span className="h-[max-content] text-[13px] font-semibold min-w-[100px]">
              First Name:
            </span>
            <span className="h-[max-content] text-[13px]">
              {travellerDetails.firstName}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="h-[max-content] text-[13px] font-semibold min-w-[100px]">
              DOB:
            </span>
            <span className="h-[max-content] text-[13px]">
              {travellerDetails.dob}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="h-[max-content] text-[13px] font-semibold min-w-[100px]">
              Alt Mobile:
            </span>
            <span className="h-[max-content] text-[13px]">
              {travellerDetails.altMobile}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="h-[max-content] text-[13px] font-semibold min-w-[100px]">
              Agent Reference:
            </span>
            <span className="h-[max-content] text-[13px]">
              {travellerDetails.agentReference}
            </span>
          </div>
        </div>

        {/* Column 2 */}
        <div className="grid grid-rows-4 gap-2">
          <div className="flex gap-2">
            <span className="h-[max-content] text-[13px] font-semibold min-w-[100px]">
              Last Name:
            </span>
            <span className="h-[max-content] text-[13px]">
              {travellerDetails.lastName}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="h-[max-content] text-[13px] font-semibold min-w-[100px]">
              Email:
            </span>
            <span className="h-[max-content] text-[13px] break-all">
              {travellerDetails.email}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="h-[max-content] text-[13px] font-semibold min-w-[100px]">
              Nationality:
            </span>
            <span className="h-[max-content] text-[13px]">
              {travellerDetails.nationality}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="h-[max-content] text-[13px] font-semibold min-w-[100px]">
              ID Proof:
            </span>
            <span className="h-[max-content] text-[13px]">
              {travellerDetails.idProof}
            </span>
          </div>
        </div>

        {/* Column 3 */}
        <div className="grid grid-rows-4 gap-2">
          <div className="flex gap-2">
            <span className="h-[max-content] text-[13px] font-semibold min-w-[100px]">
              Gender:
            </span>
            <span className="h-[max-content] text-[13px]">
              {travellerDetails.gender}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="h-[max-content] text-[13px] font-semibold min-w-[100px]">
              Mobile:
            </span>
            <span className="h-[max-content] text-[13px]">
              {travellerDetails.mobile}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="h-[max-content] text-[13px] font-semibold min-w-[100px]">
              GST No.:
            </span>
            <span className="h-[max-content] text-[13px]">
              {travellerDetails.gstNo}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}