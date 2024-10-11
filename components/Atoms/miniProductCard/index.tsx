import Image from "next/image";
import Link from "next/link";

const MiniProductCard = ({ data }) => {
  // Calculate percentage discount correctly if discount exists
  const discountAmount = data.discount > 0 ? data.discount : 0;

  // Calculate the final price by subtracting the discount from the cost
  const finalPrice = (data.cost - discountAmount).toFixed(2);

  // Calculate the percentage discount (if needed for display purposes)
  const discountPercentage = data.discount > 0 ? ((discountAmount / data.cost) * 100).toFixed(0) : 0;

  // Access stock and measurement data from the stockData field
  const stock = data.stockData?.stock || "Out of Stock"; // Show "Out of Stock" if no stock data
  const measurement = data.stockData?.measurement || "Kg"; // Default to "Kg" if no measurement is provided

  return (
    <Link
      href={`/products/${data.category}/${data._id}`} // Change to use category in the URL
      className="min-w-[160px] sm:w-full max-w-[220px] sm:max-w-[300px] max-h-[350px] sm:max-h-[600px] rounded-lg shadow-[0_5px_25px_1px_rgba(0,0,0,0.3)] bg-tertiary relative h-max cursor-pointer"
      aria-disabled={true}
    >
      {/* Discount Badge */}
      {data.discount > 0 && (
        <span className="absolute top-3 left-3 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-r-lg z-10">
          {discountPercentage}% OFF
        </span>
      )}

      {/* Product Image */}
      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src={data.image}
          alt={data.name}
          layout="fill"
          objectFit="cover"
          quality={100}
          className="rounded-t-lg"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col items-start gap-2 p-4 bg-secondary rounded-b-lg">
        <span className="flex items-center justify-between w-full gap-2">
          <p className="text-primary text-sm font-medium capitalize w-32 md:w-40 truncate">
            {data.name}
          </p>
          <p className="text-red-800 p-2 rounded bg-white text-sm font-bold capitalize">
            {`${stock} ${measurement}`}
          </p>
        </span>

        {/* Price and Discount */}
        <p className="text-xl text-primary font-bold">₹ {finalPrice}</p>
        {data.discount > 0 && (
          <p className="text-sm text-tertiary line-through">₹ {data.cost.toFixed(2)}</p>
        )}

        {/* Product Name */}
        <p className="text-primary font-semibold capitalize text-lg truncate w-full">
          {data.name}
        </p>
      </div>
    </Link>
  );
};

export default MiniProductCard;
