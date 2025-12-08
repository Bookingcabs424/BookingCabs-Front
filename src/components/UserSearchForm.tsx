"use client";
import { Search } from 'lucide-react';
import { countryNames } from '../constants/countryNames';

const userType = ["Normal User","Un-registered User","Corporate","Travel Agent","Hotel"];
const status = ['Active','On Hold','Black Listed','Inactive','Unapproved','Deleted'];


export default function UserSearchForm() {
  return (
    <></>
    // <div className="add-user-form bg-white shadow-md border border-gray-300 m-6 mb-3 mt-0 rounded-sm sm:m-12 sm:mb-3 sm:mt-0">
    //   <h1 className="bg-gray-300 py-3 px-5  font-semibold flex items-center gap-2 text-sm sm:text-base">
    //     <Search/> Search User
    //   </h1>
    //   <div className="grid grid-cols-1 p-3 sm:p-6 gap-3 sm:grid-cols-2 md:grid-cols-3">
    //     <div className="flex flex-col py-1">
    //       <label
    //         htmlFor="userId"
    //         className="font-semibold text-[12px] text-sm"
    //       >
    //         User ID
    //       </label>
    //       <input
    //         type="text"
    //         placeholder="Enter User ID"
    //         className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
    //       />
         
    //     </div>

    //     <div className="flex flex-col py-1">
    //       <label
    //         htmlFor="firstName"
    //         className="font-semibold text-[12px] text-sm"
    //       >
    //         First Name
    //       </label>
    //       <input
    //         type="text"
    //         placeholder="Enter First Name"
    //         className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
    //       />
    //     </div>
    //     <div className="flex flex-col py-1">
    //       <label
    //         htmlFor="mobile"
    //         className="font-semibold text-[12px] text-sm"
    //       >
    //         Mobile
    //       </label>
    //       <input
    //         type="tel"
    //         placeholder="Enter Mobile No."
    //         className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
    //       />
    //     </div>

    //     <div className="flex flex-col py-1">
    //       <label htmlFor="email" className="font-semibold text-[12px] text-sm">
    //         Email
    //       </label>
    //       <input
    //         type="email"
    //         className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
    //         placeholder="Enter Email"
    //       />
    //     </div>

        

    //      <div className="flex flex-col py-1">
    //         <label
    //           htmlFor="country"
    //           className="font-semibold text-[12px] text-sm"
    //         >
    //           Country
    //         </label>
    //         <select name="country" id=""  className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm">
    //       <option value="Select Country" defaultValue="Select Country">Select Country</option>
    //       {
    //         countryNames.map((country) => (
    //           <option value={country} key={country}>{country}</option>
    //         ))
    //       }
    //      </select>
    //       </div>



    //       <div className="flex flex-col py-1">
    //         <label
    //           htmlFor="state"
    //           className="font-semibold text-[12px] text-sm"
    //         >
    //           State
    //         </label>
    //         <select name="state" id=""  className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm">
    //       <option value="Select State" defaultValue="Select State">Select State</option>
          
    //      </select>
    //       </div>


    //       <div className="flex flex-col py-1">
    //         <label
    //           htmlFor="city"
    //           className="font-semibold text-[12px] text-sm"
    //         >
    //           City
    //         </label>
    //         <select name="state" id=""  className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm">
    //       <option value="Select city" defaultValue="Select State">Select City</option>
          
    //      </select>
    //       </div>

    //       <div className="flex flex-col py-1">
    //       <label
    //         htmlFor="userType"
    //         className="font-semibold text-[12px] text-sm"
    //       >
    //         User Type
    //       </label>
          
    //      <select name="userType" id=""  className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm">
    //       <option value="Select User Type" defaultValue="Select User Type">Select User Type</option>
    //       {
    //         userType.map((user) => (
    //           <option value={user} key={user}>{user}</option>
    //         ))
    //       }
    //      </select>
    //     </div>


    //     <div className="flex flex-col py-1">
    //       <label
    //         htmlFor="userType"
    //         className="font-semibold text-[12px] text-sm"
    //       >
    //         Status
    //       </label>
          
    //      <select name="userType" id=""  className="w-full border text-[12px] sm:text-sm border-gray-300 focus:outline-none py-2 px-3 rounded-sm">
    //       <option value="Select Status" defaultValue="Select Status">Select Status</option>
    //       {
    //         status.map((item) => (
    //           <option value={item} key={item}>{item}</option>
    //         ))
    //       }
    //      </select>
    //     </div>
    //   </div>

    //   <div className="flex gap-3 justify-end p-4 pt-0">
    //     <button className="text-[12px] sm:text-sm cursor-pointer py-2 px-6 rounded-sm bg-[#101828] text-white">
    //       Search
    //     </button>
    //     <button className="text-[12px] sm:text-sm cursor-pointer py-2 px-6 rounded-sm bg-[#101828] text-white">
    //       Clear
    //     </button>
    //   </div>
    // </div>
  );
}
