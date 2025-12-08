"use client";
import {
  useGetUserProfileInfo,
  useUpdateUserProfilePhoto,
  usePaymentUpload,
  useGetPaymentUploadList,
  // useUpdatePaymentUpload,
} from "../hooks/useCommon";
import { useAuth } from "../store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Camera, UploadCloud, Edit } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BookingTable from "./common/Table";

const paymentModes = [
  "Cheque",
  "Cash Deposit",
  "Online Transfer",
  "Demand Draft",
];

const paymentUploadSchema = z.object({
  paymentMode: z.string().min(1, "Payment Mode is required"),
  partnerBank: z.string().min(1, "Partner Bank Accounts is required"),
  amount: z.string().min(1, "Amount is required"),
  depositBank: z.string().min(1, "Deposit Bank is required"),
  depositBranch: z.string().min(1, "Deposit Branch is required"),
  remark: z.string().optional(),
  transaction_no: z.string().min(1, "Transaction Number is Required"),
  depositDate: z.string().min(1, "Deposit Date is required"),
  paymentProof: z.string().optional(),
});

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: any;
  render?: (value: any, row?: any) => React.ReactNode;
  hidden?: boolean;
}

export type paymentUploadData = z.infer<typeof paymentUploadSchema>;

export default function ProfilePaymentUploadForm() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<paymentUploadData>({
    resolver: zodResolver(paymentUploadSchema),
  });

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profilePicture, setPicture] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

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

  const { user } = useAuth();
  const { data: paymentList } = useGetPaymentUploadList(Number(user?.id));
  const { mutate: uploadPhoto, data: paymentImg } = useUpdateUserProfilePhoto(Number(userId));
  const { mutate: paymentUpload } = usePaymentUpload();
  const { mutate: updatePaymentUpload } = usePaymentUpload();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      uploadPhoto({ file, folder: "payments" });
    }
  };

  const profilePath = process.env.NEXT_PUBLIC_API_PIC_URL;

  const fileParts = userProfile?.user_profile_path?.split("/");
  const fileName = fileParts !== undefined ? fileParts[fileParts.length - 1] : "";

  useEffect(() => {
    console.log({ paymentImg });
    setPicture(
      `${profilePath}uploads/payments/${encodeURIComponent(
        paymentImg?.responseData?.response?.data?.filename
      )}`
    );
  }, [paymentImg]);

  useEffect(() => {
    console.log({ profilePicture });
  }, [profilePicture]);

  const onSubmit = async (data: paymentUploadData) => {
    const payload = {
      ...data,
      user_id: authUser?.id,
      imgPath: `uploads/payments/${encodeURIComponent(
        paymentImg?.responseData?.response?.data?.filename
      )}`,
    };

    if (isEditing && editingId) {
      // Update existing payment
      updatePaymentUpload({ id: editingId, ...payload });
    } else {
      // Create new payment
      paymentUpload(payload);
    }

    // Reset form after submission
    handleReset();
  };

  const handleEdit = (row: any) => {
    console.log("Editing row:", row);
    
    // Set form values from the selected row
    setValue("paymentMode", row.transaction_mode || "");
    setValue("partnerBank", row.partner_bank || "");
    setValue("amount", row.amount?.toString() || "");
    setValue("depositBank", row.deposit_bank || "");
    setValue("depositBranch", row.deposit_branch || "");
    setValue("remark", row.remark || "");
    setValue("transaction_no", row.transaction_no || "");
    setValue("depositDate", row.deposit_date || "");
    
    // Set the image if available
    if (row.fileupload) {
      setPicture(`${profilePath}${row.fileupload}`);
    }

    // Set editing state
    setIsEditing(true);
    setEditingId(row.id);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    reset();
    setProfilePreview(null);
    setPicture("");
    setIsEditing(false);
    setEditingId(null);
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([fieldName, error]) => {
        console.log(`Field ${fieldName} has error:`, error);
      });
    }
  }, [errors]);

  const PaymentCol: Column[] = [
    { key: "id", header: "ID", sortable: true, filterable: true },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      filterable: true,
    },
    {
      key: "credit_date",
      header: "Credit Date",
      sortable: true,
      filterable: true,
    },
    {
      key: "transaction_mode",
      header: "Transaction Mode",
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "Cheque" 
            ? 'bg-blue-100 text-blue-800' 
            : value === "Online Transfer"
            ? 'bg-green-100 text-green-800'
            : value === "Cash Deposit"
            ? 'bg-purple-100 text-purple-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: "transaction_no",
      header: "Transaction Number",
      sortable: true,
      filterable: true,
    },
    {
      key: "remark",
      header: "Remark",
      sortable: true,
      filterable: true,
    },
    {
      key: "deposit_bank",
      header: "Bank",
      sortable: true,
      filterable: true
    },
    {
      key: "deposit_branch",
      header: "Branch",
      sortable: true,
      filterable: true
    },
    {
      key: "partner_bank",
      header: "Partner Bank",
      sortable: true,
      filterable: true
    },
    // {
    //   key: "action",
    //   header: "Action",
    //   sortable: false,
    //   render: (_, row) => (
    //     <div className="flex space-x-2">
    //       <button
    //         className="text-blue-600 hover:text-blue-800 hover:underline text-sm flex items-center gap-1"
    //         onClick={() => handleEdit(row)}
    //       >
    //         <Edit className="w-3 h-3" />
    //         Edit
    //       </button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <>
      <div className="w-full bg-white h-full border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form Header with Edit Indicator */}
          <div className="flex justify-between items-center px-8 pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <Banknote className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-[16px] font-semibold text-gray-800">
                {isEditing ? `Edit Payment #${editingId}` : "Payment Details"}
              </h3>
            </div>
            {isEditing && (
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                Editing Mode
              </span>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 overflow-hidden w-[65%] sm:w-[70%]">
              <div className="p-8 space-y-8">
                {/* Basic Information */}
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-medium text-gray-700">
                        Deposit Date <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        {...register("depositDate")}
                        className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] cursor-not-allowed sm:text-[10px]"
                      />
                      {errors.depositDate && (
                        <p className="text-[10px] text-red-500">
                          {errors.depositDate.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-medium text-gray-700">
                        Payment Mode <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <select
                          {...register("paymentMode")}
                          name="paymentMode"
                          id="paymentMode"
                          className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                        >
                          <option value="">Select Payment Mode</option>
                          {paymentModes.map((mode) => (
                            <option value={mode} key={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                        {errors.paymentMode && (
                          <p className="text-[10px] text-red-500">
                            {errors.paymentMode.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-medium text-gray-700">
                        Partner Bank Accounts{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("partnerBank")}
                        className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                        placeholder="Partner Bank Accounts"
                      />
                      {errors?.partnerBank && (
                        <p className="text-[10px] text-red-500">
                          {errors.partnerBank.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-medium text-gray-700">
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("amount")}
                        type="number"
                        min={0}
                        className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                        placeholder="Enter Amount"
                      />
                      {errors.amount && (
                        <p className="text-[10px] text-red-500">
                          {errors.amount.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-medium text-gray-700">
                        Deposit Bank <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("depositBank")}
                        className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                        placeholder="Enter Deposit Bank"
                      />
                      {errors.depositBank && (
                        <p className="text-[10px] text-red-500">
                          {errors.depositBank.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-medium text-gray-700">
                        Deposit Branch <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("depositBranch")}
                        className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                        placeholder="Enter Deposit Branch"
                      />
                      {errors.depositBranch && (
                        <p className="text-[10px] text-red-500">
                          {errors.depositBranch.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-medium text-gray-700">
                        Remark
                      </label>
                      <input
                        {...register("remark")}
                        className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                        placeholder="Enter Remark"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-medium text-gray-700">
                        Transaction Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("transaction_no")}
                        className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                        placeholder="Enter transaction number"
                      />
                      {errors.transaction_no && (
                        <p className="text-[10px] text-red-500">
                          {errors.transaction_no.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="img-upload px-9 py-12 w-[15%] sm:w-[20%]">
              <div className="flex flex-col items-end gap-6">
                {/* Payment Proof */}
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
                            alt="Payment Proof"
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
                      Payment Proof
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
              onClick={handleReset}
              className="text-[10px] cursor-pointer py-1 px-3 border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              {isEditing ? 'Cancel Edit' : 'Reset'}
            </button>
            <button
              type="submit"
              className="text-[10px] cursor-pointer py-1 px-3 border border-transparent rounded-md shadow-md font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
            >
              {isEditing ? 'Update Payment' : 'Save Payment'}
            </button>
          </div>
        </form>

        <div className="mb-8">
          <BookingTable
            data={paymentList}
            columns={PaymentCol}
            heading={[{ heading: "Uploaded Payments" }]}
            searchable={true}
            filterable={true}
            sortable={false}
            itemsPerPage={50}
          />
        </div>
      </div>
    </>
  );
}