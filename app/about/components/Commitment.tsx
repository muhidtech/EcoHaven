"use client";

import React from 'react';
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { BiRecycle, BiHomeHeart } from "react-icons/bi";
import useScrollAnimation from '../../hooks/useScrollAnimation';

function Commitment() {
    const [headingRef, headingVisible] = useScrollAnimation({ threshold: 0.2 });
    const [featuresRef, featuresVisible] = useScrollAnimation({ threshold: 0.1, animationDelay: 200 });

    const data = {
        head: "Sustainability at the Core of Everything We Do",
        text: "Our products are more than just eco-friendly—they are a statement. We ensure every item is made from ethically sourced, biodegradable, or reusable materials. We work closely with artisans and small businesses to maintain fair trade practices and reduce waste at every step.",
    };

    const features = [
        {
            name: "Plastic-Free Packaging",
            icon: FiPackage
        },
        {
            name: "Handmade & Ethically Sourced Products",
            icon: FiShoppingBag
        },
        {
            name: "Zero-Waste & Biodegradable Materials",
            icon: BiRecycle
        },
        {
            name: "Supporting Local Artisans",
            icon: BiHomeHeart
        }
    ];

    return (
        <div className='w-full flex flex-col items-center justify-center py-16 px-8 bg-green-100'>
            <div 
                ref={headingRef} 
                className={`scroll-animation-container ${headingVisible ? 'animate-fadeInUp' : ''} w-full flex flex-col items-center`}
            >
                <h1 className='md:text-4xl text-2xl font-bold text-center mb-6'>
                    {data.head}
                </h1>
                <p className='text-lg text-center max-w-3xl mb-12 text-gray-700'>
                    {data.text}
                </p>
            </div>

            <div 
                ref={featuresRef} 
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full ${featuresVisible ? '' : 'scroll-animation-container'}`}
            >
                {features.map((item, key) => {
                    const Icon = item.icon;
                    const delayClass = `delay-${(key + 1) * 200}`;

                    return (
                        <div 
                            key={key} 
                            className={`flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:scale-105 transition-transform scroll-animation-container ${featuresVisible ? `animate-flipIn ${delayClass}` : ''}`}
                        >
                            <Icon className='text-green-600 text-5xl mb-4' />
                            <p className='text-lg font-semibold'>{item.name}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Commitment;
