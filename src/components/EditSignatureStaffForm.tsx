"use client";

import { ChevronLeft, RefreshCcw } from "lucide-react";
import RTE from "./RTE";
import { useGetEditSignature, useUpdateSignature } from "../hooks/useCommon";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditSignatureStaffForm() {
    const searchParams = useSearchParams();
    const user_id = searchParams.get("user_id");
    const { data } = useGetEditSignature(user_id);
    const {mutate}= useUpdateSignature()
    // State to manage the signature content
    const [signatureContent, setSignatureContent] = useState<string>("");
    
    useEffect(() => {
        console.log({ data });
        
        // Map the signature data when it's available
        if (data && data.signature) {
            setSignatureContent(data.signature);
        }
    }, [data]);

    const handleSignatureChange = (content: string) => {
        setSignatureContent(content);
    };

    const handleReset = () => {
        // Reset to original data from API
        if (data && data.signature) {
            setSignatureContent(data.signature);
        } else {
            setSignatureContent("");
        }
    };

    const handleSave = () => {
        // Prepare the data to save
        const saveData = {
            user_id: user_id,
            signature: signatureContent,
            // Include other necessary fields from your original data
            ...(data && {
                id: data.id,
                created_date: data.created_date,
                created_by: data.created_by,
                // Add other fields you need to preserve
            })
        };
        mutate(saveData)
        console.log("Saving signature:", saveData);
        // Add your save API call here
        // await saveSignatureAPI(saveData);
    };

    const handleBack = () => {
        // Navigate back logic
        window.history.back();
    };

    return (
        <div className="flex flex-col w-full">
            <div className="flex items-center justify-end gap-1 py-6">
                <button 
                    onClick={handleBack}
                    className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#DD4B39] border border-gray-300 text-white font-semibold"
                >
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button 
                    onClick={handleReset}
                    className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#00A65A] border border-gray-300 text-white font-semibold"
                >
                    <RefreshCcw className="w-4 h-4" /> Reset
                </button>
                <button 
                    onClick={handleSave}
                    className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#367FA9] border border-gray-300 text-white font-semibold"
                >
                    Save
                </button>
            </div>
            
            {/* Display loading state */}
            {!data ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                /* Pass the signature data to RTE component */
                <RTE 
                    content={signatureContent}
                    onChange={(content)=>{setSignatureContent(content)}}
                    // Note: Your current RTE component doesn't have onChange prop,
                    // so we need to update it
                />
            )}
        </div>
    );
}