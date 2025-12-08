import { useState, useEffect, useRef, use } from "react";
import { FC } from "react";
import {
  UseFormRegister,
  FieldValues,
  FieldErrors,
  UseFormSetValue,
  Control,
} from "react-hook-form";
import { bookingFormData } from "./BookingForm";
import {
  getAirportAddress,
  getCityByname,
  getDetailedAddress,
  getLatLong,
  getNationality,
  useCityActivePackage,
  useGetAddress,
} from "../hooks/useCommon";
import { activeCity, useDistanceStorage, uselatLong } from "../store/common";
import GooglePlacesAutocomplete from "./GooglePlacesAutocompete";
import TimePicker from "./TimePicker";
import ComingMode from "./ComingMode";

interface AirportTransferFormInputProps {
  register: UseFormRegister<bookingFormData>;
  errors: FieldErrors<bookingFormData>;
  watch: UseFormRegister<bookingFormData>;
  setValue: UseFormSetValue<bookingFormData>;
  control: Control<bookingFormData>;
}

const AirportTransferFormInput: FC<AirportTransferFormInputProps> = ({
  register,
  errors,
  control,
  watch,
  setValue,
}) => {
  const [activePickup, setActivePickup] = useState<string>("pickup-now");
  const [dropDownOpen, setDropdownOpen] = useState<number | null>(null);
  const [comingMode, setComingMode] = useState<boolean>(false);

  const [airportTrainTransfer, setAirportTrainTransfer] =
    useState<string>("going-to");
  const { drop, pickup, setPickup, setDrop } = uselatLong();

  let pickup_location = watch("pickup_location");
  let drop_location = watch("drop_location");
  let drop_address = watch("drop_address");
  let pickup_address = watch("pickup_address");
  let nationality = watch("nationality");
  let city = watch("city");
  let airport_or_railway_station = watch("airport_or_railway_station");
  const [locationQuery, setLocationQuery] = useState({ pickup: "", drop: "" });

  const { cityData, setCityData } = activeCity();
  const { data: cityList, refetch } = getCityByname(String(city));


  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    console.log({ cityList });
  }, [cityList]);

  const { data: pickupLatLong, refetch: fetchPickupLatLong } = getLatLong(
    locationQuery.pickup
  );
  const { data: dropLatLong, refetch: fetchDropLatLong } = getLatLong(
    locationQuery.drop
  );
  const { data: airportList, isSuccess } = getAirportAddress(cityData?.city_id);
  const { data } = useGetAddress(
    String(pickup_location) || String(drop_location)
  );
  const { data: address } = getDetailedAddress(
    String(pickup_address) || String(drop_address)
  );
  const { data: national } = getNationality(String(nationality));

  const PickupLaterDateInputRef = useRef<HTMLInputElement>(null);
  const { ref: pickupLaterDateRef, ...pickupLaterRest } =
    register("pickup_date");

  useEffect(() => {
    console.log({ airportList });
  }, [isSuccess]);
  useEffect(() => {
    refetch();
  }, [city]);
  useEffect(() => {
    if (cityList?.data?.length > 0) {
      setDropdownOpen(0);
    }
  }, [cityList]);

  // Toggle function
  const handleToggle = (buttonId: string) => {
    setActivePickup((prev) => (prev === buttonId ? "pickup-now" : buttonId));
  };
  useEffect(() => {
    setValue("master_package_id" as any, 3);
  }, []);

  const handleAirportTrainToggle = (buttonId: string) => {
    console.log(buttonId);
    setAirportTrainTransfer((prev) =>
      prev === buttonId ? "going-to" : buttonId
    );
  };

  useEffect(() => {
    console.log({ address });
    setDropdownOpen(2);
  }, [address]);
  useEffect(() => {
    setDropdownOpen(3);
  }, [nationality]);

  useEffect(() => {
    if (pickup_address) {
      setLocationQuery((prev: any) => ({ ...prev, pickup: pickup_address }));
    }
  }, [pickup_address]);

  useEffect(() => {
    if (drop_address) {
      setLocationQuery((prev: any) => ({ ...prev, drop: drop_address }));
    }
  }, [drop_address]);

  // Update drop in locationQuery
  useEffect(() => {
    if (airport_or_railway_station) {
      setLocationQuery((prev: any) => ({
        ...prev,
        drop: airport_or_railway_station,
      }));
    }
  }, [airport_or_railway_station]);
  useEffect(() => {
    if (locationQuery.pickup) {
      fetchPickupLatLong();
    }
  }, [locationQuery.pickup]);

  // Fetch drop lat/long when its query changes
  useEffect(() => {
    if (locationQuery.drop) {
      console.log(locationQuery.drop, "droper");
      fetchDropLatLong();
    }
  }, [locationQuery.drop]);
  useEffect(() => {
    if (dropLatLong) {
      let latlong = dropLatLong?.data.responseData.response.data;
      console.log({ latlong });
      latlong && setDrop(`${latlong.lat},${latlong.lng}`);
    }
  }, [dropLatLong]);
  useEffect(() => {
    if (pickupLatLong) {
      console.log("pickup", pickupLatLong);
      let latlong = pickupLatLong?.data.responseData.response.data;
      console.log({ latlong });
      latlong && setPickup(`${latlong.lat},${latlong.lng}`);
    }
  }, [pickupLatLong]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const [useGoogleLocation, setUseGoogleLocation] = useState(false);
  const [useGoogleAddress, setUseGoogleAddress] = useState(false);
  const [useGoogleDropAddress, setUseGoogleDropAddress] = useState(false);
  return (
    <>
      {/* Airport/Train Toggle */}
      <div className="grid grid-cols-2 gap-4 px-2 sm:px-5 py-2 lg:grid-cols-3 py-3">
        {[
          { id: "going-to", label: "Going to Airport/Train" },
          { id: "coming-from", label: "Coming from Airport/Train" },
        ].map((option) => (
          <div key={option.id} className="flex gap-2 items-center">
            <div
              onClick={() => handleAirportTrainToggle(option.id)}
              className={`rounded-full border-2 border-[#dfad0a] cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300 ${
                airportTrainTransfer === option.id
                  ? "justify-end"
                  : "justify-start"
              } min-w-10 min-h-5 sm:min-w-12 sm:min-h-5.5`}
            >
              <div className="h-4 w-4 rounded-full bg-[#dfad0a] shadow-md transition-all duration-300" />
            </div>
            <p className="font-sm">{option.label}</p>
          </div>
        ))}
      </div>
      <hr className="border-b border-gray-200 mx-5" />
      {/* City Package Pickup Location */}
      <div className="grid grid-cols-2 items-center sm:px-6 lg:grid-cols-3 dark:text-black">
        <div className="city_input flex flex-col px-3 py-1 lg:p-1">
          <label htmlFor="airport_or_railway_station" className="text-[12px]">
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
            className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
          />
          {errors.city && (
            <p className="text-xs text-red-600">{errors.city.message}</p>
          )}
          {cityList?.data?.length > 0 &&
            dropDownOpen == 0 && (
              <div
                className="absolute z-10 mt-13 w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
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
                      setTimeout(() => setDropdownOpen(null), 100);
                    }}
                  >
                    {item?.city_name}
                  </div>
                ))}
              </div>
            )}
        </div>
        <div className="airport_or_railway_station-input flex flex-col px-3 py-1 lg:p-1">
          <label htmlFor="airport_or_railway_station" className="text-[12px]">
            Airport/Railway Station <span className="text-red-500">*</span>
          </label>
          <select
            id="airport_or_railway_station"
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
            {...register("airport_or_railway_station")}
          >
            {airportList?.map((i: any) => (
              <option>{i?.airport_railway_name}</option>
            ))}
          </select>
          {/* <input
            type="text"
            id="airport_or_railway_station"
            placeholder="Enter Airport/Railway Station"
             className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-sm dark:text-black"
             {...register("airport_or_railway_station")}
          /> */}
          {errors?.airport_or_railway_station && (
            <p className="text-xs text-red-600">
              {errors?.airport_or_railway_station?.message}
            </p>
          )}
          {/* Floating suggestion list */}
          {airportList?.length > 0 && dropDownOpen == 0 && (
            <div
              className="absolute z-10 mt-15 w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
              onMouseLeave={() => setDropdownOpen(null)}
            >
              {airportList?.map((item: any) => (
                <div
                  key={item?.id}
                  className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                  onClick={() => {}}
                >
                  {item?.city_name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flight_or_train_no_input flex flex-col px-3 py-1 lg:p-1">
          <label htmlFor="flight_or_train_no_input" className="text-[12px]">
            Flight/Train No.
          </label>
          <input
            autoComplete="off"
            type="text"
            id="flight_or_train_no_input"
            placeholder="Enter Flight/Train No."
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
          />
        </div>
        <TimePicker
          title="Flight Time"
          name="flight_time"
          control={control}
          errors={errors}
          className="px-3"
        />
        {airportTrainTransfer === "going-to" ? (
          <>
            <div className="flight_time_input flex flex-col px-3 py-1 lg:p-1 relative">
              {/* Label */}
              <div className="flex justify-between items-center">
                <label htmlFor="pickup_location" className="text-[12px]">
                  Pickup Location <span className="text-red-500">*</span>
                </label>
              </div>

              {/* Manual Input */}
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

              {/* Dropdown Suggestions */}
              {dropDownOpen === 1 && (
                <div
                  className="absolute z-10 mt-[50px] w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  {data?.data?.data?.length > 0 &&
                    data?.data?.data.map((item: any) => (
                      <div
                        key={item?.id}
                        className="cursor-pointer px-3 py-1 hover:bg-gray-100 font-sm"
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
          </>
        ) : (
          <>
            {/*
          <div className="flight_time_input flex flex-col px-3 py-1 lg:p-1 relative">
            <div className="flex justify-between items-center">
              <label htmlFor="drop_location" className="text-[12px]">
                Drop Location <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setUseGoogleLocation(!useGoogleLocation)}
                className="text-[9px] cursor-pointer text-[#9d7a20] hover:underline"
              >
              </button>
            </div>

            {useGoogleLocation ? (
              <GooglePlacesAutocomplete
                onPlaceSelected={(place) => {
                  setValue("drop_location", place?.formatted_address || "");
                  // setValue("drop_latitude", place?.geometry?.location?.lat());
                  // setValue("drop_longitude", place?.geometry?.location?.lng());
                }}
                placeholder="Search Drop location..."
                className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
                value=""
              />
            ) : (
              <>
                <input
                  type="text"
                  autoComplete="off"
                  id="drop_location"
                  placeholder="Enter Drop Location"
                  {...register("drop_location")}
                  onFocus={() => setDropdownOpen(2)}
                  className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black relative"
                />

                {dropDownOpen === 2 && (
                  <div
                    className="absolute z-10 mt-[54px] w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    {data?.data?.data?.length > 0 ? (
                      data?.data.data.map((item: any) => (
                        <div
                          key={item?.id}
                          className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                          onClick={() => {
                            setValue("drop_location", item?.area);
                            // setValue("drop_latitude", item?.latitude);
                            // setValue("drop_longitude", item?.longitude);
                            setTimeout(() => setDropdownOpen(null), 200);
                          }}
                        >
                          {item?.area}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500">
                        No matches found.
                      </div>
                    )}

                    <div
                      className="cursor-pointer px-3 py-2 text-[#9d7a20] hover:bg-gray-100 font-sm"
                      onClick={() => {
                        setUseGoogleLocation(true);
                        setDropdownOpen(null);
                      }}
                    >
                      🔍 Search with Google
                    </div>
                  </div>
                )}
              </>
            )}
          </div>*/}

            <div className="flight_time_input flex flex-col px-3 py-1 lg:p-1 relative">
              {/* Label */}
              <div className="flex justify-between items-center">
                <label htmlFor="drop_location" className="text-[12px]">
                  Drop Location <span className="text-red-500">*</span>
                </label>
              </div>

              {/* Manual Input */}
              <input
                type="text"
                autoComplete="off"
                id="drop_location"
                placeholder="Enter Drop Location"
                {...register("drop_location")}
                onFocus={() => setDropdownOpen(2)}
                className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black relative"
              />

              {/* Dropdown Suggestions */}
              {dropDownOpen === 2 && (
                <div
                  className="absolute z-10 mt-[50px] w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  {data?.data?.data?.length > 0 &&
                    data?.data?.data.map((item: any) => (
                      <div
                        key={item?.id}
                        className="cursor-pointer px-3 py-1 hover:bg-gray-100 font-sm"
                        onClick={() => {
                          setValue("drop_location", item?.area);
                          setTimeout(() => setDropdownOpen(null), 200);
                        }}
                      >
                        {item?.area}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Pickup & Nationality */}
      <div className="grid grid-cols-3 items-center sm:px-6 lg:grid-cols-3 lg:px-5 py-1 dark:text-black">
        {airportTrainTransfer === "going-to" ? (
          <div className="city-input flex flex-col px-3 py-1 col-span-2 relative">
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
                {/* {useGoogleAddress ? "Enter manually" : "Search with Google"} */}
              </button>
            </div>

            {/* Conditional Rendering */}
            {useGoogleAddress ? (
              <GooglePlacesAutocomplete
                onPlaceSelected={(place) => {
                  setValue("pickup_address", place.formatted_address || "");
                }}
                placeholder="Search pickup address..."
                className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
                value=""
              />
            ) : (
              <>
                {/* Manual Input */}
                <input
                  type="text"
                  autoComplete="off"
                  {...register("pickup_address")}
                  onFocus={() => setDropdownOpen(2)}
                  placeholder="Enter Pickup Address"
                  className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
                />

                {/* Dropdown Suggestions */}
                {dropDownOpen === 2 && (
                  <div
                    className="absolute z-10 mt-[54px] w-full max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    {address?.length > 0 &&
                      address.map((item: any) => (
                        <div
                          key={item?.id}
                          className="cursor-pointer px-3 py-1 hover:bg-gray-100 text-[12px]"
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
                      className="cursor-pointer px-3 py-2 text-[#9d7a20] hover:bg-gray-100 text-[12px]"
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

            {/* Error Message */}
            {errors.pickup_address && (
              <p className="text-xs text-red-600">
                {errors.pickup_address.message}
              </p>
            )}
          </div>
        ) : (
          <>
            {/* <div className="city-input flex flex-col px-3 py-1 col-span-2">
            <label
              // htmlFor="drop_address"
              htmlFor="pickup_address"
              className="text-[12px]"
            >
              Drop Address <span className="text-red-500">*</span>
              <button
                type="button"
                onClick={() => setUseGoogleAddress(!useGoogleAddress)}
                className="text-[9px] text-[#9d7a20] cursor-pointer hover:underline float-right"
              >
                {useGoogleAddress ? "Enter manually" : "Search with Google"}
              </button>
            </label>
            {useGoogleAddress ? (
              <GooglePlacesAutocomplete
                onPlaceSelected={(place) => {
                  // setValue("drop_address", place.formatted_address || "");
                  setValue("pickup_address", place.formatted_address || "");
                }}
                placeholder="Search drop address..."
                className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
              />
            ) : (
              <>
                <input
                  type="text"
                  autoComplete="off"
                  // {...register("drop_address")}
                  {...register("pickup_address")}
                  placeholder="Enter Drop Address"
                  className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
                />

                {address?.length > 0 && dropDownOpen == 2 && (
                  <div
                    className="absolute z-10 mt-15 w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    {address?.map((item: any) => (
                      <div
                        key={item?.id}
                        className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                        onClick={() => {
                          // setValue("drop_address", item?.address);
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
          </div> */}
            <div className="city-input flex flex-col px-3 py-1 col-span-2 relative">
              {/* Label and Toggle Button */}
              <div className="flex justify-between items-center">
                <label htmlFor="drop_address" className="text-[12px]">
                  Drop Address <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setUseGoogleAddress(!useGoogleAddress)}
                  className="text-[9px] text-[#9d7a20] cursor-pointer hover:underline"
                >
                  {/* {useGoogleAddress ? "Enter manually" : "Search with Google"} */}
                </button>
              </div>

              {/* Conditional Rendering */}
              {useGoogleAddress ? (
                <GooglePlacesAutocomplete
                  onPlaceSelected={(place) => {
                    setValue("drop_address", place.formatted_address || "");
                  }}
                  placeholder="Search drop address..."
                  className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
                  value=""
                />
              ) : (
                <>
                  {/* Manual Input */}
                  <input
                    type="text"
                    autoComplete="off"
                    {...register("drop_address")}
                    onFocus={() => setDropdownOpen(3)} 
                    placeholder="Enter Drop Address"
                    className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
                  />

                  {/* Dropdown Suggestions */}
                  {dropDownOpen === 3 && (
                    <div
                      className="absolute z-10 mt-[50px] w-full max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
                      onMouseLeave={() => setDropdownOpen(null)}
                    >
                      {address?.length > 0 &&
                        address.map((item: any) => (
                          <div
                            key={item?.id}
                            className="cursor-pointer px-3 py-1 hover:bg-gray-100 text-[12px]"
                            onClick={() => {
                              setValue("drop_address", item?.address);
                              setTimeout(() => setDropdownOpen(null), 200);
                            }}
                          >
                            {item?.address}
                          </div>
                        ))}

                      {/* Show "Search with Google" Option */}
                      <div
                        className="cursor-pointer px-3 py-2 text-[#9d7a20] hover:bg-gray-100 text-[12px]"
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

              {/* Error Message */}
              {errors.drop_address && (
                <p className="text-xs text-red-600">
                  {errors.drop_address.message}
                </p>
              )}
            </div>
          </>
        )}
        <div className="city-input flex flex-col pr-3">
          <label htmlFor="nationality" className="text-[12px]">
            Nationality <span className="text-red-500">*</span>
          </label>
          <input
            autoComplete="off"
            type="text"
            {...register("nationality")}
            placeholder="Enter Nationality"
            className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
          />
          {errors.nationality && (
            <p className="text-xs text-red-600">{errors.nationality.message}</p>
          )}
          {/* Floating suggestion list */}
          {national?.length > 0 && dropDownOpen == 3 && (
            <div
              className="absolute z-10 mt-12 w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
              onMouseLeave={() => setDropdownOpen(null)}
            >
              {national?.map((item: any) => (
                <div
                  key={item?.id}
                  className="cursor-pointer px-3 py-1 hover:bg-gray-100"
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

      {/* Toggle  */}
      <div className="grid items-center grid-cols-2 gap-4 px-2 sm:px-8 lg:grid-cols-3 py-1">
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
            <p className="text-[10px]">{option.label}</p>
          </div>
        ))}
      </div>

      {/* Pickup After */}
      {activePickup === "pickup-after" && (
        <div className="grid grid-cols-2 items-center sm:grid-cols-3 px-0 sm:px-6 xl:grid-cols-3">
          <div
            onClick={() => PickupLaterDateInputRef.current?.showPicker()}
            className="date-input flex flex-col px-2"
          >
            <label htmlFor="date" className="text-[12px]">
              Date
            </label>
            <input
              type="date"
              min={today}
              ref={(el) => {
                pickupLaterDateRef(el);
                PickupLaterDateInputRef.current = el;
              }}
              {...pickupLaterDateRef}
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
            />
            {errors.pickup_date && (
              <p className="text-xs text-[#b36af7] mt-1">
                {errors.pickup_date.message}
              </p>
            )}
          </div>
          <TimePicker
            title="Time"
            name="time"
            control={control}
            errors={errors}
          />
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

export default AirportTransferFormInput;
