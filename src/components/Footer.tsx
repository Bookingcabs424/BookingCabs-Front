"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 py-10 px-12 lg:px-6 mt-20">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Newsletter Section */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 sm:text-2xl">
            Get Regular Updates
          </h3>
          <p className="mb-4 text-[13px] sm:text-sm">
            Subscribe / Un-subscribe To Our Newsletter & Promotional Messages
          </p>
          <form className="space-y-4">
            <div className="grid grid-cols-1 text-[12px] sm:grid-cols-2 text-[14px] justify-between gap-4 lg:grid-cols-4">
              <input
                type="text"
                placeholder="First Name"
                className="px-3 py-2 border border-gray-300 rounded w-full outline-none"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="px-3 py-2 border border-gray-300 rounded w-full outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                className="px-3 py-2 border border-gray-300 rounded w-full outline-none"
              />
              <input
                type="tel"
                placeholder="Mobile No."
                className="px-3 py-2 border border-gray-300 rounded w-full outline-none"
              />
            </div>

            {/* Checkboxes for Subscription Preferences */}
            <div className="grid grid-cols-2 py-4 justify-between items-center gap-4 mt-4 lg:grid-cols-4">
              <label className="flex items-center gap-2 text-sm col-span-1 py-2 sm:py-0">
                <input type="checkbox" className="form-checkbox " />
                Subscribe via Email
              </label>
              <label className="flex items-center gap-2 text-sm col-span-1 py-2 sm:py-0">
                <input type="checkbox" className="form-checkbox " />
                Subscribe via Mobile
              </label>
              <label className="flex items-center gap-2 text-sm col-span-2 md:col-span-1 py-2 sm:py-0">
                <input type="checkbox" className="form-checkbox " />
                Subscribe via Both (Email & Mobile)
              </label>
              <button
                type="submit"
                className="bg-[#dfad0a] cursor-pointer text-black text-sm px-6 py-2 rounded hover:bg-[#9d7a20] transition"
              >
                Subscribe
              </button>
            </div>

            {/* Subscribe Button */}
            {/* <div className="mt-4"></div> */}
          </form>
        </div>

        {/* Reach Us Section */}
        <div className="grid grid-cols-2 justify-between gap-12 md:grid-cols-3">
          {/* Reach Us */}
          <div className="space-y-2 col-span-2 md:col-span-1">
            <h4 className="font-semibold text-lg sm:text-xl">Reach Us</h4>
            <div className="text-sm text-[13px] sm:text-sm">
              <Link href="/" className="mt-1">
                {process.env.NEXT_PUBLIC_COMPANY_WEBSITE}
              </Link>
              <p className="mt-1">
                {" "}
                {process.env.NEXT_PUBLIC_COMPANY_ADDRESS}{" "}
              </p>
              <p className="mt-1">
                {" "}
                {process.env.NEXT_PUBLIC_COMPANY_LOCATION}{" "}
              </p>
            </div>
            <Link
              href={`tel:${process.env.NEXT_PUBLIC_COMPANY_CONTACT}`}
              className="text-sm text-[13px] sm:text-sm mt-5"
            >
              Tel: {process.env.NEXT_PUBLIC_COMPANY_MOBILE}
            </Link>
            <br />
            <Link
              href={`mailto: ${process.env.NEXT_PUBLIC_COMPANY_MAIL}`}
              className="text-sm text-[13px] sm:text-sm mt-5"
            >
              E-mail: {process.env.NEXT_PUBLIC_COMPANY_EMAIL}
            </Link>
          </div>

          {/* Company Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-lg sm:text-xl">Reach Us</h4>
            <ul className="text-sm space-y-1">
              <li>
                <Link
                  href="/services"
                  className="hover:text-blue-600 text-[13px] sm:text-sm"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-600 text-[13px] sm:text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/copyright"
                  className="hover:text-[#0e8ded] text-[13px] sm:text-sm"
                >
                  Copyright
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#0e8ded] text-[13px] sm:text-sm"
                >
                  Terms of use
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-[#0e8ded] text-[13px] sm:text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[13px] sm:text-sm text-amber-500"
                >
                  We are Hiring
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#0e8ded] text-[13px] sm:text-sm"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-lg sm:text-xl">Reach Us</h4>
            <ul className="text-sm space-y-1">
              <li>
                <Link
                  href="/faq"
                  className="hover:text-[#0e8ded] text-[13px] sm:text-sm"
                >
                  Faq
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation"
                  className="hover:text-[#0e8ded] text-[13px] sm:text-sm"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="hover:text-[#0e8ded] text-[13px] sm:text-sm"
                >
                  Refund policy
                </Link>
              </li>
              <li>
                <Link
                  href="/ticket-system"
                  className="hover:text-[#0e8ded] text-[13px] sm:text-sm"
                >
                  Ticket system
                </Link>
              </li>
              <li>
                <Link
                  href="/billing-system"
                  className="hover:text-[#0e8ded] text-[13px] sm:text-sm"
                >
                  Billing system
                </Link>
              </li>
              <li>
                <Link
                  href="/zero-tolerance"
                  className="hover:text-[#0e8ded] text-[13px] sm:text-sm"
                >
                  Zero Tolerance Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-[13px] mt-2 border-t-2 text-center border-gray-300 pt-4 flex flex-col gap-3 items-center sm:text-sm md:flex-row md:justify-between md:items-center">
          <p>
            <span>
              &copy; {new Date().getFullYear()}{" "}
              {process.env.NEXT_PUBLIC_COMPANY_WEBSITE} | All Rights Reserved
            </span>
          </p>
          <p>
            <span>Designed & Developed by tracoweb.com</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
