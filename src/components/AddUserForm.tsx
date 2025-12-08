"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import mobilePrefixData from "../constants/mobilePrefix.json";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UserPlus } from "lucide-react";
import { useAddUserMutation } from "../hooks/useCommon";
import Swal from "sweetalert2";
import RegistrationOptions from "../components/RegistrationOptions";
const userTypeMappings = {
  "Normal User": { id: 1, grade_id: 1 },
  "Un-registered User": { id: 2, grade_id: 1 },
  Corporate: { id: 3, grade_id: 2 },
  "Travel Agent": { id: 4, grade_id: 3 },
  Hotel: { id: 5, grade_id: 4 },
};

const userType = [
  "", // Add this empty string option
  "Normal User",
  "Un-registered User",
  "Corporate",
  "Travel Agent",
  "Hotel",
];

// Validation Schema
const addUserFormSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email"),
  mobile_prefix: z.string().optional(),
  mobile: z.string().min(10).regex(/^\d+$/, "Mobile must be numeric"),
  referral_key: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  nationality: z.string().min(1, "Nationality is required"),
  user_type: z.enum(
    ["Normal User", "Un-registered User", "Corporate", "Travel Agent", "Hotel"],
    {
      required_error: "User Type is required",
    }
  ),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),
});

type UserFormData = z.infer<typeof addUserFormSchema>;

