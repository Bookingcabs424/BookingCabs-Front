"use client";
import React, { Suspense } from "react";
import  TicketDetail  from "../../components/TicketDetail";
const PrintTicketPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <h1>{<TicketDetail />}</h1>
      </div>
    </Suspense>
  );
};
export default PrintTicketPage;