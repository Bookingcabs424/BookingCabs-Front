"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import VehicleTypeCard from "./VehicleTypeCard";
import { useEffect } from "react";
import { useGetAllVehicleType } from "@/hooks/useCommon";

export default function TypesOfVehicles() {
  const { data: vehicleTypes, refetch: refetchVehicleTypes } =
    useGetAllVehicleType();

  useEffect(() => {
    refetchVehicleTypes();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold sm:text-2xl dark:text-black">
        Types of Vehicles
      </h1>
      <div className="relative my-3 pb-9">
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={6}
          spaceBetween={5}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            0: {
              slidesPerView: 2,
            },
            517: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 6,
            },
          }}
        >
          {/* {vehicleTypes?.map((item: any) => ( */}
          {vehicleTypes &&
            vehicleTypes.map((item: any) => (
              <SwiperSlide key={item?.base_vehicle_id}>
                <VehicleTypeCard data={item} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}
