import { Search } from "lucide-react";
import CancellationRecordTable from "./CancellationRecordTable";

const bookingTypes = [
  "Rental",
  "City Taxi",
  "Airport Transfer",
  "Outstation",
  "Oneway",
  "Activity",
  "Transport Package",
];

const bookingStatus = [
  "Registered",
  "Processing",
  "Accepted",
  "Located",
  "Reported",
  "On Wait",
  "On Trip",
  "Trip Done",
  "Rejected",
  "Driver Cancel",
  "Paid",
  "Credit",
  "Manually Assign",
  "No Show Bookings",
  "Dispose by CC",
  "cancel by CC",
  "All",
  "Expired",
  "Client Cancel",
  "Vendor Cancel",
  "Getting Late",
  "Break Down",
  "Wrong Address",
  "Other",
  "Hold",
  "Quotation",
  "Shopping Cart",
];

export default function CancellationDeadlineForm() {
  return (
    <div className="py-5">
      <div className="cancellation-deadline-form bg-white shadow-md border border-gray-300 m-6 mb-3 mt-0 rounded-sm sm:m-12 sm:mb-3 sm:mt-0">
        <h1 className="bg-gray-300 py-3 px-5  font-semibold flex items-center gap-2 text-sm sm:text-base">
          Cancellation Deadline
        </h1>
        <div className="grid grid-cols-1 p-3 sm:p-6 gap-3 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col py-1">
            <label
              htmlFor="firstName"
              className="font-semibold text-[12px] text-sm"
            >
              Booking Type
            </label>
            <select
              name="bookingType"
              id=""
              className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
            >
              <option value="select" defaultValue="select">
                Select Booking Type
              </option>
              {bookingTypes.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col py-1">
            <label
              htmlFor="bookingReference"
              className="font-semibold text-[12px] text-sm"
            >
              Booking Reference
            </label>
            <input
              type="text"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
              placeholder="Enter Booking Reference"
            />
          </div>
          <div className="flex flex-col py-1">
            <label
              htmlFor="bookingStatus"
              className="font-semibold text-[12px] text-sm"
            >
              Booking Status
            </label>
            <select
              name="bookingStatus"
              id=""
              className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
            >
              <option value="select" defaultValue="select">
                Select Booking Type
              </option>
              {bookingStatus.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col py-1">
            <label
              htmlFor="pickupFrom"
              className="font-semibold text-[12px] text-sm"
            >
              Pickup From Date
            </label>
            <input
              type="date"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
            />
          </div>
          <div className="flex flex-col py-1">
            <label
              htmlFor="mobile"
              className="font-semibold text-[12px] text-sm"
            >
              Pickup To Date
            </label>
            <input
              type="date"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end p-4 pt-0">
          <button className="text-[12px] sm:text-sm cursor-pointer py-2 px-6 rounded-sm bg-[#101828] text-white">
            Search
          </button>
          <button className="text-[12px] sm:text-sm cursor-pointer py-2 px-6 rounded-sm bg-[#101828] text-white">
            Clear
          </button>
        </div>
      </div>
      <CancellationRecordTable />
    </div>
  );
}
