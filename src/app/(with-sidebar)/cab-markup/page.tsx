"use client";
import AddTransportForm from "../../../components/AddTransportForm";
import SearchTransportMarkupForm from "../../../components/SearchTransportMarkupForm";
import TransportMarkupTable from "../../../components/TransportMarkupTable";
import { useState } from "react";


export default function CabMarkupPage(){
    const [activeCabMarkupForm,setActiveCabMarkupForm] = useState<string>("CabMarkupList");

    return(
        <div className="bg-gray-100 min-h-screen scrollbar-hide">
            {
                activeCabMarkupForm === "CabMarkupList" ? <>
            <SearchTransportMarkupForm/>
            <TransportMarkupTable setActiveCabMarkupForm={setActiveCabMarkupForm}/></>  : 
            <AddTransportForm setActiveCabMarkupForm={setActiveCabMarkupForm}/>

            }
        </div>
    )
}