export default function AddUserForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(addUserFormSchema),
    defaultValues: {
      user_type: "Normal User",
    },
  });

  const [user_type_id, setUserTypeId] = useState<number>(1);
  const [user_grade, setUserGradeId] = useState<number>(1);
  const [selectedPrefix, setSelectedPrefix] = useState("+91");

  const { mutate, data } = useAddUserMutation();
  const selectedUserType = watch("user_type");

  // Update user_type_id and user_grade when user_type changes
  useEffect(() => {
    if (selectedUserType && userTypeMappings[selectedUserType]) {
      setUserTypeId(userTypeMappings[selectedUserType].id);
      setUserGradeId(userTypeMappings[selectedUserType].grade_id);
    }
  }, [selectedUserType]);

  const onSubmit = (data: UserFormData) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to add this user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, add user!",
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          ...data,
          user_type_id,
          user_grade,
          mobile_prefix: selectedPrefix,
        };

        mutate(payload, {
          onSuccess: (response) => {
            Swal.fire("Added!", "User has been added.", "success");
            // reset();
          },
          onError: (error: any) => {
            Swal.fire(
              "Error!",
              error?.response?.data?.message || "Something went wrong.",
              "error"
            );
          },
        });
      }
    });
  };

  return (
    //   <form
    //   onSubmit={handleSubmit(onSubmit)}
    //    className="add-user-form bg-white shadow-md border border-gray-300 m-6 mb-3 mt-0 rounded-sm sm:m-12 sm:mb-3 sm:mt-0">
    //     <h1 className="bg-gray-300 py-3 px-5  font-semibold flex items-center gap-2 text-sm sm:text-base">
    //      <UserPlus className="w-6 h-6 text-blue-400"/> Add User1
    //     </h1>
    //     <div

    //       className="grid grid-cols-1 p-3 sm:p-6 gap-3 sm:grid-cols-2 md:grid-cols-3"
    //     >
    //       <div className="flex flex-col py-1">
    //         <label
    //           htmlFor="userType"
    //           className="font-semibold text-[12px] text-sm"
    //         >
    //           User Type <span className="text-red-500">*</span>
    //         </label>

    //         <select
    //           {...register("user_type")}
    //           onChange={(e) => {
    //           }}
    //           name="userType"
    //           id=""
    //           className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm"
    //         >
    //           <option value="">Select User Type</option>
    //          {userType.filter(opt => opt !== '').map((user) => (
    //   <option value={user} key={user}>
    //     {user}
    //   </option>
    // ))}
    //         </select>
    //         {errors.user_type && (
    //           <p className="text-xs text-red-600 mt-1">
    //             {errors.user_type.message}
    //           </p>
    //         )}
    //       </div>

    //       <div className="flex flex-col py-1">
    //         <label
    //           htmlFor="first_name"
    //           className="font-semibold text-[12px] text-sm"
    //         >
    //           First Name <span className="text-red-500">*</span>
    //         </label>
    //         <input
    //           {...register("first_name")}
    //           type="text"
    //           placeholder="Enter First Name"
    //           className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
    //         />
    //         {errors.first_name && (
    //           <p className="text-xs text-red-600 mt-1">
    //             {errors.first_name.message}
    //           </p>
    //         )}
    //       </div>
    //       <div className="flex flex-col py-1">
    //         <label
    //           htmlFor="last_name"
    //           className="font-semibold text-[12px] text-sm"
    //         >
    //           Last Name <span className="text-red-500">*</span>
    //         </label>
    //         <input
    //           {...register("last_name")}
    //           type="text"
    //           placeholder="Enter Last Name"
    //           className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
    //         />
    //         {errors.last_name && (
    //           <p className="text-xs text-red-600 mt-1">
    //             {errors.last_name.message}
    //           </p>
    //         )}
    //       </div>

    //       <div className="flex flex-col py-1">
    //         <label htmlFor="email" className="font-semibold text-[12px] text-sm">
    //           Email <span className="text-red-500">*</span>
    //         </label>
    //         <input
    //           {...register("email")}
    //           type="email"
    //           className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
    //           placeholder="Enter Email"
    //         />
    //         {errors.email && (
    //           <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
    //         )}
    //       </div>

    //       <div className="flex flex-col py-1">
    //         <label htmlFor="mobile" className="font-semibold text-[12px] text-sm">
    //           Mobile No. <span className="text-red-500">*</span>
    //         </label>
    //         <div className="flex gap-2">
    //           <select
    //             value={selectedPrefix}
    //             onChange={(e) => setSelectedPrefix(e.target.value)}
    //             className="w-[30%] border border-gray-300 p-2 focus:outline-none rounded-sm text-[12px] sm:text-sm"
    //           >
    //             {mobilePrefixData.mobilePrefix.map(({ initial, prefix }) => (
    //               <option key={prefix} value={prefix}>
    //                 {prefix} ({initial})
    //               </option>
    //             ))}
    //           </select>
    //           <input
    //             {...register("mobile")}
    //             type="tel"
    //             className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
    //             placeholder="Enter Mobile No."
    //           />
    //         </div>
    //         {errors.mobile && (
    //           <p className="text-xs text-red-600 mt-1">{errors.mobile.message}</p>
    //         )}
    //       </div>

    //       <div className="flex flex-col py-1">
    //         <label
    //           htmlFor="password"
    //           className="font-semibold text-[12px] text-sm"
    //           >
    //           Password <span className="text-red-500">*</span>
    //         </label>
    //         <input
    //           {...register("password")}
    //           type="password"
    //           className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
    //           placeholder="Enter Password"
    //         />
    //         {errors.password && (
    //           <p className="text-xs text-red-600 mt-1">
    //             {errors.password.message}
    //           </p>
    //         )}
    //       </div>

    //       <div className="flex flex-col py-1">
    //         <label htmlFor="gender" className="font-semibold text-[12px] text-sm">
    //           Gender <span className="text-red-500">*</span>
    //         </label>
    //        <select
    //         {...register("gender")}
    //        name="gender" id="" className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm">
    //         <option value="Select Gender">Select Gender</option>
    //         <option value="Male">Male</option>
    //         <option value="Female">Female</option>

    //        </select>
    //         {errors.gender && (
    //           <p className="text-xs text-red-600 mt-1">
    //             {errors.gender.message}
    //           </p>
    //         )}
    //       </div>

    //       <div className="flex flex-col py-1">
    //         <label
    //           htmlFor="nationality"
    //           className="font-semibold text-[12px] text-sm"
    //           >
    //           Nationality <span className="text-red-500">*</span>
    //         </label>
    //         <input
    //           {...register("nationality")}
    //           type="text"
    //           className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
    //           placeholder="Enter Nationality"
    //         />
    //         {errors.nationality && (
    //           <p className="text-xs text-red-600 mt-1">
    //             {errors.nationality.message}
    //           </p>
    //         )}
    //       </div>

    //     </div>

    //     <div className="flex gap-3 justify-end p-4 pt-0">
    //       <button
    //         type="submit"
    //         className="text-[12px] sm:text-sm cursor-pointer py-2 px-6 rounded-sm bg-[#101828] text-white"
    //       >
    //         Save
    //       </button>
    //     </div>
    //   </form>
    <div className="mx-auto mt-10 p-6 rounded bg-white w-[85%] sm:w-[70%] lg:w-[50%]">
      <h1 className="text-2xl font-bold mb-4 text-black">User Registration</h1>
      <RegistrationOptions internal={true} />
    </div>
  );
}
