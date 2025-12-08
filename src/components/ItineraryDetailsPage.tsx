"use client";
import { usegetItineraryDetails } from "../hooks/useCommon";
import { useAuth } from "../store/auth";
import { useSearchParams } from "next/navigation";
import React, { useEffect,Suspense } from "react";

const ItineraryDetailsPage = () => {
  const searchParams = useSearchParams();
  const itinerary_id = searchParams.get("itinerary_id");
  const { user } = useAuth();
  const { mutate, data, isError, error } = usegetItineraryDetails();
  useEffect(() => {
    mutate({ itinerary_id });
  }, []);
  useEffect(() => {
     
  }, [data]);

  useEffect(() => {
    
  }, [user]);
  return (
    <section id="main_form" className="pt-12">
      <div className="pcenter">
        <div className="container mx-auto">
          <div className="row">
            <div className="col-md-12 border border-black p-4">
              <div id="printTable">
                <div className="box-body" id="invoice">
                  <h2 className="text-2xl font-bold mb-4">Itinerary Details</h2>

                  <div className="box-body overflow-x-auto">
                    <div className="panel">
                      <div className="row">
                        <div className="col-sm-12">
                          <table className="w-full border-collapse">
                            <tbody>
                              <tr>
                                <td className="align-top">
                                  <div className="w-32">
                                    <img
                                      src="http://b2b.bookingcabs/upload/776/company_logo_1697893793.jpeg"
                                      height={33}
                                      width={125}
                                      alt="Company Logo"
                                    />
                                  </div>
                                </td>
                                <td className="text-right">
                                  <p>
                                    ABC Travels
                                    <br />
                                    DB Gupta Road
                                    <br />
                                    Tel: +91-11-2222222222, Mob.: 8888888888
                                    <br />
                                    Website: http://www.abctravels.com
                                    <br />
                                    Email: mohitjain2007@gmail.com
                                    <br />
                                    PAN NO.: 3243232, GST NO.: 4554343
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          <div className="mt-6">
                            <p>
                              Dear Mr <b> {user?.first_name},</b>
                            </p>
                            <p>
                              Greetings from <strong>Bookingcabs !!</strong>
                            </p>
                            <p>
                              Regarding: Tour Program For {data?.days} Day (
                              {data?.pickup_city}-{data?.drop_city})
                            </p>
                            <p>
                              This is <strong>Anil Sharma</strong> and I will be
                              working with you to plan your trip to{" "}
                              <strong>{data?.drop_city}</strong>
                            </p>
                            <p>
                              Please find below details for your trip and feel
                              free to call me at <strong>91-8888888888</strong>{" "}
                              or click here to view more details about this
                              trip.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-5 mt-4">
                        <p>
                          <strong>Client Name -</strong> {user?.first_name}{" "}
                          {user?.last_name}
                        </p>
                        <p>
                          <strong>Start Date -</strong>{" "}
                          {data?.pickup_date
                            ? new Date(data.pickup_date).toLocaleDateString(
                                "en-GB"
                              )
                            : "-"}
                        </p>
                        <p>
                          <strong>End Date -</strong>{" "}
                          {data?.drop_date
                            ? new Date(data.drop_date).toLocaleDateString(
                                "en-GB"
                              )
                            : data?.pickup_date
                            ? new Date(data.pickup_date).toLocaleDateString(
                                "en-GB"
                              )
                            : "-"}
                        </p>
                        <p>
                          <strong>Driver Details -</strong>{" "}
                          {/* Add when available */}
                        </p>
                        <p>
                          <strong>Vehicle Details -</strong>{" "}
                          {/* Add when available */}
                        </p>
                      </div>

                      <div className="col-sm-12 mt-4">
                        <div className="bg-orange-400 p-3">
                          <h3 className="text-black font-bold">
                            Day {data?.days} (
                            {data?.pickup_date
                              ? new Date(data.pickup_date).toLocaleDateString(
                                  "en-GB"
                                )
                              : "-"}
                            ) {data?.pickup_city} - {data?.drop_city} (Distance-
                            {data?.distance}, Running Time-
                            {data?.pickup_time ?? "--:--"}{" "}
                            {data?.duration ?? "--:--:--"})
                          </h3>
                        </div>
                        <div className="panel-body bg-white p-4">
                          <p>
                            <strong>Guide Available</strong>:{" "}
                            <strong>No</strong>
                          </p>
                          <div className="flex gap-4 mt-4">
                            <div className="w-1/5 font-bold">Address</div>
                            <div className="w-4/5">
                              <p>
                                <strong>Pickup Address -</strong>{" "}
                                {data?.pickup_address}
                              </p>
                              <p>
                                <strong>Drop Address -</strong>{" "}
                                {data?.drop_address}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 p-8 bg-gray-100">
                        <p className="text-xs">
                          Thank you for your interest in ABC Travels. If you
                          have any questions, wish to make changes to the
                          itinerary or confirm this booking please call us at
                          91-8888888888
                        </p>
                        <p className="mt-4">Your personal trip manager,</p>
                        <p className="mt-2">
                          Anil Sharma
                          <br />
                          91-8888888888
                        </p>
                        <p className="mt-4 font-semibold">Thanks & Regards!</p>
                        <p>
                          ABC Travels
                          <br />
                          DB Gupta Road
                          <br />
                          Tel: +91-11-2222222222, Mob.: 8888888888
                          <br />
                          Website: http://www.abctravels.com
                          <br />
                          Email: mohitjain2007@gmail.com
                          <br />
                          PAN NO.: 3243232, GST NO.: 4554343
                        </p>
                      </div>

                      <div className="mt-6 flex gap-4">
                        <button className="btn btn-warning text-white px-4 py-2 rounded bg-yellow-500">
                          <i className="fa fa-print mr-2"></i>
                          Print
                        </button>
                        <a
                          className="btn btn-primary text-white px-4 py-2 rounded bg-blue-600"
                          href="/share-itinerary?itinerary_id=ICXK02453"
                        >
                          <i className="fa fa-share mr-2"></i>
                          Share
                        </a>
                        <a
                          className="btn btn-primary text-white px-4 py-2 rounded bg-blue-600"
                          href="/edit-itinerary-details?itinerary_id=ICXK02453"
                        >
                          <i className="fa fa-edit mr-2"></i>
                          Edit
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItineraryDetailsPage;
