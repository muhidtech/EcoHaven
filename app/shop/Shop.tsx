"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useCart } from '../contexts/CardContext';
import { FiShoppingCart } from 'react-icons/fi';
import { getProducts } from '../services/localDataService';
import Rating from '../components/common/Rating';
import Image from 'next/image';
import useScrollAnimation from '../hooks/useScrollAnimation';

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
}

interface ProductGridProps {
    products: Product[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
  }


const Rate = ({ value }: { value: number }) => {
  return (
    <div className='flex items-center'>
      <Rating rating={value} />
      <span className="ml-2 text-sm font-medium text-gray-600">({value.toFixed(1)})</span>
    </div>
  );
};



  
export const ProductCard = ({ 
  product, 
  onAddToCart, 
  loading, 
  priority 
}: { 
  product: Product, 
  onAddToCart: (product : Product) => void,
  loading?: 'lazy' | 'eager',
  priority?: boolean
}) =>  {
  const [isAdding, setIsAdding] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { itemExists } = useCart();
  const router = useRouter()

  const handleAddToCart = () => {

    setIsAdding(true);
    onAddToCart(product);

    setTimeout(() => setIsAdding(false), 500);
  };

   // Navigate to the product page
   const handleViewProduct = () => {
    router.push(`/product/${product.category}/${product.slug || product.id}`); // If using Next.js
    // navigate(`/product/${product.id}`); // If using React Router
  };


  const stockLevel = product.stock <= 0
    ? { text: 'Out of stock', color: 'text-red-600 bg-red-50' }
    : product.stock <= 5
      ? { text: `Only ${product.stock} left!`, color: 'text-orange-600 bg-orange-50' }
      : { text: `${product.stock} in stock`, color: 'text-green-600 bg-green-50' };

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative h-56 sm:h-64 overflow-hidden group">
        {product.featured && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              Featured
            </span>
          </div>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
            <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold transform -rotate-12 shadow-lg">
              Sold Out
            </span>
          </div>
        )}
        <Image
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovering ? 'scale-110' : 'scale-100'} ${product.stock <= 0 ? 'opacity-70' : ''}`}
          loading={loading || 'lazy'}
          priority={priority || false}
          unoptimized={product.image.includes('http')}
          onError={(e) => { 
            e.currentTarget.src = 'https://placehold.co/400';
            e.currentTarget.onerror = null;
          }}
        />
        {product.stock > 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={handleViewProduct}
              disabled={product.stock <= 0 || itemExists(product.slug || product.id)}
              aria-label={`Quick add ${product.name} to cart`}
              className="bg-white cursor-pointer text-green-600 hover:bg-green-500 hover:text-white px-4 py-2 rounded-full font-medium transform transition-all duration-300 scale-90 hover:scale-100 shadow-lg"
            >
              View
            </button>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="px-2 py-1 rounded-md text-xs font-semibold text-green-800 bg-green-100 uppercase tracking-wider">
            {product.category}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded-md ${stockLevel.color}`}>
            {stockLevel.text}
          </span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 hover:text-green-600 transition-colors duration-200 truncate" title={product.name}>
          <button
          className='cursor-pointer'
          onClick={handleViewProduct}
          >
            {product.name}
          </button>
        </h3>
        <div className="mt-1 mb-2">
          <Rate value={product.rating} />
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow" title={product.description}>
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            className={`cursor-pointer flex items-center justify-center px-3 py-2 rounded-lg text-white ${
              product.stock > 0
                ? `bg-green-500 max-md:text-xs lg:text-xs hover:bg-green-600 ${isAdding ? 'animate-pulse' : ''}`
                : 'bg-gray-400 cursor-not-allowed'
            } transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-sm hover:shadow`}
          >
            <FiShoppingCart className={`mr-1 ${isAdding ? 'animate-bounce' : ''}`} />
            {isAdding ? itemExists(product.id) ? 'Adding...' : 'Remove...' : itemExists(product.id) ? "Remove from Cart" : "Add to Cart" }
          </button>
        </div>
      </div>
    </div>
  );
};


  
const ProductGrid = ({
    products,
    selectedCategory,
    setSelectedCategory,
  }: ProductGridProps) => {
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const { addItem, updateQuantity, itemExists, removeItem } = useCart();
    const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });
  
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 640) setItemsPerPage(4);
        else if (window.innerWidth < 1024) setItemsPerPage(6);
        else setItemsPerPage(8);
      };
  
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    // Filter products based on category
    const filteredProducts =
      selectedCategory === "All"
        ? products
        : products.filter((product) => product.category === selectedCategory);
  
    // Pagination calculation
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, start + itemsPerPage);

    const handleAddToCart = (item: Product) => {
      if (item.stock <= 0) {
        alert("Item is out of stock");
        return;
      }
    
      if (itemExists(item.id)) {
        removeItem(item.id);
        alert("Item removed from cart");
        return; // Stop further execution if the item is removed
      }
      updateQuantity(item.id, item.stock)
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
      <div ref={ref} className={`scroll-animation-container ${isVisible ? 'animate-fadeIn' : ''}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product, index) => (
              <div 
                key={product.slug || product.id} 
                className={`scroll-animation-container ${isVisible ? `animate-fadeInUp delay-${(index % 8 + 1) * 100}` : ''}`}
              >
                <ProductCard product={product} onAddToCart={() => handleAddToCart(product)} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn&#34;t find any products in the &lsquo;{selectedCategory}&rdquo; category.
                </p>
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  View all products
                </button>
              </div>
            </div>
          )}
        </div>
  
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button className='cursor-pointer' disabled={page === 1} onClick={() => setPage(1)}>«</button>
            <button className='cursor-pointer' disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-md cursor-pointer ${page === i + 1 ? "bg-green-500 text-white" : "bg-gray-200"}`}
              >
                {i + 1}
              </button>
            ))}
            <button className='cursor-pointer' disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
            <button className='cursor-pointer' disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
          </div>
        )}
      </div>
    );
  };

function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.1 });
  const [categoriesRef, categoriesVisible] = useScrollAnimation({ threshold: 0.1, animationDelay: 200 });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsFromStorage = await getProducts();
        setProducts(productsFromStorage);

        const uniqueCategories = ['All', ...new Set(productsFromStorage.map((product) => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={titleRef} 
            className={`scroll-animation-container ${titleVisible ? 'animate-fadeInDown' : ''}`}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop Our Products</h1>
          </div>

          {/* Category selector */}
          <div 
            ref={categoriesRef} 
            className={`mb-8 overflow-x-auto pb-2 scroll-animation-container ${categoriesVisible ? 'animate-fadeInUp' : ''}`}
          >
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                    ${selectedCategory === category
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <ProductGrid products={products} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </div>
      </main>
    </>
  );
}

export default Shop;
