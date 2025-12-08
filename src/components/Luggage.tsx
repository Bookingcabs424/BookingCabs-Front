import Image from "next/image";

export default function LuggagePage() {
  return (
    <div className="overflow-hidden">
      <h2 className="text-md font-semibold mb-4">Luggage</h2>
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-1 hover:scale-105 transition">
          <div className="relative h-[150px] w-[150px]">
            <Image
              src="/images/small_luggage.jpg"
              alt="Small Luggage"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-[12px] font-semibold  text-center">
            Small Luggage
          </h1>
        </div>
        <div className="flex flex-col gap-1 hover:scale-105 transition">
          <div className="relative h-[150px] w-[150px]">
            <Image
              src="/images/big_luggage.webp"
              alt="Small Luggage"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-[12px] font-semibold  text-center">
            Big Luggage
          </h1>
        </div>
      </div>
    </div>
  );
}
