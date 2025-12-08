"use client";
import React, { Suspense } from "react";
import OTPConfirmationPage from "../../components/VerifyOtpForm";

const OTPPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto p-6 rounded bg-gray-50">
        <h1 className="text-2xl font-bold text-black mt-10 flex justify-center">
          Verify OTP
        </h1>
        <OTPConfirmationPage />
      </div>
    </Suspense>
  );
};

export default OTPPage;
