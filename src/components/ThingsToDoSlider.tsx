"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import ThingsToDoCard from "./ThingsToDoCard";

export default function ThingsToDoSlider() {
  return (
    <div>
      <h1 className="text-xl font-bold sm:text-2xl mb-4 dark:text-black">Things To Do</h1>
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={6}
        spaceBetween={5}
        breakpoints={{
            0: {
            slidesPerView: 2,
          },
          640: {
            slidesPerView: 3,
          },
          768:{
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 2,
          },
          1100: {
            slidesPerView: 3,
          },
        }}
      >
        {Array(10)
          .fill("1")
          .map((_, idx) => (
            <SwiperSlide key={idx}>
              <ThingsToDoCard />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
