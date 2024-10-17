"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { productOnlyInterface } from "@/utils/interface";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

const IndividualProductView = ({
  params,
}: {
  params: { productId: string; category: string };
}) => {
  const { data: session } = useSession();
  const [productData, setProductData] = useState<productOnlyInterface | null>(
    null
  );
  const [relatedProducts, setRelatedProducts] = useState<
    productOnlyInterface[]
  >([]);
  const [trackProductCount, setTrackProductCount] = useState(1);

  const { productId, category } = params;

  useEffect(() => {
    fetchProductData();
    fetchRelatedProducts();
  }, [productId, category]);

  const fetchProductData = async () => {
    try {
      const response = await axios.get(`/api/product?productId=${productId}`);
      if (response.data && response.data.data) {
        setProductData(response.data.data); // Directly assign the product object
      }
    } catch (error) {
      console.error("Error fetching product data:", error.message);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(
        `/api/product?category=${category}&limit=4`
      );
      if (response.data && response.data.data.length) {
        setRelatedProducts(
          response.data.data.filter(
            (p: productOnlyInterface) => p._id.toString() !== productId
          )
        );
      }
    } catch (error) {
      console.error("Error fetching related products:", error.message);
    }
  };

  const handleProductCountChange = (operation: "increase" | "decrease") => {
    setTrackProductCount((prev) => {
      if (
        operation === "increase" &&
        prev < (productData?.stockData.stock || 99)
      )
        return prev + 1; // Limit to stock count
      if (operation === "decrease" && prev > 1) return prev - 1;
      return prev;
    });
  };

  const addToCart = async () => {
    if (!session || !session.user) {
      Swal.fire({
        icon: "warning",
        text: "You need to be logged in to add items to cart",
        timer: 3000,
      });
      return;
    }

    try {
      await axios.post(`/api/cart`, {
        productId: productData?._id,
        productCount: trackProductCount,
        userId: session.user.id, // Pass the userId from session
        status: "CART",
      });
      Swal.fire({
        icon: "success",
        text: "Added to cart successfully",
        timer: 3000,
      });
      setTrackProductCount(1); // Reset the count after adding to cart
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Error adding to cart",
        timer: 3000,
      });
    }
  };

  if (!productData) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-200">
        <p className="text-4xl font-bold capitalize text-white [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
          No data available
        </p>
      </div>
    );
  }

  const discountedPrice = (
    productData.cost - productData.discount >= 0
      ? productData.cost - productData.discount
      : 0
  ).toFixed(2);

  const discountPercentage = (
    (productData.discount / productData.cost) *
    100
  ).toFixed(0); // Convert it to a percentage

  const isOutOfStock = trackProductCount >= (productData.stockData?.stock || 0); // Check if out of stock

  return (
    <div className="w-full h-full flex flex-col items-center gap-10 max-w-[1280px] self-center mt-8">
      {/* Main Product Section */}
      <div className="flex flex-col lg:flex-row w-11/12 sm:w-8/12 lg:w-full h-max bg-white shadow-lg rounded-lg p-6">
        <div className="w-full h-full flex items-center justify-center border border-slate-300 rounded-lg overflow-hidden lg:w-1/2 mb-6 lg:mb-0">
          <Image
            src={productData.image}
            alt={productData.name}
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col items-start w-full h-full bg-slate-100 p-8 relative gap-4 lg:w-1/2 rounded-lg">
          {productData.discount && (
            <div className="absolute top-4 right-4 bg-red-500 text-white font-semibold py-1 px-4 rounded-full">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Product Name */}
          <h1 className="capitalize text-3xl font-extrabold mb-2">
            {productData.name}
          </h1>

          {/* Price and Measurement */}
          <div className="flex items-center gap-4 text-lg">
            <p
              className={` ${
                productData.discount
                  ? "line-through text-gray-500"
                  : "text-black"
              }`}
            >
              ₹ {productData.cost.toFixed(2)}
            </p>
            {productData.discount && (
              <p className="text-green-600 font-semibold">
                ₹ {discountedPrice}
              </p>
            )}
            <p className="capitalize text-sm text-gray-600">
              Per {productData.measurement || "Kg"}
            </p>
          </div>

          {/* Quantity and Total Price */}
          <div className="flex items-center gap-3 mt-4">
            <input
              disabled
              value={`₹ ${(Number(discountedPrice) * trackProductCount).toFixed(
                2
              )}`}
              className="bg-white h-10 px-3 w-full max-w-[150px] text-xl font-medium border rounded-lg shadow-sm text-center"
            />
            <div className="flex items-center gap-2">
              <button
                className="h-10 w-10 text-xl font-bold bg-slate-400 text-white rounded-lg"
                onClick={() => handleProductCountChange("decrease")}
              >
                -
              </button>
              <input
                disabled
                value={trackProductCount}
                className="bg-white h-10 w-12 text-xl text-center font-semibold rounded-lg"
              />
              <button
                className="h-10 w-10 text-xl font-bold bg-slate-400 text-white rounded-lg"
                onClick={() => handleProductCountChange("increase")}
              >
                +
              </button>
            </div>
          </div>

          {/* Out of Stock Message */}
          {isOutOfStock && (
            <p className="text-red-600 font-semibold text-lg mt-3">
              Out of Stock
            </p>
          )}

          {/* Add to Cart Button */}
          <button
            className="flex items-center gap-3 bg-blue-600 text-white hover:bg-blue-700 transition-all p-4 mt-8 rounded-lg shadow-md w-full justify-center text-lg"
            onClick={addToCart}
            disabled={isOutOfStock} // Disable button when out of stock
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="blue"
                d="M17 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2M1 2h3.27l.94 2H20a1 1 0 0 1 1 1c0 .17-.05.34-.12.5l-3.58 6.47c-.34.61-1 1.03-1.75 1.03H8.1l-.9 1.63l-.03.12a.25.25 0 0 0 .25.25H19v2H7a2 2 0 0 1-2-2c0-.35.09-.68.24-.96l1.36-2.45L3 4H1zm6 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2m9-7l2.78-5H6.14l2.36 5z"
              />
            </svg>
            <p>Add to Cart</p>
          </button>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="w-full max-w-[1280px] mt-8">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <div
              className="p-4 bg-white shadow-lg rounded-lg"
              key={relatedProduct._id.toString()}
            >
              <Link href={`/products/${category}/${relatedProduct._id}`}>
                <Image
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  width={200}
                  height={200}
                  className="object-contain w-full"
                />
                <h3 className="mt-4 text-xl font-bold">
                  {relatedProduct.name}
                </h3>
                <p className="mt-2 text-lg font-semibold text-green-600">
                  ₹{" "}
                  {(
                    relatedProduct.cost -
                    relatedProduct.cost * (relatedProduct.discount / 100)
                  ).toFixed(2)}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndividualProductView;
