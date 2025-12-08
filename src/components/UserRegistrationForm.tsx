import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCity, useCountry } from "../store/common";
import {
  useGetCityDataMutation,
  useGetCountryDataMutation,
  useGetGSTNumberVerificationMutation,
} from "../hooks/useCommon";
import React, { useMemo, useState, useEffect } from "react";
import { debounce } from "lodash";
import mobilePrefixData from "../constants/mobilePrefix.json";
import { useRegister } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FastForward } from "lucide-react";
import {
  useCombinationMobileChecker,
  useCombinationEmailChecker,
} from "../hooks/useAuth";

import { useAuth } from "../store/auth";

const baseSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email"),
  mobile_prefix: z.string().optional(),
  mobile: z.string().min(10).regex(/^\d+$/, "Mobile must be numeric"),
  referral_key: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
  city: z.string().min(1, "City is required"),
  nationality: z.string().min(1, "Nationality is required"),
  newsletter_subscription: z.boolean().optional(),
  agreement_subscription: z.literal(true, {
    errorMap: () => ({ message: "Must accept terms" }),
  }),
  user_type_id: z.number().optional(),
  mobile_promotion: z.number().optional(),
  signup_status: z.number().optional(),
  role: z.string().min(1, "Please select a role"),
  gst: z.string().optional(),
  company_name: z.string().optional(),
  company_size: z.string().optional(),
});

const personalSchema = baseSchema.refine(
  (data) => data.password === data.confirm_password,
  {
    message: "Passwords do not match",
    path: ["confirm_password"],
  }
);

