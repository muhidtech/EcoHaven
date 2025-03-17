"use client"


import Link from 'next/link'
import React from 'react'

function ContactHero() {
  return (
    <div className='h-screen w-full md:px-10 px-5 lg:px-20 flex justify-center items-center'>
        <div className='bg-cover bg-center h-[80%] w-full flex md:flex-row flex-col justify-center items-center rounded-2xl shadow-2xl gap-5 ' style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/contact.jpg")'}} >

            <button className='py-4 px-8 bg-green-500 rounded-2xl cursor-pointer hover:bg-green-500/70  '>
                <Link href='/'>GET STARTED</Link>
            </button>
            <button className='py-4 px-8 border-2 border-green-500 text-white hover:bg-green-500 hover:text-black rounded-2xl'>
                <Link href='#Contact'>CONTACT</Link>

            </button>

        </div>
    </div>
  )
}

export default ContactHero
