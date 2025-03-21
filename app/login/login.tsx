"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";


const Login = () => {
  const { signIn, isAdminLogin } = useAuth()
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Validate form input
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.identifier) newErrors.identifier = "Username or email is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const checkAdminLogin = isAdminLogin(); // Extract the function call to a variable
    if (checkAdminLogin) {
      router.push('/');
    }
  }, [isAdminLogin, router]);
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setError('');
      setLoading(true);
      const loggedUser = await signIn(formData.identifier, formData.password);
      if (loggedUser.role === 'admin') {
        router.push('/admin/dashboard'); // Redirect admin users to admin dashboard
      } else {
        router.push('/'); // Redirect regular users to home page
      }
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 relative">
        <button
          onClick={() => router.back()}
          className="absolute top-10 left-10 text-green-600 hover:text-green-800 text-3xl cursor-pointer"
        >
          <FiArrowLeft />
        </button>

        <h1 className="cursor-pointer text-center text-3xl md:text-5xl mb-15 text-green-600 font-semibold">
          <Link href="/">EcoHaven</Link>
        </h1>

        <div className="max-w-lg w-full mx-auto bg-white p-8 shadow-2xl rounded-xl relative">
          <h2 className="text-3xl font-bold text-green-600 mb-8">Login</h2>

          {/* Form starts here for Enter key submission */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Identifier Input (Username or Email) */}
            <div className="relative">
              <input
                type="text"
                name="identifier"
                placeholder="Username or Email"
                value={formData.identifier}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:border-green-600 w-full"
              />
              {errors.identifier && (
                <div className="absolute text-xs text-red-500 mt-1">{errors.identifier}</div>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:border-green-600 w-full"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-green-600 cursor-pointer"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.password && (
                <div className="absolute text-xs text-red-500 mt-1">{errors.password}</div>
              )}
            </div>

            {/* Submit and Forgot Password Links */}
            <div className="flex justify-between items-center">
              <p
                className="text-sm text-green-600 cursor-pointer"
                onClick={() => router.push("/forgot-password")}
              >
                Forgot password?
              </p>
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 text-sm"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-sm mt-4">
              Don&#39;t have an account?{" "}
              <span
                className="text-green-600 cursor-pointer"
                onClick={() => router.push("/signup")}
              >
                Create one
              </span>
            </p>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </form>
          {/* Form ends here */}
        </div>
      </div>

      {/* Right Section (Welcome Message) */}
      <div className="hidden lg:flex w-1/2 flex-col bg-green-600 items-center justify-center">
        <h1 className="text-center text-3xl mb-10 text-white font-semibold">EcoHaven</h1>
        <h1 className="text-white text-5xl font-bold">Welcome Back!</h1>
      </div>
    </div>
  );
};

export default Login;
