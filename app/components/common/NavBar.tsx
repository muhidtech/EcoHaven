"use client";

import React, { useState, useEffect, KeyboardEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import Link from "next/link";
import { useCart } from "../../contexts/CardContext";
import { useAuth } from "../../contexts/AuthContext";

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { getItemCount } = useCart();
  const { signOut, isLoggedIn } = useAuth();

  const handleShowSearch = () => {
    if(showSearch) {
      setShowSearch(false);
    } else {
      setShowSearch(true)
    }
  }

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "ABOUT US", path: "/about" },
    { name: "SHOP", path: "/shop" },
    { name: "BLOG", path: "/blog" },
    { name: "CONTACT US", path: "/contact" },
  ];


  // Handle logout and redirect to home
  const handleSignOut = () => {
    if (isLoggedIn) {
      signOut();
      setDropdownOpen(false); // Close desktop dropdown on logout
      setMobileDropdownOpen(false); // Close mobile dropdown on logout
      router.push("/");
    }
  };

  // Navbar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close desktop dropdown when clicking outside
      if (dropdownOpen && !(event.target as Element).closest('.user-dropdown-container')) {
        setDropdownOpen(false);
      }
      
      // Close mobile dropdown when clicking outside
      if (mobileDropdownOpen && !(event.target as Element).closest('.mobile-dropdown-container')) {
        setMobileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen, mobileDropdownOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const handleViewCheck = () => {
    if (getItemCount() > 0) {
      router.push("/cart");
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <div
        className={`fixed top-0 left-0 w-full bg-white shadow-md transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } flex justify-between items-center px-5 lg:px-10 py-4 z-40`}
      >
        <h1 className="text-2xl hover:scale-110 transition text-green-500 duration-300 font-mono">
          <Link href={isLoggedIn ? "/shop" : "/"}>EcoHaven</Link>
        </h1>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden cursor-pointer text-3xl text-green-500 hover:scale-110 transition duration-300"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <FiMenu />
        </button>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-12">
          <Link 
          className={`text-[#81C784] hover:text-[#2E7D32] ${
            pathname === '/product' ? "text-yellow-900" : ""
          } ${ isLoggedIn ? "" : "hidden"}`}
          href='/product'
          >
              PRODUCT
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-[#81C784] hover:text-[#2E7D32] ${
                pathname === item.path ? "text-yellow-900" : ""
              }  ${
                ["/", "/about", "/contact"].includes(item.path) && isLoggedIn
                  ? "hidden"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Search Icon */}
          <FiSearch
            className="text-2xl text-green-500 hover:text-green-600 cursor-pointer"
            onClick={() => handleShowSearch()}
          />

          {/* Cart Icon */}
          <Link href="/cart" aria-label="Shopping cart" className="relative">
            <FiShoppingCart
              className="text-2xl text-green-500 hover:text-green-600 cursor-pointer"
              onKeyDown={() => handleViewCheck()}
            />
            {getItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FFC107] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {getItemCount()}
              </span>
            )}
          </Link>

          {/* User Icon & Dropdown */}
          <div className="relative user-dropdown-container">
            {isLoggedIn ? (
              <>
                {/* Logged In - Desktop Dropdown */}
                <FiUser
                  className="text-2xl text-green-500 hover:text-green-600 cursor-pointer"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  role="button"
                  aria-expanded={dropdownOpen}
                  aria-label="User Menu"
                  tabIndex={0} /* Add keyboard accessibility */
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setDropdownOpen((prev) => !prev);
                    }
                  }}
                />

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                    <Link href="/profile" className="cursor-pointer block px-4 py-2 hover:bg-green-100">
                      Profile
                    </Link>
                    <Link href="/profile/edit" className="cursor-pointer block px-4 py-2 hover:bg-green-100">
                      Edit Profile
                    </Link>
                    <Link href="/settings" className="cursor-pointer block px-4 py-2 hover:bg-green-100">
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="cursor-pointer block w-full text-left px-4 py-2 hover:bg-green-100"
                      aria-label="Logout from account"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSignOut();
                        }
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/login" aria-label="Login">
                <FiUser className="text-3xl text-green-500 hover:text-green-600 cursor-pointer" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 pt-20 h-full w-[70%] sm:w-[50%] bg-white transition-transform duration-500 ease-in-out z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col items-center gap-10`}
      >
        <button
          className="absolute top-5 right-5 text-4xl cursor-pointer"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <FiX />
        </button>
        {isLoggedIn && (
          <div className="relative mobile-dropdown-container">
            <h1
              onClick={() => setMobileDropdownOpen((prev) => !prev)} /* Use mobile-specific state */
              role="button"
              aria-expanded={mobileDropdownOpen}
              aria-label="User Menu"
              className="cursor-pointer text-[#81C784] hover:text-[#2E7D32]"
              tabIndex={0} /* Add keyboard accessibility */
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setMobileDropdownOpen((prev) => !prev);
                }
              }}
            >
              Profile
            </h1>

            {mobileDropdownOpen && ( /* Use mobile-specific state */
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                <Link href="/profile" className="block px-4 py-2 hover:bg-green-100">
                  Profile
                </Link>
                <Link href="/profile/edit" className="block px-4 py-2 hover:bg-green-100">
                  Edit Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 hover:bg-green-100">
                  Settings
                </Link>
              </div>
            )}
          </div>
        )}

          <Link 
          className={`text-[#81C784] hover:text-[#2E7D32] ${
            pathname === '/product' ? "text-yellow-900" : ""
          } ${ isLoggedIn ? "" : "hidden"}`}
          href='/product'
          >
              PRODUCT
          </Link>

        {navItems.map((item) => (
          <Link 
          key={item.path} 
          href={item.path} 
          className={`text-[#81C784] hover:text-[#2E7D32] ${
            ["/", "/about", "/contact"].includes(item.path) && isLoggedIn
              ? "hidden"
              : ""
          }`}
          >
            {item.name}
          </Link>
        ))}

        {isLoggedIn ? (
          <button
            onClick={handleSignOut}
            className="w-full text-center bg-green-300 py-5 cursor-pointer"
            aria-label="Sign out from account"
            tabIndex={0}
          >
            SIGN OUT
          </button>
        ) : (
          <Link href="/login" className="w-full text-center bg-green-300 py-5 cursor-pointer">
            SIGN IN
          </Link>
        )}
      </div>
      {showSearch && (
          <div className="fixed top-16 left-0 w-full bg-white shadow-md py-3 px-5 z-30 transition-all duration-300">
            <div className="relative max-w-4xl mx-auto">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-secondary focus:outline-none focus:border-primary"
                autoFocus
                aria-label="Search products"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-secondary"
                onClick={() => handleShowSearch()}
                aria-label="Close search"
              >
                <FiX className="text-xl" role="img" />
              </button>
            </div>
          </div>
        )}
    </>
  );
};

export default NavBar;
