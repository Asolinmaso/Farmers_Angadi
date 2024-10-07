"use client"
import axios from "axios";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useAuth } from "@/components/Wrapper/universalState";
import Swal from "sweetalert2";

import { useAuthInterface, CartItemInterface } from "@/utils/interface";
import { IUsersDocument } from "@/models/user";

import { FaSpinner } from "react-icons/fa";

import Link from "next/link";
import IndividualCartProductCard from "@/components/Molecules/CartCard";

type StateSetState = {
    selectedUserData: IUsersDocument;
    setSelectedUserData: Dispatch<SetStateAction<IUsersDocument>>;
}

const CartOrganelles = () => {

    const [cartItems, setCartItems] = useState<CartItemInterface[]>([]);

    const [cartLoading, setCartLoading] = useState(true);
    const [editCard, setEditCard] = useState(false);
    const [deleteInitiated, setDeleteInitiated] = useState(false);
    const [changesRequestedcards, setChangesRequestCards] = useState<CartItemInterface[]>([])

    const [userState, setUserState] = useState<useAuthInterface | any>({})

    const globalState = useAuth() as StateSetState;

    useEffect(() => {
        if (globalState) {
            if (globalState?.selectedUserData) {
                setUserState(globalState?.selectedUserData)
            }
        }
    }, [globalState])

    const fetchData = async () => {
        try {
            setCartLoading(true)
            const fetchCartData = await axios.get(`/api/cart?userId=${userState._id}`)
            if (fetchCartData.data) {
                setCartLoading(false)
                setCartItems(fetchCartData.data.data)
                setEditCard(false)
            } else {
                setCartLoading(false)
            }
        } catch (err) {
            console.error("err", err)
            setCartLoading(false)
        }
    }

    useEffect(() => {
        if (userState._id && (!cartItems.length || deleteInitiated)) {
            fetchData()
            setDeleteInitiated(false)
        }
    }, [userState, deleteInitiated]);

    const onCheckout = () => {
        if(editCard){
            return (
                Swal.fire({
                    icon: "warning",
                    text: "Save your changes",
                    timer: 3000
                })
            )
        }
        if(!cartItems.length){
            return (
                Swal.fire({
                    icon: "error",
                    text: "Cart is empty",
                    timer: 3000
                })
            )
        }else {
            if(!editCard){
                return (
                    Swal.fire({
                        icon: "success",
                        text: "Checkout product",
                        timer: 3000
                    })
                )
            }
        }
    }

    const onEditRequestedChanges = async() => {
        const iterateData = changesRequestedcards.map(async(items) => {
            const toEditCartData = await axios.post(`/api/cart?productId=${items.productId}&canProductBeAdded=true`, {
                productCount: items.productCount,
                "status": "CART"
            });
            if(toEditCartData.data && toEditCartData.status === 200) {
                return items
            }else {
                return null
            }
        });
        if(changesRequestedcards.length){
            if(iterateData.length){
                setChangesRequestCards([])
                return (
                    Swal.fire({
                        icon: "success",
                        text: "Items editted successfully",
                        timer: 3000
                    })
                )
            }
        }
    }

    return (
        <div className="flex flex-col items-center w-full h-full">
            <div className="flex items-center flex-col max-w-[1280px] w-full h-full p-6 gap-10">
                <h1 className="text-xl font-semibold text-[#333333] h-max max-w-[1024px] w-full uppercase">Cart</h1>
                <div className="flex flex-col items-center justify-start h-full w-full relative overflow-y-scroll min-h-[50vh]">
                    {cartLoading 
                    ? <div className="absolute w-full h-full flex flex-col items-center justify-center bg-white/60">
                        <FaSpinner className="animate-spin"/>
                    </div> : null}
                    {
                        !cartItems.length 
                        ? 
                        <div className="m-auto h-full w-full min-h-[50vh] text-center flex items-center justify-center">
                            <p>No items available</p>
                        </div> 
                        : 
                        (cartItems.map((items) => {
                            return (
                                <IndividualCartProductCard 
                                    items={items} 
                                    changeIfEditted={setEditCard}
                                    changedData={changesRequestedcards} 
                                    setChangedData={setChangesRequestCards}
                                    key={items._id}
                                    toDelete={setDeleteInitiated}
                                />
                            )
                        }))
                    }
                </div>
                <div className="w-full flex flex-col items-center gap-3">
                    <div className="flex items-center gap-4">
                        {editCard ? <button onClick={onEditRequestedChanges} className="bg-green-500 text-white px-5 py-3 rounded-sm min-w-[150px]">Save changes</button> : null}
                        <button className="bg-blue-500 text-white px-5 py-3 rounded-sm min-w-[150px]" onClick={onCheckout}>Checkout</button>
                    </div>
                    <p className="text-sm text-[#333333]">{`(or)`}</p>
                    <Link href={`/products`}>Keep Shopping</Link>
                </div>
            </div>
        </div>
    )
}

export default CartOrganelles;
