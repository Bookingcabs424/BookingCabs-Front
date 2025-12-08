"use client";
import {
  cancelBookingDriver,
  handleBookingListMutation,
  upateBookingStatus,
  useCancelBookingByUser,
  useExecuteNoShow,

  useReDispatch,
} from "../hooks/useCommon";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import SimpleAlert from "./Alert";
import { useAuth } from "../store/auth";

const cancelReasonOptions = [
  { value: "10", label: "Driver Cancel" },
  { value: "20", label: "Client cancel" },
  // { value: "21", label: "Vendor Cancel" },
  // { value: "16", label: "Dispose by CC" },
  // { value: "17", label: "Cancel by CC" },
  { value: "23", label: "Getting Late" },
  { value: "24", label: "Break Down" },
  // { value: "25", label: "Wrong Address" },
  { value: "26", label: "other" },
];

const statusTypeOptions = [
  { value: "2", label: "Processing" },
  { value: "3", label: "Accepted" },
  { value: "4", label: "Located" },
  { value: "5", label: "Reported" },
  { value: "6", label: "On Wait" },
  { value: "7", label: "On Trip" },
  { value: "8", label: "Trip Done" },
  { value: "9", label: "Rejected" },
];

interface BookingStatsActionProps {
  openInnerModal: string;
  setOpenInnerModal: React.Dispatch<React.SetStateAction<string>>;
  bookingDetails: any;
  setOpenModal:any;
}
type AlertType = "info" | "danger" | "success" | "warning" | "dark";

