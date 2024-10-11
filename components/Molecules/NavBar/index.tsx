"use client";

import { IUsersDocument } from "@/models/user";
import { navOptions } from "@/utils/NavConstants";
import { CommonApplicationLogo } from "../../Atoms/LogoImage";
import SearchedDataListed from "@/components/Molecules/Searched";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/Wrapper/universalState";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Swal from "sweetalert2";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { AiOutlineShoppingCart, AiOutlineSearch } from "react-icons/ai";

const CommonNavBar = () => {
  const pathname = usePathname();
  const { selectedUserData } = useAuth() as { selectedUserData: IUsersDocument };

  const [isFixed, setIsFixed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [productName, setProductname] = useState("");

  const isAuthenticationPage = pathname === "/authentication";

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    const scrollThreshold = 120;

    if (scrollPosition > scrollThreshold && !isAuthenticationPage) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  }, [isAuthenticationPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const clearSearchText = () => setProductname("");

  const triggerWarnPopup = useCallback(() => {
    Swal.fire({
      icon: "warning",
      text: "Please login to access cart",
      timer: 3000,
    });
  }, []);

  const isUserAuthenticated = useMemo(() => !!selectedUserData?.email, [selectedUserData]);

  return (
    <>
      <nav
        className={`flex flex-row items-center justify-center w-full py-4 transition-all duration-300 ease-in-out bg-primary shadow-md ${
          isFixed ? "fixed top-0 z-50 w-full bg-opacity-90 backdrop-blur-sm shadow-lg" : ""
        }`}
      >
        <div className="sm:px-6 xl:p-0 flex flex-row items-center justify-between w-full max-w-[1280px] relative">
          <span className="xl:block hidden">
            <CommonApplicationLogo />
          </span>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex flex-row items-center justify-between w-5/6 gap-8">
            {!isAuthenticationPage && (
              <div className="relative w-[16em]">
                <input
                  className="w-full h-[2.5em] px-2 rounded-md border-2 border-gray-300 focus:border-blue-400 outline-none"
                  type="text"
                  placeholder="Search Products..."
                  value={productName}
                  onChange={(e) => setProductname(e.target.value)}
                />
                <button className="absolute right-0 h-[2.5em] px-2">
                  {!productName.length ? (
                    <AiOutlineSearch className="text-slate-500 text-xl font-bold" />
                  ) : (
                    <IoMdClose
                      className="text-slate-500 text-xl font-bold cursor-pointer"
                      onClick={clearSearchText}
                    />
                  )}
                </button>
              </div>
            )}

            {/* Navigation Links */}
            <ul className="flex flex-row items-center gap-8 w-full justify-evenly">
              {navOptions.map((i) => (
                <li key={i.name}>
                  <Link
                    className={`text-lg capitalize text-white duration-300 hover:text-secondary ${
                      pathname === i.link ? "text-secondary" : "text-white"
                    }`}
                    href={i.link}
                  >
                    {i.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* User Options */}
            <ul className="flex flex-row items-center gap-8 self-end">
              {!isAuthenticationPage && isUserAuthenticated ? (
                <>
                  <li>
                    <Link href="/cart">
                      <AiOutlineShoppingCart className="text-white text-sm bg-secondary rounded-full w-10 h-10 p-2 duration-300 hover:bg-tertiary hover:text-secondary" />
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-lg capitalize text-white duration-300 hover:text-secondary"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/authentication?page=signin"
                    className={`text-lg capitalize ${
                      isAuthenticationPage ? "text-secondary" : "text-white"
                    } duration-300 hover:text-secondary`}
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Mobile Hamburger Menu */}
          <GiHamburgerMenu
            className="block xl:hidden text-white text-2xl cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="absolute top-[4em] left-0 w-full bg-primary p-6 z-50 flex flex-col items-center gap-4">
            {!isAuthenticationPage && (
              <div className="relative w-full">
                <input
                  className="w-full h-[2.5em] px-4 rounded-md border-2 border-gray-300 focus:border-blue-400 outline-none"
                  type="text"
                  placeholder="Search Products..."
                  value={productName}
                  onChange={(e) => setProductname(e.target.value)}
                />
                <button className="absolute right-0 h-[2.5em] px-2">
                  {!productName.length ? (
                    <AiOutlineSearch className="text-slate-500 text-xl font-bold" />
                  ) : (
                    <IoMdClose
                      className="text-slate-500 text-xl font-bold cursor-pointer"
                      onClick={clearSearchText}
                    />
                  )}
                </button>
              </div>
            )}

            <ul className="flex flex-col items-center gap-4 w-full">
              {navOptions.map((i) => (
                <li key={i.name}>
                  <Link
                    className={`text-lg capitalize text-white duration-300 hover:text-secondary ${
                      pathname === i.link ? "text-secondary" : "text-white"
                    }`}
                    href={i.link}
                  >
                    {i.name}
                  </Link>
                </li>
              ))}

              {/* User Options */}
              {isUserAuthenticated ? (
                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-lg capitalize text-white duration-300 hover:text-secondary"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <Link
                    href="/authentication?page=signin"
                    className={`text-lg capitalize ${
                      isAuthenticationPage ? "text-secondary" : "text-white"
                    } duration-300 hover:text-secondary`}
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* Searched Products Listing */}
      {productName.length > 0 && (
        <SearchedDataListed productName={productName} setProductname={clearSearchText} />
      )}
    </>
  );
};

export default CommonNavBar;
