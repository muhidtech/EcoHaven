"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  popular: boolean;
  inStock: boolean;
}

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/products.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter products marked as popular
        const popularProducts = data.filter((product: Product) => product.popular);
        setProducts(popularProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load popular products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to render star ratings
  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon 
          key={i} 
          className={`h-4 w-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Products</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Products</h2>
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <section className="container mx-auto py-16 px-4">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-bold">Popular Products</h2>
        <Link href="/shop" className="text-green-600 hover:text-green-800 font-medium">
          View All
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">No popular products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <Link href={`/product/${product.id}`}>
                <div className="relative h-64 w-full">
                  <Image
                    src={product.image || "https://placehold.co/400"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    {renderRating(product.rating)}
                  </div>
                  <p className="text-green-600 font-bold">${product.price.toFixed(2)}</p>
                  {!product.inStock && (
                    <span className="text-red-500 text-sm block mt-1">Out of stock</span>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularProducts;