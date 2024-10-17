"use client";

import { IUsersDocument } from "@/models/user";
import { navOptions } from "@/utils/NavConstants";
import { CommonApplicationLogo } from "../../Atoms/LogoImage";
import SearchedDataListed from "@/components/Molecules/Searched";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/Wrapper/universalState";
import { useState, useMemo } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const CommonNavBar = () => {
  const pathname = usePathname();
  const { selectedUserData } = useAuth() as {
    selectedUserData: IUsersDocument;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [productName, setProductname] = useState("");

  const isAuthenticationPage = pathname === "/authentication";
  const clearSearchText = () => setProductname("");

  const isUserAuthenticated = useMemo(
    () => !!selectedUserData?.email,
    [selectedUserData]
  );

  return (
    <>
      <nav
        className={`sticky top-0 z-50 bg-primary shadow-md transition-all duration-300 ease-in-out backdrop-blur-md`}
      >
        <div className="flex flex-row items-center justify-between w-full max-w-[1280px] mx-auto p-4">
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      fill="green"
                      className="text-slate-500 text-xl font-bold"
                    >
                      <g>
                        <path
                          fillRule="evenodd"
                          d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14m0 3c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"
                          clipRule="evenodd"
                          opacity="0.2"
                        />
                        <path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7z" />
                      </g>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      fill="red"
                      className="text-slate-500 text-xl font-bold cursor-pointer"
                      onClick={clearSearchText}
                    >
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="2em"
                        height="2em"
                        viewBox="0 0 24 24"
                        className="bg-secondary rounded-full w-10 h-10 p-2 duration-300 hover:bg-tertiary hover:text-secondary"
                      >
                        <path
                          fill="green"
                          d="M17 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2M1 2v2h2l3.6 7.59l-1.36 2.45c-.15.28-.24.61-.24.96a2 2 0 0 0 2 2h12v-2H7.42a.25.25 0 0 1-.25-.25q0-.075.03-.12L8.1 13h7.45c.75 0 1.41-.42 1.75-1.03l3.58-6.47c.07-.16.12-.33.12-.5a1 1 0 0 0-1-1H5.21l-.94-2M7 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2"
                        />
                      </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            className="block xl:hidden text-white text-2xl cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <path fill="green" d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z" />
          </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      fill="green"
                      className="text-slate-500 text-xl font-bold"
                    >
                      <g>
                        <path
                          fillRule="evenodd"
                          d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14m0 3c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"
                          clipRule="evenodd"
                          opacity="0.2"
                        />
                        <path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7z" />
                      </g>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      fill="red"
                      className="text-slate-500 text-xl font-bold cursor-pointer"
                      onClick={clearSearchText}
                    >
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
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
        <SearchedDataListed
          productName={productName}
          setProductname={clearSearchText}
        />
      )}
    </>
  );
};

export default CommonNavBar;
