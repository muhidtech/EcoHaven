"use client";

import Rating from '@/app/components/common/Rating';
import Image from 'next/image';
import React from 'react';
import useScrollAnimation from '@/app/hooks/useScrollAnimation';

function CustomerReview() {
    // Create refs for scroll animations
    const [headerRef, isHeaderVisible] = useScrollAnimation({ threshold: 0.1 });
    const [reviewsGridRef, isReviewsGridVisible] = useScrollAnimation({ 
        threshold: 0.1,
        animationDelay: 200 
    });

    const data = [
        {
            name: "Sarah T.",
            rating: 5,
            text: "Absolutely love my bamboo toothbrush! It feels great, and I love knowing I'm helping the environment.",
            image: "https://placehold.co/400"
        },

        {
            name: "Sarah T.",
            rating: 4.4,
            text: "Absolutely love my bamboo toothbrush! It feels great, and I love knowing I'm helping the environment.",
            image: "https://placehold.co/400"
        },
        {
            name: "Sarah T.",
            rating: 4.8,
            text: "Absolutely love my bamboo toothbrush! It feels great, and I love knowing I'm helping the environment.",
            image: "https://placehold.co/400"
        },
        {
            name: "Sarah T.",
            rating: 5,
            text: "Absolutely love my bamboo toothbrush! It feels great, and I love knowing I'm helping the environment.",
            image: "https://placehold.co/400"
        },
        {
            name: "Sarah T.",
            rating: 4.6,
            text: "Absolutely love my bamboo toothbrush! It feels great, and I love knowing I'm helping the environment.",
            image: "https://placehold.co/400"
        },

        {
            name: "Sarah T.",
            rating: 5,
            text: "Absolutely love my bamboo toothbrush! It feels great, and I love knowing I'm helping the environment.",
            image: "https://placehold.co/400"
        },
    ]

  return (
    <div className='flex flex-col gap-10 px-10 py-20 bg-green-300 w-full justify-center items-center'>
        <h1 
            ref={headerRef} 
            className={`md:text-4xl text-2xl font-medium scroll-animation-container ${
                isHeaderVisible ? 'animate-fadeInDown' : ''
            }`}
        >
            Customer Reviews
        </h1>

        <div 
            ref={reviewsGridRef}
            className={`grid xl:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-5 scroll-animation-container ${
                isReviewsGridVisible ? 'animate-fadeInUp' : ''
            }`}
        >
            {data.map((item, key) => (
                <div 
                    key={key} 
                    className={`p-2 flex flex-col gap-5 justify-center items-center bg-white rounded-2xl shadow-md shadow-black scroll-animation-container ${
                        isReviewsGridVisible ? `animate-fadeInUp delay-${(key % 10) * 100}` : ''
                    }`}
                >
                    <div className='flex w-full justify-start items-center gap-5'>
                        <Image 
                        className='rounded-full'
                        src={item.image} 
                        width={40} 
                        height={40} 
                        alt={item.name}/>

                        <h1 className='text-lg'>
                            {item.name}
                        </h1>
                    </div>
                    <div className='flex flex-col gap-5'>
                        <p className='text-md font-mono text-start'>
                            {item.text}
                        </p>
                        <div className='w-full flex gap-3 items-center justify-center'>
                            <Rating rating={item.rating}/>
                            <p className='text-sm text-black/70 '>
                                {item.rating}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      
    </div>
  )
}

export default CustomerReview
