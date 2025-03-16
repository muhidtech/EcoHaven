"use client";

import React from "react";
import "./homes.css";
import { useRouter } from 'next/navigation'

function Hero() {
  const router = useRouter()
  return (
    <div className="w-full h-screen mt-10 flex items-center justify-center p-10">
      <div
        className="bg-cover shadow-2xl shadow-black bg-center h-[80vh] max-w-5xl w-full rounded-2xl flex flex-col justify-center items-center p-10 text-center"
        style={{ backgroundImage: `url('/bg.jfif')` }}
      >
        <h1 className="text-4xl font-semibold pb-5 text-white/80">
          Sustainable Living Starts Here
        </h1>
        <p className="text-black/70 max-w-lg py-5 text-lg">
          Eco-friendly, handmade, and crafted with love. Shop consciously for a greener future.
        </p>
        <div className=" flex gap-2 max-md:flex-col sm:gap-5 w-full justify-center items-center">
          <button
            className="px-5 py-3 text-green-600 font-medium border-green-600 border-2 x w-40  sm:w-50 rounded-2xl mt-5 cursor-pointer hover:text-white hover:bg-green-700 transition"
          >
            Shop Now
          </button>
          <button
            onClick={() => router.push('../../about')}
            className="px-5 py-3 text-white font-medium border-green-600 border-2 w-40  sm:w-50 rounded-2xl mt-5 cursor-pointer hover:text-green-500 bg-green-700 hover:bg-transparent transition"
          >
            Learn More
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default Hero;
