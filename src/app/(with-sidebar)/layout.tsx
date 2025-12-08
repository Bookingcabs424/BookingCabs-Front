"use client";
import Sidebar from "../../components/Sidebar";
import { AlignJustify, Bell, CircleUserRound, Search } from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../store/auth";
interface DashboardLayoutProps {
  children: ReactNode;
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showProfilePopup, setShowProfilePopup] = useState<boolean>(false);
  const profilePopupRef = useRef<HTMLDivElement | null>(null);
  const { logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLargeScreen = window.innerWidth >= 1024;
      setIsSidebarOpen(isLargeScreen);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profilePopupRef.current &&
        !profilePopupRef.current.contains(event.target as Node)
      ) {
        setShowProfilePopup(false);
      }
    }
    if (showProfilePopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfilePopup]);

  return (
    <>
      <div className="min-h-screen relative border-b border-gray-300">
        <div className="hidden lg:block">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>

        <div
          className={`dashboard-header h-[81px] border-b border-gray-300 ${
            isSidebarOpen === true ? "lg:ml-[300px]" : "lg:ml-[80px] ml-[0px]"
          } flex items-center px-3`}
        >
          <div className="left-content w-1/2 flex items-center gap-1 sm:gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-full transition cursor-pointer duration-100 hover:bg-gray-300"
            >
              <AlignJustify className="h-4 w-4 sm:w-6 sm:h-6" />
            </button>
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search Here..."
                className="border relative border-gray-300 outline-none rounded-md text-sm text-black w-[230px] sm:w-[350px] py-1 px-2 pr-[35px] sm:pr-[45px] sm:p-2"
              />
              <button className="text-gray-500 p-1 rounded-full transition  duration-100 hover:bg-gray-300 cursor-pointer absolute top-[3px] left-[205px] sm:left-[312px]">
                <Search className="h-4 w-4 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
          <div className="right-content w-1/2  flex items-center justify-end gap-2 px-1 sm:px-3 sm:gap-5">
            <button className="text-gray-500 cursor-pointer relative">
              <Bell className="h-4 w-4 sm:w-6 sm:h-6" />
              <span className="bg-red-400 text-black absolute top-[-8px] right-[-3px] rounded-[100%] py-[1px] px-[4px] text-[10px] font-bold">
                2
              </span>
            </button>{" "}
            <button
              onClick={() => setShowProfilePopup(!showProfilePopup)}
              className="text-gray-500 cursor-pointer flex items-center gap-1"
            >
              <CircleUserRound className="h-4 w-4 sm:w-6 sm:h-6" />
              <span className="hidden sm:block">User</span>
            </button>
          </div>

          {showProfilePopup && (
            <div
              ref={profilePopupRef}
              className="profile-popup border border-gray-300 bg-white w-[150px] h-[max-content] shadow-md absolute right-[10px] top-[62px]"
            >
              <ul className="flex flex-col gap-1">
                <Link
                  href="/profile"
                  className="text-[15px] px-3 py-[2px] font-[500] text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  Profile
                </Link>
                <li className="text-[15px] px-3 py-[2px] font-[500] text-gray-600 cursor-pointer hover:bg-gray-100">
                  2-Step Verify
                </li>
                <li
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="text-[15px] px-3 py-[2px] font-[500] text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
        <div
          className={`${
            isSidebarOpen === true ? "lg:ml-[300px]" : "lg:ml-[80px] ml-[0px]"
          }`}
        >
          {children}
        </div>
      </div>
      <div className="fixed top-[0px] left-0 bg-[#101828] h-[100vh] lg:hidden z-50">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
    </>
  );
}
