"use client";

import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { NotebookPen } from "lucide-react"; // Lucide icon
import BookingTable from "./common/Table";
import {
  useUnAssignedBookingMutation,
  useVendorAcceptedJob,
  useBiddingMutation,
} from "../hooks/useCommon";
import TripDetailModal from "./TripDetailModal";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: any;
  render?: (value: any, row?: any) => React.ReactNode;
  hidden?: boolean;
}
interface approvalPending {
  sno: number;
  itinerary_id: number;
  id: string;
  pickup_time: string;
  vehicle: string;
  booking_type: string;
  duty_amount: string;
  partner: string;
  pick_up: string;
  drop_area: string;
  status: string;
  action: string;
  vehicle_model: string;
  booking_id: number;
}

export default function ApprovalPendingTable() {
  const { mutate: unAssignedBookingMutate, data: getUnAssignedBookingData } =
    useUnAssignedBookingMutation();
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [selectedItineraryId, setSelectedItineraryId] = useState<string | null>(
    null
  );

  const { mutate, data: biddingData, isError } = useBiddingMutation();

  const { user } = useAuth();
  useEffect(() => {
    handleBiddingFetch();
  }, []);
  const handleBiddingFetch = () => {
    // need to make dyanmically
    mutate({
      page: 1,
      limit: 10,
    });
  };
  const { mutate: vendorAcceptJobMutate, data: vendorAcceptJobData } =
    useVendorAcceptedJob();
  const onUnassignedBookingClaim = (booking_id: number) => {
    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    vendorAcceptJobMutate(
      { booking_id, id: user.id },
      {
        onSuccess: (data: any) => {
          if (data.status === "success") {
            toast.info(data?.data?.driverBalance?.message);
          } else {
            toast.error(
              data?.data?.driverBalance?.message || "Failed to claim booking"
            );
          }
          handleBiddingFetch();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Something went wrong");
        },
      }
    );
  };
  const formatTo12Hour = (time24: string) => {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };
  const approvalPendingColumns: Column[] = [
    { key: "sno", header: "S.No", sortable: true, filterable: true },
    {
      key: "itinerary_id",
      header: "Itinerary Id",
      sortable: true,
      filterable: true,
    },
    { key: "id", header: "Bkg Id", sortable: true, filterable: true },
    {
      key: "pickup_time",
      header: "Pickup Time",
      sortable: true,
      render: (_: string, row: any) => (
        <div className="space-y-1">
          <div className="font-medium">{row.pickup_time[0]}</div>
          <div className="font-medium">
            {formatTo12Hour(row.pickup_time[1])}
          </div>
        </div>
      ),
    },
    {
      key: "vehicle",
      header: "Vehicle",
      sortable: true,
      render: (_: string, row: any) => (
        <div className="space-y-1">
          <div className="font-medium">{row.vehicle}</div>
          <div
            className=" text-gray-600 truncate max-w-[100px]"
            title={row.vehicle_model}
          >
            {row.vehicle_model || "N/A"}
          </div>
        </div>
      ),
    },
    { key: "driver", header: "Driver", sortable: true },
    {
      key: "booking_type",
      header: "Booking Type",
      sortable: true,
      render: (_: string, row: any) => (
        <div className="space-y-1">
          <div className="font-medium">{row.booking_type}</div>
          <div>{row.local_package}</div>
          <div>
            {" "}
            <span className="font-medium"> Distance: </span>
            {row.approx_after_km}
          </div>
          <button
            onClick={() => tripDetailHandler(row.itinerary_id)}
            className="text-blue-600 hover:text-blue-800 underline "
          >
            Trip Detail
          </button>
        </div>
      ),
    },
    {
      key: "duty_amount",
      header: "Duty Amount",
      sortable: true,
      render: (_: string, row: any) => (
        <div className="space-y-1">
          <div>
            {" "}
            <span className="font-medium"> Duty Amount: </span>₹{" "}
            {row.duty_amount}
          </div>
          <div>
            {" "}
            <span className="font-medium"> Extra KM: </span>₹
            {row.min_per_km_charge}
          </div>
          <div>
            {" "}
            <span className="font-medium"> Extra HR: </span>₹
            {row.min_per_hr_charge}
          </div>
          <div>
            <span className="font-medium"> DA: </span> ₹{row.night_charge_price}
          </div>
        </div>
      ),
    },
    // {
    //   key: "partner",
    //   header: "Partner",
    //   sortable: true,
    //   render: (_: string, row: any) => (
    //     <div className="space-y-1">
    //       <div>{row.domain_name}</div>
    //       <div>{row.device_type}</div>
    //     </div>
    //   ),
    // },
    {
      key: "departure",
      header: "Departure",
      sortable: true,
      render: (_: string, row: any) => (
        <div className="space-y-1">
          <div
            className=" text-gray-600 truncate max-w-[80px]"
            title={row.departure}
          >
            {row.departure}
          </div>
        </div>
      ),
    },
    {
      key: "drop_area",
      header: "Drop Area",
      sortable: true,
      render: (_: string, row: any) => (
        <div className="space-y-1">
          <div
            className=" text-gray-600 truncate max-w-[80px] "
            title={row.drop_area}
          >
            {row.drop_area}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (_: string, row: any) => (
        <div className="space-y-1">
          <div
            className=" text-gray-600 truncate max-w-[40px] "
            title={row.status}
          >
            {row?.status}
          </div>
        </div>
      ),
    },
    // { key: "status", header: "Status", sortable: true },
    {
      key: "action",
      header: "Action",
      sortable: false,
      render: (value: string, row: any) => (
        <button
          onClick={() => onUnassignedBookingClaim(row?.booking_id)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Accept
        </button>
      ),
    },
    { key: "booking_id", header: "booking_id", sortable: false, hidden: true },
  ];

  const approvalPendingData: approvalPending[] = getUnAssignedBookingData?.map(
    (item: any, index: number) => ({
      sno: index + 1,
      itinerary_id: item.itinerary_id,
      id: item.ref,
      pickup_time: item?.ordertime?.split(" "),
      vehicle: item.vehicle,
      booking_type: item?.booking_type,
      approx_after_km: item?.approx_after_km || "N/A",
      duty_amount: item?.estimated_price_before_markup || 0,
      min_per_km_charge: item?.min_per_km_charge || 0,
      min_per_hr_charge: item?.min_per_hr_charge || 0,
      night_charge_price: item?.night_charge_price || 0,
      partner: item.domain_name || "N/A",
      device_type: item.device_type || "N/A",
      pick_up: item?.pickup_area || "N/A",
      drop_area: item?.drop_area || "N/A",
      status: item?.status || "N/A",
      departure: item?.departure || "N/A",
      vehicle_model: item?.vehicle_model || "N/A",
      local_package: item?.local_pkg_name || "N/A",
      ref: item?.ref,
      booking_id: item?.id,
    })
  );
  const tripDetailHandler = (itineraryId: string) => {
    setSelectedItineraryId(itineraryId);
    setIsTripModalOpen(true);
  };
  return (
    <div className="sm:p-4">
      <BookingTable
        heading={[{ heading: "Approval Pending" }]}
        data={approvalPendingData}
        columns={approvalPendingColumns}
        searchable={true}
        filterable={true}
        sortable={false}
      />
      <TripDetailModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        itinearyId={selectedItineraryId || ""}
      />
    </div>
  );
}
