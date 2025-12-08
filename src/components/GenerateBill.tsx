import { Controller, useForm } from "react-hook-form";
import Time from "./Time";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  handleBookingListMutation,
  useAssignedBookingMutation,
  useCompleteCabBilling,
} from "../hooks/useCommon";

type FormValues = {
  flight_time: string;
  start_time: string;
  end_time: string;
  total_running_time: string;
  pre_waiting_time: string;
  waiting_time: string;
  total_time: string;
};

interface ExtraCharge {
  id: number;
  name: string;
  amount: number;
}

interface GenerateBillProps {
  bookingDetails: any;
  companyDetails: any;
}

export default function GenerateBill({
  bookingDetails,
  companyDetails,
}: GenerateBillProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [showFareChargeTable, setShowFareChargeTable] = useState(false);
  const [openExtraChargeInnerModal, setOpenExtraChargeInnerModal] =
    useState(false);
  const [startMeter, setStartMeter] = useState<number>(0);
  const [closeMeter, setCloseMeter] = useState<number>(0);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([]);
  const [parkingCharge, setParkingCharge] = useState<string>("0");
  const [tollCharge, setTollCharge] = useState<string>("0");
  const [otherCharge, setOtherCharge] = useState<string>("0");

  const {
    mutate: assignedBookingMutate,
    data: getAssignedBookingData,
    error: assignBookingError,
  } = handleBookingListMutation();
  const {
    mutate: assignCabBilling,
    data: cabBillingData,
    error: cabBillingDataError,
  } = useCompleteCabBilling();

  const hadleAssignBooking = () => {
    assignedBookingMutate({
      id: bookingDetails?.booking_id,
      driver_id: bookingDetails?.driver_id,
    });
  };

  const handleregenerate = async () => {
    // Basic validation
    if (!startMeter || !closeMeter || closeMeter <= startMeter) {
      alert("Please enter valid meter readings");
      return;
    }

    const formValues = control._formValues as FormValues;
    
    if (!formValues.start_time || !formValues.end_time) {
      alert("Please enter start and end times");
      return;
    }

    // Calculate total extra charges
    const extraChargesTotal = calculateTotalExtraCharges();
    
    // Calculate base amount (adjust this based on your pricing logic)
    const baseAmount = (totalDistance * 10) + extraChargesTotal; // Example: 10 per km
    
    // Calculate tax amount (using the same percentage as from API)
    const taxAmount = Math.round(baseAmount * (taxPercentage / 100));
    
    // Calculate total amount
    const totalAmount = baseAmount + taxAmount + (night_charge_price || 0);
    
    // Prepare billing data
    const billingData = {
      distance: totalDistance,
      bookingId: bookingDetails?.booking_id || "BK123456",
      strtTime: `${pickup_date} ${formValues.start_time || "00:00"}`,
      endTime: `${pickup_date} ${formValues.end_time || "00:00"}`,
      address: bookingData.pickup_location || "",
      lat: bookingData.pickup_lat || "",
      lon: bookingData.pickup_lng || "",
      delay_time: parseInt(formValues.waiting_time?.split(':')[0] || "0"),
      currentTime: new Date().toISOString(),
      totalAmount: totalAmount,
      totalTime: formValues.total_time || "0h 0m",
      isMatching: "true",
      pre_Waiting_time: parseInt(formValues.pre_waiting_time?.split(':')[0] || "0"),
      road_tax: taxAmount,
      toolTax: extraCharges.find(c => c.name === "Toll Charge")?.amount || 0,
      other_tax: extraCharges.find(c => c.name === "Other Charge")?.amount || 0,
      starting_meter: startMeter,
      closing_meter: closeMeter,
      total_running_time: formValues.total_running_time || "0h 0m",
      start_time: formValues.start_time || "00:00",
      end_time: formValues.end_time || "00:00",
    };

    // Call the mutation
    assignCabBilling(billingData);
  };

  const handleSaveExtraCharges = () => {
    const newCharges: ExtraCharge[] = [];

    if (parkingCharge && parseFloat(parkingCharge) > 0) {
      newCharges.push({
        id: Date.now(),
        name: "Parking Charge",
        amount: parseFloat(parkingCharge),
      });
    }

    if (tollCharge && parseFloat(tollCharge) > 0) {
      newCharges.push({
        id: Date.now() + 1,
        name: "Toll Charge",
        amount: parseFloat(tollCharge),
      });
    }

    if (otherCharge && parseFloat(otherCharge) > 0) {
      newCharges.push({
        id: Date.now() + 2,
        name: "Other Charge",
        amount: parseFloat(otherCharge),
      });
    }

    setExtraCharges([...extraCharges, ...newCharges]);
    setParkingCharge("0");
    setTollCharge("0");
    setOtherCharge("0");
    setOpenExtraChargeInnerModal(false);
  };

  const removeExtraCharge = (id: number) => {
    setExtraCharges(extraCharges.filter((charge) => charge.id !== id));
  };

  const calculateTotalExtraCharges = () => {
    return extraCharges.reduce((total, charge) => total + charge.amount, 0);
  };

  useEffect(() => {
    hadleAssignBooking();
  }, []);

  const calculateDistance = () => {
    if (closeMeter > startMeter) {
      const distance = closeMeter - startMeter;
      setTotalDistance(distance);
    } else {
      setTotalDistance(0);
      alert("Closing meter must be greater than starting meter");
    }
  };

  const bookingData = getAssignedBookingData?.[0] || {};
  const {
    booking_date_time,
    pickup_date,
    pickup_time,
    amount,
    total_tax_price,
    booking_amt_paid,
    booking_amt_balance,
    payment_type,
    vehicle_name,
    vehicle_no,
    driver_name,
    local_pkg_name,
    approx_distance_charge,
    night_charge_price,
    pickup_location,
    pickup_lat,
    pickup_lng
  } = bookingData;

  // Calculate total amount (amount includes tax in the API data)
  const totalAmount = amount || 0;
  const taxAmount = total_tax_price || 0;
  const baseAmount = totalAmount - taxAmount;
  const taxPercentage =
    totalAmount > 0 ? Math.round((taxAmount / baseAmount) * 100) : 0;

  return (
    <div className="relative">
      <h1 className="text-xl mb-3">
        Booking <strong>{bookingDetails?.booking_id}</strong>
      </h1>
      <hr className="border-t border-gray-200" />

      <h1 className="text-md mb-1 font-[500] pt-3">General description</h1>
      <hr className="border-t border-gray-200" />

      <table className="mt-4 min-w-full bg-white border border-gray-300 text-[12px] text-left">
        <tbody>
          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Bill No
            </td>
            <td className="border border-gray-300 p-2">
              {bookingDetails?.booking_id}
            </td>
          </tr>
          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Booking Date
            </td>
            <td className="border border-gray-300 p-2">
              {booking_date_time
                ? new Date(booking_date_time).toLocaleString()
                : "2025-06-24 18:30:00"}
            </td>
          </tr>
          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Starting Time
            </td>
            <td className="border border-gray-300 p-2">
              {pickup_date && pickup_time
                ? `${pickup_date} ${pickup_time}`
                : "2025-06-25 13:00:00"}
            </td>
          </tr>
          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Meter Reading
            </td>
            <td className="border border-gray-300 p-2">
              <div className="flex flex-col justify-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-[500]">Starting Meter: </span>
                  <input
                    className="border border-gray-300 py-1 px-2 outline-none rounded-sm bg-white"
                    min={0}
                    type="number"
                    value={startMeter}
                    onChange={(e) => setStartMeter(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-[500]">Closing Meter: </span>
                  <input
                    className="border border-gray-300 py-1 px-2 outline-none rounded-sm bg-white"
                    min={0}
                    type="number"
                    value={closeMeter}
                    onChange={(e) => setCloseMeter(Number(e.target.value))}
                  />
                </div>
              </div>
            </td>
          </tr>
          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Total Distance
            </td>
            <td className="border border-gray-300 p-2">
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={totalDistance || approx_distance_charge || ""}
                  className="border border-gray-300 outline-none px-2 py-1 rounded-sm cursor-not-allowed"
                  disabled
                />
                <button
                  onClick={calculateDistance}
                  className="border border-gray-400 bg-gray-100 text-[12px] h-full px-2 py-1 cursor-pointer rounded-sm"
                >
                  Calculate
                </button>
              </div>
            </td>
          </tr>

          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Start Time
            </td>
            <td className="border border-gray-300 p-2">
              <Controller
                name="start_time"
                control={control}
                render={({ field }) => (
                  <Time
                    label=""
                    className="!shadow-none !py-1 !px-3 !text-[12px] !focus:outline-none !w-[150px] !rounded-sm !mt-0"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </td>
          </tr>

          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              End Time
            </td>
            <td className="border border-gray-300 p-2">
              <Controller
                name="end_time"
                control={control}
                render={({ field }) => (
                  <Time
                    label=""
                    className="!shadow-none !py-1 !px-3 !text-[12px] !focus:outline-none !w-[150px] !rounded-sm !mt-0"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </td>
          </tr>

          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Total Running Time
            </td>
            <td className="border border-gray-300 p-2">
              <Controller
                name="total_running_time"
                control={control}
                render={({ field }) => (
                  <Time
                    label=""
                    className="!shadow-none !py-1 !px-3 !text-[12px] !focus:outline-none !w-[150px] !rounded-sm !mt-0"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </td>
          </tr>

          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Pre-Waiting Time
            </td>
            <td className="border border-gray-300 p-2">
              <Controller
                name="pre_waiting_time"
                control={control}
                render={({ field }) => (
                  <Time
                    label=""
                    className="!shadow-none !py-1 !px-3 !text-[12px] !focus:outline-none !w-[150px] !rounded-sm !mt-0"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </td>
          </tr>

          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Waiting Time
            </td>
            <td className="border border-gray-300 p-2">
              <Controller
                name="waiting_time"
                control={control}
                render={({ field }) => (
                  <Time
                    label=""
                    className="!shadow-none !py-1 !px-3 !text-[12px] !focus:outline-none !w-[150px] !rounded-sm !mt-0"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </td>
          </tr>

          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Total Time
            </td>
            <td className="border border-gray-300 p-2">
              <Controller
                name="total_time"
                control={control}
                render={({ field }) => (
                  <Time
                    label=""
                    className="!shadow-none !py-1 !px-3 !text-[12px] !focus:outline-none !w-[150px] !rounded-sm !mt-0"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </td>
          </tr>

          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Running Bill
            </td>
            <td className="border border-gray-300 p-2">
              For 1 Cab ({vehicle_name || "Comfort Sedan"})
            </td>
          </tr>

          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Extra Charges
            </td>
            <td className="border border-gray-300 p-2">
              <button
                onClick={() => setOpenExtraChargeInnerModal(true)}
                className="border border-gray-400 bg-gray-100 text-[12px] h-full px-2 py-1 cursor-pointer rounded-sm"
              >
                Click Here
              </button>
              {extraCharges.length > 0 && (
                <div className="mt-2">
                  {extraCharges.map((charge) => (
                    <div
                      key={charge.id}
                      className="flex justify-between text-xs"
                    >
                      <span>{charge.name}:</span>
                      <span>{charge.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold text-xs mt-1">
                    <span>Total Extra Charges:</span>
                    <span>{calculateTotalExtraCharges().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </td>
          </tr>

          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Night Charge
            </td>
            <td className="border border-gray-300 p-2">
              {night_charge_price || "0"}
            </td>
          </tr>

          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Tax Amount
            </td>
            <td className="border border-gray-300 p-2">
              {taxAmount} ({taxPercentage}%)
            </td>
          </tr>

          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Total Amount
            </td>
            <td className="border border-gray-300 font-semibold p-2">
              {totalAmount}
            </td>
          </tr>
        </tbody>
      </table>

      <h1 className="text-md mb-1 font-[500] pt-3">Fare description</h1>
      <hr className="border-t border-gray-200 mb-4" />

      <table className="mt-4 min-w-full bg-white border border-gray-300 text-[12px] text-left">
        <tbody>
          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Night Charge
            </td>
            <td className="border border-gray-300 p-2">
              {night_charge_price || "0"}
            </td>
          </tr>
          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Night Time
            </td>
            <td className="border border-gray-300 p-2">00:00:00 to 00:00:00</td>
          </tr>
          <tr className="even:bg-gray-50">
            <td className="border border-gray-300 p-2 font-semibold">
              Extra charge
            </td>
            <td className="border border-gray-300 p-4">
              <textarea
                className="border border-gray-300 outline-none rounded-sm p-2 w-full"
                rows={3}
                value={
                  extraCharges.length > 0
                    ? extraCharges
                        .map(
                          (charge) =>
                            `${charge.name}: ${charge.amount.toFixed(2)}`
                        )
                        .join("\n") +
                      `\nTotal Extra Charges: ${calculateTotalExtraCharges().toFixed(
                        2
                      )}`
                    : ""
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex items-center justify-between">
        <h1 className="text-md mb-1 font-[500] pt-3">Fare Charge Details</h1>
        <button
          onClick={() => setShowFareChargeTable(!showFareChargeTable)}
          className="border border-gray-400 bg-gray-100 text-[12px] h-full px-2 py-1 cursor-pointer rounded-sm"
        >
          {!showFareChargeTable ? "Open" : "Close"}
        </button>
      </div>
      <hr className="border-t border-gray-200" />

      {showFareChargeTable && (
        <>
          <h1 className="text-md mb-1 font-[500] pt-3">Fare Details</h1>
          <hr className="border-t border-gray-200" />

          <table className="mt-4 min-w-full bg-white border border-gray-300 text-[12px] text-left mb-3">
            <tbody>
              <tr className="even:bg-gray-50">
                <td className="border border-gray-300 p-2 font-semibold">
                  Minimum Charge
                </td>
                <td className="border border-gray-300 p-2">0</td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="border border-gray-300 p-2 font-semibold">
                  Extra Price
                </td>
                <td className="border border-gray-300 p-2">300</td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="border border-gray-300 p-2 font-semibold">
                  Night Charges
                </td>
                <td className="border border-gray-300 p-2">
                  {night_charge_price || "0"}
                </td>
              </tr>

              <tr className="even:bg-gray-50">
                <td className="border border-gray-300 p-2 font-semibold">
                  Peak Charges
                </td>
                <td className="border border-gray-300 p-2">0</td>
              </tr>

              <tr className="even:bg-gray-50">
                <td className="border border-gray-300 p-2 font-semibold">
                  Total Charges
                </td>
                <td className="border border-gray-300 p-2">{baseAmount}</td>
              </tr>

              <tr className="even:bg-gray-50">
                <td className="border border-gray-300 p-2 font-semibold">
                  Basic Tax Type
                </td>
                <td className="border border-gray-300 p-2">
                  {taxPercentage}% of Total Charges
                </td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="border border-gray-300 p-2 font-semibold">
                  Basic Tax Charges
                </td>
                <td className="border border-gray-300 p-2">{taxAmount}</td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="border border-gray-300 p-2 font-semibold">
                  Total Bill
                </td>
                <td className="border border-gray-300 p-2">{totalAmount}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
      <button
        className="border border-gray-400 bg-gray-100 text-[12px] h-full px-2 py-1 cursor-pointer rounded-sm my-6"
        onClick={handleregenerate}
      >
        ReGenerate
      </button>
      {openExtraChargeInnerModal && (
        <div className="fixed inset-0 z-70 flex items-start justify-center bg-[#00000090] bg-opacity-5">
          <div className="relative w-full max-w-xl bg-white mt-20 p-4 max-h-[80vh] overflow-y-auto">
            <h1 className="text-lg mb-1 font-[500] pt-3">Extra Charges</h1>
            <hr className="border-t border-gray-200" />
            <button
              onClick={() => setOpenExtraChargeInnerModal(false)}
              className="absolute z-60 right-[5px] cursor-pointer top-[10px]"
            >
              <X />
            </button>

            <div className="flex flex-col justify-center my-4 mx-3">
              <div className="flex flex-col py-1 gap-1">
                <label
                  htmlFor="parkingCharge"
                  className="font-semibold text-[12px] text-sm"
                >
                  Parking Charge
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={parkingCharge}
                    onChange={(e) => setParkingCharge(e.target.value)}
                    className="border border-gray-300 p-1 px-3 w-[150px] outline-none rounded-sm text-[12px] sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col py-1 gap-1">
                <label
                  htmlFor="tollCharge"
                  className="font-semibold text-[12px] text-sm"
                >
                  Toll Charge
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={tollCharge}
                    onChange={(e) => setTollCharge(e.target.value)}
                    className="border border-gray-300 p-1 px-3 w-[150px] outline-none rounded-sm text-[12px] sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col py-1 gap-1">
                <label
                  htmlFor="otherCharge"
                  className="font-semibold text-[12px] text-sm"
                >
                  Other Charge
                </label>
                <input
                  type="number"
                  value={otherCharge}
                  onChange={(e) => setOtherCharge(e.target.value)}
                  className="border border-gray-300 p-1 px-3 w-[150px] outline-none rounded-sm text-[12px] sm:text-sm"
                />
              </div>

              <button
                onClick={handleSaveExtraCharges}
                className="border border-gray-400 bg-gray-100 text-[12px] h-full px-2 py-1 cursor-pointer rounded-sm w-[150px] mt-2"
              >
                Save
              </button>
            </div>

            {extraCharges.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold text-sm mb-2">
                  Current Extra Charges:
                </h3>
                <table className="w-full text-sm">
                  <tbody>
                    {extraCharges?.map((charge) => (
                      <tr key={charge.id}>
                        <td className="py-1">{charge.name}</td>
                        <td className="text-right py-1">
                          {charge.amount.toFixed(2)}
                        </td>
                        <td className="text-right py-1">
                          <button
                            onClick={() => removeExtraCharge(charge.id)}
                            className="text-red-500 text-xs"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="font-semibold border-t">
                      <td className="py-1">Total:</td>
                      <td className="text-right py-1" colSpan={2}>
                        {calculateTotalExtraCharges().toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-end mt-4">
              <button
                onClick={() => setOpenExtraChargeInnerModal(false)}
                className="border border-gray-300 cursor-pointer text-[12px] px-3 py-1 text-gray-500 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}