"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  useCompanyInfo,
  useGetCityDataMutation,
  useUpdateCompanyInfo,
  useCompanyUpdateLogo,
} from "../hooks/useCommon";
import { useCity } from "../store/common";
import { useMemo, useState, useEffect } from "react";
import { debounce } from "lodash";

const companyFormSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  company_address: z.string().min(1, "Office address is required"),
  // city_id: z.string().min(1, "City is required"),
  contact_person_name: z.string().min(3, "Contact person is required"),
  mobile_no: z
    .string()
    .min(10, "Minimum 10 digits")
    .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  service_tax_gst: z.string().optional(),
  pancard_no: z.string().min(10, "Minimum 10 digits"),
  landline_no: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  website_url: z
    .string()
    .trim()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "Invalid URL",
    })
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  pincode: z.string().optional(),
  user_email: z.string().optional(),
  user_mobile: z.string().optional(),
  typeId: z.string().optional(),
  id: z.string().optional(),
  active: z.string().optional(),
  center: z.string().optional(),
  center_code: z.string().optional(),
  constitution: z.string().optional(),
  einvoice_enabled: z.string().optional(),
  expiry_date: z.string().optional(),
  filings: z.string().optional(),
  gst_type: z.string().optional(),
  last_updated_on: z.string().optional(),
  legal_name: z.string().optional(),
  nature_of_business: z.string().optional(),
  primary_address: z.string().optional(),
  registered_on: z.string().optional(),
  state: z.string().optional(),
  state_code: z.string().optional(),
  trade_name: z.string().optional(),
  company_logo: z.union([z.string(), z.object({})]).optional(),
  company_pancard_image: z.union([z.string(), z.object({})]).optional(),
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

const CompanyRegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
  });

  const router = useRouter();
  const companyProfileMutation = useCompanyInfo();
  const { mutate: getCityData } = useGetCityDataMutation();
  const { cityData } = useCity();

  const [cityInput, setCityInput] = useState("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cData, setCData] = useState<Partial<CompanyFormData> | null>(null);
  const searchParams = useSearchParams();
  const user_email = searchParams.get("email");
  const user_mobile = searchParams.get("mobile");
  const typeId = searchParams.get("typeId");
  useEffect(() => {
    const storedData = localStorage.getItem("companyDetail");

    if (!storedData) return;

    try {
      const parsed = JSON.parse(storedData);
      setCData(parsed);
      if (parsed?.company_name || parsed?.service_tax_gst) {
        reset({
          company_name: parsed.company_name ?? "",
          service_tax_gst: parsed.service_tax_gst ?? "",
        });
      }
    } catch (err) {
      console.error("Failed to parse companyDetail from localStorage", err);
    }
  }, [reset]);
  const companyDetailMutation = useUpdateCompanyInfo();
  const { mutate: uploadPhoto } = useCompanyUpdateLogo(cData?.id || 0);
  const debouncedGetCity = useMemo(() => {
    return debounce((val: string) => {
      if (val) getCityData(val);
    }, 500);
  }, [getCityData]);

  useEffect(() => {
    console.log("error", errors);
  }, [errors]);

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityInput(value);
    setShowSuggestions(true);
    debouncedGetCity(value);
  };

  const handleCitySelect = (name: string, id: string) => {
    setCityInput(name);
    setSelectedCityId(id);
    setShowSuggestions(false);
  };

  const onSubmit = (data: CompanyFormData) => {
    const payload = {
      ...data,
      user_email: user_email || "",
      user_mobile: user_mobile || "",
      typeId: typeId || "",
      pincode: data.pincode || "",
      service_tax_gst: data.service_tax_gst || "",
      pancard_no: data.pancard_no || "",
      email: data.email || "",
      landline_no: data.landline_no || "",
      website_url: data.website_url || "",
      // city_id: selectedCityId,
      id: cData?.id || 0,
    };

    companyDetailMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Company info added successfully!");
        router.push(`/dashboard`);
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.responseData?.response?.message ||
            "Company info adding failed"
        );
      },
    });
  };
  const handleLogoImageChange = async (e: any, type: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadedUrl = await uploadPhoto({ file, folder: type });

      if (type === "company_logo") {
        setValue("company_logo", "abc");
      } else if (type === "company_pan") {
        setValue("company_pancard_image", "abc");
      }
    }
  };

  const onVerifyHandler = () => {
    toast.info("Pan card verifed successfully.", {
      position: "top-right",
      autoClose: 5000,
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-200"
    >
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
        {/* Company Name */}
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            Company Name *
          </label>
          <input
            {...register("company_name")}
            placeholder="Type Company Name"
            disabled
            className="text-black text-[13px] w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
          {errors.company_name && (
            <p className="text-xs text-red-500 mt-1">
              {errors.company_name.message}
            </p>
          )}
        </div>

        {/* Office Address */}
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            Office Address *
          </label>
          <input
            {...register("company_address")}
            placeholder="Type Office Address"
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
          {errors.company_address && (
            <p className="text-xs text-red-500 mt-1">
              {errors.company_address.message}
            </p>
          )}
        </div>

        {/* Pin Code */}
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">Pin Code</label>
          <input
            {...register("pincode")}
            placeholder="Type Pin Code"
            className="text-black  text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
          {errors.pincode && (
            <p className="text-xs text-red-500 mt-1">
              {errors.pincode.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] text-gray-800">VAT/GST *</label>
          <input
            {...register("service_tax_gst")}
            placeholder="Type GST/VAT No."
            disabled
            className="text-black  text-[13px] w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
          {errors.service_tax_gst && (
            <p className="text-xs text-red-500 mt-1">
              {errors.service_tax_gst.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1 py-1">
          <label className="block text-[11px]  text-gray-800">
            Company Logo
          </label>
          <input
            {...register("company_logo")}
            onChange={(e) => {
              handleLogoImageChange(e, "company_logo");
            }}
            accept="image/*"
            type="file"
            className="text-black text-[13px]  w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
          {/* {errors.kycUpload && (
              <p className="text-xs text-red-600 mt-[1px]">
                {errors.kycUpload.message}
              </p>
            )} */}
        </div>

        {/* Pin Code */}
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            Contact Person *
          </label>
          <input
            {...register("contact_person_name")}
            placeholder="Type Contact person"
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
          {errors.contact_person_name && (
            <p className="text-xs text-red-500 mt-1">
              {errors.contact_person_name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            Landline Number *
          </label>
          <input
            {...register("landline_no")}
            placeholder="Type landline No"
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
          {errors.landline_no && (
            <p className="text-xs text-red-500 mt-1">
              {errors.landline_no.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            Mobile Number *
          </label>
          <input
            {...register("mobile_no")}
            placeholder="Type Mobile No"
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
          {errors.mobile_no && (
            <p className="text-xs text-red-500 mt-1">
              {errors.mobile_no.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
        {/* Company Name */}

        {/* Office Address */}
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            Company Email *
          </label>
          <input
            {...register("email")}
            placeholder="user@domain.com"
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Pin Code */}
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            Website URL
          </label>
          <input
            {...register("website_url")}
            placeholder="https://yourdomain.com"
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">GST Status</label>
          <input
            {...register("active")}
            placeholder="status"
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">GST Center</label>
          <input
            {...register("center")}
            placeholder="Type center"
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            GST Center Code
          </label>
          <input
            {...register("center_code")}
            placeholder="Type Code"
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>

        {/* Pin Code */}
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            GST Constitution
          </label>
          <input
            {...register("constitution")}
            placeholder=""
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            GST einvoice_enabled
          </label>
          <input
            {...register("einvoice_enabled")}
            placeholder="status"
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            GST expiry_date
          </label>
          <input
            {...register("expiry_date")}
            placeholder="Type center"
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            GST Filings
          </label>
          <input
            {...register("filings")}
            placeholder="Type filings"
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>

        {/* Pin Code */}
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">GST Type</label>
          <input
            {...register("gst_type")}
            placeholder=""
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            GST last updated on
          </label>
          <input
            {...register("last_updated_on")}
            placeholder=""
            disabled
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">Legal Name</label>
          <input
            {...register("legal_name")}
            placeholder=""
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            Nature of business
          </label>
          <input
            {...register("nature_of_business")}
            placeholder=""
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>

        {/* Pin Code */}
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            Primary Address
          </label>
          <input
            {...register("primary_address")}
            placeholder=""
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            GST Registered_on
          </label>
          <input
            {...register("registered_on")}
            placeholder=""
            disabled
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">GST state</label>
          <input
            {...register("state")}
            placeholder="Type center"
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">State_code</label>
          <input
            {...register("state_code")}
            placeholder=""
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            GST Trade Name
          </label>
          <input
            {...register("trade_name")}
            placeholder=""
            className="text-black text-[13px] font-normal w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[11px]  text-gray-800">
            Pan Card No *
          </label>
          <input
            {...register("pancard_no")}
            placeholder="Pan Card Details"
            className="text-black text-[13px] font-normal w-[190px] h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
          <button
            onClick={onVerifyHandler}
            type="button"
            className="bg-[#dfad08] ml-1 px-3 py-2 cursor-pointer rounded text-[10px] font-[500]"
          >
            Verify
          </button>
          {errors.pancard_no && (
            <p className="text-xs text-red-500 mt-1">
              {errors.pancard_no.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 py-1">
          <label className="block text-[11px]  text-gray-800">Pan Image</label>
          <input
            {...register("company_pancard_image")}
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleLogoImageChange(e, "company_pan");
            }}
            className="text-black text-[13px]  w-full h-8 px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b9004b] transition-all duration-200"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full font-[500] bg-[#dfad08] hover:bg-[#9d7a20] cursor-pointer text-white  py-2 px-4 rounded-md  transition"
      >
        Submit
      </button>
    </form>
  );
};

export default CompanyRegistrationForm;
