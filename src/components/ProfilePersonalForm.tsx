import {
  Camera,
  CheckCircle,
  MapPin,
  Phone,
  RefreshCcw,
  Shield,
  Upload,
  UploadCloud,
} from "lucide-react";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  useGetCityDataMutation,
  useGetUserProfileInfo,
  useUpdateUserDoc,
  useUpdateUserProfilePhoto,
  useUpateUserProfile,
} from "../hooks/useCommon";
import { useAuth } from "../store/auth";
// Validation Schema
const ProfilePersonalSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  address: z.string().min(1, "Invalid Address"),
  alternate_mobile: z.string().optional(),
  father_name: z.string().optional(),
  pincode: z.string().min(1, "Pin Code is required"),
  newsletter_subscription: z.boolean().optional(),
  landline_number: z.string().optional(),
  external_ref: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),
});

type ProfilePersonalData = z.infer<typeof ProfilePersonalSchema>;

export default function ProfilePersonalForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ProfilePersonalData>({
    resolver: zodResolver(ProfilePersonalSchema),
  });
  useEffect(() => {
    console.log(errors);
  }, [errors]);
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

  useEffect(() => {
    setValue("newsletter_subscription", userProfile?.newsletter_subscription);
    setValue("first_name", userProfile?.first_name);
    setValue("last_name", userProfile?.last_name);
    setValue("address", userProfile?.address);
    setValue("pincode", userProfile?.pincode);
    setValue("alternate_mobile", userProfile?.alternate_mobile);
    setValue("father_name", userProfile?.father_name);
    setValue("landline_number", userProfile?.landline_number);
    setValue("external_ref", userProfile?.external_ref);
    setValue("father_name", userProfile?.father_name);
  }, [userProfile]);

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityInput(value);
    setShowSuggestions(true);
    debouncedGetCity();
  };

  const handleCitySelect = (city: any, id: string) => {
    setSelectedCityId(id);
    setCityInput(city);
    setShowSuggestions(false);
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

  const onSubmit = async (data: ProfilePersonalData) => {
    try {
      const formattedData = {
        ...data,
        father_name: data.father_name?.trim() || "",
        alternate_mobile: data.alternate_mobile?.trim() || "",
        external_ref: data.external_ref?.trim() || "",
        address: data.address?.trim() || "",
        newsletter_subscription: data.newsletter_subscription || false,
        landline_number: data.landline_number?.trim() || "",
        userId: user_id,
      };
      updateMutation.mutate(formattedData, {
        onSuccess: () => {
          toast.success("Profile updated successfully!", {
            position: "top-right",
            autoClose: 5000,
          });
        },
        onError: (err: any) => {
          alert(err.response?.data?.message || "register failed");
          toast.error(err.response?.data?.message || "register failed", {
            position: "top-right",
            autoClose: 5000,
          });
        },
      });
    } catch (error) {
      alert("Failed to register. Try again.");
      toast.error("Failed to register. Try again.");
    }
  };

  return (
    <>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-white border border-gray-200"
      >
        <div className="flex justify-between">
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 overflow-hidden w-[70%]">
            <div className="p-8 space-y-8">
              {/* Profile Picture Section */}
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
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300"
                          alt="Profile"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full flex items-center justify-center border-3 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:border-blue-400 group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300">
                          <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2.5 rounded-full shadow-md hover:shadow-md transition-shadow">
                        <Camera className="w-3 h-3" />
                      </div>
                    </div>
                  </label>
                </div>
                <div className="text-center">
                  <p className="text-[10px]  text-gray-700">Profile Picture</p>
                  <p className="text-xs text-gray-500">
                    Click to upload or change
                  </p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                    {/* <User className="w-3 h-3 text-white" /> */}
                  </div>
                  <h3 className="text-[16px] font-semibold text-gray-800">
                    Basic Information
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px]  text-gray-700">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        value={userProfile?.username || ""}
                        disabled
                        className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px]  text-gray-700">
                      Referral Code
                    </label>
                    <div className="relative">
                      <input
                        value={userProfile?.referral_key || "N/A"}
                        disabled
                        className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-[10px]  text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("first_name")}
                      className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      placeholder="Enter your first name"
                    />
                    {errors?.first_name && (
                      <p className="text-[10px] text-red-500">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px]  text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("last_name")}
                      className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      placeholder="Enter your last name"
                    />
                    {errors.last_name && (
                      <p className="text-[10px] text-red-500">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-[10px]  text-gray-700">
                      Father's Name
                    </label>
                    <input
                      {...register("father_name")}
                      className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      placeholder="Enter father's name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px]  text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        value={userProfile?.email || ""}
                        disabled
                        className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      />
                      <div
                        title="verified"
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2"
                      >
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                    <Phone className="w-3 h-3 text-white" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-gray-800">
                    Contact Information
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-[10px]  text-gray-700">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        value={userProfile?.mobile || ""}
                        disabled
                        className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {userProfile?.mobile_verfication && (
                          <>
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600 ">
                              Verified
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px]  text-gray-700">
                      Phone Number
                    </label>
                    <input
                      {...register("landline_number")}
                      className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-[10px]  text-gray-700">
                      Alternate Mobile
                    </label>
                    <input
                      {...register("alternate_mobile")}
                      className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      placeholder="Enter alternate mobile"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px]  text-gray-700">
                      External Reference
                    </label>
                    <input
                      {...register("external_ref")}
                      className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      placeholder="Enter external reference"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                    {/* <User className="w-3 h-3 text-white" /> */}
                  </div>
                  <h3 className="text-[16px] font-semibold text-gray-800">
                    Personal Details
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-[10px]  text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      disabled
                      value={userProfile?.dob || "N/A"}
                      className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px]  text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                    />
                    {errors.gender && (
                      <p className="text-[10px] text-red-500">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-gray-800">
                    Address Information
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-[10px]  text-gray-700">
                      Address
                    </label>
                    <input
                      {...register("address")}
                      className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-[10px]  text-gray-700">
                        State <span className="text-red-500">*</span>
                      </label>
                      <div className="py-2 px-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-sm border border-indigo-200 text-gray-700 text-[10px]">
                        {userProfile?.state_name || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px]  text-gray-700">
                      Pin Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("pincode")}
                      className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      placeholder="Enter pin code"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px]  text-gray-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      // {...register("city")}
                      type="text"
                      disabled
                      placeholder="Type City Name"
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 200)
                      }
                      onChange={handleCityInputChange}
                      value={cityInput || userProfile?.city_name}
                      className="px-3 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-md border border-indigo-200 text-gray-700 text-[10px]"
                    />
                  </div>
                </div>
              </div>
              {/* Newsletter Subscription */}
              <div className="py-1">
                <label className="flex items-center cursor-pointer group">
                  <input
                    className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                    type="checkbox"
                    {...register("newsletter_subscription")}
                  />

                  <span className="ml-3 text-[10px]  text-gray-700 group-hover:text-blue-700 transition-colors">
                    Subscribe to newsletter for updates and exclusive offers
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* Form Actions */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
          <button
            type="button"
            className="py-1 px-3 border border-gray-300 rounded-md shadow-sm text-[10px]  text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
          >
            Reset
          </button>
          <button
            type="submit"
            className="  py-1 px-3 cursor-pointer border border-transparent rounded-md shadow-md text-[10px]  text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}
