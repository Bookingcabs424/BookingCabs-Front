"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { usePersonalInfo } from "../hooks/useCommon";
import { toast } from "react-toastify";

// Validation Schema
const userPersonalFormSchema = z.object({
  father_name: z.string().optional(),
  alternate_email: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Invalid email",
    }),

  alternate_mobile: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => !val || /^\d{10,}$/.test(val), {
      message: "Minimum 10 digits and numeric only",
    }),
  dob: z.string().min(1, "Date of Birth is required"),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),
  address: z.string().optional(),
  pincode: z.string().optional(),
  mobile: z.string(),
  email: z.string(),
  typeId: z.string(),
});

type UserFormData = z.infer<typeof userPersonalFormSchema>;

const PersonalInformationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userPersonalFormSchema),
  });
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const mobile = searchParams.get("mobile");
  const typeId = searchParams.get("typeId");

  const router = useRouter();
  const personalInfoMutaion = usePersonalInfo();

  const onSubmit = async (data: UserFormData) => {
    personalInfoMutaion.mutate(
      {
        ...data,
        father_name: data.father_name || "",
        alternate_email: data.alternate_email || "",
        alternate_mobile: data.alternate_mobile || "",
        address: data.address || "",
        pincode: data.pincode || "",
        email: email || "",
        mobile: mobile || "",
        dob: data.dob! || "",
        typeId: typeId || "",
        gender: data?.gender || "",
      },
      {
        onSuccess: (val: any) => {
          toast.success("Profile info added successfully!", {
            position: "top-right",
            autoClose: 5000,
          });
          const cdata = val?.data?.responseData?.response?.data;

          if (cdata) {
            localStorage.setItem("companyDetail", JSON.stringify(cdata));
          }

          if (typeId == "1"||typeId == "3") {
            router.push(`/registration-complete`);
          } else {
            router.push(
              `/company?email=${encodeURIComponent(
                data.email
              )}&mobile=${encodeURIComponent(
                data.mobile
              )}&typeId=${encodeURIComponent(typeId || 0)}`
            );
          }
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.responseData?.response?.message ||
              "Profile info adding failed",
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto bg-white shadow-xl rounded-md p-8 space-y-6 border border-gray-100"
    >
      {/* <h2 className="text-xl font-bold text-blue-600 mb-2">
        {formName} Registration
      </h2> */}

      {/* Father Name */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-800">
          Father's Name
        </label>
        <input
          {...register("father_name")}
          type="text"
          placeholder="Enter Father's Name"
          className="text-black text-sm w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] transition-all duration-200"
        />
        {errors.father_name && (
          <p className="text-xs text-red-600 mt-1">
            {errors.father_name.message}
          </p>
        )}
      </div>

      {/* Alternate Email */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-800">
          Alternate Email
        </label>
        <input
          {...register("alternate_email")}
          type="email"
          placeholder="user@gmail.com"
          className="text-black text-sm w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] transition-all duration-200"
        />
        {errors.alternate_email && (
          <p className="text-xs text-red-600 mt-1">
            {errors.alternate_email.message}
          </p>
        )}
      </div>

      {/* Alternate Mobile */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-800">
          Alternate Mobile
        </label>
        <input
          {...register("alternate_mobile")}
          type="text"
          placeholder="Enter Mobile No."
          className="text-black text-sm w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] transition-all duration-200"
        />
        {errors.alternate_mobile && (
          <p className="text-xs text-red-600 mt-1">
            {errors.alternate_mobile.message}
          </p>
        )}
      </div>

      {/* Date of Birth */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-800">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          {...register("dob")}
          type="date"
          className="text-black text-sm w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9d7a20] transition-all duration-200"
        />
        {errors.dob && (
          <p className="text-xs text-red-600 mt-1">{errors.dob.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {/* Gender */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-800">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            {...register("gender")}
            className="text-black text-sm w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9d7a20] transition-all duration-200"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-xs text-red-600 mt-1">{errors.gender.message}</p>
          )}
        </div>

        {/* Pincode */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-800">
            Pincode
          </label>
          <input
            {...register("pincode")}
            type="text"
            placeholder="Enter Pincode"
            className="text-black text-sm w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] transition-all duration-200"
          />
          {errors.pincode && (
            <p className="text-xs text-red-600 mt-1">
              {errors.pincode.message}
            </p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-800">
          Residential Address
        </label>
        <textarea
          {...register("address")}
          placeholder="Enter address here"
          rows={4}
          className="text-black text-sm w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] transition-all duration-200 resize-none"
        />

        {errors.address && (
          <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>
        )}
      </div>
      <input type="hidden" {...register("email")} value={email ?? ""} />
      <input type="hidden" {...register("mobile")} value={mobile ?? ""} />
      <input type="hidden" {...register("typeId")} value={typeId ?? ""} />
      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-[#dfad08] hover:bg-[#9d7a20] font-semibold py-2 px-4 rounded-md  transition"
      >
        Submit
      </button>
    </form>
  );
};

export default PersonalInformationForm;
