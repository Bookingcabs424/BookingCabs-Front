"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, User } from "lucide-react";
import { useForgotPassword } from "../../hooks/useAuth";
import { toast } from "react-toastify";
// Error messages
const MESSAGES = {
  IDENTIFIER_REQUIRED: "Email is required",
  IDENTIFIER_INVALID: "Enter a valid email or 10-digit mobile number",
};

const userTypeEnum = z.enum(["1", "6", "7", "8"], {
  required_error: "Please select user type",
});
const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, MESSAGES.IDENTIFIER_REQUIRED)
    .refine(
      (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^[6-9]\d{9}$/.test(val),
      MESSAGES.IDENTIFIER_INVALID
    ),

  user_type_id: z.preprocess(
    (val) => (typeof val === "string" && val === "" ? undefined : val),
    userTypeEnum
  ) as z.ZodType<"1" | "6" | "7" | "8">,
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const forgotMutation = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
      forgotMutation.mutate(data as { identifier: string; user_type_id: "1" | "6" | "7" | "8" }, {
      onSuccess: () => {
        toast.success("Reset link sent on your email!", {
          position: "top-right",
          autoClose: 5000,
        });
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.responseData?.response?.message ||
            "Issue sending reset link sent on your email",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      },
    });
  };

  return (
    <div className="flex items-center justify-center py-20 bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-md shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-[500] text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                {...register("identifier")}
                className={`w-full pl-10 pr-4 py-2 rounded-md border text-sm outline-none text-black ${
                  errors.identifier ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="you@example.com or 9876543210"
              />
            </div>
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* User Type Select */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-[500] text-gray-700 mb-2">
              User Type
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                {...register("user_type_id")}
                className={`w-full pl-10 pr-4 py-2 rounded-md border text-sm outline-none text-black ${
                  errors.user_type_id ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select user type</option>
                <option value="1">User</option>
                <option value="6">Corporate User</option>
                <option value="7">Travel Agent</option>
                <option value="8">Hotel Agent</option>
              </select>
            </div>
            {errors.user_type_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.user_type_id.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full my-2 bg-[#dfad08] cursor-pointer font-[500] py-2 px-4 rounded-md hover:bg-[#9d7a20] transition"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
