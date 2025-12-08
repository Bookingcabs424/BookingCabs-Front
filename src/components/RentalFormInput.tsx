import { useEffect, useRef, useState } from "react";
import { FC } from "react";
import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { bookingFormData } from "./BookingForm";
import {
  getCityByname,
  getDetailedAddress,
  getNationality,
  getVehiclebySeatingCapicity,
  useFareDetails,
  useGetAddress,
  useLocalPackages,
} from "../hooks/useCommon";
import { number } from "zod";
import { activeCity } from "@/store/common";
import GooglePlacesAutocomplete from "./GooglePlacesAutocompete";
import { useRouter, useSearchParams } from "next/navigation";
import TimePicker1 from "./TimePicker1";
import TimePicker from "./TimePicker";
import DateTimePicker from "./DateTimePicker";
import ComingMode from "./ComingMode";

interface RentalFormInputProps {
  register: UseFormRegister<bookingFormData>;
  errors: FieldErrors<bookingFormData>;
  watch: UseFormRegister<bookingFormData>;
  control: Control<bookingFormData>;
  setValue: any;
}

const RentalFormInput: FC<RentalFormInputProps> = ({
  register,
  errors,
  watch,
  control,
  setValue,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dropDownOpen, setDropdownOpen] = useState<number | null>(null);
  const [activePickup, setActivePickup] = useState<string>("pickup-now");
  const [useGoogleLocation, setUseGoogleLocation] = useState(false);
  const [useGoogleAddress, setUseGoogleAddress] = useState(false);

  // Get all watched values
  const formValues = watch();
  const { cityData, setCityData } = activeCity();

  const today = new Date().toISOString().split("T")[0];

  let city = watch("city");
  let pickup_location = watch("pickup_location");
  let pickup_address = watch("pickup_address");
  let nationality = watch("nationality");

  // Initialize form from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Set form values from URL params
    Object.keys(formValues).forEach((key) => {
      const value = params.get(key);
      if (value) {
        setValue(key, value);
      }
    });

    // Set active pickup from URL
    const pickupType = params.get("pickupType");
    if (
      pickupType &&
      ["pickup-now", "pickup-after", "pickup-multiple"].includes(pickupType)
    ) {
      setActivePickup(pickupType);
    }
  }, []);

  // Update URL when form values change
  // useEffect(() => {
  //   const debounceTimer = setTimeout(() => {
  //     // Only update if at least one field has value
  //     const hasValues =
  //       Object.values(formValues).some((val) => val) ||
  //       activePickup !== "pickup-now";

  //     if (hasValues) {
  //       const params = new URLSearchParams();

  //       // Filter and add only non-empty values
  //       Object.entries(formValues).forEach(([key, value]) => {
  //         if (value && value !== "") {
  //           params.set(key, String(value));
  //         }
  //       });

  //       // Only add pickupType if not default
  //       if (activePickup !== "pickup-now") {
  //         params.set("pickupType", activePickup);
  //       }

  //       // Only update if params have changed
  //       const newUrl = `${window.location.pathname}?${params.toString()}`;
  //       if (newUrl !== window.location.pathname + window.location.search) {
  //         router.replace(newUrl, { scroll: false });
  //       }
  //     }
  //   }, 1000); // 500ms delay

  //   return () => clearTimeout(debounceTimer);
  // }, [formValues, activePickup, router]);

  useEffect(() => {
    if (cityData) {
      setValue("city", cityData?.city_name);
      setValue("city_name", cityData?.city_name);
      setValue("pickup_city", cityData?.city_id);
    }
  }, [cityData]);

  useEffect(() => {
    setValue("master_package_id", 1);
  }, []);

  // Toggle function
  const handleToggle = (buttonId: string) => {
    const newPickupType = activePickup === buttonId ? "pickup-now" : buttonId;
    setActivePickup(newPickupType);
  };

  const { data: packages,refetch:fetchPackages } = useLocalPackages({city_id: cityData?.city_id, booking_mode: 'rental'});
  useEffect(() => {
    fetchPackages();
  }, [cityData]);
  const { data } = useGetAddress(String(pickup_location));
  const { data: address } = getDetailedAddress(String(pickup_address));
  const { data: national } = getNationality(String(nationality));
  const { data: cityList, refetch } = getCityByname(String(city));

  const dateInputRef = useRef<HTMLInputElement>(null);

  const { ref: dateRef, ...dateRest } = register("pickup_date");

  const multipleFromDateInputRef = useRef<HTMLInputElement>(null);

  const multipleToDateInputRef = useRef<HTMLInputElement>(null);

  const { ref: multipleFromDateRef, ...multipleFromDate } = register("from");
  const { ref: multipleFromTimeRef, ...multipleFromTime } = register("time");

  const { ref: multipleToDateRef, ...multipleToDate } = register("to");
  const { ref: multipleToTimeRef, ...multipleToTime } = register("time");
