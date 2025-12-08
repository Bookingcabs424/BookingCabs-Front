import { Banknote, Search } from "lucide-react";

const bookingStatus = [
  "Registered",
  "Accepted",
  "Reported",
  "On Trip",
  "Completed",
  "Rejected",
  "Paid",
  "No Show Bookings",
  "Future",
  "User Cancel",
  "Current",
];

const bookingType = [
  "Rental",
  "City Taxi",
  "Airport Transfer",
  "Outstation",
  "One Way",
  "Activity",
  "Transport Package",
];

const vehicleTypes = [
  "Hatch Back",
  "Comfort Sedan",
  "Prime Compact",
  "Prime",
  "Prime Plus",
  "Prime SUV Plus",
  "Premium Sedan",
  "Luxury Sedan",
  "Luxury Sedan II",
  "Super Luxury Sedan",
  "Super Luxury Sedan II",
  "Compact MUV",
  "Luxury SUV",
  "Delux Van (9 Seats)",
  "Luxury Van",
  "Luxury Van Plus",
  "Mini Coach (9 Seats)",
  "Mini Coach (12 Seats)",
  "Mini Coach (16 Seater)",
  "Mini Coach (20 Seater)",
  "Mini Coach (27 Seats)",
  "Deluxe Coach (35 Seater)",
  "Deluxe Coach (41 Seats)",
  "Mini Coach (12 Seater)",
  "Luxury Coach (45 Seater)",
  "Super Cars",
  "Deluxe Coach (27 Seats)",
];

export default function StatementAccountForm() {
  return (
    <div className="py-5">
      <div className="statement-accounts-form bg-white shadow-md border border-gray-300 m-6 mb-3 mt-0 rounded-sm sm:m-8 sm:mb-3 sm:mt-0">
        <h1 className="bg-gray-300 py-3 px-5  font-semibold flex items-center gap-2 text-sm sm:text-base">
          Statement of Accounts
        </h1>

        <div className="grid grid-cols-1 p-6 pb-0 sm:gap-3 sm:grid-cols-2 md:grid-cols-3 ">
          <div className="flex flex-col py-2">
            <label
              htmlFor="firstName"
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
          <div className="flex flex-col py-2">
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
                Select Booking Status
              </option>
              {bookingStatus.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col py-2">
            <label
              htmlFor="agentReference"
              className="font-semibold text-[12px] text-sm"
            >
              Agent Reference
            </label>
            <input
              type="text"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
              placeholder="Enter Agent Reference"
            />
          </div>
          <div className="flex flex-col py-2">
            <label
              htmlFor="bookedCity"
              className="font-semibold text-[12px] text-sm"
            >
              Booked City
            </label>
            <textarea
              name=""
              id=""
              placeholder="Enter Booked City"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
              rows={1}
            ></textarea>
          </div>

          <div className="flex flex-col py-2">
            <label
              htmlFor="passengerFirsttName"
              className="font-semibold text-[12px] text-sm"
            >
              Passenger First Name
            </label>
            <input
              type="text"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
              placeholder="Passenger First Name"
            />
          </div>

          <div className="flex flex-col py-2">
            <label
              htmlFor="passengerLastName"
              className="font-semibold text-[12px] text-sm"
            >
              Passenger Last Name
            </label>
            <input
              type="text"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
              placeholder="Passenger Last Name"
            />
          </div>
        </div>

        <div className="grid px-4 sm:py-3 pb-6 sm:gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col py-2">
            <label
              htmlFor="bookingType"
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
              {bookingType.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col py-2">
            <label
              htmlFor="vehicleType"
              className="font-semibold text-[12px] text-sm"
            >
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              id=""
              className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
            >
              <option value="select" defaultValue="select">
                Select Vehicle Type
              </option>
              {vehicleTypes.map((vehicleType) => (
                <option value={vehicleType} key={vehicleType}>
                  {vehicleType}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 py-1">
            <label
              htmlFor="passengerFirsttName"
              className="font-semibold text-[12px] text-sm"
            >
              From Date
            </label>
            <input
              type="date"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
            />
          </div>

          <div className="flex flex-col gap-1 py-1">
            <label
              htmlFor="passengerFirsttName"
              className="font-semibold text-[12px] text-sm"
            >
              To Date
            </label>
            <input
              type="date"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end p-4 pt-0">
          <button className="text-[12px] sm:text-sm cursor-pointer py-2 px-4 rounded-sm bg-[#101828] text-white">
            Search
          </button>
          <button className="text-[12px] sm:text-sm cursor-pointer py-2 px-4 rounded-sm bg-[#101828] text-white">
            Clear
          </button>
        </div>
      </div>

      <div className="flex items-start justify-between px-8">
        <button className="pay-now-btn flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#101828] text-white whitespace-nowrap">
          <Banknote /> Pay Now
        </button>

        <div className="flex flex-wrap gap-2 justify-end sm:justify-end">

            <button className="pay-now-btn flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#bcd46a] text-black font-semibold">
          <Banknote /> Mark Paid
        </button>

        <button className="pay-now-btn flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#009551] text-black font-semibold">
          <Banknote /> Mark Unpaid
        </button>

        <button className="pay-now-btn flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#ff5500] text-black font-semibold">
          <Banknote /> Mark Cancel
        </button>

        <button className="pay-now-btn flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#587ea3] text-white font-semibold">
          <Banknote /> Mark Overdue
        </button>

        <button className="pay-now-btn flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#1ab7ea] text-black font-semibold">
          <Banknote /> Mark Collection
        </button>
        </div>

        
      </div>
    </div>
  );
}
