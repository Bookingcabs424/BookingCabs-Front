"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlignRight } from "lucide-react";
import React, { JSX, useEffect, useState } from "react";
import RentalFormInput from "./RentalFormInput";
import AirportTransferFormInput from "./AirportTransferFormInput";
import OutstationFormInput from "./OutstationFormInput";
import CityTaxiFormInput from "./CityTaxiFormInput";
import PassengerDetails from "./PassengerDetails";
import { useFeatureStore } from "../store/formTypes";

import {
  activeCity,
  useActiveModuleStore,
  useBookingSearchForm,
  useDistanceStorage,
} from "../store/common";
import {
  getVehiclebySeatingCapicity,
  useFareDetails,
} from "../hooks/useCommon";
import { useRouter } from "next/navigation";
import { useAuth } from "../store/auth";
import LoginPopup from "./LoginPopupModal";
import SightSeeingFormInput from "./SightSeeingFormInput";
export function extractNumberFromString(str: string) {
  const num = parseFloat(str.replace(/[^\d.]/g, ""));
  return isNaN(num) ? 0 : num; // Fallback to 0 if parsing fails
}

export const bookingFormSchema = z
  .object({
    // Rental Field Inputs
    city: z.string().min(1, "City is required."),
    package: z
      .string()
      .transform((val) => (val?.trim() === "" ? undefined : val))
      .optional(),
    pickup_location: z
      .string()
      .transform((val) => (val?.trim() === "" ? undefined : val))
      .optional()
      .nullable(),
    drop_location: z
      .string()
      .transform((val) => (val?.trim() === "" ? undefined : val))
      .optional()
      .nullable(),
    pickup_address: z.string().min(1, "Pickup Address is required."),
    nationality: z.string().min(1, "Nationality is required."),
    from: z.string().min(1, "From is required.").optional(),
    to: z.string().min(1, "To is required.").optional(),
    total_days: z.string().min(1, "Days is required.").optional(),
    pickup_date: z.string().optional(),
    time: z.string().optional(),
    required_date: z.string().min(1, "Date is required").optional(),
    required_time: z.string().min(1, "Time is required").optional(),
master_package_id:z.any().optional(),
    // Airport Transfer Inputs
    airport_or_railway_station: z.string().optional(),
    drop_address: z.string().min(1, "Drop Address is required.").optional(),

    // Outstation Input Fields
    return_date: z.string().min(1, "Return is required").optional(),

    pickup_area: z.string().min(1, "Pickup Area is required").optional(),
    round_from: z.string().min(1, "From is required").optional(),
    round_to: z.string().min(1, "To is required").optional(),
    return_time: z.string().min(1, "Time is required").optional(),

    round_date_1: z.string().min(1, "Date is required"),
    round_date_2: z.string().min(1, "Date is required"),

    // multicity: z
    //   .array(
    //     z.object({
    //       from: z.string().min(1, "From is required."),
    //       to: z.string().min(1, "To is required."),
    //       date: z.string().min(1, "Date is required."),
    //       time: z.string().min(1, "Time is required."),
    //       // nights: z.coerce.number().min(1, "Min. 1 Night"),
    //       drop_address: z.string().min(1,"Drop Address is required"),
    //     })
    //   )
    //   .optional(),

    multicity: z
      .array(
        z.object({
          from: z.string().min(1, "From is required."),
          to: z.string().min(1, "To is required."),
          date: z.string().min(1, "Date is required."),
          time: z.string().min(1, "Time is required."),
          nights: z.coerce.number().min(1, "Min. 1 Night"),
        })
      )
      .optional(),

    tour_type: z.string().min(1, "Tour Type is required"),

    flight_no: z.string().optional(),
    flight_time: z.string().optional(),
    terminal: z.string().optional(),
    coming_from: z.string().optional(),
    coming_to: z.string().optional(),

    adults: z.coerce.number().min(1, "Min. 1 Adult"),
    children: z.coerce.number().optional(),
    small_luggage: z.coerce.number().optional(),
    big_luggage: z.coerce.number().optional(),
    vehicles: z.coerce.number().optional(),
    days: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.multicity && data.multicity.length > 0) {
        return data.multicity.every(
          (entry) =>
            entry.from && entry.to && entry.date && entry.time && entry.nights
        );
      }
      return true;
    },
    {
      message: "All fields are required.",
      path: ["multicity"],
    }
  );

