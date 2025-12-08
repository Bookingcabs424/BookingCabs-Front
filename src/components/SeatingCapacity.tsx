import Image from "next/image";

export default function SeatingCapacity({ images }: { images: Array<string> }) {
  return (
    <div className="px-4">
      <h1 className="text-md font-semibold mb-2 text-lg">Images</h1>
      <div className=" grid grid-cols-2 gap-6 py-3">
        {/* Front View */}
        {images && images.length > 0 && images.map((image, index) => (
          <div key={index} className="relative h-[100px]">
            <img
              src={`${process.env.NEXT_PUBLIC_API_PIC_URL}${image}`}
              alt="Top view of 5-seater car layout"
              // fill
              className="object-contain"
              // priority
            />
          </div>
        ))}
      
      </div>
    
   

      <h1 className="text-md font-semibold text-lg">Type of Seats</h1>
      <div className=" grid grid-cols-2 gap-6 py-3">
        <div className="flex flex-col gap-2">
          <div className="relative h-[100px]">
            <Image
              src="/images/bench_seats.jpg"
              alt="Bench Seats"
              fill
              className="object-contain"
              priority
            />
          </div>
           <h1 className="text-[12px] font-semibold  text-center">
              Bench Seat
            </h1>
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative h-[100px]">
            <Image
              src="/images/bucket_seats.webp"
              alt="Bucket Seats"
              fill
              className="object-contain"
              priority
            />
          </div>
           <h1 className="text-[12px] font-semibold  text-center">
              Bucket Seat
            </h1>
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative h-[100px]">
            <Image
              src="/images/captain_seats.webp"
              alt="Captain Seats"
              fill
              className="object-contain"
              priority
            />
          </div>
           <h1 className="text-[12px] font-semibold  text-center">
              Captain Seat
            </h1>
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative h-[100px]">
            <Image
              src="/images/normal_seats.webp"
              alt="Normal Seats"
              fill
              className="object-contain"
              priority
            />
          </div>
           <h1 className="text-[12px] font-semibold  text-center">
              Normal Seat
            </h1>
        </div>

        <div className="flex flex-col gap-2">
          <div className="relative h-[100px]">
            <Image
              src="/images/recliner_seats.webp"
              alt="Recliner Seats"
              fill
              className="object-contain"
              priority
            />
          </div>
           <h1 className="text-[12px] font-semibold  text-center">
              Recliner Seat
            </h1>
        </div>
      </div>
    </div>
  );
}


