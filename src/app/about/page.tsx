import { Metadata } from "next";
import { Car, Users, Compass, BadgeCheck, PhoneCall } from "lucide-react";
const companyName = process.env.NEXT_COMPANY_NAME;
const owner = process.env.NEXT_COMPANY_OWNER_NAME;
const establishedyear = process.env.NEXT_COMPANY_ESTABLISHED_DATE;
const launchedyyear = process.env.NEXT_COMPANY_LAUNCHED_DATE;
export const metadata: Metadata = {
  title: `About Us | ${companyName}`,
  description: `Learn more about ${companyName}}, our story, services, features, and what sets us apart.`,
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-8 pt-10 space-y-10 text-gray-800 sm:px-12 mt-10 mb-20 dark:bg-white">
      {/* Company Intro */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Users className="text-blue-600" />
          <h1 className="text-2xl font-bold sm:text-3xl">About Us</h1>
        </div>
        <p className="text-justify text-sm">
          <strong>{companyName}.com</strong> is a brainchild of {owner}, CEO of
          Regency Tours Pvt. Ltd., a pioneer in B2B and B2C travel services
          since {establishedyear}. Based in Delhi, {companyName} was launched in{" "}
          {launchedyyear} with a long-term vision to offer fast, reliable, and
          transparent car rental and ground handling solutions.
        </p>
        <p className="text-justify text-sm">
          We are a comprehensive marketplace for car rentals offering services
          like city taxi, airport transfers, one-way taxis, outstation rides,
          self-drive, and sightseeing. {companyName} is backed by a powerful CRM
          system, supports SaaS modules, and includes apps for both drivers and
          clients.
        </p>
      </section>

      {/* Modules */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="text-green-600" />
          <h2 className="text-xl font-semibold sm:text-2xl">{companyName} Modules</h2>
        </div>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Local Hire</li>
          <li>Point to Point</li>
          <li>Airport Transfers</li>
          <li>One Way Taxi</li>
          <li>Outstation</li>
          <li>Activities/Sightseeing</li>
        </ul>
      </section>

      {/* Features */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BadgeCheck className="text-yellow-600" />
          <h2 className="text-xl font-semibold sm:text-2xl">Key Features</h2>
        </div>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>API for Web & Mobile</li>
          <li>White Label Support</li>
          <li>Client & Driver Mobile App</li>
          <li>CRM System for Transport Management</li>
          <li>SaaS Module Integration</li>
          <li>Refer & Earn Program</li>
          <li>Vehicle Tracking</li>
          <li>Transparent Invoicing</li>
          <li>Instant Online Quotations & Timely Bookings</li>
          <li>Create Your Own Website in 60 Minutes</li>
        </ul>
      </section>

      {/* Opportunities */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold sm:text-2xl">
          Opportunities with {companyName}.com
        </h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Vendors – Attach your Vehicles</li>
          <li>Investors</li>
          <li>Travel Agents</li>
          <li>Partners – City & State Level</li>
        </ul>
      </section>

      {/* Services */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold sm:text-2xl">Our Services</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Luxury Cabs</li>
          <li>MICE Bookings</li>
          <li>Weddings and Event Vehicles</li>
          <li>Package Tours</li>
          <li>Ground Handling – International</li>
          <li>Sightseeing & Conferences</li>
          <li>Self Drive – Worldwide</li>
        </ul>
      </section>

      {/* CRM Audience */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold sm:text-2xl">Who Can Use Our CRM System</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Transporters with Owned Vehicles</li>
          <li>Travel Agents</li>
          <li>Corporates – Tracking & Invoicing</li>
          <li>MICE Operators</li>
          <li>Wedding Planners</li>
          <li>Event Management Companies</li>
        </ul>
      </section>

      {/* Fleet */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold sm:text-2xl">Our Fleet</h2>
        <p className="text-justify text-sm">
          We offer a modern and well-maintained fleet with premium amenities and
          GPS systems for your safety and comfort. We never compromise on
          vehicle quality.
        </p>
      </section>

      {/* Chauffeurs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold sm:text-2xl">Our Chauffeurs</h2>
        <p className="text-justify text-sm">
          All chauffeurs are professionally trained, police-verified,
          well-groomed, and follow HSE standards: Health, Safety & Environment.
          Fatigue management ensures top-level service.
        </p>
      </section>

      {/* Access Methods */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold sm:text-2xl">How to Book</h2>
        <p className="text-justify text-sm">
          Access {companyName} through our website, mobile app, or 24x7
          multilingual call center. We provide real-time tracking, messaging,
          and refer & earn features for our users.
        </p>
      </section>

      {/* Summary */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold sm:text-2xl">Why Choose Booking Cabs?</h2>
        <p className="text-justify text-sm">
          We're one of Delhi NCR's most preferred cab and car rental companies.
          We offer reliable, premium cab service with budget-friendly and
          luxurious options for all needs – from intercity travel to honeymoon
          packages.
        </p>
        <p className="text-justify text-sm">
          Whether you need a cab for local use, outstation, or customized travel
          packages, {companyName} is your trusted solution. Forget long queues
          and unreliable transport – enjoy a smooth, safe, and professional
          experience with us.
        </p>
      </section>

      {/* CTA */}
      <section className="space-y-4 border-t border-gray-300 pt-6">
        <div className="flex items-center gap-2">
          <PhoneCall className="text-indigo-600" />
          <h2 className="text-xl font-semibold sm:text-2xl">Book Your Ride Now</h2>
        </div>
        <p className="text-justify text-sm">
          So what are you waiting for? Check out our packages and book your
          first cab with {companyName} to travel anywhere in India comfortably
          and affordably.
        </p>
      </section>
    </div>
  );
}
