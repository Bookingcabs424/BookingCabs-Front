"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import TourCard from "./TourCard";

export default function ActiveTourSlider() {
  return (
    <div>
      <h1 className="text-xl font-bold sm:text-2xl mb-4 dark:text-black">Active Tours</h1>
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={6}
        spaceBetween={5}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },

          490: {
            slidesPerView: 2,
          },
          652: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 2,
          },
        }}
      >
        {Array(10)
          .fill("a")
          .map((_, idx) => (
            <SwiperSlide key={idx}>
              <TourCard />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
