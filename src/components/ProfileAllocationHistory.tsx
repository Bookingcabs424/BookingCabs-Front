import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowDownToLine, Printer } from "lucide-react";
import { useUnAssignedBookingMutation } from "../hooks/useCommon";
import { useEffect, useState } from "react";

interface AllocationHistory {
  sno: number;
  date: string;
  accepted: string;
  cancelled: string;
  missed: string;
  rejected: string;
}

const allocationHistorySchema = z
  .object({
    from_date: z.string().optional(),
    to_date: z.string().optional(),
  })
  .refine(
    ({ from_date, to_date }) => {
      if (from_date && to_date) {
        return new Date(from_date) <= new Date(to_date);
      }
      return true;
    },
    {
      message: "To Date should always be greater than or equal to From Date",
      path: ["to_date"],
    }
  );

type allocationHistoryData = z.infer<typeof allocationHistorySchema>;

export default function ProfileAllocationHistory() {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<allocationHistoryData>({
    resolver: zodResolver(allocationHistorySchema),
  });

  const onSubmit = (data: allocationHistoryData) => {};

  const { mutate, data: getUnAssignedBookingData } =
    useUnAssignedBookingMutation();
  const [tableData, setTableData] = useState<AllocationHistory[]>([]);

  useEffect(() => {
    if (getUnAssignedBookingData?.length) {
      const transformed = getUnAssignedBookingData.map(
        (item: any, index: number) => ({
          sno: index + 1,
          date: item.date || "N/A",
          accepted: item.accepted || "0",
          cancelled: item.cancelled || "0",
          missed: item.missed || "0",
          rejected: item.rejected || "0",
        })
      );
      setTableData(transformed);
    }
  }, [getUnAssignedBookingData]);

  return (
    <div className="space-y-3 w-full bg-white p-8 pt-10 h-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 items-end"
      >
        <div className="grid md:grid-cols-2 gap-6 w-full">
          <div className="space-y-2">
            <label className="block text-[10px] font-medium text-gray-700">
              From Date
            </label>
            <input
              {...register("from_date")}
              type="date"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-[10px]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-medium text-gray-700">
              To Date
            </label>
            <input
              {...register("to_date")}
              type="date"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-[10px]"
            />
            {errors?.to_date && (
              <p className="text-[10px] text-red-500">
                {errors?.to_date?.message}
              </p>
            )}
          </div>
        </div>
        <button className="text-[10px] bg-orange-500 text-white px-3 py-2 float-right my-2 w-[max-content] rounded-sm cursor-pointer font-[500]">
          Search
        </button>
      </form>

      <div className="border border-gray-200">
        <div className="w-full bg-gray-200 text-[12px] border-x border-gray-200 mb-2 py-2 px-2 font-[500]">
          Allocation History Allocation Details
        </div>

        <div className="overflow-auto px-4">
          <table className="w-full text-sm table-auto border-collapse">
            <thead className="bg-gray-100 text-left text-[12px]">
              <tr className="bg-gray-200">
                <th className="px-2 py-2">S.No</th>
                <th className="px-2 py-2">Date</th>
                <th className="px-2 py-2">Accepted</th>
                <th className="px-2 py-2">Cancelled</th>
                <th className="px-2 py-2">Missed</th>
                <th className="px-2 py-2">Rejected</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((item, index) => (
                  <tr
                    key={index}
                    className="text-[12px] border-t hover:bg-gray-50"
                  >
                    <td className="px-2 py-2">{item.sno}</td>
                    <td className="px-2 py-2">{item.date}</td>
                    <td className="px-2 py-2">{item.accepted}</td>
                    <td className="px-2 py-2">{item.cancelled}</td>
                    <td className="px-2 py-2">{item.missed}</td>
                    <td className="px-2 py-2">{item.rejected}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No allocation history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center gap-3 my-4">
        <button className="flex items-center gap-2 bg-gray-200 border border-gray-500 px-2 py-1 rounded cursor-pointer hover:bg-gray-300 text-[10px]">
          <ArrowDownToLine className="w-3 h-3 text-gray-600" />
          Download CSV
        </button>
        <button className="flex items-center gap-2 text-[10px] bg-gray-200 border border-gray-500 px-2 py-1 rounded cursor-pointer hover:bg-gray-300">
          <Printer className="w-3 h-3 text-gray-600" />
          Print
        </button>
      </div>
    </div>
  );
}
