"use client"


import React from 'react'

function Hero() {
    

  return (
    <div 
    className='bg-cover  h-screen w-full flex flex-col justify-center items-center'>
      <h1 className='text-4xl text-center text-yellow-900 w-2xl  font-medium font-mono'>
        Our Journey to a Greener Future
      </h1>
      <p className='text-lg text-green-600 w-3xl text-center font-mono'>
        EcoHaven is more than a brand—it’s a movement towards a more sustainable world, one product at a time.
      </p>

      <button className='border-green-500 border-2  w-xs py-3 rounded-2xl text-green-500 hover:bg-green-500 hover:text-white cursor-pointer mt-5'>
        Get Started
      </button>
    </div>
  )
}

export default Hero
