"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { verifyOtp, resendOtp } from "../hooks/useAuth";
import { MESSAGES } from "../constants/messages";
import { useSearchParams } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const otpSchema = z.object({
  otp: z.string().regex(/^\d{5}$/, MESSAGES.OTP_VALIDATION),
  mobile: z.string(),
  email: z.string(),
  is_guest: z.boolean(),
});

function maskEmail(email: any): any {
  const [local, domain] = email?.split("@") ?? [];
  if (!local || !domain) return email || null;
  const visible = local.slice(0, 2);
  const masked = "*".repeat(local.length - 2);
  return `${visible}${masked}@${domain}`;
}

type OTPInput = z.infer<typeof otpSchema>;

export default function OTPConfirmationPage() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<OTPInput>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
  });
  const [otpArray, setOtpArray] = useState<string[]>(["", "", "", "", ""]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const mobile = searchParams.get("mobile");
  const typeId = searchParams.get("type");
  const verifyMutation = verifyOtp();
  const resendMutation = resendOtp();
  useEffect(() => {
    const joined = otpArray.join("");
    setValue("otp", joined);
    setValue("is_guest", false);
  }, [otpArray, setValue]);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleOTPChange = (index: number, value: string) => {
    const newOtpArray = [...otpArray];
    newOtpArray[index] = value;
    setOtpArray(newOtpArray);
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const onSubmit = async (data: OTPInput) => {
    try {
      if (!/^\d{5}$/.test(data.otp)) {
        toast.error("Please enter a valid 5-digit OTP.");
        return;
      }

      const formattedData = {
        ...data,
        otp: data.otp || "",
        email: email || "",
        mobile: mobile || "",
        is_guest: false,
      };

      verifyMutation.mutate(formattedData, {
        onSuccess: () => {
          toast.success("Verify OTP successfully!", {
            position: "top-right",
            autoClose: 5000,
          });
          const val = ["1", "2", "6", "8"].some((val) => val == typeId);
          if (!val) {
            router.push(`/registration-complete`);
          } else {
            router.push(`/login`);
          }
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "OTP verify failed", {
            position: "top-right",
            autoClose: 5000,
          });
        },
      });
    } catch (error) {
      toast.error("Failed to register. Try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto mt-10 p-8 bg-white rounded-md shadow-xl border border-gray-200 mb-20 flex flex-col items-center justify-center"
    >
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Confirmation
      </h3>

      <p className="text-sm text-center text-gray-700 mb-6">
        Dear User, OTP has been sent on your Mobile/Email -{" "}
        <strong>{maskEmail(email)}</strong>
      </p>

      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Mobile/Email OTP <span className="text-red-500">*</span>
        </label>

        <div className="flex justify-between gap-2">
          {[...Array(5)].map((_, index) => (
            <input
              key={index}
              ref={(el: any) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-10 h-10 text-center text-black text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9d7a20] sm:w-12 h-12"
              onChange={(e) =>
                handleOTPChange(index, e.target.value.replace(/\D/, ""))
              }
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <input type="hidden" {...register("otp")} />
        <input type="hidden" {...register("email")} value={email ?? ""} />
        <input type="hidden" {...register("mobile")} value={mobile ?? ""} />
        {errors.otp && (
          <p className="text-[#b36af7] text-sm mt-1">{errors.otp.message}</p>
        )}
      </div>

      <button
        type="submit"
        className={`w-full py-3 rounded-lg cursor-pointer font-[600]  ${
          verifyMutation.isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#dfad08] hover:bg-[#9d7a20]"
        } transition duration-300`}
      >
        {verifyMutation.isPending ? "Verifying..." : "Verify OTP"}
      </button>

      <div className="mt-4 text-center text-sm text-gray-600">
        <a href="/resend-otp" className="text-black hover:underline">
          Resend OTP
        </a>
      </div>
    </form>
  );
}
