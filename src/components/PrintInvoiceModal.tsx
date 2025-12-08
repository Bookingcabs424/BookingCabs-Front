"use client";

import Image from "next/image";
import { Forward, Printer } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { handleBookingListMutation, useGetBookingInfo } from "@/hooks/useCommon";
// import ReactToPrint from "react-to-print"; 


type CompanyDetails = {
  [key: string]: string;
};

interface PrintInvoiceModalProps {
  companyDetails: CompanyDetails;
}

// Constants
const rules = [
  "Payment should be made by cheque/Draft/NEFT/Electronic transfer in favour of Bookingcabs.com.",
  "Final Fare will depend upon actual distance (in KM) Travelled + Service Tax.",
  "In case of any discrepancy kindly inform for necessary correction within 7 days.",
  "Insurance of passenger if not insured and not included in the quoted price.",
  "E&O.E. subject to daily jurisdiction",
];

const bankDetails = {
  "Beneficiary Name": "Hello42 India Pvt Ltd",
  "Bank Name": "HDFC Bank",
  "A/c No": "04392560009799",
  "IFSC Code": "HDFC0000439",
  "Branch Name": "GURUDWARA ROAD, Karol Bagh",
};

type Props = {
  companyDetails: any;
};


export default function PrintInvoiceModal({
  companyDetails,
  bookingDetails,
}: {
  bookingDetails: any;
  companyDetails: any;
}) {
  const { mutate: assignedBookingMutate, data: bookingData } =
    useGetBookingInfo();
  const companyData = companyDetails?.companyData || {};
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN");
  };

  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bookingDetails) {
      assignedBookingMutate({
        itinerary_id: bookingDetails.itineraryId,
      });
    }
  }, [bookingDetails]);
  // Format time for display
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "";
    return timeString.split(".")[0]; // Remove milliseconds if present
  };

  // Format currency
  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Memoized invoice data
  const invoiceData = useMemo(
    () => [
      {
        id: "01",
        date: bookingData?.pickup_date || "",
        refNo: bookingData?.id?.toString() || "",
        sacCode: bookingData?.sac_code || "",
        clientName: bookingData?.client_name || bookingData?.user_name || "",
        particulars: bookingData?.pickup_area || "",
        vehicle: bookingData?.driver_vehicle_type || "",
        unit: bookingData?.approx_distance_charge || 0,
        rate: bookingData?.amount?.toString() || "0",
        amount: bookingData?.amount?.toString() || "0",
      },
    ],
    [bookingData]
  );

  // Memoized payment data
  const paymentData = useMemo(
    () => [
      {
        service_desc: "Cab Service",
        hsn_sac: bookingData?.sac_code || "",
        taxable_value: bookingData?.amount || 0,
        cgst_rate: bookingData?.cgst_rate || 0,
        cgst_amount: bookingData?.cgst_amount || 0,
        sgst_rate: bookingData?.sgst_rate || 0,
        sgst_amount: bookingData?.sgst_amount || 0,
        igst_rate: bookingData?.igst_rate || 0,
        igst_amount: bookingData?.igst_amount || 0,
        total_tax_amt: bookingData?.total_tax_price?.toString() || "0",
      },
    ],
    [bookingData]
  );

  // Memoized personal data
  const personalData = useMemo(
    () => [
      {
        name: bookingData?.user_name || "",
        mobile: bookingData?.user_mobile || "",
        alt_mobile: bookingData?.user_alt_mobile || "",
        email: bookingData?.user_email || "",
        agent_ref: bookingData?.client_name || "",
        gstNo: bookingData?.gst_registration_number || "",
      },
    ],
    [bookingData]
  );

  const handlePrint = () => {
    const content = componentRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
    <html>
      <head>
        <title>Invoice - ${bookingData?.id || "Booking"}</title>
        <style>
          @media print {
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
            }
            .no-print {
              display: none;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 6px;
              font-size: 10px;
              text-align:right;
            }
            .print-heading{
              font-size: 14px;
            }
            .print-sign {
              position: absolute !important;
              bottom: 60px !important;
              right: 0px !important;
              }
              .sign{
                float: right !important;
              }
              .print-details {
                display: flex !important;
                flex-direction: column !important;
                align-items: end !important;
                justify-content: end !important;
                margin-block: 10px !important;
              }
              .amount-words{
              float: right !important;
              display: flex !important;
              justify-content: end !important;
              }
            }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div
      className="my-2 mx-1 relative overflow-hidden"
      id="printable-invoice-area"
      ref={componentRef}
    >
      {/* Header */}
      <h1 className="text-xl mb-3">
        Booking <strong>({bookingData?.id || "BCYF01801"})</strong>
      </h1>
      <hr className="border-t border-gray-200" />

      <div className="border border-gray-300 my-4 rounded-md bg-white relative">
        {/* Header Section */}
        <div className="flex gap-3 justify-between">
          <div className="w-2/5 sm:w-2/8 lg:w-2/7 mx-4 my-4">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={160}
              height={45}
              priority
              // unoptimized
            />
          </div>
          <div className="flex flex-col items-end pr-3 py-3 print-details">
            <span className="text-[12px]">
              <strong>Booking Status</strong> :{" "}
              {bookingData?.status_name || "Trip Done"}
            </span>
            <span className="text-[12px]">
              <strong>Invoice No</strong>: Performa Invoice
            </span>
            <span className="text-[12px]">
              <strong>Itinerary No</strong> :{" "}
              {bookingData?.itinerary_id || "ICYF01527"}
            </span>
            <span className="text-[12px]">
              <strong>Booking No</strong> : {bookingData?.id || "BCYF01801"}
            </span>
            <span className="text-[12px]">
              <strong>Booking Date</strong> :{" "}
              {formatDate(bookingData?.booking_date)}{" "}
              {formatTime(bookingData?.booking_time)}
            </span>
          </div>
        </div>

        <div className="min-w-full bg-white border border-gray-300 border-b-none flex justify-between items-center print-details">
          <div className="left-details w-1/2 p-2">
            {companyData?.[0] &&
              Object.entries(companyData[0]).map(([key, value]) => (
                <div key={key} className="mb-1 text-[12px]">
                  <strong className="capitalize">
                    {key.replace(/_/g, " ")}:
                  </strong>{" "}
                  {String(value ?? "N/A")}
                </div>
              ))}
          </div>
          <div className="right-details w-1/2 p-2 flex flex-col items-end float-right">
            <div className="mb-1 text-[10px]">
              <strong>Driver Name:</strong>{" "}
              {bookingData?.driver_name || "Not assigned"}
            </div>
            <div className="mb-1 text-[10px]">
              <strong>Driver Mobile:</strong>{" "}
              {bookingData?.driver_mobile || "N/A"}
            </div>
            <div className="mb-1 text-[10px]">
              <strong>Vehicle No:</strong> {bookingData?.vehicle_no || "N/A"}
            </div>
            <div className="mb-1 text-[10px]">
              <strong>Vehicle Name:</strong>{" "}
              {bookingData?.vehicle_name || "N/A"}
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <table className="mt-2 min-w-full bg-white border border-gray-300 border-b-none text-[9px] text-left max-w-[100%] overflow-x-scroll">
          <thead className="bg-[#C52D2F] text-white">
            <tr>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                S.No
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Date
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Ref.No.
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                SAC Code
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Client Name
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Particulars
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Vehicle
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Unit
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Rate
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceData?.map((row, idx) => (
              <tr key={row.id} className="even:bg-gray-50 text-[9px]">
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.id}
                </td>
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.date}
                </td>
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.refNo}
                </td>
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.sacCode}
                </td>
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.clientName}
                </td>
                <td className="border text-justify border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.particulars}
                </td>
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.vehicle}
                </td>
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.unit}
                </td>
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.rate}
                </td>
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Payment Summary */}
        <table className="mt-4 min-w-full bg-white border border-gray-300 text-[10px] text-left">
          <thead className="bg-gray-100"></thead>
          <tbody>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2 text-right font-semibold">
                Bill Amount
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {bookingData?.amount || "2200"}
              </td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2 text-right font-semibold">
                Other
              </td>
              <td className="border border-gray-300 p-2 text-right">300</td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2 text-right font-semibold">
                Deduction
              </td>
              <td className="border border-gray-300 p-2 text-right">0</td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2 text-right font-semibold">
                Total Amt.
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {bookingData?.amount || "2500"}
              </td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2 text-right font-semibold">
                CGST of (0):
              </td>
              <td className="border border-gray-300 p-2 text-right">0</td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2 text-right font-semibold">
                SGST of (0):
              </td>
              <td className="border border-gray-300 p-2 text-right">0</td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2 text-right font-semibold">
                IGST of (5):
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {bookingData?.igst_amount || "125"}
              </td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2 text-right font-semibold">
                Total Amount
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(
                  bookingData?.estimateprice_before_discount || 2625
                )}
              </td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2 text-right font-semibold">
                Advance Paid (%)
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(bookingData?.booking_amt_paid || 0)}
              </td>
            </tr>
            <tr className="even:bg-gray-50">
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2 text-right font-semibold">
                Net Balance (%)
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(
                  bookingData?.booking_amt_balance || bookingData?.amount
                )}
              </td>
            </tr>
          </tbody>
          <tr className="w-full">
            <span className="p-2 text-right text-[10px] font-semibold w-full float-right flex justify-end amount-words">
              {/* Rupees-two thousand six hundred and twenty five  */}
              Rupees {convertToIndianWords(bookingData?.amount ?? 2200)} only
            </span>
          </tr>
        </table>

        {/* Tax Details */}
        <table className="mt-2 min-w-full bg-white border border-gray-300 border-b-none text-[9px] text-left max-w-[100%] overflow-x-scroll">
          <thead className="bg-[#C52D2F] text-white">
            <tr>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Service / Description
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                HSN/SAC
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Taxable Value
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                CGST
                <table className="w-full mt-1 text-white text-[9px]">
                  <thead>
                    <tr className="flex justify-between gap-1">
                      <th className="text-[8px]">Rate</th>
                      <th className="text-[8px]">Amount</th>
                    </tr>
                  </thead>
                </table>
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                SGST
                <table className="w-full mt-1 text-white text-[9px]">
                  <thead>
                    <tr className="flex justify-between gap-1">
                      <th className="text-[8px]">Rate</th>
                      <th className="text-[8px]">Amount</th>
                    </tr>
                  </thead>
                </table>
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                IGST
                <table className="w-full mt-1 text-white text-[9px]">
                  <thead>
                    <tr className="flex justify-between gap-1">
                      <th className="text-[8px]">Rate</th>
                      <th className="text-[8px]">Amount</th>
                    </tr>
                  </thead>
                </table>
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Total Tax Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((row, idx) => (
              <tr key={idx} className="even:bg-gray-50 text-[9px]">
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.service_desc}
                </td>
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.hsn_sac}
                </td>
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.taxable_value}
                </td>
                <td className="border border-gray-300 p-0 sm:px-2 sm:py-2">
                  <table className="w-full text-[9px]">
                    <tbody>
                      <tr>
                        <td className="p-1 w-1/2">{row.cgst_rate}</td>
                        <td className="p-1 w-1/2">{row.cgst_amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="border border-gray-300 p-0 sm:px-2 sm:py-2">
                  <table className="w-full text-[9px]">
                    <tbody>
                      <tr>
                        <td className="p-1 w-1/2">{row.sgst_rate}</td>
                        <td className="p-1 w-1/2">{row.sgst_amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="border border-gray-300 p-0 sm:px-2 sm:py-2">
                  <table className="w-full text-[9px]">
                    <tbody>
                      <tr>
                        <td className="p-1 w-1/2">{row.igst_rate}</td>
                        <td className="p-1 w-1/2">{row.igst_amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {row.total_tax_amt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Traveler Details */}
        <h1 className="text-sm font-semibold my-3 px-2 print-heading">
          Traveller Details
        </h1>
        <table className="mt-2 min-w-full bg-white border border-gray-300 border-b-none text-[9px] text-left max-w-[100%] overflow-x-scroll">
          <thead className="bg-[#C52D2F] text-white">
            <tr>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Name
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Mobile
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Alt Mobile No
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Email
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                Agent Reference
              </th>
              <th className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                GST No.
              </th>
            </tr>
          </thead>
          <tbody>
            {personalData.map((row, idx) => (
              <tr key={idx} className="even:bg-gray-50 text-[9px]">
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.name}
                </td>
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.mobile}
                </td>
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.alt_mobile}
                </td>
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.email}
                </td>
                <td className="border border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.agent_ref}
                </td>
                <td className="border text-justify border-gray-300 p-2 sm:px-2 sm:py-2">
                  {row.gstNo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Terms & Conditions */}
        <div className="w-full border border-gray-300 rounded-md py-3 px-3">
          <h1 className="text-[12px] font-semibold my-3 print-heading">
            Terms & Condition:
          </h1>
          <ul className="list-disc list-inside text-sm space-y-1">
            {rules.map((rule, index) => (
              <li className="text-[10px]" key={index}>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Bank Details */}
        <div className="w-full h-full border border-gray-300 rounded-md py-3 px-3 relative">
          <div className="flex items-center justify-between h-full">
            <div className="bank-details w-1/2">
              <h1 className="text-sm font-semibold my-3 print-heading">
                Bank Details
              </h1>
              {Object.entries(bankDetails).map(([key, value]) => (
                <div key={key} className="mb-1 text-[10px]">
                  {key}: {value}
                </div>
              ))}
            </div>
            <h1 className="text-md font-semibold absolute top-0 right-0 p-2 print-heading sign">
              Bookingcabs.com
            </h1>
            <span className="text-[10px] text-gray-400 absolute bottom-0 right-0 p-2 print-sign sign">
              Authorised Signature
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 py-2 no-print" id="no-print-btns">
        {/* <ReactToPrint
          trigger={() => (
            <button className="px-3 cursor-pointer flex items-center gap-1 bg-[#1E2939] text-white border text-sm py-2 rounded-sm">
              <Printer className="w-4 h-4" /> Print
            </button>
          )}
          content={() => componentRef.current} // Reference to the printable area
        /> */}
        <button
          onClick={handlePrint}
          className="px-3 cursor-pointer flex items-center gap-1 bg-[#1E2939] text-white border text-sm py-2 rounded-sm"
        >
          <Printer className="w-4 h-4" /> Print
        </button>
        <button className="px-3 cursor-pointer flex items-center gap-1 bg-[#1E2939] text-white border text-sm py-2 rounded-sm">
          <Forward className="w-4 h-4" /> Share
        </button>
      </div>
    </div>
  );
}
