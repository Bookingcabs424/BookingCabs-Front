import Link from "next/link";


interface SendThroughProps{
  attachment?: string;
  button_label: string;
  page_title?: string;
  companyDetails:any
}


export default function SendThroughEmail({attachment,button_label,page_title,companyDetails}:SendThroughProps){
    return(
        <>
         <div className="flex flex-col py-1 m-6 my-3">
            <label
              htmlFor="to"
              className="font-semibold text-[12px] text-sm"
            >
              To
            </label>
            <input
              type="email"
              className="border border-gray-300 p-2 px-3 cursor-not-allowed outline-none rounded-sm w-full text-[12px] sm:text-sm"
              disabled
            />
          </div>

          <div className="flex flex-col py-1 m-6 my-3">
            <label
              htmlFor="toCC"
              className="font-semibold text-[12px] text-sm"
            >
              To:Cc
            </label>
            <input
              type="email"
              className="border border-gray-300 p-2 px-3 outline-none rounded-sm w-full text-[12px] sm:text-sm"
            />
          </div>

          <div className="attachment mx-6 mb-4 flex gap-3">
            <span className="font-semibold text-[12px] text-sm">Attachment: </span>
            <Link href="/" className="font-semibold text-[12px] text-sm hover:text-red-600">{attachment}</Link>
          </div>

          <div className="flex items-center justify-start">

            <button className="border border-gray-300 px-4 py-2 cursor-pointer mx-6 text-[12px] text-gray-800 rounded bg-yellow-500">{button_label}</button>
          </div>
        </>
    )
}