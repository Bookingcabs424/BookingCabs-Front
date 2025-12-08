import { ChevronLeft, RefreshCcw, Save, Upload } from "lucide-react";

interface AddMemberInterface {
  activeForm: string;
  setActiveForm: React.Dispatch<React.SetStateAction<string>>;
}

export default function AddMembershipForm({
  activeForm,
  setActiveForm,
}: AddMemberInterface) {
  return (
    <>
      <div className="membership-form-btns flex flex-col items-end w-full py-6 px-6">
        <div className="flex gap-2 justify-end items-end">
          <button
            onClick={() => setActiveForm("package")}
            className="StatementAccounts flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#367FA9] text-white font-semibold"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>

          <button className="StatementAccounts flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#009551] text-white font-semibold">
            <RefreshCcw className="w-5 h-5" /> Reset
          </button>

          <button className="StatementAccounts flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#E08E0B] text-white font-semibold">
            <Save className="w-5 h-5" /> Save
          </button>
        </div>
      </div>

      <div className="add-member-form bg-white shadow-md border border-gray-300 m-6 mb-3 mt-0 rounded-sm sm:m-12 sm:mb-3 sm:mt-0">
        <h1 className="bg-gray-300 py-3 px-5  font-semibold flex items-center gap-2 text-sm sm:text-base">
          Basic Information
        </h1>
        <div className="grid grid-cols-1 p-3 px-5 sm:px-12 sm:p-6 gap-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <label
              htmlFor="bookingReference"
              className="font-semibold text-[12px] text-sm"
            >
              Name of Package <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] col-span-2 sm:text-sm lg:col-span-1"
              placeholder="Enter Booking Reference"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <label
              htmlFor="pickupFrom"
              className="font-semibold text-[12px] text-sm"
            >
              Brief Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] col-span-2 sm:text-sm lg:col-span-1"
              placeholder="Enter Brief Description"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <label
              htmlFor="mobile"
              className="font-semibold text-[12px] text-sm"
            >
              Upload logo of Package <span className="text-red-500">*</span>
            </label>
            <div className="relative inline-block">
              <input type="file" id="fileUpload" className="hidden" />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-[#367FA9] text-white text-sm rounded-sm transition-colors flex items-center gap-2"
              >
                <Upload className="w-5 h-5"/> Upload File
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <label
              htmlFor="mobile"
              className="font-semibold text-[12px] text-sm"
            >
              Base Price After Discount. (0 detes free) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] col-span-2 sm:text-sm lg:col-span-1"
              placeholder="100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <label
              htmlFor="mobile"
              className="font-semibold text-[12px] text-sm"
            >
              Package renewal for (0 detes forever or never expire) <span className="text-red-500">*</span>
            </label>
            <div className="relative col-span-2 lg:col-span-1">
                <input
              type="text"
              className="border border-gray-300 p-2 px-3 outline-none pr-[65px] rounded-sm w-full text-[12px] sm:text-sm"
              placeholder="Renew"
            />
            <span className="absolute right-[8px] top-[9px] text-sm text-gray-500">Day(s)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <label
              htmlFor="mobile"
              className="font-semibold text-[12px] text-sm"
            >
              Package Renew tification Mail Time <span className="text-red-500">*</span>
            </label>
            <div className="relative col-span-2 lg:col-span-1">
                <input
              type="text"
              className="border border-gray-300 p-2 px-3 outline-none pr-[65px] rounded-sm w-full text-[12px] sm:text-sm"
              placeholder="Notification"
            />
            <span className="absolute right-[8px] top-[9px] text-sm text-gray-500">Day(s)</span>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-3 gap-2 py-1">
            <label
              htmlFor="mobile"
              className="font-semibold text-[12px] text-sm col-span-2 md:col-span-1"
            >
              Show Relator? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center col-span-2 gap-6 sm:gap-12  sm:col-span-1">
              <div className="flex item-center gap-1">
                <input type="radio" name="realtor" id="" />
                <label htmlFor="realtor" className="font-[500] text-sm">
                YES</label>
              </div>
              <div className="flex item-center gap-1">
                <input type="radio" name="realtor" id="" />
                <label htmlFor="realtor" className="font-[500] text-sm">
                NO</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-3 gap-2 py-1">
            <label
              htmlFor="mobile"
              className="font-semibold text-[12px] text-sm col-span-2 md:col-span-1"
            >
              Agent Commissioning? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center col-span-2 gap-6 sm:gap-12  sm:col-span-1">
              <div className="flex item-center gap-1">
                <input type="radio" name="agentCommission" id="" />
                <label htmlFor="agentCommission" className="font-[500] text-sm">
                YES</label>
              </div>
              <div className="flex item-center gap-1">
                <input type="radio" name="agentCommission" id="" />
                <label htmlFor="agentCommission" className="font-[500] text-sm">
                NO</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-3 gap-2 py-1">
            <label
              htmlFor="mobile"
              className="font-semibold text-[12px] text-sm col-span-2 md:col-span-1"
            >
              Enquiry Systems? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center col-span-2 gap-6 sm:gap-12  sm:col-span-1">
              <div className="flex item-center gap-1">
                <input type="radio" name="enquiry" id="" />
                <label htmlFor="enquiry" className="font-[500] text-sm">
                YES</label>
              </div>
              <div className="flex item-center gap-1">
                <input type="radio" name="enquiry" id="" />
                <label htmlFor="enquiry" className="font-[500] text-sm">
                NO</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-3 gap-2 py-1">
            <label
              htmlFor="mobile"
              className="font-semibold text-[12px] text-sm col-span-2 md:col-span-1"
            >
              Alert Systems? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center col-span-2 gap-6 sm:gap-12  sm:col-span-1">
              <div className="flex item-center gap-1">
                <input type="radio" name="alert" id="" />
                <label htmlFor="alert" className="font-[500] text-sm">
                YES</label>
              </div>
              <div className="flex item-center gap-1">
                <input type="radio" name="alert" id="" />
                <label htmlFor="alert" className="font-[500] text-sm">
                NO</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-3 gap-2 py-1">
            <label
              htmlFor="mobile"
              className="font-semibold text-[12px] text-sm col-span-2 md:col-span-1"
            >
              SMS Systems? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center col-span-2 gap-6 sm:gap-12  sm:col-span-1">
              <div className="flex item-center gap-1">
                <input type="radio" name="sms" id="" />
                <label htmlFor="sms" className="font-[500] text-sm">
                YES</label>
              </div>
              <div className="flex item-center gap-1">
                <input type="radio" name="sms" id="" />
                <label htmlFor="sms" className="font-[500] text-sm">
                NO</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-3 gap-2 py-1">
            <label
              htmlFor="mobile"
              className="font-semibold text-[12px] text-sm col-span-2 md:col-span-1"
            >
              News management? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center col-span-2 gap-6 sm:gap-12  sm:col-span-1">
              <div className="flex item-center gap-1">
                <input type="radio" name="news" id="" />
                <label htmlFor="news" className="font-[500] text-sm">
                YES</label>
              </div>
              <div className="flex item-center gap-1">
                <input type="radio" name="news" id="" />
                <label htmlFor="news" className="font-[500] text-sm">
                NO</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-3 gap-2 py-1">
            <label
              htmlFor="mobile"
              className="font-semibold text-[12px] text-sm col-span-2 md:col-span-1"
            >
              Gallery management? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center col-span-2 gap-6 sm:gap-12  sm:col-span-1">
              <div className="flex item-center gap-1">
                <input type="radio" name="gallery" id="" />
                <label htmlFor="gallery" className="font-[500] text-sm">
                YES</label>
              </div>
              <div className="flex item-center gap-1">
                <input type="radio" name="gallery" id="" />
                <label htmlFor="gallery" className="font-[500] text-sm">
                NO</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-3 gap-2 py-1">
            <label
              htmlFor="mobile"
              className="font-semibold text-[12px] text-sm col-span-2 md:col-span-1"
            >
              Advertise management? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center col-span-2 gap-6 sm:gap-12  sm:col-span-1">
              <div className="flex item-center gap-1">
                <input type="radio" name="advertise" id="" />
                <label htmlFor="advertise" className="font-[500] text-sm">
                YES</label>
              </div>
              <div className="flex item-center gap-1">
                <input type="radio" name="advertise" id="" />
                <label htmlFor="advertise" className="font-[500] text-sm">
               NO</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-3 gap-2 py-1">
            <label
              htmlFor="mobile"
              className="font-semibold text-[12px] text-sm col-span-2 md:col-span-1"
            >
              Discount Coupon? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center col-span-2 gap-6 sm:gap-12  sm:col-span-1">
              <div className="flex item-center gap-1">
                <input type="radio" name="discount" id="" />
                <label htmlFor="discount" className="font-[500] text-sm">
                YES</label>
              </div>
              <div className="flex item-center gap-1">
                <input type="radio" name="discount" id="" />
                <label htmlFor="discount" className="font-[500] text-sm">
                NO</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
