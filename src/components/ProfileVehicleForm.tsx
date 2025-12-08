"use client";
import {
  useGetUserKycList,
  useGetUserProfileInfo,
  useUpateUserProfile,
  useUpdateUserDoc,
  useUpdateUserProfilePhoto,
} from "../hooks/useCommon";
import { useAuth } from "../store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Car, Cog, UploadCloud } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const vehicleSchema = z.object({
  vehicle_type: z.string().min(1, "Vehicle Type is required"),
  vehicle_model: z.string().min(1, "Vehicle Model is required"),
  ignition_type: z.string().min(1, "Ignition Type is required"),
  vehicle_color: z.string().optional(),
  permit_expiry_date: z.string().min(1, "Permit Expiry Date is required"),
  model_year: z.string().min(1, "Model Year is required"),
  vehicle_no: z.string().min(1, "Vehicle No. is required"),
  insurance_validity: z.string().min(1, "Insurance Validity is required"),
  passengers: z.string().min(1, "Passengers is required"),
  large_suitcase: z.string().min(1, "Large Suitcase is required"),
  small_suitcase: z.string().min(1, "Small Suitcase is required"),
  amenities: z.string().min(1, "Amenities Suitcase is required"),
  logo: z.string().optional(),
});

export type vehicleData = z.infer<typeof vehicleSchema>;

export default function ProfileVehicleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<vehicleData>({
    resolver: zodResolver(vehicleSchema),
  });

  const [cityInput, setCityInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>("");

  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");
  const path = searchParams.get("type");
  const { user: authUser } = useAuth();
  const userId = path ? user_id : authUser?.id ?? -1;

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError,
    error,
  } = useGetUserProfileInfo(Number(userId));

  const { mutate: uploadPhoto } = useUpdateUserProfilePhoto(Number(userId));
  const { mutate: uploadDoc } = useUpdateUserDoc(Number(userId));
  const { data: kycData, isLoading } = useGetUserKycList("kyc_proof");

  const kycList = useMemo(() => {
    return kycData || [];
  }, [kycData]);

  // const selectedKycType = watch("kyc_type");

  const handleCitySelect = (city: any, id: string) => {
    setSelectedCityId(id);
    setCityInput(city);
    // setValue("city", city);
    setShowSuggestions(false);
  };
  // const handleDocImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const uploadData = uploadDoc({
  //       file,
  //       folder: "user-doc",
  //       doc_type_id: selectedKycType,
  //       user_id: user_id || "",
  //     });
  //
  //   }
  // };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      uploadPhoto({ file, folder: "profile" });
    }
  };

  const updateMutation = useUpateUserProfile();
  const profilePath = process.env.NEXT_PUBLIC_API_PIC_URL;

  const fileParts = userProfile?.user_profile_path?.split("/");
  const folderPath = fileParts?.slice(0, -1).join("/");
  const fileName =
    fileParts !== undefined ? fileParts[fileParts.length - 1] : "";

  const profilePicture = `${profilePath}${folderPath}/${encodeURIComponent(
    fileName
  )}`;

  const onSubmit = async (data: vehicleData) => {};

  return (
    <form
      action="" 
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white border border-gray-200"
    >
      <div className="flex justify-between">
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 overflow-hidden w-[65%] sm:w-[70%]">
          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                  <Car className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-[16px] font-semibold text-gray-800">
                  Vehicle Details
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Vehicle Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      value={userProfile?.username || ""}
                      disabled
                      className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Vehicle Model <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      value={userProfile?.referral_key}
                      disabled
                      className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Ignition Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("ignition_type")}
                    className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Vehicle Color
                  </label>
                  <input
                    {...register("vehicle_color")}
                    type="color"
                    className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full"
                    disabled
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Permit Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("permit_expiry_date")}
                    className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Model Year <span className="text-red-500">*</span>
                  </label>

                  <input
                    value={userProfile?.email || ""}
                    disabled
                    className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Vehicle No <span className="text-red-500">*</span>
                  </label>

                  <input
                    value={userProfile?.email || ""}
                    disabled
                    className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Insurance Validity <span className="text-red-500">*</span>
                  </label>

                  <input
                    value={userProfile?.email || ""}
                    disabled
                    className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                  <Cog className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Feature Information
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Passengers <span className="text-red-600">*</span>
                  </label>
                  <input
                    value={userProfile?.mobile || ""}
                    disabled
                    className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Large Suitcase <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("large_suitcase")}
                    className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Small Suitcase <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("small_suitcase")}
                    className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    disabled
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-1 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Amenities
                  </label>
                  <input
                    {...register("amenities")}
                    className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="img-upload px-4 py-12 w-[15%] sm:w-[20%]">
          <div className="flex flex-col items-end gap-6">
            {/* Vehicle Pic */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative group">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <div className="relative">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        className="w-30 h-30 object-cover border-4 border-white shadow-md transition-all duration-300"
                        alt="Vehicle Pic"
                      />
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center border-3 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:border-blue-400 group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300">
                        <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2.5 rounded-full shadow-md hover:shadow-md transition-shadow">
                      <Camera className="w-4 h-4" />
                    </div>
                  </div>
                </label>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-medium text-gray-700">
                  Vehicle Pic
                </p>
                <p className="text-xs text-gray-500">
                  Click to upload or change
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Form Actions */}
      <div className="flex justify-end gap-4 p-4 border-t border-gray-200">
        <button
          type="button"
          className="text-[10px]  py-1 px-3 border border-gray-300 rounded-md shadow-sm text-[10px] font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
        >
          Reset
        </button>
        <button
          type="submit"
          className="text-[10px] py-1 px-3 cursor-pointer border border-transparent rounded-md shadow-md text-[10px] font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
        >
          Save
        </button>
      </div>
    </form>
  );
}
