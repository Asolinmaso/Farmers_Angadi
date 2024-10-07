"use client";

import {
  AiOutlineMail,
  AiFillLock,
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    userIdentification: "",
    password: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter(); // Use Next.js router

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  useEffect(() => {
    const isUserData = Object.values(userData).every((el) => Boolean(el));
    isUserData ? setDisabled(false) : setDisabled(true);
  }, [userData]);

  const { userIdentification, password } = userData;

  const onSubmit = async () => {
    setSubmit(true);
    setDisabled(true);
    setError(""); // Clear previous errors
    try {
      setLoading(true);

      const response = await signIn("credentials", {
        emailAddress: userData.userIdentification,
        password: userData.password,
        redirect: false, // Prevent automatic navigation
      });

      if (response?.error) {
        setError("Email or password is incorrect");
      } else {
        setError("");
        // Navigate to home page on successful login
        router.push(callbackUrl || "/"); // Redirect to home or callbackUrl
      }

      setLoading(false);
    } catch (error) {
      console.error("Error during login:", error);
      setError("Something went wrong. Please try again.");
      setLoading(false);
      setSubmit(false);
    } finally {
      setLoading(false);
      setSubmit(false);
    }
  };

  useEffect(() => {
    if (error) {
      setDisabled(true);
      setSubmit(false);
    }
  }, [error]);

  return (
    <div className="w-4/5 flex flex-col items-start justify-between p-4 max-h-[650px] gap-10">
      <div className="font-lightbold text-3xl capitalize text-center self-center flex flex-col">
        <span className="xl:text-4xl text-3xl">Farmers Angadi</span>
        <span className="text-secondary xl:text-3xl text-2xl">
          welcomes you
        </span>
      </div>
      <section className="flex flex-col items-center justify-between w-full h-full lg:gap-8 gap-6">
        {error && (
          <p className="text-red-600 text-center w-full lg:w-3/4">
            {error}
          </p>
        )}

        <div className="lg:w-3/4 w-full flex flex-row items-center justify-center bg-tertiary lg:rounded-xl">
          <AiOutlineMail className="w-20" />
          <input
            onChange={onChangeFn}
            value={userIdentification}
            name="userIdentification"
            className="w-full h-14 outline-0 pr-6 lg:rounded-xl"
            placeholder="Enter Email / Username"
          />
        </div>

        <div className="lg:w-3/4 w-full flex flex-row items-center justify-center bg-tertiary lg:rounded-xl">
          <AiFillLock className="w-20" />
          <input
            onChange={onChangeFn}
            value={password}
            name="password"
            className="w-full h-14 outline-0 pr-6 lg:rounded-xl"
            placeholder="Enter Password"
            type={showPassword ? "text" : "password"}
          />
          {showPassword ? (
            <AiFillEyeInvisible
              className="w-20 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <AiFillEye
              className="w-20 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>

        <button
          className={`lg:w-3/5 w-3/4 font-bold p-4 lg:rounded-xl flex items-center justify-center gap-5 ${
            disabled
              ? "cursor-not-allowed bg-[#e9e9e9] text-tertiary"
              : "cursor-pointer bg-primary hover:bg-tertiary hover:text-secondary duration-300 focus:ring-[1px] focus:ring-secondary text-tertiary"
          }`}
          onClick={onSubmit}
          disabled={disabled}
        >
          Login
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin text-xl" />
          ) : null}
        </button>
      </section>
    </div>
  );
};

export default LoginForm;
