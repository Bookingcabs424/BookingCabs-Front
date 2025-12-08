"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { Lock } from "lucide-react";
import { useRef, useState, Suspense } from "react";
import { useResetPassword } from "../hooks/useAuth";
import { toast } from "react-toastify";

const schema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpValues, setOtpValues] = useState(Array(5).fill(""));
  const resetMutation = useResetPassword();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const otpRefs = useRef<HTMLInputElement[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(schema),
  });

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length <= 1) {
      const newOtp = [...otpValues];
      newOtp[index] = val;
      setOtpValues(newOtp);

      if (val && index < 4) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const onSubmit = async (data: ResetPasswordForm) => {
    const otp = otpValues.join("");

    if (otp.length !== 5) {
      setOtpError("Please enter the 5-digit OTP");
      return;
    }

    setOtpError(null);
    setLoading(true);
    setError(null);
    setMessage(null);

    resetMutation.mutate(
      {
        newPassword: data.newPassword,
        otp,
        token,
      },
      {
        onSuccess: (res: any) => {
          setMessage(res?.message || "Password reset successful");
          toast.success("Password reset successfully!", {
            position: "top-right",
            autoClose: 5000,
          });
        },
        onError: (err: any) => {
          const errMsg =
            err?.response?.data?.responseData?.response?.message ||
            "Reset failed";
          setError(errMsg);
          toast.error(errMsg, {
            position: "top-right",
            autoClose: 5000,
          });
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  {...register("newPassword")}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none text-black ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter new password"
                />
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none text-black ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm new password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <div className="flex space-x-2 justify-center">
                {[...Array(5)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-12 h-12 text-black text-center border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleOtpChange(e, index)}
                    value={otpValues[index]}
                    ref={(el: any) => (otpRefs.current[index] = el!)}
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {otpError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition duration-200"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
            {message && (
              <p className="text-green-600 text-sm text-center">{message}</p>
            )}
          </form>
        </div>
      </div>
  );
}
