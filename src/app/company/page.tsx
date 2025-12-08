"use client";
import React, { Suspense } from "react";
import Company from "../../components/CompanyDetailForm";

const CompanyPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-7xl mx-auto mt-10 p-6 shadow rounded bg-white">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Add Company Details
        </h1>
        <Company />
      </div>
    </Suspense>
  );
};

export default CompanyPage;
