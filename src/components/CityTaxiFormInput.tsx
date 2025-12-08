import { useEffect, useState } from "react";
import { FC } from "react";
import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";
import { bookingFormData } from "./BookingForm";
import {
  getCityByname,
  getDetailedAddress,
  getNationality,
  useGetAddress,
} from "../hooks/useCommon";
import { activeCity } from "../store/common";
import GooglePlacesAutocomplete from "./GooglePlacesAutocompete";

interface CityTaxiFormInputProps {
  register: UseFormRegister<bookingFormData>;
  errors: FieldErrors<bookingFormData>;
  watch: any;
  setValue: any;
  control: any; 
}

const CityTaxiFormInput: FC<CityTaxiFormInputProps> = ({
  register,
  errors,
  watch,
  setValue,
}) => {
  const [activePickup, setActivePickup] = useState<string>("pickup-now");
  let pickup_location = watch("pickup_location");
  let pickup_address = watch("pickup_address");
  let nationality = watch("nationality");
  let city = watch("city");
  let drop_address = watch("drop_address");
  const { data } = useGetAddress(String(pickup_location));
  const { data: address } = getDetailedAddress(String(pickup_address));
  const { data: dropaddress } = getDetailedAddress(String(drop_address));

  const { data: national } = getNationality(String(nationality));
  const { data: cityList, refetch } = getCityByname(String(city));
  const [dropDownOpen, setDropdownOpen] = useState<number | null>(null);
  const { cityData, setCityData } = activeCity();
  useEffect(() => {
    setValue("master_package_id", 2);
  }, []);
  // Toggle function
  const handleToggle = (buttonId: string) => {
    setActivePickup((prev) => (prev === buttonId ? "pickup-now" : buttonId));
  };

  useEffect(() => {
    console.log({ address });
    setDropdownOpen(2);
  }, [address]);

  useEffect(() => {
    refetch();
  }, [city]);
  useEffect(() => {
    if (cityList?.data?.length > 0) {
      setDropdownOpen(0);
    }
  }, [cityList]);

  useEffect(() => {
    if (data?.data?.data?.length > 0) {
      setDropdownOpen(1);
    }
  }, [data]);

  useEffect(() => {
    setDropdownOpen(3);
  }, [dropaddress]);

  useEffect(() => {
    setDropdownOpen(null);
  }, []);
  const [useGoogleAddress, setUseGoogleAddress] = useState(false);
  const [useGoogleDropAddress, setUseGoogleDropAddress] = useState(false);

  return (
    <>
      {/* City Package Pickup Location */}
      <div className="grid grid-cols-2 items-center sm:px-6 lg:grid-cols-3 dark:text-black">
        <div className="city-input flex flex-col px-3 dark:text-black lg:p-1">
          <label htmlFor="city" className=" font-sm">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("city")}
            placeholder="Enter City"
            defaultValue=""
            className="border rounded-md border-gray-400 px-2 py-1  outline-none focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] font-sm dark:text-black"
          />

          {/* Floating suggestion list */}
          {cityList?.data?.length > 0 && dropDownOpen == 0 && (
            <div
              className="absolute z-10 mt-13 w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white font-sm shadow-lg"
              onMouseLeave={() => setDropdownOpen(null)}
            >
              {cityList?.data?.map((item: any) => (
                <div
                  key={item?.id}
                  className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                  onClick={() => {
                    setValue("city", item?.city_name);
                    setTimeout(() => setDropdownOpen(null), 200);
                    setCityData({
                      city_id: item?.city_id,
                      city_name: item?.city_name,
                      state_id: item?.state_id,
                      country_id: item?.country_id,
                    });
                  }}
                >
                  {item?.city_name}
                </div>
              ))}
            </div>
          )}

          {errors?.city && (
            <p className="text-xs text-red-600">{errors?.city?.message}</p>
          )}
        </div>

        <div className="pickup_location-input flex flex-col px-3 lg:px-3 lg:py-2">
          <label htmlFor="pickup_location" className=" font-sm">
            Pickup Area <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("pickup_location")}
            placeholder="Enter Pickup Area"
            className="border rounded-md border-gray-400 px-2 py-1 outline-none focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] font-sm dark:text-black"
          />
          {errors?.pickup_area && (
            <p className="text-xs text-red-600">
              {errors?.pickup_area?.message}
            </p>
          )}
          {data?.data?.data?.length > 0 && dropDownOpen == 1 && (
            <div
              className="absolute z-10 mt-12 w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white font-sm shadow-lg"
              onMouseLeave={() => setDropdownOpen(null)}
            >
              {data?.data.data.map((item: any) => (
                <div
                  key={item?.id}
                  className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                  onClick={() => {
                    setValue("pickup_location", item?.area);
                    setTimeout(() => setDropdownOpen(null), 200);
                  }}
                >
                  {item?.area}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pickup Area */}
      {/* <div className="grid grid-cols-1 py-1 sm:px-6 lg:px-3 dark:text-black">
        <div className="city-input flex flex-col px-3 py-1">
          <label htmlFor="pickup_address" className="font-sm">
            Pickup Address <span className="text-red-500">*</span>
          </label>
          {useGoogleAddress ? (
            <GooglePlacesAutocomplete
              onPlaceSelected={(place) => {
                setValue("pickup_address", place.formatted_address || "");
              }}
              placeholder="Search pickup address..."
              className="border rounded-md border-gray-400 px-2 py-1  outline-none font-sm focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:font-sm dark:text-black"
            />
          ) : (
            <>
              <input
                type="text"
                {...register("pickup_address")}
                placeholder="Enter Pickup Address"
                className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:font-sm dark:text-black"
              />

              {address?.length > 0 && dropDownOpen == 2 && (
                <div
                  className="absolute z-10 mt-15 w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white font-sm shadow-lg w-fit"
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  {address?.map((item: any) => (
                    <div
                      key={item?.id}
                      className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                      onClick={() => {
                        setValue("pickup_address", item?.address);
                        setTimeout(() => setDropdownOpen(null), 200);
                      }}
                    >
                      {item?.address}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {errors?.pickup_address && (
            <p className="text-xs text-red-600">
              {errors?.pickup_address?.message}
            </p>
          )}
        </div>
      </div> */}

      <div className="grid grid-cols-1 sm:px-6 lg:px-3 dark:text-black">
        <div className="city-input flex flex-col px-3 py-1 relative">
          {/* Label and Toggle */}
          <label htmlFor="pickup_address" className="font-sm">
            Pickup Address <span className="text-red-500">*</span>
            <button
              type="button"
              onClick={() => setUseGoogleAddress(!useGoogleAddress)}
              className="text-[9px] cursor-pointer text-[#9d7a20] hover:underline float-right"
            >
              {/* {useGoogleAddress ? "Enter manually" : "Search with Google"} */}
            </button>
          </label>

          {/* Conditional Input */}
          {useGoogleAddress ? (
            <GooglePlacesAutocomplete
              onPlaceSelected={(place) => {
                setValue("pickup_address", place.formatted_address || "");
                setValue("pickup_latitude", place?.geometry?.location?.lat());
                setValue("pickup_longitude", place?.geometry?.location?.lng());
              }}
              placeholder="Search pickup address..."
              className="border rounded-md border-gray-400 px-2 py-1 outline-none font-sm focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:font-sm dark:text-black"
              value=""
            />
          ) : (
            <>
              {/* Manual Input */}
              <input
                type="text"
                {...register("pickup_address")}
                placeholder="Enter Pickup Address"
                autoComplete="off"
                onChange={(e) => {
                  setValue("pickup_address", e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setDropdownOpen(2);
                  } else {
                    setDropdownOpen(null);
                  }
                }}
                className="border rounded-md border-gray-400 px-2 py-1 outline-none focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] font-sm dark:text-black"
              />

              {/* Dropdown Suggestions */}
              {dropDownOpen === 2 && (
                <div
                  className="absolute z-10 mt-[48px] w-full max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white font-sm shadow-lg"
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  {/* Local address list */}
                  {address?.length > 0 &&
                    address.map((item: any) => (
                      <div
                        key={item?.id}
                        className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                        onClick={() => {
                          setValue("pickup_address", item?.address);
                          setValue("pickup_latitude", item?.latitude);
                          setValue("pickup_longitude", item?.longitude);
                          setTimeout(() => setDropdownOpen(null), 200);
                        }}
                      >
                        {item?.address}
                      </div>
                    ))}

                  {/* "Search with Google" option */}
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
          {errors?.pickup_address && (
            <p className="text-xs text-red-600">
              {errors?.pickup_address?.message}
            </p>
          )}
        </div>
      </div>

      {/* Drop Area */}
      <div className="grid grid-cols-1 py-1 sm:px-6 lg:px-3 dark:text-black">
        <div className="city-input flex flex-col px-3 relative">
          {/* Label and Toggle */}
          <label htmlFor="drop_address" className="font-sm">
            Drop Address <span className="text-red-500">*</span>
          </label>

          {useGoogleDropAddress ? (
            <GooglePlacesAutocomplete
              onPlaceSelected={(place) => {
                setValue("drop_address", place.formatted_address || "");
                setValue("drop_latitude", place?.geometry?.location?.lat());
                setValue("drop_longitude", place?.geometry?.location?.lng());
              }}
              placeholder="Search Drop address..."
              className="border rounded-md border-gray-400 px-2 py-1 outline-none font-sm focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:font-sm dark:text-black"
              value=""
            />
          ) : (
            <>
              <input
                type="text"
                {...register("drop_address")}
                placeholder="Enter Drop Address"
                autoComplete="off"
                onChange={(e) => {
                  setValue("drop_address", e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setDropdownOpen(3);
                  } else {
                    setDropdownOpen(null);
                  }
                }}
                className="border rounded-md border-gray-400 px-2 py-1 outline-none focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] font-sm dark:text-black"
              />

              {dropDownOpen == 3 && (
                <div
                  className="absolute z-10 mt-[48px] w-fit max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white font-sm shadow-md"
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  {dropaddress?.length > 0 &&
                    dropaddress.map((item: any) => (
                      <div
                        key={item?.id}
                        className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                        onClick={() => {
                          setValue("drop_address", item?.address);
                          setValue("drop_latitude", item?.latitude);
                          setValue("drop_longitude", item?.longitude);
                          setTimeout(() => setDropdownOpen(null), 200);
                        }}
                      >
                        {item?.address}
                      </div>
                    ))}

                  {/* "Search with Google" option */}
                  <div
                    className="cursor-pointer px-3 py-2 text-[#9d7a20] hover:bg-gray-100 font-sm"
                    onClick={() => {
                      setUseGoogleDropAddress(true);
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
          {errors?.drop_address && (
            <p className="text-xs text-red-600">
              {errors?.drop_address?.message}
            </p>
          )}
        </div>
      </div>

      {/* Toggle  */}
       <div className="grid grid-cols-2 gap-4 px-2 sm:px-5 py-2 lg:grid-cols-3 py-3">
        {[
          { id: "pickup-now", label: "Pick Now (Within 30 Minutes)" },
          { id: "pickup-after", label: "Pick Later (After 1 Hr.)" },
        ].map((option) => (
          <div key={option.id} className="flex gap-2 items-center">
            <div
              onClick={() => handleToggle(option.id)}
              className={`rounded-full border-2 border-[#dfad0a] cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300 ${
                activePickup === option.id ? "justify-end" : "justify-start"
              } min-w-10 min-h-5 sm:min-w-12 sm:min-h-5.5`}
            >
               <div className="h-4 w-4 rounded-full bg-[#dfad0a] shadow-md transition-all duration-300" />
            </div>
            <p className="font-sm">{option.label}</p>
          </div>
        ))}
      </div>

      {/* Pickup After */}
      {activePickup === "pickup-after" && (
        <div className="grid grid-cols-2 px-6 py-2 xl:grid-cols-3">
          <div className="date-input flex flex-col p-2 gap-2">
            <label htmlFor="date" className="text-[14px] font-[500]">
              Date
            </label>
            <input
              type="date"
              {...register("from")}
              className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
            />
          </div>
          <div className="city-input flex flex-col p-3 gap-2">
            <label htmlFor="time" className="text-[14px] font-[500]">
              Time
            </label>
            <input
              {...register("time")}
              type="time"
              className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
            />
          </div>
        </div>
      )}
      {/* Pickup Multiple */}
      {activePickup === "pickup-multiple" && (
        <div className="md:grid grid-cols-2 lg:grid-cols-3 xl:flex flex-wrap gap-4 px-6 py-5">
          <div className="w-full flex py-2 flex-col gap-2 xl:w-[18%]">
            <label htmlFor="from" className="text-[14px] font-medium">
              From
            </label>
            <input
              id="from"
              type="date"
              placeholder="From"
              className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
            />
          </div>

          <div className="w-full flex py-2 flex-col gap-2 xl:w-[18%]">
            <label htmlFor="time" className="text-[14px] font-medium">
              Time
            </label>
            <input
              id="time"
              type="time"
              className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
            />
          </div>

          <div className="w-full flex py-2 flex-col gap-2 xl:w-[18%]">
            <label htmlFor="to" className="text-[14px] font-medium">
              To
            </label>
            <input
              id="to"
              type="date"
              placeholder="To"
              className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
            />
          </div>

          <div className="w-full flex py-2 flex-col gap-2 xl:w-[18%]">
            <label htmlFor="time" className="text-[14px] font-medium">
              Time
            </label>
            <input
              id="time"
              type="time"
              className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
            />
          </div>

          <div className="w-full flex py-2 flex-col gap-2 xl:w-[18%]">
            <label htmlFor="days" className="text-[14px] font-medium ">
              Days
            </label>
            <input
              id="days"
              type="number"
              min={1}
              placeholder="Enter Days"
              className="border border-gray-400 px-3 py-2 rounded-md outline-none text-sm"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CityTaxiFormInput;
