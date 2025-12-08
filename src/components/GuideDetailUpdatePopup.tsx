export default function GuideDetailUpdatePopup() {
  return (
    <div className="text-gray-800 overflow-y-auto">
      <div className="grid grid-cols-12">
        <div className="col-span-4 grid grid-rows-3 gap-3">
          <p className="text-[11px] text-center">
            Hindi understanding & speaking Guide
          </p>
          <p className="text-[11px] text-center">
            Hindi understanding & speaking Guide
          </p>
          <p className="text-[11px] text-center">
            Hindi understanding & speaking Guide
          </p>
        </div>
        <div className="col-span-4 grid grid-rows-3 gap-3">
          <p className="text-[11px] text-center">Rs. 500</p>
          <p className="text-[11px] text-center">Rs. 500</p>
          <p className="text-[11px] text-center">Rs. 500</p>
        </div>
        <div className="col-span-4 grid grid-rows-3 gap-3 items-start">
          <div className="flex items-center gap-1">
            <input type="radio" name="" id="" />
            <label htmlFor="" className="text-[12px]">
              Select
            </label>
          </div>
          <div className="flex items-center gap-1">
            <input type="radio" name="" id="" />
            <label htmlFor="" className="text-[12px]">
              Select
            </label>
          </div>
          <div className="flex items-center gap-1">
            <input type="radio" name="" id="" />
            <label htmlFor="" className="text-[12px]">
              Select
            </label>
          </div>

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
