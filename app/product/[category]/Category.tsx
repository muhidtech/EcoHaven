"use client";

import React, { useEffect, useState } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import { getProducts } from '../../services/localDataService';
import { updateCarts } from '../../components/common/NavBar';
import { useCart } from '../../contexts/CardContext';
import { ProductCard } from '../../shop/Shop';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  description: string;
  features?: string[];
  category: string;
  tags?: string[];
  image: string;
  imageUrl?: string;
  additionalImages?: string[];
  stock: number;
  rating: number;
  reviewCount?: number;
  isEco?: boolean;
  ecoAttributes?: string[];
}

function Category() {
  const params = useParams();
  const category = decodeURIComponent(params?.category as string);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const { addItem } = useCart();
  const router = useRouter();

  if (!category) return notFound();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const productsData = await getProducts();

        if (!productsData || !Array.isArray(productsData)) {
          throw new Error('Invalid product data format received');
        }

        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(4);
      else if (window.innerWidth < 1024) setItemsPerPage(6);
      else setItemsPerPage(8);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = products.filter((product) => product.category.trim().toLowerCase() === category.trim().toLowerCase());

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(start, start + itemsPerPage);

  const handleAddToCart = (product: Product) => {
    if (product.stock > 0) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        slug: product.slug,
      });
      updateCarts();
    }
  };

  if (loading) return <div>Loading products...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className='gap-10 flex flex-col py-20 px-10 bg-green-200'>
      <div className='flex items-center flex-col max-lg:justify-between'>
        {/* Breadcrumb navigation */}
        <div className="text-sm text-start w-full text-gray-500 flex items-center mb-6">
            <Link href="/" className="hover:text-green-600">Home</Link> &gt; 
            <Link href="/product" className="hover:text-green-600 mx-2">Products</Link> &gt; 
            <span className="text-gray-700 ml-2">{category}</span>
          </div>
        <h1 className='text-center w-full text-2xl md:text-4xl font-semibold text-black/70 '>
          {category}
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <ProductCard key={product.slug || product.id} product={product} onAddToCart={() => handleAddToCart(product)} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any products in the "{category}" category.
              </p>
              <button
                onClick={() => router.push('/product')}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                View all products
              </button>
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button disabled={page === 1} onClick={() => setPage(1)}>«</button>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-md ${page === i + 1 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
          <button disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
        </div>
      )}
    </div>
  );
}

export default Category;
