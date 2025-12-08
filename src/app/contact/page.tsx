"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import MapComponent from "../../components/Map";
import Link from "next/link";
import { useContactMessage } from "@/hooks/useCommon";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  subject: z.string().min(1, "Subject is required"),
  email: z.string().min(1, "Email is required."),
  mobile: z.string().min(1, "Mobile is required."),
  company: z.string().min(1, "Company Name is required."),
  message: z.string().min(1, "Message is required."),
});

type contactFormData = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<contactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const mobile = process.env.NEXT_PUBLIC_COMPANY_MOBILE;
  const email = process.env.NEXT_PUBLIC_COMPANY_EMAIL;
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const address = process.env.NEXT_PUBLIC_COMPANY_ADDRESS;

  const contactMutation = useContactMessage();

  const onSubmit = async (data: contactFormData) => {
    contactMutation.mutate(data, {
      onSuccess: () => {
        reset();
      }
    });
  };


  return (
    <>
      <div className="relative w-full my-10 h-[70px] sm:h-[100px] dark:bg-white">
        <Image
          src="/images/img_banner/contact-us.jpg"
          alt="Contact Banner"
          fill
          unoptimized
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute top-1/2 left-[6%] -translate-y-1/2">
          <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl">
            Contact Us
          </h1>
        </div>
      </div>

      <div className="grid px-9 xl:grid-cols-2 gap-6">
        {/* LEFT SECTION */}
        <div className="flex flex-col my-4 dark:bg-white dark:text-black">
          <h1 className="text-2xl font-[600] text-center pb-5">
            How to Reach Us ?
          </h1>

          <MapComponent />

          <h1 className="text-2xl font-[600] mt-8 px-3">Head Office</h1>
          <div className="flex flex-col gap-1 py-3 px-3 text-md text-gray-600">
            <p className="text-sm">{appName}</p>
            <p className="text-sm">{address}</p>
            <Link className="text-sm" href={`tel:${mobile}`}>Phone: {mobile}</Link>
            <Link className="text-sm" href={`mailto:${email}`}>Email: {email}</Link>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div>
          <h1 className="text-2xl font-[600] text-center my-4 dark:text-black">
            Drop your Message
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="dark:text-black dark:bg-white"
          >
            <div className="grid gap-3 py-4 grid-cols-1 sm:grid-cols-2">
              {/* NAME */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-[500]">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Enter name"
                  className="border border-gray-400 px-3 py-2 rounded-md text-sm"
                />
                {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
              </div>

              {/* SUBJECT */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-[500]">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("subject")}
                  type="text"
                  placeholder="Enter subject"
                  className="border border-gray-400 px-3 py-2 rounded-md text-sm"
                />
                {errors.subject && <p className="text-xs text-red-600">{errors.subject.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-4">
                {/* EMAIL */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Enter email"
                    className="border border-gray-400 px-3 py-2 rounded-md text-sm"
                  />
                  {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                </div>

                {/* MOBILE */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("mobile")}
                    type="tel"
                    placeholder="Enter mobile"
                    className="border border-gray-400 px-3 py-2 rounded-md text-sm"
                  />
                  {errors.mobile && <p className="text-xs text-red-600">{errors.mobile.message}</p>}
                </div>

                {/* COMPANY NAME */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("company")}
                    type="text"
                    placeholder="Enter Company Name"
                    className="border border-gray-400 px-3 py-2 rounded-md text-sm"
                  />
                  {errors.company && <p className="text-xs text-red-600">{errors.company.message}</p>}
                </div>
              </div>

              {/* MESSAGE */}
              <div className="flex flex-col h-full">
                <label className="text-sm font-medium mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("message")}
                  rows={9}
                  placeholder="Your message..."
                  className="border border-gray-400 px-3 py-2 rounded-md text-sm resize-none h-full"
                />
                {errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={contactMutation.isPending}
              className="py-2 my-8 rounded-md bg-[#dfad0a] text-md px-4 font-[600] hover:bg-[#9d7a20] transition"
            >
              {contactMutation.isPending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
