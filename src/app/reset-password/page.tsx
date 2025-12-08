"use client";
import React, { Suspense } from "react";
import ResetPasswordPage from "../../components/ResetPasswordPage";
const ResetPassword = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="mx-auto py-20 p-6 rounded bg-gray-50">
      <ResetPasswordPage />
    </div>
    </Suspense>
  );
};

export default ResetPassword;