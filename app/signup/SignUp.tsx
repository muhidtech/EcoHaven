"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import { useAuth } from '../contexts/AuthContext';


const SignUp = () => {
  const router = useRouter();
  const { signUp } = useAuth() || { signUp: async () => { console.warn('Auth context not found! Check if AuthProvider is properly configured.') } };
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 2) {
      newErrors.username = "Username must be at least 2 characters";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one letter and one number";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    // Log form data for debugging
    console.log('Submitting signup form with data:', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      username: formData.username,
      password: formData.password.length > 0 ? '********' : '<empty>', // Don't log actual password
      confirmPassword: formData.confirmPassword.length > 0 ? '********' : '<empty>', // Don't log actual password
      passwordsMatch: formData.password === formData.confirmPassword
    });
    
    setIsLoading(true);
    setErrors((prevErrors) => ({ ...prevErrors, general: "" }));

    try {
      // Verify all required fields are present and properly formatted
      if (!formData.firstName.trim() || !formData.lastName.trim() || 
          !formData.email.trim() || !formData.username.trim() || 
          !formData.password) {
        throw new Error("All fields must be filled out properly");
      }
      
      console.log('Calling signUp with:', {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        passwordProvided: !!formData.password
      });
      
      await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.username
      );

      console.log('Signup successful, redirecting to login page');
      // Redirect to login page after successful signup
      router.push('/login');
    } catch (error) {
      console.error('Signup error:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        general: error instanceof Error ? error.message : 'Failed to create account. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex w-1/2 flex-col bg-green-600 items-center justify-center">
        <h1 className="cursor-pointer text-center text-3xl mb-10 text-white font-semibold ">
          <Link href='/'>EcoHaven</Link>
        </h1>
        <h1 className="text-white text-5xl font-bold">Welcome Aboard!</h1>
      </div>
  
      <div className="w-full lg:w-1/2 flex flex-col justify-center lg:p-8 pt-30 relative">
        <button
          onClick={() => router.back()}
          className="absolute top-10 left-10 text-green-600 hover:text-green-800 text-3xl cursor-pointer"
        >
          <FiArrowLeft />
        </button>
  
        <h1 className="text-center text-3xl md:text-5xl mb-15 text-green-600 font-semibold ">
          EcoHaven
        </h1>
  
        <div className="max-w-lg w-full mx-auto bg-white p-8 shadow-2xl rounded-xl relative">
          <h2 className="text-3xl font-bold text-green-600 mb-8">Sign Up</h2>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:border-green-600 w-full"
              />
              {errors.firstName && (
                <div className="absolute text-xs text-red-500 mt-1">{errors.firstName}</div>
              )}
            </div>
  
            <div className="relative">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:border-green-600 w-full"
              />
              {errors.lastName && (
                <div className="absolute text-xs text-red-500 mt-1">{errors.lastName}</div>
              )}
            </div>
  
            <div className="col-span-1 md:col-span-2 relative">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:border-green-600 w-full"
              />
              {errors.email && (
                <div className="absolute text-xs text-red-500 mt-1">{errors.email}</div>
              )}
            </div>
  
            {/* Added Username Input */}
            <div className="col-span-1 md:col-span-2 relative">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:border-green-600 w-full"
              />
              {errors.username && (
                <div className="absolute text-xs text-red-500 mt-1">{errors.username}</div>
              )}
            </div>
  
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
  
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:border-green-600 w-full"
              />
              {errors.confirmPassword && (
                <div className="absolute text-xs text-red-500 mt-1">{errors.confirmPassword}</div>
              )}
            </div>
          </div>
  
          <div className="flex flex-col mt-8">
            {errors.general && (
              <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded border border-red-200">
                {errors.general}
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <p className="text-sm">
                Already have an account?{' '}
                <span
                  className="text-green-600 cursor-pointer"
                  onClick={() => router.push("/login")}
                >
                  Login
                </span>
              </p>
    
              <button
                onClick={handleSubmit}
                className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 text-sm"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default SignUp;
