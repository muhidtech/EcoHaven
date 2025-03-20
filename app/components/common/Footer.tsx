"use client";

import { useCart } from "@/app/contexts/CardContext";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Updated import for useRouter in App Router
import React, { useState, useEffect } from "react";
import { BiUpArrowAlt } from "react-icons/bi";

function Footer() {
  const [showButton, setShowButton] = useState(false);
  const router = useRouter();
  const { getItemCount } = useCart();

  // Navigate to checkout page if cart is not empty
  const handleViewCheck = () => {
    if (getItemCount() > 0) {
      router.push("/cart");
    }
  };

  // Show "Back to Top" button after scrolling 300px
  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to top of page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl">
        {/* Footer Links Section */}
        <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4">
          {[
            {
              title: "EcoHaven",
              links: [
                { href: "/about", label: "About" },
                { href: "#", label: "Careers" },
                { href: "#", label: "Brand Center" },
                { href: "#", label: "Blog" },
              ],
            },
            {
              title: "Help Center",
              links: [
                { href: "#", label: "Discord Server" },
                { href: "#", label: "Twitter" },
                { href: "#", label: "Facebook" },
                { href: "#", label: "Contact Us" },
              ],
            },
            {
              title: "Legal",
              links: [
                { href: "#", label: "Privacy Policy" },
                { href: "#", label: "Licensing" },
                { href: "#", label: "Terms & Conditions" },
              ],
            },
            {
              title: "Download",
              links: [
                { href: "#", label: "iOS" },
                { href: "#", label: "Android" },
                { href: "#", label: "Windows" },
                { href: "#", label: "MacOS" },
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                {section.title}
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                {section.links.map((link) => (
                  <li key={link.label} className="mb-4">
                    <Link href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom Section */}
        <div className="px-4 py-6 bg-gray-100 dark:bg-gray-700 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">
            © 2025 EcoHaven. All Rights Reserved.
          </span>

          {/* Social Links */}
          <div className="flex mt-4 space-x-5 rtl:space-x-reverse sm:justify-center md:mt-0">
            {[
              {
                href: "#",
                label: "Facebook",
                icon: (
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 8 19"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
              },
              {
                href: "#",
                label: "Twitter",
                icon: (
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 17"
                  >
                    <path
                      fillRule="evenodd"
                      d="M20 1.892a8.178 8.178 0 0 1-2.355.635..."
                      clipRule="evenodd"
                    />
                  </svg>
                ),
              },
            ].map((social) => (
              <a key={social.label} href={social.href} className="text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-label={social.label}>
                {social.icon}
              </a>
            ))}
          </div>

          {/* Scroll to Top Button */}
          {showButton && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-10 right-10 bg-green-600 p-3 rounded-full shadow-lg hover:bg-green-700"
              aria-label="Back to top"
            >
              <BiUpArrowAlt size={30} className="text-white" />
            </button>
          )}

          {/* View Cart Button */}
          <button
            onClick={handleViewCheck}
            className="fixed top-20 right-10 w-40 cursor-pointer py-3 rounded-2xl text-center bg-green-300"
          >
            View Cart ({getItemCount()})
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
