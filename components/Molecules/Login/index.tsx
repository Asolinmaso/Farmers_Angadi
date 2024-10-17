"use client";
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
  const router = useRouter();

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  useEffect(() => {
    const isUserData = Object.values(userData).every((el) => Boolean(el));
    setDisabled(!isUserData);
  }, [userData]);

  const { userIdentification, password } = userData;

  const onSubmit = async () => {
    setSubmit(true);
    setDisabled(true);
    setError("");
    try {
      setLoading(true);
      const response = await signIn("credentials", {
        emailAddress: userData.userIdentification,
        password: userData.password,
        redirect: false,
      });

      if (response?.error) {
        setError("Email or password is incorrect");
      } else {
        router.push(callbackUrl || "/");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Something went wrong. Please try again.");
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
    <div className="container mx-auto max-w-lg px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold">Farmers Angadi</h1>
        <p className="text-secondary text-2xl">welcomes you</p>
      </div>
      {error && (
        <p className="text-red-600 text-center mb-4">{error}</p>
      )}

      <div className="space-y-6">
        <div className="relative">
          <input
            onChange={onChangeFn}
            value={userIdentification}
            name="userIdentification"
            className="w-full h-14 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-secondary"
            placeholder="Enter Email / Username"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-10 2a4 4 0 0 1 4 4H6a4 4 0 0 1 4-4zm0 10H6v-2h4v2zm8-2h-4v2h4v-2zm-8-4H6v-2h4v2zm8 0h-4v-2h4v2z"
            />
          </svg>
        </div>

        <div className="relative">
          <input
            onChange={onChangeFn}
            value={password}
            name="password"
            type={showPassword ? "text" : "password"}
            className="w-full h-14 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-secondary"
            placeholder="Enter Password"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
            viewBox="0 0 24 24"
            onClick={() => setShowPassword(!showPassword)}
            role="button"
          >
            <path
              fill="currentColor"
              d={`${
                showPassword
                  ? "M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14z"
                  : "M12 5c4.074 0 7.38 2.443 8.919 6C17.38 16.557 14.074 19 12 19s-5.38-2.443-6.919-6C6.62 7.443 9.926 5 12 5z"
              }`}
            />
          </svg>
        </div>

        <button
          className={`w-full h-14 rounded-lg font-semibold ${
            disabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-primary hover:bg-secondary text-white transition"
          }`}
          onClick={onSubmit}
          disabled={disabled}
        >
          {loading ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin mx-auto h-6 w-6"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 1 1 16 0H4z"
              />
            </svg>
          ) : (
            "Login"
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
