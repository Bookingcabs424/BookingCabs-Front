import Head from "next/head";

export default function ZeroTolerancePolicy() {
    const companyName = process.env.NEXT_COMPANY_NAME;
    const companyContact = process.env.NEXT_COMPANY_CONTACT;
  return (
    <>
      <Head>
        <title>Zero Tolerance Policy | {companyName}</title>
        <meta
          name="description"
          content="Zero tolerance abuse, drug & alcohol policy for transport suppliers and their drivers"
        />
      </Head>
      <main className="max-w-4xl mb-20 mx-auto px-8 pt-12 text-justify text-gray-800 sm:px-12">
        <h1 className="text-2xl font-bold mb-6 sm:text-3xl">Zero Tolerance Policy</h1>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2 sm:text-xl">
            Zero Tolerance Abuse, Drug & Alcohol Policy
          </h2>
          <p className="text-sm">
            {companyName}.com ('{companyName}.com') is a global marketplace for
            destination-based ground transportation in tourism and travel,
            connecting customers with private hire transport suppliers. We do
            not work with independent drivers directly, and our services operate
            in more than 130 countries globally.
          </p>
          <p className="text-sm">
            {companyName}.com has a zero-tolerance abuse, drug, and alcohol policy
            for its transport supply partners, including their workers and
            drivers.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2 sm:text-xl">
            Reporting Zero Tolerance Concerns
          </h2>
          <p className="text-sm">
            If you suspect that a worker or a driver of a transport supplier is
            under the influence of drugs or alcohol, contact the authorities by
            dialing {companyContact} (destination’s local non-emergency
            assistance line) and then reach out to the transport supplier
            company as well as {companyName}.com’s critical response team by
            clicking the button below. We are available 24/7, and will contact
            you as soon as possible after your request. Concerns do not need to
            be real-time to warrant reporting.
          </p>
          <button className="bg-[#dfad0a] text-black font-[600] px-4 py-2 rounded mt-4 cursor-pointer hover:bg-[#9d7a20] transition text-sm">
            Report Your Concern
          </button>
          <p className="mt-4">
            For non-critical or general zero-tolerance inquiries, you can also
            send an email to our customer care team by tapping the "Contact
            Customer Care" button below.
          </p>
           <button className="bg-[#dfad0a] text-black font-[600] px-4 py-2 rounded mt-4 cursor-pointer hover:bg-[#9d7a20] transition text-sm">
            Contact Customer Care
          </button>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2 sm:text-xl">
            Zero Tolerance for Travelers, Booking Agents & Their Clients
          </h2>
          <p className="text-sm">
            Please ensure that you dispose of any adult beverages before
            starting your journey. Open containers and chewing gum are not
            allowed in any private hire transport. Violating this policy could
            lead to your service being terminated by the service provider and
            possible deactivation from our platform.
          </p>
          <p className="text-sm">
            We understand that transport services may not always meet your
            expectations. While we respect your right to express complaints,
            {companyName}.com and our transport suppliers will not tolerate
            aggressive, threatening, or abusive actions towards drivers or any
            employees associated with our platform.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2 sm:text-xl">
            Commitment to Policy Effectiveness
          </h2>
          <p className="text-sm">
            {companyName}.com is committed to continuously reviewing the
            effectiveness of this policy and implementing enhancements when
            required.
          </p>
        </section>
      </main>
    </>
  );
}
