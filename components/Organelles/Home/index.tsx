import LandingHeader from "@/components/Molecules/Header";
import UserRoleCard from "@/components/Molecules/UserCard";
import ListingOfProducts from "@/components/Molecules/ProductsListing";
// import dynamic from "next/dynamic";

const LandingHomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-24 w-screen mb-12">
            <div className="w-full overflow-hidden">
                <LandingHeader/>
            </div>
            <UserRoleCard/>
            <ListingOfProducts/>
        </div>
    )
}

export default LandingHomePage;
