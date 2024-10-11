"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Link from "next/link";
import IndividualCartProductCard from "@/components/Molecules/CartCard";
import { CartItemInterface } from "@/utils/interface";
import { FaSpinner } from "react-icons/fa";

const CartOrganelles = () => {
  const { data: session } = useSession(); // Use session to get user info
  const [cartItems, setCartItems] = useState<CartItemInterface[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [editCard, setEditCard] = useState(false);
  const [deleteInitiated, setDeleteInitiated] = useState(false);
  const [changesRequestedcards, setChangesRequestCards] = useState<CartItemInterface[]>([]);

  // Fetch cart items for the current user
  const fetchData = async () => {
    if (!session?.user?.id) return; // Return early if no user ID in session

    try {
      setCartLoading(true);

      // Fetch cart items
      const fetchCartData = await axios.get(`/api/cart?userId=${session.user.id}`);

      // Log response for debugging
      console.log("Fetched Cart Data: ", fetchCartData.data); 

      // Check if the response contains items
      if (fetchCartData.data?.items?.length) {
        setCartItems(fetchCartData.data.items); // Set cart items
        setEditCard(false);
      } else {
        // If no cart items, clear state and show empty cart message
        setCartItems([]);
      }

      setCartLoading(false);
    } catch (err) {
      console.error("Error fetching cart data:", err);
      setCartLoading(false);
    }
  };

  // Trigger fetching cart items when user session is available or deletion occurs
  useEffect(() => {
    if (session?.user?.id && (!cartItems.length || deleteInitiated)) {
      fetchData();
      setDeleteInitiated(false);
    }
  }, [session, deleteInitiated]);

  // Handle checkout
  const onCheckout = () => {
    if (editCard) {
      Swal.fire({
        icon: "warning",
        text: "Please save your changes before proceeding to checkout.",
        timer: 3000,
      });
      return;
    }

    if (!cartItems.length) {
      Swal.fire({
        icon: "error",
        text: "Your cart is empty.",
        timer: 3000,
      });
      return;
    }

    Swal.fire({
      icon: "success",
      text: "Proceeding to checkout!",
      timer: 3000,
    });
  };

  // Save changes requested for cart items
  const onEditRequestedChanges = async () => {
    const promises = changesRequestedcards.map(async (item) => {
      const response = await axios.put(`/api/cart`, {
        cartId: item._id,
        productCount: item.productCount,
        status: "CART",
      });

      if (response.data && response.status === 200) {
        return item;
      }
      return null;
    });

    const results = await Promise.all(promises);
    if (results.some((item) => item !== null)) {
      setChangesRequestCards([]);
      Swal.fire({
        icon: "success",
        text: "Items edited successfully",
        timer: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex items-center flex-col max-w-[1280px] w-full h-full p-6 gap-10">
        <h1 className="text-xl font-semibold text-[#333333] h-max max-w-[1024px] w-full uppercase">Cart</h1>

        {/* Cart Items Section */}
        <div className="flex flex-col items-center justify-start h-full w-full relative overflow-y-scroll min-h-[50vh]">
          {cartLoading && (
            <div className="absolute w-full h-full flex flex-col items-center justify-center bg-white/60">
              <FaSpinner className="animate-spin" />
            </div>
          )}

          {!cartItems.length && !cartLoading ? (
            <div className="m-auto h-full w-full min-h-[50vh] text-center flex items-center justify-center">
              <p>No items available in the cart</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <IndividualCartProductCard
                key={item._id}
                items={item}
                changeIfEditted={setEditCard}
                changedData={changesRequestedcards}
                setChangedData={setChangesRequestCards}
                toDelete={setDeleteInitiated}
              />
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <button className="bg-blue-500 text-white px-5 py-3 rounded-sm min-w-[150px]" onClick={onCheckout}>
              Checkout
            </button>
          </div>
          <p className="text-sm text-[#333333]">(or)</p>
          <Link href={`/products`}>
            Keep Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartOrganelles;
