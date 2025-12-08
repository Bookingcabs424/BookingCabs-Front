"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const sendWhatsappSchema = z.object({
  phone: z.string().nonempty("Phone Number is required"),
});

type sendWhatsappData = z.infer<typeof sendWhatsappSchema>;

export default function SendWhatsappModal() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<sendWhatsappData>({
    resolver: zodResolver(sendWhatsappSchema),
  });

  const onSubmit = (data: sendWhatsappData) => {
    console.log(data);
    window.open(`https://api.whatsapp.com/send?phone=${data.phone}&text=Hello`,
      "_blank"
    );
  };
// https://wa.me/<your_number>?text=My%20important%20note

  return (
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
  );
}
