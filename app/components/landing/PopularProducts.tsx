"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useCart } from "../../contexts/CardContext";
import { ProductCard } from "@/app/shop/Shop";
import { getProducts } from "@/app/services/localDataService";

interface Product {
  id: string;
  name: string;
  category: string;
  slug: string;
  description?: string;
  price: number;
  rating: number;
  stock: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  featured?: boolean;
  popular?: boolean;
}

// Skeleton loader component for product cards
const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
      {/* Image placeholder with aspect ratio matching product images */}
      <div className="w-full h-48 bg-gray-300 rounded-md mb-4" style={{ aspectRatio: '1/1' }}></div>
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-300 rounded w-full"></div>
    </div>
  );
};

const PopularProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { addItem, itemExists, updateQuantity, removeItem } = useCart();

  // Fetch products with caching
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setIsLoading(true);
        // getProducts already handles caching internally
        // This ensures product data including image URLs are cached
        const data = await getProducts();
        const popularItems = data.filter((product) => product.popular);
        
        // Preload images for the first few products to improve perceived performance
        if (popularItems.length > 0) {
          const imagesToPreload = popularItems.slice(0, 4);
          imagesToPreload.forEach(product => {
            if (typeof window !== 'undefined') {
              const img = new Image();
              img.src = product.image;
            }
          });
        }
        
        setProducts(popularItems);
      } catch (error) {
        console.error("Error fetching popular products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  // Memoize the filtering of popular products
  const popularProducts = useMemo(() => products, [products]);

  // Debounce function
  const debounce = (func: (...args: unknown[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: unknown[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Update visible products based on screen size
  // This helps with performance by limiting the number of images loaded
  const updateVisibleProducts = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) {
        setVisibleProducts(popularProducts.slice(0, 10));
      } else if (window.innerWidth >= 640 && window.innerWidth < 1280) {
        setVisibleProducts(popularProducts.slice(0, 16));
      } else {
        setVisibleProducts(popularProducts);
      }
    } else {
      // Default for server-side rendering
      setVisibleProducts(popularProducts.slice(0, 16));
    }
  }, [popularProducts]);

  // Debounced resize handler
  const debouncedUpdateVisibleProducts = useCallback(
    debounce(updateVisibleProducts, 250),
    [updateVisibleProducts]
  );

  useEffect(() => {
    // Initial update
    updateVisibleProducts();
    
    if (typeof window !== 'undefined') {
      // Add debounced event listener
      window.addEventListener("resize", debouncedUpdateVisibleProducts);
      return () => window.removeEventListener("resize", debouncedUpdateVisibleProducts);
    }
  }, [updateVisibleProducts, debouncedUpdateVisibleProducts]);

  const handleAddToCart = (item: Product) => {
    if (item.stock <= 0) {
      alert("Item is out of stock");
      return;
    }

    if (itemExists(item.id)) {
      removeItem(item.id);
      alert("Item removed from cart");
      return;
    }
    updateQuantity(item.id, item.stock);
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      stock: item.stock,
      slug: item.slug,
    });
    alert("Item added to cart");
  };

  // Create skeleton array for loading state
  const skeletonArray = Array(10).fill(0);

  return (
    <div className="xl:px-20 px-10 max-md:px-5 pb-20">
      <h1 className="text-2xl font-bold mb-5">Popular Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        {isLoading ? (
          // Show skeleton loaders while loading
          skeletonArray.map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : visibleProducts.length > 0 ? (
          // Show products when loaded
          visibleProducts.map((product) => (
            <ProductCard
              key={product.slug || product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
              loading="lazy"
              priority={false}
            />
          ))
        ) : (
          // Show message when no products found
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No popular products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularProducts;
