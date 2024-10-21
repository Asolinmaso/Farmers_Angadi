// app/checkout/page.js

"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Link from "next/link";
import IndividualCartProductCard from "@/components/Molecules/CartCard";
import { CartItemInterface } from "@/utils/interface";
import { generateInvoicePDF } from "../Invoice/InvoicePdfGeneration";

const CartOrganelles = () => {
  const { data: session } = useSession(); // Use session to get user info
  const [cartItems, setCartItems] = useState<CartItemInterface[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [totalCartAmount, setTotalCartAmount] = useState(0);
  const [editCard, setEditCard] = useState(false);
  const [deleteInitiated, setDeleteInitiated] = useState(false);
  const [changesRequestedcards, setChangesRequestCards] = useState<
    CartItemInterface[]
  >([]);


  useEffect(() => {
    // Recalculate total when cart items or their quantities change
    const total = cartItems.reduce((acc, item) => {
      const product = item.productDetails;
      const itemTotal = (product.cost - product.discount) * item.productCount;
      return acc + itemTotal;
    }, 0);
    setTotalCartAmount(total);
  }, [cartItems]);
  
  // Fetch cart items for the current user
  const fetchData = async () => {
    if (!session?.user?.id) return;
  
    try {
      setCartLoading(true);
  
      const fetchCartData = await axios.get(
        `/api/cart?userId=${session.user.id}`
      );
  
      if (fetchCartData.data?.items?.length) {
        // Filter out items with "PAID" status
        const activeCartItems = fetchCartData.data.items.filter(
          (item) => item.status === "CART"
        );
        setCartItems(activeCartItems);
        setEditCard(false);
      } else {
        setCartItems([]);
      }
  
      setCartLoading(false);
    } catch (err) {
      console.error("Error fetching cart data:", err);
      setCartLoading(false);
    }
  };
  

  useEffect(() => {
    if (session?.user?.id && (!cartItems.length || deleteInitiated)) {
      fetchData();
      setDeleteInitiated(false);
    }
  }, [session, deleteInitiated]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const onCheckout = async () => {
      
    if (!cartItems.length) {
      Swal.fire({
        icon: "error",
        text: "Your cart is empty.",
        timer: 3000,
      });
      return;
    }
  
    try {
      const res = await loadRazorpayScript();
  
      if (!res) {
        Swal.fire({
          icon: "error",
          text: "Razorpay SDK failed to load. Are you online?",
          timer: 3000,
        });
        return;
      }
  
      const response = await axios.post("/api/razorpayOrder", {
        amount: totalCartAmount,
        userId: session.user.id,
      });
  
      const { orderId } = response.data;
  
      if (!orderId) {
        Swal.fire({
          icon: "error",
          text: "Failed to create order. Please try again.",
          timer: 3000,
        });
        return;
      }
  
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalCartAmount * 100, // Convert amount to paisa
        currency: "INR",
        name: "Farmers Angadi",
        description: "Purchase from Angadi Shop",
        order_id: orderId,
        handler: async function (response) {
          Swal.fire({
            icon: "success",
            text: `Payment successful! Payment ID: ${response.razorpay_payment_id}`,
            timer: 3000,
          });
          await generateInvoicePDF({
            userName: session?.user?.username || "Customer",
            paymentId: response.razorpay_payment_id,
            cartItems: cartItems,
            totalAmount: totalCartAmount,
          });
          // Fetch updated cart data to refresh the view
          fetchData();
        },
        prefill: {
          name: session?.user?.username || "Your Name",
          email: session?.user?.email || "email@example.com",
          contact: "8220158319",
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Checkout error:", error);
      Swal.fire({
        icon: "error",
        text: "Something went wrong during the checkout process.",
        timer: 3000,
      });
    }
  };
  
  

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex items-center flex-col max-w-[1280px] w-full h-full p-6 gap-10">
        <h1 className="text-xl font-semibold text-[#333333] h-max max-w-[1024px] w-full uppercase">
          Cart
        </h1>

        {/* Cart Items Section */}
        <div className="flex flex-col items-center justify-start h-full w-full relative overflow-y-scroll min-h-[50vh]">
          {cartLoading && (
            <div className="absolute w-full h-full flex flex-col items-center justify-center bg-white/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="animate-spin"
              >
                <g fill="green">
                  <path
                    fillRule="evenodd"
                    d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14m0 3c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"
                    clipRule="evenodd"
                    opacity="0.2"
                  />
                  <path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7z" />
                </g>
              </svg>
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
                onItemCountChange={(updatedItem) => {
                  // Update the cartItems state with the new item count
                  setCartItems((prevItems) =>
                    prevItems.map((item) =>
                      item._id === updatedItem._id ? { ...item, productCount: updatedItem.productCount } : item
                    )
                  );
                }}
              />
            ))
          )}
        </div>

        {/* Total Cart Amount */}
        {cartItems.length > 0 && (
          <div className="w-full max-w-[1024px] flex justify-end items-center">
            <p className="text-2xl font-bold">
              Total: ₹ {totalCartAmount.toFixed(2)}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <button
              className="bg-blue-500 text-white px-5 py-3 rounded-sm min-w-[150px]"
              onClick={onCheckout}
            >
              Checkout
            </button>
          </div>
          <p className="text-sm text-[#333333]">(or)</p>
          <Link href={`/products`}>Keep Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default CartOrganelles;
