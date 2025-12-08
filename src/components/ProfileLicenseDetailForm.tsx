"use client";
import {
  useGetCityDataMutation,
  useGetUserKycList,
  useGetUserProfileInfo,
  useUpateUserProfile,
  useUpdateUserDoc,
  useUpdateUserProfilePhoto,
} from "../hooks/useCommon";
import { useAuth } from "../store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  CheckCircle,
  IdCard,
  MapPin,
  Phone,
  Shield,
  UploadCloud,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCity } from "../store/common";

import { z } from "zod";

const licenseSchema = z.object({
  license_state: z.string().min(1, "License State is required"),
  license_validity: z.string().optional(),
  pancard: z.string().optional(),
  license_no: z.string().min(1, "Badge/License No. is required."),
  license_proof: z.string().optional(),
  gps_device_no: z.string().optional(),
  police_report: z.string().optional(),
  pancard_proof: z.string().optional(),
  audit_report: z.string().optional(),
  bank_proof: z.string().optional(),
});

export type licenseData = z.infer<typeof licenseSchema>;

export default function ProfileLicenseDetailForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<licenseData>({
    resolver: zodResolver(licenseSchema),
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

  const [debouncedGetCity, setDebouncedGetCity] = useState(() => () => {});
  const { mutate: uploadPhoto } = useUpdateUserProfilePhoto(Number(userId));
  const { mutate: uploadDoc } = useUpdateUserDoc(Number(userId));
  const { data: kycData, isLoading } = useGetUserKycList("kyc_proof");

  const { mutate: getCityData } = useGetCityDataMutation();
  const { cityData } = useCity();

  const kycList = useMemo(() => {
    return kycData || [];
  }, [kycData]);

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityInput(value);
    setShowSuggestions(true);
    debouncedGetCity();
  };

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

  const onSubmit = async (data: licenseData) => {};

  return (
    <form
      action=""
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white"
    >
      <div className="flex justify-between">
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 overflow-hidden w-[65%] sm:w-[70%]">
          <div className="p-8 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <IdCard className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-[16px] font-semibold text-gray-800">
                  License Detail
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-[10px] font-medium text-gray-700">
                    License State <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("license_state")}
                    placeholder="Select State"
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-[10px]"
                  />
                  {errors.license_state && (
                    <p className="text-[10px] text-red-500">
                      {errors.license_state.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-medium text-gray-700">
                    License Validity <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("license_validity")}
                    value={userProfile?.license_validity}
                    disabled
                    className="border border-gray-300 cursor-not-allowed p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-[10px]"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Pancard <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("pancard")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-[10px]"
                  />
                  {errors?.pancard && (
                    <p className="text-[10px] text-red-500">
                      {errors.pancard.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Badge/License No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("license_no")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-[10px]"
                  />
                  {errors.license_no && (
                    <p className="text-[10px] text-red-500">
                      {errors.license_no.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-medium text-gray-700">
                    GPS Device No
                  </label>
                  <input
                    {...register("gps_device_no")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-[10px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="img-upload px-9 py-12 w-[15%] sm:w-[20%]">
          <div className="flex flex-col items-end gap-6">
            {/* License Proof */}
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
                        alt="License Proof"
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
                  License Proof
                </p>
                <p className="text-xs text-gray-500">
                  Click to upload or change
                </p>
              </div>
            </div>

            {/* Police Report */}
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
                        alt="Police Report"
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
                  Police Report
                </p>
                <p className="text-xs text-gray-500">
                  Click to upload or change
                </p>
              </div>
            </div>

            {/* Pan Card Proof */}
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
                        alt="Pan Card Proof"
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
                  Pan Card Proof
                </p>
                <p className="text-xs text-gray-500">
                  Click to upload or change
                </p>
              </div>
            </div>

            {/* Audit Report */}
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
                        alt="Audit Report"
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
                  Audit Report
                </p>
                <p className="text-xs text-gray-500">
                  Click to upload or change
                </p>
              </div>
            </div>

            {/* Bank Proof */}
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
                        alt="Bank Proof"
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
                  Bank Proof
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
    </form>
  );
}