export type bookingFormData = z.infer<typeof bookingFormSchema>;

const BookingForm = () => {
  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<bookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      adults: 1,
      children: 0,
      big_luggage: 0,
      small_luggage: 0,
      vehicles: 1,
    },
  });
  const router = useRouter();
  const { distance } = useDistanceStorage();
  useEffect(() => {
    setValue("pickup_date", new Date().toISOString().split("T")[0]);
    setValue("time", new Date().toLocaleTimeString());
  }, []);
  const { activeModules } = useActiveModuleStore();

  type OutstationType = "roundtrip" | "oneway" | "multicity";
  const [vehicleList, setVehicleList] = useState<any>([]);
  const { form, setFormData } = useBookingSearchForm();
  // States
  // const [selectedFeature, setSelectedFeature] = useState("Rental");
  const { selectedFeature, setSelectedFeature } = useFeatureStore();
  const [activeHamburger, setActiveHamBurger] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [outstation, setOutstation] = useState<OutstationType>("roundtrip");
  useEffect(() => {}, [vehicleList]);
  // Temporary Data
  const tempModules = [
    "Rental",
    "Airport Transfer",
    "Outstation",
    "Oneway",
    "City Taxi",
    "Sight Seeing",
  ];

  const handleHeaderToggle = (feature: string) => {
    setSelectedFeature(feature);

    if (feature === "Oneway") {
      setOutstation("oneway");
    } else if (feature === "Outstation") {
      setOutstation("roundtrip");
    }

    clearErrors([
      "city",
      "package",
      "pickup_location",
      "pickup_address",
      "nationality",
      "adults",
      "airport_or_railway_station",
      "drop_address",
      "to",
      "required_date",
      "required_time",
      "total_days",
      "from",
      "return_date",
      "pickup_area",
      "round_from",
      "round_to",
      "return_time",
    ]);
    setActiveHamBurger(false);
  };

  const { cityData, setCityData } = activeCity();
  const fareMutation = useFareDetails();
  let values = watch();

  const {
    data: seatingData,
    isSuccess,
    refetch,
  } = getVehiclebySeatingCapicity(
    Number(values?.adults) + Number(values?.children)
  );
  useEffect(() => {
    if (seatingData) {
      const vehicleList = seatingData?.data?.responseData?.response?.data
        ?.filter((i: any) => i?.category_id)
        ?.sort(
          (a: any, b: any) => (a?.display_order ?? 0) - (b?.display_order ?? 0)
        )
        ?.map((i: any) => ({
          display_order: i?.display_order,
          category_id: i?.category_id,
          vehicle_type: i?.vehicle_type,
          id: i?.id,
        }));

      setVehicleList(vehicleList);
    }
  }, [isSuccess]);
  useEffect(() => {
    if (Number(values?.adults) + Number(values?.children) > 4) refetch();
    
  }, [values?.adults, values?.children]);

  useEffect(()=>{
    console.log("values--->",values?.master_package_id);
  },[values?.master_package_id])

  const onSubmit = async () => {
    if (!user) {
      // alert(user)
      setShowLogin(true);
      // router.push("/login")
      return;
    }
    let values = watch();
    if (!cityData?.city_id && Number(values?.master_package_id) == 1) {
      alert("Please Select a City");
      return
    }

    // Calculate total days difference (always positive)
    const total_days = (() => {
      const [y1, m1, d1] = values.round_date_1.split('-').map(Number);
      const [y2, m2, d2] = values.round_date_2.split('-').map(Number);

      const date1 = Date.UTC(y1, m1 - 1, d1);
      const date2 = Date.UTC(y2, m2 - 1, d2);

      const diff = Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
      return diff + 1; // inclusive days
    })();


    let finalValues = {
      ...cityData,
      ...values,
      company_id: 1,
      user_id: user?.id,
      user_grade: 5,
      user_type: 2,
      company_gstno: "07AAACR0769G2ZE",
      master_booking_type_id: "Transport",
      parent_id: 0,
      vehicle_type: "2",
      total_days,
      end_date: values.round_date_2,
      pickup_time: values?.time,
      local_package_id: values?.package,
      no_of_vehicles: values?.vehicles,
      seating_capacity: Number(values?.adults) + Number(values?.children),
      page: 0,
      vehicle_type_list: vehicleList,
      distance:
        distance?.distance && extractNumberFromString(distance.distance),
      duration: distance?.duration,
    };


    console.log({ finalValues });
    // return;

    fareMutation.mutate(finalValues, {
      onSuccess: (data) => {
        // setVehicleList([...vehicleList, data.responseData.response.data.vehicleTypeobj['2']])
      },
      onError: (error) => {
        console.error("Error:", error);
      },
    });
    // console.log({ finalValues });

    setFormData(finalValues);
    router.push("/vehicles");

    // if (selectedFeature === "Rental") {
    //   router.push("/local-vehicles-list");
    // } else {
    //   router.push("/vehicles");
    // }

    // Add your form submission logic here, for example:
    try {
      // const response = await axios.post('/api/bookings', data);
      // Handle successful submission
    } catch (error) {
      console.error({ error });
      // Handle error
    }
  };

  const { user } = useAuth();
  const featureComponents: { [key: string]: JSX.Element } = {
    Rental: (
      <RentalFormInput
        register={register}
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />
    ),
    "Airport Transfer": (
      <AirportTransferFormInput
        register={register}
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />
    ),
    Outstation: (
      <OutstationFormInput
        register={register}
        control={control}
        errors={errors}
        outstation={outstation}
        setOutstation={setOutstation}
        watch={watch}
        setValue={setValue}
      />
    ),
    Oneway: (
      <OutstationFormInput
        register={register}
        control={control}
        errors={errors}
        outstation={outstation}
        setOutstation={setOutstation}
        watch={watch}
        setValue={setValue}
      />
    ),
    "City Taxi": (
      <CityTaxiFormInput
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        control={control}
      />
    ),
    "Sight Seeing": (
      <SightSeeingFormInput
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        control={control}
      />
    ),
  };

  return (
    <>
      <div className="relative -mt-50 sm:-mt-70 md:-mt-88 mx-auto z-20 w-[75%] h-fit pb-3 shadow-xl rounded-md mb-10 bg-white flex flex-col w-[95%] sm:mb-15 md:w-[75%] xl:w-[60%] ">
        {/* Header Navigation of Form */}
        <div className="px-6 py-4 flex items-center justify-center w-full lg:px-0 ">
          <ul className="hidden lg:flex items-center justify-evenly bg-[#dfad0a] w-[93%] py-1 rounded-md lg:w-[80%] text-[14px]">
            {(activeModules.length > 0 ? activeModules : tempModules).map(
              (feature) => (
                <button
                  onClick={() => handleHeaderToggle(feature)}
                  className={`text-[12px] px-4 py-[3px] rounded-md cursor-pointer whitespace-nowrap ${
                    selectedFeature === feature && "bg-[#f6dfb7]"
                  }`}
                  key={feature}
                >
                  {feature}
                </button>
              )
            )}
          </ul>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-inputs w-full px-3 sm:px-0">
            {featureComponents[selectedFeature] || null}

            {/* Select Adults,Children.... */}
            <PassengerDetails register={register} errors={errors} />
            {/* Search Button */}
            <button
              type="submit"
              onClick={() => onSubmit()}
              className="submit-btn flex items-center justify-center w-full sm:px-6 py-4"
            >
              <span className="w-[60%] h-full py-2 rounded-md bg-[#dfad0a] text-sm font-[600] cursor-pointer hover:bg-[#9d7a20] transition sm:text-md">
                Search
              </span>
            </button>
          </div>
        </form>
      </div>

      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
    </>
  );
};

export default BookingForm;