const corporateSchema = baseSchema
  .extend({
    gst: z.string().min(1, "GST is required"),
    company_name: z.string().min(1, "Company Name is required"),
    company_size: z.string().min(1, "Company Size is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type UserFormData =
  | z.infer<typeof personalSchema>
  | z.infer<typeof corporateSchema>;

type Option = "personal" | "corporate";
type UserRegistrationFormProps = {
  formName: string;
  typeId: number;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<Option | null>>;
  isInternal?: boolean;
};

interface PrefixOption {
  label: string;
  value: string;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({
  formName,
  typeId,
  selected,
  setSelected,
  isInternal = false,
}) => {
  const { user } = useAuth();
  const schema = useMemo(
    () => (selected === "corporate" ? corporateSchema : personalSchema),
    [selected]
  );
  useEffect(() => {
    setValue("newsletter_subscription", true);
    setValue("role", "1");
  }, []);
  // Use a union of both schemas for the form type to allow all possible fields
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<z.infer<typeof personalSchema> & z.infer<typeof corporateSchema>>(
    {
      resolver: zodResolver(schema) as any,
    }
  );
  const router = useRouter();
  const { mutate: getCityData } = useGetCityDataMutation();
  const { mutate: getCountryData } = useGetCountryDataMutation();
  const { cityData } = useCity();
  const { countryData } = useCountry();
  const registerMutation = useRegister();
  const [selectedPrefix, setSelectedPrefix] = useState("+91");
  const [cityInput, setCityInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [countryInput, setCountryInput] = useState("");
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [selectedNationalityId, setSelectedNationalityId] =
    useState<string>("");
  const { mutate: getGstData } = useGetGSTNumberVerificationMutation();
  // const [role, setrole] = useState<string>("");
  // const handleChangerole = (role: string) => {
  //   setrole(role);
  // };
  const [isGstVerified, setIsGstVerified] = useState(false);
  const [showSection, setShowSection] = useState(true);
  const [hasCompany, setHasCompany] = useState(true);
  const { mutate: combinationMutationMobile } = useCombinationMobileChecker();
  const { mutate: combinationMutationEmail } = useCombinationEmailChecker();
  const [combinationMStatus, setCombinationStatus] = useState<null | string>(
    ""
  );
  const [combinationEStatus, setCombinationEStatus] = useState<null | string>(
    ""
  );
  const email = watch("email");
  const mobile = watch("mobile");
  const role = watch("role");

  const combinationMChecker = () => {
    const role = getValues("role");
    const mobile = getValues("mobile");

    if (!mobile || !role) return; // avoid empty calls

    combinationMutationMobile(
      { user_type_id: role, mobile },
      {
        onSuccess: (res: any) => {
          if (!res.data.responseData.response.message) {
            setCombinationStatus("This combination already exists.");
            toast.error(
              "User with this Mobile and role already exists, please change !!"
            );
          } else {
            setCombinationStatus(null);
            toast.info("This Mobile and role available, please procced!!");
          }
        },
        onError: () => {
          setCombinationStatus("Error checking combination.");
        },
      }
    );
  };

  const combinationEChecker = () => {
    const email = getValues("email");
    const role = getValues("role");

    if (!email || !role) return; // avoid empty calls

    combinationMutationEmail(
      { user_type_id: role, email },
      {
        onSuccess: (res: any) => {
          if (!res.data.responseData.response.message) {
            setCombinationEStatus("This combination already exists.");
            toast.error(
              "User with this email and role already exists, please change !!"
            );
          } else {
            setCombinationEStatus(null);
            toast.info("This email and role available, please procced!!");
          }
        },
        onError: () => {
          setCombinationEStatus("Error checking combination.");
        },
      }
    );
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!email) return;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      if (role) {
        combinationEChecker();
      }
    }, 1500);

    return () => clearTimeout(delayDebounce);
  }, [email, role]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!mobile) return;

      if (mobile.length !== 10) {
        toast.error("Mobile should be 10 digits");
      } else if (role) {
        combinationMChecker();
      }
    }, 1500);

    return () => clearTimeout(delayDebounce);
  }, [mobile, role]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (combinationMStatus || combinationEStatus) {
        toast.error("This combination is already registered.");
        return;
      }
      const val = selected === "corporate";
      // const roles = val ? role : "4";
      const formattedData = {
        ...data,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        company_name: data.company_name || "",
        gst: data.gst || "",
        company_size: data.company_size || "",
        user_type_id: role,
        parent_id: isInternal ? user?.id : 0,
        mobile_promotion: 0,
        signup_status: 1,
        mobile_prefix: data.mobile_prefix ?? "+91",
        city: selectedCityId,
        nationality: selectedNationalityId,
        isCoporate: val,
        skip: !showSection,
        agreement_subscription: data.agreement_subscription,
        newsletter_subscription: data.newsletter_subscription ?? false,
        confirm_password: data.confirm_password,
      };

      registerMutation.mutate(formattedData, {
        onSuccess: () => {
          toast.success("Registration successfully!", {
            position: "top-right",
            autoClose: 5000,
          });
          if (!isInternal) {
            router.push(
              `/otpverify?email=${encodeURIComponent(
                data.email
              )}&mobile=${encodeURIComponent(
                data.mobile
              )}&type=${encodeURIComponent(role)}`
            );
          } else {
            router.push(`/user`);
          }
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "register failed", {
            position: "top-right",
            autoClose: 5000,
          });
        },
      });
    } catch (error) {
      toast.error("Failed to register. Try again.");
    }
  };

  const debouncedGetCity = useMemo(() => {
    return debounce((val: string) => {
      if (!val) {
        return;
      }
      getCityData(val);
    }, 500);
  }, [getCityData]);

  const debouncedGetCountry = useMemo(() => {
    return debounce((val: string) => {
      if (!val) {
        return;
      }
      getCountryData(val);
    }, 500);
  }, [getCountryData]);

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityInput(value);
    setShowSuggestions(true);
    debouncedGetCity(value);
  };

  const handleCountryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCountryInput(value);
    setShowCountrySuggestions(true);
    debouncedGetCountry(value);
  };

  const handleCountrySelect = (nationality: string, id: string) => {
    setCountryInput(nationality);
    setValue("nationality", nationality);
    setShowCountrySuggestions(false);
    setSelectedNationalityId(id);
  };

  const handleCitySelect = (city: any, id: string) => {
    setSelectedCityId(id);
    setCityInput(city);
    setValue("city", city);
    setShowSuggestions(false);
  };
  const onVerifyHandler = () => {
    const gstValue = getValues("gst")?.trim();

    if (!gstValue) {
      toast.error("Please enter a valid GST number.", {
        position: "top-right",
        autoClose: 5000,
      });
      setIsGstVerified(false);
      return;
    }

    getGstData(gstValue, {
      onSuccess: (val: any) => {
        const isExisting = val?.data?.responseData?.response?.data?.isExisting;

        if (isExisting) {
          toast.success("Company already exists!", {
            position: "top-right",
            autoClose: 5000,
          });
          setIsGstVerified(false);
        } else {
          toast.success("GST number verified successfully!", {
            position: "top-right",
            autoClose: 5000,
          });
          setIsGstVerified(true);
        }
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.responseData?.response?.message ||
            "GST verification failed",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
        setIsGstVerified(false);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto bg-white shadow-xl rounded-md space-y-3 border border-gray-100 p-6 sm:p-8"
    >
      <h2 className="font-bold text-gray-600 mb-4 text-lg text-center sm:text-xl sm:text-start">
        {formName == "Personal" ? "Personal" : "Vendor"} Registration
      </h2>

      {/* First Name */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-sm font-[500] text-gray-800">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("first_name")}
            type="text"
            placeholder="Enter First Name"
            className="text-black  w-full px-4 py-2 border border-gray-300 rounded-lg  placeholder-gray-500 focus:outline-none text-[12px] sm:text-sm"
          />
          {errors.first_name && (
            <p className="text-xs text-red-600 mt-1">
              {errors.first_name.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-1">
          <label className="block text-sm font-[500] text-gray-800">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("last_name")}
            type="text"
            placeholder="Enter Last Name"
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg  placeholder-gray-500 focus:outline-none  text-[12px] sm:text-sm"
          />
          {errors.last_name && (
            <p className="text-xs text-red-600 mt-1">
              {errors.last_name.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="block text-sm font-[500] text-gray-800">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="user@gmail.com"
          className="text-black text-sm w-full px-4 py-2 border border-gray-300 rounded-lg  placeholder-gray-500 focus:outline-none  text-black text-[12px] sm:text-sm"
        />
        {combinationEStatus && (
          <p className="text-xs text-red-600 mt-1">{"Not Available"}</p>
        )}
        {combinationEStatus == null && (
          <p className="text-xs text-green-600 mt-1">{"Available"}</p>
        )}
        {errors.email && (
          <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-2 grid-cols-2 xl:grid-cols-3">
        {/* Mobile Prefix + Mobile */}
        <div className="space-y-1 col-span-2">
          <label className="block text-sm font-[500] text-gray-800">
            Mobile No <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <select
              value={selectedPrefix}
              onChange={(e) => setSelectedPrefix(e.target.value)}
              className="w-[30%] border border-gray-300 p-2 focus:outline-none rounded-sm text-[12px] sm:text-sm"
            >
              {mobilePrefixData.mobilePrefix.map(({ initial, prefix }) => (
                <option key={prefix} value={prefix}>
                  {prefix} ({initial})
                </option>
              ))}
            </select>
            <input
              {...register("mobile")}
              type="text"
              placeholder="Enter Mobile No."
              className="text-black w-3/4 px-3 py-2 border border-gray-300 rounded-lg  placeholder-gray-500 focus:outline-none  text-[12px] sm:text-sm"
              maxLength={10}
              minLength={10}
            />
          </div>
          {errors.mobile && (
            <p className="text-xs text-red-600 mt-1">{errors.mobile.message}</p>
          )}
          {combinationMStatus && (
            <p className="text-xs text-red-600 mt-1">{"Not Available"}</p>
          )}
          {combinationMStatus == null && (
            <p className="text-xs text-green-600 mt-1">{"Available"}</p>
          )}
          {errors.mobile_prefix && (
            <p className="text-xs text-red-600 mt-1">
              {errors.mobile_prefix.message}
            </p>
          )}
        </div>

        {/* Refer By */}
        <div className="space-y-1  col-span-3 xl:col-span-1">
          <label className="block text-sm font-[500] text-gray-800">
            Refer By (Ref Code)
          </label>
          <input
            {...register("referral_key")}
            type="text"
            placeholder="Enter Referral Code"
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg  placeholder-gray-500 focus:outline-none   text-[12px] sm:text-sm"
          />
        </div>
      </div>

      <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
        {/* Password */}
        <div className="space-y-1">
          <label className="block text-sm font-[500] text-gray-800">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="Enter Password"
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg  placeholder-gray-500 focus:outline-none   text-[12px] sm:text-sm"
          />
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="block text-sm font-[500] text-gray-800">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            {...register("confirm_password")}
            type="password"
            placeholder="Enter Confirm Password"
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg  placeholder-gray-500 focus:outline-none   text-[12px] sm:text-sm"
          />
          {errors.confirm_password && (
            <p className="text-xs text-red-600 mt-1">
              {errors.confirm_password.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
        {/* City */}
        <div className="space-y-1">
          <label className="block text-sm font-[500] text-gray-800">
            City <span className="text-red-500">*</span>
          </label>
          <input
            {...register("city")}
            type="text"
            placeholder="Enter City Name"
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onChange={handleCityInputChange}
            value={cityInput}
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg  placeholder-gray-500 focus:outline-none   text-[12px] sm:text-sm"
          />
          {showSuggestions && cityData?.length > 0 && (
            <ul className="border rounded bg-white shadow-md max-h-40 overflow-y-auto text-sm text-gray-800">
              {cityData?.map((city: any, idx: number) => (
                <li
                  key={idx}
                  onClick={() =>
                    handleCitySelect(
                      `${city.name} (${city.state_name}, ${city.country_code})`,
                      `${city.id}`
                    )
                  }
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {`${city.name} (${city.state_name}, ${city.country_code})`}
                </li>
              ))}
            </ul>
          )}
          {errors.city && (
            <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>
          )}
        </div>

        {/* Nationality */}
        <div className="space-y-1">
          <label className="block text-sm font-[500] text-gray-800">
            Nationality <span className="text-red-500">*</span>
          </label>
          <input
            {...register("nationality")}
            type="text"
            onBlur={() =>
              setTimeout(() => setShowCountrySuggestions(false), 200)
            }
            onChange={handleCountryInputChange}
            value={countryInput}
            placeholder="Enter Nationality"
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg  placeholder-gray-500 focus:outline-none   text-[12px] sm:text-sm"
          />
          {showCountrySuggestions && countryData?.length > 0 && (
            <ul className="border rounded bg-white shadow-md max-h-40 overflow-y-auto text-sm text-gray-800">
              {countryData?.map((country: any, idx: number) => (
                <li
                  key={idx}
                  onClick={() =>
                    handleCountrySelect(
                      `${country.nationality}`,
                      `${country.id}`
                    )
                  }
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {`${country.nationality}`}
                </li>
              ))}
            </ul>
          )}
          {errors.nationality && (
            <p className="text-xs text-red-600 mt-1">
              {errors.nationality.message}
            </p>
          )}
        </div>
      </div>

      {selected != "corporate" && (
        <div className="space-y-1 relative">
          <label
            htmlFor="roleType"
            className="block text-sm font-semibold text-gray-800"
          >
            Role <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input
                {...register("role")}
                type="radio"
                name="role"
                id="1"
                value="1"
                className="w-4 h-4"
                onChange={() => setValue("role", "1")}
              />
              <label htmlFor="1" className="text-sm font-medium text-gray-700">
                User
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                {...register("role")}
                type="radio"
                name="role"
                id="6"
                value="6"
                className="w-4 h-4"
                onChange={() => setValue("role", "6")}
              />
              <label htmlFor="6" className="text-sm font-medium text-gray-700">
                Corporate User
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                {...register("role")}
                type="radio"
                name="role"
                id="7"
                value="7"
                className="w-4 h-4"
                onChange={() => setValue("role", "7")}
              />
              <label htmlFor="7" className="text-sm font-medium text-gray-700">
                Travel Agent
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                {...register("role")}
                type="radio"
                name="role"
                id="8"
                value="8"
                className="w-4 h-4"
                onChange={() => setValue("role", "8")}
              />
              <label htmlFor="8" className="text-sm font-medium text-gray-700">
                Hotel
              </label>
            </div>
          </div>
        </div>
      )}
      {selected == "corporate" && (
        <div className="space-y-1 relative">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input
                {...register("role")}
                type="radio"
                name="role"
                id="3"
                value="3"
                className="w-4 h-4"
                onChange={() => setValue("role", "3")}
              />
              <label htmlFor="3" className="text-sm font-medium text-gray-700">
                Driver
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                {...register("role")}
                type="radio"
                name="role"
                id="8"
                value="8"
                className="w-4 h-4"
                onChange={() => setValue("role", "8")}
              />
              <label htmlFor="8" className="text-sm font-medium text-gray-700">
                Hotel
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                {...register("role")}
                type="radio"
                name="role"
                id="14"
                value="14"
                className="w-4 h-4"
                onChange={() => setValue("role", "14")}
              />
              <label htmlFor="14" className="text-sm font-medium text-gray-700">
                DMC
              </label>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input
                  {...register("role")}
                  type="radio"
                  name="role"
                  id="24"
                  value="24"
                  className="w-4 h-4"
                  onChange={() => setValue("role", "24")}
                />
                <label
                  htmlFor="24"
                  className="text-sm font-medium text-gray-700"
                >
                  Cruise
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  {...register("role")}
                  type="radio"
                  name="role"
                  id="6"
                  value="6"
                  className="w-4 h-4"
                  onChange={() => setValue("role", "6")}
                />
                <label
                  htmlFor="6"
                  className="text-sm font-medium text-gray-700"
                >
                  Corporate
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        {role == "3" && (
          <div>
            <button
              type="button"
              onClick={() => {
                setHasCompany(!hasCompany);
                setShowSection(!hasCompany);
              }}
              className={`flex items-center justify-between w-14 p-1 rounded-full transition-colors duration-300 ${
                hasCompany ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${
                  hasCompany ? "translate-x-9" : ""
                }`}
              />
            </button>

            <span className="text-sm">
              {hasCompany ? "Have Company" : "Don't Have Company"}
            </span>
          </div>
        )}
      </div>
      {showSection && (
        <>
          {role !== "1" && (
            <>
              <div className="flex items-center gap-2">
                <div className="space-y-1 w-full">
                  <label className="block text-sm font-semibold text-gray-800">
                    Company Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("company_name")}
                    type="text"
                    placeholder="Enter Company Name"
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg  placeholder-gray-500 focus:outline-none   text-[12px] sm:text-sm"
                    required={role !== "1"}
                  />
                  {errors.company_name && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.company_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1 w-full">
                  <label className="block text-sm font-semibold text-gray-800">
                    Company Size <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("company_size")}
                    name=""
                    id=""
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg  placeholder-gray-500 focus:outline-none   text-[12px] sm:text-sm"
                    required={role !== "1"}
                  >
                    <option value="1-10">1-10</option>
                    <option value="10-20">10-20</option>
                    <option value="20-50">20-50</option>
                    <option value="50-100">50-100</option>
                    <option value="100-300">100-300</option>
                  </select>
                  {errors.company_size && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.company_size.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1 w-full flex flex-col">
                <label className="block text-sm font-semibold text-gray-800">
                  GST
                </label>
                <div className="flex items-center gap-1">
                  <input
                    {...register("gst")}
                    type="text"
                    className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg  placeholder-gray-500 focus:outline-none   text-[12px] sm:text-sm"
                    placeholder="Enter GST No."
                    disabled={isGstVerified}
                    required={role !== "1"}
                  />
                  <button
                    onClick={onVerifyHandler}
                    type="button"
                    className="bg-[#dfad08] px-5 py-2 cursor-pointer rounded text-sm font-[500]"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
      {/* Checkboxes */}
      <div className="flex flex-wrap justify-between items-center gap-4 mt-6">
        <label className="inline-flex items-center text-sm text-gray-700">
          <input
            {...register("newsletter_subscription")}
            type="checkbox"
            className="w-4 h-4  bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-3  text-[12px] sm:text-sm">
            Subscribe to Newsletter
          </span>
        </label>
        <label className="inline-flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            {...register("agreement_subscription", {
              required: "You must accept T&C",
            })}
            className="w-4 h-4  bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-3 text-[12px] sm:text-sm">
            Accept{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Terms & Conditions
            </a>
          </span>
        </label>
        {errors.agreement_subscription && (
          <p className="text-xs text-red-600 mt-1">
            {errors.agreement_subscription.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          !!combinationMStatus || (selected === "corporate" && !isGstVerified)
        }
        className={`w-full font-[500] py-2 px-4 rounded-md transition
    ${
      selected === "corporate" && !isGstVerified
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#dfad08] hover:bg-[#9d7a20] cursor-pointer"
    }`}
      >
        Continue
      </button>
    </form>
  );
};

export default UserRegistrationForm;
