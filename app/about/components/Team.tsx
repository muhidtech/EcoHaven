"use client";

import React from 'react';

function Team() {
    const team = [
        {
            name: "Mohammed Muhideen Abdul Kadir",
            role: "Founder",
            secRole: "Sustainability Advocate",
            image: "/one1.jpg"
        },
        {
            name: "Mark Reynolds",
            role: "Product Designer",
            secRole: "Ethical Sourcing Expert",
            image: "/two2.jpg"
        },
        {
            name: "Sara Johnson",
            role: "Marketing",
            secRole: "Social Media Manager",
            image: "/three3.jpg"
        }
    ];

    const quote = {
        name: "MuhidTech",
        quote: "Every choice we make has an impact. At EcoHaven, we choose sustainability."
    };

    return (
        <div className='w-full flex flex-col gap-10 items-center justify-center py-16 lg:px-8 px-15'>
            <h1 className='md:text-4xl text-2xl font-bold text-center'>
                Meet the Team
            </h1>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mt-8'>
                {team.map((member, index) => (
                    <div 
                        key={index}
                        style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${member.image})`
                        }}
                        className='relative cursor-pointer group hover:scale-105 transition-transform duration-300 w-full lg:h-80 bg-cover lg:bg-center md:h-150 h-80 bg-no-repeat rounded-3xl lg:rounded-lg flex items-center justify-center'>

                        <div className='absolute group-hover:scale-105 transition-transform duration-300 text-gray-300 text-center'>
                            <h2 className='text-lg font-semibold'>{member.name}</h2>
                            <p className='text-sm'>{member.role}</p>
                            <p className='text-xs'>{member.secRole}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='max-w-3xl bg-green-300 flex flex-col gap-6 h-auto p-10 rounded-2xl shadow-xl'>
                <h1 className='text-2xl md:text-4xl text-center font-medium text-black/70'>
                    <span>&#34;</span>{quote.quote}<span>&#34;</span>
                </h1>
                <span className='text-end text-lg'>- {quote.name}</span>
            </div>
        </div>
    );
}

export default Team;
