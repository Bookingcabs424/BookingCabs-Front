import Image from "next/image";

export default function BannerStrip() {
    const phone = process.env.NEXT_PUBLIC_COMPANY_MOBILE;
  return (
    <>
      <div className="banner w-full overflow-hidden relative h-[200px] sm:h-[310px]">
        <Image
          src="/images/slider/booking-cabs-bg.jpg"
          alt="Tour"
          fill
          priority
          className="object-cover w-full h-full"
        />
        <div className="absolute right-[10px] w-[40%] h-full">
          <div className="flex gap-3 h-full">
            <div className="qr"></div>
            <div className="content flex flex-col items-center justify-center w-full h-full">
              <h1 className="text-white font-semibold text-center text-[12px] sm:text-[15px] md:text-[18px]">
                Download BookingCabs App Now
              </h1>

              <h1 className="text-white font-semibold text-center text-[12px] sm:text-[15px] md:text-[18px]">
                Get it on Google Play, Apple Store
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[2px] p-8">
        <h1 className="font-semibold text-[15px] sm:text-[18px] md:text-[23px] lg:text-[28px] dark:text-black">
        Have a question or need a custom quote ?
      </h1>
      <h1 className="text-gray-500 text-[9px] sm:text-[13px] md:text-[15px] lg:text-[18px] dark:text-black">
        Our Team is here to help 24 hours a day, 7 days a week. Call: {phone}
      </h1>
      </div>
    </>
  );
}
