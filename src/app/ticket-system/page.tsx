import { Metadata } from "next";
import { Ticket } from "lucide-react";
const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME;
const owner = process.env.NEXT_PUBLIC_COMPANY_OWNER_NAME;
const companyNumber = process.env.NEXT_PUBLIC_COMPANY_MOBILE;
const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL;

export const metadata: Metadata = {
  title: `Ticket System | ${companyName}`,
  description: `Submit your talent details to ${companyName} for hiring opportunities.`,
};

export default function TicketSystemPage() {
  return (
    <div className="max-w-3xl mb-20 mx-auto px-4 px-8 pt-12 space-y-8 text-gray-800 sm:px-12">
      <div className="flex items-center gap-2">
        <Ticket className="text-blue-600" />
        <h1 className="text-2xl font-bold sm:text-3xl">Ticket System</h1>
      </div>

      <p className="text-sm">
        We are always on the lookout for top talent to join us. If you believe
        you’re talented and can contribute to {companyName}, please fill out the
        form below.
      </p>

      <p className="text-sm text-gray-600 italic">
        (Note: If your skills match any of the current job openings listed
        above, we recommend applying directly to those to increase your chances
        of a faster review.)
      </p>

      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-4 outline-none"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-4  outline-none"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            Tell us about your skills
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-4  outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-[#dfad0a] font-[600] text-sm px-6 py-2 cursor-pointer rounded-md hover:bg-[#9d7a20] transition"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
}
