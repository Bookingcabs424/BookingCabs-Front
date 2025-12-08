"use client";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegistrationComplete(type:any) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center flex-col gap-3 my-20">
      <h1 className="text-3xl font-semibold">Thank You.</h1>
      <CheckCircle className="w-14 h-14 text-green-500" />
      <h2 className="font-[500] text-xl">
        Your Registration has been successfully completed.
      </h2>

      <h1 className="text-md font-[500]">
        Click Here to &nbsp;
        <a
          href="https://b2b.bookingcabs.in/"
          className="cursor-pointer bg-yellow-500 px-6 py-1 rounded inline-block"
        >
          Login
        </a>
      </h1>
    </div>
  );
}
