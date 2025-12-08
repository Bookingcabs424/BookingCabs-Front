import { X } from "lucide-react";
import React from "react";

interface BookingFinanceActionProps{
    openInnerModal: string;
    setOpenInnerModal: React.Dispatch<React.SetStateAction<string>>;
    setOpenModal: React.Dispatch<React.SetStateAction<string>>;
}

export default function BookingActionFinanceModal({openInnerModal,setOpenInnerModal,setOpenModal}:BookingFinanceActionProps){
    return(
        <>
              <div className="flex gap-6 p-4 justify-between">
                {/* Left Part */}
                <div className="left-actions w-1/2">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-600">Actions</span>

                    <div className="flex flex-col items-center w-full mt-4">
                   
                      <button onClick={() => setOpenInnerModal("print_voucher")} className="border border-gray-300 px-4 py-2 cursor-pointer w-full text-[12px]">
                        Print Voucher
                      </button>

                    </div>
                  </div>
                </div>
                {/* Right Part */}
                <div className="flex flex-col gap-1 w-1/2">
                  <span className="text-sm text-gray-600">Send Receipts</span>
                  <div className="flex flex-col items-center w-full mt-4">
                   
                    <button onClick={() => setOpenInnerModal("print_invoice")} className="border border-gray-300 px-4 py-2 cursor-pointer w-full text-[12px]">
                      Print Invoice
                    </button>
                  </div>

                  
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button  onClick={() => setOpenModal("")} className="border border-gray-300 cursor-pointer text-[12px] px-3 py-1 text-gray-500 rounded">
                  Close
                </button>
              </div>

              <button onClick={() => setOpenModal("")} className="cursor-pointer text-[12px] px-3 py-1 text-gray-500 absolute right-0 top-[10px]">
                <X />
              </button>
            </>
    )
}