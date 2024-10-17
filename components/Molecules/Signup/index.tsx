"use client";

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
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    userIdentification: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  useEffect(() => {
    const isUserData = Object.values(userData).every((el) => Boolean(el));
    setDisabled(!isUserData);
  }, [userData]);

  const { userIdentification, password, confirmPassword, role } = userData;

  const onSubmit = async () => {
    setSubmit(true);
    setDisabled(true);
    setError("");
    try {
      setLoading(true);
      const url = `/api/auth?authType=signup`;
      const payload = { emailAddress: userIdentification, password, confirmPassword, role };

      const response = await axios.post(url, payload);

      if (response.status === 201) {
        const loginResponse = await signIn("credentials", {
          emailAddress: userIdentification,
          password,
          redirect: false,
          callbackUrl: callbackUrl || "/",
        });

        if (loginResponse?.error) {
          setError("Cannot sign in after registration.");
        } else {
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
      setDisabled(false);
    }
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold">Farmers Angadi</h1>
        <p className="text-secondary text-2xl">welcomes you</p>
      </div>

      <section className="space-y-6">
        {error && <p className="text-red-600 text-center">{error}</p>}

        <div className="relative">
          <input
            onChange={onChangeFn}
            value={userIdentification}
            name="userIdentification"
            placeholder="Enter Email / Username"
            className="w-full h-14 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-secondary"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12l-4-4m0 0l-4 4m4-4v12" />
          </svg>
        </div>

        <div className="relative">
          <select
            onChange={onChangeFn}
            value={role}
            name="role"
            className="w-full h-14 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-secondary"
          >
            <option value="">Select your role</option>
            {userRoleexplaination.map((i, index) => (
              <option key={index} value={i.role}>
                {i.role}
              </option>
            ))}
          </select>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" />
          </svg>
        </div>

        <div className="relative">
          <input
            onChange={onChangeFn}
            value={password}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className="w-full h-14 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-secondary"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M3 3l18 18" : "M8 12h8m-4-4v8"} />
          </svg>
        </div>

        <div className="relative">
          <input
            onChange={onChangeFn}
            value={confirmPassword}
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full h-14 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-secondary"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 cursor-pointer"
            onClick={() => setShowConfirm(!showConfirm)}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showConfirm ? "M3 3l18 18" : "M8 12h8m-4-4v8"} />
          </svg>
        </div>

        <button
          className={`w-full h-14 rounded-lg font-semibold ${
            disabled ? "bg-gray-300 cursor-not-allowed" : "bg-primary hover:bg-secondary text-white transition"
          }`}
          onClick={onSubmit}
          disabled={disabled}
        >
          {loading ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin h-6 w-6 mx-auto"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="4" />
            </svg>
          ) : (
            "Sign up"
          )}
        </button>
      </section>
    </div>
  );
};

export default SignupForm;
