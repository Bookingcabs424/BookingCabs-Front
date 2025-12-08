"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import mobilePrefixData from "../constants/mobilePrefix.json";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronLeft, RefreshCcw, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getAssignModuleByUserTypeId,
  useAddUserMutation,
  useDepartmentsQuery,
  useGetCityDataMutation,
  useGetCountryDataMutation,
  useGetGSTNumberVerificationMutation,
  useGetRole,
} from "../hooks/useCommon";
import { useCity, useCountry } from "../store/common";
import {
  useCombinationEmailChecker,
  useCombinationMobileChecker,
} from "../hooks/useAuth";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { useAuth } from "../store/auth";

const roles = [
  { id: 1, label: "user" },
  { id: 2, label: "vendor" },
  { id: 2, label: "driver" },
  { id: 2, label: "dmc" },
  { id: 2, label: "company" },
];

const baseSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email"),
  mobile_prefix: z.string().optional(),
  mobile: z
    .string()
    .min(10, "Must contain 10 digits only.")
    .regex(/^\d+$/, "Mobile must be numeric"),
  referral_key: z.string().optional(),
  city: z.string().min(1, "City is required"),
  pref_city: z.array(z.string()).optional(),
  nationality: z.string().min(1, "Nationality is required"),
  country_id: z.string().optional(),
  user_type_id: z.number().optional(),
  mobile_promotion: z.number().optional(),
  signup_status: z.number().optional(),
  role: z.string().optional(),
  gst: z.string().optional(),
  company_name: z.string().optional(),
  company_size: z.string().optional(),
  user_type: z.string().optional(),
  gender: z.string().min(1, "Select Gender"),
  is_gst_verified: z.string().optional(),
  company_id: z.string().optional(),
  department: z.string().min(1, "Select a Department"),
});

interface AddStaffFormProps {
  setStaffPageType: React.Dispatch<React.SetStateAction<string>>;
  type?:string
}

type UserFormData = z.infer<typeof baseSchema>;

