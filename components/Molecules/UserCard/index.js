"use client";

import { userRoleexplaination } from "@/utils/rolecard";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/Wrapper/universalState";

const UserRoleCard = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const { selectedUserData } = useAuth();

  return (
    <section className="flex xl:flex-row flex-col w-full max-w-[1280px] items-center justify-center gap-12">
      {userRoleexplaination.map((i, index) => {
        const { line1, line2, line3, role, link } = i;
        const isHovered = index === hoveredCard;
        return !selectedUserData?.role ? (
          <div
            className={`${
              i.role === "Producers" ? "bg-sellersbg" : "bg-buyersbg"
            } bg-no-repeat bg-center bg-cover md:p-20 p-10 w-[90%] sm:w-1/2 h-72 rounded-lg gap-1 flex flex-col ${
              isHovered ? "contrast-50 sm:contrast-75" : "contrast-100"
            } cursor-pointer flex flex-col items-center sm:items-start`}
            key={role}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h1 className="text-4xl md:text-5xl text-tertiary font-bold md:text-start text-center">{role}</h1>
            {isHovered ? (
              <>
                <p className="text-tertiary font-lightbold text-sm sm:text-lg font-semibold sm:font-normal md:text-start text-center">{line1}</p>
                <p className="text-tertiary font-lightbold text-sm sm:text-lg font-semibold sm:font-normal md:text-start text-center">{line2}</p>
                <Link
                  href={!selectedUserData?.role ? link : "/products"}
                  className="bg-secondary text-tertiary w-fit p-3 rounded-sm duration-300 hover:bg-tertiary hover:text-secondary ease-in"
                >
                  {!selectedUserData?.role ? line3 : "Shop now"}
                </Link>
              </>
            ) : null}
          </div>
        ) : selectedUserData?.role === i.role ? (
          <div
            className={`${
              i.role === "Producers" ? "bg-sellersbg" : "bg-buyersbg"
            } bg-no-repeat bg-center bg-cover md:p-20 p-10 w-[90%] sm:w-1/2 h-72 rounded-lg gap-1 flex flex-col contrast-75 cursor-pointer`}
            key={role}
          >
            <h1 className="text-5xl text-tertiary font-bold">{role}</h1>
            <p className="text-tertiary font-lightbold text-lg">{line1}</p>
            <p className="text-tertiary font-lightbold text-lg">{line2}</p>
            <Link
              href={!selectedUserData?.role ? link : "/products"}
              className="bg-secondary text-tertiary w-fit p-3 rounded-sm duration-300 hover:bg-tertiary hover:text-secondary ease-in"
            >
              {!selectedUserData?.role ? line3 : "Shop now"}
            </Link>
          </div>
        ) : null;
      })}
    </section>
  );
};

export default UserRoleCard;
