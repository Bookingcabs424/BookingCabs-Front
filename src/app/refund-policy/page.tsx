import { Metadata } from "next";
import { Undo2, Clock4, PhoneCall, Mail,Phone } from "lucide-react";
import Link from "next/link";
const companyName = process.env.NEXT_COMPANY_NAME;
const owner = process.env.NEXT_PUBLIC_COMPANY_OWNER_NAME;
const companyNumber = process.env.NEXT_PUBLIC_COMPANY_MOBILE;
const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL;
export const metadata: Metadata = {
  title: `Refund Policy | ${companyName}`,
  description:
    `Read the cancellation and refund policies for cab bookings made on ${companyName}.`,
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-10 space-y-10 text-gray-800 sm:px-12">
      <section className="space-y-4">
        <div className="flex items-center gap-2 py-5">
          <Undo2 className="text-blue-600" />
          <h1 className="text-2xl font-bold sm:text-3xl">Refund & Cancellation Policy</h1>
        </div>

        <p className="text-justify text-sm">
          {companyName} believes in helping its customers as far as possible, and
          follows a liberal cancellation and refund policy:
        </p>

        <h2 className="text-xl font-semibold mt-6 sm:text-2xl">Cancellation Terms</h2>
        <ol className="list-decimal list-inside space-y-2 text-justify">
          <li className="text-sm">
            <strong>25% refund:</strong> If the cancellation request is received
            after 24 hours of the scheduled pickup time.
          </li>
          <li className="text-sm">
            <strong>15% deduction:</strong> If the cancellation request is
            received before 24 hours of the scheduled pickup, a 15% convenience
            charge will be deducted from the advance.
          </li>
          <li className="text-sm">
            Cancellation must be done via phone or email using the booking ID
            provided at the time of booking.
          </li>
          <li className="text-sm">
            <strong>No cancellation</strong> is allowed for same-day bookings.
          </li>
          <li className="text-sm">
            No cancellations are accepted for services booked during special
            occasions (e.g., Dussehra, Pongal, Diwali, New Year) under
            promotional offers.
          </li>
        </ol>

        <h2 className="text-xl font-semibold mt-6 sm:text-2xl">General Terms</h2>
        <ul className="list-disc list-inside space-y-2 text-justify">
          <li className="text-sm">
            Toll tax and parking charges (if not included) must be paid directly
            to the driver.
          </li>
          <li className="text-sm">
            After 15 minutes of waiting at the pickup point, a waiting fee of ₹2
            per minute will apply, payable directly to the driver.
          </li>
          <li className="text-sm">
            For one-way trips, drivers will not stop for more than 30 minutes
            during the journey.
          </li>
          <li className="text-sm">
            Drivers will only stop for tea or lunch breaks (max 30 minutes) and
            drop guests at the destination specified at the journey’s start.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 sm:text-2xl">Refund Timeline</h2>
        <p className="text-justify">
          If eligible, your refund will be processed within{" "}
          <strong>5–7 working days</strong> back to the original payment method.
        </p>
      </section>

      <section className="border-t border-gray-300 pt-6 space-y-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="text-indigo-600" />
          <h2 className="text-xl font-semibold sm:text-2xl">Need Help?</h2>
        </div>
        <p className="text-justify text-sm">
          For refund issues or cancellation assistance, contact us at: <br /><br />
          <Link  href={`tel:${companyNumber}`} className="flex gap-3 py-1 text-sm">
          <Phone/><strong>{companyNumber}</strong> <br />
          </Link>
          <Link
            href={`mailto:${companyEmail}`}
            className="flex gap-3 py-1 text-sm"
            >
            <Mail className="text-black w-6 h-6"/>
            {companyEmail}
          </Link>
        </p>
      </section>
    </div>
  );
}
