"use client";

import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  productListingInterface,
  productOnlyInterface,
} from "@/utils/interface";
import {AiOutlineShoppingCart} from "react-icons/ai";
import Swal from "sweetalert2";

const IndividualProductView = ({
  params,
}: {
  params: { productId: string; category: string };
}) => {
  const [trackProductCount, setTrackProductCount] = useState(1);
  const [productData, setProductData] = useState<productOnlyInterface[]>([]);

  const { productId, category } = params;

  const increaseProdCount = () => {
    if(trackProductCount < 99){
        setTrackProductCount(trackProductCount + 1);
    }
  };

  const decreaseProdCount = () => {
    if(trackProductCount > 1){
        setTrackProductCount(trackProductCount - 1);
    }
  };

  const toGetProductData = async () => {
    try {
      const selectedCardData = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/product?productId=${productId}`
      );
      if (selectedCardData.data.data) {
        const display: productListingInterface = selectedCardData.data.data[0];

        const words = decodeURIComponent(category).split(" ");

        const value = words.map((word) => { 
          return word[0].toUpperCase() + word.substring(1); 
        }).join(" ");

        const reqData = display[words.length > 1 ? value : category].products;

        if (reqData) {
            setProductData(reqData)
        }
      }
    } catch (error: any) {
      console.error("Error fetching product data:", error?.message);
    }
  };

  const addToCart = async() => {
    const toAddToCart = await axios.post(`/api/cart?productId=${productId}`, {
      productCount: trackProductCount,
      "status": "CART"
    });
    if(toAddToCart.data && toAddToCart.status === 200){
      toGetProductData()
      setTrackProductCount(1)
      return Swal.fire({
        icon: "success",
        text: "Added to cart successfully",
        timer: 3000
      })
    }else {
      return Swal.fire({
        icon: "warning",
        text: toAddToCart.data.message ?? "Product cannot be added",
        timer: 3000
      })
    }
  }

  useEffect(() => {
    toGetProductData()
  }, [category, productId])

  return (
    productData.length 
    ? 
    (productData.map((prodData: productOnlyInterface) => {
        const discountedProductRate = ( prodData.discount ? prodData.cost - prodData.cost * prodData.discount : prodData.cost ).toFixed(2)
        return (
            <div
            className="w-full h-full flex flex-col items-center gap-10 max-w-[1280px] self-center mt-8 overflow-hidden"
            key={prodData._id.toString()}
          >
            <div className="flex flex-col lg:grid lg:grid-cols-2 w-11/12 sm:w-8/12 lg:w-full h-max">
              <div className="w-full h-full flex items-center border-solid border-[1px] border-slate-300">
                <Image
                  src={prodData.image}
                  alt=""
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center w-full h-full bg-slate-100 p-5 relative gap-8">
                {prodData.discount ? (
                  <div
                    className="w-0 h-0 absolute -top-2 -right-8 lg:-top-4 lg:-right-16 origin-center rotate-45
                    lg:border-l-[100px] border-l-[50px] border-l-transparent
                    lg:border-b-[100px] border-b-[50px] border-b-red-500
                    lg:border-r-[100px] border-r-[50px] border-r-transparent"
                  >
                    <div className="w-full h-full relative flex-items-center justify-center">
                      <p className="absolute lg:-bottom-20 -bottom-10 lg:-left-10 -left-6 w-max grid grid-cols-1 items-center justify-center text-white lg:text-xl text-[10px] font-bold">
                        {prodData.discount * 100} % OFF
                      </p>
                    </div>
                  </div>
                ) : null}
                <div className="flex items-center w-full justify-between">
                  <h1 className="capitalize text-2xl font-extrabold">
                    {prodData.name}
                  </h1>
                </div>
                <div className="flex w-full items-center gap-4">
                  <p
                    className={`${
                      prodData.discount
                        ? "line-through lg:text-xl font-normal"
                        : "lg:text-2xl font-semibold"
                    } text-[#222222]`}
                  >
                    ₹ {prodData.cost.toFixed(2)}
                  </p>
                  {prodData.discount ? (
                    <p className="lg:text-2xl font-semibold">
                      ₹{" "}
                      {(
                        prodData.cost -
                        prodData.cost * prodData.discount
                      ).toFixed(2)}
                    </p>
                  ) : null}
                  <p className="capitalize">{`Per ${prodData.measurement?.length ? prodData.measurement : "Kg"}`}</p>
                </div>
                <div className="grid grid-cols-2 lg:flex lg:flex-row items-center gap-3 w-full justify-start h-max">
                  <input
                    disabled
                    value={`₹ ${Number(discountedProductRate)*trackProductCount}`}
                    className="bg-white h-10 px-3 w-full lg:w-1/5 font-medium text-xl"
                  />
                  <input
                    disabled
                    value={`${trackProductCount} ${prodData.measurement?.length ? prodData.measurement : "Kg"}`}
                    className="bg-white h-10 px-3 w-full lg:w-1/5 font-medium text-xl capitalize"
                  />
                  <button className="h-10 w-full lg:w-[10%] text-xl font-bold bg-slate-400 text-white" onClick={decreaseProdCount}>-</button>
                  <button className="h-10 w-full lg:w-[10%] text-xl font-bold bg-slate-400 text-white" onClick={increaseProdCount}>+</button>
                </div>
                <div className="w-full h-full flex flex-col items-start gap-4">
                    <h1 className="font-bold capitalize text-lg">Description</h1>
                    <div className="w-full h-full bg-white p-3 max-h-[250px] min-h-[200px] overflow-y-auto sm:text-base text-xs">
                        {prodData.about}
                    </div>
                    <button className="flex items-center gap-3 bg-primary text-tertiary hover:bg-secondary delay-300 duration-300 p-3 mt-8 ease-in-out" onClick={addToCart}>
                        <AiOutlineShoppingCart className="text-xl"/>
                        <p className="text-sm">Add to cart</p>
                    </button>
                </div>
              </div>
            </div>
          </div>
        )
    }))
    : 
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-200">
        <p className="text-4xl font-bold capitalize text-white [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">No data available</p>
    </div>
  )

};

export default IndividualProductView;