useEffect(() => { 
  console.log({ watchFrom: watch("from"), watchTo: watch("to") });
  
const fromDate = new Date(watch("from"));
const toDate = new Date(watch("to"));
if(fromDate && toDate){
const diffInMs = toDate - fromDate; // difference in milliseconds
const diffInDays = diffInMs / (1000 * 60 * 60 * 24); // convert to days
setValue("total_days", diffInDays + 1); // +1 to include both start and end date
}
}, [watch("from"), watch("to")]);
  // useEffect(() => {
  //   console.log({ data });
  //   setDropdownOpen(1);
  // }, [data]);

  // useEffect(() => {
  //   console.log({ address });
  //   setDropdownOpen(2);
  // }, [address]);

  useEffect(() => {
    setDropdownOpen(3);
  }, [nationality]);

  useEffect(() => {
    refetch();
  }, [city]);

  useEffect(() => {
    console.log({ cityList });
    if (cityList?.data?.length > 0) {
      setDropdownOpen(0);
    }
  }, [cityList]);

  return (
    <>
      {/* City Package Pickup Location */}
      <div className="grid grid-cols-2 px-0 sm:px-6 lg:grid-cols-3 items-center">
        <div className="city-input flex flex-col gap-1 px-3 py-1 lg:p-1">
          <label htmlFor="city" className=" text-[12px] dark:text-gray-700">
            City <span className="text-red-500">*</span>
          </label>
          <input
            autoComplete="off"
            type="text"
            {...register("city")}
            value={city ? String(city) : ""}
            onBlur={() => {
              if (city && !cityData?.city_name) {
                setValue("city", "");
              }
            }}
            placeholder="Enter City"
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
          />
          {errors.city && (
            <p className="text-xs text-red-600">{errors.city.message}</p>
          )}
          {cityList?.data?.length > 0 &&
            dropDownOpen == 0 && (
              <div
                className="absolute z-10 mt-15 w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
                onMouseLeave={() => setDropdownOpen(null)}
              >
                {cityList?.data?.map((item: any) => (
                  <div
                    key={item?.id}
                    className="cursor-pointer px-3 py-1 hover:bg-gray-100 text-[12px]"
                    onClick={() => {
                      setValue("city", item?.city_name);
                      setCityData({
                        city_id: item?.city_id,
                        city_name: item?.city_name,
                      });
                      setTimeout(() => setDropdownOpen(null), 200);
                    }}
                  >
                    {item?.city_name}
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="package-input flex flex-col gap-1 px-3 py-1 lg:p-1">
          <label htmlFor="package" className=" text-[12px] dark:text-gray-700">
            Package <span className="text-red-500">*</span>
          </label>
          <select
            id="package"
            defaultValue=""
            {...register("package")}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedPackage = packages?.data?.data?.find(
                (pkg: any) => pkg.local_pkg_id.toString() === selectedId
              );
              if (selectedPackage) {
                setValue("local_pkg_name", selectedPackage.name);
              }
            }}
            className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
          >
            <option value="" disabled>
              Select Package
            </option>
            {packages?.data?.data?.map((item: any) => (
              <option key={item?.local_pkg_id} value={item?.local_pkg_id}>
                {/* {JSON.stringify(item)} */}
                {item?.name}

              </option>
            ))}
          </select>
          {errors.package && (
            <p className="text-xs text-red-600">{errors.package.message}</p>
          )}
        </div>

        {/* <div className="pickup_location-input flex flex-col gap-1 px-3 py-1 lg:p-3 col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center">
            <label
              htmlFor="pickup_location"
              className="text-[12px]"
            >
              Location <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setUseGoogleLocation(!useGoogleLocation)}
              className="text-[9px] text-[#9d7a20] cursor-pointer hover:underline"
            >
              {useGoogleLocation ? "Enter manually" : "Search with Google"}
            </button>
          </div>

          {useGoogleLocation ? (
            <GooglePlacesAutocomplete
              onPlaceSelected={(place) => {
                setValue("pickup_location", place.formatted_address);
                setValue("pickup_latitude", place?.geometry?.location?.lat());
                setValue("pickup_longitude", place?.geometry?.location?.lng());
              }}
              placeholder="Search location..."
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
              value=""
            />
          ) : (
            <>
              <input
                type="text"
                autoComplete="off"
                id="pickup_location"
                placeholder="Enter Pickup Location"
                {...register("pickup_location")}
                className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
              />

              {data?.data?.data?.length > 0 && dropDownOpen == 1 && (
                <div
                  className="absolute z-10 mt-15 w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  {data?.data.data.map((item: any) => (
                    <div
                      key={item?.id}
                      className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                      onClick={() => {
                        setValue("pickup_location", item?.area);
                        setValue("pickup_latitude", item?.latitude);
                        setValue("pickup_longitude", item?.longitude);
                        setTimeout(() => setDropdownOpen(null), 200);
                      }}
                    >
                      {item?.area}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {errors.pickup_location && (
            <p className="text-xs text-red-600">
              {errors.pickup_location.message}
            </p>
          )}
        </div> */}

        {/* <div className="pickup_location-input flex flex-col gap-1 px-3 py-1 lg:p-1 col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center">
            <label htmlFor="pickup_location" className="text-[12px]">
              Location <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setUseGoogleLocation(!useGoogleLocation)}
              className="text-[9px] text-[#9d7a20] cursor-pointer hover:underline"
            >
            </button>
          </div>

          {useGoogleLocation ? (
            <GooglePlacesAutocomplete
              onPlaceSelected={(place) => {
                setValue("pickup_location", place.formatted_address);
                setValue("pickup_latitude", place?.geometry?.location?.lat());
                setValue("pickup_longitude", place?.geometry?.location?.lng());
              }}
              placeholder="Search location..."
              className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
              value=""
            />
          ) : (
            <>
              <input
                type="text"
                autoComplete="off"
                id="pickup_location"
                placeholder="Enter Pickup Location"
                {...register("pickup_location")}
                onChange={(e) => {
                  setValue("pickup_location", e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setDropdownOpen(1);
                  } else {
                    setDropdownOpen(null);
                  }
                }}
                className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black relative"
              />
              {dropDownOpen === 1 && (
                <div
                  className="absolute z-10 mt-[54px] w-60 max-h-40 overflow-y-auto rounded-md bg-white text-sm shadow-lg"
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  {data?.data?.data?.length > 0 &&
                    data?.data?.data.map((item: any) => (
                      <div
                        key={item?.id}
                        className="cursor-pointer px-3 py-1 hover:bg-gray-100 font-sm"
                        onClick={() => {
                          setValue("pickup_location", item?.area);
                          setValue("pickup_latitude", item?.latitude);
                          setValue("pickup_longitude", item?.longitude);
                          setTimeout(() => setDropdownOpen(null), 200);
                        }}
                      >
                        {item?.area}
                      </div>
                    ))}
                  <div
                    className="cursor-pointer px-3 py-2 text-[#9d7a20] hover:bg-gray-100 font-sm"
                    onClick={() => {
                      setUseGoogleLocation(true);
                      setDropdownOpen(null);
                    }}
                  >
                    Search with Google
                  </div>
                </div>
              )}
            </>
          )}
           {errors.pickup_location && (
            <p className="text-xs text-red-600">
              {errors.pickup_location.message}
            </p>
          )}
        </div> */}

        <div className="pickup_location-input flex flex-col gap-1 px-3 py-1 lg:p-1 col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center">
            <label htmlFor="pickup_location" className="text-[12px]">
              Location <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Manual Input */}
          <input
            type="text"
            autoComplete="off"
            id="pickup_location"
            placeholder="Enter Location"
            {...register("pickup_location")}
            onChange={(e) => {
              setValue("pickup_location", e.target.value);
              if (e.target.value.trim().length > 0) {
                setDropdownOpen(1);
              } else {
                setDropdownOpen(null);
              }
            }}
            className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black relative"
          />

          {/* Dropdown Suggestions */}
          {dropDownOpen === 1 && (
            <div
              className="absolute z-10 mt-[54px] w-60 max-h-40 overflow-y-auto rounded-md bg-white text-sm shadow-lg"
              onMouseLeave={() => setDropdownOpen(null)}
            >
              {/* Location Suggestions */}
              {data?.data?.data?.length > 0 &&
                data?.data?.data.map((item: any) => (
                  <div
                    key={item?.id}
                    className="cursor-pointer px-3 py-1 hover:bg-gray-100 font-sm"
                    onClick={() => {
                      setValue("pickup_location", item?.area);
                      setValue("pickup_latitude", item?.latitude);
                      setValue("pickup_longitude", item?.longitude);
                      setTimeout(() => setDropdownOpen(null), 200);
                    }}
                  >
                    {item?.area}
                  </div>
                ))}
            </div>
          )}

          {/* Error Display */}
          {errors.pickup_location && (
            <p className="text-xs text-red-600">
              {errors.pickup_location.message}
            </p>
          )}
        </div>
      </div>

      {/* Pickup & Nationality */}
      <div className="px-0 sm:px-6 grid grid-cols-2 items-center">
        <div className="pickup-address-input flex flex-col px-3 gap-1 py-1 col-span-1 sm:col-span-1 relative lg:p-1">
          {/* Label and Toggle Button */}
          <div className="flex justify-between items-center">
            <label htmlFor="pickup_address" className="text-[12px]">
              Pickup Address <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setUseGoogleAddress(!useGoogleAddress)}
              className="text-[9px] text-[#9d7a20] cursor-pointer hover:underline"
            >
              {/* Toggle manually if needed */}
            </button>
          </div>

          {/* Conditional Rendering */}
          {useGoogleAddress ? (
            <GooglePlacesAutocomplete
              onPlaceSelected={(place) => {
                setValue("pickup_address", place.formatted_address);
              }}
              placeholder="Search pickup address..."
              className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] font-sm dark:text-black"
            />
          ) : (
            <>
              {/* Manual Input */}
              <input
                autoComplete="off"
                type="text"
                {...register("pickup_address")}
                placeholder="Enter Pickup Address"
                // onFocus={() => setDropdownOpen(2)}
                onChange={(e) => {
                  setValue("pickup_address", e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setDropdownOpen(2);
                  } else {
                    setDropdownOpen(null);
                  }
                }}
                // onFocus={(e) => {
                //   const val = e.target.value;
                //   if (val.trim().length > 0) {
                //     setDropdownOpen(2);
                //   }
                // }}
                className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] font-sm dark:text-black relative"
              />

              {/* Dropdown Suggestions */}
              {dropDownOpen === 2 && (
                <div
                  className="absolute z-10 mt-[54px] max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg w-[95%]"
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  {address?.length > 0 &&
                    address.map((item: any) => (
                      <div
                        key={item?.id}
                        className="cursor-pointer px-3 py-1 hover:bg-gray-100 font-sm"
                        onClick={() => {
                          setValue("pickup_address", item?.address);
                          setTimeout(() => setDropdownOpen(null), 200);
                        }}
                      >
                        {item?.address}
                      </div>
                    ))}

                  {/* Always show "Search with Google" option */}
                  <div
                    className="cursor-pointer px-3 py-2 text-[#9d7a20] hover:bg-gray-100 font-sm"
                    onClick={() => {
                      setUseGoogleAddress(true);
                      setDropdownOpen(null);
                    }}
                  >
                    Search with Google
                  </div>
                </div>
              )}
            </>
          )}

          {/* Error Display */}
          {errors.pickup_address && (
            <p className="text-xs text-red-600">
              {errors.pickup_address.message}
            </p>
          )}
        </div>

        <div className="nationality-input flex flex-col px-3 lg:p-1">
          <label htmlFor="nationality" className=" text-[12px]">
            Nationality <span className="text-red-500">*</span>
          </label>
          <input
            autoComplete="off"
            type="text"
            placeholder="Enter Nationality"
            {...register("nationality")}
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
          />
          {errors.nationality && (
            <p className="text-xs text-red-600">{errors.nationality.message}</p>
          )}

          {national?.length > 0 && dropDownOpen == 3 && (
            <div
              className="absolute z-10 mt-12 w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
              onMouseLeave={() => setDropdownOpen(null)}
            >
              {national?.map((item: any) => (
                <div
                  key={item?.id}
                  className="cursor-pointer px-3 py-1 hover:bg-gray-100 font-sm"
                  onClick={() => {
                    setValue("nationality", item?.nationality);
                  }}
                >
                  {item?.nationality}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toggle */}
      <div className="grid px-0 sm:px-8 gap-4 px-4 py-1 grid-cols-3 dark:text-black">
        {[
          { id: "pickup-now", label: "Pick Now (Within 30 Minutes)" },
          { id: "pickup-after", label: "Pick Later (After 1 Hr.)" },
          { id: "pickup-multiple", label: "Pick for multiple days" },
        ].map((option) => (
          <div
            key={option.id}
            className="flex gap-1 items-center text-sm sm:gap-3 "
          >
            <div
              onClick={() => handleToggle(option.id)}
              className={`rounded-full border-2 border-[#dfad0a] cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300
        ${activePickup === option.id ? "justify-end" : "justify-start"}
        min-w-10 min-h-5 sm:min-w-12 sm:min-h-5.5`}
            >
              <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-[#dfad0a] shadow-md transition-all duration-300" />
            </div>
            <p className="text-[10px]">{option.label}</p>
          </div>
        ))}
      </div>

      {/* Pickup After */}
      {activePickup === "pickup-after" && (
        <div className="grid items-center grid-cols-2 px-0 sm:px-6 xl:grid-cols-3">
          <div
            onClick={() => dateInputRef.current?.showPicker()}
            className="date-input flex flex-col px-2"
          >
            <label htmlFor="date" className="text-[12px]">
              Date
            </label>
            <input
              id="pickup-date-input"
              type="date"
              ref={(el) => {
                dateRef(el);
                dateInputRef.current = el;
              }}
              {...dateRest}
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
            />
            {errors.pickup_date && (
              <p className="text-xs text-[#b36af7] mt-1">
                {errors.pickup_date.message}
              </p>
            )}
          </div>
          {/*<div
            onClick={() => timeInputRef.current?.showPicker()}
            className="city-input flex flex-col px-3"
          >
            <label htmlFor="time" className="text-[14px] ">
              Time
            </label>
            <input
              type="time"
              ref={(el) => {
                timeRef(el);
                timeInputRef.current = el;
              }}
              {...timeRest}
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm dark:text-black"
            />
            {errors.time && (
              <p className="text-xs text-[#b36af7] mt-1">
                {errors.time.message}
              </p>
            )}
          </div>*/}
          <TimePicker
            title="Time"
            name="time"
            control={control}
            errors={errors}
          />
        </div>
      )}

      {/* Pickup Multiple */}
      {activePickup === "pickup-multiple" && (
        <div className="px-0 md:gap-2 sm:px-8 grid grid-cols-3 items-end lg:grid-cols-5">
          <div
            onClick={() => multipleFromDateInputRef.current?.showPicker()}
            className="w-full flex md:py-1 flex-col gap-1"
          >
            <label htmlFor="from" className=" text-[12px]">
              From
            </label>
            <input
              id="from"
              type="date"
              min={today}
              placeholder="From"
              ref={(el) => {
                multipleFromDateRef(el);
                multipleFromDateInputRef.current = el;
              }}
              {...multipleFromDate}
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
            />
          </div>

          <TimePicker
            title="Time"
            name="from_time"
            control={control}
            errors={errors}
          />

          <div
            onClick={() => multipleToDateInputRef.current?.showPicker()}
            className="w-full flex md:py-1 flex-col"
          >
            <label htmlFor="from" className=" text-[12px]">
              To
            </label>
            <input
              id="to"
              min={today}
              type="date"
              placeholder="To"
              ref={(el) => {
                multipleToDateRef(el);
                multipleToDateInputRef.current = el;
              }}
              {...multipleToDate}
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
            />
          </div>

          <TimePicker
            title="Time"
            name="to_time"
            control={control}
            errors={errors}
          />

          <div className="w-full flex md:py-1 flex-col">
            <label htmlFor="from" className=" text-[12px]">
              Days
            </label>
            <input
              autoComplete="off"
              id="days"
              type="number"
              min={1}
              placeholder="Enter Days"
              {...register("total_days")}
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [MozAppearance:textfield] focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
            />
          </div>
        </div>
      )}

      <ComingMode
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        control={control}
      />
    </>
  );
};

export default RentalFormInput;
