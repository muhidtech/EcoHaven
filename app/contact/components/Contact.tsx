"use client";

import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
  return (
    <div id='Contact' className="bg-gray-100 flex flex-col justify-center items-center w-full py-12">
      <h1 className='md:text-4xl text-3xl font-semibold text-center mb-3'>
        CONTACT US
      </h1>
      <p className='text-center mb-8 md:w-2xl px-3'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ullamcorper pharetra ligula nec hendrerit. Ut eu libero nec magna placerat fringilla.
      </p>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center text-center p-6 bg-white shadow-lg rounded-lg">
            <FaMapMarkerAlt className="text-green-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">ADDRESS</h3>
            <p>Your Location, City, Country</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white shadow-lg rounded-lg">
            <FaPhoneAlt className="text-green-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">PHONE NUMBER</h3>
            <p>+123-456-789</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white shadow-lg rounded-lg">
            <FaEnvelope className="text-green-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">EMAIL</h3>
            <p>sudeepacharjeegp@gmail.com</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <iframe
              title="map"
              className="w-full h-96 rounded-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509245!2d144.95565101531593!3d-37.81732797975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xbba97a8f3b2a1a99!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1633058078005!5m2!1sen!2sus"
              loading="lazy"
            ></iframe>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="p-3 border border-gray-300 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                placeholder="Message"
                className="p-3 border border-gray-300 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-3 rounded-lg w-full hover:bg-green-600 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;