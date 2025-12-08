"use client";
import TravellerForm from "@/components/TravellerForm";
import ActivityDetailUpdatePopup from "../../components/ActivityDetailUpdatePopup";
import CancellationPolicy from "../../components/CancellationPolicy";
import CarPickupDetails from "../../components/CarPickupDetails";
import DriverDetailUpdatePopup from "../../components/DriverDetailUpdatePopup";
import FinalReview from "../../components/FinalReview";
import FormStepper from "../../components/FormStepper";
import GuideDetailUpdatePopup from "../../components/GuideDetailUpdatePopup";
import ItineraryCarCard from "../../components/ItineraryCarCard";
import MeetingPoint from "../../components/MeetingPoint";
import Payment from "../../components/Payment";
import ReviewPayment from "../../components/ReviewPayment";
import SightseeingSummaryPanel from "../../components/SightseeingSummaryPanel";
import TravellerDetails from "../../components/TravellerDetails";
import {
  useHandleQuotation,
  useInitiatePayment,
  useSubmitBooking,
} from "../../hooks/useCommon";
import { useAuth } from "../../store/auth";
import { useBookingSearchForm, useSelectedVehicle } from "../../store/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export default function ReviewPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [isOpen, setIsOpen] = useState<string>("");
  const [currStep, setCurrStep] = useState(1);
  const { form } = useBookingSearchForm();
  const { user } = useAuth();
  const submitQuotation = useHandleQuotation();
  const InitiatePayment = useInitiatePayment();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>("wallet");
  const [accepted, setAccepted] = useState<boolean>(true);
  const reviewBtns = [
    "Pay Now",
    "Qutotation",
    "Add More",
    "Hold On",
    // "Pay Now",
    "Voucher",
  ];

  const submitBooking = useSubmitBooking();
  const { booking, setBooking } = useSelectedVehicle();

  const handleSubmitHold = () => {
    let finalObject = {
      min_distance: booking?.estimated_distance,
      per_hr_charge: booking?.per_hr_charge,
      min_pkg_hrs: booking?.estimated_time,
      markup_price: booking?.markup_price,
      extraKm: booking?.extraKm,
      min_per_km_charge: booking?.per_km_charge,
      min_per_hr_charge: booking?.per_hr_charge,
      min_minimum_charge: booking?.minimum_charge,
      master_package_type: booking?.master_package_id,

      company_id: 1,
      ...form,
      ...booking,
      user_id: user?.id,
      hold_booking: "Hold Booking",
      cancellation_fare_rule: JSON.stringify(booking?.cancellation_fare_rule),
      booking_status: 22,
    };

    submitBooking.mutate(finalObject, {
      onSuccess: (res) => {
        if (res?.status === 200) {
          toast("Booking successful!");
        }
      },
    });
  };

  const submitVoucherBooking = () => {
    let finalObject = {
      send_email: "0",
      remark: "",
      voucher: "Voucher",
      peal_time_price: "0",
      booking_status: "1",
      min_distance: booking?.estimated_distance,
      per_hr_charge: booking?.per_hr_charge,
      min_pkg_hrs: booking?.estimated_time,
      markup_price: booking?.markup_price,
      extraKm: booking?.extraKm,
      min_per_km_charge: booking?.per_km_charge,
      min_per_hr_charge: booking?.per_hr_charge,
      min_minimum_charge: booking?.minimum_charge,
      quotation_booking: "Quotation Booking",
      agree_terms: 1,
      booking_amt_paid: booking?.total_price,
      form_type: "car_search_form",
      master_package_type: booking?.master_package_id,
      company_id: 1,
      ...form,
      ...booking,
      user_id: user?.id,
      cancellation_fare_rule: JSON.stringify(booking?.cancellation_fare_rule),
      useWallet: true,
    };
    submitBooking.mutate(finalObject, {
      onSuccess: (res) => {
        if (res?.status === 200) {
          // await api.
          router.push(
            `/ticket-detail?itinerary_id=${res.data.responseData.response.data.itinerary_id}`
          );
          // getbookInfo.mutate({itinerary_id:res.data.responseData.response.data.itinerary_id})
          toast("Booking successful!");
        }
      },
    });
  };

  const handleSubmitQuotation = () => {
    let finalObject = {
      min_distance: booking?.estimated_distance,
      per_hr_charge: booking?.per_hr_charge,
      min_pkg_hrs: booking?.estimated_time,
      markup_price: booking?.markup_price,
      extraKm: booking?.extraKm,
      min_per_km_charge: booking?.per_km_charge,
      min_per_hr_charge: booking?.per_hr_charge,
      min_minimum_charge: booking?.minimum_charge,
      quotation_booking: "Quotation Booking",
      agree_terms: 1,
      form_type: "car_search_form",
      master_package_type: booking?.master_package_id,
      company_id: 1,
      ...form,
      ...booking,
      user_id: user?.id,
      booking_status: 27,
      status: "Quotation",
      cancellation_fare_rule: JSON.stringify(booking?.cancellation_fare_rule),
    };
    submitQuotation.mutate(finalObject, {
      onSuccess: (res) => { 
        if (res?.status === 200) {
          router.push(
            `/quotation-details?booking_id=${res.data.responsedata.booking_id}`
          );
          // window.location.href=`/quotation-details?booking_id==${res.data.responseData.response.data.itinerary_id}`
          toast.success("Quotation generated successfully");
        }
      },
    });
  };

  const handleAddMoreBtn = () => {
 
    let finalObject = {
      min_distance: booking?.estimated_distance,
      per_hr_charge: booking?.per_hr_charge,
      min_pkg_hrs: booking?.estimated_time,
      markup_price: booking?.markup_price,
      extraKm: booking?.extraKm,
      min_per_km_charge: booking?.per_km_charge,
      min_per_hr_charge: booking?.per_hr_charge,
      min_minimum_charge: booking?.minimum_charge,
      quotation_booking: "Quotation Booking",
      agree_terms: 1,
      form_type: "car_search_form",
      master_package_type: booking?.master_package_id,
      company_id: 1,
      ...form,
      ...booking,
      user_id: user?.id,
      booking_status: 28,
      shopping_cart_booking: "ADD More Booking",
      cancellation_fare_rule: JSON.stringify(booking?.cancellation_fare_rule),
      itinerary_id: booking.itinerary_id || "",
    };
    submitQuotation.mutate(finalObject, {
      onSuccess: (res) => { 
        if (res?.status === 200) {
          if (!booking?.itinerary_id) {
            setBooking({
              ...booking,
              itinerary_id: res.data.updateBookingRefResp.itinerary_id,
            }); 
          }
          router.push(
            `/quotation-details?booking_id=${res.data.responsedata.booking_id}`
          );
          // window.location.href=`/quotation-details?booking_id==${res.data.responseData.response.data.itinerary_id}`
          toast.success("Quotation generated successfully");
        }
      },
    });
  };
  handleAddMoreBtn;

  const [walletAmmountRes, setWalletAmmount] =
    useState<string>("₹ 99760323.99");
  useEffect(() => {
    walletAmmountRes < booking?.total_price && setSelectedOption("");
  }, [walletAmmountRes]);
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  });
  return (
    <div className="flex flex-col items-center justify-start">
      <div className="px-6 py-9 w-[85%]">
        <FormStepper currStep={currStep} setCurrStep={setCurrStep} />
        <div className="grid grid-cols-12 gap-4 !grid-flow-row-dense">
          <div className="col-span-12  md:col-span-8 lg:col-span-9 h-[max-content]">
            {currStep == 1 && (
              <>
                <div className="flex flex-col gap-3">
                  <CarPickupDetails />
                </div>
                <div className="w-full flex my-3 rounded-md hidden lg:block">
                  <ItineraryCarCard />
                </div>
                 {/* <div className="col-span-12 md:col-span-9 my-3 hidden lg:flex">
                  <TravellerDetails />
                </div> */}
                <div className="col-span-12 md:col-span-9 my-3 hidden lg:flex">
                  <TravellerForm/>
                </div>
                <div className="col-span-12 md:col-span-9 my-3 hidden lg:flex">
                  <MeetingPoint />
                </div>
                <div className="col-span-12 md:col-span-9 my-3 border border-gray-300 p-4 rounded-md hidden lg:flex">
                  <CancellationPolicy />
                </div>
                <div className="col-span-12 md:col-span-9 my-3 border border-gray-300 p-4 rounded-md hidden lg:flex"></div>
                <div className="flex items-center justify-between hidden lg:flex">
                  <div className="col-span-12 md:col-span-9 pt-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={accepted}
                        onChange={() => setAccepted(!accepted)}
                        name=""
                        id=""
                      />
                      <label
                        className="text-gray-600 text-[10px] sm:text-sm"
                        htmlFor="terms"
                      >
                        Accept the Terms & Conditions
                      </label>
                    </div>
                      <p className="text-xs text-red-600">
                      {accepted?null:"Please Agree terms "}
                      </p>
                  </div>
                  {/* <div className="col-span-12 flex items-center justify-end gap-3">
                    <button
                      onClick={() => setCurrStep(2)}
                      className="bg-[#dfad08] col-span-1 text-[12px] font-semibold w-[max-content] px-3 py-2 rounded-md cursor-pointer hover:bg-[#9d7a20] transition"
                    >
                      Next
                    </button>
                  </div> */}
                </div>
                <div className="flex items-center justify-between my-4 gap-3 hidden md:flex">
                  <button
                    disabled={!accepted}
                    onClick={() => setCurrStep(2)}
                    className="bg-[#dfad08] col-span-1 text-[12px] w-[max-content] px-3 py-2 rounded-md cursor-pointer hover:bg-[#9d7a20] transition"
                  >
                    Pay Now
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={!accepted}
                      onClick={() => handleAddMoreBtn()}
                      className="bg-[#dfad08] col-span-1 text-[12px] w-[max-content] px-3 py-2 rounded-md cursor-pointer hover:bg-[#9d7a20] transition"
                    >
                      Add More
                    </button>

                    <button
                      disabled={!accepted}
                      onClick={() => handleSubmitQuotation()}
                      className="bg-[#dfad08] col-span-1 text-[12px] w-[max-content] px-3 py-2 rounded-md cursor-pointer hover:bg-[#9d7a20] transition"
                    >
                      Quotation
                    </button>

                    <button
                      disabled={!accepted}
                      onClick={() => handleSubmitHold()}
                      className="bg-[#dfad08] col-span-1 text-[12px] w-[max-content] px-3 py-2 rounded-md cursor-pointer hover:bg-[#9d7a20] transition"
                    >
                      Hold On
                    </button>
                  </div>

                  <button
                    disabled={!accepted}
                    onClick={() => submitVoucherBooking()}
                    className="bg-[#dfad08] col-span-1 text-[12px] w-[max-content] px-3 py-2 rounded-md cursor-pointer hover:bg-[#9d7a20] transition"
                  >
                    Voucher
                  </button>
                </div>
                {/*<div className="flex items-center my-4 gap-3 flex-wrap">
                  {reviewBtns.map((btn) => (
                    <button
                      key={btn}
                      // style={{display:"none"}}
                      style={{
                        display: `${
                          btn == "Voucher" &&
                          walletAmmountRes < booking?.total_price
                            ? "none"
                            : "block"
                        }`,
                      }}
                      className="bg-[#dfad08] col-span-1 text-[12px] w-[max-content] px-3 py-2 rounded-md cursor-pointer hover:bg-[#9d7a20] transition"
                      onClick={() => {
                        if (btn === "Qutotation") {
                          handleSubmitQuotation();
                        }
                        if (btn == "Hold Booking") {
                          handleSubmitHold();
                        }
                        if (btn === "Voucher") {
                          submitVoucherBooking();
                        }
                        // if (btn == "Pay Now") {
                        //   InitiatePayment();
                        // }
                        if (btn == "Add More") {
                          handleAddMoreBtn();
                        }
                      }}
                    >
                      {btn}
                    </button>
                  ))}
                </div>*/}
              </>
            )}
            {/* {currStep == 2 && (
              <>
                <div className="w-full hidden sm:block">
                  <SightseeingSummaryPanel />
                </div>
              </>
            )} */}
            {currStep == 2 && <Payment />}
          </div>

          {currStep !== 3 && (
            <div className="col-span-12  h-[max-content] md:col-span-4 lg:col-span-3 hidden md:block">
              <ReviewPayment currStep={currStep} setCurrStep={setCurrStep} />
            </div>
          )}
        </div>
        {/* Conditionally Rendered Sight Seeing */}
        {currStep === 1 && (
          <div className="sight-update-details w-[100%] block lg:hidden">
            <div className="w-full flex rounded-md my-6">
              <ItineraryCarCard />
            </div>
            <div className="col-span-12 md:col-span-9 my-3">
              {/* <TravellerDetails /> */}
              <TravellerForm/>
            </div>
            <div className="col-span-12 md:col-span-9 my-3">
              <MeetingPoint />
            </div>
            <div className="col-span-12 md:col-span-9 my-3 border border-gray-300 p-4 rounded-md">
              <CancellationPolicy />
            </div>
            <div className="flex items-center justify-between flex lg:hidden">
              <div className="col-span-12 md:col-span-9 pt-3">
                <div className="flex items-center gap-2">
                  <input checked={accepted} onChange={() => setAccepted(!accepted)} type="checkbox" name="" id="" />
                  <label
                    className="text-gray-600 text-[10px] sm:text-sm"
                    htmlFor="terms"
                  >
                    Accept the Terms & Conditions
                  </label>
                </div>
                <p className="text-xs text-red-600">
                      {accepted?null:"Please Agree terms "}
                      </p>
              </div>
              {/* <div className="col-span-12 flex items-center justify-end gap-3">
                <button
                  onClick={() => setCurrStep(2)}
                  className="bg-[#dfad08] col-span-1 text-[12px] font-semibold w-[max-content] px-3 py-2 rounded-md cursor-pointer hover:bg-[#9d7a20] transition"
                >
                  Next
                </button>
              </div> */}
            </div>
            <div className="col-span-12  h-[max-content] md:col-span-4 lg:col-span-3 my-3 block md:hidden">
              <ReviewPayment currStep={currStep} setCurrStep={setCurrStep} />
            </div>
            <div className="flex items-center justify-between my-4 gap-3 flex flex-wrap md:hidden">
              <button
                onClick={() => setCurrStep(2)}
                className="bg-[#dfad08] col-span-1 text-[12px] w-[max-content] px-3 py-2 rounded-md cursor-pointer hover:bg-[#9d7a20] transition"
              >
                Pay Now
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAddMoreBtn()}
                  className="bg-[#dfad08] col-span-1 text-[12px] w-[max-content] px-3 py-2 rounded-md cursor-pointer hover:bg-[#9d7a20] transition"
                >
                  Add More
                </button>

                <button
                  onClick={() => handleSubmitQuotation()}
                  className="bg-[#dfad08] col-span-1 text-[12px] w-[max-content] px-3 py-2 rounded-md cursor-pointer hover:bg-[#9d7a20] transition"
                >
                  Quotation
                </button>

                <button
                  onClick={() => handleSubmitHold()}
                  className="bg-[#dfad08] col-span-1 text-[12px] w-[max-content] px-3 py-2 rounded-md cursor-pointer hover:bg-[#9d7a20] transition"
                >
                  Hold On
                </button>
              </div>

              <button
                onClick={() => submitVoucherBooking()}
                className="bg-[#dfad08] col-span-1 text-[12px] w-[max-content] px-3 py-2 rounded-md cursor-pointer hover:bg-[#9d7a20] transition"
              >
                Voucher
              </button>
            </div>
          </div>
        )}
        {/* {currStep === 2 && (
          <>
            <div className="w-full block sm:hidden">
              <SightseeingSummaryPanel />
            </div>
          </>
        )} */}
        {/* {currStep === 3 && (
          <>
            <FinalReview currStep={currStep} setCurrStep={setCurrStep} />
          </>
        )} */}
      </div>

      {isOpen !== "" && (
        <div
          className="fixed inset-0 bg-[#00000098] bg-opacity-0 flex items-center justify-center z-50"
          onClick={() => setIsOpen("")}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-h-[350px] overflow-y-auto max-w-[320px] relative p-3 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen("")}
              className="absolute top-2 right-2 text-gray-600 hover:text-black cursor-pointer"
            >
              <X />
            </button>

            {isOpen === "activity" && <ActivityDetailUpdatePopup />}
            {isOpen === "driver-update" && <DriverDetailUpdatePopup />}
            {isOpen === "guide-update" && <GuideDetailUpdatePopup />}
          </div>
        </div>
      )}
    </div>
  );
}
