"use client";
export const dynamic = "force-dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield } from "lucide-react";
import { useChangePassword } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";
const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordForm = z.infer<typeof schema>;

export default function ProfilePasswordForm() {
  const changeMutation = useChangePassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(schema),
  });

  const { user: authUser } = useAuth();
  const onSubmit = async (data: ChangePasswordForm) => {
    changeMutation.mutate(
      {
        newPassword: data.newPassword,
        user_id: Number(authUser.id),
        isCommingFromB2B: true,
      },
      {
        onSuccess: (res: any) => {
          toast.success("Password changed successfully!", {
            position: "top-right",
            autoClose: 5000,
          });
          // router.push(`/${path}`);
        },
        onError: (err: any) => {
          const errMsg =
            err?.response?.data?.responseData?.response?.message ||
            "Change failed";
          // setError(errMsg);
          toast.error(errMsg, {
            position: "top-right",
            autoClose: 5000,
          });
        },
      }
    );
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-white">
        <div className="flex justify-between">
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 overflow-hidden w-full">
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-[16px] font-semibold text-gray-800">
                  Change Password
                </h3>
              </div>
              <div className="space-y-3">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-medium text-gray-700">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register("newPassword")}
                        autoComplete="off"
                        type="password"
                        className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                        placeholder="New Password"
                      />
                      {errors?.newPassword && (
                        <p className="text-[10px] text-red-500">
                          {errors.newPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-medium text-gray-700">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      autoComplete="off"
                      {...register("confirmPassword")}
                      className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      placeholder="Confirm Password"
                    />
                    {errors?.confirmPassword && (
                      <p className="text-[10px] text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="text-[10px]  py-1 px-3 border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
            onClick={() => {
              reset({
                newPassword: "",
                confirmPassword: "",
              });
            }}
          >
            Reset
          </button>
          <button
            type="submit"
            className="text-[10px]  py-1 px-3 cursor-pointer border border-transparent rounded-md shadow-md text-[10px] font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
}
