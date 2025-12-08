"use client";
import { useState } from "react";
import StaffTable from "../../../components/StaffTable";
import AddStaffForm from "../../../components/AddStaffForm";
  
export default function AddStaffPage() {
  const [staffPageType, setStaffPageType] = useState<string>("table");

  return (
    <>
      {staffPageType === "table" && (
        <StaffTable setStaffPageType={setStaffPageType} />
      )}
      {staffPageType === "form" && (
        <AddStaffForm setStaffPageType={setStaffPageType} />
      )}
    </>
  );
}



// "use client";
// import AddStaffForm from "../../../components/AddStaffForm";
// import StaffRecordTable from "../../../components/StaffRecordTable";
// import { useState } from "react";



// export default function AddStaffPage(){
//     const [activeStaffForm,setActiveStaffForm] = useState<string>("StaffList")
//     return(
//         <div className="bg-gray-100 min-h-screen">
//             {
//                 activeStaffForm === "StaffList" ? <StaffRecordTable setActiveStaffForm={setActiveStaffForm}/> :
//             <AddStaffForm setActiveStaffForm={setActiveStaffForm}/>

//             }
//         </div>
//     )
// }
