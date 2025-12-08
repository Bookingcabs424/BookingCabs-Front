"use client";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import MultiSelect from "./MultiSelect";
import { useCity, useCountry } from "../store/common";
import { debounce } from "lodash";
import { useGetCityDataMutation, driverDutyInfo } from "../hooks/useCommon";
import { toast } from "react-toastify";
const dutyDetailsFormSchema = z.object({
  city: z.array(z.string()).min(1, "Pref. City to Drive Cab is required"),
  speak_language: z.array(z.string()).min(1, "Speak Language is required"),
  write_language: z.array(z.string()).min(1, "Write Language is required"),
  shift_of_login: z.array(z.string()).min(1, "Shift of Login is required"),
  duty_type: z.array(z.string()).min(1, "Duty Type is required"),
  booking_type: z.number().optional(),
  payment_type: z.string().min(1, "Payment Type is required"),
});

type DutyFormData = z.infer<typeof dutyDetailsFormSchema>;

const DutyInfoForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<DutyFormData>({
    resolver: zodResolver(dutyDetailsFormSchema),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const mobile = searchParams.get("mobile");
  const typeId = searchParams.get("typeId");
  const { mutate: getCityData } = useGetCityDataMutation();
  const { cityData } = useCity();
  const [bookingType, setBookingType] = useState<string>("leisure");
  const [cityInput, setCityInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  // const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [selectedCities, setSelectedCities] = useState<any[]>([]);
  const handleBookingTypeToggle = (buttonId: string) => {
    setBookingType((prev) => (prev === buttonId ? "leisure" : buttonId));
  };

  const { mutate: driverMutation, data } = driverDutyInfo();
  const debouncedGetCity = useMemo(() => {
    return debounce((val: string) => {
      if (!val) {
        return;
      }
      getCityData(val);
    }, 500);
  }, [getCityData]);

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityInput(value);
    setShowSuggestions(true);
    debouncedGetCity(value);
  };
  const handleCitySelect = (label: string, id: string) => {
    if (!selectedCities.find((c) => c.id === id)) {
      const updated = [...selectedCities, { id, label }];
      setSelectedCities(updated);
      const val = updated?.map((c) => c.id);
      setValue("city", val);
    }
    setCityInput("");
    setShowSuggestions(false);
  };

  const removeCity = (id: string) => {
    const updated = selectedCities.filter((c) => c.id !== id);
    setSelectedCities(updated);
    const val = updated?.map((c) => c.id);
    setValue("city", val); // update form
  };

  const speakLanguage = [
    {
      id: "1",
      label: "Hindi",
    },
    {
      id: "2",
      label: "English",
    },
    {
      id: "3",
      label: "Punjabi",
    },
    {
      id: "4",
      label: "Bengali",
    },
    {
      id: "5",
      label: "Gujarati",
    },
  ];
  const writeLanguage = [...speakLanguage];
  const shiftOfLogin = [
    { id: "1", label: "Morning(07:00 - 15:00)" },
    { id: "2", label: "Night(22:00 - 07:00)" },
    { id: "3", label: "Evening(15:00 - 22:00)" },
  ];
  const dutyType = [
    {
      id: "1",
      label: "Rental",
    },
    {
      id: "2",
      label: "City Taxi",
    },
    {
      id: "3",
      label: "Airport Transfer",
    },
    {
      id: "4",
      label: "Outstation",
    },
    {
      id: "5",
      label: "One Way",
    },
    {
      id: "6",
      label: "Activity",
    },
    {
      id: "7",
      label: "Transport Package",
    },
  ];

  const paymentType = [
    { id: "1", label: "Cash" },
    { id: "2", label: "Credit" },
    { id: "3", label: "Wallet" },
    { id: "4", label: "Wallet + Bank" },
    { id: "5", label: "Net Banking" },
  ];
  const bookingTypes = [
    { id: "leisure", label: "Leisure" },
    { id: "corporate", label: "Corporate" },
    { id: "both", label: "Both" },
  ];

  const inputClass =
    "text-black w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none text-sm";

  const onSubmit = (data: DutyFormData) => {
    const duty_type = data.duty_type
      .map((label: string) => {
        const matched = dutyType.find((lang) => lang.label === label);
        return matched ? matched.id : null;
      })
      .filter(Boolean);
    const s_language = data.speak_language
      .map((label: string) => {
        const matched = speakLanguage.find((lang) => lang.label === label);
        return matched ? matched.id : null;
      })
      .filter(Boolean);
    const w_language = data.write_language
      .map((label: string) => {
        const matched = writeLanguage.find((lang) => lang.label === label);
        return matched ? matched.id : null;
      })
      .filter(Boolean);
    const shift = data.shift_of_login
      .map((label: string) => {
        const matched = shiftOfLogin.find((lang) => lang.label === label);
        return matched ? matched.id : null;
      })
      .filter(Boolean);
    const payload = {
      package_id: duty_type,
      pref_lang: s_language,
      language_type: "speak",
      shift,
      pref_city: data.city,
      payment_cash: data.payment_type,
      preferred_booking: bookingType,
      booking_type: bookingType,
    };
    // driverMutation(payload,);
    driverMutation(payload, {
      onSuccess: () => {
        toast.success("Thank you for submitting the Details", {
          position: "top-right",
          autoClose: 5000,
        });
        router.push("/dashboard");
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.responseData?.response?.message ||
            "Issue filling the form",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      },
    });
    return;
  };
  useEffect(() => { 
  }, [errors]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto bg-white rounded-md p-4 space-y-4"
    >
      <div className="space-y-1 w-full">
        <label className="block text-sm font-[500] text-gray-800">
          City <span className="text-red-500">*</span>
        </label>
        <input
          type="hidden"
          {...register("city")}
          value={selectedCities.map((c) => c.id)}
        />

        {/* Search input */}
        <input
          type="text"
          placeholder="Enter City Name"
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onChange={handleCityInputChange}
          value={cityInput}
          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg  placeholder-gray-500 focus:outline-none text-[12px] sm:text-sm"
        />

        {/* Suggestions */}
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

        {/* Selected tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCities.map((city) => (
            <span
              key={city.id}
              className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
            >
              {city.label}
              <button
                type="button"
                onClick={() => removeCity(city.id)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {errors.city && (
          <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>
        )}
      </div>

      {/* Speak Language */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Speak Language <span className="text-red-600">*</span>
        </label>
        <Controller
          control={control}
          name="speak_language"
          render={({ field }) => (
            <MultiSelect
              selected={field.value || []}
              setSelected={field.onChange}
              options={speakLanguage.map((lang) => lang.label)}
            />
          )}
        />
        {errors.speak_language && (
          <p className="text-sm text-red-500">
            {errors.speak_language.message}
          </p>
        )}
      </div>

      {/* Write Language */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Write Language <span className="text-red-600">*</span>
        </label>
        <Controller
          control={control}
          name="write_language"
          render={({ field }) => (
            <MultiSelect
              selected={field.value || []}
              setSelected={field.onChange}
              options={writeLanguage.map((lang) => lang.label)}
            />
          )}
        />
        {errors.write_language && (
          <p className="text-sm text-red-500">
            {errors.write_language.message}
          </p>
        )}
      </div>

      {/* Shift of Login */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Shift of Login <span className="text-red-600">*</span>
        </label>
        <Controller
          control={control}
          name="shift_of_login"
          render={({ field }) => (
            <MultiSelect
              selected={field.value || []}
              setSelected={field.onChange}
              options={shiftOfLogin.map((lang) => lang.label)}
            />
          )}
        />
        {errors.shift_of_login && (
          <p className="text-sm text-red-500">
            {errors.shift_of_login.message}
          </p>
        )}
      </div>

      {/* Duty Type */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Duty Type <span className="text-red-600">*</span>
        </label>
        <Controller
          control={control}
          name="duty_type"
          render={({ field }) => (
            <MultiSelect
              selected={field.value || []}
              setSelected={field.onChange}
              options={dutyType.map((d) => d.label)}
            />
          )}
        />
        {errors.duty_type && (
          <p className="text-sm text-red-500">{errors.duty_type.message}</p>
        )}
      </div>

      {/* Booking Type */}
      <div className="space-y-1">
        <label className="font-semibold text-sm text-gray-800">
          Booking Type
        </label>
        <div className="grid grid-cols-2 gap-8 py-2 sm:gap-4 sm:grid-cols-3 md:flex md:items-center">
          {bookingTypes.map((option) => (
            <div
              key={option.id}
              className="flex gap-1 items-center text-sm sm:gap-2"
            >
              <div
                onClick={() => handleBookingTypeToggle(option.id)}
                className={`rounded-full border-2 border-gray-500 cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300
              ${bookingType === option.id ? "justify-end" : "justify-start"}
              min-w-10 min-h-5 sm:min-w-14 sm:min-h-7`}
              >
                <div className="h-3.5 w-3.5 sm:h-5 sm:w-5 rounded-full bg-gray-500 shadow-md transition-all duration-300" />
              </div>
              <p className="text-[12px] font-[500]">{option.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Type */}
      <div className="space-y-1 w-full">
        <label className="block text-sm font-semibold text-gray-800">
          Payment Type <span className="text-red-600">*</span>
        </label>
        <select
          {...register("payment_type")}
          name="payment_type"
          className={inputClass}
        >
          <option value="">Select Payment Type</option>
          {paymentType.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-[#87e64b] cursor-pointer text-white font-semibold py-2 px-4 rounded-md hover:bg-[#4ec400] transition"
      >
        Continue
      </button>
    </form>
  );
};

export default DutyInfoForm;
