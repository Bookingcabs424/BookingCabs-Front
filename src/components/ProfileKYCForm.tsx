import {
  useGetUserKycList,
  useGetUserProfileInfo,
  useUnAssignedBookingMutation,
  useUpdateUserDoc,
  useUpdateUserProfilePhoto,
  useGetUpdateUserDoc,
  useGetCompanyDetail,
  useUpdateCompanyKycDetail,
  useUpdateUserKyc,
  useGetCountries,
  useGetStatesbyCountryId,
  useGetCitiesbyStateId,
  useEditKyc,
  useDeleteKyc,
  useGetKycUserInfo,
} from "../hooks/useCommon";
import { useAuth } from "../store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Camera, IdCard, MapPin, Shield, UploadCloud } from "lucide-react";
import { z } from "zod";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import BookingTable from "./common/Table";
import Swal from "sweetalert2";
import { Edit, Trash2 } from "lucide-react";

export const schema = z.object({
  kyc_type: z.string().min(1, { message: "KYC type is required" }),
  kyc: z.string().min(1, { message: "KYC number is required" }),
  pan: z.string().optional(),
  gst_registration_number: z.string().optional(),
  address: z.string().optional(),
  pincode: z.string().optional(),
  city_id: z.string().optional(),
  state_id: z.string().optional(),
  country_id: z.string().optional(),
  last_updated_on: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    }),

  verified_by: z.string().optional().or(z.literal("")),
});

export type FormData = z.infer<typeof schema>;

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: any;
  render?: (value: any, row?: any) => React.ReactNode;
  hidden?: boolean;
}

