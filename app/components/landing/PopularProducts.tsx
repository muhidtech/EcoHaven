"use client";

import React, { useState, useEffect } from "react";
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

const PopularProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const { addItem, itemExists, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const data = await getProducts();
        const popularItems = data.filter((product) => product.popular);
        setProducts(popularItems);
      } catch (error) {
        console.error("Error fetching popular products:", error);
      }
    };

    fetchPopularProducts();
  }, []);

  useEffect(() => {
    const updateVisibleProducts = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) {
          setVisibleProducts(products.slice(0, 10));
        } else if (window.innerWidth >= 640 && window.innerWidth < 1280) {
          setVisibleProducts(products.slice(0, 16));
        } else {
          setVisibleProducts(products);
        }
      } else {
        // Default for server-side rendering
        setVisibleProducts(products.slice(0, 16));
      }
    };

    updateVisibleProducts();
    
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", updateVisibleProducts);
      return () => window.removeEventListener("resize", updateVisibleProducts);
    }
  }, [products]);

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

  return (
    <div className="xl:px-20 px-10 max-md:px-5 pb-20">
      <h1 className="text-2xl font-bold mb-5">Popular Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.slug || product.id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
