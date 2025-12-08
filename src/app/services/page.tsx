// app/services/page.tsx

import {
  CheckCircle,
  Smartphone,
  ShieldCheck,
  Car,
  UsersRound,
  Wallet,
} from "lucide-react";

export default function ServicesPage() {
  const companyName = process.env.NEXT_COMPANY_NAME;
  return (
    <div className="max-w-6xl mx-auto px-4 px-8 sm:px-12 mt-10 mb-20">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
        Our Services
      </h1>

      <section className="mb-12 space-y-4 text-md text-gray-700 text-justify">
        <p className="text-sm">
          <strong>{companyName}</strong> is the first company in India offering
          point-to-point car rental services that are cheaper than radio taxi
          services. Founded by travel industry veterans active since 1994, we
          specialize in both B2B and B2C travel solutions.
        </p>
      </section>

      {/* 3x2 Grid of Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Reliability */}
        <FeatureCard
          title="Reliability"
          icon={<ShieldCheck className="w-6 h-6 text-green-700" />}
          items={[
            "Never cancel any trip",
            "Well-groomed drivers",
            "High quality with affordability",
            "Promise of on-time execution",
            "24 x 7 support",
          ]}
        />

        {/* Convenience */}
        <FeatureCard
          title="Convenience"
          icon={<Smartphone className="w-6 h-6 text-purple-700" />}
          items={[
            "Book via web, phone, or app",
            "Pay by cash or card",
            "Hassle-free booking & instant confirmation",
          ]}
        />

        {/* Safety */}
        <FeatureCard
          title="Safety"
          icon={<ShieldCheck className="w-6 h-6 text-red-600" />}
          items={[
            "Police verified drivers",
            "Real-time cab tracking",
            "“Share ride details” feature in app",
            "In-car GPS systems",
            "24 x 7 support",
          ]}
        />

        {/* Fleet */}
        <FeatureCard
          title="Our Fleet"
          icon={<Car className="w-6 h-6 text-yellow-600" />}
          items={[
            "Wide range of cars",
            "Amenities for comfort",
            "Well-maintained and young fleet",
            "No compromise on cab quality",
          ]}
        />

        {/* Chauffeurs */}
        <FeatureCard
          title="Our Chauffeurs"
          icon={<UsersRound className="w-6 h-6 text-indigo-600" />}
          items={[
            "Double verified",
            "Well-groomed & multilingual",
            "Trained in fatigue management",
            "Committed to health, security & environment",
          ]}
        />

        {/* Pricing */}
        <FeatureCard
          title="Our Pricing"
          icon={<Wallet className="w-6 h-6 text-pink-600" />}
          items={[
            "Transparent pricing structure",
            "No luggage charges*",
            "No night charges",
            "No AC charges",
            "No booking charges",
          ]}
          note="* Terms and conditions apply"
        />
      </div>

      {/* Why Choose Us */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-6 h-6 text-blue-700" />
          <h2 className="text-xl sm:text-2xl font-semibold">
            Why Choose {companyName}?
          </h2>
        </div>
        <div className="space-y-4 text-gray-700 text-md text-justify">
          <p className="text-sm">
            We provide top-notch cab services in Delhi for both outstation and
            local trips. Our reliable and on-time service ensures you never have
            to wait. We prioritize customer satisfaction and provide cabs suited
            to your needs.
          </p>
          <p className="text-sm">
            {companyName} offers a hassle-free, safe, and high-quality
            experience at affordable prices. We aim to be your go-to platform
            for convenient online cab bookings.
          </p>
          <p className="text-sm">
            With a user-first approach and the best taxi service in Delhi, we
            connect you to your ride with ease. Don’t settle for less—choose
            {companyName} for comfort, safety, and reliability.
          </p>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  icon,
  items,
  note,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  note?: string;
}) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-lg font-semibold text-black">{title}</h3>
      </div>
      <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
        {items.map((item, index) => (
          <li className="text-sm" key={index}>{item}</li>
        ))}
      </ul>
      {note && <p className="text-sm mt-2 text-gray-500">{note}</p>}
    </div>
  );
}
