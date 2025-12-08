import "./globals.css";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
import Header from "../components/Header";

import Footer from "../components/Footer";
import { Poppins } from "next/font/google";
import Sidebar from "../components/Sidebar";
import ScrollToTopButton from "../components/ScrollToTopButton";
import Cookies from "js-cookie";

import { useEffect } from "react";
import { useAuth } from "../store/auth";
import { LoadScript } from "@react-google-maps/api";
import Script from "next/script";
import AuthGuard from "../components/AuthGuard";

export const metadata = {
  title: "Booking Cabs",
  description: "Book and manage rental cars",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Providers>
          <Header />
          <AuthGuard>{children}</AuthGuard>
          <Footer />
          <ToastContainer />
        </Providers>

        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
