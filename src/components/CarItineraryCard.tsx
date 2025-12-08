import {
  Calendar,
  CircleGauge,
  Clock,
  Fan,
  Fuel,
  Hourglass,
  Luggage,
  MapPin,
  User,
} from "lucide-react";

export default function CarItineraryCard() {
  return (
    <div
        className={`border border-gray-300 w-full min-h-[90px] h-[max-content] grid grid-cols-12 py-1 rounded-md`}
      >
      <div className="left-car-details col-span-3 h-full relative flex items-center justify-center flex-col my-2">
        <div className="w-[120px] h-[50px] relative sm:h-[60px]">
          <img src={"/images/car_model/Economy (Hatch Back)/Baleno.png"} />
        </div>
      </div>

      <div className="right-car-details col-span-9 px-2">
        <div className="relative grid grid-cols-12 left-services-details w-full items-center h-full">
          <div className="grid grid-rows-3 gap-0 items-center justify-center col-span-3">
            <div className="flex items-center gap-1 my-[1px]">
              <MapPin className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
              <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                {/* Delhi-NCR */}
                {/* {form.cityList?.[0].pickup_city || form?.city} */}
              </span>
            </div>
            <div className="flex items-center gap-1 my-[1px]">
              <Calendar className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
              <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                {/* 23-05-2025 */}
                {/* {item?.start_date} */}
              </span>
            </div>
            <div className="flex items-center gap-1 my-[1px]">
              <Clock className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
              <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                {/* {form?.pickup_time} */}
              </span>
            </div>
          </div>
          <div className="grid grid-rows-3 gap-0 items-center justify-center col-span-3">
            {
              <div className="flex items-center gap-1 my-[1px]">
                <MapPin className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
                <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                  {/* Delhi-NCR */}

                  {/* {form.cityList?.[form.cityList.length - 1].drop_city ||
                      form.cityList?.[form.cityList.length - 1].pickup_city ||
                      form?.city} */}
                </span>
              </div>
            }
            <div className="flex items-center gap-1 my-[1px]">
              <Calendar className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
              <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                {/* 23-05-2025 */}
                {/* {item?.end_date} */}
              </span>
            </div>
            {/* {form?.return_time && (
                <div className="flex items-center gap-1 my-[1px]">
                  <Clock className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
                  <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                    {form?.return_time} 
                  </span>
                </div>
              )} */}
          </div>
          <div className="grid grid-rows-3 gap-0 items-center justify-center col-span-3">
            <div className="flex items-center gap-1 my-[1px]">
              <CircleGauge className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
              <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                {/* {item?.estimated_distance} KM */}
              </span>
            </div>
            <div className="flex items-center gap-1 my-[1px]">
              <Hourglass className="w-0 h-0 text-gray-500 sm:w-3 h-3 md:w-4 h-4" />
              <span className="text-gray-500 text-[9px] whitespace-nowrap sm:text-[10px] lg:text-[12px]">
                {/* {item?.local_pkg_name || item?.duration} */}
                <br />

                {/* ({item?.package_mode}) */}
              </span>
            </div>
          </div>

          {/* {booking?.master_package_id == 1 && <div></div>} */}

          <div className="services w-[max-content] grid grid-rows-1 absolute bottom-[3px] right-[120px] sm:right-[250px]">
            <div className="flex items-center justify-center gap-[1px] mt-1 sm:gap-3">
              <button
                // title={`${item?.vmodel_seating_capacity} +D`}
                className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 w-6 h-6"
              >
                <User className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
              </button>

              <button
                // title={item?.vmodel_smallluggage + "+" + item?.vmodel_luggage}
                className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 w-6 h-6"
              >
                <Luggage className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
              </button>
              <button
                // title={item?.vmodel_vehicle_ac_nonac}
                className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 h-6 w-6"
              >
                <Fan className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
              </button>
              <button
                title="Petrol"
                className="p-[3px] rounded-full group-hover:border-[#9d7a20] sm:border border-gray-500 w-6 h-6"
              >
                <Fuel className="w-3 h-2 text-gray-500 group-hover:text-[#9d7a20] sm:w-4 h-4 cursor-pointer" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
