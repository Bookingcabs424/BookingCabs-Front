// "use client";
// import {
//   getSingleQuotation,
//   useCreateBookingFromCart,
//   useGetPaymentDetails,
//   useGetQuotationInfo,
//   useInitiatePayment,
//   useShoppingCart,
//   useWalletAmount,
// } from "@/hooks/useCommon";
// import { useSearchParams } from "next/navigation";
// import { use, useEffect, useState } from "react";
// import { toast } from "react-toastify";

// const BookingCheckout = () => {
//   const { data: gatewaydata } = useGetPaymentDetails(1);

//   const {
//     data: paymentData,
//     mutate: paydetailLoad,
//     isSuccess,
//   } = useInitiatePayment();

//   const [useWallet, setUseWallet] = useState(true);
//   const [walletStatus, setWalletStatus] = useState(1);
//   const [paymentOption, setPaymentOption] = useState("100");
//   // const searchParams = useSearchParams();
//   const itinerary_id = ("id");
//   const { mutate, data, isError, error } = useGetQuotationInfo();
//   // useEffect(() => {
//   //   mutate({
//   //     itinerary_id: itinerary_id,
//   //   });
//   // }, [itinerary_id]);
 
//   const [walletAmnt, setWalletAmmount] = useState(null);
//   useEffect(() => { 
//   }, [walletAmnt]);
//   const walletAmmount = useWalletAmount("776");
//   useEffect(() => {
//     getWalletAmount(776);
//   }, []);
//   const getWalletAmount = async (payload: any) => {
//     walletAmmount.mutate(payload, {
//       onSuccess: (response) => {
//         setWalletAmmount(
//           response?.data?.responseData?.response?.data?.user?.wallet_amount ||
//             "₹ 0.0"
//         );
//       },
//       onError: (err: any) => {
 
//       },
//     });
//   };

//   const totalAmount = data?.data?.reduce(
//     (sum: any, item: any) => sum + (item.amount ?? 0),
//     0
//   );
//   const walletAmount = 11521252;
//   const InitiatePayment = async () => {
//     // let paymentData = {
//     //   ...data,
//     // };
//     // let finalObject = {
//     //   ...gatewaydata,
//     //   paymentData:data,
//     //   amt: data?.amount,
//     // };
//     //  await paydetailLoad(finalObject);
//     // openPay();
//   };
//   // useEffect(() => {
//   //   if (gatewaydata || data) {
//   //     let finalObject = {
//   //       ...gatewaydata,
//   //       paymentData: data,
//   //       amt: data?.amount,
//   //     };
//   //     paydetailLoad(finalObject);
//   //   }
//   // }, [gatewaydata, data]);
  
//   // useEffect(() => {
//   //     let finalObject = {
//   //     ...data,
//   //     paymentData,
//   //     amt: data?.amount,
//   //   };
//   //       paydetailLoad(finalObject);

//   // }, [paymentData, data]);
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle form submission
 
//   };
//   const { data: responseBooking, mutate: submitBooking } =
//     useCreateBookingFromCart();
//   useEffect(() => { 
//   }, [responseBooking]);
//   const handlesubmitCartToBooking = (e: any) => {
//     e.preventDefault();
//     const payload = {
//       itinerary_id: itinerary_id,
//       use_wallet: useWallet,
//       booking_amt_percentage: "100",
//       book_now: "Book Now",
//       ...data,
//       twenty_five_percent: (data?.amount * 0.25).toFixed(0),
//       fifty_percent: (data?.amount * 0.5).toFixed(0),
//       total_charge: data?.amount,
//       booking_amt_balance: 0,
//       currency_code: "INR",
//       wallet_updated_amount: "110000",
//     };
//     if (useWallet) {
//       submitBooking(payload, {
//         onSuccess: (response) => {
 
//           if (
//             response?.data?.responseData?.response?.status === "success" ||
//             response?.status === 1
//           ) {
//             toast.success(response?.data?.responseData?.response?.message);
//           }
//         },
//         onError: (err) => {
 
//           toast.error("Something went wrong. Please try again.");
//         },
//       });
//     } else {
//       submitBooking(payload, {
//         onSuccess: (response) => {
 
//           if (
//             response?.data?.responseData?.response?.status === "success" ||
//             response?.status === 1
//           ) {
//             // toast.success(response?.data?.responseData?.response?.message);
//           } 
//         },
//         onError: (err) => {
 
//           toast.error("Something went wrong. Please try again.");
//         },
//       });
//       // InitiatePayment();
//     }
//   };
//   // useEffect(() => {
//   //   // Load AtomPaynetz script
//   //   const cdnScript = document.createElement("script");
//   //   cdnScript.setAttribute(
//   //     "src",
//   //     `https://pgtest.atomtech.in/staticdata/ots/js/atomcheckout.js?v=${Date.now()}`
//   //   );

//   //   cdnScript.onload = () => {
 

//   //     // Event listener for AtomPaynetz responses
//   //     const handleMessage = ({ data }:any) => {
//   //       if (data === "cancelTransaction") {
 
//   //       }
//   //       if (data === "sessionTimeout") {
 
//   //       }
//   //       if (data.ndpsResponse) {
 
//   //       }
//   //     };

//   //     window.addEventListener("message", handleMessage);