export default function BookingActionStatusModal({
  openInnerModal,
  setOpenInnerModal,
  bookingDetails,
  setOpenModal
}: BookingStatsActionProps) {
  useEffect(()=>{ 
  },[bookingDetails])
  const [executeCancel, setExecuteCancel] = useState(false);
  const [status, setStatus] = useState(false);
  const [successMessage, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);
  const [selectedCancelReason, setSelectedCancelReason] = useState("0");
  const [selectedStatus, setSelectedStatus] = useState("0");
  const userDetails = useAuth.getState().user;
  const {
    mutate: cancelBookingDriverMutate,
    data: cancelBookingDriverData,
    error: updateCancleDriverError,
  } = useCancelBookingByUser();
  const {
    mutate: updateBookingDriverMutate,
    data: updateBookingDriverData,
    error: updateBookingDriverError,
  } = upateBookingStatus();
  const {
    mutate: executeNoShow,
    data: noShowData,
    error:executeNoshowError,
    isPending,
  } = useExecuteNoShow();
      const {user} = useAuth() 
  const { mutate: reDispatchBooking, data: redispatchData,error:redispatchError } = useReDispatch();
  const handleCancelBooking = async() => {
    if (selectedCancelReason === "0") {
      alert("Please select a cancel reason");
      return;
    }
    // const cancellationDetails = JSON.parse(
    //   bookingDetails?.booking_cancellation_rule
    // );
    const canCellationCharge = getTotalCancellationCharge(bookingDetails);
    await cancelBookingDriverMutate({
      client_wallet_amount: bookingDetails?.amount || 0,
      user_id: Number(user?.id),
      itinerary_id: bookingDetails?.itineraryId,
      booking_id: bookingDetails?.id,
      created_by: Number(user?.id), 
      cancellationCharges: canCellationCharge,
      estimated_final_price: bookingDetails?.estimated_final_price,
      status: selectedCancelReason,
      // ip: cancellationDetails[0]?.ip,
      driver_id: bookingDetails?.driver_id,
      reason: selectedCancelReason,
      type: bookingDetails?.booking_type,
    });
};

const getTotalCancellationCharge = (bookingData: any): number => {
  let total = 0;
  if (!bookingData?.booking_cancellation_rule) return total;
  try {
    const rules: any= JSON.parse(bookingData?.booking_cancellation_rule);
    if (Array.isArray(rules)) {
      rules.forEach((rule) => {
        if (rule.cancellation_charge) {
          total += Math.round(Number(rule.cancellation_charge));
        }
      });
    }
  } catch (error) {
    console.error('Error parsing cancellation rules:', error);
  }
  return total;
};

  const handleExecuteNoShow = () => {
    executeNoShow({
      booking_status: bookingDetails.status_id,
      driver_id: bookingDetails.driver_id,
      user_id: Number(userDetails?.id),
      mobile_no: bookingDetails.mobile_no,
      booking_ref: bookingDetails.ref,
      reason_text: "Client is  not traceable",
      remark_text: "No Show Bookings",
      booking_id: bookingDetails.booking_id,
    });
  };
  const handleChangeStatus = () => {
    if (selectedStatus === "0") {
      alert("Please select a status");
      return;
    }
    updateBookingDriverMutate({
      booking_id: bookingDetails.booking_id,
      status_c: selectedStatus,
      updated_on : new Date().toISOString(),
    });
  };
  const handleReDispatch: any = () => {
    reDispatchBooking({
      user_id: Number(userDetails?.id),
      itinerary_id: bookingDetails.itinerary_id,
      booking_id: bookingDetails.booking_id,
      booking_ref: bookingDetails.ref,
      driver_id: bookingDetails.driver_id,
      reason_text: "Redispatched because of some Processing error",
      remark_text :'Redispatched',
      booking_status: bookingDetails.status_id,
      mobile_no:bookingDetails.client_mobile,
      pick_lat:bookingDetails.pickup_latitude,
      pick_long:bookingDetails.pickup_longitude
    });
  };
  useEffect(() => {
    if (cancelBookingDriverData) {
      setAlert({
        type: "success",
        message: "Driver booking cancelled successfully!",
      });
    }

    if (updateCancleDriverError) {
      setAlert({
        type: "danger",
        message: "Failed to cancel driver booking. Please try again.",
      });
    }
  }, [cancelBookingDriverData, updateCancleDriverError]);

  useEffect(() => {
    if (updateBookingDriverData) {
      setAlert({
        type: "success",
        message: "Driver booking status updated successfully!",
      });
    }

    if (updateBookingDriverError) {
      setAlert({
        type: "danger",
        message: "Failed to update booking status. Please try again.",
      });
    }
  }, [updateBookingDriverData, updateBookingDriverError]);

  useEffect(() => {
  if (noShowData) {
    setAlert({
      type: 'success',
      message: 'Marked as No-Show successfully!',
    });
  }

  if (executeNoshowError) {
    setAlert({
      type: 'danger',
      message: 'Failed to mark No-Show. Please try again.',
    });
  }
}, [noShowData, executeNoshowError]);

  useEffect(() => {
    if (redispatchData) {
      setAlert({
        type: 'success',
        message: 'Booking re-dispatched successfully!',
      });
    }

    if (redispatchError) {
      setAlert({
        type: 'danger',
        message: 'Failed to re-dispatch booking. Please try again.',
      });
    }
  }, [redispatchData, redispatchError]);

  return (
    <>
      {successMessage && (
        <SimpleAlert
          type={successMessage.type}
          message={successMessage.message}
          onDismiss={() => setAlert(null)}
        />
      )}
      <div className="flex gap-6 p-4 justify-between">
        {/* Left Part */}
        <div className="left-actions w-1/2">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Actions</span>
            <div className="flex flex-col gap-1 items-center w-full mt-4">
              <button
                onClick={() => {
                  setExecuteCancel(!executeCancel);
                  setStatus(false);
                }}
                className="border border-gray-300 px-4 py-2 cursor-pointer w-full text-[12px]"
              >
                Execute Cancel
              </button>
              {/* <button
                onClick={() => {
                  setStatus(!status);
                  setExecuteCancel(false);
                }}
                className="border border-gray-300 px-4 py-2 cursor-pointer w-full text-[12px]"
              >
                Change Status
              </button>
              <button
                onClick={handleExecuteNoShow}
                className="border border-gray-300 px-4 py-2 cursor-pointer w-full text-[12px]"
              >
                Execute No Show
              </button>

              <button
                className="border border-gray-300 px-4 py-2 cursor-pointer w-full text-[12px]"
                onClick={() => setOpenInnerModal("claim")}
              >
                Claim
              </button>
              <button
                onClick={handleReDispatch}
                className="border border-gray-300 px-4 py-2 cursor-pointer w-full text-[12px]"
              >
                Redispatch
              </button>
              <button
                onClick={() => setOpenInnerModal("duty_slip")}
                className="border border-gray-300 px-4 py-2 cursor-pointer w-full text-[12px]"
              >
                Duty Slip
              </button>
              <button
                onClick={() => setOpenInnerModal("plac_card")}
                className="border border-gray-300 px-4 py-2 cursor-pointer w-full text-[12px]"
              >
                Plac Card
              </button> */}
            </div>
          </div>
        </div>
        {/* Right Part */}
        <div className="flex flex-col gap-1 w-1/2">
          {true && (
            <>
              <span className="text-sm text-gray-600">Specify Reason:</span>
              <div className="flex gap-2">
                <select
                  name="executeCancel"
                  className="border border-gray-300 px-4 py-2 cursor-pointer w-full text-[12px] focus:outline-none"
                  value={selectedCancelReason}
                  onChange={(e) => setSelectedCancelReason(e.target.value)}
                >
                  <option value="0">Select Reason</option>
                  {cancelReasonOptions.map((reason) => (
                    <option value={reason.value} key={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
                <button
                  className="border border-gray-300 px-2 py-2 cursor-pointer w-[max-content] text-[12px] rounded bg-gray-100"
                  onClick={handleCancelBooking}
                >
                  Save
                </button>
              </div>
            </>
          )}
          {status && (
            <div className="flex flex-col gap-1" style={{ float: "right" }}>
              <div className="flex gap-2">
                <select
                  className="border border-gray-300 px-4 py-2 cursor-pointer w-full text-[12px] focus:outline-none"
                  name="CabStatusReason"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="0">Select Status</option>
                  {statusTypeOptions.map((status) => (
                    <option value={status.value} key={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <button
                  id="ExeSubmitStatus"
                  className="border border-gray-300 px-2 py-2 cursor-pointer w-[max-content] text-[12px] rounded bg-gray-100"
                  onClick={handleChangeStatus}
                >
                  Save
                </button>
              </div>
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
