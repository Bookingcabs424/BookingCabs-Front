import { Shield } from "lucide-react";

export default function ProfileSecurityForm() {
  return (
    <form className="right-form border w-full bg-white border-gray-300">
      <div className="px-6 py-6 gap-3 w-full lg:px-6 xl:gap-6">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <Shield className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-[16px] font-semibold text-gray-800">
                OTP Security Status
              </h3>
            </div>
        <div className="w-full grid grid-cols-4 py-6">
          <div className="flex items-center gap-2">
            <input type="radio" name="active" id="" />
            <label className="text-sm font-[500]" htmlFor="active">Active</label>
          </div>
          <div className="flex items-center gap-2">
            <input defaultChecked type="radio" name="active" id="" />
            <label className="text-sm font-[500]" htmlFor="inactive">Inactive</label>
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-end items-end py-6 px-6 sm:px-12">
        <button
          type="submit"
          className="StatementAccounts flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 sm:py-2 sm:px-4 rounded-sm w-[max-content] bg-[#E08E0B] text-white font-semibold"
        >
          Save
        </button>
      </div>
    </form>
  );
}
