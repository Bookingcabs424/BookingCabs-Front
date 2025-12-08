import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios'
import { useAuth } from '@/store/auth'
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
type ChangePasswordBody = {
  newPassword?: string;
  isCommingFromB2B: boolean;
  user_id: number;
};

type RegisterRequest = {
  first_name: string;
  last_name: string;
  mobile: string;
  mobile_prefix: string;
  email: string;
  password: string;
  confirm_password: string;
  roleType?: string[];
  referral_key?: string;
  newsletter_subscription?: boolean;
  agreement_subscription: boolean;
  parent_id: number;
  city: string;
  nationality: string;
  mobile_promotion: number
  signup_status: number;
  user_type_id?: string;

};

type OtpVerifyRequest = {
  mobile: string;
  email: string;
  otp: string;
  is_guest: boolean;
};
type ResetOTPRequest = {
  mobile: string;
  email: string;
  is_guest: boolean;
};
type guestLoginOTP = {
  identifier: string;
}
type forgotUserPasswordRequest = {
  identifier: string;
  user_type_id: string;
}
type resetPasswordRequest = {
  newPassword: string;
  otp: string;
  token: string;
}
export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (body: { identifier: string; password?: string; type?: string; user_name?: string; recaptchaToken?: string }) => {
      const requestBody = {
        ...body,
        // user_type_id: 10,
        type: body.type || "b2bpanel",
      };
      return api.post('/auth/login', requestBody);
    },
    onSuccess: (res) => {
      const { userData: user, token, licenseDetail } = res?.data?.responseData?.response?.data;
      const user_module = licenseDetail?.user_module || [];

      if (!token) {
        throw new Error("Unauthorized");
      }
      login(user, token, user_module);
    },
  });
};





export const useRegister = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (body: RegisterRequest) =>
      api.post("/auth/register", {
        ...body,
      }),
    onSuccess: (res) => {
      const { user, token, user_module } = res.data;
      login(user, token, user_module);
    },
    onError: (err) => {
      throw new Error(err.message);
    }
  });
};


export const useLogout = () => {
  const { logout } = useAuth()
  const router = useRouter();
  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      logout();
      router.replace("/login");
    },
  })
}

export const verifyOtp = () => {
  const { token } = useAuth()
  return useMutation({
    mutationFn: (body: OtpVerifyRequest) => api.post('/auth/verify-otp', { ...body }),
    onSuccess: (res) => {
      return true;
    },
  })
}

export const resendOtp = () => {
  return useMutation({
    mutationFn: (body: ResetOTPRequest) => api.post('/auth/resend-otp', body),
    onSuccess: (res) => {
      const { user_id, mobile, email } = res?.data?.responseData?.response?.data;
      return user_id;
    },
  })
}

export const useSendOtpForGuest = () => {
  return useMutation({
    mutationFn: (body: guestLoginOTP) => api.post('/auth/send-otp', {
      ...body,
      type: "dashboard",
    }),
    onSuccess: (res) => {
      return true;
    },
  })
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (body: forgotUserPasswordRequest) => api.post('/auth/forgot-password', {
      ...body,
      type: "dashboard",
    }),
    onSuccess: (res) => {
      return true;
    },
  })
};
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (body: resetPasswordRequest) => api.post('/auth/reset-password', {
      ...body,
      type: "dashboard",
    }),
    onSuccess: (res) => {
      return true;
    },
  })
}


export const useChangePassword = () => {
  return useMutation({
    mutationFn: (body: ChangePasswordBody) =>
      api.post("/auth/change-password", body),
    onSuccess: (res) => {
      return res?.data?.responseData?.response?.message || "Password changed successfully";
    },
    onError: (err) => {
      throw new Error(err.message);
    }
  })
}

export const useCheckAuth = () => {
  return useMutation({
    mutationFn: () => api.post('/auth/check-auth')
  })
}
type combinationRequest = {
  email?: string,
  mobile?: string,
  user_type_id: string
}
export const useCombinationMobileChecker = () => {
  return useMutation({
    mutationFn: (body: combinationRequest) =>
      api.post('/auth/combination-mobile-check', body),
    onSuccess: (res) => {
      console.log(res);
    },
  });
};
export const useCombinationEmailChecker = () => {
  return useMutation({
    mutationFn: (body: combinationRequest) =>
      api.post('/auth/combination-email-check', body),
    onSuccess: (res) => {
      console.log(res);
    },
  });
};