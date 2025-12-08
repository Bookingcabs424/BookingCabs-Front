import { useEffect, useState } from "react";
import { FC } from "react";
import {
  UseFormRegister,
  FieldValues,
  FieldErrors,
  Control,
} from "react-hook-form";
import { bookingFormData } from "./BookingForm";
import DateTimePicker from "./DateTimePicker";
import DateTimePicker1 from "./DateTimePicker1";
import TimePicker from "./TimePicker";
import DatePicker from "./DatePicker";
import {
  getCityByname,
  getDetailedAddress,
  getLatLong,
  getNationality,
} from "../hooks/useCommon";
import { activeCity } from "../store/common";
import ComingMode from "./ComingMode";
import GooglePlacesAutocomplete from "./GooglePlacesAutocompete";

interface CityTaxiFormInputProps {
  register: UseFormRegister<bookingFormData>;
  errors: FieldErrors<bookingFormData>;
  control: Control<bookingFormData>;
  watch: any;
  setValue: any;
}

const SightSeeingFormInput: FC<CityTaxiFormInputProps> = ({
  register,
  errors,
  control,
  watch,
  setValue,
}) => {
  let city = watch("city");
  let nationality = watch("nationality");

  const { data: cityList, refetch } = getCityByname(String(city));
  const { data: national } = getNationality(String(nationality));
  const [useGoogleAddress, setUseGoogleAddress] = useState(false);
  const { cityData, setCityData } = activeCity();
  let pickup_address = watch("pickup_address");
  const { data: address } = getDetailedAddress(String(pickup_address));

  const [dropDownOpen, setDropdownOpen] = useState<number | null>(null);
  const [locationQuery, setLocationQuery] = useState({ pickup: "" });
  const { data: pickupLatLong, refetch: fetchPickupLatLong } = getLatLong(
    locationQuery.pickup
  );

  const tourTypes = [
    "Self Drive",
    "Weekend Getaways",
    "Short Break",
    "Long Weekend",
    "Pilgrimage",
    "Experiential",
    "Camps",
    "Biking",
    "Wildlife",
    "Spa Wellness",
    "Luxury",
    "Cruise Holidays",
    "Bollywood",
    "Accessible",
    "Youth",
    "Kids Holidays",
    "Ladies",
    "Honeymoon",
    "Shopping",
    "Sports",
    "Romantic",
    "Adventure",
    "Hills",
    "Beach Holidays",
    "Family Holidays",
  ];

  useEffect(() => {
    if (pickup_address) {
      setLocationQuery((prev: any) => ({ ...prev, pickup: pickup_address }));
    }
  }, [pickup_address]);

  useEffect(() => {
    if (cityList?.data?.length > 0) {
      setDropdownOpen(0);
    }
  }, [cityList]);

  useEffect(() => {
    setDropdownOpen(2);
  }, [address]);

  useEffect(() => {
    setDropdownOpen(3);
  }, [nationality]);

  useEffect(() => {
    setValue("master_package_id", 6);
  }, []);

  return (
    <>
      {/* City Tour Type Nationality */}
      <div className="grid grid-cols-2 sm:px-3 items-center lg:grid-cols-3 lg:px-7 dark:text-black">
        <div className="city-input flex flex-col px-3 py-1 dark:text-black lg:p-1">
          <label htmlFor="city" className=" font-sm">
            City <span className="text-red-500">*</span>
          </label>
          <input
            autoComplete="off"
            type="text"
            {...register("city")}
            placeholder="Enter City"
            defaultValue=""
            className="border rounded-md border-gray-400 px-2 py-1  outline-none  focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] font-sm dark:text-black"
          />
          {/* Floating suggestion list */}
          {cityList?.data?.length > 0 && dropDownOpen === 0 && (
            <div
              className="absolute z-10 mt-15 w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white font-sm shadow-lg"
              onMouseLeave={() => setDropdownOpen(null)}
            >
              {cityList?.data?.map((item: any) => (
                <div
                  key={item?.id}
                  className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                  onClick={() => {
                    setValue("city", item?.city_name);
                    setCityData({
                      city_id: item?.city_id,
                      city_name: item?.city_name,
                    });
                    setDropdownOpen(null);
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

        <div className="pickup_location-input flex flex-col px-3 lg:p-1">
          <label htmlFor="pickup_location" className="font-sm">
            Tour Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register("tour_type")}
            name=""
            id=""
            className="border rounded-md border-gray-400 px-2 py-1  outline-none  focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] font-sm"
          >
            <option value="Select Tour Type">Select Tour Type</option>
            {tourTypes.map((tour) => (
              <option value={tour} key={tour}>
                {tour}
              </option>
            ))}
          </select>

          {errors?.tour_type && (
            <p className=" text-red-600 sm:text-xs">
              {errors?.tour_type?.message}
            </p>
          )}
        </div>

        <div className="nationality-input flex flex-col px-3 lg:p-1 dark:text-black">
          <label htmlFor="nationality" className=" font-sm">
            Nationality <span className="text-red-500">*</span>
          </label>
          <input
            autoComplete="off"
            type="text"
            {...register("nationality")}
            placeholder="Enter Nationality"
            className="border rounded-md border-gray-400 px-2 py-1  outline-none  focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] font-sm dark:text-black"
          />
          {errors?.nationality && (
            <p className="text-xs text-red-600">
              {errors?.nationality?.message}
            </p>
          )}
          {national?.length > 0 && dropDownOpen == 3 && (
            <div
              className="absolute z-10 mt-15 w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white font-sm shadow-lg"
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

      {/* <div className="grid grid-cols-1 px-3 sm:px-8 dark:text-black">
        <label htmlFor="pickup_address" className="font-sm">
          Pickup Address <span className="text-red-500">*</span>
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
              setValue("pickup_address", place.formatted_address || "");
            }}
            placeholder="Search pickup address..."
            className="border rounded-md border-gray-400 px-2 py-1  outline-none  focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] font-sm dark:text-black"
          />
        ) : (
          <>
            <input
              type="text"
              autoComplete="off"
              {...register("pickup_address")}
              placeholder="Enter Pickup Address"
              className="border rounded-md border-gray-400 px-2 py-1  outline-none  focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] font-sm dark:text-black"
            />

            {address?.length > 0 && dropDownOpen == 2 && (
              <div
                className="absolute z-10 mt-15 w-fit overflow-y-auto rounded-md border border-gray-300 bg-white font-sm shadow-lg"
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
        {errors.pickup_address && (
          <p className="text-xs text-red-600">
            {errors.pickup_address.message}
          </p>
        )}
      </div> */}
      <div className="grid grid-cols-1 px-3 sm:px-8 dark:text-black">
        <div className="city-input flex flex-col py-1 relative">
          {/* Label and Toggle Button */}
          <label htmlFor="pickup_address" className="font-sm">
            Pickup Address <span className="text-red-500">*</span>
            <button
              type="button"
              onClick={() => setUseGoogleAddress(!useGoogleAddress)}
              className="text-[9px] text-[#9d7a20] cursor-pointer hover:underline float-right"
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
              className="border rounded-md border-gray-400 px-2 py-1 outline-none  focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] font-sm dark:text-black"
              value=""
            />
          ) : (
            <>
              {/* Manual Input */}
              <input
                type="text"
                autoComplete="off"
                {...register("pickup_address")}
                placeholder="Enter Pickup Address"
                onChange={(e) => {
                  setValue("pickup_address", e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setDropdownOpen(2);
                  } else {
                    setDropdownOpen(null);
                  }
                }}
                className="border rounded-md border-gray-400 px-2 py-1 outline-none  focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] font-sm dark:text-black"
              />

              {/* Dropdown Suggestions */}
              {dropDownOpen === 2 && (
                <div
                  className="absolute z-10 mt-[45px] w-full max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white font-sm shadow-lg"
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  {/* Local suggestions */}
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

          {/* Error Message */}
          {errors.pickup_address && (
            <p className="text-xs text-red-600">
              {errors.pickup_address.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 items-center px-3 sm:px-6 sm:gap-2">
        <DatePicker
          title="Date"
          name="required_date"
          register={register}
          errors={errors}
        />

        <TimePicker
          title="Time"
          name="required_time"
          control={control}
          errors={errors}
        />
      </div>
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

export default SightSeeingFormInput;
