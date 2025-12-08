"use client";
import React, { Suspense, useEffect, useRef } from "react";
import PrintTicket from "../../components/QuotationDetail";
const PrintTicketWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PrintTicket />
    </Suspense>
  );
};
export default PrintTicketWrapper;


