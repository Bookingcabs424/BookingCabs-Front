"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../store/auth";
import { FullPageSpinner } from "../components/common/FullPageSpinner";
import { useCheckAuth } from "../hooks/useAuth";

export const publicRoutes = [
  "/",
  "/login",
  "/login/",
  "/otpverify/",
  "/otpverify",
  "/personalinfo",
  "/personalinfo/",
  "/company/",
  "/company",
  "/signup",
  "/signup/",
  "/forgot-password",
  "/register",
  "/company-details/",
  "/company-details",
  "/vehicle-details",
  "/vehicle-details/",
  "/duty-info",
  "/duty-info/",
  "/registration-complete",
  "/registration-complete/",
  "/terms",
  "/terms/",
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const { mutate } = useCheckAuth();
  const { user } = useAuth();
  // this code only for the b2b
  // useEffect(() => {
  //   if (user) {
  //     setTimeout(() => {
  //       if (user?.signup_status == 1) {
  //         router.push(
  //           `/otpverify?email=${encodeURIComponent(
  //             user.email
  //           )}&mobile=${encodeURIComponent(
  //             user.mobile
  //           )}&type=${encodeURIComponent(user?.user_type_id)}`
  //         );
  //       } else if (user?.signup_status == 2) {
  //         router.push(
  //           `/personalinfo?email=${encodeURIComponent(
  //             user.email
  //           )}&mobile=${encodeURIComponent(
  //             user.mobile
  //           )}&typeId=${encodeURIComponent(user?.user_type_id || 0)}`
  //         );
  //       } else if (user?.signup_status == 3 && user?.user_type_id != 1) {
  //         router.push(
  //           `/company-details?email=${encodeURIComponent(
  //             user.email
  //           )}&mobile=${encodeURIComponent(
  //             user.mobile
  //           )}&typeId=${encodeURIComponent(user?.user_type_id || 0)}`
  //         );
  //       } else if (user?.signup_status == 4 && user?.user_type_id != 3) {
  //         router.push(
  //           `/vehicle-details?email=${encodeURIComponent(
  //             user.email
  //           )}&mobile=${encodeURIComponent(
  //             user.mobile
  //           )}&typeId=${encodeURIComponent(user?.user_type_id || 0)}`
  //         );
  //       } else if (user?.signup_status == 5 && user?.user_type_id != 3) {
  //         router.push(
  //           `/duty-info?email=${encodeURIComponent(
  //             user.email
  //           )}&mobile=${encodeURIComponent(
  //             user.mobile
  //           )}&typeId=${encodeURIComponent(user?.user_type_id || 0)}`
  //         );
  //       }
  //     }, 0);
  //   }
  // }, [user]);
  useEffect(() => {
    const isPublic = publicRoutes.includes(pathname);

    if (isPublic) {
      setAuthChecked(true);
      return;
    }

    mutate(undefined, {
      onSuccess: (res) => {
        const isLoggedIn = res?.data?.responseData?.response?.data?.isLoggedIn;
        if (!isLoggedIn) {
          logout();
          router.replace("/login");
        }
        setAuthChecked(true);
      },
      onError: () => {
        logout();
        router.replace("/login");
        setAuthChecked(true);
      },
    });
  }, [pathname]);

  if (!authChecked) {
    return <FullPageSpinner />;
  }

  return <>{children}</>;
}
