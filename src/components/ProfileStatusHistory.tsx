import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUnAssignedBookingMutation } from "../hooks/useCommon";
import { useEffect, useState } from "react";
import { ArrowDownToLine, Printer } from "lucide-react";

interface StatusHistory {
  sno: number;
  date: string;
  login_time: string;
  logout_time: string;
  total_hours: string;
}

const statusHistorySchema = z
  .object({
    from_date: z.string().optional(),
    to_date: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.from_date && data.to_date) {
        return new Date(data.from_date) <= new Date(data.to_date);
      }
      return true;
    },
    {
      message: "To Date must be greater than or equal to From Date",
      path: ["to_date"],
    }
  );

type statusHistoryData = z.infer<typeof statusHistorySchema>;

export default function ProfileStatusHistory() {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<statusHistoryData>({
    resolver: zodResolver(statusHistorySchema),
  });

  const onSubmit = (data: statusHistoryData) => {};

  const { data: getUnAssignedBookingData, mutate } =
    useUnAssignedBookingMutation();
  const [statusData, setStatusData] = useState<StatusHistory[]>([]);

  useEffect(() => {
    if (getUnAssignedBookingData?.length) {
      const mapped = getUnAssignedBookingData.map(
        (item: any, index: number) => ({
          sno: index + 1,
          date: item.date || "N/A",
          login_time: item.login_time || "N/A",
          logout_time: item.logout_time || "N/A",
          total_hours: item.total_hours || "N/A",
        })
      );
      setStatusData(mapped);
    }
  }, [getUnAssignedBookingData]);

  return (
    <div className="space-y-3 w-full bg-white p-8 pt-10 h-full border border-gray-200">
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
            <div className="relative">
              <input
                {...register("to_date")}
                type="date"
                className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-[10px]"
              />
              {errors?.to_date && (
                <p className="text-[10px] text-red-500">
                  {errors.to_date.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="text-[10px] bg-orange-500 text-white py-1 px-3 float-right my-2 w-[max-content] rounded-sm cursor-pointer font-[500]"
        >
          Search
        </button>
      </form>

      <div className="border border-gray-200">
        <div className="w-full bg-gray-200 text-[12px] border-x border-gray-200 mb-2 py-2 px-2 font-[500]">
          Status History Login Details
        </div>

        <div className="overflow-auto px-4">
          <table className="w-full text-sm table-auto border-collapse">
            <thead className="bg-gray-100 text-left text-[12px]">
              <tr className="bg-gray-200">
                <th className="px-2 py-2">S.No</th>
                <th className="px-2 py-2">Date</th>
                <th className="px-2 py-2">Login Time</th>
                <th className="px-2 py-2">Logout Time</th>
                <th className="px-2 py-2">Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {statusData.length > 0 ? (
                statusData.map((item, index) => (
                  <tr
                    key={index}
                    className="text-[12px] border-t hover:bg-gray-50"
                  >
                    <td className="px-2 py-2">{item.sno}</td>
                    <td className="px-2 py-2">{item.date}</td>
                    <td className="px-2 py-2">{item.login_time}</td>
                    <td className="px-2 py-2">{item.logout_time}</td>
                    <td className="px-2 py-2">{item.total_hours}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center gap-6 my-4 mx-5">
        <button className="flex items-center gap-2 text-[10px] bg-gray-200 border border-gray-500 px-2 py-1 rounded cursor-pointer hover:bg-gray-300">
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
