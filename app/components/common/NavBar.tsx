"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import Link from "next/link";


// Global state access
let setCarts: React.Dispatch<React.SetStateAction<number>>;
let setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
let getCarts: () => number;
let getIsLoggedIn: () => boolean;

// Functions to update and retrieve global state
export function updateCarts() {
  setCarts((c) => c + 1);
}

export function updateIsLoggedIn(status: boolean) {
  setIsLoggedIn(status);
}

export function getCartCount() {
  return getCarts();
}

export function checkIsLoggedIn() {
  return getIsLoggedIn();
}


function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoggedIn, _setIsLoggedIn] = useState(false);
  const [carts, _setCarts] = useState(5);
  const pathname = usePathname();

  // Link internal state to external setters and getters
  setCarts = _setCarts;
  setIsLoggedIn = _setIsLoggedIn;
  getCarts = () => carts;
  getIsLoggedIn = () => isLoggedIn;

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "ABOUT US", path: "/about" },
    { name: "SHOP", path: "/shop" },
    { name: "BLOG", path: "/blog" },
    { name: "CONTACT US", path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full bg-white shadow-md transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } flex justify-between items-center px-5 lg:px-10 py-4 z-40`}
      >
        <h1 className="text-2xl hover:scale-110 transition text-green-500 duration-300 font-mono">
          <Link href="/">EcoHaven</Link>
        </h1>

        <button
          className={`lg:hidden text-3xl text-green-500 hover:scale-110 transition duration-300 ${menuOpen ? "hidden" : ""}`}
          onClick={() => setMenuOpen(true)}
        >
          <FiMenu />
        </button>

        <div className="hidden lg:flex items-center gap-12">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-[#81C784] hover:text-[#2E7D32] ${
                pathname === item.path ? "text-yellow-900" : ""
              } ${
                ["/", "/about", "/contact"].includes(item.path) && isLoggedIn
                  ? "hidden"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}

          <Link href="/login">
            <FiUser
              className={`text-3xl text-green-500 hover:text-green-600 cursor-pointer ${
                ["/login", "/signup"].includes(pathname)
                  ? "text-yellow-900"
                  : ""
              }`}
            />
          </Link>
          <FiSearch
            className="text-3xl text-green-500 hover:text-green-600 cursor-pointer"
            onClick={() => setShowSearch(!showSearch)}
          />
          <div className="relative">
            <FiShoppingCart className="text-3xl text-green-500 hover:text-green-600 cursor-pointer" />
            <span className="absolute -top-2 -right-2 bg-[#FFC107] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {carts}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-y-0 right-0 pt-20 h-full w-[70%] sm:w-[50%] bg-white transition-transform duration-500 ease-in-out z-50 ${menuOpen ? "translate-x-0" : "translate-x-full"} flex flex-col items-center gap-10`}
      >
        <button
          className="absolute cursor-pointer top-5 right-5 text-4xl text-black"
          onClick={() => setMenuOpen(false)}
        >
          <FiX />
        </button>

        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`text-[#81C784] hover:text-[#2E7D32] ${
              pathname === item.path ? "text-yellow-900" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}

        <button className="w-full bg-green-500 py-4 text-white cursor-pointer transition duration-300 ease-in-out focus:bg-green-300 focus:text-black">
          SIGN IN
        </button>
      </div>

      {showSearch && (
        <div className="fixed top-16 left-0 w-full bg-white shadow-md py-3 px-5 z-30 transition-all duration-300">
          <div className="relative max-w-4xl mx-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-12 py-3 rounded-lg border border-secondary focus:outline-none focus:border-primary"
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
