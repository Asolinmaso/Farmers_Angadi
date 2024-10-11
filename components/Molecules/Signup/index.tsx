"use client";

import {AiOutlineMail, AiFillLock, AiFillEye, AiFillEyeInvisible, AiOutlineLoading3Quarters} from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi"
import { useState, useEffect } from "react";
import { userRoleexplaination } from "@/utils/rolecard";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const SignupForm = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        userIdentification: "",
        password: "",
        confirmPassword: "",
        role: ""
    });
    const [error, setError] = useState("");

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    const onChangeFn = (e) => {
        const {name, value} = e.target;
        setUserData({...userData, [name]: value})
    }

    useEffect(() => {
        const isUserData = Object.values(userData).every(el => Boolean(el))
        isUserData ? setDisabled(false) : setDisabled(true)
    }, [userData])

    const {userIdentification, password, confirmPassword, role} = userData;

    const onSubmit = async () => {
        setSubmit(true);
        setDisabled(true);
        setError("");  // Reset error before new attempt
        try {
            setLoading(true);
            const url = `/api/auth?authType=signup`;
            const payload = {
                emailAddress: userIdentification,
                password,
                confirmPassword,
                role
            };
            
            const response = await axios.post(url, payload);
            
            // Check if registration was successful
            if (response.status === 201) {  // Assuming successful registration returns 201 status
                // Now sign the user in
                const loginResponse = await signIn("credentials", {
                    emailAddress: userIdentification,
                    password,
                    redirect: false,  // Prevent automatic redirect to handle it manually
                    callbackUrl: callbackUrl || "/",
                });
    
                if (loginResponse?.error) {
                    setError("Cannot sign in after registration");
                } else {
                    // Redirect to the callback URL or homepage after successful login
                    window.location.href = loginResponse.url || "/";
                }
            } else {
                setError("Cannot register the user. Try again.");
            }
        } catch (error) {
            console.error("Registration error: ", error);
            setError("An error occurred during registration. Please try again.");
        } finally {
            setLoading(false);
            setSubmit(false);
            setDisabled(false);  // Re-enable the button in case of failure
        }
    };
    

    return (
        <div className="w-4/5 flex flex-col items-start justify-between p-4 max-h-[650px] gap-10">
            <div className="font-lightbold text-3xl capitalize text-center self-center flex flex-col">
            <span className="xl:text-4xl text-3xl">Farmers Angadi</span> 
            <span className="text-secondary xl:text-3xl text-2xl">
                welcomes you
            </span>
            </div>
            <section className="flex flex-col items-center justify-between w-full h-full gap-8">

                <div className="lg:w-3/4 w-full flex flex-row items-center justify-center bg-tertiary lg:rounded-xl">
                    <AiOutlineMail className="w-20"/>
                    <input onChange={onChangeFn} value={userIdentification} name="userIdentification" className="w-full h-14 outline-0 pr-14 lg:rounded-xl" placeholder="Enter Email / Username"/>
                </div>

                <div className="lg:w-3/4 w-full flex flex-row items-center justify-center bg-tertiary lg:rounded-xl">
                    <BiUserCircle className="w-20"/>
                    <select onChange={onChangeFn} value={role} name="role" className="w-full h-14 outline-0 pr-14 lg:rounded-xl appearance-none">
                        <option value="">Select your role</option>
                        {userRoleexplaination.map((i, index) => {
                            return (
                                <option key={index} value={i.role}>
                                    {i.role}
                                </option>
                            )
                        })}
                    </select>
                </div>

                <div className="lg:w-3/4 w-full flex flex-row items-center justify-center bg-tertiary lg:rounded-xl relative">
                    <AiFillLock className="w-20"/>
                    <input onChange={onChangeFn} value={password} name="password" className="w-full h-14 outline-0 pr-14 lg:rounded-xl" placeholder="Enter Password" type={showPassword ? "text": "password"}/>
                    {showPassword ? <AiFillEyeInvisible className="w-20 cursor-pointer absolute right-0" onClick={() => setShowPassword(!showPassword)}/> : <AiFillEye className="w-20 cursor-pointer absolute right-0" onClick={() => setShowPassword(!showPassword)}/>}
                </div>

                <div className="lg:w-3/4 w-full flex flex-row items-center justify-center bg-tertiary lg:rounded-xl relative">
                    <AiFillLock className="w-20"/>
                    <input onChange={onChangeFn} value={confirmPassword} name="confirmPassword" className="w-full h-14 outline-0 pr-14 lg:rounded-xl" placeholder="Confirm Password" type={showConfirm ? "text": "password"}/>
                    {showConfirm ? <AiFillEyeInvisible className="w-20 cursor-pointer absolute right-0" onClick={() => setShowConfirm(!showConfirm)}/> : <AiFillEye className="w-20 cursor-pointer absolute right-0" onClick={() => setShowConfirm(!showConfirm)}/>}
                </div>

                <button className={`lg:w-3/5 w-3/4 font-bold p-4 lg:rounded-xl flex items-center justify-center gap-5 ${disabled ? "cursor-not-allowed bg-[#e9e9e9] text-tertiary" : "cursor-pointer bg-primary hover:bg-tertiary hover:text-secondary duration-300 focus:ring-[1px] focus:ring-secondary focus:cursor-not-allowed text-tertiary"}`} 
                onClick={onSubmit}
                disabled={disabled}
                >Sign up
                {submit ? <AiOutlineLoading3Quarters className="animate-spin text-xl"/> : null}
                </button>
            </section>
        </div>
    )
}

export default SignupForm;
