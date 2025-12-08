"use client";
import {

  useGetUpdateUserDoc,
  useGetUserInfo,
  useGetUserProfileInfo,
  useUpdateUserDoc,
  useUpdateUserProfile,
} from "../hooks/useCommon";
import { useAuth } from "../store/auth";
import { Camera, ChevronLeft, RefreshCcw, UploadCloud } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import mobilePrefixData from "../constants/mobilePrefix.json";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const editProfileSchema = z.object({
  username: z.string().optional(),
  referral_key: z.string().min(1, "Referral Key is required"),
  phone_verified: z.string().optional(),
  email_verified: z.string().min(1, "Email Verified is required"),
  gender: z.string().optional(),

  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email("Invalid email address"),

  mobile_prefix: z.string().min(1, "Mobile prefix required"),
  mobile: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number is too long"),

  father_name: z.string().optional(),

  landline: z.string().optional(),
  alt_mobile: z.string().optional(),
  alt_email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),

  dob: z.string().optional(),
  address: z.string().optional(),

  state: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),

  kyc_type: z.string().optional()
    .or(z.literal("")),
  kyc_number: z.string().optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export default function EditProfileStaffForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
  });
  useEffect(() => {
    console.log({ errors });
  }, [errors]);
  const [kycUpload, setKYCUpload] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedPrefix, setSelectedPrefix] = useState("+91");
  const [isLoading, setIsLoading] = useState(false);

  const profilePath = process.env.NEXT_PUBLIC_API_PIC_URL;
  const b2bUrl = process.env.NEXT_PUBLIC_B2B_URL;

  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");
  const path = searchParams.get("type");
  const { user: authUser } = useAuth();
  const userId = path ? user_id : authUser?.id ?? -1;

  const { data: userProfileData, refetch } = useGetUserInfo(
    Number(user_id)
  );
  useEffect(()=>{
    console.log({
      userProfileData
    })

  },[userProfileData])
  const { mutate: updateUserProfile, isPending: isUpdating } =
    useUpdateUserProfile();
  const { mutate: uploadDoc, data: uploadedData } = useUpdateUserDoc(
    Number(authUser?.id)
  );
  const { data: docData } = useGetUpdateUserDoc();

  // Map user data to form
  useEffect(() => {
    if (userProfileData) {
      console.log("User Profile Data:", userProfileData);

      // Set form values from API response
      setValue("username", userProfileData.username || "");
      setValue("referral_key", userProfileData.referral_key || "");
      setValue(
        "phone_verified",
        userProfileData.mobile_verfication ? "Verified" : "Not Verified"
      );
      setValue(
        "email_verified",
        userProfileData.email_verified ? "Verified" : "Not Verified"
      );
      setValue("gender", userProfileData.gender || "");
      setValue("first_name", userProfileData.first_name || "");
      setValue("last_name", userProfileData.last_name || "");
      setValue("email", userProfileData.email || "");
      setValue("mobile_prefix", userProfileData.mobile_prefix || "+91");
      setValue("mobile", userProfileData.mobile || "");
      setValue("father_name", userProfileData.father_name || "");
      setValue("landline", userProfileData.landline_number || "");
      setValue("alt_mobile", userProfileData.alternate_mobile || "");
      setValue("alt_email", userProfileData.alternate_email || "");
      setValue(
        "dob",
    userProfileData?.dob && !isNaN(new Date(userProfileData.dob).getTime()) 
  ? new Date(userProfileData.dob).toISOString().split("T")[0]
  : ""
      );
      setValue("address", userProfileData.address || "");
      setValue("state", userProfileData.state_name || "");
      setValue("city", userProfileData.city_name || "");
      setValue("pincode", userProfileData.pincode || "");
      setValue("kyc_type", (userProfileData.kyc_type as any) || "");
      setValue("kyc_number", userProfileData.kyc || "");

      // Set selected prefix
      setSelectedPrefix(userProfileData.mobile_prefix || "+91");
    }
  }, [userProfileData, setValue]);

  function getDocumentPath(docs: any[], typeId: number, basePath?: string) {
    const doc = docs?.find((d) => d.document_type_id === typeId);
    if (!doc || !doc.doc_file_upload) return "";

    const fileParts = doc.doc_file_upload.split("/");
    const folderPath = fileParts.slice(0, -1).join("/");
    const fileName = fileParts[fileParts.length - 1] || "";

    return `${basePath}${folderPath}/${encodeURIComponent(fileName)}`;
  }

  const kycUploadPicture = getDocumentPath(docData, 2, profilePath);
  const profilePicture = getDocumentPath(docData, 1, profilePath); // Assuming typeId 1 for profile image

  const handlekycUploadChange = (e: any, typeId: any) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadDoc(
        {
          file,
          folder: "user-doc",
          doc_type_id: typeId,
          user_id: String(userId) || "",
        },
        {
          onSuccess: (response: any) => {
            setKYCUpload(response?.uploadData?.doc_file_upload);
            refetch();
            toast.success("KYC document uploaded successfully");
          },
          onError: (err: any) => {
            toast.error("Something went wrong. Please try again.");
          },
        }
      );
    }
  };

  const handleProfileImageChange = (e: any, typeId: any) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadDoc(
        {
          file,
          folder: "user-doc",
          doc_type_id: typeId,
          user_id: String(userId) || "",
        },
        {
          onSuccess: (response: any) => {
            setProfileImage(response?.uploadData?.doc_file_upload);
            refetch();
            toast.success("Profile image uploaded successfully");
          },
          onError: (err: any) => {
            toast.error("Something went wrong. Please try again.");
          },
        }
      );
    }
  };

  const onSubmit = (data: EditProfileFormValues) => {
    setIsLoading(true);

    // Prepare payload for update
    const payload = {
      user_id: Number(user_id),
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      mobile_prefix: data.mobile_prefix,
      mobile: data.mobile,
      father_name: data.father_name,
      landline_number: data.landline,
      alternate_mobile: data.alt_mobile,
      alternate_email: data.alt_email,
      dob: data.dob,
      address: data.address,
      pincode: data.pincode,
      gender: data.gender,
      kyc_type: data.kyc_type,
      kyc: data.kyc_number,
      // Note: username and referral_key might be read-only in some systems
    };

    console.log("Update payload:", payload);

    updateUserProfile(payload, {
      onSuccess: (response) => {
        toast.success("Profile updated successfully");
        refetch(); // Refresh the data
        setIsLoading(false);
      },
      onError: (error) => {
        console.error("Update error:", error);
        toast.error("Failed to update profile");
        setIsLoading(false);
      },
    });
  };

  const handleReset = () => {
    if (userProfileData) {
      // Reset form to original values
      reset({
        username: userProfileData.username || "",
        referral_key: userProfileData.referral_key || "",
        phone_verified: userProfileData.mobile_verfication
          ? "Verified"
          : "Not Verified",
        email_verified: userProfileData.email_verified
          ? "Verified"
          : "Not Verified",
        gender: userProfileData.gender || "",
        first_name: userProfileData.first_name || "",
        last_name: userProfileData.last_name || "",
        email: userProfileData.email || "",
        mobile_prefix: userProfileData.mobile_prefix || "+91",
        mobile: userProfileData.mobile || "",
        father_name: userProfileData.father_name || "",
        landline: userProfileData.landline_number || "",
        alt_mobile: userProfileData.alternate_mobile || "",
        alt_email: userProfileData.alternate_email || "",
        dob: userProfileData.dob
          ? new Date(userProfileData.dob).toISOString().split("T")[0]
          : "",
        address: userProfileData.address || "",
        state: userProfileData.state_name || "",
        city: userProfileData.city_name || "",
        pincode: userProfileData.pincode || "",
        kyc_type: (userProfileData.kyc_type as any) || "",
        kyc_number: userProfileData.kyc || "",
      });
      setSelectedPrefix(userProfileData.mobile_prefix || "+91");
    }
    toast.info("Form reset to original values");
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-end gap-1 py-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#DD4B39] border border-gray-300 text-white font-semibold"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#00A65A] border border-gray-300 text-white font-semibold"
        >
          <RefreshCcw className="w-4 h-4" /> Reset
        </button>
        <button
          type="submit"
          form="profile-form"
          disabled={!isDirty || isUpdating || isLoading}
          className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#367FA9] border border-gray-300 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating || isLoading ? "Saving..." : "Save"}
        </button>
      </div>
      <form
        id="profile-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-between border border-gray-200 w-full p-5"
      >
        <div className="w-full">
          <div className="grid grid-cols-2 items-center mb-4 gap-3">
            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">Username</label>
              <input
                {...register("username")}
                type="text"
                placeholder="Enter username"
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none disabled:bg-gray-100"
                disabled
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">
                Referral Key <span className="text-red-600 text-xs">*</span>
              </label>
              <input
                {...register("referral_key")}
                type="text"
                placeholder="Enter Referral Key"
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none disabled:bg-gray-100"
                disabled
              />
              {errors.referral_key && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.referral_key.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">Ph.No.Verified</label>
              <input
                {...register("phone_verified")}
                type="text"
                placeholder="Enter Ph.No.Verified"
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none disabled:bg-gray-100"
                disabled
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">
                Email Verified <span className="text-red-600 text-xs">*</span>
              </label>
              <input
                {...register("email_verified")}
                type="text"
                placeholder="Enter Email Verified"
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none disabled:bg-gray-100"
                disabled
              />
              {errors.email_verified && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.email_verified.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">Gender</label>
              <select
                {...register("gender")}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 items-center mb-4 gap-3">
            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">First Name</label>
              <input
                {...register("first_name")}
                type="text"
                placeholder="Enter First Name"
                className=" w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none
                 disabled:bg-gray-100 disabled:cursor-not-allowed
                "
                disabled
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">Last Name</label>
              <input
                disabled
                {...register("last_name")}
                type="text"
                
                placeholder="Enter Last Name"
                className="
                                 disabled:bg-gray-100 disabled:cursor-not-allowed
                w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">
                Email <span className="text-red-600 text-xs">*</span>
              </label>
              <input
                disabled
                {...register("email")}
                type="email"
                placeholder="Enter Email"
                className="                  disabled:bg-gray-100 disabled:cursor-not-allowed w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1 col-span-2">
              <label className="block text-[12px] text-gray-800">
                Mobile No <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  {...register("mobile_prefix")}
                  value={selectedPrefix}
                  onChange={(e) => setSelectedPrefix(e.target.value)}
                  className="w-[20%] border border-gray-300 py-1 px-2 focus:outline-none rounded-sm text-[12px]"
                >
                  {mobilePrefixData.mobilePrefix.map(({ initial, prefix }) => (
                    <option key={prefix} value={prefix}>
                      {prefix} ({initial})
                    </option>
                  ))}
                </select>
                <input
                  {...register("mobile")}
                  type="text"
                  placeholder="Enter Mobile No."
                  className="text-black w-3/4 px-3 py-1 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none text-[12px]"
                />
              </div>
              {errors.mobile && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.mobile.message}
                </p>
              )}
              {errors.mobile_prefix && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.mobile_prefix.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">Father's Name</label>
              <input
                {...register("father_name")}
                type="text"
                placeholder="Enter Father's Name"
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 items-center mb-4 gap-3">
            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">Landline No.</label>
              <input
                {...register("landline")}
                type="text"
                placeholder="Enter Landline No."
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">Alt Mobile No.</label>
              <input
                {...register("alt_mobile")}
                type="text"
                placeholder="Enter Alt Mobile No."
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">Alternate Email</label>
              <input
                {...register("alt_email")}
                type="email"
                placeholder="Enter Alternate Email"
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
              />
              {errors.alt_email && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.alt_email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">DOB</label>
              <input
                {...register("dob")}
                type="date"
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">Address</label>
              <input
                {...register("address")}
                type="text"
                placeholder="Enter Address"
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 items-center mb-4 gap-3">
            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">State</label>
              <input
                {...register("state")}
                type="text"
                placeholder="Enter State"
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">City</label>
              <input
                {...register("city")}
                type="text"
                placeholder="Enter City"
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">Pin Code</label>
              <input
                {...register("pincode")}
                type="text"
                placeholder="Enter Pin Code"
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">KYC Type</label>
              <select
                {...register("kyc_type")}
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
              >
                <option value="">Select KYC Type</option>
                <option value="13">Aadhar</option>
                <option value="14">Passport</option> 
                <option value="15">Voter ID</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[12px]">KYC Number</label>
              <input
                {...register("kyc_number")}
                type="text"
                placeholder="Enter KYC Number"
                className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {/* KYC Upload */}
          <div className="flex flex-col items-center space-y-3 mt-5 mx-2">
            <div className="relative group">
              <label className="cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => {
                    handlekycUploadChange(e, "2");
                  }}
                  className="hidden"
                  accept="image/*"
                />
                <div className="relative">
                  {kycUpload ? (
                    <img
                      src={
                        kycUpload ? `${b2bUrl}${kycUpload}` : kycUploadPicture
                      }
                      className="w-35 h-30 object-contain border-4 border-white shadow-md transition-all duration-300"
                      alt="KYC Upload"
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
                KYC Upload
              </p>
              <p className="text-xs text-gray-500">Click to upload or change</p>
            </div>
          </div>
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-3 mt-5 mx-2">
            <div className="relative group">
              <label className="cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => {
                    handleProfileImageChange(e, "1"); // Assuming typeId 1 for profile image
                  }}
                  className="hidden"
                  accept="image/*"
                />
                <div className="relative">
                  {profileImage ? (
                    <img
                      src={
                        profileImage
                          ? `${b2bUrl}${profileImage}`
                          : profilePicture
                      }
                      className="w-35 h-30 object-contain border-4 border-white shadow-md transition-all duration-300"
                      alt="Profile Image"
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
                Profile Image
              </p>
              <p className="text-xs text-gray-500">Click to upload or change</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