//   //     // Clean up event listener on unmount
//   //     return () => {
//   //       window.removeEventListener("message", handleMessage);
//   //     };
//   //   };

//   //   document.head.appendChild(cdnScript);
//   // }, [itinerary_id]);
//   // const openPay = async () => {
//   //   const options = {
//   //     atomTokenId: paymentData?.token,
//   //     merchId: paymentData?.merchId,
//   //     custEmail: "test.user@gmail.com",
//   //     custMobile: "8888888888",
//   //     returnUrl: "/api/payment",
//   //     // returnUrl:"https://www.atomtech.in/aipay-demo/uat_response"
//   //     // returnUrl: "http://localhost:5000/api/payment/Atomresponse"  // replace with your return URL
      
//   //   };
//   // let atom = (window as any).AtomPaynetz
//   //     ? new (window as any).AtomPaynetz(options, "uat")
//   //     : null;  };
//   return (
//     <div className="container mx-auto p-4">
//       <div className="w-full">
//         <div className="mb-6">
//           <div className="flex flex-wrap mx-1">
//             <div className="w-full pl-0">
//               <div className="text-xs">
//                 <table className="w-full mx-auto">
//                   <tbody>
//                     <tr>
//                       <td>
//                         <br />
//                         <table className="w-full mx-auto border-collapse">
//                           <tbody>
//                             <tr>
//                               <td className="py-1 px-1 border" colSpan={2}>
//                                 <table className="w-full">
//                                   <tbody>
//                                     <tr>
//                                       <td>
//                                         <div className="inline-block w-1/6 align-top">
//                                           <img
//                                             src="http://b2b.bookingcabs/upload/776/company_logo_1697893793.jpeg"
//                                             alt="Company Logo"
//                                             height="33"
//                                             width="125"
//                                           />
//                                         </div>
//                                         <div className="float-right w-1/3 text-right">
//                                           <strong>Itinerary No.:</strong>{" "}
//                                           {itinerary_id} <br />
//                                         </div>
//                                       </td>
//                                     </tr>
//                                   </tbody>
//                                 </table>
//                               </td>
//                             </tr>
//                             <tr>
//                               <td className="border" colSpan={2}>
//                                 <div className="min-h-[250px]">
//                                   <table className="w-full border border-collapse text-sm">
//                                     <thead>
//                                       <tr>
//                                         <th className="border p-1">S.No</th>
//                                         <th className="border p-1">
//                                           Booking Date
//                                         </th>
//                                         <th className="border p-1">
//                                           Booking Ref. No.
//                                         </th>
//                                         <th className="border p-1">
//                                           Travel Date/Time
//                                         </th>
//                                         <th className="border p-1">
//                                           Particular
//                                         </th>
//                                         <th className="border p-1">Details</th>
//                                         <th className="border p-1">Amount</th>
//                                       </tr>
//                                     </thead>
//                                     <tbody>
//                                       <tr>
//                                         <td className="border p-1">{1}</td>
//                                         <td className="border p-1">
//                                           {data?.booking_date}
//                                         </td>
//                                         <td className="border p-1">
//                                           {data?.ref}
//                                         </td>
//                                         <td className="border p-1">
//                                           {data?.ordertime}
//                                         </td>
//                                         <td className="border p-1">
//                                           {data?.city_name} {data?.booking_type}
//                                         </td>
//                                         <td className="border p-1">
//                                           {data?.vehicle}
//                                         </td>
//                                         <td className="border p-1 text-right">
//                                           ₹ {data?.amount}
//                                         </td>
//                                       </tr>

//                                       <tr>
//                                         <td
//                                           className="border p-1 text-right"
//                                           colSpan={6}
//                                         >
//                                           <strong>Total</strong>
//                                         </td>
//                                         <td className="border p-1 text-right">
//                                           ₹ {data?.amount}
//                                         </td>
//                                       </tr>
//                                     </tbody>
//                                   </table>
//                                 </div>
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           <div className="pl-0">
//             <div className="mb-2 pb-2">
//               <div className="pl-0 text-left">
//                 <h4 className="text-lg font-semibold">PAYMENT DETAILS</h4>
//               </div>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="mb-4">
//               <label className="inline-flex items-center">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox h-4 w-4 text-blue-600"
//                   checked={useWallet}
//                   onChange={(e) => setUseWallet(e.target.checked)}
//                 />
//                 <span className="ml-2">Use Wallet Amount (₹ {walletAmnt})</span>
//               </label>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center">
//                 <input
//                   type="radio"
//                   id="payment3"
//                   name="paymentOption"
//                   className="form-radio h-4 w-4 text-blue-600"
//                   value="100"
//                   checked={paymentOption =="100"}
//                   onChange={(e) => setPaymentOption(e.target.value)}
//                 />
//                 <label htmlFor="payment3" className="ml-2">
//                   Pay full amount ( ₹ {data?.amount}) now
//                 </label>
//               </div>
//             </div>

//             <div className="mt-6">
//               <button
//                 onClick={handlesubmitCartToBooking}
//                 type="submit"
//                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//               >
//                 Book Now
//               </button>
//               <input type="hidden" name="itnearyId" value="ICYG03669" />
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingCheckout;
"use client";
import React from 'react'

export default function page() {
  return (
    <div>
      <h1>
        Page in Development....
      </h1>
    </div>
  )
}
