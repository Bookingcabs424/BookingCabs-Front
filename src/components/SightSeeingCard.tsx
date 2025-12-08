import Image from "next/image";

export default function SightSeeingCard({isEdit=true}) {
  return (
    <div className="border border-gray-300 rounded-md p-2 cursor-pointer">
      <div className="sight-img w-full h-[100px] relative overflow-hidden">
        <Image
          src="/images/demestic_holidays/2.jpg"
          alt="Slider Background"
          fill
          className="object-cover hover:scale-105 transition duration-300"
          priority
        />
      </div>
      <div className="sight-details flex flex-col items-center justify-center gap-[2px] mt-1">
        <h1 className="text-[10px] font-[500] sm:text-[13px]">Taj Mahal (Agra)</h1>
      <h1 className="text-[12px]">₹ 500</h1>
      {isEdit && 
        <button className="bg-[#dfad08]  rounded-sm px-2 py-1 font-[500] cursor-pointer text-[10px] hover:bg-[#9d7a20] transition sm:text-[13px]">Remove</button>
      }
      </div>
    </div>
  );
}
