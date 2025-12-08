import {
  Binoculars,
  Car,
  CarTaxiFront,
  MapPinned,
  MoveUp,
  Plane,
} from "lucide-react";
import { useFeatureStore } from "../store/formTypes";
import { useState } from "react";
import { useActiveModuleStore } from "../store/common";

type OutstationType = "roundtrip" | "oneway" | "multicity";

export default function BookingFormNavButtons() {
  const { selectedFeature, setSelectedFeature } = useFeatureStore();
  const [outstation, setOutstation] = useState<OutstationType>("roundtrip");
  const { activeModules } = useActiveModuleStore();

  const features = [
    { name: "Rental", icon: Car },
    { name: "Airport Transfer", icon: Plane },
    { name: "Outstation", icon: MapPinned },
    { name: "Oneway", icon: MoveUp },
    { name: "City Taxi", icon: CarTaxiFront },
    { name: "Sight Seeing", icon: Binoculars },
  ];

  const featuresToShow = activeModules?.length > 0 ? features.filter((feature) => activeModules.includes(feature.name)) : features;


  const handleHamburgerFeature = (feature: string) => {
    setSelectedFeature(feature);

    if (feature === "Oneway") {
      setOutstation("oneway");
    } else if (feature === "Outstation") {
      setOutstation("roundtrip");
    }
  };

  return (
    <div className="flex">
      {featuresToShow.map(({ name, icon: Icon }) => (
        <div
          key={name}
          className="w-[50px] flex flex-col bg-white items-center justify-center text-black rounded-md p-1 sm:py-1 sm:px-2 border border-gray-500 sm:shadow-md sm:w-[60px]"
        >
          <button
            onClick={() => handleHamburgerFeature(name)}
            title={name}
            className={`border border-gray-500 w-[max-content] p-1 rounded-full flex flex-col cursor-pointer ${
              selectedFeature === name && "bg-[#dfad08] border-[#dfad08]"
            }`}
          >
            <Icon className="w-4 h-4 text-gray-600 sm:w-6 sm:h-6" />
          </button>
          <span className="text-center text-[8px] text-gray-700 font-[600] md:text-[9px]">
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}
