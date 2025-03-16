"use client"

import React from 'react';
import Rating from './rate';
import products from './products.json';

function PopularProducts() {
  return (
    <div className='xl:px-20 px-10 pb-20'>
      <h1 className="text-2xl font-bold mb-5">Popular Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        {products
          .filter(item => item.popular) // Only keep products where `popular` is true
          .map((item, key) => (
            <div key={key} className="hover:shadow-green-600 hover:shadow-sm relative border p-5 pt-7 shadow-md rounded-md bg-white">
              <div className='flex w-full justify-center'>
                <img src={item.image_url} alt={item.name} className="w-sm mt-3 h-auto object-contain mb-1" />
              </div>
              <p className='text-sm text-gray-500 pb-2'>{item.category}</p>
              <h2 className="text-md font-semibold">{item.name}</h2>
              <div className='flex w-full gap-2 py-1'>
                <Rating rating={item.rating} />
                <span className='text-gray-500 text-sm'>{item.rating} &#40;{item.stock}&#41;</span>
              </div>
              <div className='flex justify-between items-center pt-3'>
                <span className='text-sm font-medium'>${item.price} <span className='font-medium text-gray-500 text-sm line-through'>{item.old_price}</span></span>

                <button className='bg-green-600 text-white text-sm px-3 py-2 rounded-xl font-medium '>+ Add</button>
              </div>
              <span className={`absolute top-3 text-xs py-1  px-2 text-red-500 rounded-md  ${item.hot|| item.sale ? "block" : "hidden"} `}>{item.hot ? "Hot" : ""}{item.sale ? "Sale" : ""}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PopularProducts;
