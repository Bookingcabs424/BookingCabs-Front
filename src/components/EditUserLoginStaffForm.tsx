import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState, useEffect } from "react";
import mobilePrefixData from "../constants/mobilePrefix.json";
import { useDepartmentsQuery, useGetRole, useGetUserInfo, useUpdateProfile } from "../hooks/useCommon";
import { ChevronLeft, RefreshCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";

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
  alt_email: z.string().email().optional(),

  dob: z.string().optional(),
  address: z.string().optional(),
  role: z.number().optional(),

  state: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),

  department: z.string().optional(),
  kyc_type: z.enum(["Aadhar", "Passport", "Voter ID"]).optional(),
  kyc_number: z.string().optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export default function EditUserLoginStaffForm() {
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");
  const { data: userProfileData } = useGetUserInfo(Number(user_id));
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
  });

  const [selectedPrefix, setSelectedPrefix] = useState("+91");

  const {
    data: departmentData,
    isLoading,
    isError,
    refetch,
  } = useDepartmentsQuery();
  
  const { data: userRoleData, refetch: getUserRoleData } = useGetRole();
const {mutate,isSuccess}= useUpdateProfile()
  const filteredRoles = useMemo(() => {
    if (!Array.isArray(userRoleData)) return [];
    return userRoleData.filter((role: any) => role.role_type == 5);
  }, [userRoleData]);
useEffect(()=>{
  console.log({filteredRoles})
},[filteredRoles])
  // Map user data to form when userProfileData is available
  useEffect(() => {
    if (userProfileData) {
      // Map the user data to form fields
      setValue("first_name", userProfileData.first_name || "");
      setValue("last_name", userProfileData.last_name || "");
      setValue("email", userProfileData.email || "");
      setValue("mobile_prefix", userProfileData.mobile_prefix || "+91");
      setValue("mobile", userProfileData.mobile || "");
      setValue("username", userProfileData.username || "");
      setValue("referral_key", userProfileData.referral_key || "");
      setValue("gender", userProfileData.gender || "");
      setValue("father_name", userProfileData.father_name || "");
      setValue("landline", userProfileData.landline_number || "");
      setValue("alt_mobile", userProfileData.alternate_mobile || "");
      setValue("alt_email", userProfileData.alternate_email || "");
      setValue("dob", userProfileData.dob || "");
      setValue("address", userProfileData.address || "");
      setValue("role", userProfileData.user_type_id || "");
      
      // Set mobile prefix state
      setSelectedPrefix(userProfileData.mobile_prefix || "+91");
      
      // Map email verification (convert boolean to string if needed)
      setValue("email_verified", userProfileData.email_verified ? "true" : "false");
      
      // Map phone verification (convert boolean to string if needed)
      setValue("phone_verified", userProfileData.mobile_verfication ? "true" : "false");
      
      // Map KYC data
      setValue("kyc_number", userProfileData.kyc || "");
      
      // You might need to map kyc_type based on your data structure
      // setValue("kyc_type", mapKycType(userProfileData.kyc_type));
    }
  }, [userProfileData, setValue]);

  const onSubmit = (data: EditProfileFormValues) => {
    console.log(data);
    mutate({...data,id:user_id})
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-end gap-1 px-3 py-6">
        <button className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#DD4B39] border border-gray-300 text-white font-semibold">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button 
          type="button"
          onClick={() => reset()}
          className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#00A65A] border border-gray-300 text-white font-semibold"
        >
          <RefreshCcw className="w-4 h-4" /> Reset
        </button>
        <button 
          type="submit"
          form="edit-profile-form"
          className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#367FA9] border border-gray-300 text-white font-semibold"
        >
          Save
        </button>
      </div>
      
      <form
        id="edit-profile-form"
        onSubmit={handleSubmit(onSubmit)}
        className="border border-gray-200 w-full p-5"
      >
        <div className="grid grid-cols-3 items-center mb-4 gap-3">
          <div className="flex flex-col space-y-1">
            <label className="text-[12px]">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("first_name")}
              type="text"
              placeholder="Enter First Name"
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none disabled:bg-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[12px]">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("last_name")}
              type="text"
              placeholder="Enter Last Name"
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none disabled:bg-gray-100"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[12px]">
              Email <span className="text-red-600 text-xs">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter Email"
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none disabled:bg-gray-100"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1 ">
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
                className="text-black w-3/4 px-3 py-1 border border-gray-300 rounded-lg  placeholder-gray-500 focus:outline-none text-[12px]"
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

          {/* <div className="space-y-1">
            <label className="block text-[12px] font-[500] text-gray-800">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              {...register("role", { valueAsNumber: true })}
              className="text-black text-sm w-full px-2 py-1 border border-gray-300 rounded-md  placeholder-gray-500 focus:outline-none  text-black text-[12px]"
            >
              <option value="">Select User Type</option>
              {filteredRoles.map((role: any) => (
                <option
                  value={role.role_id}
                  key={role.role_id}
                  className="text-[12px]"
                >
                  {role.RoleName}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-xs text-red-600 mt-1">{errors.role.message}</p>
            )}
          </div> */}

          <div className="flex flex-col space-y-1">
            <label className="text-[12px]">Gender</label>
            <select
              {...register("gender")}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none disabled:bg-gray-100"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[12px]">Department</label>
            <select
              {...register("department")}
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none disabled:bg-gray-100"
            >
              <option value="">Select Department</option>
              {departmentData?.rows?.map((item: any) => (
                <option key={item?.id} value={item?.id}>
                  {item?.department_name}
                </option>
              ))}
            </select>
          </div>

          {/* Additional fields from your user data */}
          <div className="flex flex-col space-y-1">
            <label className="text-[12px]">Username</label>
            <input
              {...register("username")}
              type="text"
              placeholder="Username"
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none disabled:bg-gray-100"
              disabled
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[12px]">
              Referral Key <span className="text-red-500">*</span>
            </label>
            <input
              {...register("referral_key")}
              type="text"
              placeholder="Referral Key"
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none disabled:bg-gray-100"
            />
            {errors.referral_key && (
              <p className="text-xs text-red-600 mt-1">
                {errors.referral_key.message}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[12px]">Father's Name</label>
            <input
              {...register("father_name")}
              type="text"
              placeholder="Father's Name"
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[12px]">Date of Birth</label>
            <input
              {...register("dob")}
              type="date"
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[12px]">Alternate Mobile</label>
            <input
              {...register("alt_mobile")}
              type="text"
              placeholder="Alternate Mobile"
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[12px]">Alternate Email</label>
            <input
              {...register("alt_email")}
              type="email"
              placeholder="Alternate Email"
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
            />
            {errors.alt_email && (
              <p className="text-xs text-red-600 mt-1">
                {errors.alt_email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1 col-span-3">
            <label className="text-[12px]">Address</label>
            <textarea
              {...register("address")}
              placeholder="Address"
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
              rows={3}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[12px]">KYC Number</label>
            <input
              {...register("kyc_number")}
              type="text"
              placeholder="KYC Number"
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-[12px] outline-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
}