import { useBookingSearchForm, useSelectedVehicle } from "../store/common";

interface FormStepperProps {
  currStep: number;
  setCurrStep: (step: number) => void;
}

export default function ReviewPayment({
  currStep,
  setCurrStep,
}: FormStepperProps) {
  const currencies = ["INR", "EUR", "JPY", "USD"];

  const handleFormSteps = () => {
    if (currStep < 3) {
      setCurrStep(currStep + 1);
    }
  };
const {booking}=useSelectedVehicle()
const {form}= useBookingSearchForm()
  return (
    <div className="border border-gray-300 p-3 rounded-md">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-[17px] font-[600]">Payment Details</h1>
        <select
          name="currency"
          id=""
          className="border border-gray-400 focus:outline-none rounded-md text-[12px] px-1 py-[2px]"
        >
            {currencies.map((curr) => (
            <option value={curr} key={curr}>
              {curr}
            </option>
          ))}
        </select>
      </div>
      <hr className="border border-gray-200 mb-6 my-3" />
      <div className="fares flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between px-3 text-[12px]">
          <span className="font-[600]">Booking Amount</span>
          <span>₹ {booking?.edit_total_value}</span>
        </div>
        {/* <div className="flex items-center justify-between px-3 text-[12px]">
          <span className="font-[600]">Addon Amount</span>
          <span>40 KM</span>
        </div> */}
        <div className="flex items-center justify-between px-3 text-[12px]">
          <span className="font-[600]">Discount</span>
          <span>₹ {booking?.coupon_discount_value}</span>
        </div>
        <div className="flex items-center justify-between px-3 text-[12px]">
          <span className="font-[600]">Payable Amount</span>
          <span>₹ {booking?.total_price}</span>
        </div>
        <div className="coupon px-3 flex flex-col gap-3 items-end justify-end">
          
          <div className="w-full flex items-center gap-2">
            <input type="checkbox" name="" id="" />
            <label className="text-[12px]" htmlFor="">
              Terms & Conditions
            </label>
          </div>
          <button
            onClick={handleFormSteps}
            className="bg-[#dfad0a] px-4 py-2 text-[12px] font-[500] rounded-md w-full cursor-pointer hover:bg-[#9d7a20] transition"
          >
            Pay & Book
          </button>
        </div>
      </div>
    </div>
  );
}
