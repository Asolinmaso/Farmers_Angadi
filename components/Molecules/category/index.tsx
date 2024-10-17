import MiniProductcard from "@/components/Atoms/miniProductCard";
import axios from "axios";
import Link from "next/link";

const SeparateCategory = ({ params }: any) => {
  const renderSelectedCategoryProductList = async () => {
    try {
      const productData = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/product?category=${params.category}`
      );
      if (productData.data.data) {
        const identifier =
          productData.data.data[0][decodeURIComponent(params.category)];
        if (identifier) {
          return (
            <div className=" h-max flex flex-col items-center justify-center p-6">
              <div className="w-full max-w-[1280px] flex items-center justify-between">
                <Link
                  href={`/`}
                  className="py-3 px-6 bg-tertiary w-max flex items-center gap-4 hover:bg-primary hover:text-tertiary duration-300 border-[1px] border-secondary hover:border-primary self-center sm:self-end"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="2em"
                    height="2em"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="black"
                      d="M0 7.9L6 3v3h2c8 0 8 8 8 8s-1-4-7.8-4H6v2.9z"
                    />
                  </svg>
                  <p className="sm:block hidden">Back to home</p>
                </Link>
                <h1 className="sm:text-2xl text-lg font-bold capitalize text-primary self-center w-max">
                  {decodeURIComponent(params.category)}
                </h1>
              </div>
              <div
                className="w-full max-w-[1280px]
                            grid grid-cols-2 sm:flex sm:flex-wrap place-content-center xl:grid xl:grid-cols-4 gap-6 sm:gap-12 py-12 items-center"
              >
                {identifier.products.map((i: any) => {
                  return <MiniProductcard data={i} key={i.name} />;
                })}
              </div>
            </div>
          );
        }
      }
    } catch (error) {
      console.error("Error fetching product data:", (error as Error).message);
    }
  };

  return renderSelectedCategoryProductList();
};

export default SeparateCategory;
