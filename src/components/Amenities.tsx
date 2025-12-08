"use client";
import { getAmenityIcon } from "../hooks/helper";
import { LucideIcon, LucideProps } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface AmenitiesProps {
  amenities_name: string;
}

export default function Amenities({ amenities_name }: AmenitiesProps) {
  // Get the icon name from your helper function
  const iconName = getAmenityIcon(amenities_name);

  // Safely get the icon component from Lucide
  const IconComponent =
    iconName &&
    typeof iconName === "string" &&
    (LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcon);

  if (!IconComponent) {
    return (
      <div className="overflow-hidden">
        <h2 className="text-md font-semibold mb-4">Amenities</h2>
        <p>No icon found for {amenities_name}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <h2 className="text-md font-semibold mb-4">Amenities</h2>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-1 flex flex-col gap-1 items-center">
          <IconComponent size={20} strokeWidth={1.5} />
          <small className="text-xs text-center">{amenities_name}</small>
        </div>
      </div>
    </div>
  );
}
