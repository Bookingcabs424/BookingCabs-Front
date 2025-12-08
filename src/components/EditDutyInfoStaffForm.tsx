import { Banknote, ChevronLeft, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MultiSelect from "./MultiSelect";
import { useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";

import { z } from "zod";
import {
  useGetCityByName,
  useGetCityDataMutation,
  useGetDutyInfo,
  useGetLanguageList,
  useGetPaymentTypeList,
  useGetShiftList,
  useUpsertDutyInfo,
} from "../hooks/useCommon";
import { useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import { useCity } from "../store/common";

// Update the schema to handle city data properly
const dutySchema = z.object({
  duty_type: z.array(z.string()).min(1, "Duty Type is required"),
  payment_type: z.array(z.string()).min(1, "Payment Type is required"),
  pref_city_drive_cab: z.string().min(1, "Pref City to Drive Cab is required"),
  city_ids: z.array(z.string()).optional(), // Store city IDs separately
  shift_of_login: z.array(z.string()).min(1, "Shift of Login is required"),
  speak_language: z.array(z.string()).min(1, "Speak Language is required"),
  write_language: z.array(z.string()).min(1, "Write Language is required"),
  week_off: z.array(z.string()).min(1, "Week Off is required"),
});

export type dutyData = z.infer<typeof dutySchema>;

// Interface for city data
interface City {
  id: string;
  name: string;
  state_name: string;
  country_code: string;
}

export default function EditDutyInfoStaffForm() {
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");
  const { data } = useGetDutyInfo(user_id ? parseInt(user_id) : 1);
  const { data: lang } = useGetLanguageList();
  const { data: paymentsType } = useGetPaymentTypeList();
  const { data: shiftList } = useGetShiftList();
  const { data: cityList, mutateAsync } = useGetCityByName();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<dutyData>({
    resolver: zodResolver(dutySchema),
    defaultValues: {
      city_ids: [],
    }
  });

  // Transform API data to options arrays
  const shiftOptions = shiftList?.map((shift: any) => shift.shift) || [];
  const languageOptions = lang?.map((language: any) => language.language_name) || [];
  const paymentOptions = paymentsType?.map((payment: any) => payment.pay_type_mode) || [];
useEffect(()=>{
  console.log({paymentOptions})
},[paymentOptions])
  // Options for dropdowns
  const duty = [
    { id: 1, name: "Rental" },
    { id: 2, name: "City Taxi" },
    { id: 3, name: "Airport Transfer" },
    { id: 4, name: "Outstation" },
    { id: 5, name: "One Way" },
  ];
  const dutyType = duty?.map((i) => i?.name) || [];
  const weeks = [
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
    { id: 7, name: "Sunday" },
  ]; 
  const weekOff = weeks?.map((i) => i?.name) || [];
  // Hydrate form with API data
  useEffect(()=>{
    console.log({city_ids:watch('city_ids')})
  },[watch('city_ids')])
  useEffect(() => {
    if (data) {
      console.log("API Data:", data);
      
      // Extract city IDs from preferredCities
      const cityIds = data.preferredCities?.map((city: any) => city.city_id?.toString()) || [];
      
      // Create city names string for display
      const cityNames = data.preferredCities?.map((city: any) => city.city_name).join("; ") || "";

      const formData = {
        duty_type: data.duty?.map((duty: any) => duty.master_package_name) || [],
        payment_type: data.payments?.map((payment: any) => payment.pay_type_mode) || [],
        pref_city_drive_cab: cityNames,
        city_ids: cityIds,
        shift_of_login: data.shifts?.map((shift: any) => shift.shift) || [],
        speak_language: data.languages
          ?.filter((lang: any) => lang.language_type === "Speak")
          ?.map((lang: any) => lang.language_name) || [],
        write_language: data.languages
          ?.filter((lang: any) => lang.language_type === "Write")
          ?.map((lang: any) => lang.language_name) || [],
        week_off: data.weekOffs?.map((weekOff: any) => weekOff.day_name) || [],
      };
      
      console.log("Form Data:", formData);
      reset(formData);
      
      // Set initial city input state
      setCityInput(cityNames);
      setCityIds(cityIds);
    }
  }, [data, reset]);

  const { mutate } = useUpsertDutyInfo();

  const onSubmit = async (formData: dutyData) => {
    if (!user_id) {
      console.error("User ID is required");
      return;
    }

    console.log("Form submitted:", formData);

    // Transform data to match backend structure
    const backendData = {
      user_id: parseInt(user_id),
      duty: formData.duty_type.map(dutyName => {
        const dutyItem = duty.find(d => d.name === dutyName);
        return {
          package_id: dutyItem?.id || 0,
          status: 1
        };
      }),
      payments: formData.payment_type.map(paymentName => {
        const paymentItem = paymentsType?.find((p: any) => p.pay_type_mode === paymentName);
        return {
          payment_type_id: paymentItem?.payment_type_id || 0,
          status: 1
        };
      }),
      preferredCities: formData.city_ids?.map((cityId, index) => {
        // Extract city name from the formatted string or use the raw input
        const cityNames = formData.pref_city_drive_cab.split(';').map(name => name.trim()).filter(name => name);
        return {
          city_id: parseInt(cityId),
          city_name: cityNames[index] || `City ${cityId}`,
          status: 1
        };
      }) || [],
      shifts: formData.shift_of_login.map(shiftName => {
        const shiftItem = shiftList?.find((s: any) => s.shift === shiftName);
        return {
          working_shift_id: shiftItem?.working_shift_id || 0,
          status: 1
        };
      }),
      languages: [
        ...formData.speak_language.map(langName => {
          const langItem = lang?.find((l: any) => l.language_name === langName);
          return {
            language_id: langItem?.language_id || 0,
            language_type: "Speak",
            status: 1
          };
        }),
        ...formData.write_language.map(langName => {
          const langItem = lang?.find((l: any) => l.language_name === langName);
          return {
            language_id: langItem?.language_id || 0,
            language_type: "Write",
            status: 1
          };
        })
      ],
      weekOffs: formData.week_off.map(weekName => {
        const weekItem = weeks.find(w => w.name === weekName);
        return {
          week_id: weekItem?.id || 0,
          status: 1
        };
      })
    };

    console.log("Submitting data to backend:", backendData);
    mutate(backendData);
  };
useEffect(()=>{
  console.log({errors})
},[errors])
  const handleReset = () => {
    if (data) {
      const cityIds = data.preferredCities?.map((city: any) => city.city_id?.toString()) || [];
      const cityNames = data.preferredCities?.map((city: any) => city.city_name).join("; ") || "";

      const formData = {
        duty_type: data.duty?.map((duty: any) => duty.master_package_name) || [],
        payment_type: data.payments?.map((payment: any) => payment.pay_type_mode) || [],
        pref_city_drive_cab: cityNames,
        city_ids: cityIds,
        shift_of_login: data.shifts?.map((shift: any) => shift.shift) || [],
        speak_language: data.languages
          ?.filter((lang: any) => lang.language_type === "Speak")
          ?.map((lang: any) => lang.language_name) || [],
        write_language: data.languages
          ?.filter((lang: any) => lang.language_type === "Write")
          ?.map((lang: any) => lang.language_name) || [],
        week_off: data.weekOffs?.map((weekOff: any) => weekOff.day_name) || [],
      };
      reset(formData);
      setCityInput(cityNames);
      setCityIds(cityIds);
    }
  };

  const { mutate: getCityData } = useGetCityDataMutation();
  const { cityData } = useCity();
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [cityIds, setCityIds] = useState<string[]>([]);

  const handlePrefCitySelect = (cityText: string, cityId: string) => {
    // Avoid duplicates
    if (cityIds.includes(cityId)) return;

    // Append city name to textarea
    const updatedCityInput = cityInput
      ? `${cityInput.trim().replace(/;*$/, "")}; ${cityText}`
      : cityText;

    setCityInput(updatedCityInput);
    setValue("pref_city_drive_cab", updatedCityInput);
    
    // Update city_id array
    const updatedIds = [...cityIds, cityId];
    setCityIds(updatedIds);
    setValue("city_ids", updatedIds);

    console.log("City selected:", { cityText, cityId, updatedCityInput, updatedIds });
    setShowSuggestions(false);
  };

  const debouncedGetCity = useMemo(() => {
    return debounce((val: string) => {
      if (!val) {
        return;
      }
      getCityData(val);
    }, 500);
  }, [getCityData]);

  const handleCityInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCityInput(value);
    setValue("pref_city_drive_cab", value);

    const lastSegment = value.split(";").pop()?.trim() || "";
    if (lastSegment) {
      setShowSuggestions(true);
      debouncedGetCity(lastSegment);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleCityInputBlur = () => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleCityInputFocus = () => {
    const lastSegment = cityInput.split(";").pop()?.trim() || "";
    if (lastSegment && cityData?.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-end gap-1 px-3 py-6">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#DD4B39] border border-gray-300 text-white font-semibold"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#00A65A] border border-gray-300 text-white font-semibold"
        >
          <RefreshCcw className="w-4 h-4" /> Reset
        </button>
        <button
          type="submit"
          form="duty-form"
          className="flex cursor-pointer items-center gap-1 text-[12px] py-1 px-2 sm:py-2 sm:px-4 rounded-sm bg-[#367FA9] border border-gray-300 text-white font-semibold"
        >
          Save
        </button>
      </div>
      <form
        id="duty-form"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-white flex border border-gray-200 p-5"
      >
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 overflow-hidden w-full">
          <div className="p-8 space-y-8">
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Duty Type <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="duty_type"
                    render={({ field }) => (
                      <MultiSelect
                        selected={field.value || []}
                        setSelected={field.onChange}
                        options={dutyType}
                        className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      />
                    )}
                  />
                  {errors.duty_type && (
                    <p className="text-[10px] text-red-500">
                      {errors.duty_type.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Payment Type <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="payment_type"
                    render={({ field }) => (
                      <MultiSelect
                        selected={field.value || []}
                        setSelected={field.onChange}
                        options={paymentOptions}
                        className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      />
                    )}
                  />
                  {errors.payment_type && (
                    <p className="text-[10px] text-red-500">
                      {errors.payment_type.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1 relative">
                  <label className="block text-[12px] font-[500] text-gray-800">
                    Pref. City to Drive Cab <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-full sm:w-1/2">
                    <textarea
                      {...register("pref_city_drive_cab")}
                      value={cityInput}
                      placeholder="Enter Pref City (type to see suggestions)"
                      onBlur={handleCityInputBlur}
                      onFocus={handleCityInputFocus}
                      onChange={handleCityInputChange}
                      className="text-black w-full px-2 py-1 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none text-[12px] resize-vertical min-h-[60px]"
                    />
                    {showSuggestions && cityData?.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-40 overflow-y-auto border border-gray-300 rounded-md">
                        {cityData?.map((city: City, idx: number) => (
                          <li
                            key={idx}
                            onClick={() => {
                              handlePrefCitySelect(
                                `${city.name} (${city.state_name}, ${city.country_code})`,
                                city.id
                              );
                            }}
                            className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-[12px] border-b border-gray-100 last:border-b-0"
                          >
                            {`${city.name} (${city.state_name}, ${city.country_code})`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {errors.pref_city_drive_cab && (
                    <p className="text-xs text-red-600">{errors.pref_city_drive_cab.message}</p>
                  )}
                  {/* Hidden input to store city IDs */}
                  <input type="hidden" {...register("city_ids")} />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Shift of Login <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="shift_of_login"
                    render={({ field }) => (
                      <MultiSelect
                        selected={field.value || []}
                        setSelected={field.onChange}
                        options={shiftOptions}
                        className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      />
                    )}
                  />
                  {errors.shift_of_login && (
                    <p className="text-[10px] text-red-500">
                      {errors.shift_of_login.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Speak Langauge <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="speak_language"
                    render={({ field }) => (
                      <MultiSelect
                        selected={field.value || []}
                        setSelected={field.onChange}
                        options={languageOptions}
                        className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      />
                    )}
                  />
                  {errors.speak_language && (
                    <p className="text-[10px] text-red-500">
                      {errors.speak_language.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-medium text-gray-700">
                    Write Language <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="write_language"
                    render={({ field }) => (
                      <MultiSelect
                        selected={field.value || []}
                        setSelected={field.onChange}
                        options={languageOptions}
                        className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      />
                    )}
                  />
                  {errors.write_language && (
                    <p className="text-[10px] text-red-500">
                      {errors.write_language.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 ">
                  <label className="block text-[10px] font-medium  text-gray-700">
                    Week Off <span className="text-red-500">*</span>
                  </label>
                
                  <Controller
                    control={control}
                  
                    name="week_off"
                    render={({ field }) => (
                      <MultiSelect
                        selected={field.value || []}
                        setSelected={field.onChange}
                        options={weekOff}
                        className="border border-gray-300 py-1 px-3 outline-none rounded-sm w-full text-[10px] sm:text-[10px]"
                      />
                    )}
                  />
                  {errors.week_off && (
                    <p className="text-[10px] text-red-500">
                      {errors.week_off.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-1 px-3 border border-gray-300 rounded-md shadow-sm text-[10px] font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="py-1 px-3 cursor-pointer border border-transparent rounded-md shadow-md text-[10px] font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}