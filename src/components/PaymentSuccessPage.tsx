"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check URL for payment data (if redirected from gateway)
    const paymentDataParam = searchParams.get("paymentData");

    if (paymentDataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(paymentDataParam));
        setPaymentData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing payment data:", error);
        // Handle error (redirect or show error message)
      }
    } else {
      // Check session storage for payment data
      const storedData = sessionStorage.getItem("paymentResponse");
      if (storedData) {
        setPaymentData(JSON.parse(storedData));
        setIsLoading(false);
      } else {
        // No data available, might want to redirect
      }
    }
  }, [searchParams]);

  if (false) {
    return <div>Loading payment details...</div>;
  }

//   if (!false) {
//     return <div>Payment data not available</div>;
//   }

  return <div>

  <div className="flex items-center justify-center h-1/2">
            <div className="flex flex-col items-start justify-center my-6">

            <span className="text-[12px] font-semibold py-1">Dear Neeraj,</span>
            <span className="text-[12px] font-semibold py-1">Congratulations Your Cab Booking is Confirmed.</span>
            <span className="text-[12px] font-semibold py-1">Itinerary Id-ICYF01523</span>

            <span className="text-[12px] font-semibold py-1 mt-5">Reference Number-BCYF01799</span>
            <span className="text-[12px] font-semibold py-1">For More Detail Please Check your Mail.</span>

             <div className="flex items-center gap-3 my-4">

            <button className="text-[12px] bg-[#00904E] cursor-pointer px-3 py-2 rounded-sm text-white border border-white font-semibold">Manage your Booking</button>
            <button className="text-[12px] bg-[#FF9900] cursor-pointer px-3 py-2 rounded-sm border font-semibold">Print Voucher</button>
        </div>
        </div>

       
        </div>

  </div>;
}
