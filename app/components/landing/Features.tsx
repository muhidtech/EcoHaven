"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { getFeaturedProducts } from "../../services/localDataService";

interface Product {
  name: string;
  imageUrl?: string;
  image?: string;  // new optional property
}

// Skeleton loader component for featured products
const SkeletonLoader: React.FC<{ itemsPerView: number }> = ({ itemsPerView }) => {
  return (
    <div className="flex gap-5 overflow-hidden w-full">
      {Array(itemsPerView).fill(0).map((_, i) => (
        <div
          key={i}
          className="w-[calc(100%/2)] md:w-[calc(100%/4)] lg:w-[calc(100%/6)] min-w-[150px] max-w-[300px] border p-5 shadow-lg rounded-lg bg-white animate-fadeIn"
        >
          <div className="w-full h-[150px] bg-gray-200 animate-pulse rounded-md mb-2"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded-md w-3/4 mx-auto"></div>
        </div>
      ))}
    </div>
  );
};

// Debounce function
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
};

// Define animation keyframes at the top level
const Features: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [featuresData, setFeaturesData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Memoize totalItems to prevent unnecessary recalculations
  const totalItems = useMemo(() => featuresData.length, [featuresData]);

  const discountProducts = useMemo(() => [
    {
      name: "Organic Beeswax Wraps",
      dis: "%50",
      img: "/product1.png"
    },
    {
      name: "Reusable Cotton Tote Bag",
      dis: "%30",
      img: "/product2.png"
    }
  ], []);

  const getItemsPerView = useCallback(() => {
    if (typeof window === 'undefined') return 4; // Default for SSR
    if (window.innerWidth >= 1024) return 6; // Large screens
    if (window.innerWidth >= 768) return 4; // Medium screens
    return 2; // Small screens
  }, []);

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView);

  useEffect(() => {
    // Create debounced resize handler
    const handleResizeDebounced = debounce(() => {
      setItemsPerView(getItemsPerView());
    }, 250); // 250ms debounce time

    if (typeof window !== 'undefined') {
      window.addEventListener("resize", handleResizeDebounced);
      return () => window.removeEventListener("resize", handleResizeDebounced);
    }
  }, [getItemsPerView]);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const prevSlide = useCallback(() => {
    setIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const featuredProducts = await getFeaturedProducts();
        setFeaturesData(featuredProducts);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Remove unnecessary dependencies

  useEffect(() => {
    // Only set up the interval if we have products and are not loading
    if (totalItems > 0 && !isLoading) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [totalItems, isLoading, nextSlide]);

  // Memoize the visible products to prevent unnecessary calculations during renders
  const visibleProducts = useMemo(() => {
    if (totalItems === 0) return [];
    return featuresData
      .slice(index, index + itemsPerView)
      .concat(featuresData.slice(0, Math.max(0, index + itemsPerView - totalItems)))
      .map(product => ({
        ...product,
        key: Math.random().toString(36).substr(2, 9) // Add unique key for animation purposes
      }));
  }, [featuresData, index, itemsPerView, totalItems]);

  return (
    <div className="relative flex flex-col px-10 md:pl-20 md:pr-15 mt-20 pb-20">
      <h1 className="text-3xl pb-5 font-semibold text-text">Featured Products</h1>

      {/* Navigation Arrows */}
      <div className="absolute top-0 lg:right-20 md:right-15 right-5 max-md:top-2 flex gap-2">
        <span 
          className="tag cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110" 
          onClick={prevSlide}
          aria-label="Previous products"
        >
          &lt;
        </span>
        <span 
          className="tag cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110" 
          onClick={nextSlide}
          aria-label="Next products"
        >
          &gt;
        </span>
      </div>

      {/* Grid Container with Skeleton Loader */}
      {isLoading ? (
        <SkeletonLoader itemsPerView={itemsPerView} />
      ) : (
        <div className="flex gap-5 overflow-hidden w-full transition-transform duration-700 ease-in-out transform">
          {visibleProducts.map((item, i) => (
            <div
              key={item.key || i}
              className="w-[calc(100%/2)] md:w-[calc(100%/4)] lg:w-[calc(100%/6)] min-w-[150px] max-w-[300px] border transition-all duration-500 ease-in-out p-5 shadow-lg rounded-lg bg-white hover:shadow-xl hover:-translate-y-1 animate-fadeIn"
            >
              <Image
                src={item.imageUrl || item.image || "/placeholder.png"}
                alt={item.name}
                width={300}
                height={300}
                className="w-full h-auto object-contain transition-opacity duration-500 ease-in-out"
              />
              <p className="text-center mt-2 transition-opacity duration-500 ease-in-out">{item.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Discount Products Section */}
      <div className="grid lg:grid-cols-2 grid-cols-1 mt-10 w-full gap-5">
        {discountProducts.map((item, key) => (
          <div
            className="relative hover:border-green-400 hover:border-1 bg-gray-300 shadow-md h-[220px] rounded-2xl flex flex-col items-start gap-4 p-10 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg"
            key={key}
          >
            <h1 className="md:text-2xl text-lg text-blue-500">{item.name}</h1>
            <p className="max-md:text-md">Get Upto <b>{item.dis}</b> Off</p>
            <button className="btn2 w-30 transition-transform duration-300 ease-in-out hover:scale-105">Shop now</button>
            <Image
              className="absolute top-20 right-0 w-40 h-30 sm:w-70 sm:h-50 sm:top-2 object-contain transition-transform duration-500 ease-in-out hover:scale-105"
              src={item.img}
              alt={item.name}
              width={150}
              height={150}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
