"use client";
import React, { useState } from "react";
import RegistrationOptions from "../../components/RegistrationOptions";

const SignupPage = () => {
  return (
    <div className="mx-auto mt-10 p-6 rounded bg-white w-[85%] sm:w-[70%] lg:w-[50%]">
      <h1 className="text-2xl font-bold mb-4 text-black">User Registration</h1>
      <RegistrationOptions internal={false}/>
    </div>
  );
};

export default SignupPage;
