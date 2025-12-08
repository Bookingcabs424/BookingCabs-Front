"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, useSendOtpForGuest } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { MESSAGES } from "../constants/messages";
import { useRouter } from "next/navigation";
import Link from "next/link";

const loginSchema = z
  .object({
    identifier: z.string().min(1, MESSAGES.EMAIL_MANDATORY),
    password: z
      .string()
      .min(6, MESSAGES.PASSWORD_LENGTH)
      .optional()
      .or(z.literal("")),
    otp: z
      .string()
      .regex(/^\d{5}$/, MESSAGES.OTP_VALIDATION)
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const isPasswordProvided = data.password && data.password.trim() !== "";
    const isOtpProvided = data.otp && data.otp.trim() !== "";

    if (!isPasswordProvided && !isOtpProvided) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: MESSAGES.LOGIN_AUTH,
        path: ["otp"],
      });
    }
  });

type LoginInput = z.infer<typeof loginSchema>;
type Props = {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginPopup({ setShowLogin }: Props) {
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [isOTP, setIsOTP] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [otpValues, setOtpValues] = useState(Array(5).fill(""));

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const loginMutation = useLogin();
  const otpMutation = useSendOtpForGuest();

  const onClose = () => {
    setShowLogin(false);
  };

  const onSubmit = (data: LoginInput) => {
    if (!data.password && !data.otp) {
      toast.error("Please provide either password or OTP.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    loginMutation.mutate(data as {
  identifier: string;
  password?: string;
  otp?: string;
}, {
      onSuccess: () => {
        toast.success("Logged in successfully!", {
          position: "top-right",
          autoClose: 5000,
        });
        setShowLogin(false);
        router.push("/dashboard");
        // if (isGuest) {
        //   router.push(`/guest?identifier=${data.identifier}`);
        // }
        // router.back();
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.responseData?.response?.message || "Login failed",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      },
    });
  };

  const toggleLoginMethod = (val: string) => {
    const identifierValue = getValues("identifier");
    if (identifierValue == "") {
      toast.error("Please enter email/mobile number before login with otp.");
      return;
    }
    reset({
      identifier: identifierValue,
      password: "",
      otp: "",
    });
    setIsOTP(!isOTP);
    if (val == "otp") {
      otpSent({ identifier: identifierValue });
    }
  };

  const optSchema = z
    .object({
      identifier: z.string().min(1, MESSAGES.EMAIL_MANDATORY),
    })
    .refine(
      (data) =>
        /^[6-9]\d{9}$/.test(data.identifier) ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier),
      {
        path: ["identifier"],
        message: MESSAGES.INVALID_EMAIL_PASSWORD,
      }
    );

  const otpSent = (data: unknown) => {
    const parsed = optSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || "Invalid input");
      return;
    }

    otpMutation.mutate(parsed.data as { identifier: string }, {
      onSuccess: () => {
        toast.success("Otp sent successfully on the you email/mobile!", {
          position: "top-right",
          autoClose: 5000,
        });
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.responseData?.response?.message ||
            "Otp sent failed.",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      },
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // allow only digits

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // move to next input if not the last and value is present
    if (value && index < 4) {
      otpRefs.current[index + 1]?.focus();
    }

    // update form value for react-hook-form
    const fullOtp = newOtpValues.join("");
    if (fullOtp.length === 5) {
      setValue("otp", fullOtp);
    } else {
      setValue("otp", ""); // clear if incomplete
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };
  useEffect(() => {
    otpRefs.current[0]?.focus();
  }, [isOTP]);
  useEffect(() => {}, [getValues("otp")]);

  return (
    <div className="fixed inset-0 bg-[#00000098] bg-opacity-50 flex items-center justify-center z-50">
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-6 rounded w-[70%] lg:w-[40%]"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto my-20 bg-white rounded-md border border-gray-200 w-full p-6  sm:p-8"
        >
          <button
            onClick={onClose}
            className="text-gray-500 text-3xl cursor-pointer hover:text-black float-right"
          >
            &times;
          </button>
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h3>

          <div className="mb-4">
            <h5 className="text-sm font-[500] text-gray-700 mb-2">
              Email/Mobile <span className="text-red-500">*</span>
            </h5>

            <input
              {...register("identifier")}
              placeholder="Enter Email/Mobile"
              className="text-black  w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] transition-all duration-200 text-[12px] sm:text-sm"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {isOTP ? (
            <>
              <div className="mb-4">
                <h5 className="text-sm font-[500] text-gray-700 mb-2">
                  OTP <span className="text-red-500">*</span>
                </h5>
                <div className="flex gap-2">
                  {otpValues.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      ref={(el) => {
                        otpRefs.current[index] = el!;
                      }}
                      className="text-black w-10 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9d7a20] text-lg"
                    />
                  ))}
                </div>
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.otp.message}
                  </p>
                )}
              </div>
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-600">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleLoginMethod("password");
                    }}
                    className="text-blue-500 hover:underline float-left mb-2"
                  >
                    Login with Password
                  </a>
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <h5 className="text-sm font-[500] text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </h5>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Enter Password"
                  className="text-black  w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] transition-all duration-200 text-[12px] sm:text-sm"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-600">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleLoginMethod("otp");
                    }}
                    className="text-[#9d7a20] hover:underline float-left mb-2"
                  >
                    Login with OTP
                  </a>
                </span>
              </div>
            </>
          )}

          <button
            type="submit"
            // disabled={loginMutation.isPending}
            className={`w-full  rounded-lg cursor-pointer font-[600] ${
              loginMutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#dfad08] hover:bg-[#9d7a20]"
            } transition duration-300 py-2 sm:py-3`}
          >
            {loginMutation.isPending
              ? "Logging in..."
              : isOTP
              ? "Verify"
              : "Login"}
          </button>

          <div className="my-4 text-center">
            <span className="text-sm text-gray-600 flex items-center justify-between flex-col sm:flex-row">
              <Link
                href="/signup"
                className="text-[#9d7a20] hover:underline float-left"
              >
                New User?
              </Link>
              <Link
                href="/forgot-password"
                className="text-black hover:underline float-right"
              >
                Forgot Password?
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
