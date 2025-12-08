"use client";

import BannerStrip from "../../components/BannerStrip";
import BookingForm from "../../components/BookingForm";
import DealOfDay from "../../components/DealOfDayCard";
import DestinationActivitiesSlider from "../../components/DestinationActivitiesSlider";
import Hero from "../../components/Hero";
import HowItWorks from "../../components/HowItWorks";
import ToursPackagesBidding from "../../components/Tour_Packages_Bidding";
import TypesOfVehicles from "../../components/TypeOfVehicles";
import Upcoming from "../../components/Upcoming";
import WeOffer from "../../components/WeOffer";
import {
  getDistancefromLatLong,
  useCityActivePackage,
} from "../../hooks/useCommon";
import {
  activeCity,
  useActiveModuleStore,
  useDistanceStorage,
  uselatLong,
} from "../../store/common";
import { useEffect, useState, Suspense } from "react";

export default function CityPage({ params }: any) {
  const { drop, pickup, setPickup, setDrop } = uselatLong();
  const [showDealPopup, setShowDealPopup] = useState(false);

  const { cityData, setCityData } = activeCity();
  const { activeModules, setActiveModules } = useActiveModuleStore();
  const { data, isSuccess, refetch } = getDistancefromLatLong(pickup, drop);

  useEffect(() => {
    if (drop && pickup) {
      refetch();
    }
  }, [drop, pickup]);
  const { distance, setDistance } = useDistanceStorage();
  useEffect(() => {
    if (data?.responseData.response.data.routes?.length > 0) {
      let distanceDuration = data.responseData.response.data.routes[0].legs[0];

      setDistance({
        distance: distanceDuration?.distance?.text,
        duration: distanceDuration?.duration?.text,
      });
    }
  }, [isSuccess]);
  const {
    data: activePackage,
    isLoading,
    isError,
    error: activeError,
    refetch: refetchActive,
  } = useCityActivePackage(cityData?.city_name, 1);
  useEffect(() => {
    if (cityData) {
      refetchActive();
    }
  }, [cityData]);
  useEffect(() => {
    if (activePackage?.data) {
      setActiveModules(activePackage?.data?.map((item: any) => item.name));
      setCityData({
        city_id: activePackage?.data?.[0]?.city_id,
        city_name: activePackage?.data?.[0]?.city_name,
        state_id: activePackage?.data?.[0]?.state_id,
        country_id: activePackage?.data?.[0]?.country_id,
      });
    }
  }, [activePackage]);
  useEffect(() => {}, [cityData]);
  useEffect(() => {
    if (drop && pickup) {
    }
  }, [drop, pickup]);
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="dark:bg-white">
          <Hero />
          <BookingForm />
          <div className="px-5 py-4 sm:px-9">
            <ToursPackagesBidding />
            <WeOffer />
            <TypesOfVehicles />
            <DestinationActivitiesSlider />
            <Upcoming />
            <HowItWorks />
          </div>
          <BannerStrip />
          {showDealPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000090] bg-opacity-5">
              <div className="relative w-full max-w-4xl">
                <DealOfDay onClose={() => setShowDealPopup(false)} />
              </div>
            </div>
          )}
        </div>
      </Suspense>
    </>
  );
}
