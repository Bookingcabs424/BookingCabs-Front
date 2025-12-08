"use client";
import React, { Suspense, useEffect, useRef } from "react";
import PrintTicket from "../../../components/CheckoutDetail";
const WrappedPrintTicket = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PrintTicket />
    </Suspense>
  );
};

export default WrappedPrintTicket;
