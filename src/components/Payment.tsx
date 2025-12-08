import {
  useGetBookingInfo,
  useGetPaymentDetails,
  useHandleQuotation,
  useInitiatePayment,
  useSubmitBooking,
  useWalletAmount,
} from "..//hooks/useCommon";
import { useAuth } from "../store/auth";
import { useBookingSearchForm, useSelectedVehicle } from "..//store/common";
import { Check, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function Payment() {
  const { data: paymentData, mutate, isSuccess } = useInitiatePayment();
  const { user } = useAuth();
  useEffect(() => {
  }, [isSuccess]);
  useEffect(() => {
    // Load AtomPaynetz script
    const cdnScript = document.createElement("script");
    cdnScript.setAttribute(
      "src",
      `https://pgtest.atomtech.in/staticdata/ots/js/atomcheckout.js?v=${Date.now()}`
    );

    cdnScript.onload = () => {
     
      // Event listener for AtomPaynetz responses
      const handleMessage = ({ data }: { data: any }) => {
        if (data === "cancelTransaction") {
        }
        if (data === "sessionTimeout") {
        }
        if (data.ndpsResponse) {
        }
      };

      window.addEventListener("message", handleMessage);

      // Clean up event listener on unmount
      return () => {
        window.removeEventListener("message", handleMessage);
      };
    };

    document.head.appendChild(cdnScript);
  }, [paymentData]);
  const openPay = () => {
    
    const options = {
      atomTokenId: paymentData?.token,
      merchId: paymentData?.merchId,
      custEmail: user?.email || "",
      custMobile: user?.mobile || "",
      returnUrl: "/api/payment",
      // returnUrl:"https://www.atomtech.in/aipay-demo/uat_response"
      // returnUrl: "http://localhost:5000/api/payment/Atomresponse"  // replace with your return URL
    };
    let atom = (window as any).AtomPaynetz
      ? new (window as any).AtomPaynetz(options, "uat")
      : null;
  };
  const [activePickup, setActivePickup] = useState<string>("25");
  const reviewBtns = [
    "Hold Booking",
    "Qutotation",
    "Add More",
    // "Pay Now",
    "Voucher",
  ];

  const [selectedOption, setSelectedOption] = useState<string>("wallet");
  const [selectedPayment, setSelectedPayment] = useState<string>("25");
  const [paymentDetails, setPaymentDetails] = useState<any>();
  const [walletAmmountRes, setWalletAmmount] =
  useState<string>("₹ 99760323.99");
  useEffect(() => {
    walletAmmountRes<booking?.total_price&& setSelectedOption("");
  }, [walletAmmountRes]);
  const { data } = useGetPaymentDetails(1);


  // Utility to wait for the global `checkout` to appear

  const walletAmmount = useWalletAmount("776");
  const getWalletAmount = async (payload: any) => {
    walletAmmount.mutate(payload, {
      onSuccess: (response) => {
        setWalletAmmount(
          response?.data?.responseData?.response?.data?.user?.wallet_amount ||
            "₹ 0.0"
        );
      },
      onError: (err: any) => {
      },
    });
  };

  useEffect(() => {
    getWalletAmount(776);
  }, []);

  const handleToggle = (buttonId: string) => {
    setActivePickup((prev) => (prev === buttonId ? "25" : buttonId));
  };
  const { form } = useBookingSearchForm();

  const { booking, setBooking } = useSelectedVehicle();
  useEffect(() => {
  }, [booking]);
  const submitQuotation = useHandleQuotation();
  const submitBooking = useSubmitBooking();
  const getbookInfo = useGetBookingInfo();
  
  const handleSubmitBooking = (useWallet:Boolean) => {
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
useWallet:useWallet,
      company_id: 1,
      ...form,
      ...booking,
      user_id: user?.id,
      cancellation_fare_rule: JSON.stringify(booking?.cancellation_fare_rule),
      ...paymentDetails,
    };
    submitBooking.mutate(finalObject, {
      onSuccess: (res) => {
        if (res?.status === 200) {
          toast("Booking successful!");
          router.push(
            `/ticket-detail?itinerary_id=${res.data.responseData.response.data.itinerary_id}`
          );
          
        }
      },
    });
  };
  const InitiatePayment = async () => {
    let paymentData = {
      ...booking,
      ...form,
    };
    let finalObject = {
      ...data,
      paymentData,
      amt: booking?.total_price,
    };
    // handleSubmitBooking(false)
    mutate(finalObject)
  };
  useEffect(()=>{
isSuccess && openPay();
  },[isSuccess])
  const router = useRouter();


  useEffect(() => {
    setPaymentDetails({
      booking_amt_paid: (booking?.total_price * 0.25).toFixed(0),
      booking_amt_balance:
        Number(booking?.total_price) -
        Number((Number(booking?.total_price) * 0.25).toFixed(0)),
      charge_type: "3",
      booking_amt_percentage: "25",
      traveller_submit: "Pay Online",
      book_now: "Book Now",
      wallet_amount: "1",
      wallet_updated_amount:
        Number(walletAmmountRes || "0") -
        Number(
          Number(booking?.total_price) -
            Number((Number(booking?.total_price) * 0.25).toFixed(0))
        ),
    });
  }, []);

  return (
    <>
      <div className="border border-gray-300 rounded-md px-6 py-3">
        <h1 className="text-lg font-semibold pt-3 mb-3">Payment Details1</h1>
        <div className="mb-8">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedOption === "wallet"}
                onChange={() =>
                 walletAmmountRes<booking?.total_price? "": setSelectedOption(selectedOption === "wallet" ? "" : "wallet")
                }
                className="sr-only"
              />
              <div
                className={`w-6 h-6 border-2 rounded flex items-center justify-center ${
                  selectedOption === "wallet"
                    ? "bg-red-500 border-red-500"
                    : "border-gray-300"
                }`}
              >
                {selectedOption === "wallet" && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            <div className="ml-4 flex items-center">
              <Wallet className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-gray-700 text-lg text-[14px]">
                Use Wallet Amount {walletAmmountRes}
              </span>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 sm:gap-5">
          {[
            {
              id: "25",
              booking_amt_percentage: "25",
              label: `Pay 25% ( ₹${(booking?.total_price * 0.25).toFixed(
                0
              )} ) now and rest before trip starts`,
              booking_amt_paid: (booking?.total_price * 0.25).toFixed(0),
              booking_amt_balance:
                Number(booking?.total_price) -
                Number((Number(booking?.total_price) * 0.25).toFixed(0)),
              charge_type: "3",
            },
            {
              id: "50",
              booking_amt_percentage: "50",
              label: `Pay 50% ( ₹${(booking?.total_price * 0.5).toFixed(
                0
              )} ) now and rest before trip starts`,
              booking_amt_paid: (booking?.total_price * 0.25).toFixed(0),
              booking_amt_balance:
                Number(booking?.total_price) -
                Number((Number(booking?.total_price) * 0.5).toFixed(0)),
              charge_type: "3",
            },
            {
              id: "full",
              label: `Pay full amount ( ₹${booking?.total_price} ) now`,
              booking_amt_paid: (booking?.total_price * 0.25).toFixed(0),
              booking_amt_balance:
                Number(booking?.total_price) -
                Number((Number(booking?.total_price) * 0).toFixed(0)),
              charge_type: "2",
            },
            // { id: "credit-balance", label: `Credit Balance` },
            // { id: "referral-coins", label: `Referral Coins` },
            // { id: "booknig-amount", label: `Booking Amount` },
          ].map((option) => (
            <div key={option.id} className="flex gap-3 items-center text-sm ">
              <div
                onClick={() => {
                  handleToggle(option.id);
                  setPaymentDetails({
                    booking_amt_paid: option.booking_amt_paid,
                    booking_amt_balance: option.booking_amt_balance,
                    charge_type: option.charge_type,
                    booking_amt_percentage: option.booking_amt_percentage,
                    traveller_submit: "Pay Online",
                    book_now: "Book Now",
                    wallet_amount: "1",
                    wallet_updated_amount:
                      Number(walletAmmountRes || "0") -
                      Number(option.booking_amt_balance),
                  });
                }}
                className={`rounded-full border-2 border-[#dfad0a] cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300
        ${activePickup === option.id ? "justify-end" : "justify-start"}
        min-w-10 min-h-5 sm:min-w-14 sm:min-h-7`}
              >
                <div className="h-3.5 w-3.5 sm:h-5 sm:w-5 rounded-full bg-[#dfad0a] shadow-md transition-all duration-300" />
              </div>
              <p className="text-xs sm:text-[12px] lg:text-sm">
                {option.label}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            selectedOption ? handleSubmitBooking(true) : InitiatePayment();
          }}
          className="bg-[#dfad0a] px-5 py-2 font-[500] text-[13px] rounded-md w-[max-content] cursor-pointer hover:bg-[#9d7a20] transition"
        >
          Pay ₹
          {activePickup === "full"
            ? booking?.total_price
            : booking?.total_price && activePickup
            ? ((booking.total_price * Number(activePickup)) / 100).toFixed(0)
            : booking?.total_price}
        </button>
      </div>
      
      {/* {isSuccess && (
  <AtomFormPayment
    encData={"paymentData.encData"}
    merchId={paymentData.merchId
}
    actionUrl={paymentData?.url}
  />
)} */}
    </>
  );
}
