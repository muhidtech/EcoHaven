"use client";

import React from 'react';
import useScrollAnimation from '@/app/hooks/useScrollAnimation';

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

    // Animation hooks for different sections
    const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });
    const [teamGridRef, teamGridVisible] = useScrollAnimation({ threshold: 0.1, animationDelay: 200 });
    const [quoteRef, quoteVisible] = useScrollAnimation({ threshold: 0.1, animationDelay: 300 });

    return (
        <div className='w-full flex flex-col gap-10 items-center justify-center py-16 lg:px-8 px-15'>
            <div 
                ref={headerRef} 
                className={`scroll-animation-container ${headerVisible ? 'animate-fadeInDown' : ''}`}
            >
                <h1 className='md:text-4xl text-2xl font-bold text-center'>
                    Meet the Team
                </h1>
            </div>

            <div 
                ref={teamGridRef}
                className={`grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mt-8 scroll-animation-container ${teamGridVisible ? 'animate-fadeIn' : ''}`}
            >
                {team.map((member, index) => {
                    // Different animation for each team member
                    let animationClass = '';
                    let delayClass = '';
                    
                    if (index === 0) {
                        animationClass = 'animate-fadeInLeft';
                        delayClass = 'delay-200';
                    } else if (index === 1) {
                        animationClass = 'animate-fadeIn';
                        delayClass = 'delay-400';
                    } else {
                        animationClass = 'animate-fadeInRight';
                        delayClass = 'delay-600';
                    }
                    
                    return (
                        <div 
                            key={index}
                            style={{
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${member.image})`
                            }}
                            className={`relative cursor-pointer group hover:scale-105 transition-transform duration-300 w-full lg:h-100 bg-cover lg:bg-top md:h-150 h-80 bg-no-repeat rounded-3xl lg:rounded-lg flex items-center justify-center scroll-animation-container ${teamGridVisible ? `${animationClass} ${delayClass}` : ''}`}>

                        <div className='absolute group-hover:scale-105 transition-transform duration-300 text-gray-300 text-center'>
                            <h2 className='text-lg font-semibold'>{member.name}</h2>
                            <p className='text-sm'>{member.role}</p>
                            <p className='text-xs'>{member.secRole}</p>
                        </div>
                        </div>
                    );
                })}
            </div>

            <div 
                ref={quoteRef}
                className={`max-w-3xl bg-green-300 flex flex-col gap-6 h-auto p-10 rounded-2xl shadow-xl scroll-animation-container ${quoteVisible ? 'animate-zoomIn delay-300' : ''}`}
            >
                <h1 className='text-2xl md:text-4xl text-center font-medium text-black/70'>
                    <span>&#34;</span>{quote.quote}<span>&#34;</span>
                </h1>
                <span className='text-end text-lg'>- {quote.name}</span>
            </div>
        </div>
    );
}

export default Team;
