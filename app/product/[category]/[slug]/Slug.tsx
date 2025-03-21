'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { Star, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { getProducts } from '@/app/services/localDataService';
import { useCart } from '@/app/contexts/CardContext';
import { useAuth } from '@/app/contexts/AuthContext';

/**
 * Helper function to generate a URL-friendly slug from a product name
 * @param name - The product name to convert to a slug
 * @returns A sanitized slug string
 */
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove special characters
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();                  // Trim any leading/trailing hyphens
};

/**
 * Helper function to get a valid image URL with fallback
 * @param imageUrl - Primary image URL
 * @param fallbackUrl - Secondary image URL
 * @returns A valid image URL or placeholder
 */
const getValidImageUrl = (imageUrl?: string, fallbackUrl?: string): string => {
  const image = imageUrl || fallbackUrl;
  return image && image.trim() !== '' ? image : '/images/placeholder.jpg';
};

// Define TypeScript interfaces for our data structures


/**
 * Product interface with proper type definitions
 * All optional fields have clear documentation
 */
interface Product {
  id: string;
  name: string;
  slug: string;           // URL-friendly identifier
  price: number;
  salePrice?: number;      // Discounted price if on sale
  description: string;
  features?: string[];     // List of product features
  category: string;
  tags?: string[];         // Keywords for search/filtering
  image?: string;          // Primary image from products.json
  imageUrl?: string;       // Alternative image field for compatibility
  additionalImages?: string[]; // Gallery images
  stock: number;
  rating?: number;         // Average customer rating (0-5)
  reviewCount?: number;    // Number of customer reviews
  isEco?: boolean;         // Whether product is eco-friendly
  ecoAttributes?: string[]; // List of eco-friendly attributes
}

/**
 * Normalized product with guaranteed values for optional fields
 * Used to ensure consistent data structure after fetching
 */
interface NormalizedProduct extends Product {
  slug: string;            // Guaranteed to have a value
  rating: number;          // Guaranteed to have a value
  reviewCount: number;     // Guaranteed to have a value
  additionalImages: string[]; // Guaranteed to have a value (empty array if none)
}

