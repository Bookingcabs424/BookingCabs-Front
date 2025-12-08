"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination"; 

import OfferCard from "./OfferCard";

const offers = [
  {
    id: 1,
    url: "/images/services/international.jpg",
    text: "Vehicle for International Destination",
  },
  {
    id: 2,
    url: "/images/services/felf-driving.jpg",
    text: "Vehicle for Self Driving",
  },
  {
    id: 3,
    url: "/images/services/confrence.png",
    text: "Vehicle for Conference",
  },
  {
    id: 4,
    url: "/images/services/mice.jpg",
    text: "Vehicle for MICE",
  },
  {
    id: 5,
    url: "/images/services/wedding.jpg",
    text: "Vehicle for Wedding",
  },
  {
    id: 6,
    url: "/images/services/tours.jpg",
    text: "Vehicle for Tours",
  },
  {
    id: 7,
    url: "/images/services/luxery-car.jpg",
    text: "Luxury Car",
  },
];

export default function WeOffer() {
  return (
    <div>
      <h1 className="text-xl font-bold sm:text-2xl mb-4 dark:text-black">We Offer</h1>
 

      <div className="relative my-3 pb-9">
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={6}
          spaceBetween={10}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            0: {
              slidesPerView: 2,
            },
            492: {
              slidesPerView: 3,
            },
            640: {
              slidesPerView: 5,
            },
            768: {
              slidesPerView: 6,
            },
            1024: {
              slidesPerView: 6,
            },
          }}
        >
          {offers.map(({ id, url, text }) => (
            <SwiperSlide key={id}>
              <OfferCard idx={id} url={url} text={text} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
