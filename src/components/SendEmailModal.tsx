"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  useBookingEmail,
  useQuotationEmail,

} from "@/hooks/useCommon";

const sendEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
});

type sendEmailData = z.infer<typeof sendEmailSchema>;

type SendEmailModalProps = {
  selected?: any;
  html?: any;
  id?: any;
  submitType?: string;
  param?: any;
  setOpenModal: React.Dispatch<React.SetStateAction<string>>;
  type?: string;
};

export default function SendEmailModal({
  selected,
  id,
  submitType,
  param,
  setOpenModal,
  type
}: SendEmailModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<sendEmailData>({
    resolver: zodResolver(sendEmailSchema),
  });

  const { mutate } = useQuotationEmail();

  const { mutate:sendBookingEmail } = useBookingEmail();

  const onSubmit = (data: sendEmailData) => {

  
      if(type=="quotation"){
          mutate({ booking_id: id, ...data ,type:"Quotation"});

  }
  else{
sendBookingEmail({ booking_id: id, ...data ,type:"Email"});
  }
    
    setOpenModal("")
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="flex flex-col gap-1 relative">
        <label htmlFor="email" className="font-[500] text-[12px]">
          Email
        </label>

        <input
          {...register("email")}
          type="email"
          placeholder="Enter Email"
          className="w-full border text-[12px] border-gray-300 focus:outline-none p-2 rounded-sm"
        />
        {errors.email && (
          <p className="text-red-500 text-[12px]">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1 relative">
        <label htmlFor="subject" className="font-[500] text-[12px]">
          Subject
        </label>

        <input
          {...register("subject")}
          type="text"
          placeholder="Enter Subject"
          className="w-full border text-[12px] border-gray-300 focus:outline-none p-2 rounded-sm"
        />
        {errors.subject && (
          <p className="text-red-500 text-[12px]">{errors.subject.message}</p>
        )}
      </div>

      <button className="bg-yellow-500 hover:bg-yellow-600 text-white text-[12px] mt-2 py-2 rounded cursor-pointer font-[500] outline-none">
        Share {submitType === "duty_slip" ? "Duty Slip" : "Quotation"}
      </button>
    </form>
  );
}
