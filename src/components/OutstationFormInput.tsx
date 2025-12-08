import { useState, useEffect, Fragment, useRef } from "react";
import { FC } from "react";
import {
  UseFormRegister,
  FieldValues,
  FieldErrors,
  Control,
  useFieldArray,
} from "react-hook-form";
import { bookingFormData } from "./BookingForm";

import { Plus } from "lucide-react";
import { Trash } from "lucide-react";
import {
  getAirportAddress,
  getCityByname,
  getDetailedAddress,
  getLatLong,
  getNationality,
  useGetAddress,
  usegetCities,
  useGetLatLongMutation,
} from "@/hooks/useCommon";
import { toast } from "react-toastify";
import { useDistanceStorage, uselatLong } from "@/store/common";
import GooglePlacesAutocomplete from "./GooglePlacesAutocompete";
import DateTimePicker1 from "./DateTimePicker1";
import { useFeatureStore } from "@/store/formTypes";
import TimePicker1 from "./TimePicker1";
import ComingMode from "./ComingMode";
import TimePicker from "./TimePicker";
import DatePicker from "./DatePicker";
import { fromPairs } from "lodash";

type OutstationType = "roundtrip" | "oneway" | "multicity";

interface OutstationFormInputProps {
  register: UseFormRegister<bookingFormData>;
  control: Control<bookingFormData>;
  errors: FieldErrors<bookingFormData>;
  outstation: OutstationType;
  setOutstation: React.Dispatch<React.SetStateAction<OutstationType>>;
  watch: UseFormRegister<bookingFormData>;
  setValue: any;
}
const OutstationFormInput: FC<OutstationFormInputProps> = ({
  register,
  errors,
  control,
  outstation,
  setOutstation,
  watch,
  setValue,
}) => {
  useEffect(() => {
    if (outstation == "roundtrip") setValue("master_package_id", 4);
    if (outstation == "oneway") setValue("master_package_id", 5);
  }, [outstation]);
  const [comingMode, setComingMode] = useState<boolean>(false);
  const { selectedFeature } = useFeatureStore();
  const [cityCount, setCityCount] = useState<number>(2);
  const [activeDropAddress, setActiveDropAddress] = useState<number | null>(
    null
  );
  const [dropDownOpen, setDropdownOpen] = useState<number | any>(null);
  const [addressDropdownOpen, setAddressDropdownOpen] = useState<number | any>(
    null
  );
  const [cityList, setCityList] = useState<any[]>([]);
  const [cityListSuggestion, SetCityListSuggestion] = useState([]);
  const [addressListSuggestion, setAddressListSuggestion] = useState([]);
  const [useGoogleAddress, setUseGoogleAddress] = useState(false);
  const [useGoogleDropAddress, setUseGoogleDropAddress] = useState(false);
  const [useGoogleDropAddressList, setUseGoogleDropAddressList] = useState<{
    [key: number]: boolean;
  }>({});

  const [cityPlaceHolder, setCityPlaceHolder] = useState([{}, {}]);
  const [locationQuery, setLocationQuery] = useState({ pickup: "", drop: "" });
  const { mutateAsync, isError, data } = useGetLatLongMutation();

  useEffect(() => {
    setValue("city_id", cityList[0]?.pickcity_id);
  }, [cityList[0]?.pickcity_id]);
  useEffect(() => {
    setValue("state_id", cityList[0]?.drop_state1);
  }, [cityList[0]?.drop_state1]);
  useEffect(() => {
    setValue("dropstate_id", cityList[0]?.drop_state2);
  }, [cityList]);
  useEffect(() => {
    setValue("dropcity_id", cityList[0]?.dropcity_id);
  }, [cityList[0]?.dropcity_id]);

  useEffect(() => {
    setValue("drop_address", cityList[0]?.drop_address);
  }, [cityList[0]?.drop_address]);

  const getCordinates = async (city: string) => {
    let cords = mutateAsync(city);
    return cords;
  };

  useEffect(() => {
    if (cityList[0]?.drop_city && cityList[0]?.pickup_city) {
      (async () => {
        let city1 = await getCordinates(cityList[0]?.drop_city);
        let city2 = await getCordinates(cityList[0]?.pickup_city);
        setValue("city", cityList[0]?.pickup_city);
        setValue("city_name", cityList[0]?.pickup_city);

        city1 = city1.responseData?.response.data;
        city2 = city2.responseData?.response.data;
        setPickup(`${city1?.lat},${city1?.lng}`);
        setDrop(`${city2?.lat},${city2?.lng}`);
      })();
    }
  }, [cityList]);
  useEffect(() => {
    if (cityList[0] && outstation == "oneway") {
      setValue("city_id", cityList[0]?.pickcity_id);
      setValue("dropcity_id", cityList[0]?.dropcity_id);
      setValue("state_id", cityList[0]?.drop_state1);
      setValue("drop_state_id", cityList[0]?.drop_state_id);
    }
    setValue("cityListToll", cityList);
    setValue("cityList", cityList);
  }, [cityList]);
  const { distance, setDistance } = useDistanceStorage();

  let from = watch("from");

  const getCity = usegetCities();


  useEffect(() => {
    if (from !== undefined) {
      getCity.mutate(
        { city: String(from), toCity: false },
        {
          onSuccess: (data: any) => {
            console.log(data);
            // toast.success("Reset link sent on your email!", {
            //   position: "top-right",
            //   autoClose: 5000,
            // });
          },
        }
      );
    }
  }, [from]);
  let pickup_address = watch("pickup_address");
  let drop_address = watch("drop_address");
  const { data: data1 } = getDetailedAddress(String(drop_address));

  let nationality = watch("nationality");
  //  const { data } = useGetAddress(String(pickup_location));
  const { data: address } = getDetailedAddress(String(pickup_address));
  const { data: dropaddress } = getDetailedAddress(String(drop_address));
  const { data: national } = getNationality(String(nationality));
  const { drop, pickup, setPickup, setDrop } = uselatLong();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "multicity",
  });

  // Toggle function
  const handleOutstationToggle = (buttonId: OutstationType) => {
    setOutstation((prev) => (prev === buttonId ? "roundtrip" : buttonId));
  };

  useEffect(() => {
    if (drop_address) {
      setLocationQuery((prev: any) => ({ ...prev, drop: drop_address }));
    }
  }, [drop_address]);

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
    dropaddress && setDropdownOpen(2.5);
  }, [dropaddress]);

  useEffect(() => {
    data1 && data1?.length > 0 && setDropdownOpen(3.5);
    data1 && data1?.length > 0 && setAddressDropdownOpen(3.5);
    // console.log("data1", data1);
  }, [data1]);

  const searchCitySuggestion = async (
    filter: string,
    field: any,
    toCity?: boolean
  ) => {
    getCity.mutate(
      { city: filter, toCity: toCity || false },
      {
        onSuccess: (res) => {
          SetCityListSuggestion(res.data);

          setDropdownOpen(field);
          // console.log({res})
          // toast.success("Reset link sent on your email!", {
          //   position: "top-right",
          //   autoClose: 5000,
          // });
        },
      }
    );
  };
  const [selectedDrop, setSelectedDrop] = useState("");
  const { data: listDrop, refetch } = useGetAddress(selectedDrop);

  useEffect(() => {
    setAddressListSuggestion(listDrop?.data?.data);
  }, [listDrop]);

  useEffect(() => {
    cityList[0]?.days && setValue("total_days", cityList[0]?.days || 0);
  }, [cityList[0]?.days]);

  const renderCityDropdown = (fieldName: string, indexArr: number) => {
    if (
      dropDownOpen == fieldName &&
      getCity?.data?.data?.length > 0
    ) {
      return (
        <div className="absolute z-10 mt-12 w-[fit] max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg font-xs">
          {getCity?.data?.data?.map((city: any) => (
            <div
              key={city?.city_id}
              className="cursor-pointer px-3 py-1 hover:bg-gray-100"
              onClick={() => {
                handleCitySelection(city, fieldName, indexArr);
                setDropdownOpen("");
                setDropdownOpen("");

                // setCitySearchTerm('');
                // setActiveDropdown(null);
              }}
            >
              {city?.city_name}({city?.state_name})
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  // console.log("addressListSuggestion", addressListSuggestion);
  // const renderdropAddressDropdown = (indexArr: number) => {
  //   if (activeDropAddress === indexArr && addressListSuggestion?.length > 0) {
  //     return (
  //       <div className="absolute z-10 mt-12 w-[fit] max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg font-sm">
  //         {addressListSuggestion.map((city: any, idx) => (
  //           <div
  //             key={idx}
  //             className="cursor-pointer px-3 py-1 hover:bg-gray-100"
  //             onClick={() => {
  //               let list = cityList;
  //               list[indexArr].drop_address = city?.area;
  //               setCityList(cityList);
  //               handleAddressSelection(indexArr, city?.area);
  //               // handleCitySelection(city, fieldName, indexArr);

  //               // setDropdownOpen("");
  //               // setDropdownOpen("");

  //               setAddressDropdownOpen(null);
  //               setAddressDropdownOpen(null);
  //               setActiveDropAddress(null);

  //               // setCitySearchTerm('');
  //               // setActiveDropdown(null);
  //             }}
  //           >
  //             {city?.area}
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  const renderdropAddressDropdown = (indexArr: number) => {
    if (activeDropAddress === indexArr && addressListSuggestion?.length > 0) {
      return (
        <div className="absolute z-10 mt-12 w-[fit] max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg font-sm">
          {addressListSuggestion.map((city: any, idx) => (
            <div
              key={idx}
              className="cursor-pointer px-3 py-1 hover:bg-gray-100"
              onClick={() => {
                let list = [...cityList];
                list[indexArr].drop_address = city?.area;
                setCityList(list);
                handleAddressSelection(indexArr, city?.area);
                setAddressDropdownOpen(null);
                setActiveDropAddress(null);
              }}
            >
              {city?.area}
            </div>
          ))}

          {/* 🔍 "Search with Google" Option */}
          <div
            className="cursor-pointer px-3 py-2 text-[#9d7a20] hover:bg-gray-100"
            onClick={() => {
              setUseGoogleDropAddressList((prev) => ({
                ...prev,
                [indexArr]: true,
              }));
              setAddressDropdownOpen(null);
              setActiveDropAddress(null);
            }}
          >
            Search with Google
          </div>
        </div>
      );
    }
    return null;
  };

  const handleCitySelection = (city: any, fieldName: string, index: number) => {
    // console.log({ fieldName, city, index });
    if (fieldName.includes("pick")) {
      setCityList((prev) => {
        const updated = [...prev];
        if (!updated[index]) updated[index] = {} as any;
        updated[index] = {
          ...updated[index],
          pickup_city: `${city.city_name} (${city.state_name})`,
          pickcity_id: city.city_id,
          drop_state1: city.state_id, // Assuming state_id is available
        };
        // console.log({ updated });
        if (outstation == "roundtrip") {
          updated[index + 1] = {
            ...updated[index + 1],
            drop_city: `${city.city_name} (${city.state_name})`,
            dropcity_id: city.city_id,
            drop_state2: city.state_id,
          };
        }

        if (outstation == "multicity") {
          updated[index == 0 ? updated?.length : index + 1] = {
            ...updated[index + 1],
            drop_city: `${city.city_name} (${city.state_name})`,
            dropcity_id: city.city_id,
            drop_state2: city.state_id,
            // drop_address: `${city.city_name} (${city.state_name})`,
          };
        }
        // console.log({ updated });
        return updated;
      });

      // setCityListToll(prev => {
      //   const updated = [...prev];
      //   if (!updated[index]) updated[index] = {} as any;
      //   updated[index] = {
      //     ...updated[index],
      //     pickup_city: `${city.city_name} (${city.state_name})`,
      //     pickcity_id: city.city_id
      //   };
      //   return updated;
      // });
    } else if (fieldName.includes("drop")) {
      setCityList((prev) => {
        const updated = [...prev];
        if (!updated[index]) updated[index] = {} as any;
        updated[index] = {
          ...updated[index],
          drop_city: `${city.city_name} (${city.state_name})`,
          dropcity_id: city.city_id,
          drop_state2: city.state_id,
        };
        if (outstation == "roundtrip" || outstation == "multicity") {
          updated[index + 1] = {
            ...updated[index + 1],
            pickup_city: `${city.city_name} (${city.state_name})`,
            pickcity_id: city.city_id,
            // drop_address: `${city.city_name} (${city.state_name})`,
          };
        }
        return updated;
      });

      // setCityListToll(prev => {
      //   const updated = [...prev];
      //   if (!updated[index]) updated[index] = {} as any;
      //   updated[index] = {
      //     ...updated[index],
      //     drop_city: `${city.city_name} (${city.state_name})`,
      //     dropcity_id: city.city_id
      //   };
      //   return updated;
      // });
    }

    setDropdownOpen("");
  };

  const handleAddressSelection = (index: number, value: string) => {
    if (outstation === "multicity") {
      setCityList((prev: any) => {
        const updated = [...prev];
        if (!updated[index]) updated[index] = {} as any;
        updated[index] = {
          ...updated[index],
          drop_address: value,
        };
        return updated;
      });
    } else if (outstation === "oneway") {
      setCityList((prev: any) => {
        const updated = [...prev];
        if (!updated[0]) updated[0] = {} as any;
        updated[0] = {
          ...updated[0],
          drop_address: value,
        };
        return updated;
      });
    }
  };

  console.log(cityListSuggestion);

  console.log(getCity?.data?.responseData?.response?.data);

  return (
    <>
      {/* Outstation Toggle */}
      <div className="px-8 flex flex-wrap gap-5 sm:grid grid-cols-2  md:grid-cols-3 gap-4 px-4 py-2 lg:grid-cols-3">
        {[
          { id: "oneway", label: "Oneway" },
          { id: "roundtrip", label: "Round Trip" },
          { id: "multicity", label: "Multicity" },
        ].map((option) => (
          <div key={option.id} className="flex gap-2 items-center">
            <div
              onClick={() =>
                handleOutstationToggle(option.id as OutstationType)
              }
              className={`rounded-full border-2 border-[#dfad0a] cursor-pointer bg-white flex items-center px-0.5 transition-all duration-300 ${
                outstation == option.id ? "justify-end" : "justify-start"
              } min-w-10 min-h-5 sm:min-w-12 sm:min-h-5.5`}
            >
              <div className="h-4 w-4 rounded-full bg-[#dfad0a] shadow-md transition-all duration-300" />
            </div>
            <p className="text-[12px]">{option.label}</p>
          </div>
        ))}
      </div>
      <hr className="border-b border-gray-200 mx-5 my-2" />
      {/* City Package Pickup Location */}
      <div
        className={`grid grid-cols-2 items-center ${
          outstation === "oneway" ? "lg:grid-cols-4" : "lg:grid-cols-4"
        } px-3 sm:px-6 dark:text-black`}
      >
        {(outstation === "oneway" || outstation === "roundtrip") && (
          <div className="grid grid-cols-4 col-span-12 items-center">
            <div className="from_input flex flex-col px-2 dark:text-black lg:p-1">
              <label htmlFor="from" className=" text-[12px] dark:text-black">
                From <span className="text-red-500">*</span>
              </label>
              <input
                autoComplete="off"
                type="text"
                value={cityList[0]?.pickup_city || ""}
                placeholder="From"
                onChange={(e) => {
                  const value = e.target.value;
                  searchCitySuggestion(value, "pickcity_id", false);
                  setCityList((prev) => {
                    const updated = [...prev];
                    if (!updated[0]) updated[0] = {};
                    updated[0] = {
                      ...updated[0],
                      pickup_city: value,
                    };
                    return updated;
                  });
                }}
                className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
              />
              {errors.from && (
                <p className="text-xs text-red-600">{errors.from.message}</p>
              )}
              {renderCityDropdown("pickcity_id", 0)}
            </div>
            <div className="to flex flex-col px-2 lg:p-1">
              <label htmlFor="to" className=" text-[12px]">
                To <span className="text-red-500">*</span>
              </label>
              <input
                autoComplete="off"
                type="text"
                onChange={(e) => {
                  let value = e.target.value;
                  setCityList((prev) => {
                    const updated = [...prev];
                    if (!updated[0]) updated[0] = {};
                    updated[0] = {
                      ...updated[0],
                      drop_city: value,
                    };
                    return updated;
                  });
                  searchCitySuggestion(value, "dropcity_id", true);
                }}
                value={cityList[0]?.drop_city || ""}
                id="to"
                placeholder="To"
                className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
              />
              {errors?.to && (
                <p className="text-xs text-red-600">{errors?.to?.message}</p>
              )}
              {renderCityDropdown("dropcity_id", 0)}
            </div>

            <DatePicker
              title="Date"
              name="round_date_1"
              register={register}
              errors={errors}
            />

            <TimePicker
              title="Time"
              name="oneway_time"
              control={control}
              errors={errors}
            />
          </div>
        )}

        {/* Extra field of Days*/}
        {outstation === "roundtrip" && (
          <div className="city-input flex flex-col px-2 py-1 col-span-12 relative">
            {/* Label and Toggle Button */}
            <div className="flex justify-between items-center">
              <label htmlFor="drop_address" className="text-[12px]">
                Drop Address <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Conditional Rendering */}
            {useGoogleDropAddress ? (
              <GooglePlacesAutocomplete
                onPlaceSelected={(place) => {
                  setValue("drop_address", place.formatted_address || "");
                }}
                placeholder="Search drop address..."
                className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
              />
            ) : (
              <>
                <input
                  type="text"
                  autoComplete="off"
                  {...register("drop_address")}
                  placeholder="Enter Drop Address"
                  onChange={(e) => {
                    setValue("drop_address", e.target.value);
                    if (e.target.value.trim().length > 0) {
                      setDropdownOpen(3.5);
                    } else {
                      setDropdownOpen(null);
                    }
                  }}
                  className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
                />

                {/* Dropdown Suggestions */}
                {data1?.length > 0 && dropDownOpen === 3.5 && (
                  <div
                    className="absolute z-10 mt-13 w-fit max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    {data1.map((item: any) => (
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

                    {/* Always show "Search with Google" option */}
                    <div
                      className="cursor-pointer px-3 py-2 text-[#9d7a20] hover:bg-gray-100 text-[12px]"
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
                {errors.drop_address.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Extra Column & fields in RoundTrip */}
      {outstation === "roundtrip" && (
        <div
          className={`grid grid-cols-2 px-3 sm:px-6 items-center grid grid-cols-4 col-span-12 items-center`}
        >
          <div className="from_input flex flex-col px-2 py-1 lg:p-1">
            <label htmlFor="from" className=" text-[12px]">
              From <span className="text-red-500">*</span>
            </label>
            <input
              autoComplete="off"
              type="text"
              id="from"
              value={cityList[1]?.pickup_city || ""}
              placeholder="From"
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
              onChange={(e) => {
                const value = e.target.value;
                searchCitySuggestion(value, "pickcity_id-1", false);
                setCityList((prev) => {
                  const updated = [...prev];
                  if (!updated[1]) updated[1] = {};
                  updated[1] = {
                    ...updated[1],
                    pickup_city: value,
                  };
                  return updated;
                });
              }}
            />
            {errors?.round_from && (
              <p className="text-xs text-red-600">
                {errors?.round_from?.message}
              </p>
            )}
            {renderCityDropdown("pickcity_id-1", 1)}
          </div>
          <div className="to_input flex flex-col px-2 py-1 lg:p-1">
            <label htmlFor="to" className=" text-[12px]">
              To <span className="text-red-500">*</span>
            </label>
            <input
              autoComplete="off"
              type="text"
              value={cityList[1]?.drop_city || ""}
              id="to"
              placeholder="To"
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
              onChange={(e) => {
                const value = e.target.value;
                searchCitySuggestion(value, "drop_city_id-1", true);
                setCityList((prev) => {
                  const updated = [...prev];
                  if (!updated[1]) updated[1] = {};
                  updated[1] = {
                    ...updated[1],
                    drop_city: value,
                  };
                  return updated;
                });
              }}
            />
            {errors?.round_to && (
              <p className="text-xs text-red-600">
                {errors?.round_to?.message}
              </p>
            )}
            {renderCityDropdown("drop_city_id-1", 1)}
          </div>

          <DatePicker
            title="Date"
            name="round_date_2"
            register={register}
            errors={errors}
          />
          <TimePicker
            title="Time"
            name="time"
            control={control}
            errors={errors}
          />
        </div>
      )}

      {/* Extra Column & fields in RoundTrip */}
      {outstation === "multicity" &&
        Array(cityCount)
          .fill("a")
          .map((_, idx) => (
            <Fragment key={idx}>
              <div className={`grid px-3 sm:px-6 items-center grid-cols-4`}>
                <div className="from_input flex flex-col px-1 py-1 lg:p-1">
                  <label
                    htmlFor={`multicity.${idx}.from`}
                    className=" text-[12px]"
                  >
                    From <span className="text-red-500">*</span>
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    // {...register(`multicity.${idx}.from`)}
                    value={cityList[idx]?.pickup_city}
                    placeholder="From"
                    className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
                    onChange={(e) => {
                      const value = e.target.value;
                      searchCitySuggestion(value, `pickcity_id-${idx}`, false);
                      setCityList((prev) => {
                        const updated = [...prev];
                        if (!updated[idx]) updated[idx] = {};
                        updated[idx] = {
                          ...updated[idx],
                          pickup_city: value,
                        };
                        return updated;
                      });
                    }}
                  />
                  {errors.multicity?.[idx]?.from && (
                    <p className="text-xs text-red-600">
                      {errors.multicity[idx].from?.message}
                    </p>
                  )}
                  {renderCityDropdown(`pickcity_id-${idx}`, idx)}
                </div>
                <div className="to_input flex flex-col px-1 py-1 lg:p-1">
                  <label
                    htmlFor={`multicity.${idx}.to`}
                    className=" text-[12px]"
                  >
                    To <span className="text-red-500">*</span>
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    id="to"
                    value={cityList[idx]?.drop_city}
                    // {...register(`multicity.${idx}.to`)}
                    onChange={(e) => {
                      const value = e.target.value;
                      searchCitySuggestion(value, `dropcity_id-${idx}`, true);
                      setCityList((prev) => {
                        const updated = [...prev];
                        if (!updated[idx]) updated[idx] = {};
                        updated[idx] = {
                          ...updated[idx],
                          drop_city: value,
                        };

                        return updated;
                      });
                    }}
                    placeholder="To"
                    className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
                  />
                  {errors.multicity?.[idx]?.to && (
                    <p className="text-xs text-red-600">
                      {errors.multicity[idx].to?.message}
                    </p>
                  )}
                  {renderCityDropdown(`dropcity_id-${idx}`, idx)}
                </div>

                <DatePicker
                  title="Date"
                  name={`multicity.${idx}.date`}
                  register={register}
                  errors={errors}
                  onChange={(value) => {
                    setCityList((prev) => {
                      const updated = [...prev];

                      if (idx > 0) {
                        updated[idx] = {
                          ...updated[idx],
                          pickup_date: value,
                        };
                        updated[idx - 1] = {
                          ...updated[idx - 1],
                          drop_date: value,
                        };

                        const pickupDate = new Date(updated[idx]?.pickup_date);
                        const dropDate = new Date(
                          updated[idx - 1]?.pickup_date
                        );
                        const diffInMs = Math.abs(
                          pickupDate.getTime() - dropDate.getTime()
                        );
                        const diffInDays = Math.ceil(
                          diffInMs / (1000 * 60 * 60 * 24)
                        );

                        updated[idx - 1] = {
                          ...updated[idx - 1],
                          days: diffInDays,
                        };
                      } else {
                        if (!updated[idx]) updated[idx] = {};
                        updated[idx] = {
                          ...updated[idx],
                          pickup_date: value,
                        };
                      }
                      return updated;
                    });
                  }}
                  className="px-1"
                />

                <TimePicker
                  title="Time"
                  className="px-1"
                  name={`multicity.${idx}.time`}
                  control={control}
                  errors={errors}
                  outstation="multicity"
                  onChange={(value) => {
                    setCityList((prev) => {
                      const updated = [...prev];

                      if (idx > 0) {
                        updated[idx] = {
                          ...updated[idx],
                          pickup_date: value,
                        };
                        updated[idx - 1] = {
                          ...updated[idx - 1],
                          drop_date: value,
                        };

                        const pickupDate = new Date(updated[idx]?.pickup_date);
                        const dropDate = new Date(
                          updated[idx - 1]?.pickup_date
                        );
                        const diffInMs = Math.abs(
                          pickupDate.getTime() - dropDate.getTime()
                        );
                        const diffInDays = Math.ceil(
                          diffInMs / (1000 * 60 * 60 * 24)
                        );

                        updated[idx - 1] = {
                          ...updated[idx - 1],
                          days: diffInDays,
                        };
                      } else {
                        if (!updated[idx]) updated[idx] = {};
                        updated[idx] = {
                          ...updated[idx],
                          pickup_date: value,
                        };
                      }
                      return updated;
                    });
                  }}
                />
              </div>
              {/* <div className="drop_address_input flex flex-col px-5 sm:px-8 py-1">
                <label
                  htmlFor={`multicity.${idx}.drop_address`}
                  className=" text-[12px]"
                >
                  Drop Address <span className="text-red-500">*</span>
                </label>
                <input
                  autoComplete="off"
                  type="text"
                  // {...register(`multicity.${idx}.from`)}
                  value={cityList[idx]?.drop_address}
                  placeholder="Enter Drop Address"
                  className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
                  onChange={(e) => {
                    const value = e.target.value;
                    setActiveDropAddress(idx);
                    searchCitySuggestion(value, `drop_address-${idx}`, false);
                    setSelectedDrop(value);
                    setCityList((prev) => {
                      const updated = [...prev];
                      if (!updated[idx]) updated[idx] = {};
                      updated[idx] = {
                        ...updated[idx],
                        drop_address: value,
                      };
                      return updated;
                    });
                  }}
                />
                {errors.multicity?.[idx]?.drop_address && (
                  <p className="text-xs text-red-600">
                    {errors.multicity[idx].drop_address?.message}
                  </p>
                )}
                {renderdropAddressDropdown(idx)}
              </div> */}

              <div className="drop_address_input flex flex-col px-5 sm:px-8 py-1 relative">
                {/* Label and Toggle Button */}
                <div className="flex justify-between items-center">
                  <label
                    htmlFor={`multicity.${idx}.drop_address`}
                    className="text-[12px]"
                  >
                    Drop Address <span className="text-red-500">*</span>
                  </label>
                  {/* <button
                    type="button"
                    onClick={() =>
                      setUseGoogleDropAddressList((prev) => ({
                        ...prev,
                        [idx]: !prev[idx],
                      }))
                    }
                    className="text-[9px] text-[#9d7a20] cursor-pointer hover:underline"
                  >
                    {useGoogleDropAddressList[idx]
                      ? "Enter manually"
                      : "Search with Google"}
                  </button> */}
                </div>

                {/* Google Autocomplete or Manual Input */}
                {useGoogleDropAddressList[idx] ? (
                  <GooglePlacesAutocomplete
                    onPlaceSelected={(place) => {
                      const selected = place?.formatted_address || "";
                      setCityList((prev) => {
                        const updated = [...prev];
                        if (!updated[idx]) updated[idx] = {};
                        updated[idx].drop_address = selected;
                        return updated;
                      });
                    }}
                    placeholder="Search drop address..."
                    className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
                  />
                ) : (
                  <>
                    <input
                      autoComplete="off"
                      type="text"
                      value={cityList[idx]?.drop_address}
                      placeholder="Enter Drop Address"
                      className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
                      onChange={(e) => {
                        const value = e.target.value;
                        setActiveDropAddress(idx);
                        searchCitySuggestion(
                          value,
                          `drop_address-${idx}`,
                          false
                        );
                        setSelectedDrop(value);
                        setCityList((prev) => {
                          const updated = [...prev];
                          if (!updated[idx]) updated[idx] = {};
                          updated[idx].drop_address = value;
                          return updated;
                        });
                      }}
                    />
                    {errors.multicity?.[idx]?.drop_address && (
                      <p className="text-xs text-red-600">
                        {errors.multicity[idx].drop_address?.message}
                      </p>
                    )}
                    {renderdropAddressDropdown(idx)}
                  </>
                )}
              </div>

              {idx !== cityCount - 1 && (
                <hr className="border-b border-gray-300 mx-6 my-2" />
              )}
            </Fragment>
          ))}

      {outstation === "multicity" && (
        <div className="px-6 sm:px-8 py-1">
          <button
            type="button"
            className="h-full py-1 rounded-md bg-[#dfad0a] text-[12px] cursor-pointer hover:bg-[#9d7a20] transition flex items-center gap-1 px-4"
            onClick={() => setCityCount(cityCount + 1)}
          >
            Add City <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Pickup & Nationality */}
      <div className="grid grid-cols-2 items-center px-2 sm:px-6 lg:grid-cols-3 py-1 dark:text-black">
        {/* <div className="city-input flex flex-col px-2 py-1 lg:col-span-2">
          <label htmlFor="pickup_address" className=" text-[12px]">
            Pickup Address <span className="text-red-500">*</span>
            <button
              type="button"
              onClick={() => setUseGoogleAddress(!useGoogleAddress)}
              className="text-[9px] cursor-pointer text-[#9d7a20] hover:underline float-right"
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
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
            />
          ) : (
            <>
              <input
                type="text"
                autoComplete="off"
                {...register("pickup_address")}
                placeholder="Enter Pickup Address"
                className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
              />

              {address?.length > 0 && dropDownOpen == 2 && (
                <div
                  className="absolute z-10 mt-15 w-fit overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
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
        </div> */}

        <div
          className={`pickup-address-input flex flex-col px-2 gap-1 py-1 lg:col-span-2 sm:col-span-1 relative`}
        >
          {/* Label and Toggle Button */}
          <div className="flex justify-between items-center">
            <label htmlFor="pickup_address" className="text-[12px]">
              Pickup Address <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Conditional Rendering */}
          {useGoogleAddress ? (
            <GooglePlacesAutocomplete
              onPlaceSelected={(place) => {
                setValue("pickup_address", place.formatted_address);
              }}
              placeholder="Search pickup address..."
              className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
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
                className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black relative"
              />

              {/* Dropdown Suggestions */}
              {dropDownOpen === 2 && (
                <div
                  className="absolute z-10 mt-[54px] max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg w-[95%] font-sm"
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  {address?.length > 0 &&
                    address.map((item: any) => (
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
        {/* <div className="city-input flex flex-col px-2 lg:pr-3 py-1 dark:text-black "></div> */}
      </div>

      {/* Drop Address  */}
      {outstation === "oneway" && (
        <div className="grid px-3 sm:px-8 grid-cols-3">
          {/* <div className="city-input flex flex-col py-1 col-span-2">
            <label htmlFor="pickup_address" className=" text-[12px]">
              Drop Address <span className="text-red-500">*</span>
            </label>
            <input
              autoComplete="off"
              type="text"
              {...register("drop_address")}
              placeholder="Enter Drop Address"
              className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
            />

            {dropaddress?.length > 0 && dropDownOpen == 3.5 && (
              <div
                className="absolute z-10 mt-13 max-h-40 w-fit overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
                onMouseLeave={() => setDropdownOpen(null)}
              >
                {dropaddress?.map((item: any) => (
                  <div
                    key={item?.id}
                    className="cursor-pointer px-3 py-1 hover:bg-gray-100 font-sm"
                    onClick={() => {
                      setValue("drop_address", item?.address);
                      setDropdownOpen(null);
                    }}
                  >
                    {item?.address}
                  </div>
                ))}
              </div>
            )}
            {errors?.drop_address && (
              <p className="text-xs text-red-600">
                {errors?.drop_address?.message}
              </p>
            )}
          </div> */}

          <div className="city-input flex flex-col py-1 col-span-2 relative">
            {/* Label and Toggle Button */}
            <div className="flex justify-between items-center">
              <label htmlFor="pickup_address" className="text-[12px]">
                Drop Address <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Conditional Rendering */}
            {useGoogleDropAddress ? (
              <GooglePlacesAutocomplete
                onPlaceSelected={(place) => {
                  setValue("drop_address", place.formatted_address || "");
                }}
                placeholder="Search drop address..."
                className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
              />
            ) : (
              <>
                <input
                  autoComplete="off"
                  type="text"
                  {...register("drop_address")}
                  placeholder="Enter Drop Address"
                  onChange={(e) => {
                    setValue("drop_address", e.target.value);
                    if (e.target.value.trim().length > 0) {
                      setDropdownOpen(3.5);
                    } else {
                      setDropdownOpen(null);
                    }
                  }}
                  className="border rounded-md border-gray-400 px-2 py-1 outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
                />

                {dropaddress?.length > 0 && dropDownOpen == 3.5 && (
                  <div
                    className="absolute z-10 mt-13 min-w-60 max-h-40 w-fit overflow-y-auto rounded-md border border-gray-300 bg-white text-sm shadow-lg"
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    {dropaddress.map((item: any) => (
                      <div
                        key={item?.id}
                        className="cursor-pointer px-3 py-1 hover:bg-gray-100 font-sm"
                        onClick={() => {
                          setValue("drop_address", item?.address);
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

            {errors?.drop_address && (
              <p className="text-xs text-red-600">
                {errors?.drop_address?.message}
              </p>
            )}
          </div>

          <div className="city-input flex flex-col px-2 lg:pr-3 py-1 dark:text-black ">
            <label htmlFor="nationality" className=" text-[12px]">
              Nationality <span className="text-red-500">*</span>
            </label>
            <input
              autoComplete="off"
              type="text"
              {...register("nationality")}
              placeholder="Enter Nationality"
              className="border rounded-md border-gray-400 px-2 py-1  outline-none text-[10px] focus:outline-none focus:ring-2 focus:ring-[#9d7a20] focus:border-[#9d7a20] sm:text-[12px] dark:text-black"
            />
            {errors?.nationality && (
              <p className="text-xs text-red-600">
                {errors?.nationality?.message}
              </p>
            )}
            {national?.length > 0 && dropDownOpen == 3 && (
              <div
                className="absolute z-10 mt-12 max-w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white font-sm shadow-lg"
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

export default OutstationFormInput;
