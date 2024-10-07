"use client"
import AddProductForm from "@/components/Molecules/AddProduct"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function AdminPage () {
    const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page if not authenticated
    if (status === "unauthenticated") {
      router.push("/authentication");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>; // Optional loading state
  }

  if (session) {
    return (
      <div>
        <AddProductForm /> {/* Admin content */}
      </div>
    );
  }

  // Optional: Return null to not show anything while redirecting or unauthenticated
  return null;

  
};

