"use client";
import React, { Suspense } from "react";
import PersonalInformationForm from "../../components/PersonalInformationForm";

const PersonalInfo = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="mx-auto py-20 p-6 rounded bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-black flex justify-center">Personal Info</h1>
      <PersonalInformationForm />
    </div>
    </Suspense>
  );
};

export default PersonalInfo;
