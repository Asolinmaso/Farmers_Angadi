import axios from "axios";
import {
  useState,
  useEffect,
  useCallback,
  MouseEventHandler,
} from "react";

import { productOnlyInterface } from "@/utils/interface";
import { TimedTask, debounce } from "@/utils/debounce";

import Image from "next/image";
import Link from "next/link";

const SearchedDataListed = ({
  productName,
  setProductname,
}: {
  productName: string;
  setProductname: MouseEventHandler<HTMLAnchorElement> | undefined;
}) => {
  const [matchedData, setMatchedData] = useState<productOnlyInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedFetch] = useState<TimedTask>(debounce(1000));

  const searchedProductsLists = useCallback(async () => {
    setLoading(true);
    try {
      const productData = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/search?productName=${productName}`
      );

      const collectedData = productData.data?.data;

      if (collectedData) {
        setMatchedData(collectedData);
      }

      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching product data:", error.message);
      setLoading(false);
    }
  }, [productName]);

  useEffect(() => {
    debouncedFetch.doTask.call(debouncedFetch, async () => {
      if (productName) {
        try {
          !loading && setLoading(true);
          await searchedProductsLists();
        } catch (error) {
          console.error(`Failed to fetch grid data due to ${error}`);
        }
      }
    });
  }, [productName, searchedProductsLists]);

  return (
    <>
      <div className="w-full h-max bg-slate-200 flex flex-col max-h-[600px] overflow-y-auto fixed no-scrollbar gap-0 xl:top-24 top-20 z-50 p-6">
        {!loading && matchedData.length && Array.isArray(matchedData) ? (
          matchedData.map((product: productOnlyInterface) => {
            return (
              <Link
                href={`/products/${product.category}/${product._id}`}
                className="flex items-center w-full py-2 sm:px-6 justify-center h-max"
                key={product._id.toString()}
                onClick={setProductname}
              >
                <div className="w-screen max-w-[1280px] grid grid-cols-10 items-center justify-center border-[1px] border-slate-300 p-4 hover:bg-slate-300">
                  <Image
                    width={100}
                    height={100}
                    src={product.image}
                    alt={product.name}
                    className="col-span-3 object-contain w-20 h-20"
                  />
                  <div className="col-span-4 font-normal sm:text-lg capitalize">
                    {product.name}
                  </div>
                  <div className="col-span-3 text-lg font-normal text-end flex items-end justify-end sm:px-6">
                    ₹ {product.cost} per Kg
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="flex items-center justify-center w-full p-10">
            {loading ? (
              <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className="animate-spin"
            >
              <g fill="green">
                <path
                  fill-rule="evenodd"
                  d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14m0 3c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"
                  clip-rule="evenodd"
                  opacity="0.2"
                />
                <path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7z" />
              </g>
            </svg>
            ) : (
              <p className="text-black text-xl">No product Available</p>
            )}
          </div>
        )}
      </div>
      <div className="fixed inset-0 w-screen h-screen p-8 bg-black/50 xl:top-24 top-20 z-30">
        <div
          className="absolute inset-0 z-40 h-full"
          onClick={
            setProductname as unknown as
              | MouseEventHandler<HTMLDivElement>
              | undefined
          }
        ></div>
      </div>
    </>
  );
};

export default SearchedDataListed;
