"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useQuotationSmS } from "@/hooks/useCommon";

const sendSMSSchema = z.object({
  phone: z.string().nonempty("Phone Number is required"),
});

type sendSMSData = z.infer<typeof sendSMSSchema>;

export default function SendSMSModal({selected}:{selected:any}) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
      } = useForm<sendSMSData>({
        resolver: zodResolver(sendSMSSchema),
      });
    const {data, mutate}= useQuotationSmS()
      const onSubmit = (data: sendSMSData) => {
        console.log(data);
        mutate({ booking_id: selected.id, ...data });
      };
    
    return(
        <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 relative">
          <label htmlFor="subject" className="font-[500] text-[12px]">
            Phone Number
          </label>

          <input
            {...register("phone")}
            type="tel"
            placeholder="Enter Phone Number"
            className="w-full border text-[12px] border-gray-300 focus:outline-none p-2 rounded-sm"
          />
          {errors.phone && (
            <p className="text-red-500 text-[12px]">{errors.phone.message}</p>
          )}
        </div>

        <button className="bg-yellow-500 hover:bg-yellow-600 text-white text-[12px] mt-2 py-2 rounded cursor-pointer font-[500]">
          Share Quotation
        </button>
      </form>
    </div>
    )
}