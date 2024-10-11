import { useState, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { BiTrash } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
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

  const productCost = ((product.cost - product.discount) * productCount).toFixed(2);

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
    if (productCount < 99 && productCount < stockData.stock) { // Ensure we don't exceed stock
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
        <Image src={product.image} alt={product.name} className="w-32 h-32" width={40} height={40} quality={100} />
        <div className="flex justify-between items-center w-full h-full">
          <div className="flex flex-col items-start gap-2">
            <Link href={`/products/${product.category}/${product._id}`} className="text-xl font-semibold capitalize text-[#333333]">
              {product.name}
            </Link>
            <div className="w-max gap-1 flex items-center text-lg font-normal capitalize text-[#222222]">
              <button onClick={decrementOrDeleteItem} className="bg-gray-300 px-3 py-1 rounded">-</button>
              <input
                type="number"
                value={productCount}
                readOnly
                className="w-12 text-center mx-2"
              />
              <button onClick={incrementProductCount} className="bg-gray-300 px-3 py-1 rounded">+</button>
              <p>{product.measurement}</p>
            </div>
            {stockData?.stock > productCount ? (
              <span className="flex gap-1 items-center mt-3">
                <TiTick className="text-xl text-green-600" />
                <p className="text-sm">In stock ({stockData.stock})</p>
              </span>
            ) : (
              <span className="flex gap-1 items-center mt-3">
                <IoClose className="text-xl text-red-600" />
                <p className="text-sm">Out of stock</p>
              </span>
            )}
          </div>
          <div className="flex flex-col items-start justify-between gap-16 h-full">
            <p>₹ {productCost}</p>
            <span className="flex gap-1 items-center cursor-pointer" onClick={() => deleteItemsFromCart(items._id)}>
              <BiTrash className="text-xl text-red-400" />
              <p className="text-sm">Remove</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualCartProductCard;
