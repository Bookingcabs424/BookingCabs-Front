export default function ItineraryCard() {
  const activities = [
    {
      time: "9:00 AM",
      activity: "Arrive in the city, check into your accommodation",
    },
    { time: "11:00 AM", activity: "Visit Red Fort and India Gate" },
    { time: "1:00 PM", activity: "Lunch at a local restaurant" },
    { time: "3:00 PM", activity: "Explore local markets and shopping streets" },
  ];
  return (
    <div className="flex w-full my-6 col-span-12 rounded-md overflow-hidden ">
      {/* Day Label */}
      <div
        className="bg-[#dfad08] text-black px-2 py-4 text-xs font-bold flex items-center justify-center tracking-widest"
        style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
      >
        DAY 1
      </div>

      {/* Itinerary Content */}
      <div className="flex-1 bg-white">
        <table className="w-full text-left table-auto ">
          <thead>
            <tr className="text-gray-700">
              <th className="font-semibold p-2 w-1/4 border-b border-gray-300 text-[12px] sm:text-[13px]">
                Time
              </th>
              <th className="font-semibold p-2 border-b border-gray-300 text-[12px] sm:text-[13px]">
                Activity - Explore the City
              </th>
            </tr>
          </thead>
          <tbody className=" text-gray-800 text-[11px] sm:text-[12px]">
            {activities.map((item, idx) => (
              <tr key={idx} className="border-t border-gray-200">
                <td className="py-1 px-2 font-[600] border-r border-gray-100">
                  {item.time}
                </td>
                <td draggable className="py-1 px-2 cursor-grab">{item.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