export default function ProfileKYCForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedKycType = watch("kyc_type");

  const { user: authUser } = useAuth();
  const userId = String(authUser?.id) ?? "-1";
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const { data: countries } = useGetCountries();
  const { data: states, refetch: stateRefetch } = useGetStatesbyCountryId(
    Number(selectedCountry)
  );
  const { data: cities, refetch: cityRefetch } = useGetCitiesbyStateId(Number(selectedState));
  useEffect(() => {
    if (selectedCountry) {
      stateRefetch();
    }
  }, [selectedCountry, stateRefetch]);


 

  useEffect(() => {
    if (selectedState) {
      cityRefetch();
    }
  }, [selectedState, cityRefetch]);



  const { data: docData, refetch } = useGetUpdateUserDoc();
  const { data: kycData } = useGetUserKycList("kyc_proof");
  const { data: kycInfo } = useGetKycUserInfo();

   useEffect(() => {
  console.log("KYC Info from API:", kycInfo);
}, [kycInfo]);
  const { mutate: uploadDoc } = useUpdateUserDoc(Number(authUser?.id));

  const { mutate: addKyc, isPending: isAdding } = useUpdateUserKyc();
  const { mutate: editKyc, isPending: isUpdating } = useEditKyc();
  const { mutate: deleteKyc, isPending: isDeleting } = useDeleteKyc();

  const queryClient = useQueryClient();

  const isPending = isAdding || isUpdating || isDeleting;

  const kycList = useMemo(() => {
    return kycData || [];
  }, [kycData]);

  const handleDocImageChange = (e: any, typeId: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadData = uploadDoc(
        {
          file,
          folder: "user-doc",
          doc_type_id: selectedKycType,
          user_id: userId || "",
          kyc: getValues("kyc"),
        },
        {
          onSuccess: (response: any) => {
            const value = response.userInfo;
            setValue("kyc", value.kyc);
          },
          onError: (err: any) => {
            toast.error("Something went wrong. Please try again.");
          },
        }
      );
    }
  };

  const handleDocImageChange2 = (e: any, typeId: any) => {
    const file = e.target.files?.[0];
    console.log("file to upload", file)
    if (file) {
      uploadDoc(
        {
          file,
          folder: "user-doc",
          doc_type_id: typeId,
          user_id: userId || "",
        },
        {
          onSuccess: (response: any) => {
            console.log(response.uploadData.doc_file_upload)
            refetch();
          },
          onError: (err: any) => {
            toast.error("Something went wrong. Please try again.");
          },
        }
      );
    }
  };

  const profilePath = process.env.NEXT_PUBLIC_API_PIC_URL;

  function getDocumentPath(docs: any[], typeId: number, basePath?: string) {
    const doc = docs?.find((d) => d.document_type_id === typeId);
    if (!doc || !doc.doc_file_upload) return "";

    const fileParts = doc.doc_file_upload.split("/");
    const folderPath = fileParts.slice(0, -1).join("/");
    const fileName = fileParts[fileParts.length - 1] || "";

    return `${basePath}${folderPath}/${encodeURIComponent(fileName)}`;
  }
  const panPicture = getDocumentPath(docData, 3, profilePath);
  const gstPicture = getDocumentPath(docData, 21, profilePath);

  const addressPicture = getDocumentPath(docData, 2, profilePath);
  const licPicture = getDocumentPath(docData, 7, profilePath);
  const rcPicture = getDocumentPath(docData, 8, profilePath);
  const rPicture = getDocumentPath(docData, 1, profilePath);
  const c_front_Picture = getDocumentPath(docData, 33, profilePath);
  const c_Inside_Picture = getDocumentPath(docData, 34, profilePath);
  const c_team_Picture = getDocumentPath(docData, 35, profilePath);


  const onVerifyhandler = () => {
    toast.info("This feature not available in your plan.");
  };
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        kyc_type: data.kyc_type,
        kyc: data.kyc,
        country_id: data.country_id,
        city_id: data.city_id,
        state_id: data.state_id,
        pan: data.pan,
        address: data.address,
        pincode: data.pincode,
      };

      if (isEditing && editingId) {
        editKyc({ kycId: editingId, body: payload }, {
          onSuccess: () => {
            toast.success("KYC updated successfully");
            reset();
            setIsEditing(false);
            setEditingId(null);
            queryClient.invalidateQueries({ queryKey: ['kycUserInfo'] });
          },
          onError: (error: any) => toast.error(error),
        });
      } else {
        addKyc(payload, {
          onSuccess: () => {
            toast.success("KYC added successfully");
            reset();
            queryClient.invalidateQueries({ queryKey: ['kycUserInfo'] });
          },
          onError: (error: any) => toast.error(error),
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Error ${isEditing ? 'updating' : 'adding'} KYC. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (row: any) => {
    console.log("Editing row:", row);
    
    setValue("kyc_type", row.kyc_type?.toString() || "");
    setValue("kyc", row.kyc || "");
    setValue("pan", row.pan || "");
    setValue("address", row.address || "");
    setValue("pincode", row.pincode?.toString() || "");
    setValue("country_id", row.country_id?.toString() || "");
    setValue("state_id", row.state_id?.toString() || "");
    setValue("city_id", row.city_id?.toString() || "");

    setSelectedCountry(row.country_id?.toString() || "");
    setSelectedState(row.state_id?.toString() || "");
    setSelectedCity(row.city_id?.toString() || "");

    setIsEditing(true);
    setEditingId(row.id);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    reset();
    setIsEditing(false);
    setEditingId(null);
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");
  };

  const handleDelete = (row: any) => {
    console.log("Deleting row:", row);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteKyc(row.id, {
          onSuccess: () => {
            Swal.fire("Deleted!", "Your KYC has been deleted.", "success");
            queryClient.invalidateQueries({ queryKey: ['kycUserInfo'] });
          },
          onError: (error: any) => {
            toast.error("Failed to delete KYC record");
          },
        });
      }
    });
  };

  const kycColumns: Column[] = [
    { 
      key: "id", 
      header: "ID", 
      sortable: true, 
      filterable: true,
      hidden: true
    },
    {
      key: "kyc_document_name",
      header: "KYC Document",
      sortable: true,
      filterable: true,
    },
    {
      key: "kyc",
      header: "KYC No.",
      sortable: true,
      filterable: true,
    },
    {
      key: "pan",
      header: "PAN",
      sortable: true,
      filterable: true,
    },
    {
      key: "address",
      header: "Address",
      sortable: true,
      filterable: true,
    },
    {
      key: "city_name",
      header: "City",
      sortable: true,
      filterable: true,
    },
    {
      key: "state_name",
      header: "State",
      sortable: true,
      filterable: true,
    },
    {
      key: "country_name",
      header: "Country",
      sortable: true,
      filterable: true,
    },
    {
      key: "pincode",
      header: "Pincode",
      sortable: true,
      filterable: true,
    },
    {
      key: "action",
      header: "Action",
      sortable: false,
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 hover:underline text-sm flex items-center gap-1"
            onClick={() => handleEdit(row)}
          >
            <Edit className="w-3 h-3" />
            Edit
          </button>
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 hover:underline text-sm flex items-center gap-1"
            onClick={() => handleDelete(row)}
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3 w-full ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                <Shield className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-[16px] font-semibold text-gray-800">
                {isEditing ? `Edit KYC #${editingId}` : "KYC Details"}
              </h3>
            </div>
            {isEditing && (
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                Editing Mode
              </span>
            )}
          </div>
          <div className="grid sm:grid-cols-2 items-end md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px]  text-gray-700">
                Personal KYC Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register("kyc_type", {
                  required: "KYC type is required",
                })}
                className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
              >
                <option value="">-- Select Kyc Document --</option>
                {kycList?.map((doc: any) => (
                  <option key={doc.doc_type_id} value={doc.doc_type_id}>
                    {doc.document_name}
                  </option>
                ))}
              </select>
              {errors.kyc_type && (
                <p className="text-[10px] text-red-500">
                  {errors.kyc_type.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-[10px]  text-gray-700">
                KYC Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register("kyc")}
                className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                placeholder="Enter KYC number"
              />
              {errors.kyc && (
                <p className="text-[10px] text-red-500">{errors.kyc.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <button
                onClick={onVerifyhandler}
                type="button"
                className="text-[10px] bg-blue-400 hover:bg-blue-500 cursor-pointer text-white px-5 py-2 rounded font-[500]"
              >
                Verify
              </button>
            </div>

            {selectedKycType && (
              <div className="col-span-2">
                <label className="block text-[10px] ">KYC Upload</label>
                <input
                  type="file"
                  className="block w-full text-[10px] mt-1"
                  onChange={(e) => {
                    handleDocImageChange(e, "");
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <hr className="my-4 border-t border-gray-200" />
        <div className="flex gap-4">
          <div className="flex  w-[70%] gap-6">
            <div className="space-y-2">
              <label className="block text-[10px]  text-gray-700">
                PAN Number
              </label>
              <input
                {...register("pan")}
                className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                placeholder="Enter PAN number"
              />
              {errors.pan && (
                <p className="text-[10px] text-red-500">{errors.pan.message}</p>
              )}
            </div>

            <div className="space-y-2 mt-5">
              <button
                onClick={onVerifyhandler}
                type="button"
                className="text-[10px] bg-blue-400 hover:bg-blue-500 cursor-pointer text-white px-5 py-2 rounded font-[500]"
              >
                Verify
              </button>
            </div>
          </div>
          <div className="img-upload w-[30%] px-9">
            <div className="flex flex-col items-end gap-6">
              <div className="flex flex-col items-center space-y-3">
                <div className="relative group">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => {
                        handleDocImageChange2(e, "3");
                      }}
                      className="hidden"
                      accept="image/*"
                    />
                    <div className="relative">
                      {panPicture ? (
                        <img
                          src={panPicture}
                          className="w-40 h-30 object-cover border-4 border-white shadow-md transition-all duration-300"
                          alt="PAN Proof"
                        />
                      ) : (
                        <div className="w-25 h-25 flex items-center justify-center border-3 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:border-blue-400 group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300">
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
                  <p className="text-[10px]  text-gray-700">PAN Proof</p>
                  <p className="text-xs text-gray-500">
                    Click to upload or change
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4 border-t border-gray-200" />
       
        <hr className="my-4 border-t border-gray-200" />
        <div className="flex gap-5 justify-between">
          <div className="w-[70%]">
            {/* Address Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <MapPin className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-[16px] font-semibold text-gray-800">
                  Address Proof
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px]  text-gray-700">
                    Address
                  </label>
                  <input
                    {...register("address")}
                    className="py-2 px-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-sm border border-indigo-200 text-gray-700 text-[10px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] text-gray-700">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("country_id", {
                      required: "Country is required",
                    })}
                    onChange={(e) => {
                      console.log(e.target.value);
                      const val = e.target.value;
                      setSelectedCountry(val);
                      setValue("country_id", val);
                      setSelectedState(""); // reset state when country changes
                      setValue("state_id", "");
                      setValue("city_id", "");
                    }}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px]"
                  >
                    <option value="">-- Select Country --</option>
                    {countries?.map((country: any) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country_id && (
                    <p className="text-[10px] text-red-500">
                      {errors.country_id.message}
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] text-gray-700">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("state_id", {
                        required: "State is required",
                      })}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedState(val);
                        setValue("state_id", val);
                        setValue("city_id", "");
                      }}
                      className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px]"
                      disabled={!selectedCountry}
                    >
                      <option value="">-- Select State --</option>
                      {states?.map((state: any) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    {errors.state_id && (
                      <p className="text-[10px] text-red-500">
                        {errors.state_id.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px]  text-gray-700">
                    Pin Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("pincode")}
                 
                    className="py-2 px-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-sm border border-indigo-200 text-gray-700 text-[10px]"
                    placeholder="Enter pin code"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("city_id", { required: "City is required" })}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setValue("city_id", e.target.value);
                    }}
                    className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px]"
                    disabled={!selectedState}
                  >
                    <option value="">-- Select City --</option>
                    {cities?.map((city: any) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.city_id && (
                    <p className="text-[10px] text-red-500">
                      {errors.city_id.message}
                    </p>
                  )}
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
                        handleDocImageChange2(e, "1");
                      }}
                      className="hidden"
                      accept="image/*"
                    />
                    <div className="relative">
                      {rPicture ? (
                        <img
                          src={rPicture}
                          className="w-40 h-30 object-cover border-4 border-white shadow-md transition-all duration-300"
                          alt="Address Proof"
                        />
                      ) : (
                        <div className="w-25 h-25 flex items-center justify-center border-3 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:border-blue-400 group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300">
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
                  <p className="text-[10px]  text-gray-700">Address Proof</p>
                  <p className="text-xs text-gray-500">
                    Click to upload or change
                  </p>
                </div>

                <div className="flex justify-end items-end mt-10 gap-4 pt-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isSubmitting || isPending}
                    className="text-[10px] py-1 px-3 border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEditing ? 'Cancel Edit' : 'Reset'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isPending}
                    className="text-[10px] py-1 px-3 cursor-pointer border border-transparent rounded-md shadow-md font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting || isPending 
                      ? "Saving..." 
                      : isEditing 
                        ? "Update KYC" 
                        : "Save KYC"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="mt-8">
        <BookingTable
          data={kycInfo}
          columns={kycColumns}
          heading={[{ heading: "User KYC Details" }]}
          searchable={true}
          filterable={true}
          sortable={true}
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}

// import {
//   useGetUserKycList,
//   useGetUserProfileInfo,
//   useUnAssignedBookingMutation,
//   useUpdateUserDoc,
//   useUpdateUserProfilePhoto,
//   useGetUpdateUserDoc,
//   useGetCompanyDetail,
//   useUpdateCompanyKycDetail,
//   useUpdateUserKyc,
//   useGetCountries,
//   useGetStatesbyCountryId,
//   useGetCitiesbyStateId,
// } from "../hooks/useCommon";
// import { useAuth } from "../store/auth";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useSearchParams } from "next/navigation";
// import { useMemo, useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { Camera, IdCard, MapPin, Shield, UploadCloud } from "lucide-react";
// import { z } from "zod";
// import KYCListTable from "./KYCListTable";
// import { toast } from "react-toastify";
// import EditKYCForm from "./EditKycForm";
// export const schema = z.object({
//   kyc_type: z.string().min(1, { message: "KYC type is required" }),
//   kyc: z.string().min(1, { message: "KYC number is required" }),
//   pan: z.string().optional(),
//   gst_registration_number: z.string().optional(),
//   address: z.string().optional(),
//   pincode: z.string().optional(),
//   city_id: z.string().optional(),
//   state_id: z.string().optional(),
//   country_id: z.string().optional(),
//   last_updated_on: z
//     .string()
//     .optional()
//     .or(z.literal(""))
//     .refine((val) => !val || !isNaN(new Date(val).getTime()), {
//       message: "Invalid date format",
//     }),

//   verified_by: z.string().optional().or(z.literal("")),
// });

// export type FormData = z.infer<typeof schema>;

// export default function ProfileKYCForm() {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     watch,
//     setValue,
//     getValues,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//   });

//   const selectedKycType = watch("kyc_type");

//   const { user: authUser } = useAuth();
//   const userId = String(authUser?.id) ?? "-1";
//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");

//   const { data: countries } = useGetCountries();
//   const { data: states, refetch: stateRefetch } = useGetStatesbyCountryId(
//     Number(selectedCountry)
//   );
//   const { data: cities } = useGetCitiesbyStateId(Number(selectedState));
//   useEffect(() => {
//     stateRefetch();
//   }, [selectedCountry]);
//   const {
//     data: userProfile,
//     isLoading: isProfileLoading,
//     isError,
//     error,
//   } = useGetUserProfileInfo(Number(authUser?.id));

//   const { data: docData, refetch } = useGetUpdateUserDoc();
//   const { data: kycData, isLoading } = useGetUserKycList("kyc_proof");
//   const { mutate: uploadDoc } = useUpdateUserDoc(Number(authUser?.id));

//   const { mutate: updateKyc, isPending } = useUpdateUserKyc();

//   const kycList = useMemo(() => {
//     return kycData || [];
//   }, [kycData]);

//   const handleDocImageChange = (e: any, typeId: any) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const uploadData = uploadDoc(
//         {
//           file,
//           folder: "user-doc",
//           doc_type_id: selectedKycType,
//           user_id: userId || "",
//           kyc: getValues("kyc"),
//         },
//         {
//           onSuccess: (response: any) => {
//             const value = response.userInfo;
//             setValue("kyc", value.kyc);
//           },
//           onError: (err: any) => {
//             toast.error("Something went wrong. Please try again.");
//           },
//         }
//       );
//     }
//   };

//   const handleDocImageChange2 = (e: any, typeId: any) => {
//     const file = e.target.files?.[0];
//     console.log("file to upload", file)
//     if (file) {
//       uploadDoc(
//         {
//           file,
//           folder: "user-doc",
//           doc_type_id: typeId,
//           user_id: userId || "",
//         },
//         {
//           onSuccess: (response: any) => {
//             console.log(response.uploadData.doc_file_upload)
//             refetch();
//           },
//           onError: (err: any) => {
//             toast.error("Something went wrong. Please try again.");
//           },
//         }
//       );
//     }
//   };

//   const profilePath = process.env.NEXT_PUBLIC_API_PIC_URL;

//   function getDocumentPath(docs: any[], typeId: number, basePath?: string) {
//     const doc = docs?.find((d) => d.document_type_id === typeId);
//     if (!doc || !doc.doc_file_upload) return "";

//     const fileParts = doc.doc_file_upload.split("/");
//     const folderPath = fileParts.slice(0, -1).join("/");
//     const fileName = fileParts[fileParts.length - 1] || "";

//     return `${basePath}${folderPath}/${encodeURIComponent(fileName)}`;
//   }
//   const panPicture = getDocumentPath(docData, 3, profilePath);
//   const gstPicture = getDocumentPath(docData, 21, profilePath);

//   const addressPicture = getDocumentPath(docData, 2, profilePath);
//   const licPicture = getDocumentPath(docData, 7, profilePath);
//   const rcPicture = getDocumentPath(docData, 8, profilePath);
//   const rPicture = getDocumentPath(docData, 1, profilePath);
//   const c_front_Picture = getDocumentPath(docData, 33, profilePath);
//   const c_Inside_Picture = getDocumentPath(docData, 34, profilePath);
//   const c_team_Picture = getDocumentPath(docData, 35, profilePath);

//   useEffect(() => {
//     if (userProfile) {
//       reset({
//         ...getValues(),
//         address: userProfile.address || "",
//         pincode: userProfile.pincode || "",
//       });
//     }
//   }, [userProfile, reset, getValues]);

//   const onVerifyhandler = () => {
//     toast.info("This feature not available in your plan.");
//   };
//   useEffect(() => {
//     console.log(errors);
//   }, [errors]);

//   const onSubmit = async (data: any) => {
//     setIsSubmitting(true)
//     try {
//       const payload = {
//         kyc_type: data.kyc_type,
//         kyc: data.kyc,
//         country_id: data.country_id,
//         city_id: data.city_id,
//         state_id: data.state_id,
//         pan: data.pan,
//         address: data.address,
//         pincode: data.pincode,
//       };

      
  
//       updateKyc(payload, {
//         onSuccess: () => {
//           toast.success("KYC updated successfully")
//           reset();
  
//         },
//         onError: (error: any) => toast.error(error),
//       });
//     } catch (error) {
      
//     }
//   };

//   return (
//     <div className="flex flex-col gap-3 w-full ">
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="space-y-6">
//           <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
//             <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
//               <Shield className="w-3 h-3 text-white" />
//             </div>
//             <h3 className="text-[16px] font-semibold text-gray-800">
//               KYC Details
//             </h3>
//           </div>
//           <div className="grid sm:grid-cols-2 items-end md:grid-cols-3 gap-6">
//             <div className="space-y-2">
//               <label className="block text-[10px]  text-gray-700">
//                 Personal KYC Type <span className="text-red-500">*</span>
//               </label>
//               <select
//                 {...register("kyc_type", {
//                   required: "KYC type is required",
//                 })}
//                 className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
//               >
//                 <option value="">-- Select Kyc Document --</option>
//                 {kycList?.map((doc: any) => (
//                   <option key={doc.doc_type_id} value={doc.doc_type_id}>
//                     {doc.document_name}
//                   </option>
//                 ))}
//               </select>
//               {errors.kyc_type && (
//                 <p className="text-[10px] text-red-500">
//                   {errors.kyc_type.message}
//                 </p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <label className="block text-[10px]  text-gray-700">
//                 KYC Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 {...register("kyc")}
//                 className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
//                 placeholder="Enter KYC number"
//               />
//               {errors.kyc && (
//                 <p className="text-[10px] text-red-500">{errors.kyc.message}</p>
//               )}
//             </div>
//             <div className="space-y-2">
//               <button
//                 onClick={onVerifyhandler}
//                 type="button"
//                 className="text-[10px] bg-blue-400 hover:bg-blue-500 cursor-pointer text-white px-5 py-2 rounded font-[500]"
//               >
//                 Verify
//               </button>
//             </div>

//             {selectedKycType && (
//               <div className="col-span-2">
//                 <label className="block text-[10px] ">KYC Upload</label>
//                 <input
//                   type="file"
//                   className="block w-full text-[10px] mt-1"
//                   onChange={(e) => {
//                     handleDocImageChange(e, "");
//                   }}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//         <hr className="my-4 border-t border-gray-200" />
//         <div className="flex gap-4">
//           <div className="flex  w-[70%] gap-6">
//             <div className="space-y-2">
//               <label className="block text-[10px]  text-gray-700">
//                 PAN Number
//               </label>
//               <input
//                 {...register("pan")}
//                 className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
//                 placeholder="Enter PAN number"
//               />
//               {errors.pan && (
//                 <p className="text-[10px] text-red-500">{errors.pan.message}</p>
//               )}
//             </div>

//             <div className="space-y-2 mt-5">
//               <button
//                 onClick={onVerifyhandler}
//                 type="button"
//                 className="text-[10px] bg-blue-400 hover:bg-blue-500 cursor-pointer text-white px-5 py-2 rounded font-[500]"
//               >
//                 Verify
//               </button>
//             </div>
//           </div>
//           <div className="img-upload w-[30%] px-9">
//             <div className="flex flex-col items-end gap-6">
//               <div className="flex flex-col items-center space-y-3">
//                 <div className="relative group">
//                   <label className="cursor-pointer">
//                     <input
//                       type="file"
//                       onChange={(e) => {
//                         handleDocImageChange2(e, "3");
//                       }}
//                       className="hidden"
//                       accept="image/*"
//                     />
//                     <div className="relative">
//                       {panPicture ? (
//                         <img
//                           src={panPicture}
//                           className="w-40 h-30 object-cover border-4 border-white shadow-md transition-all duration-300"
//                           alt="PAN Proof"
//                         />
//                       ) : (
//                         <div className="w-25 h-25 flex items-center justify-center border-3 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:border-blue-400 group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300">
//                           <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
//                         </div>
//                       )}
//                       <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2.5 rounded-full shadow-md hover:shadow-md transition-shadow">
//                         <Camera className="w-3 h-3" />
//                       </div>
//                     </div>
//                   </label>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-[10px]  text-gray-700">PAN Proof</p>
//                   <p className="text-xs text-gray-500">
//                     Click to upload or change
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <hr className="my-4 border-t border-gray-200" />
       
//         <hr className="my-4 border-t border-gray-200" />
//         <div className="flex gap-5 justify-between">
//           <div className="w-[70%]">
//             {/* Address Information */}
//             <div className="space-y-3">
//               <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
//                 <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
//                   <MapPin className="w-3 h-3 text-white" />
//                 </div>
//                 <h3 className="text-[16px] font-semibold text-gray-800">
//                   Address Proof
//                 </h3>
//               </div>

//               <div className="grid md:grid-cols-2 gap-3">
//                 <div className="space-y-2">
//                   <label className="block text-[10px]  text-gray-700">
//                     Address
//                   </label>
//                   <input
//                     {...register("address")}
//                     className="py-2 px-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-sm border border-indigo-200 text-gray-700 text-[10px]"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="block text-[10px] text-gray-700">
//                     Country <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     {...register("country_id", {
//                       required: "Country is required",
//                     })}
//                     onChange={(e) => {
//                       console.log(e.target.value);
//                       const val = e.target.value;
//                       setSelectedCountry(val);
//                       setValue("country_id", val);
//                       setSelectedState(""); // reset state when country changes
//                       setValue("state_id", "");
//                       setValue("city_id", "");
//                     }}
//                     className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px]"
//                   >
//                     <option value="">-- Select Country --</option>
//                     {countries?.map((country: any) => (
//                       <option key={country.id} value={country.id}>
//                         {country.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.country_id && (
//                     <p className="text-[10px] text-red-500">
//                       {errors.country_id.message}
//                     </p>
//                   )}
//                 </div>
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <label className="block text-[10px] text-gray-700">
//                       State <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       {...register("state_id", {
//                         required: "State is required",
//                       })}
//                       onChange={(e) => {
//                         const val = e.target.value;
//                         setSelectedState(val);
//                         setValue("state_id", val);
//                         setValue("city_id", "");
//                       }}
//                       className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px]"
//                       disabled={!selectedCountry}
//                     >
//                       <option value="">-- Select State --</option>
//                       {states?.map((state: any) => (
//                         <option key={state.id} value={state.id}>
//                           {state.name}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.state_id && (
//                       <p className="text-[10px] text-red-500">
//                         {errors.state_id.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-[10px]  text-gray-700">
//                     Pin Code <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     {...register("pincode")}
//                     value={userProfile?.pincode}
//                     disabled
//                     className="py-2 px-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-sm border border-indigo-200 text-gray-700 text-[10px]"
//                     placeholder="Enter pin code"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="block text-[10px] text-gray-700">
//                     City <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     {...register("city_id", { required: "City is required" })}
//                     onChange={(e) => {
//                       console.log(e.target.value);
//                       setValue("city_id", e.target.value);
//                     }}
//                     className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px]"
//                     disabled={!selectedState}
//                   >
//                     <option value="">-- Select City --</option>
//                     {cities?.map((city: any) => (
//                       <option key={city.id} value={city.id}>
//                         {city.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.city_id && (
//                     <p className="text-[10px] text-red-500">
//                       {errors.city_id.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="img-upload w-[30%] px-9 py-12">
//             <div className="flex flex-col items-end gap-6">
//               {/* License Proof */}
//               <div className="flex flex-col items-center space-y-3">
//                 <div className="relative group">
//                   <label className="cursor-pointer">
//                     <input
//                       type="file"
//                       onChange={(e) => {
//                         handleDocImageChange2(e, "1");
//                       }}
//                       className="hidden"
//                       accept="image/*"
//                     />
//                     <div className="relative">
//                       {rPicture ? (
//                         <img
//                           src={rPicture}
//                           className="w-40 h-30 object-cover border-4 border-white shadow-md transition-all duration-300"
//                           alt="Address Proof"
//                         />
//                       ) : (
//                         <div className="w-25 h-25 flex items-center justify-center border-3 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:border-blue-400 group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300">
//                           <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
//                         </div>
//                       )}
//                       <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2.5 rounded-full shadow-md hover:shadow-md transition-shadow">
//                         <Camera className="w-3 h-3" />
//                       </div>
//                     </div>
//                   </label>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-[10px]  text-gray-700">Address Proof</p>
//                   <p className="text-xs text-gray-500">
//                     Click to upload or change
//                   </p>
//                 </div>

//                 <div className="flex justify-start mt-4">
//                   <button
//                     type="submit"
//                     className="py-1 px-3 cursor-pointer border border-transparent rounded-md shadow-md text-[10px] font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//       <KYCListTable />
    
//     </div>
//   );
// }


