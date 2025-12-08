"use client";
import { ShieldCheck, Info, Users, Lock, Cookie, Phone } from "lucide-react";
import React from "react";
import Link from "next/link";

const PrivacyPolicy = () => {
  const companyMobile = process.env.NEXT_PUBLIC_COMPANY_MOBILE;
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME;
  const companyAddress = process.env.NEXT_PUBLIC_COMPANY_ADDRESS;
  const companyLocation = process.env.NEXT_PUBLIC_COMPANY_LOCATION;
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL;
  const registerDate = process.env.NEXT_PUBLIC_COMPANY_REGISTER_DATE;

  return (
    <main className="max-w-4xl mx-auto px-8 py-10 text-gray-800 sm:px-12">
      <h1 className="text-2xl  md:text-4xl font-bold mb-8 flex items-center gap-2">
        <ShieldCheck className="text-blue-600 w-6 h-6  md:w-10 h-10" /> Privacy Policy
      </h1>

      <p className="mb-6 text-justify text-sm">
        This privacy policy assures that any information provided by users to
        Bookingcabs will be protected while using the Bookingcabs website.
        Bookingcabs is committed to ensuring that your privacy is protected. If
        we ask you to provide certain information by which you can be identified
        while using this website, you can be assured that it will only be used
        in accordance with this privacy statement. Bookingcabs may update this
        policy from time to time by revising this page. You should check this
        page periodically to ensure that you are satisfied with any changes.
        This policy has been effective since 24th February 2016.
      </p>

      {/* Section: What We Collect */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 sm:text-2xl">
          <Info className="text-green-600" /> Information We Collect
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li className="text-sm">Your name and tour details</li>
          <li className="text-sm">Contact info: email, mobile number</li>
          <li className="text-sm">Demographic info like location and preferences</li>
          <li className="text-sm">Responses to surveys and promotions</li>
        </ul>
      </section>

      {/* Section: Use of Information */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 sm:text-2xl">
          <Users className="text-purple-600" /> How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li className="text-sm">Improve our services and tailor user experience</li>
          <li className="text-sm">Send promotional emails and alerts</li>
          <li className="text-sm">Conduct market research and service feedback</li>
        </ul>
      </section>

      {/* Section: App Data */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 sm:text-2xl">
          <Info className="text-orange-600" /> App Data Collection
        </h2>
        <p>We collect data from our app when you:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li className="text-sm">Create user or vendor accounts</li>
          <li className="text-sm">Register cars or make purchases</li>
          <li className="text-sm">Enter pickup and drop locations</li>
          <li className="text-sm">Participate in offers or submit feedback</li>
        </ul>
      </section>

      {/* Section: Information Sharing */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 sm:text-2xl">
          <Users className="text-pink-600" /> Information Sharing
        </h2>
        <p>
          Bookingcabs and its parent company Hello42 India Pvt. Ltd. may share
          your data with:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li className="text-sm">Business partners and service providers</li>
          <li className="text-sm">Payment processors, distributors, and resellers</li>
          <li className="text-sm">Only under confidentiality agreements and for agreed purposes</li>
        </ul>
      </section>

      {/* Section: Security */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 sm:text-2xl">
          <Lock className="text-red-600" /> Security
        </h2>
        <p>
          We are committed to ensuring that your information is secure. We have
          implemented suitable physical, electronic, and managerial safeguards
          to prevent unauthorized access.
        </p>
      </section>

      {/* Section: Cookies */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 sm:text-2xl">
          <Cookie className="text-yellow-600" /> Cookies
        </h2>
        <p>
          Cookies help us enhance your experience. You can choose to accept or
          decline cookies in your browser settings.
        </p>
      </section>

      {/* Section: Referral Terms */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 sm:text-2xl">
          <Users className="text-teal-600" /> Referral Scheme Terms
        </h2>
        <ol className="list-decimal pl-6 space-y-1">
          <li className="text-sm">Applies to Economy, Sedan, and Prime rides only</li>
          <li className="text-sm">Only valid for one ride per coupon</li>
          <li className="text-sm">Coupon value depends on the program at time of sign-up</li>
          <li className="text-sm">Free ride coupons expire if unused</li>
          <li className="text-sm">Misuse or fake accounts will be suspended</li>
        </ol>
      </section>

      {/* Section: Contact */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 sm:text-2xl">
          <Phone className="text-indigo-600" /> Contact Us
        </h2>
        <div className="flex flex-col gap-1 mt-3 text-sm">
          <Link href="/">{companyName}</Link>
          <Link href="/">{companyAddress} {companyLocation}</Link>
          <Link href={`tel:${companyMobile}`}>Phone: {companyMobile}</Link>
          <Link href={`mailto:${companyEmail}`}>Email: {companyEmail}</Link>
        </div>
      </section>

      <p className="text-sm text-gray-500">Last Updated: {registerDate}</p>
    </main>
  );
};

export default PrivacyPolicy;
