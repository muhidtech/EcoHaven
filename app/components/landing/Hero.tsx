"use client";

import React, { useState, useEffect } from "react";
import "./homes.css";
import { useRouter } from 'next/navigation'

function Hero() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="w-full h-screen mt-15 flex items-center justify-center p-5 md:p-10">
      <div
        className={`bg-cover shadow-2xl shadow-black bg-center h-[80vh] max-w-5xl w-full rounded-2xl flex flex-col justify-center items-center p-10 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ 
          backgroundImage: `url('/bg.jfif')`,
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          transition: 'transform 0.8s ease-in-out'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h1 className={`text-4xl font-semibold pb-5 text-white/80 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} 
            style={{ transitionDelay: '200ms' }}>
          Sustainable Living Starts Here
        </h1>
        <p className={`text-black/70 max-w-lg py-5 text-lg transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
           style={{ transitionDelay: '400ms' }}>
          Eco-friendly, handmade, and crafted with love. Shop consciously for a greener future.
        </p>
        <div className={`flex gap-2 max-md:flex-col sm:gap-5 w-full justify-center items-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
             style={{ transitionDelay: '600ms' }}>
          <button
            onClick={() => router.push('../shop')}
            className="px-5 py-3 text-green-600 font-medium border-green-600 border-2 w-40 sm:w-50 rounded-2xl mt-5 cursor-pointer hover:text-white hover:bg-green-700 transition-all duration-300 hover:scale-105"
          >
            Shop Now
          </button>
          <button
            onClick={() => router.push('/about')}
            className="px-5 py-3 text-white font-medium border-green-600 border-2 w-40 sm:w-50 rounded-2xl mt-5 cursor-pointer hover:text-green-500 bg-green-700 hover:bg-transparent transition-all duration-300 hover:scale-105"
          >
            Learn More
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default Hero;

// Add the following keyframes to homes.css:
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(20px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// 
// @keyframes scaleUp {
//   from { transform: scale(1); }
//   to { transform: scale(1.05); }
// }
