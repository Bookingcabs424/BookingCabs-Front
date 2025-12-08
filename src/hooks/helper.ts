 import * as LucideIcons from "lucide-react";
 import { useState } from "react";

 const amenitiesIcons = [
    { key: "washroom", icon: "Toilet" },
    { key: "music", icon: "Music" },
    { key: "chillar", icon: "Refrigerator" },
    { key: "water bottle", icon: "Droplets" },
    { key: "news paper", icon: "Newspaper" },
    { key: "mobile & laptop charger", icon: "Cable" },
    { key: "air pump", icon: "Wind" },
    { key: "baby sitting", icon: "Armchair" },
    { key: "oxygen cylinder", icon: "Droplets" },
    { key: "fire extinguisher", icon: "FireExtinguisher" },
    { key: "tissue box", icon: "Cable" },
    { key: "carrier", icon: "Wind" },
    { key: "automatic cooling", icon: "SunSnow" },
    { key: "air conditioning", icon: "AirVent" },
    { key: "manual transmission", icon: "Cog" },
    { key: "automatic transmission", icon: "Cog" },
    { key: "wifi", icon: "Wifi" },
    { key: "tv", icon: "TV" },
    { key: "default", icon: "CarTaxiFront" },
  ];
  export const getAmenityIcon=(key:string)=> {
  if (!key || typeof key !== 'string') return "CarTaxiFront"; // fallback

  const match = amenitiesIcons.find(item => item.key.toLowerCase() === key.toLowerCase());
  return match ? LucideIcons[match.icon as keyof typeof LucideIcons] : LucideIcons.CarTaxiFront; // default fallback
}


   export const getCookieValue = (name:string|undefined): string | undefined => {
      // Safely find and decode the cookie
      try {
        const cookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith(`${name}=`));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : undefined;

      } catch (error) {
        console.error('Error reading cookie:', error);
        return undefined;
      }
    };
