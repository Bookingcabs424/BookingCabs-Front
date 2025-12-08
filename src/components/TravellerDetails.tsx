"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Trash } from "lucide-react";
import { useSelectedVehicle } from "../store/common";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../store/auth";
import { useGetCompanyDetail } from "@/hooks/useCommon";
import TravellerForm from "./TravellerForm";

export const travellerFormSchema = z.object({
  placcard_name: z.string().min(1, "Plac Card Name is required."),
  guest_first_name: z.string().min(1, "First Name is required."),
  guest_last_name: z.string().min(1, "Last Name is required."),
  guest_email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email format"),
  dob: z.string().min(1, "Date is required."),
  guest_gender: z.string().min(1, "Gender is required."),
  guest_mobile: z
    .string()
    .min(10, "Mobile must be at least 10 digits")
    .regex(/^\d+$/, "Mobile must be numeric"),
  guest_alt_mobile: z.string().optional(),
  nationality: z.string().min(1, "Nationality is required"),
  gst_no: z.string().optional(),
  agent_reference: z.string().optional(),
  id_proof: z.string().optional(),
  book_for_others: z.boolean().optional(),
  remark: z.string().optional(),
  booked_by_name: z.string().optional(),
  booked_by_contact: z.string().optional(),
  proof: z.string().min(1, "Proof is required"),
  gst_company_name: z.string().optional(),
});

type travellerFormData = z.infer<typeof travellerFormSchema>;

export default function TravellerDetails() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<travellerFormData>({
    resolver: zodResolver(travellerFormSchema),
    defaultValues: {
      placcard_name: "",
      guest_first_name: "",
      guest_last_name: "",
      guest_email: "",
      guest_mobile: "",
      guest_alt_mobile: "",
      nationality: "",
      gst_no: "",
      agent_reference: "",
      id_proof: "",
      book_for_others: false,
      gst_company_name: "",
    },
  });
  const { user } = useAuth();
  const { booking, setBooking } = useSelectedVehicle();
  const [bookForOthers, setBookForOthers] = useState(false);
    const [companyGST, setcompanyGST] = useState(true);

  const [verified, setVerified] = useState(false);
      const { data: getCompanyDetail } = useGetCompanyDetail();
  
