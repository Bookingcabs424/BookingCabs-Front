


export default function SendReceiptToClient(){
    return(
        <>
         <h1 className="text-xl">
              Booking <strong>(BCYF01801)</strong>
            </h1>
         <div className="flex flex-col py-1 m-6">
            <label
              htmlFor="email"
              className="font-semibold text-[12px] text-sm"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
            />
          </div>

          <div className="flex items-center justify-center">

            <button className="border border-gray-300 px-4 py-2 cursor-pointer mx-6 text-sm text-gray-600 rounded">Send Receipt to Client</button>
          </div>
        </>
    )
}