export default function ProductPage() {
  // Get the slug parameter from the URL using Next.js useParams hook
  const params = useParams();
  const slug = params?.slug as string;

  
  // State variables to store product data, loading state, and related products
  const [product, setProduct] = useState<NormalizedProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<NormalizedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAddWatchList, setIsAddWatchList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { itemExists, updateQuantity, addItem, removeItem } = useCart()
  
  // Fetch product data from local JSON file when component mounts or slug changes
  if (!slug) {
    return notFound();
  }
  useEffect(() => {
    /**
     * Fetches product data from the static JSON file in the public directory
     * using the slug parameter from the URL to find the specific product
     */
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all products from the local data service
        const productsData = await getProducts();
        console.log("Retrieved Products Data:", productsData);

        if (!productsData || !Array.isArray(productsData)) {
          throw new Error('Invalid product data format received');
        }
        
        // Find the product with the matching slug
        // First try exact match with slug property
        let productData = productsData.find(p => p.slug === slug);
        
        // If not found, try with generated slug from name
        if (!productData) {
          productData = productsData.find(p => 
            generateSlug(p.name) === slug
          );
        }
        
        if (!productData) {
          console.error('Product not found');
          setError('Product not found');
          setLoading(false);
          return notFound();
        }
        
        // Normalize the product data to match our interface
        const normalizedProduct: NormalizedProduct = {
          ...productData,
          imageUrl: productData.imageUrl || productData.image, // Handle both imageUrl and image properties
          image: productData.image || productData.imageUrl, // Ensure image is also set
          slug: productData.slug || generateSlug(productData.name),
          reviewCount: productData.reviewCount || 0,
          rating: productData.rating || 0,
          additionalImages: [productData?.image, productData?.image, productData?.image]
        };
        
        setProduct(normalizedProduct);
        
        // Set active image with proper fallback
        setActiveImage(getValidImageUrl(normalizedProduct.imageUrl, normalizedProduct.image));
        
        // Fetch related products from the same category
        if (normalizedProduct.category) {
          fetchRelatedProducts(normalizedProduct.category, normalizedProduct.id);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    /**
     * Fetches related products from the same category as the current product
     * @param category - The category to filter products by
     * @param currentProductId - The ID of the current product to exclude from results
     */
    const fetchRelatedProducts = async (category: string, currentProductId: string) => {
      try {
        // Get all products from the local data service
        const productsData = await getProducts();
    
        if (!productsData || !Array.isArray(productsData)) {
          throw new Error('Invalid product data format received');
        }
    
        // Filter products by category and exclude the current product
        const relatedProductsData = productsData
          .filter(p =>
            p.category === category &&
            p.id !== currentProductId &&
            p.name &&
            p.price !== undefined &&
            p.description
          )
          .slice(0, 4) // Limit to 4 related products
          .map(p => ({
            ...p,
            imageUrl: p.imageUrl || p.image,
            image: p.image || p.imageUrl,
            slug: p.slug || generateSlug(p.name),
            reviewCount: p.reviewCount || 0,
            rating: p.rating || 0,
            additionalImages: [p.image, p.image, p.image]
          }));
    
        setRelatedProducts(relatedProductsData);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Handle quantity changes
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && product && value <= product.stock) {
      setQuantity(value);
    }
  };

  // Increment quantity
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

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

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Render error state if product not found or error occurred
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">
          {error === 'Product not found' ? 'Product Not Found' : 'Error Loading Product'}
        </h1>
        <p className="text-gray-600 mb-8">
          {error === 'Product not found' 
            ? 'The product you are looking for does not exist or has been removed.'
            : `There was a problem loading this product: ${error || 'Unknown error'}`
          }
        </p>
        <Link href="/product" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  // Render product details
  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Breadcrumb navigation */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link> &gt; 
          <Link href="/product" className="hover:text-green-600 mx-2">Products</Link> &gt; 
          <Link href={`/product/${product.category}`} className="hover:text-green-600 mx-2">{product.category}</Link> &gt; 
          <span className="text-gray-700 ml-2">{product.name}</span>
        </div>

        {/* Product details section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product images */}
          <div className="space-y-4">
            <div className="relative h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={activeImage} 
                alt={product.name}
                className="object-contain bg-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={() => setActiveImage('/images/placeholder.jpg')}
              />
            </div>
            
            {/* Thumbnail gallery */}
            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <div 
                  className={`relative h-20 w-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                    activeImage === getValidImageUrl(product.imageUrl, product.image) ? 'border-green-500' : 'border-transparent'
                  }`}
                  onClick={() => setActiveImage(getValidImageUrl(product.imageUrl, product.image))}
                >
                  <img 
                    src={getValidImageUrl(product.imageUrl, product.image)} 
                    alt={`${product.name} thumbnail`}
                    className="object-cover"
                    sizes="80px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
                
                {product.additionalImages.map((img, index) => (
                  <div 
                    key={index}
                    className={`relative h-20 w-20 rounded-md overflow-hidden cursor-pointer border-2 ${activeImage === img ? 'border-green-500' : 'border-transparent'}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img 
                      src={img || '/images/placeholder.jpg'} 
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="object-cover"
                      sizes="80px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product information */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
            
            {/* Price section */}
            <div className="flex items-center space-x-4">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-bold text-green-600">${product.salePrice.toFixed(2)}</span>
                  <span className="text-xl text-gray-500 line-through">${product.price.toFixed(2)}</span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm font-medium">
                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              )}
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= (product.rating || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {(product.rating || 0).toFixed(1)} ({product.reviewCount || 0} reviews)
              </span>
            </div>
            
            {/* Eco attributes */}
            {product.isEco && product.ecoAttributes && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-green-700 font-medium mb-2">Eco-Friendly Features:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {product.ecoAttributes.map((attr, index) => (
                    <li key={index} className="text-gray-700">{attr}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Stock status */}
            <div className="flex items-center">
              <span className={`inline-block h-3 w-3 rounded-full mr-2 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-gray-700">
                {product.stock > 0 
                  ? `In Stock (${product.stock} available)` 
                  : 'Out of Stock'}
              </span>
            </div>
            
            {/* Add to cart section */}
            {product.stock > 0 && (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button 
                      onClick={decrementQuantity}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-12 text-center border-none focus:ring-0"
                      min="1"
                      max={product.stock}
                    />
                    <button 
                      onClick={incrementQuantity}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 cursor-pointer bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>{itemExists(product.id) ? `Remove from Cart`: "Add To Cart"}</span>
                  </button>
                </div>
                
                <div className="flex space-x-4">
                <button
                  onClick={() => setIsAddWatchList((prev) => !prev)}
                  className="cursor-pointer flex items-center space-x-2 text-gray-600 hover:text-green-600"
                >
                  <Heart className={`h-5 w-5 ${isAddWatchList ? "text-red-600" : ""}`} />
                  <span className={` ${isAddWatchList ? "text-red-600" : ""}`}>{isAddWatchList ? "Remove from Wishlist" : "Add to Wishlist"}</span>
                </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          
          {/* {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{review.userName}</h3>
                    <span className="text-gray-500 text-sm">{review.date}</span>
                  </div>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          )} */}
        </div>

        {/* Related products section */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  href={`/product/${relatedProduct.slug}`} 
                  key={relatedProduct.id}
                  className="group"
                >
                  <div className="bg-white flex flex-col  rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative  bg-gray-100">
                      <img
                        src={getValidImageUrl(relatedProduct.imageUrl, relatedProduct.image)}
                        alt={relatedProduct.name}

                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder.jpg';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= (relatedProduct.rating || 0)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          ({relatedProduct.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        {relatedProduct.salePrice ? (
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-green-600">${relatedProduct.salePrice.toFixed(2)}</span>
                            <span className="text-sm text-gray-500 line-through">${relatedProduct.price.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-gray-900">${relatedProduct.price.toFixed(2)}</span>
                        )}
                        {relatedProduct.isEco && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Eco</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
