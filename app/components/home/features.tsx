"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import features_data from "./features-data.json";



function Features() {
  const [index, setIndex] = useState(0);
  const totalItems = features_data.length;
  const discountProducts = [
    {
      name: "Organic Beeswax Wraps",
      dis: "%50",
      img: "/3534faed0a84c04be4f2aa54a41980c0-removebg-preview.png"
    },
    {
      name: "Reusable Cotton Tote Bag",
      dis: "%30",
      img: "/a0ebcb43ad77f1617724c13df6b66b56-removebg-preview.png"
    }
  ];

  // Dynamically determine how many boxes are shown based on screen size
  const getItemsPerView = () => {
    if (window.innerWidth >= 1024) return 6; // Large screens
    if (window.innerWidth >= 768) return 4; // Medium screens
    return 2; // Small screens
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2000); // Slide every 10s

    return () => clearInterval(interval);
  }, [index, itemsPerView]);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % totalItems);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  return (
    <div className="relative flex flex-col px-10 md:pl-20 md:pr-15 mt-20 pb-20">
      <h1 className="text-3xl pb-5 font-semibold text-text">Featured Categories</h1>

      {/* Navigation Arrows */}
      <div className="absolute top-0 lg:right-20 md:right-15 right-5 max-md:top-2 flex gap-2">
        <span className="tag cursor-pointer" onClick={prevSlide}>
          &lt;
        </span>
        <span className="tag cursor-pointer" onClick={nextSlide}>
          &gt;
        </span>
      </div>

      {/* Grid Container */}
      <div className="flex gap-5 overflow-hidden w-full ransition-transform duration-500 ease-in-out">
        {features_data
          .slice(index, index + itemsPerView)
          .concat(features_data.slice(0, Math.max(0, index + itemsPerView - totalItems))) // Loop back
          .map((item, i) => (
            <div key={i} className="w-[calc(100%/2)] md:w-[calc(100%/4)] lg:w-[calc(100%/6)] min-w-[150px] max-w-[300px] border transition-transform duration-500 ease-in-out p-5 shadow-lg rounded-lg bg-white">
              <img src={item.img} alt={item.name} className="w-full h-auto object-contain" />
              <p className="text-center mt-2">{item.name}</p>
            </div>
          ))}
      </div>

      <div className=" grid lg:grid-cols-2 grid-cols-1 mt-10 w-full gap-5 ">
        {discountProducts.map( (item, key) => (
          <div 
          className="relative hover:border-green-400 hover:border-1 bg-gray-300 shadow-md h-[220px] rounded-2xl flex flex-col items-start gap-4 p-10 overflow-hidden "
          key={key}>
            <h1 className="md:text-2xl text-lg text-blue-500">{item.name}</h1>
            <p className="max-md:text-md">Get Upto <b>{item.dis}</b> Off</p>
            <button className="btn2 w-30">Shop now</button>
            <img
            className="absolute top-20  right-0 w-40 h-30 sm:w-70 sm:h-50 sm:top-2 object-contain"
            src={item.img}
            alt={item.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;
