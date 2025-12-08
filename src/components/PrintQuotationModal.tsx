import { Forward, Printer } from "lucide-react";
import { useRef } from "react";

export default function PrintQuotationModal({
  data,
  showPrice=true,
}: {
  data: any;
  showPrice?: boolean;
}) {
  const componentRef = useRef<HTMLDivElement>(null);
  console.log({ data });
  const handlePrint = () => {
    const content = componentRef.current;
    if (!content) return;

    // alert("Before printing, please uncheck 'Headers and footers' in the print dialog for a clean invoice.");

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
    <html>
      <head>
        <title>Invoice - Booking</title>
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
                .print-border-none{
                  border: none !important;
                }
                .hidden{
                  display:hidden !important;
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
    <div ref={componentRef}>
      <div className="flex items-center justify-between border-b border-gray-300 py-3 print-border-none">
        <h4 className="text-lg font-semibold">
          <span className="text-base">Quotation</span>&nbsp;
          <b id="booking_no" className="text-sm text-gray-700">
            {data?.reference_number || "N/A"}
          </b>
        </h4>
      </div>

      <div className="w-full border border-gray-300 p-2">
        <div className="h-auto w-full text-xs">
          <table className="w-full border-collapse ">
            <tbody>
              <tr>
                <td colSpan={0}>
                  <br />
                  <table className="w-full ">
                    <tbody>
                      <tr>
                        <td className="p-1" colSpan={2}>
                          <table className="w-full print-border-none">
                            <tbody className="print-float-right print-border-none">
                              <tr className="text-[12px] print-border-none">
                                <td className="flex justify-between items-start print-border-none">
                                  <div className="w-1/2">
                                    <img src="/images/logo.png" alt="Logo" />
                                  </div>
                                  <div className="w-1/2 text-right">F
                                    <strong>Itinerary No. :</strong>{" "}
                                    {data?.itinerary_id || "N/A"}
                                    <br />
                                    <strong>Quotation No. :</strong>{" "}
                                    {data?.reference_number} <br />
                                    {/* <strong>Quotation Date :</strong>{" "}
                                    {
                                      
                                    } <br />
                                    <strong>Quotation Time :</strong> 13:08:36 */}
                                  </div>
                                </td>
                              </tr>

                              <tr className="text-[12px] print-float-right">
                                <td className="print-border-none">
                                  <div className="w-full text-right py-2">
                                    {/* <h5>
                                      <strong>Last Voucher Date :</strong>{" "}
                                      16-Sep-2025 08:00:00 AM
                                    </h5> */}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          <div className="w-full p-2 text-[12px]">
                            <p>Dear Mr,</p>
                            <p>
                              Greetings from{" "}
                              <strong>{data?.domain_name} !!</strong>
                            </p>
                            <p>
                              This is <strong>{data?.first_name}</strong> and I
                              will be working with you to plan your trip to{" "}
                              <strong>{data?.drop_area}</strong>
                            </p>
                            <p>
                              Please find below details for your trip and feel
                              free to call me at{" "}
                              <strong>{data?.mobile_no}</strong> or click here
                              to view more details about this trip.
                            </p>
                          </div>
                        </td>
                      </tr>

                      <tr className="text-[10px]">
                        <td colSpan={2}>
                          <div className="overflow-x-auto">
                            <table className="w-full table-auto border border-gray-300 print-border-none">
                              <thead>
                                <tr className="bg-[#C52D2F] text-white print-border-none">
                                  <th className="p-2">S.No</th>
                                  <th className="p-2">Travel Date/Time</th>
                                  <th className="p-2">Destination</th>
                                  <th className="p-2">Details</th>
                                  <th className="p-2">Adult</th>
                                  <th className="p-2">Child</th>
                                  <th className="p-2">Luggage</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="text-[10px] print-border-none">
                                  <td className="p-2">01</td>
                                  <td className="p-2">{data?.ordertime}</td>
                                  <td className="p-2">{data?.drop_area}</td>
                                  <td className="p-2">{data?.vehicle}</td>
                                  <td className="p-2 text-center">
                                    {data?.adults}
                                  </td>
                                  <td className="p-2 text-center">
                                    {data?.childs || 0}
                                  </td>
                                  <td className="p-2 text-center">
                                    {data?.luggages || 0}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>

                      <tr className="text-[10px]">
                        <td colSpan={2}>
                          <table className="w-full border border-gray-300">
                            <tbody>
                              <tr>
                                <td className="p-2 font-[500] border border-gray-300">
                                  Pickup Date
                                </td>
                                <td className="p-2 border border-gray-300">
                                  {data?.booking_date}
                                </td>
                                <td className="p-2 font-[500] border border-gray-300">
                                  Pickup Address
                                </td>
                                <td className="p-2 border border-gray-300">
                                  {data?.departure}
                                </td>
                              </tr>

                              <tr>
                                <td className="p-2 font-[500] border border-gray-300">
                                  Drop Date
                                </td>
                                <td className="p-2 border border-gray-300">
                                  {data?.drop_date}
                                </td>
                                <td className="p-2 font-[500] border border-gray-300">
                                  Drop Address
                                </td>
                                <td className="p-2 border border-gray-300">
                                  {data?.drop_address}
                                </td>
                              </tr>

                              <tr>
                                <td className="p-2 font-[500] border border-gray-300">
                                  Pickup Time
                                </td>
                                <td className="p-2 border border-gray-300">
                                  {data?.booking_time}
                                </td>
                                <td className="p-2 font-[500] border border-gray-300">
                                  Package
                                </td>
                                <td className="p-2 border border-gray-300">
                                  {data?.booking_type} ({data?.local_pkg_name})
                                </td>
                              </tr>

                              <tr>
                                <td className="p-2 font-[500] border border-gray-300">
                                  No of Days / Hrs
                                </td>
                                <td className="p-2 border border-gray-300">
                                  {data?.estimated_time}
                                </td>
                                <td className="p-2 font-[500] border border-gray-300">
                                  Expected Distance
                                </td>
                                <td className="p-2 border border-gray-300">
                                  {data?.estimated_distance} Km
                                </td>
                              </tr>
                              {/* 
                              <tr>
                                <td className="p-2 font-[500] border border-gray-300">
                                  Extra Km
                                </td>
                                <td className="p-2 border border-gray-300">
                                  12
                                </td>
                                <td className="p-2 font-[500] border border-gray-300">
                                  Extra Hr
                                </td>
                                <td className="p-2 border border-gray-300">
                                  0
                                </td>
                              </tr> */}
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={2}>
                          <h4 className="font-semibold text-base py-2">
                            Traveller Details
                          </h4>
                          <table className="w-full table-auto border border-gray-300">
                            <tbody>
                              <tr className="text-[10px]">
                                <td className="p-2">First Name</td>
                                <td className="p-2">{data?.first_name}</td>
                                <td className="p-2">Last Name</td>
                                <td className="p-2">{data?.last_name}</td>
                              </tr>

                              <tr className="text-[10px]">
                                <td className="p-2">Nationality</td>
                                <td className="p-2">
                                  {data?.user_nationality}
                                </td>
                                <td className="p-2">Mobile</td>
                                <td className="p-2">{data?.user_mobile}</td>
                              </tr>

                              <tr className="text-[10px]">
                                <td className="p-2">Alt Mobile No</td>
                                <td className="p-2">{data?.user_alt_mobile}</td>
                                <td className="p-2">Email</td>
                                <td className="p-2">{data?.client_email}</td>
                              </tr>

                              {/* <tr className="text-[10px]">
                                <td className="p-2">Agent Reference</td>
                                <td className="p-2"></td>
                                <td className="p-2">GST No.</td>
                                <td className="p-2">xcvbvx</td>
                              </tr> */}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {showPrice && (
                <tr className={`my-3 py-3 ${showPrice ? "" : "hidden"}`}>
                  <td colSpan={2}>
                    <table className="w-full border border-gray-300 border-t-0 border-collapse text-[12px]">
                      <tbody className="text-[10px] p-3">
                        <tr className="h-2.5">
                          <td className="w-1/4">&nbsp;</td>
                          <td className="w-1/4">&nbsp;</td>
                          <td className="w-1/4 text-right font-semibold">
                            Total Cost
                          </td>
                          <td className="w-1/4 text-right">
                            {data?.currency} {data?.amount}
                          </td>
                        </tr>

                        <tr>
                          <td className="w-1/4">&nbsp;</td>
                          <td className="w-1/4">&nbsp;</td>
                          <td className="w-1/4 text-right font-semibold">
                            Entrance Fees:
                          </td>
                          <td className="w-1/4 text-right">0</td>
                        </tr>

                        <tr>
                          <td className="w-1/4">&nbsp;</td>
                          <td className="w-1/4">&nbsp;</td>
                          <td className="w-1/4 text-right font-semibold">
                            Discount Price:
                          </td>
                          <td className="w-1/4 text-right">0</td>
                        </tr>

                        <tr>
                          <td className="w-1/4">&nbsp;</td>
                          <td className="w-1/4">&nbsp;</td>
                          <td className="w-1/4 text-right font-semibold">
                            Total Tax:
                          </td>
                          <td className="w-1/4 text-right">0</td>
                        </tr>

                        <tr>
                          <td className="w-1/4">&nbsp;</td>
                          <td className="w-1/4">&nbsp;</td>
                          <td className="w-1/4 text-right font-semibold">
                            Total (including GST):
                          </td>
                          <td className="w-1/4 text-right font-semibold">
                            {data?.currency} {data?.amount}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="w-full">
          <div className="w-full text-[10px] my-3">
            <div>
              <p>
                <strong>Meeting Point:</strong> {data?.departure}
              </p>

              <p className="mt-2 font-semibold text-[12px]">
                Inclusions &amp; Exclusions
              </p>

              <p className="font-semibold text-[12px]">Inclusions</p>
              <ul className="list-disc ml-5 mb-4">
                <li>
                  <strong>
                    6 Days trip Outstation (Multi City) for Delhi-NCR
                    (Delhi)--Hastinapur (Uttar Pradesh)--Haridwar
                    (Uttarakhand)--Rishikesh (Uttarakhand)--Haridwar
                    (Uttarakhand)--Mussoorie (Uttarakhand)--Mussoorie
                    (Uttarakhand)--Delhi-NCR (Delhi) By Mini Coach (12 Seats)
                  </strong>
                </li>
                <li>
                  Distance <strong>1500</strong> Km{" "}
                  <strong> as per Package </strong> for the exact Itinerary
                  listed above
                </li>
                <li>No Route Deviation allowed Unless Listed in Itinerary</li>
                <li>
                  Driver Allowance (Night Charges) Applicable is the Vehicle
                </li>
                <li>State Taxes ( As Per Actual)</li>
                <li>Toll Taxes ( As Per Actual)</li>
                <li>GST</li>
              </ul>

              <p className="font-semibold text-[12px]">Exclusion</p>
              <ul className="list-disc ml-5 mb-4">
                <li>Toll Taxes (Over and above cost Include)</li>
                <li>Parking ( As Per Actual)</li>
                <li>Night Pickup Allowance excluded</li>
                <li>Night Drop off Allowance excluded</li>
                <li>Peak Charges &amp; Waiting Charges as per Tariff</li>
              </ul>

              <h4 className="text-[12px] font-bold mb-1">Fare Rule</h4>
              <ul className="list-disc ml-5 mb-4">
                <li>
                  <strong>
                    6 Days trip Outstation (Multi City) for Delhi-NCR
                    (Delhi)--Hastinapur (Uttar Pradesh)--Haridwar
                    (Uttarakhand)--Rishikesh (Uttarakhand)--Haridwar
                    (Uttarakhand)--Mussoorie (Uttarakhand)--Mussoorie
                    (Uttarakhand)--Delhi-NCR (Delhi) By Mini Coach (12 Seats)
                  </strong>
                </li>
                <li>
                  Approx Distance Travelled <strong>777</strong> (Distance
                  Charged <strong>1500 Km</strong> as per quote)
                </li>
                <li>
                  Minimum Charged <strong>₹64000</strong> (As per Min Distance)
                </li>
                <li>
                  Per Km Rates <strong>₹34</strong> (As Per Per Km Rates)
                </li>
                <li>
                  Driver Allowance <strong>₹</strong> (Per Day)
                </li>
              </ul>

              <p className="mb-4">
                <strong className="text-[12px]">Extra Charges: </strong>
                <br />
                <strong>Distance:</strong> If you use Vehicle more than the
                Estimated Km, (<strong>₹34</strong>) Per Extra Km Rates will be
                Charged.
                <br />
                <strong>Time:</strong> If you drop the Vehicle after 21:00 Hrs,
                extra Driver Allowance <strong>₹</strong> will be Applicable
              </p>

              <ul className="list-disc ml-5">
                <li>
                  One Day Means One Calendar day from Midnight (12:00:00
                  Midnight to 23:59:00 Mid Night)
                </li>
                <li>
                  Kilometers (Km) and Hours will be Calculated from Garage to
                  Garage or Specified
                </li>
                <li>Air Con will be switched off in Hill Areas</li>
                <li>
                  If Driver Drives Vehicle between to , Driver Allowance / Night
                  Charges <strong>₹</strong> will be Applicable
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 no-print" id="no-print-btns">
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
  );
}
