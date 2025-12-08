"use client";
import { Building2, Camera, UploadCloud } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";
import {
  useGetCompanyDetail,
  useGetUserProfileInfo,
  useUpdateUserProfilePhoto,
  useCompanyInfo,
  useUpdateCompanyInfo,
  useGetGSTNumberVerificationMutation,
  useGetUserKycList,
  useUnAssignedBookingMutation,
  useUpdateUserDoc,
  useGetUpdateUserDoc,
} from "../hooks/useCommon";
import { useAuth } from "../store/auth";
const companySchema = z.object({
  company_name: z.string().min(1, "Company Name is required"),
  state: z.string().min(1, "State is required"),
  company_address: z.string().min(1, "Company Address is required"),
  pincode: z.string().optional(),
  gst: z.string().min(1, "Service Tax/GST is required"),
  pancard_no: z.string().min(1, "PAN No. is required"),
  contact_person_name: z.string().optional(),
  landline_no: z.string().optional(),
  mobile_no: z.string().optional(),
  email: z.string().optional(),
  website_url: z.string().optional(),
  active: z.string().optional(),
  constitution: z.string().optional(),
  gst_status: z.string().optional(),
  gst_centre: z.string().optional(),
  center_code: z.string().optional(),
  einvoice_enabled: z.string().optional(),
  gst_expiry_date: z.string().optional(),
  filings: z.string().optional(),
  gst_type: z.string().optional(),
  last_updated_on: z.string().optional(),
  legal_name: z.string().optional(),
  nature_of_business: z.string().optional(),
  primary_address: z.string().optional(),
  registered_on: z.string().optional(),
  state_code: z.string().optional(),
  trader_name: z.string().optional(),
  company_size: z.string().optional(),
  pan: z.string().optional(),
});

export type companyData = z.infer<typeof companySchema>;

