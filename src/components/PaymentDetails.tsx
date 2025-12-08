import { usecheckCoupon } from "../hooks/useCommon";
import { useSelectedVehicle } from "../store/common";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function PaymentDetails({ selected }: any) {
  const [coupon, setCoupon] = useState("");
  const [serviceCharge, setServiceCharge] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const roter = useRouter();
  const { booking, setBooking } = useSelectedVehicle();
  const { mutate, data, isSuccess } = usecheckCoupon();
  useEffect(() => {
    if (data?.msg == "Coupon Code is Valid") {
      toast.success("Coupon Code is Valid");
      setBooking({
        ...booking,
        coupon_discount_value: data?.coupon_discount_value,
        total_price: data?.total_price,
      });
    }
  }, [data]);

  useEffect(() => {
    setBooking({
      ...booking,
      total_price: Number(selected?.edit_total_value) + Number(serviceCharge),
    });
  }, [serviceCharge]);
  useEffect(() => {
  }, [selected]);
  return (
    <>
      <h1 className="text-lg font-[600]">Payment Details</h1>
      <hr className="border border-gray-200 mb-6 my-3" />
      <div className="fares flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between px-3 text-[10px]">
          <span className="font-[600]">Base Fare</span>
          <span className="text-[10px]">₹ {selected?.base_fare}</span>
        </div>
        <div className="flex items-center justify-between px-3 text-[10px]">
          <span className="font-[600]">Distance</span>
          <span className="text-[10px]">{selected?.estimated_distance} KM</span>
        </div>
        <div className="flex items-center justify-between px-3 text-[10px]">
          <span className="font-[600]">Hours</span>
          <span className="text-[10px]">{selected?.estimated_time} Hrs</span>
        </div>
        <div className="flex items-center justify-between px-3 text-[10px]">
          <span className="font-[600]">Final Fare</span>
          <span className="text-[10px]">₹ {selected?.single_vehicle_charge}</span>
        </div>
        <div className="flex items-center justify-between px-3 text-[10px]">
          <span className="font-[600]">No. Of Vehicles</span>
          <span className="text-[10px]">X {selected?.no_of_vehicles}</span>
        </div>
        <div className="flex items-center justify-between px-3 text-[10px]">
          <span className="font-[600]">No. Of Days</span>
          <span className="text-[10px]">X {selected?.total_travel_days}</span>
        </div>
  
        {selected && (
          <div className="flex items-center justify-between px-3 text-[10px]">
            <span className="font-[600]">Per Hrs Price</span>
            <span className="text-[10px]">₹{booking?.per_hr_charge}</span>
          </div>
        )}
        {selected && (
          <div className="flex items-center justify-between px-3 text-[10px]">
            <span className="font-[600]">Per Km Price</span>
            <span className="text-[10px]">₹{booking?.per_km_charge}</span>
          </div>
        )}
        {selected && (
          <div className="flex items-center justify-between px-3 text-[10px]">
            <span className="font-[600]">Running Amt</span>
            <span className="text-[10px]">₹{booking?.running_amt}</span>
          </div>
        )}
             {selected && (
          <div className="flex items-center justify-between px-3 text-[10px]">
            <span className="font-[600]">Night Charge</span>
            <span className="text-[10px]">₹{booking?.night_rate_value}</span>
          </div>
        )}
            {selected && (
          <div className="flex items-center justify-between px-3 text-[10px]">
            <span className="font-[600]">Extras</span>
            {/* <span className="text-[10px]">₹{ booking?.extras}</span> */}
          {
            JSON.parse(selected?.extras || "[]").length > 0 &&  JSON.parse(selected?.extras)?.map((i):any=>{
              return <div className="text-[10px]">{i.extras_name} : ₹{i.extra_value}
              <br />
              </div>
            })
          }
          </div>
        )}
          {selected && (
          <div className="flex items-center justify-between px-3 text-[10px]">
            <span className="font-[600]">Price Before Tax</span>
            <span className="text-[10px]">₹{booking?.price_before_tax}</span>
          </div>
        )}
          {selected && (
          <div className="flex items-center justify-between px-3 text-[10px]">
            <span className="font-[600]">Tax({booking?.tax_percentage}%)</span>
            <span className="text-[10px]">₹{booking?.tax_price}</span>
          </div>
        )}
              {selected && (
          <div className="flex items-center justify-between px-3 text-[10px]">
            <span className="font-[600]">Payable Amount with taxes</span>
            <span className="text-[10px]">₹{booking?.total_price}</span>
          </div>
        )}
        <p className="mt-3 text-gray-500 px-3 text-[13px] pb-0">
          Have a coupon?
        </p>
        <small>{data?.msg}</small>
        <div className="coupon px-3 flex flex-col gap-3 items-center justify-between">
          <input
            type="text"
            className="border border-gray-300 px-3 py-1 rounded-md text-[10px] outline-none w-full"
            placeholder="Enter Coupon"
            onChange={(e) => setCoupon(e.target.value)}
            value={coupon}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                mutate({
                  coupon_code: coupon,
                  price_before_tax: selected?.estimated_price_before_markup,
                  tax_percentage: selected?.tax_percentage,
                  total_price: selected?.total_price,
                  no_of_booking_vehicles: selected?.no_of_booking_vehicles,
                });
              }
            }}
          />
          <small
            onClick={() => {
              let body = {
                coupon_code: coupon,
                price_before_tax: selected?.base_fare,
                tax_percentage: selected?.tax_percentage,
                total_price: selected?.total_price,
                no_of_booking_vehicles: selected?.no_of_booking_vehicles,
              };
              mutate(body);
            }}
            className="cursor-pointer float-right flex justify-end w-full"
          >
            Apply
          </small>
        </div>
        <div className="coupon px-3 flex flex-col gap-3 items-center justify-between">
          <span className="flex flex-col gap-1 justify-between">
            <span className="font-[600] text-[10px] whitespace-nowrap">
              Service Charge
            </span>
            <input
              type="number"
              className="border border-gray-300 px-3 py-2 rounded-md text-[10px] outline-none w-full appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [MozAppearance:textfield]"
              placeholder="Enter Service Charge"
              onChange={(e) => setServiceCharge(e.target.value as any)}
              value={serviceCharge}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setBooking({
                    ...booking,
                    total_price:
                      Number(selected?.total_price) +
                      Number(serviceCharge),
                  });
                  // mutate({
                  //   coupon_code: coupon,
                  //   price_before_tax: selected?.estimated_price_before_markup,
                  //   tax_percentage: selected?.tax_percentage,
                  //   total_price: selected?.total_price,
                  //   no_of_booking_vehicles: selected?.no_of_booking_vehicles,
                  // })
                }
              }}
            />
          </span>
          {/* <small
          onClick={(e)=>{
            setBooking({
              ...booking,
              total_price:Number(selected?.edit_total_value)+Number(serviceCharge)
              })
              }}
              // onClick={() => {
                //   let body = {
                  //     coupon_code: coupon,
                  //     price_before_tax: selected?.base_fare,
                  //     tax_percentage: selected?.tax_percentage,
                  //     total_price: selected?.total_price,
                  //     no_of_booking_vehicles: selected?.no_of_booking_vehicles,
                  //   };
                  //   mutate(body);
            // }}
            className="cursor-pointer"
          >
            Apply
          </small> */}
          {selected && booking?.total_price && (
            <span className="flex flex-col gap-1 justify-between w-full">
              <span className="font-[600] text-[10px] whitespace-nowrap">Final Amt</span>
              <div className="flex flex-col gap-1 items-end">
                <input
                ref={inputRef}
                type="number"
                placeholder={booking?.total_price}
                className="border border-gray-300 rounded p-1 w-full outline-none text-[10px] px-2 py-2 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [MozAppearance:textfield]"
              />
              <small
                className="cursor-pointer text-blue-600 hover:underline float-right"
                onClick={() => {
                  const inputValue = inputRef.current?.value;
                  const val =
                    Number(inputValue) - Number(booking?.total_price);
                  if (val > 0) setServiceCharge(val);
                }}
              >
                Apply
              </small>
              </div>
            </span>
          )}

          {selected && booking?.total_price !== selected?.total_price && (
            <div className="flex  items-center gap-4 justify-between px-3 text-[10px]">
              <span className="font-[600] ">Payable Amount</span>
              <span className="text-emerald-500 font-bold">
                ₹{booking?.total_price}
              </span>
            </div>
          )}
          <button
            onClick={() =>
              selected
                ? roter.push("/review")
                : toast.error("Please Select A Vehicle")
            }
            className="bg-[#dfad0a] px-4 py-2 font-[500] rounded-md w-full cursor-pointer hover:bg-[#9d7a20] transition"
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
}
