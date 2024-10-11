"use client";

import Link from "next/link";
import { varietyOfButtons } from "@/utils/condition";
import dynamic from "next/dynamic";

// Dynamically load AllCategoryListed
const AllCategoryListed = dynamic(() => import("@/components/Molecules/categoryListed"), { ssr: false });

const ListingOfProducts = () => {
  return (
    <section className="flex flex-col items-center gap-6">
      <h1 className="text-primary capitalize text-3xl sm:4xl lg:6xl font-semibold">{`Fresh Product's Daily`}</h1>
      <p className="text-primary text-[14px] sm:text-[18px] text-center w-4/6">
        On the other hand we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of
      </p>
      <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row items-center justify-between w-full px-4 sm:w-4/6 sm:px-0">
        {varietyOfButtons.map((i) => (
          <Link
            className="border-[1px] p-3 w-10/12 sm:w-max border-secondary rounded-sm duration-300 hover:text-tertiary hover:bg-secondary"
            key={i.text}
            href={i.link}
          >
            {i.text}
          </Link>
        ))}
      </div>
      <AllCategoryListed />
    </section>
  );
};

export default ListingOfProducts;
