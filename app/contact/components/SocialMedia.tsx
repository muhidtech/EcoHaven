"use client";

import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

const SocialMedia = () => {
  const socialLinks = [
    {
      platform: "Instagram",
      handle: "@EcoHaven",
      icon: <FaInstagram />,
      url: "https://instagram.com/EcoHaven",
    },
    {
      platform: "Facebook",
      handle: "EcoHaven Official",
      icon: <FaFacebookF />,
      url: "https://facebook.com/EcoHavenOfficial",
    },
    {
      platform: "Twitter (X)",
      handle: "@EcoHaven",
      icon: <FaTwitter />,
      url: "https://twitter.com/EcoHaven",
    },
  ];

  return (
    <div className="bg-green-200 py-12 px-6">
      <h1 className="text-4xl font-bold text-green-700 mb-4 text-center">
        Join Our Eco-Friendly Community!
      </h1>
      <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto">
        Stay updated on new products, sustainability tips, and exclusive discounts.
        Follow us on social media!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white relative p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <div className="text-5xl text-green-600 mb-4 group-hover:text-green-800">
              {link.icon}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {link.platform}
            </h2>
            <p className="text-gray-600">{link.handle}</p>

            <div className="fixed h-full bg-black/90 w-full flex justify-center items-center rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FiExternalLink className="cursor-pointer text-white text-4xl" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialMedia;
