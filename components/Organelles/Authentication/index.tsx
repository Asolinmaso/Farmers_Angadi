"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

import AUthImage from "@/public/assets/authentication.jpg";
import LoginForm from "@/components/Molecules/Login";
import SignupForm from "@/components/Molecules/Signup";

const AuthenticationComponent = () => {
const searchParams = useSearchParams()

const search = searchParams.get('page')

  return (
    <section className="flex flex-col xl:items-center xl:justify-center w-full min-h-screen h-full sm:bg-transparent bg-[#5BA36B]">
      <section className="flex flex-row items-center justify-center xl:w-10/12 w-full bg-[#5BA36B] h-5/6 max-w-[1280px] max-h-[800px] xl:rounded-lg">
        <div className="w-2/4 text-center md:block hidden h-full">
          <Image
            src={AUthImage}
            alt="no image"
            width={1000}
            height={1000}
            className="w-full h-full object-cover max-h-[800px] min-h-[630px] xl:rounded-l-lg"
            loading="lazy"
            quality={100}
          />
        </div>
        <div className="md:w-2/4 w-full text-center flex flex-col items-center justify-center gap-16">
          {search !== "signup" ? <LoginForm /> : <SignupForm/>}
          <section className="p-3 flex items-center justify-between lg:w-3/4 w-full">
            <p className="text-tertiary hover:text-secondary duration-300 cursor-pointer hover:font-lightbold">
              Forgot Password ?
            </p>
            <Link className="text-tertiary hover:text-secondary duration-300 cursor-pointer hover:font-lightbold" href={search !== "signup" ? "/authentication?page=signup" : "/authentication?page=signin"}>
                {search !== "signup" ? "Create an account" : "Already have an account"}
            </Link>
          </section>
        </div>
      </section>
    </section>
  );
};

export default AuthenticationComponent;
