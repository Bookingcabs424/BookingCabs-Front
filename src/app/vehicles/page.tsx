"use client";
import {
  bookingFormData,
  bookingFormSchema,
} from "../../components/BookingForm";

import {
  Settings2,
  Star,
  X,
  ReceiptText,
  ListFilter,
  CloudCog,
} from "lucide-react";
import { useState, useRef, useEffect, Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PassengerDetails from "../../components/PassengerDetails";
import PaymentDetails from "../../components/PaymentDetails";
import CarDetailCard from "../../components/CarDetailCard";
import { useBookingSearchForm, useSelectedVehicle } from "../../store/common";
import {
  getVehiclebySeatingCapicity,
  useFareDetails,
  useLocalPackages,
} from "../../hooks/useCommon";
import { useRouter } from "next/navigation";

const VehiclesListPage = () => {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<bookingFormData>({
    resolver: zodResolver(bookingFormSchema),
  });
const lastFormRef = useRef(null);

  const isFirstRender = useRef(true);
  const [openVehicleForm, setOpenVehicleForm] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [openFilterPanel, setOpenFilterPanel] = useState<boolean>(false);
  const [openPaymentDetails, setOpenPaymentDetails] = useState<boolean>(false);
  const [vehicleList, setVehicleList] = useState<any>([]);
  const [filteredVehicle, setFilteredVehicle] = useState<any>([]);
  const [FilterList, setFilterList] = useState<any>([]);
  const [activeFilters, setActiveFilters] = useState<any>({});

  const [selectedCard, setSelectedCard] = useState<string>("");

  const [selected, setSelected] = useState<any>();
  const { form, setFormData } = useBookingSearchForm();
  const { booking, setBooking } = useSelectedVehicle();
  const fareMutation = useFareDetails();
  const router = useRouter();
  useEffect(() => {
    if (activeFilters) {
      const filtered = vehicleList.filter((item: any) =>
        Object.entries(activeFilters).every(
          ([key, value]) => item[key] === value
        )
      );
      setFilteredVehicle(filtered);
    }
  }, [activeFilters]);

  useEffect(() => {
    if (filteredVehicle.length > 0) {
      setLoading(false);
    }
  }, [filteredVehicle]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (selected) {
      setOpenPaymentDetails(true);
    }
  }, [selected]);

  const fetchVehicleData = async () => {
  try {
    const sortedVehicleTypes = [...form?.vehicle_type_list].sort(
      (a, b) => (a?.display_order ?? 0) - (b?.display_order ?? 0)
    );

    function deepMerge(obj1: any, obj2: any) {
      const result = { ...obj1 };

      for (const key in obj2) {
        if (Array.isArray(obj2[key])) {
          result[key] = [...(result[key] || []), ...obj2[key]];
        } else if (
          obj2[key] !== null &&
          typeof obj2[key] === "object" &&
          !Array.isArray(obj2[key])
        ) {
          result[key] = deepMerge(result[key] || {}, obj2[key]);
        } else {
          result[key] = obj2[key];
        }
      }

      return result;
    }

    const results: any[] = [];

    // 🔥 Sequential fetching (ONE BY ONE)
    for (  const i of sortedVehicleTypes) {
      const finalForm = {
        ...form,
        vehicle_type: i?.category_id,
        country_id: 101,
      };

      const res = await fareMutation.mutateAsync(finalForm);
      const vehicles = res.responseData.response.data.billArr || [];
  const filters = res.responseData.response.data.filter || {};

  // merge filter one-by-one
  // setFilterList((prev) => convertFilterArr(deepMerge(prev, filters)));

  // append vehicles one-by-one
  setVehicleList((prev) => [...prev, ...vehicles]);

  // also update filteredVehicle
  setFilteredVehicle((prev) => [...prev, ...vehicles]);
      results.push(res);
      
    }

    // process results same as before
    let allVehicles = results.flatMap(
      (result) => result.responseData.response.data.billArr
    );

    let allFilter = results.flatMap((result) =>
      typeof result.responseData.response.data.filter === "object"
        ? result.responseData.response.data.filter
        : []
    );

    allFilter = allFilter.reduce((acc, item) => deepMerge(acc, item), {});

    allVehicles = allVehicles.filter((item) => item !== undefined);

    setFilterList(convertFilterArr(allFilter));
    // setVehicleList(allVehicles);
    // setFilteredVehicle(allVehicles);

  } catch (error) {}
};



// asdas
  // const fetchVehicleData = async () => {
  //   try {
  //     const sortedVehicleTypes = [...form?.vehicle_type_list].sort(
  //       (a, b) => (a?.display_order ?? 0) - (b?.display_order ?? 0)
  //     );
  //     // .slice(0, 5);

  //     function deepMerge(obj1: any, obj2: any) {
  //       const result = { ...obj1 };

  //       for (const key in obj2) {
  //         if (Array.isArray(obj2[key])) {
  //           result[key] = [...(result[key] || []), ...obj2[key]];
  //         } else if (
  //           obj2[key] !== null &&
  //           typeof obj2[key] === "object" &&
  //           !Array.isArray(obj2[key])
  //         ) {
  //           result[key] = deepMerge(result[key] || {}, obj2[key]);
  //         } else {
  //           result[key] = obj2[key]; // overwrite if primitive
  //         }
  //       }

  //       return result;
  //     }

  //     const promises = sortedVehicleTypes.map((i) => {
  //       // const finalForm = { ...form, vehicle_type: 2,country_id:101};

  //       const finalForm = {
  //         ...form,
  //         vehicle_type: i?.category_id,
  //         country_id: 101,
  //       };
  //       return fareMutation.mutateAsync(finalForm);
  //     });

  //     const results = await Promise.all(promises);
  //     let allVehicles = results.flatMap(
  //       (result) => result.responseData.response.data.billArr
  //     );
  //     let allFilter = results.flatMap((result) =>
  //       typeof result.responseData.response.data.filter == "object"
  //         ? result.responseData.response.data.filter
  //         : []
  //     );
  //     allFilter = allFilter.reduce((acc, item) => deepMerge(acc, item), {});

  //     allVehicles = allVehicles.filter((item) => item !== undefined);

  //     setFilterList(convertFilterArr(allFilter));
  //     setVehicleList(allVehicles);
  //     setFilteredVehicle(allVehicles);
  //   } catch (error) {}
  // };
  const convertFilterArr = (combinedFilter: any) => {
    const mappedFilter = {
      vehicleTypes: Object.keys(combinedFilter.vehicle_type).map((type) => ({
        name: type,
        count: combinedFilter.vehicle_type[type],
      })),

      vehicle_model: Object.keys(combinedFilter.vehicle_model).map(
        (models) => ({
          name: models,
          // .split(',').map(m => m.trim()),
          count: combinedFilter.vehicle_model[models],
        })
      ),

      colors: Object.keys(combinedFilter.vehicle_color).map((color) => ({
        name: color,
        count: combinedFilter.vehicle_color[color],
      })),

      ratings: Object.keys(combinedFilter.rating_filter).map((rating) => ({
        stars: parseInt(rating),
        count: combinedFilter.rating_filter[rating],
      })),

      amenities: Object.keys(combinedFilter.amenities_filter).map(
        (amenity) => ({
          name: amenity,
          count: combinedFilter.amenities_filter[amenity],
        })
      ),

      fuelTypes: Object.keys(combinedFilter.fuel_type).map((fuel) => ({
        name: fuel === "undefined" ? "Not specified" : fuel,
        count: combinedFilter.fuel_type[fuel],
      })),
      seating_capacity: Object.keys(combinedFilter.seating_capacity).map(
        (seating) => ({
          name: seating === "undefined" ? "Not specified" : seating,
          count: combinedFilter.seating_capacity[seating],
        })
      ),
      vendor_detail: Object.keys(combinedFilter.vendor_detail).map(
        (vendor) => ({
          name: combinedFilter.vendor_detail[vendor]["name"],
          count: combinedFilter.vendor_detail[vendor]["count"],
          id: combinedFilter.vendor_detail[vendor]["id"],
        })
      ),
      labels: {
        vehicleType: combinedFilter.vehicle_type_label,
        vehicleModel: combinedFilter.vehicle_model_label,
        vehicleColor: combinedFilter.vehicle_color_label,
        amenities: combinedFilter.amenities_label,
        fuelType: combinedFilter.fuel_label,
        cancellationPolicy: combinedFilter.cancellation_policy_label,
        rating: combinedFilter.rating_label,
        seatingCapacity: combinedFilter.seating_capacity_label,
        suppliers: combinedFilter.supplier_label,
      },
    };
    return mappedFilter;
  };
  useEffect(() => {
    setTimeout(() => {
      //   if (!form) {
      //   router.push("/");
      //   return;
      // }
    }, 1000);
  const isSameForm = JSON.stringify(lastFormRef.current) === JSON.stringify(form);

  if (isSameForm) return; // same form → block duplicate dev call

  // 2️⃣ Update last form reference
  lastFormRef.current = form;

setVehicleList([]);
setFilteredVehicle([]);

    fetchVehicleData();
  }, [form, router]);
  useEffect(() => {}, [FilterList]);
  useEffect(() => {
    if (vehicleList) {
    }
  }, [vehicleList]);
  const filterRef = useRef<HTMLDivElement>(null);

  const filters = [
    {
      title: "vendor_detail",
      options: ["Any", "Neeraj Rustagi", "Sanjay Kumar Verma"],
    },
    {
      title: "fuelTypes",
      options: ["Any", "Petrol", "CNG", "Diesel"],
    },
    {
      title: "ratings",
      options: [1, 2, 3, 4, 5],
    },
    {
      title: "vehicleTypes",
      options: [
        "Any",
        "Hatch Back",
        "Comfort Sedan",
        "Prime Compact",
        "Prime",
        "Prime Plus",
        "Premium Sedan",
        "Luxury Sedan",
        "Luxury Sedan II",
        "Luxury Van",
        "Luxury Van Plus",
      ],
    },
    {
      title: "Vehicle Model",
      options: ["Any", "2019", "2017", "2023", "2025", "2024", "2022", "2021"],
    },
    {
      title: "colors",
      options: ["Any", "White", "Gray", "Black"],
    },
    {
      title: "Amenities",
      options: [
        "Any",
        "Air Conditioning",
        "Automatic Transmission",
        "Automatic Cooling",
        "Carrier",
      ],
    },
    {
      title: "seating_capacity",
      options: ["Any", "4", "7", "6", "12", "30", "9", "16"],
    },
    // {
    //   title: "Interior Wise",
    //   options: ["Any", "4", "7", "6", "12", "30", "9", "16"],
    // },
    // {
    //   title: "Seating Comfort",
    //   options: ["Any", "4", "7", "6", "12", "30", "9", "16"],
    // },
  ];

  const [expandFilters, setExpandFilters] = useState<Record<string, boolean>>(
    () =>
      filters.reduce((acc, filter) => {
        acc[filter.title] = true;
        return acc;
      }, {} as Record<string, boolean>)
  );
  const toggleFilter = (title: string) => {
    setExpandFilters((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const onSubmit = async (data: bookingFormData) => {
    const formattedData = data;
  };
  useEffect(() => {}, [selected]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setOpenFilterPanel(false);
      }
    };

    if (openFilterPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openFilterPanel, setOpenFilterPanel]);

  const handleFormExpand = () => {
    setOpenVehicleForm(!openVehicleForm);
    clearErrors([
      "city",
      "package",
      "pickup_location",
      "pickup_address",
      "nationality",
      "adults",
    ]);
  };
  const { data: packages } = useLocalPackages({city:form?.city});
  useEffect(() => {}, [packages]);

  const handleCheckboxChange = (e: any, field: any, value: any) => {
    const isChecked = e.target.checked;
    setActiveFilters((prev: any) => {
      const updatedFilters = { ...prev };
      if (isChecked) {
        updatedFilters[field] = value;
      } else {
        delete updatedFilters[field];
      }
      return updatedFilters;
    });
  };

  const onSelectPackage = (item: string) => {
    setSelectedPackages((prev) =>
      prev.includes(item) ? prev.filter((pkg) => pkg !== item) : [...prev, item]
    );
  };
  useEffect(() => {
console.log({form})
  }, [form]);  
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex items-center justify-center">
          <div className="py-6 relative w-[85%] lg:w-[85%] flex flex-col items-center justify-center">
            {/* Form */}
            <div className="mt-6 px-5 vehicle-list-details py-4 shadow-md rounded-md">
              <div className="grid grid-cols-2 sm:grid-cols-2 items-start mx-auto place-items-center md:grid-cols-5 gap-5 xl:grid-cols-10">
                {form?.master_package_id == 3 && (
                  <div className="package flex flex-col lg:gap-3 text-center">
                    <p className="font-[600] text-[#9d7a20] sm:text-[12px]">
                      Flight/Train No:
                    </p>
                    <p className="text-[12px]">{form?.local_pkg_name}</p>
                  </div>
                )}
                {form?.package && (
                  <div className="package flex flex-col lg:gap-3 text-center">
                    <p className="font-[600] text-[#9d7a20] sm:text-[12px]">
                      Package
                    </p>
                    <p className="text-[12px]">{form?.local_pkg_name}</p>
                  </div>
                )}

                {form?.master_package_id == 4 && (
                  <>
                    <div className="package flex flex-col lg:gap-3 text-center">
                      <p className="font-[600] text-[#9d7a20] sm:text-[12px]">
                        From
                      </p>
                      <p className="text-[12px]">
                        {form?.cityList[0]?.pickup_city}
                      </p>
                    </div>

                    <div className="package flex flex-col lg:gap-3 text-center">
                      <p className="font-[600] text-[#9d7a20] sm:text-[12px]">
                        To
                      </p>
                      <p className="text-[12px]">
                        {form?.cityList[0]?.drop_city}
                      </p>
                    </div>

                    <div className="package flex flex-col lg:gap-3 text-center">
                      <p className="font-[600] text-[#9d7a20] sm:text-[12px]">
                        Date
                      </p>
                      <p className="text-[12px]">{form?.round_date_1}</p>
                      <p className="text-[12px]">{booking?.end_date}</p>
                      
                    </div>
                  </>
                )}
                {form?.master_package_id != 4 && form?.pickup_location && (
                  <div className="pickup-area flex flex-col lg:gap-3 text-center col-span-1 md:col-span-2">
                    <p className="font-[600] text-[#9d7a20] text-[12px]">
                      Pickup Area
                    </p>
                    <p className="text-[12px]">{form?.pickup_location}</p>
                  </div>
                )}
                {/* {form?.pickup_address !== "" ? ( */}
                <div className="pickup-address flex flex-col lg:gap-3 text-center col-span-1 md:col-span-2">
                  <p className="font-[600] text-[#9d7a20] text-[12px]">
                    Pickup Address
                  </p>
                  <p className="text-[12px]">{form?.pickup_address}</p>
                </div>
                {/* ) : ( */}

                {form?.master_package_id == 2 && (
                  <div className="pickup-address flex flex-col lg:gap-3 text-center col-span-1 md:col-span-2">
                    <p className="font-[600] text-[#9d7a20] text-[12px]">
                      Drop Area
                    </p>
                    <p className="text-[12px]">{form?.drop_address}</p>
                  </div>
                )}
                {form?.master_package_id == 4 && (
                  <div className="pickup-address flex flex-col lg:gap-3 text-center col-span-1 md:col-span-2">
                    <p className="font-[600] text-[#9d7a20] text-[12px]">
                      Drop Address
                    </p>
                    <p className="text-[12px]">{form?.drop_address}</p>
                  </div>
                )}
                {/* )} */}

                {form?.master_package_id != 1 &&
                  form?.master_package_id != 4 &&
                  form?.cityList?.length > 0 && (
                    <div className="pickup-address flex flex-col lg:gap-3 text-center col-span-1 md:col-span-2">
                      <p className="font-[600] text-[#9d7a20] text-[12px]">
                        Pickup City
                      </p>
                      <p className="text-[12px]">
                        {form?.cityList[0]?.pickup_city}
                      </p>
                    </div>
                  )}
                {form?.master_package_id != 1 &&
                  form?.master_package_id != 4 &&
                  form?.cityList?.length > 0 && (
                    <div className="pickup-address flex flex-col lg:gap-3 text-center col-span-1 md:col-span-2">
                      <p className="font-[600] text-[#9d7a20] text-[12px]">
                        Drop City
                      </p>
                      <p className="text-[12px]">
                        {
                          form?.cityList[form?.cityList?.length - 1]
                            ?.pickup_city
                        }
                      </p>
                    </div>
                  )}
                {form?.master_package_id != 4 && (
                  <div className="date flex flex-col lg:gap-3 text-center">
                    <p className="font-[600] text-[#9d7a20] text-[12px]">
                      Date
                    </p>
                    <p className="text-[12px]">{form?.from}{form?.to&&"-"} {form?.to} {form?.from?"":form?.pickup_date}</p>

                  </div>
                )}
                <div className="time flex flex-col lg:gap-3 text-center">
                  <p className="font-[600] text-[#9d7a20] text-[12px]">Time</p>
                  <p className="text-[12px]"> {form?.pickup_time}</p>
                </div>
                <div className="adults-children flex flex-col text-center gap-2 w-[max-content]">
                  <div className="flex gap-3">
                    <span className="text-[12px] font-[600] text-[#9d7a20] flex">
                      Adults:{" "}
                    </span>
                    <span className="text-[12px]">{form?.adults}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[12px] font-[600] text-[#9d7a20] flex">
                      Children:{" "}
                    </span>
                    <span className="text-[12px]">{form?.children}</span>
                  </div>
                </div>
                <div className="luggage flex flex-col text-center gap-2 w-[max-content]">
                  <div className="flex gap-3">
                    <span className="text-[12px] font-[600] text-[#9d7a20] flex">
                      Small Luggage:{" "}
                    </span>
                    <span className="text-[12px]">{form?.small_luggage}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[12px] font-[600] text-[#9d7a20] flex">
                      Big Luggage:{" "}
                    </span>
                    <span className="text-[12px]">{form?.big_luggage}</span>
                  </div>
                </div>
                <div className="luggage flex flex-col text-center gap-2 w-[max-content]">
                  <div className="flex gap-3">
                    <span className="text-[12px] font-[600] text-[#9d7a20] flex">
                      Vehicles:{" "}
                    </span>
                    <span className="text-[12px]">{form?.no_of_vehicles}</span>
                  </div>
                </div>
                {/* <button className="flex justify-center p-2" title="Modify Search">
                <Settings2
                  className="cursor-pointer"
                  onClick={handleFormExpand}
                />
              </button> */}
              </div>
              {/* {openVehicleForm && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="py-5 px-0 col-span-full sm:px-6">
                  <hr className="border border-gray-300 mb-6" />
                  <RentalFormInput register={register} errors={errors} />
                  <PassengerDetails register={register} errors={errors} />
                </div>
                <div className="submit-btn px-6 py-4 flex items-center justify-center w-full">
                  <button
                    type="submit"
                    className="w-[50%] h-full py-2 rounded-md bg-[#dfad0a] font-[600] cursor-pointer hover:bg-[#9d7a20] transition text-md sm:text-lg w-[60%]"
                  >
                    Search
                  </button>
                </div>
              </form>
            )} */}
            </div>

            {/* Package Selection Option Filter By Responsive   */}
            <div className="block relative w-full bg-[#dfad0a] py-2 px-4 rounded-md mt-10 flex items-center justify-between xl:justify-end xl:hidden">
              <button
                className="sm:block  bg-white px-5 py-2 rounded-md font-[500] cursor-pointer text-sm"
                onClick={() => setOpenFilterPanel(!openFilterPanel)}
              >
                Filter & Sort
              </button>
              <button
                title="Filter & Sort"
                className="block sm:hidden bg-white p-2 rounded-md font-[500] cursor-pointer text-sm"
                onClick={() => setOpenFilterPanel(!openFilterPanel)}
              >
                <ListFilter className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                {form?.master_package_id == 1 && (
                  <select
                    name=""
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedPackage = packages?.data?.data?.find(
                        (pkg: any) => pkg.id.toString() === selectedId
                      );
                      if (selectedPackage) {
                        setFormData({
                          ...form,
                          package: selectedPackage.id,
                          local_package_id: selectedPackage.id,
                          local_pkg_name: selectedPackage.name,
                        });
                      }
                    }}
                    // onChange={(e)=>setFormData({...form,package:e.target.value,local_package_id:e.target.value})}
                    id=""
                    className="w-[max-content] !bg-white bg-white py-2 float-right        
            cursor-pointer rounded-md px-2 focus:outline-none  text-[12px]"
                  >
                    <option value="Select Package">Select Package</option>
                    {packages?.data?.data?.map((packageItem: any) => (
                      <option value={packageItem?.id} key={packageItem?.id}>
                        {packageItem?.name}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  className="bg-white rounded-full p-2 cursor-pointer block "
                  title="View Payment Details"
                  onClick={() => setOpenPaymentDetails(!openPaymentDetails)}
                >
                  <ReceiptText className="w-5 h-5 cursor-pointer" />
                </button>
              </div>
              {openPaymentDetails && (
                <div className="responsive-payment-div absolute right-[0px]  top-full border border-gray-300 text-sm w-[250px] p-3 shadow-md rounded-md z-50 bg-white">
                  <PaymentDetails selected={selected} />
                </div>
              )}
            </div>

            <div className="listing py-9 grid grid-cols-12 gap-3 w-full">
              {/* Filter By */}
              <div className="filters hidden xl:flex col-span-2 border border-gray-300 p-3 rounded-md sticky top-[10px] h-max self-start flex-col">
                <h1 className="text-[14px] font-[600]">Filter By</h1>
                <div className="search-filter py-4">
                  <input
                    type="text"
                    placeholder="Search Here..."
                    className="rounded-md border border-gray-300 w-full py-2 px-2 outline-none text-[12px]"
                  />
                </div>
                {filters.map((filter) => {
                  const isExpanded = expandFilters[filter.title];

                  return (
                    <div key={filter.title}>
                      <button
                        onClick={() => toggleFilter(filter.title)}
                        className="bg-gray-100 flex items-center justify-between w-full py-2 my-2 px-2 font-[600] rounded-sm cursor-pointer text-[12px]"
                        title={`Search By ${filter.title}`}
                      >
                        {filter.title} <span>{isExpanded ? "-" : "+"}</span>
                      </button>
                      {isExpanded &&
                        filter?.title == "Amenities" &&
                        FilterList?.amenities?.map((option: any) => (
                          <div
                            key={option?.name}
                            className="flex gap-3 py-1 items-center text-gray-600 text-[12px]"
                          >
                            <input
                              type="checkbox"
                              name={String(option?.name)}
                              id={String(option?.name)}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  e,
                                  "amenities_name",
                                  option?.name
                                )
                              }
                              checked={
                                activeFilters?.amenities_name == option?.name
                              }
                              className="w-4 h-4 outline-none"
                            />
                            <label
                              htmlFor={String(option?.name)}
                              className="text-[12px] cursor-pointer select-none flex items-center gap-1"
                            >
                              {filter.title === "Rating" &&
                              typeof option === "number" ? (
                                [...Array(option)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-5 h-5 text-yellow-500 fill-yellow-500"
                                  />
                                ))
                              ) : (
                                <span className="text-[12px]">
                                  {option?.name}
                                </span>
                              )}
                            </label>
                          </div>
                        ))}
                      {/* Colors */}
                      {isExpanded &&
                        filter?.title == "colors" &&
                        FilterList?.colors?.map((option: any) => (
                          <div
                            key={option?.name}
                            className="flex gap-3 py-1 items-center text-gray-600"
                          >
                            <input
                              type="checkbox"
                              onChange={(e) =>
                                handleCheckboxChange(
                                  e,
                                  "vehicle_color",
                                  option?.name
                                )
                              }
                              checked={
                                activeFilters?.vehicle_color == option?.name
                              }
                              name={String(option?.name)}
                              id={String(option?.name)}
                              className="w-4 h-4 outline-none"
                            />
                            <label
                              htmlFor={String(option?.name)}
                              className="text-[12px] cursor-pointer select-none flex items-center gap-1"
                            >
                              {option?.name}
                            </label>
                          </div>
                        ))}
                      {/* Vehicle Type */}
                      {isExpanded &&
                        filter?.title == "vehicleTypes" &&
                        FilterList?.vehicleTypes?.map((option: any) => (
                          <div
                            key={option?.name}
                            className="flex gap-3 py-1 items-center text-gray-600"
                          >
                            <input
                              type="checkbox"
                              name={String(option?.name)}
                              id={String(option?.name)}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  e,
                                  "vehicle_type",
                                  option?.name
                                )
                              }
                              checked={
                                activeFilters?.vehicle_type == option?.name
                              }
                              className="w-4 h-4 outline-none"
                            />
                            <label
                              htmlFor={String(option?.name)}
                              className="text-[12px] cursor-pointer select-none flex items-center gap-1"
                            >
                              {filter.title === "Rating" &&
                              typeof option === "number"
                                ? [...Array(option)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-5 h-5 text-yellow-500 fill-yellow-500"
                                    />
                                  ))
                                : option?.name}
                            </label>
                          </div>
                        ))}
                      {/* Ratings */}
                      {isExpanded &&
                        filter?.title == "ratings" &&
                        FilterList?.ratings?.map((option: any) => (
                          <div
                            key={option?.stars}
                            className="flex gap-3 py-1 items-center text-gray-600"
                          >
                            <input
                              onChange={(e) =>
                                handleCheckboxChange(e, "rating", option?.stars)
                              }
                              checked={activeFilters?.rating == option?.stars}
                              type="checkbox"
                              name={String(option?.stars)}
                              id={String(option?.stars)}
                              className="w-4 h-4 outline-none"
                            />
                            <label
                              htmlFor={String(option?.stars)}
                              className="text-[12px] cursor-pointer select-none flex items-center gap-1"
                            >
                              {filter.title === "ratings" &&
                              typeof option.stars === "number"
                                ? [...Array(option.stars)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-5 h-5 text-yellow-500 fill-yellow-500"
                                    />
                                  ))
                                : option?.stars}{" "}
                              ({option.count})
                            </label>
                          </div>
                        ))}
                      {/* Fuel Types */}
                      {isExpanded &&
                        filter?.title == "fuelTypes" &&
                        FilterList?.fuelTypes?.map((option: any) => (
                          <div
                            key={option?.name}
                            className="flex gap-3 py-1 items-center text-gray-600"
                          >
                            <input
                              type="checkbox"
                              onChange={(e) =>
                                handleCheckboxChange(
                                  e,
                                  "ignition_type_id",
                                  option?.name
                                )
                              }
                              checked={
                                activeFilters?.ignition_type_id == option?.name
                              }
                              name={String(option?.name)}
                              id={String(option?.name)}
                              className="w-4 h-4 outline-none"
                              // onChange={()=>{setActiveFilters({...activeFilters,ignition_type_id:option?.name})}}
                            />
                            <label
                              htmlFor={String(option?.name)}
                              className="text-[12px] cursor-pointer select-none flex items-center gap-1"
                            >
                              {option?.name}
                            </label>
                          </div>
                        ))}

                      {/* Seating Capacity */}
                      {isExpanded &&
                        filter?.title == "seating_capacity" &&
                        FilterList?.seating_capacity?.map((option: any) => (
                          <div
                            key={option?.name}
                            className="flex gap-3 py-1 items-center text-gray-600"
                          >
                            <input
                              type="checkbox"
                              name={String(option?.name)}
                              id={String(option?.name)}
                              className="w-4 h-4 outline-none"
                              onChange={(e) =>
                                handleCheckboxChange(
                                  e,
                                  "seating_capacity",
                                  option?.name
                                )
                              }
                              checked={
                                activeFilters?.seating_capacity == option?.name
                              }
                            />
                            <label
                              htmlFor={String(option?.name)}
                              className="text-[12px] cursor-pointer select-none flex items-center gap-1"
                            >
                              {option?.name}
                            </label>
                          </div>
                        ))}
                      {/* Vendor Details */}
                      {isExpanded &&
                        filter?.title == "vendor_detail" &&
                        FilterList?.vendor_detail?.map((option: any) => (
                          <div
                            key={option?.name}
                            className="flex gap-3 py-1 items-center text-gray-600"
                          >
                            <input
                              type="checkbox"
                              onChange={(e) =>
                                handleCheckboxChange(
                                  e,
                                  "vendor_name",
                                  option?.name
                                )
                              }
                              checked={
                                activeFilters?.vendor_name == option?.name
                              }
                              // onChange={()=>{setActiveFilters({...activeFilters,vendor_name:option?.name})}}
                              name={String(option?.name)}
                              id={String(option?.name)}
                              className="w-4 h-4 outline-none"
                            />
                            <label
                              htmlFor={String(option?.name)}
                              className="text-[12px] cursor-pointer select-none flex items-center gap-1"
                            >
                              {option?.name}
                            </label>
                          </div>
                        ))}

                      {/* Vehicle Model */}
                      {isExpanded &&
                        filter?.title == "Vehicle Model" &&
                        FilterList?.vehicle_model?.map((option: any) => (
                          <div
                            key={option?.name}
                            className="flex gap-3 py-1 items-center text-gray-600"
                          >
                            <input
                              type="checkbox"
                              onChange={(e) =>
                                handleCheckboxChange(
                                  e,
                                  "vehicle_model",
                                  option?.name
                                )
                              }
                              checked={
                                activeFilters?.vehicle_model == option?.name
                              }
                              // onChange={()=>{setActiveFilters({...activeFilters,vendor_name:option?.name})}}
                              name={String(option?.name)}
                              id={String(option?.name)}
                              className="w-4 h-4 outline-none"
                            />
                            <label
                              htmlFor={String(option?.name)}
                              className="text-sm cursor-pointer select-none flex items-center gap-1"
                            >
                              {option?.name}
                            </label>
                          </div>
                        ))}
                    </div>
                  );
                })}
              </div>

              {/* Car Listing */}
              <div className="vehicles-list w-full col-span-12 lg:col-span-9 xl:col-span-8">
                {/* Package Listing */}
                {booking?.master_package_id !== 3 &&
                  packages?.data?.data?.length > 0 && (
                    <div className="package-list items-center gap-1.5 hidden md:flex md:my-3 max-w-[100%] overflow-auto">
                      {packages?.data?.data?.map(({ name, local_pkg_id }: any) => {
                        // const isSelected = form?.package ==id;
                        return (
                          <button
                            key={local_pkg_id}
                            onClick={(e) => {
                              const selectedId = local_pkg_id;
                              const selectedPackage = packages?.data?.data?.find(
                                  (pkg: any) => pkg.local_pkg_id == selectedId
                                );
                              if (selectedPackage) {
                                setFilteredVehicle([]);
                                setVehicleList([]);
                                setFormData({
                                  ...form,
                                  package: selectedPackage.local_pkg_id,
                                  local_package_id: selectedPackage.local_pkg_id,
                                  local_pkg_name: selectedPackage.name,
                                });
                              }
                            }}
                            className={`package border border-[#dfad0a] text-center rounded-full text-[9px] px-3 py-1  cursor-pointer  min-w-25 ${
                              Number(form?.package) == Number(local_pkg_id) && "bg-[#dfad0a] font-[500]"
                            }`}
                          >
                            {name} 
                          </button>
                        );
                      })}
                    </div>
                  )}
                <div className="cars-list w-full flex flex-col gap-2 items-center justify-center">
                  {loading ? (
                    <div className="w-full text-2xl flex justify-center py-10">
                      Loading...
                    </div>
                  ) : (
                    filteredVehicle.map((item: any, index: number) => (
                      <CarDetailCard
                        selected={selected}
                        setSelected={setSelected}
                        key={index}
                        item={item}
                      />
                    ))
                  )}
                </div>
              </div>
              {/* Payment Details */}
              <div className="payment hidden col-span-2 lg:block col-span-3 xl:col-span-2 px-3 rounded-md max-h-[max-content] lg:sticky top-[10px]">
                <PaymentDetails selected={selected} />
              </div>
            </div>

            {/* Pagination */}
            {/* <div className="pagination absolute bottom-[-20px] left-1/2 -translate-x-1/2 flex items-center  bg-white px-4 py-4 gap-3 sm:gap-5">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setPageNo(page)}
                className={`px-3 py-1 text-md rounded-full border cursor-pointer ${
                  page === pageNo
                    ? "bg-[#9d7a20] text-white border-[#9d7a20] font-bold"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div> */}
          </div>
        </div>
        {/* Responsive Filter */}
        <div
          ref={filterRef}
          className={`fixed overflow-y-scroll top-0 left-0 bg-gray-50 h-full w-[250px] z-50 border-r border-gray-200 transition-transform duration-300 ease-in-out shadow-xl ${
            openFilterPanel ? "translate-x-0" : "-translate-x-full"
          } sm:w-[300px]`}
        >
          <div className="top-navbar w-full flex flex-col items-center px-6 py-4">
            <div className="flex w-full items-center justify-between">
              <h1 className="text-[14px] font-semibold">Filter By</h1>
              <button
                onClick={() => setOpenFilterPanel(false)}
                title="Close Filter"
              >
                <X className="w-6 h-6 cursor-pointer" />
              </button>
            </div>
          </div>
          <div className="border-b border-gray-300 mb-6" />
          <div className="px-5">
            {filters.map((filter) => {
              const isExpanded = expandFilters[filter.title];

              return (
                <div key={filter.title}>
                  <button
                    onClick={() => toggleFilter(filter.title)}
                    className="bg-gray-100 flex items-center justify-between w-full py-2 my-2 px-2 font-[600] rounded-sm cursor-pointer text-[12px]"
                    title={`Search By ${filter.title}`}
                  >
                    {filter.title} <span>{isExpanded ? "-" : "+"}</span>
                  </button>
                  {isExpanded &&
                    filter?.title == "Amenities" &&
                    FilterList?.amenities?.map((option: any) => (
                      <div
                        key={option?.name}
                        className="flex gap-3 py-1 items-center text-gray-600 text-[12px]"
                      >
                        <input
                          type="checkbox"
                          name={String(option?.name)}
                          id={String(option?.name)}
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              "amenities_name",
                              option?.name
                            )
                          }
                          checked={
                            activeFilters?.amenities_name == option?.name
                          }
                          className="w-4 h-4 outline-none"
                        />
                        <label
                          htmlFor={String(option?.name)}
                          className="text-[12px] cursor-pointer select-none flex items-center gap-1"
                        >
                          {filter.title === "Rating" &&
                          typeof option === "number" ? (
                            [...Array(option)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 text-yellow-500 fill-yellow-500"
                              />
                            ))
                          ) : (
                            <span className="text-[12px]">{option?.name}</span>
                          )}
                        </label>
                      </div>
                    ))}
                  {/* Colors */}
                  {isExpanded &&
                    filter?.title == "colors" &&
                    FilterList?.colors?.map((option: any) => (
                      <div
                        key={option?.name}
                        className="flex gap-3 py-1 items-center text-gray-600"
                      >
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              "vehicle_color",
                              option?.name
                            )
                          }
                          checked={activeFilters?.vehicle_color == option?.name}
                          name={String(option?.name)}
                          id={String(option?.name)}
                          className="w-4 h-4 outline-none"
                        />
                        <label
                          htmlFor={String(option?.name)}
                          className="text-[12px] cursor-pointer select-none flex items-center gap-1"
                        >
                          {option?.name}
                        </label>
                      </div>
                    ))}
                  {/* Vehicle Type */}
                  {isExpanded &&
                    filter?.title == "vehicleTypes" &&
                    FilterList?.vehicleTypes?.map((option: any) => (
                      <div
                        key={option?.name}
                        className="flex gap-3 py-1 items-center text-gray-600"
                      >
                        <input
                          type="checkbox"
                          name={String(option?.name)}
                          id={String(option?.name)}
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              "vehicle_type",
                              option?.name
                            )
                          }
                          checked={activeFilters?.vehicle_type == option?.name}
                          className="w-4 h-4 outline-none"
                        />
                        <label
                          htmlFor={String(option?.name)}
                          className="text-[12px] cursor-pointer select-none flex items-center gap-1"
                        >
                          {filter.title === "Rating" &&
                          typeof option === "number"
                            ? [...Array(option)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-5 h-5 text-yellow-500 fill-yellow-500"
                                />
                              ))
                            : option?.name}
                        </label>
                      </div>
                    ))}
                  {/* Ratings */}
                  {isExpanded &&
                    filter?.title == "ratings" &&
                    FilterList?.ratings?.map((option: any) => (
                      <div
                        key={option?.stars}
                        className="flex gap-3 py-1 items-center text-gray-600"
                      >
                        <input
                          onChange={(e) =>
                            handleCheckboxChange(e, "rating", option?.stars)
                          }
                          checked={activeFilters?.rating == option?.stars}
                          type="checkbox"
                          name={String(option?.stars)}
                          id={String(option?.stars)}
                          className="w-4 h-4 outline-none"
                        />
                        <label
                          htmlFor={String(option?.stars)}
                          className="text-[12px] cursor-pointer select-none flex items-center gap-1"
                        >
                          {filter.title === "ratings" &&
                          typeof option.stars === "number"
                            ? [...Array(option.stars)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-5 h-5 text-yellow-500 fill-yellow-500"
                                />
                              ))
                            : option?.stars}{" "}
                          ({option.count})
                        </label>
                      </div>
                    ))}
                  {/* Fuel Types */}
                  {isExpanded &&
                    filter?.title == "fuelTypes" &&
                    FilterList?.fuelTypes?.map((option: any) => (
                      <div
                        key={option?.name}
                        className="flex gap-3 py-1 items-center text-gray-600"
                      >
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              "ignition_type_id",
                              option?.name
                            )
                          }
                          checked={
                            activeFilters?.ignition_type_id == option?.name
                          }
                          name={String(option?.name)}
                          id={String(option?.name)}
                          className="w-4 h-4 outline-none"
                          // onChange={()=>{setActiveFilters({...activeFilters,ignition_type_id:option?.name})}}
                        />
                        <label
                          htmlFor={String(option?.name)}
                          className="text-[12px] cursor-pointer select-none flex items-center gap-1"
                        >
                          {option?.name}
                        </label>
                      </div>
                    ))}

                  {/* Seating Capacity */}
                  {isExpanded &&
                    filter?.title == "seating_capacity" &&
                    FilterList?.seating_capacity?.map((option: any) => (
                      <div
                        key={option?.name}
                        className="flex gap-3 py-1 items-center text-gray-600"
                      >
                        <input
                          type="checkbox"
                          name={String(option?.name)}
                          id={String(option?.name)}
                          className="w-4 h-4 outline-none"
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              "seating_capacity",
                              option?.name
                            )
                          }
                          checked={
                            activeFilters?.seating_capacity == option?.name
                          }
                        />
                        <label
                          htmlFor={String(option?.name)}
                          className="text-[12px] cursor-pointer select-none flex items-center gap-1"
                        >
                          {option?.name}
                        </label>
                      </div>
                    ))}
                  {/* Vendor Details */}
                  {isExpanded &&
                    filter?.title == "vendor_detail" &&
                    FilterList?.vendor_detail?.map((option: any) => (
                      <div
                        key={option?.name}
                        className="flex gap-3 py-1 items-center text-gray-600"
                      >
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            handleCheckboxChange(e, "vendor_name", option?.name)
                          }
                          checked={activeFilters?.vendor_name == option?.name}
                          // onChange={()=>{setActiveFilters({...activeFilters,vendor_name:option?.name})}}
                          name={String(option?.name)}
                          id={String(option?.name)}
                          className="w-4 h-4 outline-none"
                        />
                        <label
                          htmlFor={String(option?.name)}
                          className="text-[12px] cursor-pointer select-none flex items-center gap-1"
                        >
                          {option?.name}
                        </label>
                      </div>
                    ))}

                  {/* Vehicle Model */}
                  {isExpanded &&
                    filter?.title == "Vehicle Model" &&
                    FilterList?.vehicle_model?.map((option: any) => (
                      <div
                        key={option?.name}
                        className="flex gap-3 py-1 items-center text-gray-600"
                      >
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              "vehicle_model",
                              option?.name
                            )
                          }
                          checked={activeFilters?.vehicle_model == option?.name}
                          // onChange={()=>{setActiveFilters({...activeFilters,vendor_name:option?.name})}}
                          name={String(option?.name)}
                          id={String(option?.name)}
                          className="w-4 h-4 outline-none"
                        />
                        <label
                          htmlFor={String(option?.name)}
                          className="text-sm cursor-pointer select-none flex items-center gap-1"
                        >
                          {option?.name}
                        </label>
                      </div>
                    ))}
                </div>
              );
            })}
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default VehiclesListPage;
