"use client";

import Link from "next/link";
import Image from "next/image";
import {
  House,
  LogIn,
  UsersRound,
  Phone,
  Mail,
  AlignJustify,
  CircleUserRound,
  BadgePercent,
  Search,
  ShoppingCart,
  LogOut,
  User2Icon,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import {
  getCityByname,
  getCityByNameHeader,
  useCityActivePackage,
  useGetCompanyDetail,
} from "../hooks/useCommon";
import { useAuth } from "../store/auth";
import {
  activeCity,
  useBookingSearchForm,
  useSelectedVehicle,
} from "../store/common";
import Cookies from "js-cookie";
import { createSocket } from "../app/socket";
import type { Socket } from "socket.io-client";
interface WalletData {
  wallet_amount: number;
  credit_balance: number;
  // Add other properties you expect to receive from the socket
}
import { useRouter } from "next/navigation";
export default function Header() {
  const socketRef = useRef<Socket | null>(null);
  const [wallet, setWallet] = useState<WalletData>();
  const [currentBalance, setCurrentBalance] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  useEffect(() => {
    // const socket = createSocket();
    // socketRef.current = socket;
    // socket.on("connect", () => {
    //   socket.emit("get_user"); // Replace 1 with actual userId
    // });
    // socket.on("user_data", (data) => {
    //   if (data.error) {
    //   } else {
    //     setWallet(data);
    //   }
    // });
    // socket.on("disconnect", () => {});
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const sendMessage = () => {
    const message = "Hello from client!";
    socketRef.current?.emit("send_message", { message });
  };

  useEffect(() => {
    const balance = localStorage.getItem("currentBalance");
    setCurrentBalance(balance);
  }, []);
  const phone = process.env.NEXT_PUBLIC_COMPANY_MOBILE;
  const email = process.env.NEXT_PUBLIC_COMPANY_EMAIL;
  // Temporary values
  const cities = ["All", "New Delhi", "Punjab", "Kashmir", "Gujarat"];

  const hamburgerItemsList = [
    "Home",
    "About Us",
    "Support",
    "Contact Us",
    "Sign Up",
    "Login",
  ];

  const suggestions = [
    "Lunch",
    "Restaurant",
    "Dinner",
    "Parking",
    "Valet",
    "Airport Transfer",
    "Outstation",
    "City Taxi",
  ];
  const router = useRouter();
  const profileOptions = [
    { text: "My Account", link: "/dashboard", onClick: null },
    {
      text: "Relationship Manager",
      link: "/relationship-manager",
      onClick: null,
    },
    {
      text: `Credit Balance ₹${currentBalance ?? 0}`,
      link: "#",
      onClick: null,
    },
    { text: `Wallet ₹${wallet?.wallet_amount ?? 0}`, link: "#", onClick: null },
    // { text: "Make Payment", link: "/make-payment", onClick: null },
    // { text: "Talk to Us", link: "/talk-to-us", onClick: null },
    { text: "Contact Us", link: "/contact", onClick: null },
    { text: "Refer & Earn", link: "/refer-earn", onClick: null },
    { text: "Offer", link: "/offers", onClick: null },
    { text: "Compare", link: "/compare", onClick: null },
    {
      text: "Logout",
      link: "#", // Use '#' or empty string for actions that shouldn't navigate
      onClick: () => {
        logout();
        router.push("/");
      },
    },
    {
      text: "Delete Account",
      link: "#",
      onClick: () => setDeleteModalOpen(true),
    },
  ];

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter On Search Bar
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [dropDownOpen, setDropdownOpen] = useState<number | null>(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [openHeaderHamburger, setOpenHeaderHamburger] =
    useState<boolean>(false);
  const [isLoggedIn, setIsLogged] = useState<boolean>(false);

  const [openProfileBox, setOpenProfileBox] = useState<boolean>(false);
  const { data: getCompanyDetail } = useGetCompanyDetail();
  const {
    data: activePackage,
    isLoading,
    isError,
    error: activeError,
    refetch: refetchActive,
  } = useCityActivePackage(city, 1);

  const { user, logout } = useAuth();
  const { booking, setBooking } = useSelectedVehicle();
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["SearchCity"],
    queryFn: () =>
      api.get(`/city/packageCity?city_name=${query}`).then((res) => res.data),
    enabled: false, // Prevent auto-fetching
  });
  const { data: citylist, refetch: refetChList } = getCityByNameHeader(
    String(query)
  );

  // Handle Input Box Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    refetch();
  };

  const params = new URLSearchParams();

  // Show all Suggestions function
  // const handleSuggestionClick = (value: string) => {
  //   setQuery(value);
  //   setCity(value);
  //   setShowSuggestions(false);

  //   const newUrl = `${window.location.pathname}${query.toString()}`;
  //   console.log("newURL", newUrl);

  //   console.log(value);
  // const debounceTimer = setTimeout(() => {
  //   const newUrl = `${window.location.pathname}?${query.toString()}`;
  //   if (newUrl !== window.location.pathname + window.location.search) {
  //     router.replace(newUrl, { scroll: false });
  //     router.push(newUrl);
  //   }
  // }, 1000); // 500ms delay

  // return () => clearTimeout(debounceTimer);
  // };

  const handleSuggestionClick = (value: string) => {
    setQuery(value);
    setCity(value);
    setShowSuggestions(false);

    // ❌ Wrong: query is still old
    // const newUrl = `${window.location.pathname}${query.toString()}`;

    // ✅ FIX — use value instead of query
    const newUrl = `${window.location.pathname}${encodeURIComponent(
      value
    )}`;

    console.log("newURL", newUrl);
    router.push(newUrl as any);
  };

  useEffect(() => {
    console.log("query", query);
  }, [query]);

  const handleSearch = (e: any) => {
    e.preventDefault();
    const debounceTimer = setTimeout(() => {
      const newUrl = `${window.location.pathname}?${query.toString()}`;
      if (newUrl !== window.location.pathname + window.location.search) {
        router.replace(newUrl as any, { scroll: false });
        router.push(newUrl as any);
      }
    }, 1000); // 500ms delay

    return () => clearTimeout(debounceTimer);
  };

  const logOut = () => {
    logout();
    setBooking(null);
    localStorage.clear();
    sessionStorage.clear();
  };
  const { cityData, setCityData } = activeCity();

  useEffect(() => {
    if (city) {
      refetchActive();
    }
  }, [city]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenProfileBox(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (cityData?.city_name) {
      setQuery(cityData?.city_name);
    }
  }, [cityData]);
  useEffect(() => {
    if (citylist?.data?.length > 0) {
      setShowSuggestions(true);
    }
  }, [citylist]);
  useEffect(() => {
    if (true) {
      console.log({ getCompanyDetail });
    }
  }, [getCompanyDetail]);

const handleDeleteAccount = async () => {
  try {
    debugger;
    const res = await api.post("/user/delete", {
      userId: user?.id,
    });

    if (res.status === 200) {
      logout();
      localStorage.clear();
      sessionStorage.clear();
      router.push("/");
    }
  } catch (err) {
    console.error("Delete Error:", err);
  }
};


  return (
    <>
      {/* Top Header */}
      <header className="flex bg-gray-100 shadow-md px-3 border-b border-gray-200 justify-between">
        <div className="flex space-x-2 px-2 py-2 rounded-md sm:px-6 sm:space-x-9">
          <Link
            href={`tel:${getCompanyDetail?.mobile_no || phone}`}
            className="flex text-[11px] items-center gap-1 text-gray-500 font-light sm:text-[12px] sm:text-sm lg:text-md"
          >
            <Phone className="w-3 h-3 sm:w-4 h-4 lg:w-5 h-5 text-gray-500" />
            <span>{getCompanyDetail?.mobile_no || phone}</span>
          </Link>
          <Link
            href={`mailto:${getCompanyDetail?.email || email}`}
            className="flex text-[11px] items-center gap-1 text-gray-500 font-light sm:text-[12px] sm:text-sm  lg:text-md"
          >
            <Mail className="w-3 h-3 sm:w-4 h-4 lg:w-5 h-5 text-gray-500" />
            <span>{getCompanyDetail?.email || email}</span>
          </Link>
        </div>
        <button
          title="Get Quote"
          className="text-[12px] sm:text-sm bg-[#dfad08] px-3 cursor-pointer flex items-center hover:bg-[#9d7a20] transition sm:px-5"
        >
          <span className="hidden lg:block">Get Quote</span>
          <span className="block lg:hidden">
            <BadgePercent className="w-5 h-5 sm:h-6 sm:w-6" />
          </span>
        </button>
      </header>
      {/* Middle Header */}

      <header className="bg-gray-100 shadow-md border-b border-gray-200 px-5 py-2 flex items-center justify-between md:px-9">
        <div className="w-[20%] md:w-[25%] lg:w-[20%]">
          <Link className="max-w-[100px] md:w-1/2 lg:w-1/8" href="/">
            <Image
              src={getCompanyDetail?.company_logo_path || "/images/logo.png"}
              alt="Logo"
              width={160}
              height={45}
              className="w-[120px] h-[30px] lg:w-[160px] lg:h-[45px] object-contain"
              priority
              unoptimized
            />
          </Link>
        </div>

        <div className="flex items-center justify-between gap-3 relative w-[75%] sm:w-[80%] md:w-[75%] lg:w-[80%]">
          <div className="relative w-full max-w-[350px] md:w-full md:max-w-[450px] lg:w-full lg:max-w-[550px]">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search here..."
              className="bg-white outline-none border border-gray-200 rounded-md py-2 text-[11px] w-full px-[10px] sm:px-[10px] sm:text-[12px] sm:text-sm lg:px-[10px]"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(query.length > 0)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowSuggestions(false);
                }
              }}
            />
            {/* Select */}
            {citylist?.data?.length > 0 && showSuggestions && (
              <div
                className="absolute top-[-25px] z-10 mt-15 w-60 max-h-40 overflow-y-auto rounded-md border border-gray-300 bg-white text-[12px] sm:text-sm shadow-lg"
                onMouseLeave={() => setDropdownOpen(null)}
              >
                {citylist?.data?.map((item: any) => (
                  <div
                    key={item?.id}
                    className="cursor-pointer text-[12px] px-3 py-1 hover:bg-gray-100"
                    onClick={(e) => {
                      // setValue("city", item?.city_name);
                      handleSuggestionClick(String(item?.city_name));
                      setCityData({
                        city_id: item?.city_id,
                        city_name: item?.city_name,
                      });
                    }}
                  >
                    {item?.city_name}
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={handleSearch}
              className="absolute right-[10px] top-1/2 -translate-y-1/2 bg-[#dfad0a] px-3 py-[3px] font-[500] rounded-sm cursor-pointer hover:bg-[#9d7a20] transition text-[10px] hidden sm:text-[12px] sm:text-sm sm:block"
            >
              Search
            </button>
            <button className="absolute right-[10px] top-1/2 -translate-y-1/2 bg-[#dfad0a] px-1 py-[3px] font-[500] rounded-full cursor-pointer hover:bg-[#9d7a20] transition block sm:hidden">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="w-[5%] flex justify-end lg:w-[25%]">
            {!user ? (
              <div className="hidden space-x-6 w-full justify-end lg:flex">
                {user ? (
                  <>
                    <LogOut
                      className=" cursor-pointer text-red-500"
                      onClick={logOut}
                    />
                    {/* <span className="text-[12px] sm:text-sm xl:text-base">LogOut</span> */}
                  </>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="flex items-center gap-2 text-gray-800 font-light hover:text-[#0e8ded]"
                    >
                      <UsersRound className="w-4 h-4 xl:w-5 xl:h-5" />
                      <span className="text-[12px] sm:text-sm xl:text-base">
                        Sign Up
                      </span>
                    </Link>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 text-gray-800 font-light hover:text-[#0e8ded]"
                    >
                      <>
                        <LogIn className="w-4 h-4 xl:w-5 xl:h-5" />
                        <span className="text-[12px] sm:text-sm xl:text-base">
                          Login
                        </span>
                      </>
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <div
                ref={dropdownRef}
                className="hidden lg:flex items-center relative"
              >
                <div className="relative flex items-center gap-2">
                  <button
                    onClick={() => setOpenProfileBox(!openProfileBox)}
                    className="flex items-center gap-1 text-gray-800 font-light hover:text-[#0e8ded] px-2 py-1 cursor-pointer"
                  >
                    <CircleUserRound className="w-5 h-5" />
                    <span>{user?.first_name}</span>
                  </button>
                  <Link href={`/shopping-cart`}>
                    <ShoppingCart />
                  </Link>
                  {openProfileBox && (
                    <div className="absolute top-full right-0 mt-2 bg-white w-[200px] flex flex-col items-start justify-center rounded-md shadow-md z-30 border border-gray-200">
                      {profileOptions.map((item: any, idx) => (
                        <Link
                          key={idx}
                          href={item.link}
                          onClick={(e) => {
                            if (item.onClick) {
                              e.preventDefault(); // Prevent navigation
                              item.onClick();
                            }
                          }}
                          className="w-full px-3 py-2 text-[12px] sm:text-sm text-gray-700 hover:bg-[#dfad08] hover:text-black border-b border-gray-200 last:border-b-0"
                        >
                          {item.text}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            <button
              onClick={() => setOpenHeaderHamburger(!openHeaderHamburger)}
              className="relative flex w-fit items-center justify-end lg:hidden"
            >
              <AlignJustify className="h-4 w-4 cursor-pointer sm:w-5 h-5" />
              {openHeaderHamburger && (
                <div className="absolute top-full right-0 mt-2 bg-white w-[120px] flex flex-col items-start justify-center rounded-sm shadow-md z-50 border border-gray-200">
                  <ul className="flex flex-col w-full items-start justify-start">
                    <li className="w-full border-b border-gray-300">
                      <Link
                        href="/"
                        className="w-full block text-start px-3 py-2 text-[12px] sm:text-sm text-gray-700 hover:bg-[#dfad08] hover:text-black"
                      >
                        Home
                      </Link>
                    </li>
                    <li className="w-full border-b border-gray-300">
                      <Link
                        href="/about"
                        className="w-full block text-start px-3 py-2 text-[12px] sm:text-sm text-gray-700 hover:bg-[#dfad08] hover:text-black"
                      >
                        About Us
                      </Link>
                    </li>
                    <li className="w-full border-b border-gray-300">
                      <Link
                        href={"/support" as any}
                        className="w-full block text-start px-3 py-2 text-[12px] sm:text-sm text-gray-700 hover:bg-[#dfad08] hover:text-black"
                      >
                        Support
                      </Link>
                    </li>
                    <li className="w-full border-b border-gray-300">
                      <Link
                        href="/contact"
                        className="w-full block text-start px-3 py-2 text-[12px] sm:text-sm text-gray-700 hover:bg-[#dfad08] hover:text-black"
                      >
                        Contact Us
                      </Link>
                    </li>
                    <li className="w-full border-b border-gray-300">
                      <Link
                        href="/signup"
                        className="w-full block text-start px-3 py-2 text-[12px] sm:text-sm text-gray-700 hover:bg-[#dfad08] hover:text-black"
                      >
                        Sign Up
                      </Link>
                    </li>
                    <li className="w-full">
                      <Link
                        href="/login"
                        className="w-full block text-start px-3 py-2 text-[12px] sm:text-sm text-gray-700 hover:bg-[#dfad08] hover:text-black"
                      >
                        Login
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Header */}
      {city ? (
        <header className="w-[100%] flex justify-end bg-[#9d7a20] py-4 shadow-md pr-9">
          <div className="flex space-x-9">
            {activePackage?.data?.map((item: any) => (
              <Link
                key={item.id}
                href={`/city-taxi/${item.id}` as any}
                className="flex items-center gap-1 text-white font-[600] hover:text-[#0e8ded]"
              >
                <span className="fa-facebook"></span>
                <span className={item?.icon}></span>
                <span>{item.name}</span>
              </Link>
            ))}

            {/* {!isLoading && !isError && activePackage?.data?.length === 0 && (
              <span className="text-white font-[600]">No Active Package</span>
            )} */}
            <Link
              href="/"
              className="flex items-center gap-1 text-white font-[600] hover:text-[#0e8ded]"
            >
              <House className="w-5 h-5" />
              <span>Home</span>
            </Link>
          </div>
        </header>
      ) : (
        <header className="w-[100%] flex justify-end bg-[#9d7a20] py-4 shadow-md pr-9 hidden lg:flex">
          <div className="flex space-x-9">
            <Link
              href="/"
              className="flex items-center gap-1 text-white font-[600]"
            >
              <span>Home</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-1 text-white font-[600]"
            >
              <span>About Us</span>
            </Link>
            <Link
              href={"/support" as any}
              className="flex items-center gap-1 text-white font-[600]"
            >
              <span>Support</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-1 text-white font-[600]"
            >
              <span>Contact us</span>
            </Link>
          </div>
        </header>
      )}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-3">Delete Account?</h2>

            <p className="text-gray-600 mb-5 text-sm">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
