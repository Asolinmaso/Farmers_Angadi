// app/page.tsx or app/landing/page.tsx (if it's a landing page)
import dynamic from "next/dynamic";

// Dynamically load components
const LandingHeader = dynamic(() => import("@/components/Molecules/Header"), { ssr: false });
const UserRoleCard = dynamic(() => import("@/components/Molecules/UserCard"), { ssr: false });
const ListingOfProducts = dynamic(() => import("@/components/Molecules/ProductsListing"), { ssr: false });

const LandingHomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-24  mb-12">
      <div className="w-full overflow-hidden">
        <LandingHeader />
      </div>
      <UserRoleCard />
      <ListingOfProducts />
    </div>
  );
};

export default LandingHomePage;
