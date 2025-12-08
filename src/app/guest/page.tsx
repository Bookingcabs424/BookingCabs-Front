"use client";
import React, { Suspense } from "react";
import GuestPage from "../../components/Guest";

const Guest = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-8xl mx-auto mt-10 p-6 shadow rounded bg-white">
        <GuestPage />
      </div>
    </Suspense>
  );
};

export default Guest;
