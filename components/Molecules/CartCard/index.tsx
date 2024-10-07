import {
  useState,
  useEffect,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
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

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value < 1) {
      value = 1;
    }
    setProductCount(value);
  };

  const productCost = (
    (items.cost - items.cost * items.discount) *
    productCount
  ).toFixed(0);

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

  const deleteItemsFromCart = async (cartId: string) => {
    const deleteCartData = await axios.delete(`/api/cart?productId=${cartId}`);
    if (deleteCartData.data && deleteCartData.status === 200) {
      toDelete(true);
      return Swal.fire({
        icon: "success",
        text: "Item deleted successfully",
        timer: 3000,
      });
    } else {
      toDelete(false);
    }
  };

  return (
    <div className="flex max-w-[1024px] border-t-[1px] border-b-[1px] border-slate-100 p-4 w-10/12">
      <div className="flex w-full h-full items-center gap-5 relative">
        {!items.stock ? (
          <div className="absolute w-full h-full bg-white/90 flex items-center justify-center">
            <div className="px-3 py-2 rounded-lg border border-slate-200 w-max bg-white">
              Product not available
            </div>
          </div>
        ) : null}
        <Image
          src={items.image}
          alt={items.name}
          className="w-32 h-32"
          width={40}
          height={40}
          quality={100}
        />
        <div className="flex justify-between items-center w-full h-full">
          <div className="flex flex-col items-start gap-2">
            <Link
              href={`/products/${items.category}/${items.productId}`}
              className="text-xl font-semibold capitalize text-[#333333]"
            >
              {items.name}
            </Link>
            <div className="w-max gap-1 flex items-center text-lg font-normal capitalize text-[#222222]">
              <input
                type="number"
                value={productCount}
                onChange={(e) => onChangeValue(e)}
                className="w-10"
              />
              <p>{items.measurement}</p>
            </div>
            {items.stock > productCount ? (
              <span className="flex gap-1 items-center mt-3">
                <TiTick className="text-xl text-green-600" />
                <p className="text-sm">In stock</p>
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
            <span
              className="flex gap-1 items-center cursor-pointer"
              onClick={() => deleteItemsFromCart(items.productId)}
            >
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
