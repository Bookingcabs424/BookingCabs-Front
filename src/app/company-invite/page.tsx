"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // required for PhoneInput styles
import z from "zod";

// Define Zod schema
const schema = z.object({
  email: z.string().email("Email is required"),
  mobile: z.string().min(7, "Mobile number is required"),
  mobile_prefix: z.string().min(1),
  referral_code: z.string().min(1, "Referral code is required"),
  name: z.string().min(1, "Name is required"),
});

// Infer the form data type
type FormData = z.infer<typeof schema>;

export default function CompanyInvitePage() {
  const [phone, setPhone] = useState("");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      mobile: "",
      mobile_prefix: "+91",
      referral_code: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    alert(`Form submitted!\n\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div className="w-full flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto my-20 bg-white rounded-md shadow-md border border-gray-200 w-[75%] p-6 sm:w-[50%] sm:p-8 md:w-[45%] lg:w-[30%]"
      >
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Company Invite
        </h3>

        <div className="mb-2">
          <label className="text-sm font-[500] text-gray-700 mb-1 block">
            Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="Enter Name"
            {...register("name")}
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] transition-all duration-200 text-[12px] sm:text-sm"
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="text-sm font-[500] text-gray-700 mb-1 block">
            Email <span className="text-red-500">*</span>
          </label>

          <input
            type="email"
            placeholder="Enter Email"
            {...register("email")}
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] transition-all duration-200 text-[12px] sm:text-sm"
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="text-sm font-[500] text-gray-700 mb-1 block">
            Mobile No <span className="text-red-500">*</span>
          </label>

          <Controller
            name="mobile"
            control={control}
            render={({ field }) => (
              <PhoneInput
                country={"in"}
                value={phone}
                onChange={(value, country: any) => {
                  const dialCode = country?.dialCode || "";
                  const mobile = value.startsWith(dialCode)
                    ? value.slice(dialCode.length)
                    : value;

                  setPhone(value);
                  setValue("mobile", mobile);
                  setValue("mobile_prefix", `+${dialCode}`);
                }}
                inputProps={{
                  name: "mobile",
                  required: true,
                  autoFocus: false,
                }}
                containerClass="!w-full"
                inputClass="!w-full !py-2 !pl-14 !pr-4 !text-sm !border !border-gray-300 !rounded-md focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] transition-all duration-200 text-[12px] sm:text-sm"
                buttonClass="!border-gray-300"
              />
            )}
          />
          {errors.mobile && (
            <p className="text-xs text-red-600 mt-1">{errors.mobile.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="text-sm font-[500] text-gray-700 mb-1 block">
            Referral Code <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="Enter Referral Code"
            {...register("referral_code")}
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] transition-all duration-200 text-[12px] sm:text-sm"
          />

          {errors.referral_code && (
            <p className="text-xs text-red-600 mt-1">
              {errors.referral_code.message}
            </p>
          )}
        </div>

        <input type="hidden" {...register("mobile_prefix")} />

        <button
          type="submit"
          className="w-full rounded-lg cursor-pointer font-[600] bg-[#dfad08] hover:bg-[#9d7a20] transition duration-300 py-2 mt-4 sm:py-3 text-black"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
