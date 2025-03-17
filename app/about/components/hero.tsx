"use client"


import Link from 'next/link'
import React from 'react'

function Hero() {
    

  return (
    <div 
    className='bg-cover bg-center  h-screen w-full flex flex-col justify-center items-center px-10' style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/about.jpg")'}}>
      <h1 className='md:text-4xl text-2xl text-center text-white md:w-2xl mb-5  font-medium font-mono'>
        Our Journey to a Greener Future
      </h1>
      <p className='text-lg text-white/80 md:w-2xl text-center font-mono'>
        EcoHaven is more than a brand—it’s a movement towards a more sustainable world, one product at a time.
      </p>

      <button className='border-white border-2  w-xs py-3 rounded-2xl text-white hover:bg-white hover:text-black cursor-pointer mt-5'>
        <Link href='/signup'>Get Started</Link>
      </button>
    </div>
  )
}

export default Hero
