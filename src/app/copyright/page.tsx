import { Metadata } from "next";
import { ShieldAlert, Info, Copyright as CopyrightIcon } from "lucide-react";

const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME;

export const metadata: Metadata = {
  title: ` Disclaimer & Legal | ${companyName}`,
  description:
    "Read our disclaimer, copyright, and consent policy for using Bookingcabs services.",
};

export default function LegalDisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-10 space-y-12 px-12 mt-10 mb-20 dark:text-black">
      <section>
        <div className="flex items-center gap-2 mb-5">
          <CopyrightIcon className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-semibold lg:text-2xl">Copyright</h2>
        </div>
        <p className="text-gray-700 text-justify text-sm">
          All content, logo, and domain on this website are the copyright of{" "}
          <strong>{companyName}</strong>, except for third-party content and
          links to third-party websites. No other website is permitted to copy
          content from the Bookingcabs website.
        </p>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-5">
          <Info className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-semibold lg:text-2xl">
            Consent to Electronic Communications and Transactions
          </h2>
        </div>
        <p className="text-gray-700 text-justify text-sm">
          By clicking the <strong>" I Agree "</strong> button, the user agrees to
          receive all information, communications, and notices from us
          electronically, whether via email or other means. All such
          communications are mutually agreed to be valid between the user and
          {companyName}.
        </p>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-5">
          <ShieldAlert className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-semibold text-red-600 lg:text-2xl">Disclaimer</h2>
        </div>
        <div className="space-y-4 text-gray-700">
          <p className="text-justify text-sm">
            {companyName}.com disclaims all warranties of merchantability
            regarding the information and description of cab/taxi, car rental,
            or any other service listed on this website. Much of this content is
            provided by suppliers/operators. Ratings shown are general
            guidelines and not guaranteed to be accurate.
          </p>
          <p className="text-justify text-sm">
            The customer acknowledges and agrees that use of the Mobile App,
            Website, or Call Center is at their own risk. {companyName}{" "}
            disclaims all express or implied warranties, including fitness for
            any particular purpose, to the fullest extent permitted by law.
          </p>
          <p className="text-justify text-sm">
            The information on this Website/Application is for general purposes
            only. While we strive for accuracy, we make no representations or
            warranties, express or implied, about the completeness or
            reliability of any content, products, or services.
          </p>
          <p className="text-justify text-sm">
            We are not liable for any loss or damage including indirect or
            consequential loss or loss of data/profits arising from the use of
            this website.
          </p>
          <p className="text-justify text-sm">
            This website may contain links to third-party websites which are not
            under our control. We are not responsible for their content or
            availability. Inclusion of links does not imply endorsement.
          </p>
          <p className="text-justify text-sm">
            Every effort is made to keep the Website/App/Call Center running
            smoothly. However, {companyName} is not responsible for technical
            issues beyond our control.
          </p>
        </div>
      </section>
    </div>
  );
}
