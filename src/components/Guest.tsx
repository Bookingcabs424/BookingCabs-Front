"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MESSAGES } from "../constants/messages";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useGuestLogin } from "../hooks/useAuth";

const guestSchema = z.object({
  identifier: z.string().min(1, MESSAGES.EMAIL_MANDATORY),
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
});

type GuestInput = z.infer<typeof guestSchema>;

export default function GuestPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestInput>({
    resolver: zodResolver(guestSchema),
  });
  const router = useRouter();
  const [isEnteredEmail, setIsEnteredEmail] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier");

  const guestSessionMutation = useGuestLogin();

  const onSubmit = (data: GuestInput) => {
    if (!data.identifier && !data.first_name && !data.last_name) {
      toast.error("Please provide either password or OTP.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const payload = {
      identifier: data.identifier,
      firstName: data.first_name,
      lastName: data.last_name,
    };

    guestSessionMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Logged in successfully!", {
          position: "top-right",
          autoClose: 5000,
        });
        router.push("/dashboard");
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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (identifier && emailRegex.test(identifier)) {
      setIsEnteredEmail(true);
    } else {
      setIsEnteredEmail(false);
    }
  }, [searchParams]);

  return (
    <div className="w-full flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto my-20 bg-white rounded-md shadow-xl border border-gray-200 w-[75%] p-6  sm:w-[50%] sm:p-8  md:w-[45%] lg:w-[30%]"
      >
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login as Guest
        </h3>

        <div className="mb-4">
          <h5 className="text-sm font-[500] text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </h5>

          <input
            placeholder="Enter First Name"
            {...register("first_name")}
            className="text-black  w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] transition-all duration-200 text-[12px] sm:text-sm"
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.first_name.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <h5 className="text-sm font-[500] text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </h5>

          <input
            placeholder="Enter Last Name"
            {...register("last_name")}
            className="text-black  w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] transition-all duration-200 text-[12px] sm:text-sm"
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.last_name.message}
            </p>
          )}
        </div>

        {isEnteredEmail ? (
          <div className="mb-4">
            <h5 className="text-sm font-[500] text-gray-700 mb-2">
              Mobile <span className="text-red-500">*</span>
            </h5>

            <input
              placeholder="Enter Mobile"
              {...register("identifier")}
              className="text-black  w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] transition-all duration-200 text-[12px] sm:text-sm"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">
                {errors.identifier.message}
              </p>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <h5 className="text-sm font-[500] text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </h5>

            <input
              placeholder="Enter Email"
              {...register("identifier")}
              className="text-black  w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] transition-all duration-200 text-[12px] sm:text-sm"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">
                {errors.identifier.message}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          // disabled={loginMutation.isPending}
          className="w-full my-3 rounded-lg cursor-pointer font-[600] bg-[#dfad08] hover:bg-[#9d7a20] transition duration-300 py-2"
        >
          Login
        </button>
      </form>
    </div>
  );
}