export default function AddStaffForm({
  setStaffPageType,
  type,
}: AddStaffFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
    watch,
  } = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      mobile_prefix: "",
      mobile: "",
      referral_key: "",
      city: "",
      pref_city: [],
      nationality: "",
      country_id: "",
      user_type_id: undefined,
      mobile_promotion: undefined,
      signup_status: undefined,
      role: "",
      gst: "",
      company_name: "",
      company_size: "",
      user_type: "",
      gender: "",
      is_gst_verified: "",
      company_id: "",
    },
  });

  const router = useRouter();
  const [isGstVerified, setIsGstVerified] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [moduleIds, setModuleIds] = useState<string[]>([]);
  const [allModules, setAllModules] = useState<any[]>([]);

  const [selectedPrefix, setSelectedPrefix] = useState("+91");
  const [combinationMStatus, setCombinationStatus] = useState<null | string>(
    ""
  );
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [combinationEStatus, setCombinationEStatus] = useState<null | string>(
    ""
  );
  const [countryInput, setCountryInput] = useState("");
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [selectedNationalityId, setSelectedNationalityId] =
    useState<string>("");

  const [cityIds, setCityIds] = useState<string[]>([]);

  const email = watch("email");
  const mobile = watch("mobile");
  const role = watch("user_type");
  const { user } = useAuth();
  console.log({ user });
  useEffect(() => {
    user && setValue("company_id", String(user?.company_id));
  }, [user]);
  const { mutate: getCityData } = useGetCityDataMutation();
  const { mutate: getCountryData } = useGetCountryDataMutation();
  const { cityData } = useCity();
  const { countryData } = useCountry();

  const onSubmit = (data: UserFormData) => {
    console.log("✅ Form submitted with data:", data);
    console.log("✅ Selected Module IDs:", moduleIds);

    const result = baseSchema.safeParse(data);

    mutate(
      { ...data, module_ids: moduleIds, user_type_id: data?.user_type },
      {
        onSuccess: (res) => {
          toast.success("Successfully Added");
        },
      }
    );
    if (!result.success) {
      console.log("❌ Zod Validation failed!");
      console.dir(result.error.format(), { depth: null });
    } else {
      console.log("✅ Zod Validation passed!");
      console.log(result.data);
    }
  };

  const onError = (errors: any) => {
    console.log("🛑 React Hook Form Validation Errors:", errors);
  };
  const { mutate, data } = useAddUserMutation();
  const { mutate: combinationMutationMobile } = useCombinationMobileChecker();
  const { mutate: combinationMutationEmail } = useCombinationEmailChecker();
  const { data: userRoleData, refetch: getUserRoleData } = useGetRole();
  const { mutate: getGstData } = useGetGSTNumberVerificationMutation();
  const {
    data: departmentList,
    isLoading,
    isError,
    refetch,
  } = useDepartmentsQuery();
  const { data: modules } = getAssignModuleByUserTypeId();

  // Initialize modules when data is fetched
  useEffect(() => {
    if (modules) {
      setAllModules(modules);
      // Initialize with pre-checked modules (like Dashboard)
      const initialModuleIds: string[] = [];
      modules.forEach((module: any) => {
        if (module.checked) {
          initialModuleIds.push(module.module_id);
          // Also add children if parent is checked
          if (module.children) {
            module.children.forEach((child: any) => {
              initialModuleIds.push(child.module_id);
            });
          }
        }
      });
      setModuleIds(initialModuleIds);
    }
  }, [modules]);

  // Get all module IDs (parent and children) for "Check All"
  const getAllModuleIds = (modules: any[]): string[] => {
    const allIds: string[] = [];
    modules.forEach((module) => {
      allIds.push(module.module_id);
      if (module.children) {
        module.children.forEach((child: any) => {
          allIds.push(child.module_id);
        });
      }
    });
    return allIds;
  };

  // Handle parent checkbox change
  const handleParentCheckboxChange = (module: any, isChecked: boolean) => {
    if (module.readonly) return;

    let updatedModuleIds = [...moduleIds];

    if (isChecked) {
      // Add parent and all children
      updatedModuleIds.push(module.module_id);
      if (module.children) {
        module.children.forEach((child: any) => {
          if (!updatedModuleIds.includes(child.module_id)) {
            updatedModuleIds.push(child.module_id);
          }
        });
      }
    } else {
      // Remove parent and all children
      updatedModuleIds = updatedModuleIds.filter(
        (id) => id !== module.module_id
      );
      if (module.children) {
        module.children.forEach((child: any) => {
          updatedModuleIds = updatedModuleIds.filter(
            (id) => id !== child.module_id
          );
        });
      }
    }

    setModuleIds(updatedModuleIds);
  };

  // Handle child checkbox change

  const handleChildCheckboxChange = (
    childId: string,
    parentId: string,
    isChecked: boolean
  ) => {
    let updatedModuleIds = [...moduleIds];

    if (isChecked) {
      // Add child and ensure parent is checked
      updatedModuleIds.push(childId);
      if (!updatedModuleIds.includes(parentId)) {
        updatedModuleIds.push(parentId);
      }
    } else {
      // Remove child
      updatedModuleIds = updatedModuleIds.filter((id) => id !== childId);

      // Check if parent should be unchecked (when no children are selected)
      const parentModule = allModules.find((m) => m.module_id === parentId);
      if (parentModule && parentModule.children) {
        const hasOtherChildrenSelected = parentModule.children.some(
          (child: any) =>
            child.module_id !== childId &&
            updatedModuleIds.includes(child.module_id)
        );

        if (!hasOtherChildrenSelected) {
          updatedModuleIds = updatedModuleIds.filter((id) => id !== parentId);
        }
      }
    }

    setModuleIds(updatedModuleIds);
  };

  // Handle Check All
  const handleCheckAll = () => {
    if (allModules.length === 0) return;

    const allModuleIds = getAllModuleIds(allModules);
    setModuleIds(allModuleIds);
  };

  // Handle Uncheck All
  const handleUncheckAll = () => {
    setModuleIds([]);
  };

  // Check if all modules are selected
  const isAllChecked =
    allModules.length > 0 &&
    getAllModuleIds(allModules).every((id) => moduleIds.includes(id));

  // Check if parent is checked
  const isParentChecked = (module: any) => {
    return moduleIds.includes(module.module_id);
  };

  // Check if child is checked
  const isChildChecked = (childId: string) => {
    return moduleIds.includes(childId);
  };

  const combinationMChecker = () => {
    // const user_type_id = getValues("role");
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

  const handleReset = () => {
    reset();
  };

  const combinationEChecker: () => void = () => {
    const email = getValues("email");
    const role = getValues("user_type");
    alert({ email, role });
    if (!email || !role) return; // avoid empty calls

    combinationMutationEmail(
      { user_type_id: role, email },
      {
        onSuccess: (res: any) => {
          console.log({ res });
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

  const appendCityId = (id: string) => {
    if (!cityIds.includes(id)) {
      const updated = [...cityIds, String(id)];
      setCityIds(updated);
      setValue("pref_city", updated);
    }
  };

  const handlePrefCitySelect = (cityText: string, cityId: string) => {
    // Avoid duplicates
    if (cityIds.includes(cityId)) return;

    // Append city name to textarea
    const updatedCityInput = cityInput
      ? `${cityInput.trim().replace(/;*$/, "")}; ${cityText}; `
      : `${cityText}; `;

    setCityInput(updatedCityInput);
    setValue("city", updatedCityInput);

    // Update city_id array
    const updatedIds = [...cityIds, cityId];
    setCityIds(updatedIds);
    setValue("pref_city", updatedIds); // This matches Zod schema

    setShowSuggestions(false);
  };

  // const matchedRoleId = useMemo(() => {
  //   console.log("roles", roles)
  //   const matched = roles.find(
  //     (r) => r.label.toLowerCase() === type.toLowerCase()
  //   );
  //   return matched?.id ?? null;
  // }, [type]);

  const filteredRoles = useMemo(() => {
    if (!Array.isArray(userRoleData)) return [];
    return userRoleData.filter((role: any) => role.role_type == 5);
  }, [userRoleData]);
  useEffect(() => {
    console.log({ filteredRoles });
  }, [filteredRoles]);
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

  const handleCityInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCityInput(value);
    setShowSuggestions(true);

    const lastSegment = value.split(";").pop()?.trim() || "";
    if (lastSegment) {
      debouncedGetCity(lastSegment);
    }
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
    }, 500);

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

  useEffect(() => {
    getUserRoleData();
  }, [type]);


  return (
    <>
      <div className="flex gap-2 justify-end items-end py-6 pb-3 px-6 sm:px-12">
        <button
          type="button"
          onClick={() => setStaffPageType("table")}
          className="StatementAccounts flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 rounded-sm w-[max-content] bg-[#367FA9] text-white"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="StatementAccounts flex items-center gap-1 text-[12px] cursor-pointer py-1 px-2 rounded-sm w-[max-content] bg-[#009551] text-white"
        >
          <RefreshCcw className="w-4 h-4" /> Reset
        </button>
      </div>
      <div className="px-12">
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="mx-auto bg-white shadow-md rounded-md space-y-3 border border-gray-100 mb-6 m-3 p-6 sm:p-8 mt-4"
        >
          <h2 className="font-bold text-gray-600 mb-4 text-lg text-center sm:text-xl sm:text-start">
            Add Staff
          </h2>

          {/* First Name */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[12px] font-[500] text-gray-800">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("first_name")}
                type="text"
                placeholder="Enter First Name"
                className="text-black  w-full px-2 py-1 border border-gray-300 rounded-md  placeholder-gray-500 focus:outline-none text-[12px]"
              />
              {errors.first_name && (
                <p className="text-xs text-red-600">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <label className="block text-[12px] font-[500] text-gray-800">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("last_name")}
                type="text"
                placeholder="Enter Last Name"
                className="text-black w-full px-2 py-1 border border-gray-300 rounded-md  placeholder-gray-500 focus:outline-none  text-[12px]"
              />
              {errors.last_name && (
                <p className="text-xs text-red-600">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {/* Email */}
            <div className="space-y-1">
              <label className="block text-[12px] font-[500] text-gray-800">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                autoComplete="off"
                {...register("email")}
                defaultValue=""
                type="email"
                placeholder="user@gmail.com"
                className="text-black text-sm w-full px-2 py-1 border border-gray-300 rounded-md  placeholder-gray-500 focus:outline-none  text-black text-[12px]"
              />
              {combinationEStatus && (
                <p className="text-xs text-red-600">{"Not Available"}</p>
              )}
              {combinationEStatus == null && (
                <p className="text-xs text-green-600">{"Available"}</p>
              )}
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-[12px] font-[500] text-gray-800">
                Role <span className="text-red-500">*</span>
              </label>

              <select
                {...register("user_type")}
                name="user_type"
                id="user_type"
                className="text-black text-sm w-full px-2 py-1 border border-gray-300 rounded-md  placeholder-gray-500 focus:outline-none  text-black text-[12px]"
              >
                <option value="">Select Role</option>
                {filteredRoles.map((role: any) => (
                  <option
                    value={role.role_id}
                    key={role.role_id}
                    className="text-[12px]"
                  >
                    {role.RoleName}
                  </option>
                ))}
              </select>
              {errors.user_type && (
                <p className="text-xs text-red-600">
                  {errors.user_type.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
            {/* Mobile Prefix + Mobile */}
            <div className="space-y-1 col-span-2">
              <label className="block text-[12px] font-[500] text-gray-800">
                Mobile No <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  {...register("mobile_prefix")}
                  value={selectedPrefix}
                  onChange={(e) => {
                    setSelectedPrefix(e.target.value);
                    setValue("mobile_prefix", e.target.value);
                  }}
                  className="w-[30%] border border-gray-300 py-1 px-2 focus:outline-none rounded-sm text-[12px]"
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
                  className="text-black w-3/4 px-2 py-1 border border-gray-300 rounded-md  placeholder-gray-500 focus:outline-none  text-[12px]"
                  maxLength={10}
                  minLength={10}
                />
              </div>
              {errors.mobile && (
                <p className="text-xs text-red-600">{errors.mobile.message}</p>
              )}
              {combinationMStatus && (
                <p className="text-xs text-red-600">{"Not Available"}</p>
              )}
              {combinationMStatus == null && (
                <p className="text-xs text-green-600 mt-1">{"Available"}</p>
              )}
              {errors.mobile_prefix && (
                <p className="text-xs text-red-600">
                  {errors.mobile_prefix.message}
                </p>
              )}
            </div>

            {/* Refer By */}
            <div className="space-y-1 col-span-1">
              <label className="block text-[12px] font-[500] text-gray-800">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                {...register("gender")}
                name="gender"
                id="gender"
                className="text-black text-sm w-full px-2 py-1 border border-gray-300 rounded-md  placeholder-gray-500 focus:outline-none  text-black text-[12px]"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <p className="text-xs text-red-600">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-1  col-span-1">
              <label className="block text-[12px] font-[500] text-gray-800">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                {...register("department")}
                name="department"
                id="department"
                className="text-black text-sm w-full px-2 py-1 border border-gray-300 rounded-md  placeholder-gray-500 focus:outline-none  text-black text-[12px]"
              >
                <option value="-">Select Department</option>
                {departmentList &&
                  departmentList?.rows?.map((dept: any) => (
                    <option value={dept?.id}>{dept?.department_name}</option>
                  ))}
              </select>
              {errors.department && (
                <p className="text-xs text-red-600">
                  {errors.department.message}
                </p>
              )}
            </div>

            {/* Nationality */}
            <div className="space-y-1 relative">
              <label className="block text-[12px] font-[500] text-gray-800">
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
                className="text-black w-full px-2 py-1 border border-gray-300 rounded-md  placeholder-gray-500 focus:outline-none   text-[12px]"
              />

              {showCountrySuggestions && countryData?.length > 0 && (
                <ul className="rounded bg-white shadow-md max-h-40 z-900 overflow-y-auto text-[12px] text-gray-800 absolute top-full w-full">
                  {countryData?.map((country: any) => (
                    <li
                      key={country.id}
                      onClick={() => {
                        console.log("country clicked", country)
                        handleCountrySelect(`${country.name}`, `${country.id}`);
                        setValue("country_id", String(country.id));
                      }}
                      className="px-2 py-2  hover:bg-blue-100 cursor-pointer"
                    >
                      {`${country.name}`}
                    </li>
                  ))}
                </ul>
              )}
              {errors.nationality && (
                <p className="text-xs text-red-600">
                  {errors.nationality.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2"></div>
          <div className="space-y-1 relative">
            <label className="block text-[12px] font-[500] text-gray-800">
              Pref. City to Drive Cab <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("city")}
              placeholder="Enter Pref City"
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onChange={handleCityInputChange}
              className="text-black w-full px-2 py-1 border border-gray-300 rounded-md  placeholder-gray-500 focus:outline-none text-[12px] w-full sm:w-1/2"
            />
            {showSuggestions && cityData?.length > 0 && (
              <ul className="rounded bg-white shadow-md max-h-40 overflow-y-auto text-gray-800 absolute top-full text-[12px] w-full sm:w-1/2">
                {cityData?.map((city: any, idx: number) => (
                  <li
                    key={idx}
                    onClick={() => {
                      handlePrefCitySelect(
                        `${city.name} (${city.state_name}, ${city.country_code})`,
                        `${city.id}`
                      );
                    }}
                    className="px-2 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {`${city.name} (${city.state_name}, ${city.country_code})`}
                  </li>
                ))}
              </ul>
            )}
            {errors.city && (
              <p className="text-xs text-red-600">{errors.city.message}</p>
            )}
          </div>
          <>
            {type !== "user" && (
              <>
                <div className="flex items-center gap-2">
                  <div className="space-y-1 w-full">
                    <label className="block text-[12px] font-[500] text-gray-800">
                      Company Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      {...register("company_name")}
                      type="text"
                      placeholder="Enter Company Name"
                      className="text-black w-full px-2 py-1 border border-gray-300 rounded-md  placeholder-gray-500 focus:outline-none text-[12px]"
                      required={role !== "1"}
                    />
                    {errors.company_name && (
                      <p className="text-xs text-red-600">
                        {errors.company_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 w-full">
                    <label className="block text-[12px] font-[500] text-gray-800">
                      Company Size <span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("company_size")}
                      name=""
                      id=""
                      className="text-black w-full px-2 py-1 border border-gray-300 rounded-md  placeholder-gray-500 focus:outline-none text-[12px]"
                      required={role !== "1"}
                    >
                      <option value="1-10">1-10</option>
                      <option value="10-20">10-20</option>
                      <option value="20-50">20-50</option>
                      <option value="50-100">50-100</option>
                      <option value="100-300">100-300</option>
                    </select>
                    {errors.company_size && (
                      <p className="text-xs text-red-600">
                        {errors.company_size.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-1 w-full flex flex-col">
                  <label className="block text-[12px] font-semibold text-gray-800">
                    GST
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      {...register("gst")}
                      type="text"
                      className="text-black w-full px-2 py-1 border border-gray-300 rounded-md  placeholder-gray-500 focus:outline-none text-[12px]"
                      placeholder="Enter GST No."
                      disabled={isGstVerified}
                      required={role !== "1"}
                    />
                    <button
                      onClick={onVerifyHandler}
                      type="button"
                      className="bg-[#dfad08] px-5 py-1 cursor-pointer rounded text-[12px] font-[500]"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </>
            )}
          </>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full font-[500] py-2 px-2 rounded-md transition bg-[#dfad08] hover:bg-[#9d7a20] cursor-pointer text-[12px]"
          >
            Add Staff
          </button>
        </form>
      </div>
      <div className="bg-white border border-gray-300 shadow-md rounded-sm mx-6 sm:mx-12 mb-8">
        <h2 className="bg-gray-300 py-3 px-5 font-semibold text-sm sm:text-base">
          Permission Control
        </h2>
        <div className="py-5 px-12">
          {/* Check All / Uncheck All Buttons */}
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={handleCheckAll}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Check All
            </button>
            <button
              type="button"
              onClick={handleUncheckAll}
              className="px-4 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              Uncheck All
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Top-level permissions */}
            {allModules?.map((module) => (
              <div key={module.module_id}>
                <label className="flex items-center space-x-2 font-medium font-sm">
                  <input
                    type="checkbox"
                    checked={isParentChecked(module)}
                    onChange={(e) =>
                      handleParentCheckboxChange(module, e.target.checked)
                    }
                    disabled={module.readonly}
                    className="accent-blue-600 h-4 w-4"
                  />
                  <span>{module.module_name}</span>
                  {module.readonly && (
                    <span className="text-xs text-gray-500">(Read-only)</span>
                  )}
                </label>

                {module.children && (
                  <ul className="pl-5 mt-2 space-y-1">
                    {module.children.map((child: any) => (
                      <li key={child.module_id}>
                        <label className="flex items-center space-x-2 text-sm text-gray-700 font-sm">
                          <input
                            type="checkbox"
                            checked={isChildChecked(child.module_id)}
                            onChange={(e) =>
                              handleChildCheckboxChange(
                                child.module_id,
                                module.module_id,
                                e.target.checked
                              )
                            }
                            className="accent-blue-500 h-4 w-4"
                          />
                          <span>{child.module_name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Debug info (optional) */}
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <p>Selected Module IDs: {moduleIds.join(", ") || "None"}</p>
            <p>Total Selected: {moduleIds.length}</p>
          </div>
        </div>
      </div>
    </>
  );
}
