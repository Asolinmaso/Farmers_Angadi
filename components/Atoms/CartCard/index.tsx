import Image from "next/image";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

const CartDetailCard = ({image, name, price, quantity}:{image: string, name: string, price: number, quantity: number}) => {
    
    

    return (
        <div className="flex flex-col md:grid md:grid-cols-5 items-center justify-center p-2 border-b-[0.5px] border-x-transparent border-t-transparent border-slate-300">
            <IoMdClose className="text-red-500 text-lg font-bold cursor-pointer"/>
            <Image src={image} alt={name} width={10} height={10} className="w-full h-full object-contain"/>
            <p className="text-lg capitalize font-medium">{name}</p>
            <p className="text-lg capitalize font-medium">{price}</p>
            <p className="text-lg capitalize font-medium">{quantity}</p>
            <p className="text-lg capitalize font-medium">{price*quantity}</p>
        </div>
    )
}