import { create, StateCreator } from 'zustand'
import { ModuleKey } from "../lib/moduleConfig";

export type User = {
    accept_fare: null;
    active_by: null;
    address: string;
    address2: string | null;
    agreement_subscription: boolean;
    alternate_email: string;
    alternate_mobile: string;
    city: number;
    city_id: number;
    company_id: number;
    country_id: number;
    created_date: string; // ISO date string
    dob: string; // "YYYY-MM-DD"
    duty_status: number;
    email: string;
    email_verified: boolean;
    external_ref: string | null;
    father_name: string;
    first_name: string;
    gcm_id: string;
    gender: 'Male' | 'Female' | 'Other' | string;
    gst_registration_number: string | null;
    id: number;
    isActive: boolean;
    kyc: string | null;
    kyc_type: string | null;
    landline_number: string | null;
    last_name: string;
    login_otp_status: boolean;
    login_status: boolean;
    login_time: string; // ISO datetime
    login_timezone: string;
    logout_time: string; // ISO datetime
    mobile: string;
    mobile_prefix: string;
    mobile_promotion: boolean;
    mobile_verfication: boolean;
    modified_by: number | null;
    nationality: number;
    newsletter_subscription: boolean;
    parent_id: number;
    pincode: string;
    refer_by: string | null;
    referral_key: string;
    signup_status: number;
    state_id: number;
    updated_date: string; // ISO datetime
    user_grade: string;
    user_type_id: number;
    username: string;
    wallet_point: string;
};


type AuthStore = {
    user: User | null;
    token: string | null;
    allowedModules: ModuleKey[];
    login: (user: User, token: string, allowedModules: ModuleKey[]) => void;
    logout: () => void;
    setAllowedModules: (modules: ModuleKey[]) => void;
    isLoggedIn: boolean;
};

const authStoreCreator: StateCreator<AuthStore> = (set, get) => {
    let initialized = false;
    let storedUser: User | null = null;
    let storedToken: string | null = null;
    let storedModules: ModuleKey[] = [];
    let isLoggedIn = false;

    if (typeof window !== "undefined") {
        const userJSON = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        const modules = localStorage.getItem("allowedModules");

        const isValidJSON = (value: string | null) =>
            value && value !== "undefined" && value !== "null";

        storedUser = isValidJSON(userJSON) ? JSON.parse(userJSON!) : null;
        storedToken = token && token !== "undefined" ? token : null;
        storedModules = isValidJSON(modules) ? JSON.parse(modules!) : [];
        isLoggedIn = !!storedToken && !!storedUser;
    }


    return {
        user: storedUser,
        token: storedToken,
        allowedModules: storedModules,
        isLoggedIn,

        login: (user, token, allowedModules) => {
            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("token", token);
                localStorage.setItem("allowedModules", JSON.stringify(allowedModules));
            }
            set({ user, token, allowedModules, isLoggedIn: true });
        },

        logout: () => {
            if (typeof window !== "undefined") {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                localStorage.removeItem("allowedModules");
            }
            set({ user: null, token: null, allowedModules: [], isLoggedIn: false });
        },

        setAllowedModules: (modules) => {
            if (typeof window !== "undefined") {
                localStorage.setItem("allowedModules", JSON.stringify(modules));
            }
            set({ allowedModules: modules });
        },
    };
};

export const useAuth = create<AuthStore>(authStoreCreator);
