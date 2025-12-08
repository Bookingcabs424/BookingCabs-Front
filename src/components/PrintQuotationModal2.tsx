"use client";

import { useRef } from "react";
import { useGetBookingInfo } from "../hooks/useCommon";
import {
  Fan,
  Forward,
  Fuel,
  Luggage,
  Printer,
  User,
  User2,
} from "lucide-react";
import Image from "next/image";


interface PrintQuotationModal2Props { data: any; showPrice?: boolean }

export default function PrintQuotationModal2({data,showPrice}: PrintQuotationModal2Props) {
  // Static sample data
  const companyLogo = "/images/logo.png";
  const itineraryId = "IT123456";
  const quotationNo = "QT78910";
  const quotationDate = "08-Sep-2025";
  const quotationTime = "11:45 AM";
  const lastVoucherDate = "10-Sep-2025 05:30 PM";
  const travellerFirstName = "John";
  const travellerLastName = "Doe";
  const userName = "Alice Smith";
  const cityName = "Paris";
  const mobilePrefix = "+91";
  const mobile = "9876543210";

  const pickupDate = "10-Sep-2025";
  const pickupTime = "09:00 AM";
  const pickupAddress = "221B Baker Street, London";
  const dropDate = "12-Sep-2025";
  const dropAddress = "Eiffel Tower, Paris";
  const vehicleType = "SUV";
  const adults = 2;
  const childs = 1;
  const luggage = "2 bags";
  const bookingType = "Local";
  const localPkgName = "6 Hours / 60 KM";
  const travelDays = "3 Days";
  const estimatedDistance = 780;
  const perKmPrice = "₹12/km";
  const perHrCharge = "₹200/hr";

  const currency = "INR";
  const currencySymbol = "₹";
  const priceBeforeTax = 15000;
  const entranceFees = 500;
  const discountPrice = 1000;
  const totalTax = 2700;
  const totalPrice = 18200;

  const carOptions = [
    {
      optionTitle: "Option-1: Sedan",
      vehicleType: "Sedan",
      ac: true,
      seats: 4,
      bags: 2,
      fare: {
        discountPrice: 0,
        entranceFees: 0,
        totalTax: 3200,
        packageCost: 64000,
        totalCost: 67200,
      },
    },
    // {
    //   optionTitle: "Option-2: SUV",
    //   vehicleType: "SUV",
    //   ac: true,
    //   seats: 6,
    //   bags: 4,
    //   fare: {
    //     discountPrice: 1000,
    //     entranceFees: 500,
    //     totalTax: 3500,
    //     packageCost: 72000,
    //     totalCost: 74000,
    //   },
    // },
  ];

  const { mutate: assignedBookingMutate, data: bookingData } =
    useGetBookingInfo();

  console.log(data);

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = componentRef.current;
    if (!content) return;

    // alert("Before printing, please uncheck 'Headers and footers' in the print dialog for a clean invoice.");

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
              padding: 2px;
              font-size: 10px;
            }
            .print-heading{
              font-size: 12px;
            }
           
              .print-details {
                display: flex !important;
                align-items: end !important;
                justify-content: end !important;
                margin-block: 10px !important;
              }
              .amount-words{
              float: right !important;
              display: flex !important;
              justify-content: end !important;
              }
              .print-right-col{
                float: right !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: end !important;
              }
                .print-flex{
                    display: flex !important;
                    }
                    .print-space-between{
                      justify-content: space-between !important;
                }
                .print-flex-col{
                    display:flex !important;
                    flex-direction: column !important;
                }

                .print-no-gap{
                gap: 0px !important;
                }

                .print-m-p-0{
                margin: 0px !important;
                padding: 0px !important;
                }

                .print-text-center{
                display: flex !important;
                justify-content: center !important;
                }
                .print-mt-12{
                margin-top: 40px !important;
                }
                .print-border{
                border: 2px solid lightgray !important;
                }
                .print-w-1/2{
                width: 50% !important;
                }
                .print-mt-5{
                margin-top: 10px !important;
                }
                .print-mb-20{
                margin-bottom: 20px !important;
                }
                .print-w-full{
                width: 100% important;
                }
                .print-border-none{
                border: none !important;
                }
                .print-float-right{
                float: right !important;
                }
                .print-mb-10{
                margin-bottom: 10px !important;
                }
                .print-vehicle-btn{
                border-radius: 100% !important;
                background-color: transparent !important;
                }
                .print-gap-1{
                  gap: 4px !important;
                }
                  .print-text-center{
                    text-align: center !important;
                  }

                  .print-justify-center{
                  justify-content: center !important;
                  }
                  .print-items-center{
                  align-items: center !important;
                  }
                  .print-justify-between{
                  justify-content: space-between !important;
                  }
                  .print-mx-3{
                  margin-inline: 10px !important;
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
    <>
      <div
        ref={componentRef}
        className="w-full py-3 border border-gray-300 p-3"
      >
        {/* Title */}
        <h2 className="text-center font-semibold text-md mb-2 border-b border-gray-300 pb-1 text-[12px] print-text-center">
          QUOTATION
        </h2>

        <div className="mx-auto bg-white pt-6 pb-3">
          {/* Header */}

          <div className="print-flex-col">
            <div className="flex justify-between items-start mb-6 print-float-right">
              <div className="w-2/5 sm:w-2/8 lg:w-2/7 mx-4">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  width="160"
                  height="45"
                />
              </div>
              <div className="text-right text-[10px] print-float-right">
                <p className="print-m-p-0">
                  <strong>Itinerary No.:</strong> {data?.itinerary_id}
                </p>
                <p className="print-m-p-0">
                  <strong>Quotation No.:</strong> {quotationNo}
                </p>
                <p className="print-m-p-0">
                  <strong>Quotation Date:</strong> {quotationDate}
                </p>
                <p className="print-m-p-0">
                  <strong>Quotation Time:</strong> {quotationTime}
                </p>
              </div>
            </div>

            {/* Last Voucher Date */}
            {lastVoucherDate && (
              <div className="text-right text-[10px] mb-4 print-float-right">
                <p>Last Voucher Date: {lastVoucherDate}</p>
              </div>
            )}
          </div>

          {/* Greeting Section */}
          <div className="text-[10px] mb-2">
            <p className="print-m-p-0">
              Dear Mr {travellerFirstName} {travellerLastName},
            </p>
            <p className="print-m-p-0">
              Greetings from <strong>{data?.company_name ?? "Bookingcabs"} !!</strong>
            </p>
            <p className="print-m-p-0">
              This is <strong>{data?.first_name}</strong> and I will be working
              with you to plan your trip to <strong>{data?.city_name}</strong>.
            </p>
            <p className="print-m-p-0 print-mb-20">
              Please find below details for your trip and feel free to call me
              at{" "}
              <strong>
                {mobilePrefix}-{data?.mobile_no ?? "9876543210"}
              </strong>
              .
            </p>
          </div>

          {/* Table Section */}
        </div>

        <table className="w-full table-auto border border-gray-300 mb-3 print-mb-20">
          <thead>
            <tr className="bg-red-700 text-white text-[10px] w-[100%]">
              <th className="border border-gray-300 p-1 w-[14%]">Date</th>
              <th className="border border-gray-300 p-1 w-[19%]">
                Destination
              </th>
              <th className="border border-gray-300 p-1 w-[18%]">
                Vehicle Type
              </th>
              <th className="border border-gray-300 p-1 w-[10%]">Adult</th>
              <th className="border border-gray-300 p-1 w-[10%]">Child</th>
              <th className="border border-gray-300 p-1 w-[10%]">Infant</th>
              <th className="border border-gray-300 p-1 w-[10%]">Luggage</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-[10px]">
              <td className="border border-gray-300 p-1 w-[14%]">
                {data?.ordertime}
              </td>
              <td className="border border-gray-300 p-1 w-[15%]">
                {data?.city_name}
              </td>
              <td className="border border-gray-300 p-1 w-[18%]">
                {data?.vehicle}
              </td>
              <td className="border border-gray-300 p-1 w-[10%]">
                {data?.adults}
              </td>
              <td className="border border-gray-300 p-1 w-[10%]">
                {data?.childs ?? 0}
              </td>
              <td className="border border-gray-300 p-1 w-[10%]">
                {data?.childs ?? 0}
              </td>
              <td className="border border-gray-300 p-1 w-[10%]">
                {data?.luggages ?? 0}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Pickup/Drop Details */}
        <table className="w-full table-auto border border-gray-300 text-[10px] print-mb-20 w-[100%]">
          <tbody className="w-[100%]">
            {/* Guest Information */}
            <tr className="w-1/2">
              <td className="border border-gray-300 p-1 font-semibold">
                Guest Name
              </td>
              <td className="border border-gray-300 p-1">{data?.clientname}</td>

              <td className="border border-gray-300 p-1 font-semibold">
                Nationality
              </td>

              <td className="border border-gray-300 p-1">
                {data?.user_nationality}
              </td>
            </tr>
            <tr className="w-1/2">
              <td className="border border-gray-300 p-1 font-semibold">
                Mobile
              </td>
              <td className="border border-gray-300 p-1">
                {data?.client_mobile}
              </td>

              <td className="border border-gray-300 p-1 font-semibold">
                Email
              </td>
              <td className="border border-gray-300 p-1">{data?.email}</td>
            </tr>

            {/* Pickup Details */}
            <tr>
              <td className="border border-gray-300 p-1 font-semibold">
                Pickup Date / Time
              </td>
              <td className="border border-gray-300 p-1">
                {pickupDate} <br /> {pickupTime}
              </td>
              <td className="border border-gray-300 p-1 font-semibold">
                Pickup Address
              </td>
              <td colSpan={3} className="border border-gray-300 p-1">
                {data?.pickup_area}
              </td>
            </tr>

            {/* Drop Details */}
            <tr>
              <td className="border border-gray-300 p-1 font-semibold">
                Drop Date
              </td>
              <td className="border border-gray-300 p-1">{data?.drop_date}</td>
              <td className="border border-gray-300 p-1 font-semibold">
                Drop Address
              </td>
              <td className="border border-gray-300 p-1">
                {data?.drop_address}
              </td>
            </tr>

            {/* Package Details */}
            <tr>
              <td className="border border-gray-300 p-1 font-semibold">
                Package
              </td>
              <td className="border border-gray-300 p-1">
                {data?.booking_type} <br /> {data?.local_pkg_name}
              </td>
              <td className="border border-gray-300 p-1 font-semibold">
                Travel Duration
              </td>
              <td className="border border-gray-300 p-1">{travelDays}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 font-semibold">
                Expected Distance
              </td>
              <td className="border border-gray-300 p-1">
                {data?.estimated_distance} Km
              </td>

              {/* <td className="border border-gray-300 p-1 font-semibold">
                  Extra Km
                </td>
                <td className="border border-gray-300 p-1">{perKmPrice}</td> */}

              {/* <td className="border border-gray-300 p-1 font-semibold">
                  Extra Hr
                </td>
                <td className="border border-gray-300 p-1">{perHrCharge}</td> */}

              <td colSpan={3}>
                <tr className="w-1/2 flex flex-col">
                  <div className="flex items-center">
                    <td className="w-1/2 p-1 font-semibold">Extra Km</td>
                    <td className="p-1">{data?.approx_distance_charge}/KM</td>
                  </div>

                  <div className="flex items-center gap-2">
                    <td className="w-1/2 p-1 font-semibold">Extra Hr</td>
                    <td className="p-1">{data?.approx_hour_charge}/Hr</td>
                  </div>
                </tr>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="space-y-3 mt-3 print-mb-10">
          {carOptions.map((option, index) => (
            <table
              key={index}
              className="w-full border border-gray-300 text-[10px] table-fixed bg-white print-mb-10"
            >
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-1 w-1/2">
                    <span className="font-semibold">{option.optionTitle}</span>{" "}
                  </td>

          {
            showPrice && (<td className="border border-gray-300 p-1 flex justify-between">
                    <span className="font-semibold">
                      Total Cost {data?.currency}:
                    </span>
                    {/* {option.fare.totalCost} */}
                    {data?.amount}
                  </td>)
          }
                </tr>
                <tr>
                  {/* <td className="border border-gray-300 p-1">
                    <span className="font-semibold">Vehicle Type:</span>{" "}
                    {option.vehicleType}
                  </td> */}
                  <td rowSpan={4}>
                    <div className="flex items-center print-flex print-justify-between print-items-center print-mx-3">
                      <div className="flex flex-col gap-1 justify-center print-items-center print-mt-5">
                        <img
                          src="/images/car_model/Sedan/Swift.png"
                          alt="Swift"
                          width="120"
                          height="45"
                        />
                        <h1 className="text-center text-[12px] text-gray-700 print-text-center">
                          {data?.vehicle}
                        </h1>
                      </div>

                      <div className="flex items-center gap-1 mt-1 sm:gap-1 print-flex print-gap-1 print-justify-center">
                        <div className="flex flex-col gap-[2px] print-flex-col print-text-center">
                          <button className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 w-5 h-5 flex items-center justify-center print-vehicle-btn">
                            <User2 className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
                          </button>
                          <span className="text-[10px] text-gray-600">6+D</span>
                        </div>

                        <div className="flex flex-col gap-[2px] print-flex-col print-text-center">
                          <button className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 w-5 h-5 flex items-center justify-center print-vehicle-btn">
                            <Luggage className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
                          </button>
                          <span className="text-[10px] text-gray-600">3+1</span>
                        </div>
                        <div className="flex flex-col gap-[2px] print-flex-col print-text-center">
                          <button className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 h-5 w-5 flex items-center justify-center print-vehicle-btn">
                            <Fan className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
                          </button>
                          <span className="text-[10px] text-gray-600">AC</span>
                        </div>
                        <div className="flex flex-col gap-[2px] print-flex-col print-text-center">
                          <button
                            title="Petrol"
                            className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 w-5 h-5 flex items-center justify-center print-vehicle-btn"
                          >
                            <Fuel className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
                          </button>
                          <span className="text-[10px] text-gray-600">
                            Petrol
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  {
                    showPrice && (
                      <td className="border border-gray-300 p-1 flex justify-between">
                    <span className="font-semibold">Extras:</span>
                    {/* {option.fare.entranceFees} */}
                    {data?.extra_price}
                  </td>
                    )
                  }
                </tr>
                {
                  showPrice && (
                    <tr>
                  {/* <td className="border border-gray-300 p-1">
                    <span className="font-semibold">AC/Non-AC:</span>{" "}
                    {option.ac ? "AC" : "Non-AC"}
                  </td> */}

                  <td className="border border-gray-300 p-1 flex justify-between">
                    <span className="font-semibold">Discount Price:</span>
                    {/* {option.fare.discountPrice} */}
                    {data?.discount_price}
                  </td>
                </tr>
                  )
                }
                {
                  showPrice && (
                    <tr>
                  {/* <td className="border border-gray-300 p-1">
                    <span className="font-semibold">Seats:</span> {option.seats}
                  </td> */}

                  <td className="border border-gray-300 p-1 flex justify-between">
                    <span className="font-semibold">Total Tax:</span>
                    {/* {option.fare.totalTax} */}
                    {data?.total_tax_price}
                  </td>
                </tr>
                  )
                }
                {
                  showPrice && (
                    <tr>
                  {/* Services */}
                  {/* <td className="border border-gray-300 p-1"> */}
                  {/* <span className="font-semibold">Luggage:</span>{" "}
                    {option.bags} Bags */}
                  {/* </td> */}

                  <td className="border border-gray-300 p-1 flex justify-between">
                    <span className="font-semibold">
                      Total (including GST):
                    </span>{" "}
                    {data?.amount}
                  </td>
                </tr>
                  )
                }
                {/* <tr>
                  <td></td>
                  <td
                    colSpan={2}
                    className="border-l border-gray-300 p-2 text-center font-semibold bg-gray-50 flex justify-end"
                  >
                    Total (Incl. GST): ₹{option.fare.totalCost}
                  </td>
                </tr> */}
              </tbody>
            </table>
          ))}
        </div>

        {/* Cost Breakdown */}
        {/* <table className="w-full table-auto mt-2 border border-gray-300 print-mb-10">
          <tbody>
            <tr className="text-[10px]">
              <td className="w-1/4 px-2"></td>
              <td className="w-1/4 px-2"></td>
              <td className="w-1/4 px-2 text-right font-bold text-[10px]">
                Total Cost
              </td>
              <td className="w-1/4 px-2 text-right">
                {currency} {currencySymbol}
              </td>
            </tr>
            <tr className="text-[10px]">
              <td colSpan={2}></td>
              <td className="px-2 text-right font-semibold">
                Total Package Cost:
              </td>
              <td className="px-2 text-right">
                {currencySymbol} {priceBeforeTax}
              </td>
            </tr>
            <tr className="text-[10px]">
              <td colSpan={2}></td>
              <td className="px-2 text-right font-semibold">Entrance Fees:</td>
              <td className="px-2 text-right">
                {currencySymbol} {entranceFees}
              </td>
            </tr>
            <tr className="text-[10px]">
              <td colSpan={2}></td>
              <td className="px-2 text-right font-semibold">Discount Price:</td>
              <td className="px-2 text-right">
                {currencySymbol} {discountPrice}
              </td>
            </tr>
            <tr className="text-[10px]">
              <td colSpan={2}></td>
              <td className="px-2 text-right font-semibold">Total Tax:</td>
              <td className="px-2 text-right">
                {currencySymbol} {totalTax}
              </td>
            </tr>
            <tr className="text-[10px]">
              <td colSpan={2}></td>
              <td className="px-2 text-right font-semibold">
                Total (including GST):
              </td>
              <td className="px-2 text-right font-semibold">
                {currencySymbol} {totalPrice}
              </td>
            </tr>
          </tbody>
        </table> */}

        {/* Inclusions & Exclusions Section */}
        <div className="mt-3 border border-gray-300 p-4 text-[10px]">
          <h3 className="font-[500] text-[14px] mb-2">
            Inclusions & Exclusions
          </h3>

          {/* Inclusions */}
          <div className="mb-4 print-mb-10">
            <h4 className="font-[500] text-[12px] mb-1">Inclusions</h4>
            <ul className="list-disc pl-5">
              <li>
                3 Days trip Outstation (Round Trip) for London--Paris--London by
                1 SUV
              </li>
              <li>
                Distance 780 Km as per Package for the exact itinerary listed
                above
              </li>
              <li>No route deviation allowed unless listed in itinerary</li>
              <li>
                Driver allowance (night charges) applicable if the vehicle runs
                late
              </li>
              <li>State taxes (as per actuals)</li>
              <li>Toll taxes (as per actuals)</li>
              <li>GST included</li>
            </ul>
          </div>

          {/* Exclusions */}
          <div className="mb-4">
            <h4 className="font-[500] text-[12px] mb-1">Exclusions</h4>
            <ul className="list-disc pl-5">
              <li>Toll taxes (over and above cost include)</li>
              <li>Parking (as per actuals)</li>
              <li>Night pickup allowance excluded</li>
              <li>Night drop-off allowance excluded</li>
              <li>Peak charges & waiting charges as per tariff</li>
              <li>
                Driver allowance (night charges) if vehicle runs beyond 11 PM
              </li>
            </ul>
          </div>

          {/* Fare Rule */}
          <div className="mb-4">
            <h4 className="font-[500] text-[12px] mb-1">Fare Rule</h4>
            <ul className="list-disc pl-5">
              <li>Approx Distance: 6 Hours / 60 KM (as per quote)</li>
              <li>Minimum charged distance: 60 (as per min distance)</li>
              <li>Per Km Rates: ₹12</li>
              <li>Per Hour Rates: ₹200</li>
              <li>Driver Allowance: ₹300 per day</li>
            </ul>
          </div>

          {/* Extra Charges */}
          <div className="mb-2">
            <h4 className="font-[500] text-[12px] mb-1">Extra Charges</h4>
            <p>
              Distance: If you use vehicle beyond 780 Km, ₹12/km will be
              charged. <br />
              Time: If vehicle returns after 11:00 PM, extra driver allowance of
              ₹300 will apply.
            </p>
          </div>

          {/* Notes */}
          <div>
            <h4 className="font-[500] text-[12px] mb-1">Note:</h4>
            <ul className="list-disc pl-5">
              <li>
                One day means one calendar day from midnight (10:00 PM to 6:00
                AM).
              </li>
              <li>
                Kilometers and hours calculated from garage to garage or as
                specified.
              </li>
              <li>Air conditioning will be turned off in hill areas.</li>
              <li>
                If driver operates vehicle between 10:00 PM to 6:00 AM, night
                charges of ₹300 will apply.
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div
            className="flex items-center gap-2 mt-4 no-print"
            id="no-print-btns"
          >
            <button
              onClick={handlePrint}
              className="px-3 cursor-pointer flex items-center gap-1 bg-[#1E2939] text-white border text-[10px] py-2 rounded-sm"
            >
              <Printer className="w-3 h-3" /> Print
            </button>
            <button className="px-3 cursor-pointer flex items-center gap-1 bg-[#1E2939] text-white border text-[10px] py-2 rounded-sm">
              <Forward className="w-3 h-3" /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