useEffect(() => {
  console.log({getCompanyDetail})
}, [getCompanyDetail]);
  const onSubmit = async (data: travellerFormData) => {
    setBooking({ ...(booking ?? {}), ...data });
  };
  const dobInputRef = useRef<HTMLInputElement>(null);

  const { ref: dobRef, ...dob } = register("dob");

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookForOthers(e.target.checked);
  };
  useEffect(() => {
    if (!bookForOthers && user) {
      setValue("placcard_name", user.first_name);
      setValue("guest_first_name", user.first_name);
      setValue("guest_last_name", user.last_name ?? "");
      setValue("dob", user.dob ?? "");
      setValue("guest_email", user.email);
      setValue("guest_mobile", user.mobile ?? "");
    } else {
      setValue("placcard_name", "");
      setValue("guest_first_name", "");
      setValue("guest_last_name", "");
      setValue("dob", "");
      setValue("guest_email", "");
      setValue("guest_mobile", ""); 
    }
  }, [bookForOthers]);
  useEffect(() => {
    if(companyGST && getCompanyDetail){
      setValue("gst_company_name", getCompanyDetail.company_name || "");
      setValue("gst_no", getCompanyDetail.service_tax_gst || "");
    }else{
      setValue("gst_company_name", "");
      setValue("gst_no", "");
    }
  }, [companyGST,getCompanyDetail]);
  useEffect(() => {
    if (getCompanyDetail) {
      setValue("gst_company_name", getCompanyDetail.company_name || "");
      setValue("gst_no", getCompanyDetail.service_tax_gst || "");
    }
  }, [getCompanyDetail]);
  return (
    <div className="w-full">
      <h1 className="text-[14px] font-semibold my-3">Traveller Details</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-gray-300 rounded-md p-3 relative"
      >
        <div className="flex justify-between items-end gap-2 md:my-4">
          <div className="book-for-others-select absolute top-[10px] left-[10px] flex items-center gap-2 col-span-1">
            <input
              type="checkbox"
              id="book-for-others"
              checked={bookForOthers}
              onChange={handleCheckboxChange}
              // {...register("book_for_others")}
            />
            <label htmlFor="book-for-others" className="text-[12px]">
              Book For Others
            </label>
          </div>
          {/* <div className="col-span-0 hidden lg:col-span-1 flex"></div> */}

          <div className="first-name-input flex items-end absolute right-[10px] top-[10px] justify-end gap-2 mt-5 md:mt-0 lg:w-[50%]">
            <label
              className="text-sm whitespace-nowrap text-[12px]"
              htmlFor="first-name"
            >
              Plac Card Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("placcard_name")}
              type="text"
              placeholder="Enter Plac Card Name"
              className="w-full border-b border-gray-300 outline-none focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px] py-1 px-2"
            />
            {errors.placcard_name && (
              <p className="text-xs text-red-600">
                {errors.placcard_name.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-14 md:mt-6">
          <div className="grid gap-3 my-2 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <div className="first-name-input flex flex-col gap-1">
              <label className="text-[12px]" htmlFor="first_name">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("guest_first_name")}
                placeholder="Enter First Name"
                className="border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
              />
              {errors.guest_first_name && (
                <p className="text-red-600 text-xs">
                  {errors.guest_first_name.message}
                </p>
              )}
            </div>
            <div className="last-name-input flex flex-col gap-1">
              <label className="text-[12px]" htmlFor="last_name">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("guest_last_name")}
                placeholder="Enter Last Name"
                className="border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
              />
              {errors.guest_last_name && (
                <p className="text-red-600 text-xs">
                  {errors.guest_last_name?.message}
                </p>
              )}
            </div>
            <div className="gender-input flex flex-col gap-1">
              <label className="text-[12px]" htmlFor="gender">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                {...register("guest_gender")}
                className="border-b border-gray-300 py-1 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.guest_gender && (
                <p className="text-red-600 text-xs">
                  {errors.guest_gender.message}
                </p>
              )}
            </div>
            <div
              onClick={() => dobInputRef.current?.showPicker()}
              className="dob-input flex flex-col gap-1"
            >
              <label className="text-[12px]" htmlFor="age">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                // {...register("dob")}
                ref={(el) => {
                  dobRef(el);
                  dobInputRef.current = el;
                }}
                {...dob}
                className="border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
              />
              {errors.dob && (
                <p className="text-red-600 text-xs">{errors.dob.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-3 my-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="email-input flex flex-col gap-1">
              <label className="text-[12px]" htmlFor="email">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("guest_email")}
                placeholder="Enter Email"
                className="border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
              />
              {errors.guest_email && (
                <p className="text-red-600 text-xs">
                  {errors.guest_email?.message}
                </p>
              )}
            </div>
            <div className="mobile-input flex flex-col gap-1">
              <label className="text-[12px]" htmlFor="mobile">
                Mobile No. <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register("guest_mobile")}
                placeholder="Enter Mobile No."
                className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [MozAppearance:textfield] focus:outline-none focus:border-b-2 focus:border-[#9d7a20] border-b border-gray-300 outline-none text-[12px] py-1 px-2"
              />
              {errors.guest_mobile && (
                <p className="text-red-600 text-xs">
                  {errors.guest_mobile?.message}
                </p>
              )}
            </div>

            <div className="mobile-input flex flex-col gap-1">
              <label className="text-[12px]" htmlFor="first-name">
                Alt Mobile No.
              </label>
              <input
                type="tel"
                {...register("guest_alt_mobile")}
                placeholder="Enter Alt Mobile No."
                className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [MozAppearance:textfield] focus:outline-none focus:border-b-2 focus:border-[#9d7a20] border-b border-gray-300 outline-none text-[12px] py-1 px-2"
              />
            </div>

            <div className="nationality-input flex flex-col gap-1">
              <label className="text-[12px]" htmlFor="nationality">
                Nationality <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("nationality")}
                placeholder="Enter Nationality"
                className="border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
              />
              {errors.nationality && (
                <p className="text-red-600 text-xs">
                  {errors.nationality?.message}
                </p>
              )}
            </div>
          </div>
       <TravellerForm/>
          <div className="grid gap-3 my-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/*<div className="gst-input flex flex-col gap-1">
              <label className="text-[12px]" htmlFor="first-name">
                GST No.
              </label>
              <input
                type="text"
                {...register("gst_number")}
                placeholder="Enter GST No."
                className="border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
              />
            </div>*/}
     
            <div className="agent-reference-input flex flex-col gap-1">
              <label className="text-[12px]" htmlFor="agent-reference">
                Agent Reference
              </label>
              <input
                type="text"
                {...register("agent_reference")}
                placeholder="Enter Agent Reference"
                className="border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
              />
            </div>

            <div className="id-proof-input flex flex-col gap-1 ">
              <label className="text-[12px]" htmlFor="booked_by_name">
                Booked By{" "}
              </label>
              <input
                type="text"
                {...register("booked_by_name")}
                placeholder="Booked By(Name)"
                className="border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
              />
            </div>

            <div className="id-proof-input flex flex-col gap-1 ">
              <label className="text-[12px]" htmlFor="booked_by_name">
                Booked By (Contact)
              </label>
              <input
                type="text"
                {...register("booked_by_contact")}
                placeholder="Booked By(Email/mobile)"
                className="border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
              />
            </div>

            <div className="proof-input flex flex-col gap-1 w-full">
              <label className="text-[12px]" htmlFor="proof">
                Aadhar <span className="text-red-600 text-xs">*</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  {...register("proof")}
                  placeholder="Enter Aadhar"
                  className="border-b border-gray-300 w-full py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
                />
                {verified === false ? (
                  <button
                    onClick={() => setVerified(true)}
                    type="button"
                    className="bg-[#dfad08] text-xs px-2 py-1 rounded cursor-pointer hover:bg-[#9d7a20] transition"
                  >
                    Verify
                  </button>
                ) : (
                  <CheckCircle className="text-green-700 cursor-auto" />
                )}
              </div>
            </div>
          </div>
          <textarea
            {...register("remark")}
            id=""
            className="flex flex-col w-full col-span-4 outline-none text-[12px] border border-gray-300 p-1 rounded"
            rows={3}
            placeholder="Enter Remarks"
          ></textarea>
 <div className="flex items-center gap-3 col-span-1 mt-2">
  <label htmlFor="company-gst-toggle" className="flex items-center gap-2 cursor-pointer">
    {/* Toggle Switch */}
    <div className="relative">
      <input
        type="checkbox"
        id="company-gst-toggle"
        className="sr-only"
        checked={companyGST}
        onChange={(e) => setcompanyGST(e.target.checked)}
      />
      <div className={`block w-10 h-5 rounded-full transition 
          ${companyGST ? "bg-indigo-600" : "bg-gray-300"}`}>
      </div>
      <div
        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition 
          ${companyGST ? "translate-x-5" : ""}`}
      ></div>
    </div>

    {/* Dynamic label */}
    <span className="text-[12px]">
      {companyGST ? "Company's GST" : "Traveller's GST"}
    </span>
  </label>
</div>



          <div className="select flex items-center gap-2 col-span-1 mt-2">
            <div className="gst-name input flex flex-col gap-1 ">
              <label className="text-[12px]" htmlFor="booked_by_name">
                Company Name{" "}
              </label>
              <input
                type="text"
                {...register("gst_company_name")}
                placeholder="GST Name"
                className="border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
              />
            </div>
             <div className="id-proof-input flex flex-col gap-1 ">
              <label className="text-[12px]" htmlFor="booked_by_name">
                Company GST{" "}
              </label>
              <input
                type="text"
                {...register("gst_no")}
                placeholder="GST No."
                className="border-b border-gray-300 py-1 px-2 focus:outline-none focus:border-b-2 focus:border-[#9d7a20] transition-all text-[12px]"
              />
            </div>
          </div>
          <div className="flex items-center justify-end my-2">
            <button
              type="submit"
              className="bg-[#dfad08] rounded-md col-span-1 text-[13px] w-[max-content] px-3 py-1 cursor-pointer hover:bg-[#9d7a20] transition"
            >
              Save
            </button>
          </div>
        </div>
      </form>
      {/* <button
        type="button"
        title="Add More Travellers"
        className="bg-[#dfad08] my-3 float-right rounded-md col-span-1 text-[13px] w-[max-content] px-3 py-1 mx-1 my-2 cursor-pointer hover:bg-[#9d7a20] transition"
      >
        Add +
      </button> */}
    </div>
  );
}
