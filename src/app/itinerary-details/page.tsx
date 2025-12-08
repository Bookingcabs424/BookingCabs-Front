"use client";
import React, { Suspense } from "react";
import ItineraryDetailsPage from "../../components/ItineraryDetailsPage";

const ItineraryDetailPages = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-8xl mx-auto mt-10 p-6 shadow rounded bg-white">
        <ItineraryDetailsPage />
      </div>
    </Suspense>
  );
};

export default ItineraryDetailPages;
