"use client";

import React, { useState, useEffect } from "react";
import Rating from "../common/Rating";
import { useCart } from "../../contexts/CardContext";
import { updateCarts } from "../common/NavBar"

interface Product {
  id: string;
  name: string;
  price: number;
  old_price?: number;
  slug: string;
  rating: number;
  category: string;
  imageUrl: string;
  stock: number;
  popular: boolean;
  hot?: boolean;
  sale?: boolean;
}

const PopularProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem, itemExists } = useCart();

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await fetch("/products.json");
        const data = await response.json();
        setProducts(data.filter((product: Product) => product.popular));
      } catch (error) {
        console.error("Error fetching popular products:", error);
      }
    };

    fetchPopularProducts();
  }, []);

  const handleAddToCart = (item: Product) => {
    if (item.stock <= 0) {
      alert("Out of stock");
      return;
    }

    if (itemExists(item.id)) {
      alert("Item already in cart");
      updateCarts()
      return;
    }

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.imageUrl,
      stock: item.stock,
      slug: item.slug
    });
  };

  return (
    <div className="xl:px-20 px-10 pb-20">
      <h1 className="text-2xl font-bold mb-5">Popular Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        {products.map((item) => (
          <div
            key={item.id}
            className="hover:shadow-green-600 hover:shadow-sm relative border p-5 pt-7 shadow-md rounded-md bg-white"
          >
            <div className="flex w-full justify-center">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-sm mt-3 h-auto object-contain mb-1"
              />
            </div>
            <p className="text-sm text-gray-500 pb-2">{item.category}</p>
            <h2 className="text-md font-semibold">{item.name}</h2>
            <div className="flex w-full gap-2 py-1">
              <Rating rating={item.rating} />
              <span className="text-gray-500 text-sm">
                {item.rating} &#40;{item.stock} in stock&#41;
              </span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-sm font-medium">
                ${item.price}{" "}
                {item.old_price && (
                  <span className="font-medium text-gray-500 text-sm line-through">
                    ${item.old_price}
                  </span>
                )}
              </span>
              <button
                className={`${
                  itemExists(item.id) ? "bg-gray-400" : "bg-green-600"
                } text-white text-sm px-3 py-2 rounded-xl font-medium cursor-pointer`}
                onClick={() => handleAddToCart(item)}
                disabled={itemExists(item.id)}
              >
                {itemExists(item.id) ? "In Cart" : "+ Add"}
              </button>
            </div>

            {(item.hot || item.sale) && (
              <span className="absolute top-3 text-xs py-1 px-2 text-red-500 rounded-md">
                {item.hot ? "Hot" : ""} {item.sale ? "Sale" : ""}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;