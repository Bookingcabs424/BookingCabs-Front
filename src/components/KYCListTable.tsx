"use client";
import React, { useState } from "react";
import { useDeleteKyc, useGetKycUserInfo } from "../hooks/useCommon";
import { Edit, Eye, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function KYCListTable() {
  const router = useRouter()
  const { data: kycInfo, isLoading, error } = useGetKycUserInfo();
  const deleteKyc = useDeleteKyc();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKycId, setSelectedKycId] = useState<number | null>(null);

  const handleDelete = () => {
    if (selectedKycId) {
      deleteKyc.mutate(selectedKycId, {
        onSuccess: () => {
          toast.success("KYC record deleted successfully");
          setIsModalOpen(false);
          setSelectedKycId(null);
        },
        onError: (error) => {
          console.error("Error deleting KYC:", error);
          toast.error("Failed to delete KYC record");
          setIsModalOpen(false);
          setSelectedKycId(null);
        },
      });
    }
  };

const handleEdit = (kycId: number) => {
  router.push(`/profile/kyc/edit/${kycId}` as any);
};


  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <span className="text-gray-500 text-sm">Loading KYC info...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-6 text-red-500 text-sm">
        Error loading KYC info.
      </div>
    );
  }

  return (
    <div className="w-full px-2 py-3">
      <div className="w-full bg-white rounded-lg shadow-sm border">
        <h2 className="text-lg font-[500] mb-4 border-b pb-2 px-2">
          User KYC Details
        </h2>

        <div className="overflow-auto border border-gray-200 rounded-md">
          <table className="w-full text-sm table-auto border-collapse font-[400]">
            <thead className="bg-gray-100 text-left text-[12px] uppercase">
              <tr>
                <th className="font-[600] px-2 py-2">KYC Document</th>
                <th className="font-[600] px-2 py-2">KYC No.</th>
                <th className="font-[600] px-2 py-2">PAN</th>
                <th className="font-[600] px-2 py-2">Address</th>
                <th className="font-[600] px-2 py-2">City</th>
                <th className="font-[600] px-2 py-2">State</th>
                <th className="font-[600] px-2 py-2">Country</th>
                <th className="font-[600] px-2 py-2">Pincode</th>
                <th className="font-[600] px-2 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {kycInfo && kycInfo.length > 0 ? (
                kycInfo.map((kyc: any, index: number) => (
                  <tr
                    key={kyc.id || index}
                    className="text-[13px] border-t hover:bg-gray-50"
                  >
                    <td className="px-2 py-2">{kyc.kyc_document_name}</td>
                    <td className="px-2 py-2">{kyc.kyc}</td>
                    <td className="px-2 py-2">{kyc.pan}</td>
                    <td className="px-2 py-2">{kyc.address}</td>
                    <td className="px-2 py-2">{kyc.city_name}</td>
                    <td className="px-2 py-2">{kyc.state_name}</td>
                    <td className="px-2 py-2">{kyc.country_name}</td>
                    <td className="px-2 py-2">{kyc.pincode}</td>
                    <td className="px-2 py-2 flex items-center gap-3">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-green-500 hover:text-green-700"
                        title="Edit"
                        onClick={()=> handleEdit(kyc.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                        onClick={() => {
                          setSelectedKycId(kyc.id);
                          setIsModalOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    No KYC details found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-sm p-6 text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this KYC record? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// "use client";
// import React, { useState } from "react";
// import { useDeleteKyc, useGetKycUserInfo } from "../hooks/useCommon";
// import { Edit, Eye, Trash2 } from "lucide-react";
// import { toast } from "react-toastify";

// export default function KYCListTable() {
//   const { data: kycInfo, isLoading, error } = useGetKycUserInfo();
//   const deleteKyc  = useDeleteKyc();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedKycId, setSelectedKycId] = useState<number| null >(null);




//  const handleDelete = () => {
//     if (selectedKycId) {
//       deleteKyc.mutate(selectedKycId, {
//         onSuccess: () => {
//           alert("KYC record deleted successfully");
//           setIsModalOpen(false);
//           setSelectedKycId(null);
//         },
//         onError: (error) => {
//           console.error("Error deleting KYC:", error);
//           alert("Failed to delete KYC record");
//           setIsModalOpen(false);
//           setSelectedKycId(null);
//         },
//       });
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center py-6">
//         <span className="text-gray-500 text-sm">Loading KYC info...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center py-6 text-red-500 text-sm">
//         Error loading KYC info.
//       </div>
//     );
//   }

//   return (
//     <div className="w-full px-2 py-3">
//       <div className="w-full bg-white rounded-lg shadow-sm border">
//         <h2 className="text-lg font-[500] mb-4 border-b pb-2 px-2">
//           User KYC Details
//         </h2>

//         <div className="overflow-auto border border-gray-200 rounded-md">
//           <table className="w-full text-sm table-auto border-collapse font-[400]">
//             <thead className="bg-gray-100 text-left text-[12px] uppercase">
//               <tr>
//                 <th className="font-[600] px-2 py-2">KYC Document</th>
//                 <th className="font-[600] px-2 py-2">KYC No.</th>
//                 <th className="font-[600] px-2 py-2">PAN</th>
//                 <th className="font-[600] px-2 py-2">Address</th>
//                 <th className="font-[600] px-2 py-2">City</th>
//                 <th className="font-[600] px-2 py-2">State</th>
//                 <th className="font-[600] px-2 py-2">Country</th>
//                 <th className="font-[600] px-2 py-2">Pincode</th>
//                 <th className="font-[600] px-2 py-2">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {kycInfo && kycInfo.length > 0 ? (
//                 kycInfo.map((kyc:any, index: number) => (
//                   <tr
//                     key={kyc.id || index}
//                     className="text-[13px] border-t hover:bg-gray-50"
//                   >
//                     <td className="px-2 py-2">{kyc.kyc_document_name}</td>
//                     <td className="px-2 py-2">{kyc.kyc}</td>
//                     <td className="px-2 py-2">{kyc.pan}</td>
//                     <td className="px-2 py-2">{kyc.address}</td>
//                     <td className="px-2 py-2">{kyc.city_name}</td>
//                     <td className="px-2 py-2">{kyc.state_name}</td>
//                     <td className="px-2 py-2">{kyc.country_name}</td>
//                     <td className="px-2 py-2">{kyc.pincode}</td>
//                     <td className="px-2 py-2 flex items-center gap-3">
//                       <button
//                         className="text-blue-500 hover:text-blue-700"
//                         title="View"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button
//                         className="text-green-500 hover:text-green-700"
//                         title="Edit"
//                       >
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button
//                         className="text-red-500 hover:text-red-700"
//                         title="Delete"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={9} className="text-center py-4 text-gray-500">
//                     No KYC details found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import React, { useEffect, useState } from "react";
// import { useUnAssignedBookingMutation } from "../hooks/useCommon";

// interface KYC {
// //   sno: number;
//   image: string;
//   kyc_type: string;
//   kyc: string;
//   kyc_document_name: string;
//   city_id: number;
//   city_name: string;
//   country_id: number;
//   country_name: string;
//   pincode: string;
//   pan: string
//   address: string;
// }

// export default function KYCListTable() {
//   const { data: getUnAssignedBookingData } = useUnAssignedBookingMutation();
//   const [kycData, setKYCData] = useState<KYC[]>([]);

//   useEffect(() => {
//     if (getUnAssignedBookingData?.length) {
//       const mapped = getUnAssignedBookingData.map((item: any, index: number) => ({
//         sno: index + 1,
//         image: item?.image || "", // fallback empty string
//         document_title: item?.document_title || "N/A",
//         document_no: item?.document_no || "N/A",
//         verified_by: item?.verified_by || "N/A",
//         is_verified: item?.is_verified ?? false,
//         expiry_date: item?.expiry_date || "N/A",
//         updated_on: item?.updated_on || "N/A",
//       }));
//       setKYCData(mapped);
//     }
//   }, [getUnAssignedBookingData]);

//   return (
//     <div className="w-full px-2 py-3">
//       <div className="w-full bg-white rounded-lg ">
//         <h2 className="text-lg font-[500] mb-4">User KYC Details</h2>

//         <div className="overflow-auto border border-gray-200 rounded-md">
//           <table className="w-full text-sm table-auto border-collapse font-[400]">
//             <thead className="bg-gray-100 text-left font-[400] text-[10px]">
//               <tr className="bg-gray-200 font-[300]">
//                 {/* <th className="font-[500] px-2 py-2">S.No</th> */}
//                 <th className="font-[500] px-2 py-2">Image</th>
//                 <th className="font-[500] px-2 py-2">Document Title</th>
//                 <th className="font-[500] px-2 py-2">Document No.</th>
//                 <th className="font-[500] px-2 py-2">Verified By</th>
//                 <th className="font-[500] px-2 py-2">Is Verified</th>
//                 <th className="font-[500] px-2 py-2">Expiry Date</th>
//                 <th className="font-[500] px-2 py-2">Last Updated On</th>
//               </tr>
//             </thead>
//             <tbody>
//               {kycData.length > 0 ? (
//                 kycData.map((item, index) => (
//                   <tr key={index} className="text-[12px] border-t hover:bg-gray-50">
//                     {/* <td className="font-[500] px-2 py-2">{item.sno}</td> */}
//                     <td className="font-[500] px-2 py-2">
//                       {item.image ? (
//                         <img
//                           src={item.image}
//                           alt="Document"
//                           className="w-16 h-10 object-cover border rounded"
//                         />
//                       ) : (
//                         <span className="text-gray-400 italic">No image</span>
//                       )}
//                     </td>
//                     <td className="font-[500] px-2 py-2">{item.document_title}</td>
//                     <td className="font-[500] px-2 py-2">{item.document_no}</td>
//                     <td className="font-[500] px-2 py-2">{item.verified_by}</td>
//                     <td className="font-[500] px-2 py-2">
//                       <span
//                         className={`text-xs px-2 py-1 rounded ${
//                           item.is_verified ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
//                         }`}
//                       >
//                         {item.is_verified ? "Verified" : "Unverified"}
//                       </span>
//                     </td>
//                     <td className="font-[500] px-2 py-2">{item.expiry_date}</td>
//                     <td className="font-[500] px-2 py-2">{item.updated_on}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={8} className="text-center py-4 text-gray-500">
//                     No KYC details found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
