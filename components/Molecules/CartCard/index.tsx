import { useState, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { CartItemInterface } from "@/utils/interface";
import Swal from "sweetalert2";

const IndividualCartProductCard = ({
  items,
  changeIfEditted,
  changedData,
  setChangedData,
  toDelete,
}: {
  items: CartItemInterface;
  changeIfEditted: Dispatch<SetStateAction<boolean>>;
  changedData: CartItemInterface[];
  setChangedData: Dispatch<SetStateAction<CartItemInterface[]>>;
  toDelete: Dispatch<SetStateAction<boolean>>;
}) => {
  const [productCount, setProductCount] = useState(items.productCount);

  // Access product and stock details from the cart item
  const product = items.productDetails;
  const stockData = items.stockData;

  const productCost = (
    (product.cost - product.discount) *
    productCount
  ).toFixed(2);

  const updateCartCount = async (newCount: number) => {
    try {
      await axios.put(`/api/cart`, {
        cartId: items._id,
        productCount: newCount,
        status: "CART",
      });
    } catch (error) {
      console.error("Error updating cart count:", error);
      Swal.fire({
        icon: "error",
        text: "Error updating cart item count",
        timer: 3000,
      });
    }
  };

  const incrementProductCount = () => {
    if (productCount < 99 && productCount < stockData.stock) {
      // Ensure we don't exceed stock
      const newCount = productCount + 1;
      setProductCount(newCount);
      updateCartCount(newCount);
    }
  };

  const decrementOrDeleteItem = () => {
    if (productCount > 1) {
      const newCount = productCount - 1;
      setProductCount(newCount);
      updateCartCount(newCount);
    } else {
      deleteItemsFromCart(items._id);
    }
  };

  const deleteItemsFromCart = async (cartId: string) => {
    try {
      const deleteCartData = await axios.delete(`/api/cart?cartId=${cartId}`);
      if (deleteCartData.data && deleteCartData.status === 200) {
        toDelete(true);
        Swal.fire({
          icon: "success",
          text: "Item deleted successfully",
          timer: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      Swal.fire({
        icon: "error",
        text: "Error deleting cart item",
        timer: 3000,
      });
    }
  };

  useEffect(() => {
    const addedValueItems = {
      ...items,
      productCount,
      totalPrice: Number(productCost),
    };

    if (items.productCount !== productCount && productCount > 0) {
      changeIfEditted(true);
      const toModifyChangedData = changedData.map((ele) => {
        if (items._id === ele._id) {
          return addedValueItems;
        } else {
          return ele;
        }
      });
      if (!changedData.length) {
        setChangedData([addedValueItems]);
      } else {
        setChangedData([...toModifyChangedData]);
      }
    } else {
      changeIfEditted(false);
      const toRemoveData = changedData.filter((i) => i._id !== items._id);
      setChangedData(toRemoveData);
    }
  }, [productCount]);

  return (
    <div className="flex max-w-[1024px] border-t-[1px] border-b-[1px] border-slate-100 p-4 w-10/12">
      <div className="flex w-full h-full items-center gap-5">
        <Image
          src={product.image}
          alt={product.name}
          className="w-32 h-32"
          width={40}
          height={40}
          quality={100}
        />
        <div className="flex justify-between items-center w-full h-full">
          <div className="flex flex-col items-start gap-2">
            <Link
              href={`/products/${product.category}/${product._id}`}
              className="text-xl font-semibold capitalize text-[#333333]"
            >
              {product.name}
            </Link>
            <div className="w-max gap-1 flex items-center text-lg font-normal capitalize text-[#222222]">
              <button
                onClick={decrementOrDeleteItem}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                -
              </button>
              <input
                type="number"
                value={productCount}
                readOnly
                className="w-12 text-center mx-2"
              />
              <button
                onClick={incrementProductCount}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                +
              </button>
              <p>{product.measurement}</p>
            </div>
            {stockData?.stock > productCount ? (
              <span className="flex gap-1 items-center mt-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2em"
                  height="2em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="green"
                    d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"
                  />
                </svg>
                <p className="text-sm">In stock ({stockData.stock})</p>
              </span>
            ) : (
              <span className="flex gap-1 items-center mt-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2em"
                  height="2em"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="red"
                    d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07M11.4 10l2.83-2.83l-1.41-1.41L10 8.59L7.17 5.76L5.76 7.17L8.59 10l-2.83 2.83l1.41 1.41L10 11.41l2.83 2.83l1.41-1.41L11.41 10z"
                  />
                </svg>{" "}
                <p className="text-sm">Out of stock</p>
              </span>
            )}
          </div>
          <div className="flex flex-col items-start justify-between gap-16 h-full">
            <p>₹ {productCost}</p>
            <span
              className="flex gap-1 items-center cursor-pointer"
              onClick={() => deleteItemsFromCart(items._id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="red"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="m18 9l-.84 8.398c-.127 1.273-.19 1.909-.48 2.39a2.5 2.5 0 0 1-1.075.973C15.098 21 14.46 21 13.18 21h-2.36c-1.279 0-1.918 0-2.425-.24a2.5 2.5 0 0 1-1.076-.973c-.288-.48-.352-1.116-.48-2.389L6 9m7.5 6.5v-5m-3 5v-5m-6-4h4.615m0 0l.386-2.672c.112-.486.516-.828.98-.828h3.038c.464 0 .867.342.98.828l.386 2.672m-5.77 0h5.77m0 0H19.5"
                />
              </svg>{" "}
              <p className="text-sm">Remove</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualCartProductCard;
