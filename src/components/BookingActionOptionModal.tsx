"use client";
import { X } from "lucide-react";
import StarRating from "./StarRating";
import { useEffect, useState } from "react";
import DateTimePicker from "./DateTimePicker";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Time from "./Time";
import { updatePickupDateTime, useUpdateRating } from "../hooks/useCommon";
import SimpleAlert from "./Alert";
const transportBookingSchema = z.object({
  rental_date: z.string().optional(),
  time: z.string().optional(),
  total_time: z.string().optional(),
  total_running_time: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  pre_wait: z.string().optional(),
  wait: z.string().optional(),
});
type BookingActionOptionModalProps = {
  bookingDetails: any;
  setOpenModal:any;
};
type AlertType = "info" | "danger" | "success" | "warning" | "dark";

export default function BookingActionOptionModal({
  bookingDetails,setOpenModal
}: BookingActionOptionModalProps) {
  const {
    formState: { errors },
    control,
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(transportBookingSchema),
  });
  const {
    mutate: updatePickupDateTimeMutate,
    data: updatedPickupData,
    error: updatePickupTimeError,
  } = updatePickupDateTime();

  const {
    mutate: updateRatingMutate,
    data: updatedRatingData,
    error: updateRatingError,
    isError,
  } = useUpdateRating();

  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [showDateTime, setShowDateTime] = useState(false);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);
  const rental_date = watch("rental_date");
  const time = watch("time");

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);

    updateRatingMutate({
      booking_Id: bookingDetails?.booking_id ? bookingDetails?.booking_id : 1,
      driver_Id: bookingDetails?.driver_Id || 4,
      user_Id: bookingDetails?.user_id,
      rating: newRating,
    });
  };
  const handleSaveDateTime = () => {
    setShowDateTime(false);
    const pickupDateTimeData: any = {
      booking_id: bookingDetails?.booking_id ? bookingDetails?.booking_id : 1,
      pickup_date: rental_date,
      pickup_time: time,
      user_id: bookingDetails?.user_id,
    };
    const data = updatePickupDateTimeMutate(pickupDateTimeData);
  };

  useEffect(() => {
    try {
      if (updatedPickupData) {
        setAlert({
          type: "success",
          message: "Pickup time updated successfully!",
        });
      }
      if (updatePickupTimeError) {
        throw new Error("Failed to update pickup time.");
      }
    } catch (error: any) {
      setAlert({
        type: "danger",
        message: error.message || "Something went wrong.",
      });
    }
  }, [updatedPickupData, updatePickupTimeError]);

  useEffect(() => {
    setShowRating(false);
    if (updatedRatingData) {
      setAlert({
        type: "success",
        message: "Rating updated successfully!",
      });
    } else if (updateRatingError) {
      setAlert({
        type: "danger",
        message: "Failed to update rating. Please try again.",
      });
    }
  }, [updatedRatingData, updateRatingError]);

  return (
    <>
      {alert && (
        <SimpleAlert
          type={alert.type}
          message={alert.message}
          onDismiss={() => setAlert(null)}
        />
      )}

      <div className="flex gap-6 p-4 justify-between">
        {/* Left Part */}
        <div className="left-actions w-2/3">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Actions</span>
            <div className="relative max-w-[200px] mb-2">
              <DateTimePicker
                control={control}
                errors={errors}
                name="rental_date"
                title=""
                isRequired={false}
                disabled={true}
              />
              <button
                onClick={() => setShowDateTime(!showDateTime)}
                className="absolute cursor-pointer px-3 left-[100%] top-[4px] bg-[#005983] text-[12px] text-white px-1 h-[37px] rounded-sm"
              >
                Change
              </button>
            </div>

            {showDateTime && (
              <div className="flex items-center gap-1 my-3">
                <Controller
                  control={control}
                  name="rental_date"
                  render={({ field }) => (
                    <input
                      className="border border-gray-300 mt-1 p-2 px-3 outline-none rounded-sm w-full text-[12px]"
                      type="date"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="time"
                  render={({ field }) => (
                    <div className="space-y-0">
                      <Time
                        label=""
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] !shadow-none"
                      />
                    </div>
                  )}
                />
                <button
                  onClick={handleSaveDateTime}
                  className="cursor-pointer px-2 bg-[#005983] text-[12px] mt-1 text-white px-1 rounded-sm py-2"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowRating(!showRating)}
            className="border border-gray-300 px-6 cursor-pointer bg-gray-100 py-1 text-[13px] text-gray-800 w-full rounded"
          >
            Change Rating
          </button>
        </div>
        {/* Right Part */}
        <div className="flex flex-col gap-1 w-1/3">
          <span className="text-sm text-gray-600">Links</span>
          <Link href="/" className="text-[12px] text-red-600 font-[500]">
            Track & Trace
          </Link>

          {showRating && (
            <div className="flex flex-col mt-2">
              <span className="text-sm border-b border-gray-200">
                Please Rate:
              </span>
              <StarRating
                initialRating={rating}
                onRatingChange={handleRatingChange}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          onClick={() => setOpenModal("")}
          className="border border-gray-300 cursor-pointer text-[12px] px-3 py-1 text-gray-500 rounded"
        >
          Close
        </button>
      </div>

      <button
        onClick={() => setOpenModal("")}
        className="cursor-pointer text-[12px] px-3 py-1 text-gray-500 absolute right-0 top-[10px]"
      >
        <X />
      </button>
    </>
  );
}
