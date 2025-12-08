"use client";
import React, { useCallback, useEffect, useState } from "react";
// import FindQuotationForm from "@/components/QuotationForm";
import BookingTable from "@/components/common/Table";
import {
  deleteQuotation,
  usefetchQuotation,
  useUnAssignedBookingMutation,
} from "@/hooks/useCommon";
import Swal from "sweetalert2";
import BookingHistoryTable from "@/components/BookingHistoryList";

interface unassignedbooking {
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

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: any;
  render?: (value: any, row?: any) => React.ReactNode;
  hidden?: boolean;
}

const Quotation = () => {
  const { mutate, data: bookingHistoryList, error } = usefetchQuotation();
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const { mutate: unAssignedBookingMutate, data: getUnAssignedBookingData } =
    useUnAssignedBookingMutation();
  const {
    mutate: DeleteMutation,
    data: deleted,
    isSuccess: isDeleted,
  } = deleteQuotation();
  useEffect(() => {
    if (isDeleted) {
      // fetchData();
    }
  }, [isDeleted]);
  const fetchData = useCallback(() => {
    mutate({
      page,
      pageSize: Number(pageSize) || 10,
    });
  }, [mutate, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const nextPage = () => {
    page && setPage(page + 1);
  };
  const prevPage = () => {
    page && page > 1 ? setPage(page - 1) : null;
  };
  const deleteQuotationHandler = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteMutation({ auto_id: id, status: "2" });
        Swal.fire("Deleted!", "Your quotation has been deleted.", "success");
      }
    });
  };

  return (
    <>
      {/* <FindQuotationForm
      mutate={mutate}
      /> */}
      {/* <TransportBookingDateTimeSelect /> */}

      <div
        className={`overflow-x-auto mx-auto bg-white p-2 rounded-md shadow-md max-w-[90vw] ${
          !true? "lg:max-w-[75vw]" : "lg:max-w-[90vw]"
        }`}
      >
        <BookingHistoryTable
          data={bookingHistoryList?.result || []}
          pagination={pagination}
          page={page}
          setPage={setPage}
          nextPage={nextPage}
          prevPage={prevPage}
          setPageSize={setPageSize}
          deleteQuotationHandler={deleteQuotationHandler}
        />
      </div>
    </>
  );
};

export default Quotation;
