"use client"
import { HelpCircle, Info, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
export default function FAQPage() {
  const companyMobile = process.env.NEXT_COMPANY_MOBILE;
  const companyName = process.env.NEXT_COMPANY_NAME;

   const [openQA, setOpenQA] = useState<{ [key: string]: boolean }>({});

  const toggleQA = (key: string) => {
    setOpenQA((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const sections = [
    {
      title: "Cancellations Related",
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      qas: [
        {
          q: "Can I change my booking?",
          a: "Yes. You can change the date of booking till 1 day before the booked date free of charge for Cab (P to P Booking). For other services, check respective cancellation terms.",
        },
        {
          q: "How do I cancel my booking? What are the charges?",
          a: (
            <>
              You can cancel via call center, mobile app, or website. Charges:
              <ul className="list-disc ml-6 mt-1">
                <li>48+ hours before: No charge</li>
                <li>24–48 hours: Min 15%</li>
                <li>0–24 hours: Min 25% (may vary by vendor/TSP)</li>
              </ul>
            </>
          ),
        },
      ],
    },
    {
      title: "About Our Services",
      icon: <Info className="w-5 h-5 text-blue-600" />,
      qas: [
        {
          q: `What are the services offered by ${companyName}?`,
          a: "Reliable metered taxi service in Delhi with GPS-enabled, AC cars and 24x7 support.",
        },
        {
          q: `What are the timings for the ${companyName} Service?`,
          a: "Our services are available 24x7.",
        },
        {
          q: `How do I book a ${companyName} Cab?`,
          a: `Via phone ${companyMobile}, mobile app (Android/iPhone), or website (www.${companyName}.com).`,
        },
        {
          q: `Can I hail a ${companyName} on the road?`,
          a: `No. Advance booking via app, website or call center is mandatory.`,
        },
        {
          q: `Is there a charge for booking on the phone/web?`,
          a: `No charges for app or web bookings. Charges may apply for call center bookings.`,
        },
        {
          q: `Will I be charged for waiting time also?`,
          a: `Yes, after a grace period. Charges vary by city.`,
        },
        {
          q: `Do I have to pay toll charge?`,
          a: `Yes, for travel-time tolls. Not required for pickup-time tolls.`,
        },
        {
          q: `How do I pay after the trip?`,
          a: `Cash, debit/credit card, or wallet via app/website. Printed/e-receipt provided.`,
        },
        {
          q: `Will I get a printed receipt?`,
          a: `Yes. Always request one. Also sent via registered email.`,
        },
        {
          q: `Can I pay using a debit or credit card?`,
          a: `Yes. VISA, MasterCard accepted on app/website.`,
        },
        {
          q: `Can I use the cab without flagging down the meter?`,
          a: `No. All rides must be metered to comply with regulations and ensure transparency.`,
        },
        {
          q: `What if I left something in the cab?`,
          a: `Call ${companyMobile} with cab/date/time info. We’ll help you recover your item.`,
        },
        {
          q: `Can I cancel a booking made?`,
          a: `Yes, inform us as soon as possible to avoid unnecessary cab dispatch.`,
        },
        {
          q: `In which cities is ${companyName} available?`,
          a: `Currently available in Delhi. Expansion coming soon.`,
        },
      ],
    },
    {
      title: "About Convenience Charge",
      icon: <Info className="w-5 h-5 text-yellow-600" />,
      qas: [
        {
          q: "Are there any additional booking charges?",
          a: "No extra charges for bookings via app/website in Delhi.",
        },
        {
          q: "Charges if booked via call center?",
          a: "Fare only. No extra fee even if booked via call center.",
        },
      ],
    },
    {
      title: "About Our Website",
      icon: <Info className="w-5 h-5 text-purple-600" />,
      qas: [
        {
          q: `Do I need to register to use ${companyName}?`,
          a: "No, guest booking is allowed. Registered users get extra benefits.",
        },
        {
          q: "I forgot my password!",
          a: 'Click "Forget Password" on the login page, submit your email, and check your inbox.',
        },
        {
          q: "I can't log in!",
          a: `Call ${companyMobile} for assistance.`,
        },
      ],
    },
    {
      title: "Rental Structure",
      icon: <Info className="w-5 h-5 text-green-600" />,
      qas: [
        {
          q: "Airport / Railway Station transfer:",
          a: "Flat rates within city limits for pickup or drop to/from station/airport.",
        },
        {
          q: "Local Trip / Within City use:",
          a: "Packages: 4hr/40km, 8hr/80km, 12hr/120km. Extra hours/km and night charges apply.",
        },
        {
          q: "Outstation Trip / Out of City use:",
          a: "Per day km limit and driver allowance apply. Cost based on km usage.",
        },
      ],
    },
    {
      title: "General",
      icon: <HelpCircle className="w-5 h-5 text-indigo-600" />,
      qas: [
        {
          q: `Advantages of ${companyName}?`,
          a: "Well-maintained cars, professional chauffeurs, competitive rates, and city-wide service.",
        },
        {
          q: "How is credit card info kept secure?",
          a: "We use secure payment gateways. All cars < 2 yrs old, clean, and GPS-enabled.",
        },
        {
          q: "How is itinerary confirmation provided?",
          a: "Via reference ID and confirmation email instantly upon payment.",
        },
        {
          q: "What if my trip plan changes?",
          a: "Contact 24x7 support to modify, extend, cancel, or shorten your trip.",
        },
        {
          q: "When are driver and car details shared?",
          a: "At least 45 minutes before pickup via SMS and email.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8 pt-12 pb-0 sm:p-12">
      <h1 className="text-3xl font-bold text-center mb-12 sm:text-4xl">
        FAQ
      </h1>

      {sections.map(({ title, icon, qas }, sectionIdx) => (
        <div key={sectionIdx} className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 border-b border-gray-300 pb-2 sm:text-2xl">
            {icon}
            {title}
          </h2>
          <div className="space-y-4">
            {qas.map((qa, idx) => {
              const key = `${sectionIdx}-${idx}`;
              const isOpen = openQA[key];

              return (
                <div key={key} className="border border-gray-300 rounded-md shadow-sm">
                  <button
                    onClick={() => toggleQA(key)}
                    className="w-full text-left px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  >
                    <span className="text-sm font-medium text-gray-800">Q. {qa.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 py-3 rounded-md text-sm text-gray-700 border-t border-gray-300 bg-white">
                      {typeof qa.a === "string" ? <p>{qa.a}</p> : qa.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
