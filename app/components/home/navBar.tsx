"use client";

import React, { useState, useEffect } from "react";
import { FiMenu, FiX, FiSearch, FiShoppingCart, FiUser } from "react-icons/fi"; // Importing the icons
import "./homes.css";
import 'next/link'
import Link from "next/link";

type NavBarProps = {
  active: string;
};



function NavBar({ active }: NavBarProps ) { 
  const [activePage, setActivePage] = useState(active);
  const [carts, setCart] = useState(5);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide navbar when scrolling down, show when scrolling up
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const links = document.querySelectorAll("#links a");
    const link = document.querySelectorAll("#link a");
  
    link.forEach((links) => {
      // Reset all links
      links.classList.remove("text-yellow-900", "hover:text-yellow-800");
      links.classList.add("text-[#81C784]", "hover:text-[#2E7D32]");

      // Apply active styles
      if (links.textContent?.includes(activePage)) {
        links.classList.remove("text-[#81C784]", "hover:text-[#2E7D32]");
        links.classList.add("text-yellow-900", "hover:text-yellow-800");
      }
    })
    links.forEach((link) => {
      // Reset all links
      link.classList.remove("text-yellow-900", "hover:text-yellow-800");
      link.classList.add("text-[#81C784]", "hover:text-[#2E7D32]");

      // Apply active styles
      if (link.textContent?.includes(activePage)) {
        link.classList.remove("text-[#81C784]", "hover:text-[#2E7D32]");
        link.classList.add("text-yellow-900", "hover:text-yellow-800");
      }
    });
  }, [activePage]);



  return (
    <>
      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 w-full transition-transform duration-300 ${
          isVisible ? "translate-y-0 bg-white shadow-md" : "-translate-y-full"
        } flex justify-between items-center px-5 lg:px-10 py-3 z-40`}
      >
        <h1 className="text-2xl hover:scale-110 transition text-green-500 duration-300 font-mono text-primary">
          <Link href="../">EcoHaven</Link> 
        </h1>

        {/* Hamburger menu button */}
        <button
          className={`md:hidden text-3xl text-primary hover:scale-110 transition duration-300 ${menuOpen ? "hidden" : ""}`}
          onClick={() => setMenuOpen(true)}
        >
          <FiMenu />
        </button>

        {/* Desktop Navigation */}
        <div id="links" className="hidden md:flex items-center justify-end lg:justify-between w-3xl gap-7 lg:gap-10">
          <Link href="../../about" className="links text-secondary">
            About Us
          </Link>
          <a href="#" className="links">
            Service
          </a>
          <a href="#" className="links">
            Shop Now
          </a>
          <a href="#" className="links">
            Contact Us
          </a>
          
          {/* User Icon */}
          <div className="flex items-center">
            <FiUser className="text-2xl text-primary hover:text-secondary cursor-pointer hover:text-green-600" />
          </div>
          
          {/* Search Icon */}
          <div className="flex items-center">
            <FiSearch 
              className="text-2xl text-primary hover:text-secondary cursor-pointer hover:text-green-600" 
              onClick={() => setShowSearch(!showSearch)}
            />
          </div>
          
          {/* Cart Icon - Now at the end */}
          <div className="relative">
            <FiShoppingCart className="text-2xl text-primary hover:text-secondary cursor-pointer hover:text-green-600" />
            <span className="absolute -top-2 -right-2 bg-[#FFC107] text-white text-xs rounded-full w-4 h-4  flex items-center justify-center">{carts}</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Full Screen & On Top */}
      <div
      id="link"
  className={`bg-white/80 fixed inset-y-0 px-15  right-0 pt-20 h-full w-[70%] sm:w-[50%] bg-secondary  transition-transform duration-500 ease-in-out z-50 ${
    menuOpen ? "translate-x-0" : "translate-x-full"
  } flex flex-col items-center gap-10`}
>
        {/* Close button */}
        <button className="absolute cursor-pointer top-5 right-5 text-4xl text-black" onClick={() => setMenuOpen(false)}>
          <FiX />
        </button>

        <Link href="../../about" className="link" onClick={() => setMenuOpen(false)}>
          About Us
        </Link>
        <a href="#" className="link" onClick={() => setMenuOpen(false)}>
          Service
        </a>
        <a href="#" className="link" onClick={() => setMenuOpen(false)}>
          Shop Now
        </a>
        <a href="#" className="link" onClick={() => setMenuOpen(false)}>
          Contact Us
        </a>

        <div className="md:hidden flex justify-between w-full">
          <button className="btn">Login</button>
          <button className="btn">Sign Up</button>
        </div>
        {/* Icons in mobile menu */}
        <div className="hidden md:flex gap-8 items-center">
          {/* User Icon */}
          <FiUser className="text-3xl text-primary hover:text-secondary cursor-pointer" />
          
          {/* Search Icon */}
          <FiSearch 
            className="text-3xl text-primary hover:text-secondary cursor-pointer" 
            onClick={() => {
              setShowSearch(!showSearch);
              setMenuOpen(false);
            }}
          />
          
          {/* Shopping cart */}
          <div className="relative">
            <FiShoppingCart className="text-3xl text-primary hover:text-secondary cursor-pointer" />
            <span className="absolute -top-2 -right-2 bg-highlight text-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">{carts}</span>
          </div>
        </div>
      </div>

      {/* Full-width search bar */}
      {showSearch && (
        <div className="fixed top-16 left-0 w-full bg-white shadow-md py-3 px-5 z-30 transition-all duration-300">
          <div className="relative max-w-4xl mx-auto">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-12 py-2 rounded-lg border border-secondary focus:outline-none focus:border-primary"
              autoFocus
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-secondary"
              onClick={() => setShowSearch(false)}
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
