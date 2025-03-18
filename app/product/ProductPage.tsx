"use client";

import React, { useEffect, useState } from 'react';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import { ProductCard } from '../shop/Shop';
import { getProducts } from '../services/localDataService';

interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    rating: number;
    stock: number;
    image: string;
    createdAt?: string;
    updatedAt?: string;
    featured?: boolean;
}

const getItemsPerPage = () => {
  if (typeof window === 'undefined') return 8;
  if (window.innerWidth >= 1024) return 12;
  if (window.innerWidth >= 768) return 8;
  return 4;
};

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    const handleResize = () => setItemsPerPage(getItemsPerPage());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const productData = await getProducts();
      setProducts(productData);
    };
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={() => {}} />
          ))}
        </div>
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>&laquo;</button>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
          {Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={i + 1}
                onClick={() => handlePageChange(page)}
                className={
                  currentPage === page
                    ? 'font-bold text-green-600'
                    : 'text-gray-600 hover:text-green-600'
                }
              >
                {page}
              </button>
            );
          })}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
          <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>&raquo;</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
