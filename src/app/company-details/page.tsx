import { Suspense } from "react";
import CompanyRegistrationForm from "../../components/CompanyDetailForm";

export default function CompanyDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-6xl mx-auto mt-10 p-6 shadow-md rounded bg-white my-20">
        <h1 className="text-2xl font-bold mb-2 text-black">
          Add Company Details
        </h1>
        <hr className="border-t-2 border-gray-200" />

        <CompanyRegistrationForm />
      </div>
    </Suspense>
  );
}
