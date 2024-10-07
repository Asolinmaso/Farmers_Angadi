import Image from "next/image";
import Link from "next/link";

const MiniProductCard = ({ data, uniqueIdentifier }) => {
console.log(data,"lkj");

  return (
    <Link
      href={`/products/${uniqueIdentifier}/${data._id}`}
      className="min-w-[160px] sm:w-full max-w-[220px] snap-center sm:max-w-[300px] max-h-[350px] sm:max-h-[600px] rounded-lg shadow-[0_5px_25px_1px_rgba(0,0,0,0.3)] bg-tertiary relative h-max cursor-pointer"
      aria-disabled={true}
    >
      {data.discount ? <span className="absolute text-sm sm:text-lg top-6 p-2 sm:px-5 sm:py-3 bg-red-600 text-tertiary rounded-r-full">
        {data.discount * 100} % OFF
      </span> : null}
      <Image
        src={data.image}
        width={100}
        height={100}
        quality={100}
        alt={data.name}
        className="w-full h-full rounded-lg"
      />
      <div className="flex flex-col items-start gap-4 p-4 bg-secondary rounded-b-lg">
        <span className="flex md:items-center items-start flex-col md:flex-row justify-start w-full md:gap-4 gap-1">
          <p className="text-primary text-sm font-medium capitalize w-32 md:w-40 md:max-w-max truncate">
            {uniqueIdentifier}
          </p>
          <p className="text-tertiary text-xs font-medium capitalize">
            {`(${`${data.stock} ${data.measurement ? data.measurement : "Kg"}`})`}
          </p>
        </span>
        <p className="text-xl text-primary font-bold">
          ₹ {(data.cost - (data.cost * data.discount)).toFixed(2)}
        </p>
        {data.discount ? <p className="text-tertiary text-sm line-through"> ₹ {data.cost} </p> : <p className="text-tertiary text-sm">NA</p>}
        <p className="text-primary md:font-bold font-semibold capitalize text-lg md:text-xl w-32 truncate">{data.name}</p>
      </div>
    </Link>
  );
};

export default MiniProductCard;
