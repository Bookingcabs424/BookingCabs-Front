"use client";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
import VehicleDetailsForm from "../../components/VehicleDetailsForm";

export default function VehicleDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="max-w-xl mx-auto mt-10 p-6 shadow rounded bg-white shadow-md my-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Vehicle Details</h1>
      <VehicleDetailsForm />
    </div>
    </Suspense>
  );
}
