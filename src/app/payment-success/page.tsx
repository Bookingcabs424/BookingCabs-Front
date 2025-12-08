"use client";
import React, { Suspense } from "react";
import PaymentSuccessPage from "../../components/PaymentSuccessPage";

const PaymentSuccess = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto p-6 rounded bg-gray-50">
        <h1 className="text-2xl font-bold text-black mt-10 flex justify-center">
          Verify OTP
        </h1>
        <PaymentSuccessPage />
      </div>
    </Suspense>
  );
};

export default PaymentSuccess;
