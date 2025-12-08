import CancellationPolicy from "../components/CancellationPolicy";
import CancellationRule from "../components/CancellationRule";
import MeetingPoint from "../components/MeetingPoint";
import {
  useCreateBookingFromCart,
  useGetBookingInfo,
  useGetQuotationInfo,
} from "../hooks/useCommon";
import {
  useBookingSearchForm,
  useQuotation,
  useSelectedVehicle,
} from "../store/common";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useRef } from "react";

const PrintTicket = () => {
  const { booking } = useSelectedVehicle();
  const { form } = useBookingSearchForm();
  const { quotationData, setQuotation } = useQuotation();
  useEffect(() => {
  }, [booking, form]);
  const { mutate, data, isError, error } = useGetQuotationInfo();
  const { mutate: makeBooking } = useCreateBookingFromCart();
  const searchParams = typeof window !== "undefined" ? useSearchParams() : null;
  const booking_id = searchParams?.get("booking_id") ?? null;

  useEffect(() => {
    if (booking_id) {
      mutate(
        { id: booking_id },
        {
          onSuccess: (data) => {
            // handle success if needed
          },
          onError: (error) => {
            // handle error if needed
          },
        }
      );
    }
  }, [booking_id]);
  const printRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = () => {
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    // Create a new window or iframe
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (!printWindow) {
      alert("Please allow popups for this site to print");
      return;
    }
    useEffect(() => {
    }, [data]);

    printWindow.document.write(`
    <html>
      <head>
        <title>Print Ticket</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .border { border: 1px solid #000; }
          .p-1 { padding: 4px; }
          .font-bold { font-weight: bold; }
          .list-disc { list-style-type: disc; }
          .ml-5 { margin-left: 20px; }
          /* Add any other necessary styles */
        </style>
      </head>
      <body>
        ${printContents}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 200);
          };
        </script>
      </body>
    </html>
  `);
    printWindow.document.close();
  };
  const router = useRouter();
  const handlePay = () => {
    setQuotation(data);
    router.push("/quotation-details/checkout");
  };
  return (
      <div className="banner-bottom flex justify-center">
        {/* container */}
        <div className="container mx-auto px-4">
          <div className="row">
            <div className="banner-bottom-grids">
              <div ref={printRef} className="w-full banner-bottom-grid">
                <h2 className="text-2xl font-bold mb-4">
                  <strong>Print/SMS Ticket</strong>
                </h2>
                <div id="print-demo">
                  <div className="box-body overflow-x-auto" id="invoice">
                    <div id="accordion" className="panel-group">
                      <div className="panel panel-default">
                        <div className="row">
                          <div className="w-full">
                            <div className="h-auto w-full text-xs">
                              <table className="w-full mx-auto border-collapse print:break-inside-avoid">
                                <tbody>
                                  <tr>
                                    <td colSpan={2}>
                                      <br />
                                      <table className="w-full border border-collapse">
                                        <tbody>
                                          <tr>
                                            <td
                                              align="left"
                                              className="p-1"
                                              colSpan={2}
                                            >
                                              <table className="w-full">
                                                <tbody>
                                                  <tr>
                                                    <td>
                                                      <div className="flex justify-between items-start">
                                                        <div className="w-1/6">
                                                          <img
                                                            src="http://b2b.bookingcabs/upload/776/company_logo_1697893793.jpeg"
                                                            alt="Company Logo"
                                                            className="h-[33px] w-[125px]"
                                                          />
                                                        </div>
                                                        <div className="w-1/3 text-right">
                                                          <p>
                                                            <strong>
                                                              Booking Status:{" "}
                                                            </strong>
                                                            {data?.status}
                                                          </p>
                                                          <br />
                                                          <br />
                                                          {/* <p>
                                                          <strong>
                                                            Itinerary No. :{" "}
                                                          </strong>
                                                          {data?.itinerary_id}
                                                        </p> */}
                                                          <p>
                                                            <strong>
                                                              Quotation No. :{" "}
                                                            </strong>
                                                            {data?.ref}{" "}
                                                          </p>
                                                          <p>
                                                            <strong>
                                                              Quotation Date :{" "}
                                                            </strong>
                                                            {data?.booking_date}
                                                          </p>
                                                          <p>
                                                            <strong>
                                                              Quotation Time :{" "}
                                                            </strong>
                                                            {data?.booking_time}
                                                          </p>
                                                          <h4>
                                                            <strong>
                                                              Last Voucher Date
                                                              :
                                                            </strong>
                                                            {
                                                              data?.booking_release_date
                                                            }
                                                          </h4>
                                                        </div>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td colSpan={2}>
                                              <div className="min-h-[250px] overflow-x-auto">
                                                <table
                                                  id="example1"
                                                  className="w-full border border-collapse"
                                                >
                                                  <thead>
                                                    <tr>
                                                      <th className="border p-1">
                                                        S.No
                                                      </th>
                                                      <th className="border p-1">
                                                        Travel Date/Time
                                                      </th>
                                                      <th className="border p-1">
                                                        Destination
                                                      </th>
                                                      <th className="border p-1">
                                                        Details
                                                      </th>
                                                      <th className="border p-1">
                                                        Adult
                                                      </th>
                                                      <th className="border p-1">
                                                        Child
                                                      </th>
                                                      <th className="border p-1">
                                                        Infant
                                                      </th>
                                                      <th className="border p-1">
                                                        Luggage
                                                      </th>
                                                    </tr>
                                                  </thead>

                                                  <tbody>
                                                    <tr>
                                                      <td className="border p-1 text-center">
                                                        01
                                                      </td>
                                                      <td className="border p-1">
                                                        {
                                                          data?.booking_release_date
                                                        }
                                                      </td>
                                                      <td className="border p-1">
                                                        {data?.pickup_area}
                                                      </td>
                                                      <td className="border p-1">
                                                        {
                                                          data?.driver_vehicle_type
                                                        }
                                                      </td>
                                                      <td className="border p-1 text-center">
                                                        {data?.adults}
                                                      </td>
                                                      <td className="border p-1 text-center">
                                                        {data?.childs}
                                                      </td>
                                                      <td className="border p-1 text-center"></td>
                                                      <td className="border p-1 text-center">
                                                        {data?.luggages}
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td colSpan={2}>
                                              <table className="w-full border border-collapse">
                                                <tbody>
                                                  <tr>
                                                    <td className="border p-1">
                                                      <strong>
                                                        Pickup Date
                                                      </strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {data?.pickup_date}
                                                    </td>
                                                    <td className="border p-1">
                                                      <strong>
                                                        Pickup Address
                                                      </strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {data?.departure}
                                                    </td>
                                                  </tr>

                                                  <tr>
                                                    <td className="border p-1">
                                                      <strong>Drop Date</strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {data?.drop_date ||
                                                        data?.pickup_date}
                                                    </td>
                                                    <td className="border p-1">
                                                      <strong>
                                                        Drop Address
                                                      </strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {data?.drop_address ||
                                                        data?.pickup_address}
                                                    </td>
                                                  </tr>

                                                  <tr>
                                                    <td className="border p-1">
                                                      <strong>
                                                        Pickup Time
                                                      </strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {data?.pickup_time ||
                                                        data?.drop_time}
                                                    </td>
                                                    <td className="border p-1">
                                                      <strong>Package</strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {data?.local_pkg_name}
                                                    </td>
                                                  </tr>

                                                  <tr>
                                                    <td className="border p-1">
                                                      <strong>
                                                        No of Days
                                                      </strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {form?.days || 1}
                                                    </td>
                                                    <td className="border p-1">
                                                      <strong>&nbsp;</strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      &nbsp;
                                                    </td>
                                                  </tr>

                                                  <tr>
                                                    <td className="border p-1">
                                                      <strong>
                                                        Expected Time
                                                      </strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {data?.estimated_time} hrs
                                                    </td>
                                                    <td className="border p-1">
                                                      <strong>&nbsp;</strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      &nbsp;
                                                    </td>
                                                  </tr>

                                                  <tr>
                                                    <td className="border p-1">
                                                      <strong>
                                                        Expected Distance
                                                      </strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {data?.estimated_distance}{" "}
                                                      Km
                                                    </td>
                                                    <td className="border p-1">
                                                      <strong>Extra Km</strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {/* 0 */}
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td colSpan={2}>
                                              <h4 className="font-bold">
                                                Traveller Details
                                              </h4>
                                              <table className="w-full border border-collapse">
                                                <tbody>
                                                  <tr>
                                                    <td className="border p-1">
                                                      <strong>
                                                        First Name
                                                      </strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {data?.first_name}
                                                    </td>
                                                    <td className="border p-1">
                                                      <strong>Last Name</strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {data?.last_name}
                                                    </td>
                                                  </tr>

                                                  <tr>
                                                    <td className="border p-1">
                                                      <strong>
                                                        Nationality
                                                      </strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {data?.nationality}
                                                    </td>
                                                    <td className="border p-1">
                                                      <strong>Mobile</strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {data?.client_mobile}
                                                    </td>
                                                  </tr>

                                                  <tr>
                                                    <td className="border p-1">
                                                      <strong>
                                                        Alt Mobile No
                                                      </strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {data?.client_alt_mobile}
                                                    </td>
                                                    <td className="border p-1">
                                                      <strong>Email</strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {booking?.guest_email}
                                                    </td>
                                                  </tr>

                                                  <tr>
                                                    <td className="border p-1">
                                                      <strong>
                                                        Agent Reference
                                                      </strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {data?.agent_reference}
                                                    </td>
                                                    <td className="border p-1">
                                                      <strong>GST No.</strong>
                                                    </td>
                                                    <td className="border p-1">
                                                      {data?.gst_no}
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>

                                          <tr>
                                            <MeetingPoint />
                                          </tr>
                                          {data?.booking_cancellation_rule && (
                                            <CancellationPolicy
                                              fareRules={JSON.parse(
                                                data?.booking_cancellation_rule
                                              )}
                                            />
                                          )}
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full mt-4">
                <button
                  className="mx-2 p-2 bg-[#dfad0a] text-[12px] font-[500] rounded-md cursor-pointer h-[max-content] py-1 sm:py-2 hover:bg-[#9d7a20] transition sm:text-text-[14px]"
                  onClick={() => handlePrint()}
                  id="invoice-print"
                >
                  <i className="fa fa-print mr-2"></i>
                  Print
                </button>
                <button
                  onClick={handlePay}
                  className="mx-2 p-2 bg-[#dfad0a] text-[12px] font-[500] rounded-md cursor-pointer h-[max-content] py-1 sm:py-2 hover:bg-[#9d7a20] transition sm:text-text-[14px]"
                >
                  Pay Online
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
export default  PrintTicket;