export default function UserCompanyDetailForm() {
  const { data: getCompanyDetail } = useGetCompanyDetail();
  const companyProfileMutation = useCompanyInfo();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<companyData>({
    resolver: zodResolver(companySchema),
  });
  const companyDetailMutation = useUpdateCompanyInfo();
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");

  const path = searchParams.get("type");
  const { user: authUser } = useAuth();
  const userId = authUser?.id;

  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const { data: docData, refetch } = useGetUpdateUserDoc();
  const getCompanyDetailData =
    Array.isArray(getCompanyDetail) && getCompanyDetail.length > 0
      ? getCompanyDetail[0]
      : null;
  const { mutate: uploadDoc } = useUpdateUserDoc(Number(authUser?.id));
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError,
    error,
  } = useGetUserProfileInfo(Number(userId));

  const { mutate: uploadPhoto } = useUpdateUserProfilePhoto(Number(userId));
  const { mutate: getGstData } = useGetGSTNumberVerificationMutation();

  useEffect(() => {
    if (getCompanyDetailData) {
      setValue("company_name", getCompanyDetailData.company_name);
      setValue("state", getCompanyDetailData.state);
      setValue("company_address", getCompanyDetailData.company_address);
      setValue("pincode", getCompanyDetailData.pincode);
      setValue("gst", getCompanyDetailData.gst_number);
      setValue("pancard_no", getCompanyDetailData.pancard_no);
      setValue("contact_person_name", getCompanyDetailData.contact_person_name);
      setValue("landline_no", getCompanyDetailData.landline_no);
      setValue("mobile_no", getCompanyDetailData.mobile_no);
      setValue("email", getCompanyDetailData.email);
      setValue("website_url", getCompanyDetailData.website_url);
      setValue("active", getCompanyDetailData.active);
      setValue("constitution", getCompanyDetailData.constitution);
      setValue("gst_status", getCompanyDetailData.gst_status);
      setValue("gst_centre", getCompanyDetailData.gst_centre);
      setValue("center_code", getCompanyDetailData.center_code);
      setValue("einvoice_enabled", getCompanyDetailData.einvoice_enabled);
      setValue("gst_expiry_date", getCompanyDetailData.gst_expiry_date);
      setValue("filings", getCompanyDetailData.filings);
      setValue("gst_type", getCompanyDetailData.gst_type);
      setValue("last_updated_on", getCompanyDetailData.last_updated_on);
      setValue("legal_name", getCompanyDetailData.legal_name);
      setValue("nature_of_business", getCompanyDetailData.nature_of_business);
      setValue("primary_address", getCompanyDetailData.primary_address);
      setValue("registered_on", getCompanyDetailData.registered_on);
      setValue("state_code", getCompanyDetailData.state_code);
      setValue("trader_name", getCompanyDetailData.trade_name);
      setValue("company_size", getCompanyDetailData.company_size);
      setValue("pan", getCompanyDetailData.pan);
    }
  }, [getCompanyDetailData, setValue]);

  // const updateMutation = useUpateUserProfile();
  const profilePath = process.env.NEXT_PUBLIC_API_PIC_URL;

  const fileParts = userProfile?.user_profile_path?.split("/");
  const folderPath = fileParts?.slice(0, -1).join("/");
  const fileName =
    fileParts !== undefined ? fileParts[fileParts.length - 1] : "";

  const profilePicture = `${profilePath}${folderPath}/${encodeURIComponent(
    fileName
  )}`;

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

  const onSubmit = async (data: any) => {
    const payload = {
      id: getCompanyDetailData?.company_id || 0,
      user_email: authUser.email,
      user_mobile: authUser.mobile,
      ...data,
    };
    if (getCompanyDetailData) {
      companyDetailMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Company info update successfully!");
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.responseData?.response?.message ||
              "Company info updation failed"
          );
        },
      });
    } else {
      companyProfileMutation.mutate({
        data,
      });
    }
  };
  const onVerifyHandler = () => {
    const gstValue = getValues("gst")?.trim();

    if (!gstValue) {
      toast.error("Please enter a valid GST number.", {
        position: "top-right",
        autoClose: 5000,
      });
      // setIsGstVerified(false);
      return;
    }

    getGstData(gstValue, {
      onSuccess: (val: any) => {
        const isExisting = val?.data?.responseData?.response?.data?.isExisting;

        if (isExisting) {
          toast.success("Company already exists!", {
            position: "top-right",
            autoClose: 5000,
          });
          // setIsGstVerified(false);
        } else {
          toast.success("GST number verified successfully!", {
            position: "top-right",
            autoClose: 5000,
          });
          // setIsGstVerified(true);
        }
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.responseData?.response?.message ||
            "GST verification failed",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
        // setIsGstVerified(false);
      },
    });
  };

  const handleDocImageChange2 = (e: any, typeId: any) => {
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
            refetch();
          },
          onError: (err: any) => {
            toast.error("Something went wrong. Please try again.");
          },
        }
      );
    }
  };
  function getDocumentPath(docs: any[], typeId: number, basePath?: string) {
    const doc = docs?.find((d) => d.document_type_id === typeId);
    if (!doc || !doc.doc_file_upload) return "";

    const fileParts = doc.doc_file_upload.split("/");
    const folderPath = fileParts.slice(0, -1).join("/");
    const fileName = fileParts[fileParts.length - 1] || "";

    return `${basePath}${folderPath}/${encodeURIComponent(fileName)}`;
  }
  const panPicture = getDocumentPath(docData, 24, profilePath);
  const gstPicture = getDocumentPath(docData, 21, profilePath);
  const cPicture = getDocumentPath(docData, 22, profilePath);
  const addressPicture = getDocumentPath(docData, 2, profilePath);

  return (
    <form
      action=""
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white"
    >
      <div className="flex justify-between">
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 overflow-hidden w-[70%]">
          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Building2 className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-[16px] font-semibold text-gray-800">
                  Company Details
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("company_name")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Company Name"
                  />
                  {errors?.company_name && (
                    <p className="text-[10px] text-red-500">
                      {errors.company_name.message}
                    </p>
                  )}
                </div>

                {/* <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("state")}
                      className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      placeholder="Enter State"
                    />
                    {errors?.state && (
                      <p className="text-[10px] text-red-500">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div> */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Company Size <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("company_size")}
                    name=""
                    id=""
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                  >
                    <option value="1-10">1-10</option>
                    <option value="10-20">10-20</option>
                    <option value="20-50">20-50</option>
                    <option value="50-100">50-100</option>
                    <option value="100-300">100-300</option>
                  </select>
                  {errors.company_size && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.company_size.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Company Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("company_address")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Company Address"
                  />
                  {errors?.company_address && (
                    <p className="text-[10px] text-red-500">
                      {errors.company_address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Pincode
                  </label>
                  <input
                    {...register("pincode")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Pincode"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Service Tax/GST <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("gst")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Service Tax/GST"
                    disabled={getCompanyDetailData}
                  />
                  <button
                    onClick={onVerifyHandler}
                    disabled={getCompanyDetailData}
                    type="button"
                    className="text-[10px]  py-1 px-3 cursor-pointer border border-transparent rounded-md shadow-md  font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                  >
                    Verify
                  </button>
                  {errors?.gst && (
                    <p className="text-[10px] text-red-500">
                      {errors.gst.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Company PAN No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("pancard_no")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter PAN No."
                    disabled={getCompanyDetailData}
                  />
                  {errors?.pancard_no && (
                    <p className="text-[10px] text-red-500">
                      {errors.pancard_no.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Contact Person
                  </label>
                  <input
                    {...register("contact_person_name")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Contact Person"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Phone No.
                  </label>
                  <input
                    {...register("landline_no")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Phone No."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Mobile No.
                  </label>
                  <input
                    {...register("mobile_no")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Mobile No."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    website_url
                  </label>
                  <input
                    {...register("website_url")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter website_url"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    GST Status
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  <input
                    {...register("active")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter GST Status"
                  />
                  {/* {errors?.active && (
                    <p className="text-[10px] text-red-500">
                      {errors.active.message}
                    </p>
                  )} */}
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    GST Centre Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("center_code")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter GST Centre Code"
                  />
                  {errors?.center_code && (
                    <p className="text-[10px] text-red-500">
                      {errors.center_code.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    GST Constituttion <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("constitution")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter GST Constitution"
                  />
                  {errors?.constitution && (
                    <p className="text-[10px] text-red-500">
                      {errors.constitution.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    GST E-Incoice Enabled{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("einvoice_enabled")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter GST E-Invoice Enabled"
                  />

                  {errors?.einvoice_enabled && (
                    <p className="text-[10px] text-red-500">
                      {errors.einvoice_enabled.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    GST Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("gst_expiry_date")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter GST Expiry Date"
                  />
                  {errors?.gst_expiry_date && (
                    <p className="text-[10px] text-red-500">
                      {errors.gst_expiry_date.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    GST Filings <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("filings")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter GST Filings"
                  />
                  {errors?.filings && (
                    <p className="text-[10px] text-red-500">
                      {errors.filings.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    GST Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("gst_type")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter GST Type"
                  />
                  {errors?.company_name && (
                    <p className="text-[10px] text-red-500">
                      {errors.company_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    GST Last Updated On <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("last_updated_on")}
                    type="date"
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Last Updated On"
                  />
                  {errors?.last_updated_on && (
                    <p className="text-[10px] text-red-500">
                      {errors.last_updated_on.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    GST Legal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("legal_name")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Legal Name"
                  />
                  {errors?.legal_name && (
                    <p className="text-[10px] text-red-500">
                      {errors.legal_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Nature of Business <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("nature_of_business")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Nature of Business"
                  />
                  {errors?.nature_of_business && (
                    <p className="text-[10px] text-red-500">
                      {errors.nature_of_business.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    GST Primary Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("primary_address")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Primary Address"
                  />
                  {errors?.primary_address && (
                    <p className="text-[10px] text-red-500">
                      {errors.primary_address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    GST Registered On <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("registered_on")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Registered On"
                  />
                  {errors?.registered_on && (
                    <p className="text-[10px] text-red-500">
                      {errors.registered_on.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Gst State <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("state")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter State"
                  />
                  {errors?.state && (
                    <p className="text-[10px] text-red-500">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    GST State Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("state_code")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Code"
                  />
                  {errors?.state_code && (
                    <p className="text-[10px] text-red-500">
                      {errors.state_code.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Trader Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("trader_name")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Trader Name"
                  />
                  {errors?.trader_name && (
                    <p className="text-[10px] text-red-500">
                      {errors.trader_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    GST Pan<span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("pan")}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                    placeholder="Enter Trader Name"
                  />
                  {errors?.pan && (
                    <p className="text-[10px] text-red-500">
                      {errors.pan.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="img-upload w-[30%] px-9 py-12">
          <div className="flex flex-col items-end gap-6">
            {/* License Proof */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative group">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => {
                      handleDocImageChange2(e, "2");
                    }}
                    className="hidden"
                    accept="image/*"
                  />
                  <div className="relative">
                    {addressPicture ? (
                      <img
                        src={addressPicture}
                        className="w-35 h-30 object-cover border-4 border-white shadow-md transition-all duration-300"
                        alt="Address Proof"
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
                  Address Proof
                </p>
                <p className="text-xs text-gray-500">
                  Click to upload or change
                </p>
              </div>
            </div>

            {/* Registration Certificate */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative group">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => {
                      handleDocImageChange2(e, "21");
                    }}
                    className="hidden"
                    accept="image/*"
                  />
                  <div className="relative">
                    {gstPicture ? (
                      <img
                        src={gstPicture}
                        className="w-35 h-30 object-cover border-4 border-white shadow-md transition-all duration-300"
                        alt="GST Proof"
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
                  GST Proof
                </p>
                <p className="text-xs text-gray-500">
                  Click to upload or change
                </p>
              </div>
            </div>

            {/* Company Pan Card */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative group">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => {
                      handleDocImageChange2(e, "24");
                    }}
                    className="hidden"
                    accept="image/*"
                  />
                  <div className="relative">
                    {panPicture ? (
                      <img
                        src={panPicture}
                        className="w-35 h-30 object-cover border-4 border-white shadow-md transition-all duration-300"
                        alt="PAN Proof"
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
                  PAN Proof
                </p>
                <p className="text-xs text-gray-500">
                  Click to upload or change
                </p>
              </div>
            </div>

            {/* Company Logo */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative group">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => {
                      handleDocImageChange2(e, "22");
                    }}
                    className="hidden"
                    accept="image/*"
                  />
                  <div className="relative">
                    {cPicture ? (
                      <img
                        src={cPicture}
                        className="w-35 h-30 object-cover border-4 border-white shadow-md transition-all duration-300"
                        alt="Logo"
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
                <p className="text-[10px] font-medium text-gray-700">Logo</p>
                <p className="text-xs text-gray-500">
                  Click to upload or change
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Form Actions */}
      <div className="flex justify-end gap-4 p-6">
        <button
          type="button"
          className="text-[10px]  py-1 px-3 border border-gray-300 rounded-md shadow-sm  font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
        >
          Reset
        </button>
        <button
          type="submit"
          className="text-[10px]  py-1 px-3 cursor-pointer border border-transparent rounded-md shadow-md  font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
        >
          {getCompanyDetailData ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}
