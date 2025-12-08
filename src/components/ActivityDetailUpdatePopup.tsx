export default function ActivityDetailUpdatePopup() {
  return (
    <div className="text-gray-800 overflow-y-auto py-3">
      <h1 className="text-sm font-semibold mb-2">Choose Attrections/Pay Entrance or Ticket</h1>
      <h1 className="text-sm font-semibold">Addons</h1>
      <div className="flex flex-col gap-2 py-3">
        <div className="input-box text-[11px] flex gap-2">
          <input type="checkbox" name="" id="" />
          <label htmlFor=""> Travel via Yamuna Expressway : Rs. 600</label>
        </div>
        <div className="input-box text-[11px] flex gap-2">
          <input type="checkbox" name="" id="" />
          <label htmlFor="">Add English Understanding Driver : Rs. 32000</label>
        </div>
        <div className="input-box text-[11px] flex gap-2">
          <input type="checkbox" name="" id="" />
          <label htmlFor="">Add Knowledgeable Tour Guide : Rs. 24000</label>
        </div>
      </div>

      <h1 className="text-sm font-semibold mb-3">
        Entrance Tickets, Activities, Cultural Shows & Theatre
      </h1>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 grid grid-rows-2">
          <p className="text-[9px] sm:text-[10px]">
            Light and Sound Show, @ Agra Fort- a UNESCO world heritage site,
            Agra
          </p>
          <p className="text-[9px] sm:text-[10px]">
            Light and Sound Show, @ Agra Fort- a UNESCO world heritage site,
            Agra
          </p>
        </div>
        <div className="col-span-4  flex flex-col grid grid-rows-6 text-[9px] sm:text-[11px]">
          <p className="my-[2px] w-full text-center ">
            Time: 6:30 PM, Language: English, Nationality: Indian
          </p>
          <p className="my-[2px] w-full text-center ">
            Time: 6:30 PM, Language: English, Nationality: Indian
          </p>
          <p className="my-[2px] w-full text-center ">
            Time: 6:30 PM, Language: English, Nationality: Indian
          </p>
          <p className="my-[2px] w-full text-center ">
            Time: 6:30 PM, Language: English, Nationality: Indian
          </p>
          <p className="my-[2px] w-full text-center ">
            Time: 6:30 PM, Language: English, Nationality: Indian
          </p>
          <p className="my-[2px] w-full text-center ">
            Time: 6:30 PM, Language: English, Nationality: Indian
          </p>
        </div>
        <div className="col-span-3  flex flex-col grid grid-rows-6 text-[9px] sm:text-[11px]">
          <div className="flex items-center gap-2 w-[max-content]">
            <p className="my-[2px]  text-center ">Rs. 100</p>{" "}
            <input
              type="number"
              className="border border-gray-300 w-[30px] h-[30px] rounded-sm outline-none text-sm px-1 pearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min={0}
            />
          </div>
          <div className="flex items-center gap-2 w-[max-content]">
            <p className="my-[2px]  text-center ">Rs. 100</p>{" "}
            <input
              type="number"
              className="border border-gray-300 w-[30px] h-[30px] rounded-sm outline-none text-sm px-1 pearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min={0}
            />
          </div>
          <div className="flex items-center gap-2 w-[max-content]">
            <p className="my-[2px]  text-center ">Rs. 100</p>{" "}
            <input
              type="number"
              className="border border-gray-300 w-[30px] h-[30px] rounded-sm outline-none text-sm px-1 pearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min={0}
            />
          </div>
          <div className="flex items-center gap-2 w-[max-content]">
            <p className="my-[2px]  text-center ">Rs. 100</p>{" "}
            <input
              type="number"
              className="border border-gray-300 w-[30px] h-[30px] rounded-sm outline-none text-sm px-1 pearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min={0}
            />
          </div>
          <div className="flex items-center gap-2 w-[max-content]">
            <p className="my-[2px]  text-center ">Rs. 100</p>{" "}
            <input
              type="number"
              className="border border-gray-300 w-[30px] h-[30px] rounded-sm outline-none text-sm px-1 pearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min={0}
            />
          </div>
          <div className="flex items-center gap-2 w-[max-content]">
            <p className="my-[2px]  text-center ">Rs. 100</p>{" "}
            <input
              type="number"
              className="border border-gray-300 w-[30px] h-[30px] rounded-sm outline-none text-sm px-1 pearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min={0}
            />
          </div>
        </div>
        <div className="col-span-2 text-[11px] flex flex-col grid grid-rows-2">
          <p className="text-[9px] sm:text-[12px]">Rs. 500</p>
          <p className="text-[9px] sm:text-[12px]">Rs. 500</p>
        </div>
      </div>
      <div className="w-full flex my-2 items-center justify-center py-1 px-2">
        <button className="w-[max-content] bg-[#dfad08] px-3 text-sm rounded-md py-1 font-semibold">
          Update
        </button>
      </div>
    </div>
  );
}
