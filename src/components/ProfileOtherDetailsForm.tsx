import { IdCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../store/auth";
import { useUpateUserProfile } from "../hooks/useCommon";

const routeKnowledges = ["yes", "no"];
const prefLocations = ["Center", "North", "South", "East", "West"];

import { z } from "zod";

const otherDetailsSchema = z.object({
  route_knowledge: z.string().min(1, "Route Knowledge is required!"),
  pref_location: z.string().min(1, "Pref Location/Zone is required"),
});

type otherDetailsData = z.infer<typeof otherDetailsSchema>;

export default function ProfileOtherDetailsForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<otherDetailsData>({
    resolver: zodResolver(otherDetailsSchema),
  });

  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");
  const path = searchParams.get("type");
  const { user: authUser } = useAuth();
  const userId = path ? user_id : authUser?.id ?? -1;

  const updateMutation = useUpateUserProfile();

  const onSubmit = async (data: otherDetailsData) => {};

  return (
    <form
      action=""
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white flex"
    >
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 overflow-hidden w-full">
        <div className="p-8 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <IdCard className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[16px] font-semibold text-gray-800">
                Other Detail
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-[10px] font-medium text-gray-700">
                  Route Knowledge <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("route_knowledge")}
                  className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-[10px]"
                >
                  <option value="Select Route Knowledge" selected>
                    Select Route Knowledge
                  </option>
                  {routeKnowledges.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors?.route_knowledge && (
                  <p className="text-[10px] text-red-500">
                    {errors.route_knowledge.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-medium text-gray-700">
                  Pref Location/Zone <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("pref_location")}
                  className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-[10px]"
                >
                  <option value="Select Pref Location/Zone" selected>
                    Select Pref Location/Zone
                  </option>
                  {prefLocations.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors?.pref_location && (
                  <p className="text-[10px] text-red-500">
                    {errors.pref_location.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="py-1 px-3 border border-gray-300 rounded-md shadow-sm text-[10px] font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
            >
              Reset
            </button>
            <button
              type="submit"
              className="py-1 px-3 cursor-pointer border border-transparent rounded-md shadow-md text-[10px] font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
