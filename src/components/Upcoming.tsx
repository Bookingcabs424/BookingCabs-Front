"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import UpcomingCard from "./UpcomingCard";

export default function Upcoming() {
  return (
    <div>
        <h1 className="text-xl font-bold sm:text-2xl my-4 dark:text-black">Upcoming</h1>
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={6}
        spaceBetween={20}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },

          450: {
            slidesPerView: 2,
          },
          652: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 3,
          },
           900: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
          1280:{
            slidesPerView: 6,
          }
         
        }}
      >
        {Array(10)
          .fill("a")
          .map((_, idx) => (
            <SwiperSlide key={idx}>
              <UpcomingCard />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
