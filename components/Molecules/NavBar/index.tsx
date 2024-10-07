"use client";

import { IUsersDocument } from "@/models/user";

import { navOptions } from "@/utils/NavConstants";
import { CommonApplicationLogo } from "../../Atoms/LogoImage";
import SearchedDataListed from "@/components/Molecules/Searched";

import { usePathname } from "next/navigation";
import { useAuth } from "@/components/Wrapper/universalState";
import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  LegacyRef,
  SetStateAction,
  Dispatch,
} from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

import Swal from "sweetalert2";

import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { AiOutlineShoppingCart, AiOutlineSearch } from "react-icons/ai";
import { CiLogin } from "react-icons/ci";

type StateSetState = {
  selectedUserData: IUsersDocument;
  setSelectedUserData: Dispatch<SetStateAction<IUsersDocument>>;
};

const CommonNavBar = () => {
  const pathname = usePathname();

  const { selectedUserData } = useAuth() as StateSetState;

  const [isFixed, setIsFixed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [productName, setProductname] = useState("");

  const elementRef1: LegacyRef<HTMLElement> | undefined = useRef(null);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;

    const scrollThreshold = 120;

    if (scrollPosition > scrollThreshold && pathname !== "/authentication") {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  };

  const onChangeSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    setProductname(e.target.value);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    setIsOpen(false);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    setProductname("");
  }, [isOpen]);

  const clearSearchText = () => {
    return setProductname("");
  };

  const triggerWarnPopup = () => {
    return Swal.fire({
      icon: "warning",
      text: "Please login to access cart",
      timer: 3000,
    });
  };

  return (
    <>
      <nav
        className={`flex flex-row items-center justify-center w-full bg-primary py-6 ${
          isFixed ? "fixed top-0 z-50 transition duration-300 ease-in-out" : ""
        }`}
        ref={elementRef1}
      >
        <div
          className={`sm: px-6 xl:p-0 flex flex-row items-center justify-between w-full max-w-[1280px] relative`}
        >
          <span className="xl:block hidden">
            <CommonApplicationLogo />
          </span>
          <div
            className={`sm: hidden xl:flex flex-row items-center justify-between w-5/6 gap-8`}
          >
            <div className="flex flex-row items-center justify-center gap-8 w-full">
              {pathname !== "/authentication" ? (
                <div className="relative w-[max-content]">
                  <input
                    className="w-[16em] h-[2.5em] px-2 rounded-sm outline-0"
                    type="text"
                    placeholder="Search Products..."
                    value={productName}
                    onChange={(e) => onChangeSearchText(e)}
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
              ) : null}

              <ul className="flex flex-row items-center gap-8 w-full justify-evenly">
                {navOptions.map((i) => (
                  <li key={i.name}>
                    <Link
                      className={`text-lg capitalize text-tertiary duration-300 hover:text-secondary ${
                        pathname === i.link ? "text-secondary" : "text-tertiary"
                      }`}
                      href={i.link}
                    >
                      {i.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="flex flex-row items-center gap-8 self-end">
  {pathname !== "/authentication" && selectedUserData?.email ? (
    <>
      <li className="">
        <Link href="/cart">
          <AiOutlineShoppingCart className="text-tertiary text-sm bg-secondary rounded-full w-10 h-10 p-2 duration-300 hover:bg-tertiary hover:text-secondary" />
        </Link>
      </li>
      <li className="">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-lg capitalize text-tertiary duration-300 hover:text-secondary"
        >
          Logout
        </button>
      </li>
    </>
  ) : (
    <li className="w-full">
      <Link
        href="/authentication?page=signin"
        className={`text-lg capitalize ${
          pathname === "/authentication"
            ? "text-secondary"
            : "text-tertiary"
        } duration-300 hover:text-secondary`}
      >
        Login
      </Link>
    </li>
  )}
</ul>

          </div>
          {isOpen ? (
            <div className="fixed inset-0 top-0 w-screen h-screen p-8 bg-black/50 z-[100]">
              <div
                className="absolute inset-0 z-[200] h-full"
                onClick={() => setIsOpen(false)}
              ></div>
              <div className="sm:w-3/4 sm:h-full h-full w-full absolute top-0 right-0 flex flex-col bg-slate-200 z-[999] p-8 gap-6">
                <div className="w-full flex items-end justify-end">
                  <IoMdClose
                    className="text-xl cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                  />
                </div>
                <div className="flex flex-col gap-4 items-center justify-center">
                  {pathname !== "/authentication" ? (
                    selectedUserData?.email ? (
                      <Link
                        href="/"
                        className="grid grid-cols-10 items-center justify-center gap-5 w-10/12 bg-slate-400 p-2 text-lg"
                      >
                        <AiOutlineShoppingCart className="text-tertiary text-sm bg-secondary col-span-4 rounded-full w-10 h-10 mx-auto p-2 duration-300 hover:bg-tertiary hover:text-secondary" />
                        <p className="col-span-6">Cart</p>
                      </Link>
                    ) : (
                      <button
                        onClick={triggerWarnPopup}
                        className="grid grid-cols-10 items-center justify-center gap-5 w-10/12 bg-slate-400 p-2 text-lg"
                      >
                        <AiOutlineShoppingCart className="text-tertiary text-sm bg-secondary col-span-4 rounded-full w-10 h-10 mx-auto p-2 duration-300 hover:bg-tertiary hover:text-secondary" />
                        <p className="col-span-6 text-start">Cart</p>
                      </button>
                    )
                  ) : null}

                  {!selectedUserData?.email ? (
                    <Link
                      href="/authentication?page=signin"
                      className={`text-lg capitalize grid grid-cols-10 items-center justify-center p-2 w-10/12 gap-5 ${
                        pathname === "/authentication"
                          ? "text-tertiary bg-secondary"
                          : "text-black bg-slate-400"
                      } duration-300 hover:text-tertiary`}
                    >
                      <CiLogin className="text-tertiary text-sm bg-secondary rounded-full w-10 h-10 col-span-4 p-2 duration-300 hover:bg-tertiary hover:text-secondary mx-auto" />
                      <p className="col-span-6">Login</p>
                    </Link>
                  ) : null}

                  {navOptions.map((i) => (
                    <Link
                      key={i.name}
                      className={`text-lg grid grid-cols-10 capitalize text-black duration-300 w-10/12 p-2 items-center justify-center gap-5 hover:text-tertiary ${
                        pathname === i.link
                          ? "text-white bg-secondary"
                          : "text-black bg-slate-400"
                      }`}
                      href={i.link}
                    >
                      {i.icon(
                        "text-tertiary text-sm bg-secondary rounded-full w-10 h-10 col-span-4 p-2 duration-300 hover:bg-tertiary hover:text-secondary mx-auto"
                      )}
                      <p className="col-span-6">{i.name}</p>
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center mt-auto">
                  <div className="flex w-10/12 sm:items-center sm:justify-center items-start">
                    <CommonApplicationLogo />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          <GiHamburgerMenu
            className="sm:block xl:hidden text-white text-xl cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
          {pathname !== "/authentication" ? (
            <div className="relative w-[max-content] xl:hidden block">
              <input
                className="w-[14em] sm:w-[16em] h-[2.5em] sm:px-2 pl-4 sm:rounded-sm outline-0 rounded-3xl"
                type="text"
                placeholder="Search Products..."
                value={productName}
                onChange={onChangeSearchText}
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
          ) : null}
        </div>
      </nav>
      {productName.length ? (
        <SearchedDataListed
          productName={productName}
          setProductname={clearSearchText}
        />
      ) : null}
    </>
  );
};

export default CommonNavBar;
