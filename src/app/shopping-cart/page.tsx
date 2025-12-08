"use client";
import {
  addCartToQuotation,
  discardShoppingCartQuotation,
  usegetItineraryDetails,
  useShoppingCart,
} from "../../hooks/useCommon";
import { Trash } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
interface CartItem {
  amount?: number;
  booking_date?: string;
  booking_time?: string;
  booking_type?: string;
  booking_type_id?: number;
  city_name?: string;
  id: number;
  itinerary_id: string;
  module_type: string | null;
  ordertime: string;
  ref: string;
  vehicle: string;
  items: any;
}
interface GroupedCartItem {
  itinerary_id: string;
  items: any;
}
export default function page() {
  const { data, refetch } = useShoppingCart();
  const getItinerary = usegetItineraryDetails();
  const [cartList, setCart] = useState<GroupedCartItem[]>([]);
  const { data: cart, mutate: addToCart } = addCartToQuotation();
  const { data: dcart, mutate: deleteCart } = discardShoppingCartQuotation();
  useEffect(() => {
    refetch();
  }, []);
  useEffect(() => { 
    if (cart?.status == "success") toast.success(cart?.message);
  }, [cart]);
  useEffect(() => { 
    if (data) {
      const groupedByItinerary = Object.entries(
        data?.data.reduce((acc: Record<string, CartItem[]>, item: any) => {
          if (!acc[item.itinerary_id]) {
            acc[item.itinerary_id] = [];
          }
          acc[item.itinerary_id].push(item);
          return acc;
        }, {})
      ).map(([itinerary_id, items]) => ({
        itinerary_id,
        items,
      }));
      setCart(groupedByItinerary);
    }
  }, [data]);
  useEffect(() => { 
  }, [cartList]);
  return (
    <div>
      <div className="w-full px-4 py-6">
        <div className="w-full bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>

          {/* Accordion Panel Start */}
          <div className="space-y-6" id="accordion">
            {/* Itinerary Block Start */}
            <div className="w-full">
              <div className="w-full text-xs">
                <div className="mb-4">
                  <img
                    src="http://b2b.bookingcabs/upload/776/company_logo_1697893793.jpeg"
                    alt="Logo"
                    className="h-8 w-32 object-contain"
                  />
                </div>

                {/* Invoice Table */}
                <div className="overflow-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-sm table-auto border-collapse">
                    {cartList?.map((i) => (
                      <>
                        <thead className="bg-gray-100 text-left">
                          <tr>
                            <th colSpan={9} className="px-4 py-2 text-sm font-semibold">
                              Itinerary No. : {i?.itinerary_id}
                            </th>
                          </tr>
                          <tr className="bg-gray-200 text-[12px]">
                            <th className="px-2 py-1">S.No</th>
                            <th className="px-2 py-1">Booking Date</th>
                            <th className="px-2 py-1">Booking Ref. No.</th>
                            <th className="px-2 py-1">Travel Date/Time</th>
                            <th className="px-2 py-1">Particular</th>
                            <th className="px-2 py-1">Details</th>
                            <th className="px-2 py-1 text-right">Amount</th>
                            <th className="px-2 py-1">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          
                          {i?.items?.map((item: CartItem, idx: number) => (
                            <tr key={item.id} className="text-[12px]">
                              <td className="px-2 py-1">{idx + 1}</td>
                              <td className="px-2 py-1">{item.booking_date}</td>
                              <td className="px-2 py-1">{item.ref}</td>
                              <td className="px-2 py-1">{item.ordertime}</td>
                              <td className="px-2 py-1">
                                {item.city_name}, {item.booking_type}
                              </td>
                              <td className="px-2 py-1">{item.vehicle}</td>
                              <td className="px-2 py-1 text-right">
                                ₹{item.amount}
                              </td>
                              <td className="px-2 py-1 text-center">
                                <button
                                  className="text-red-600 hover:text-red-800 cursor-pointer"
                                  data-id={item.id}
                                >
                                  <Trash className="w-4 h-4"/>
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={8}>
                              <div className="flex justify-between gap-4 p-4 bg-gray-200">
                                <a
                                  href={`/shoppingcart-checkout?id=${i?.itinerary_id}`}
                                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-1 px-2 flex items-center text-[12px] rounded"
                                >
                                  Pay Now
                                </a>
                                <a
                                  href="#"
                                  onClick={() =>
                                    addToCart({
                                      status: "27",
                                      itinerary_id: i?.itinerary_id,
                                    })
                                  }
                                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-1 px-2 text-[12px] flex items-center rounded"
                                >
                                  Quotation
                                </a>
                                <a
                                  onClick={() =>
                                    deleteCart({
                                      status: "27",
                                      itinerary_id: i?.itinerary_id,
                                    })
                                  }
                                  href="#"
                                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-1 px-2 flex items-center rounded text-[12px]"
                                >
                                  Discard
                                </a>
                                <Link
                                  href={`/itinerary-details?itinerary_id=${i?.itinerary_id}`}
                                  //  onClick={()=>{getItinerary.mutate({itinerary_id:i?.itinerary_id})}}
                                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-1 px-2 flex items-center rounded text-[12px]"
                                >
                                  Itinerary Details
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </>
                    ))}
                  </table>
                </div>
              </div>
            </div>
            {/* Itinerary Block End */}
          </div>
          {/* Accordion Panel End */}
        </div>
      </div>
    </div>
  );
}
