import DutyInfoForm from "../../components/DutyInfoForm";
import { Suspense } from "react";

export default function DutyInfoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="max-w-xl mx-auto mt-10 p-6 shadow rounded bg-white shadow-md my-4">
      <h1 className="text-2xl font-bold mb-1 text-black">Duty Info</h1>
      <hr className="border-t-2 border-gray-200" />
      <DutyInfoForm />
    </div>
    </Suspense>
  );
}
