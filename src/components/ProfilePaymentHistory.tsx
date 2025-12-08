import { useUnAssignedBookingMutation } from "../hooks/useCommon";
import { ArrowDownToLine } from "lucide-react";
import { useEffect, useState } from "react";

interface PaymentHistory {
  sno: number;
  deposit_date: string;
  ref_no: string;
  payment_mode: string;
  request_amount: string;
  approved_amount: string;
  deposit_bank: string;
  deposit_branch: string;
  remark: string;
  status: string;
}

interface PaymentHistory2 {
  sno: number;
  deposit_date: string;
  ref_no: string;
  payment_mode: string;
  amount: string;
  deposit_bank: string;
  deposit_branch: string;
  remark: string;
  status: string;
}

export default function ProfilePaymentHistory() {
  const { data: getUnAssignedBookingData, mutate } =
    useUnAssignedBookingMutation();
  const [paymentData, setPaymentData] = useState<PaymentHistory[]>([]);
  const [paymentData2, setPaymentData2] = useState<PaymentHistory2[]>([]);

  useEffect(() => {
    if (getUnAssignedBookingData?.length) {
      const mapped = getUnAssignedBookingData.map(
        (item: any, index: number) => ({
          sno: index + 1,
          deposit_date: item?.deposit_date || "N/A",
          ref_no: item?.ref_no || "N/A",
          payment_mode: item?.payment_mode || "N/A",
          request_amount: item?.request_amount || "0",
          approved_amount: item?.approved_amount || "0",
          deposit_bank: item?.deposit_bank || "N/A",
          deposit_branch: item?.deposit_branch || "N/A",
          remark: item?.remark || "-",
          status: item?.status || "Pending",
        })
      );
      setPaymentData(mapped);
    }
  }, [getUnAssignedBookingData]);

  useEffect(() => {
    if (getUnAssignedBookingData?.length) {
      const mapped = getUnAssignedBookingData.map(
        (item: any, index: number) => ({
          sno: index + 1,
          deposit_date: item?.deposit_date || "N/A",
          ref_no: item?.ref_no || "N/A",
          payment_mode: item?.payment_mode || "N/A",
          amount: item?.amount || "0",
          deposit_bank: item?.deposit_bank || "N/A",
          deposit_branch: item?.deposit_branch || "N/A",
          remark: item?.remark || "-",
          status: item?.status || "Pending",
        })
      );
      setPaymentData2(mapped);
    }
  }, [getUnAssignedBookingData]);
  return (
    <>
      <div className="space-y-3 w-full bg-white p-4 pt-10 h-full">
        <div className="border border-gray-200">
          <div className="w-full bg-gray-200 text-sm border-x border-gray-200 mb-2 py-2 px-2 font-[500]">
            Payment History
          </div>
          <div className="w-full p-3">
            <div className="w-full bg-white rounded-md">
              <h2 className="text-lg font-medium mb-4">Payment History</h2>

              <div className="overflow-auto border border-gray-200 rounded-md">
                <table className="w-full text-sm table-auto border-collapse font-[400]">
                  <thead className="bg-gray-100 text-left font-[400] text-[10px]">
                    <tr className="bg-gray-200">
                      <th className="px-2 py-2">S.No</th>
                      <th className="px-2 py-2">Deposit Date</th>
                      <th className="px-2 py-2">Ref No</th>
                      <th className="px-2 py-2">Payment Mode</th>
                      <th className="px-2 py-2">Request Amount</th>
                      <th className="px-2 py-2">Approved Amount</th>
                      <th className="px-2 py-2">Deposit Bank</th>
                      <th className="px-2 py-2">Deposit Branch</th>
                      <th className="px-2 py-2">Remark</th>
                      <th className="px-2 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentData.length > 0 ? (
                      paymentData.map((item) => (
                        <tr
                          key={item.sno}
                          className="text-[10px] border-t hover:bg-gray-50"
                        >
                          <td className="px-2 py-2">{item.sno}</td>
                          <td className="px-2 py-2">{item.deposit_date}</td>
                          <td className="px-2 py-2">{item.ref_no}</td>
                          <td className="px-2 py-2">{item.payment_mode}</td>
                          <td className="px-2 py-2">₹{item.request_amount}</td>
                          <td className="px-2 py-2">₹{item.approved_amount}</td>
                          <td className="px-2 py-2">{item.deposit_bank}</td>
                          <td className="px-2 py-2">{item.deposit_branch}</td>
                          <td className="px-2 py-2">{item.remark}</td>
                          <td className="px-2 py-2">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                                item.status === "Approved"
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={10}
                          className="text-center py-4 text-gray-500"
                        >
                          No payment history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="w-full p-3">
            <div className="w-full bg-white rounded-md">
              <h2 className="text-lg font-medium mb-4">Payment Summary</h2>

              <div className="overflow-auto border border-gray-200 rounded-md">
                <table className="w-full text-sm table-auto border-collapse font-[400]">
                  <thead className="bg-gray-100 text-left font-[400] text-[10px]">
                    <tr className="bg-gray-200">
                      <th className="px-2 py-2">S.No</th>
                      <th className="px-2 py-2">Deposit Date</th>
                      <th className="px-2 py-2">Ref No</th>
                      <th className="px-2 py-2">Payment Mode</th>
                      <th className="px-2 py-2">Amount</th>
                      <th className="px-2 py-2">Deposit Bank</th>
                      <th className="px-2 py-2">Deposit Branch</th>
                      <th className="px-2 py-2">Remark</th>
                      <th className="px-2 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentData2.length > 0 ? (
                      paymentData2.map((item) => (
                        <tr
                          key={item.sno}
                          className="text-[10px] border-t hover:bg-gray-50"
                        >
                          <td className="px-2 py-2">{item.sno}</td>
                          <td className="px-2 py-2">{item.deposit_date}</td>
                          <td className="px-2 py-2">{item.ref_no}</td>
                          <td className="px-2 py-2">{item.payment_mode}</td>
                          <td className="px-2 py-2">₹{item.amount}</td>
                          <td className="px-2 py-2">{item.deposit_bank}</td>
                          <td className="px-2 py-2">{item.deposit_branch}</td>
                          <td className="px-2 py-2">{item.remark}</td>
                          <td className="px-2 py-2">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                                item.status === "Approved"
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={9}
                          className="text-center py-4 text-gray-500"
                        >
                          No payment summary found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 my-4 mx-5">
            <button className="flex items-center gap-2 text-[10px] bg-gray-200 border border-gray-500 px-2 py-1 rounded cursor-pointer hover:bg-gray-300">
              <ArrowDownToLine className="w-3 h-3 text-gray-600" />
              Download CSV
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
