'use client'

import Image from "next/image";


type OfferProps = {
  idx: number;
  url: string;
  text: string;
};
export default function OfferCard({ idx, url, text }: OfferProps) {
  return (
    <div title={text} className="service rounded-md overflow-hidden cursor-pointer group">
     <Image
        src={url}
        alt={`Slide ${idx + 1}`}
        width={400} 
        height={160}
        className="w-full h-[160px] object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute overflow-hidden bottom-0 left-0 w-full bg-black/60 px-2 py-1 text-white text-[14px] font-medium text-center truncate">
        {text}
      </div>
    </div>
  );
}
