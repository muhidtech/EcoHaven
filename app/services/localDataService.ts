/**
 * Saves an array of products to localStorage
 * @param products - Array of Product objects to save
 * @returns void
 */
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    slug: string;
    reviewCount: 0;
    rating: number;
    category: string;
    imageUrl: string;
    image: string;
    stock: number;
    featured?: boolean;
    eco_friendly_rating?: number;
    materials?: string[];
    dimensions?: {
      width: number;
      height: number;
      depth: number;
      unit: string;
    };
  }
  
  // Order interface definition
  export interface Order {
    id: string;
    userId: string;
    items: {
      productId: string;
      quantity: number;
      price: number;
    }[];
    totalAmount: number;
    shippingAddress: {
      name: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    paymentMethod: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
  }
  
  
  export const saveProducts = (products: Product[]): void => {
    try {
      localStorage.setItem('ecohaven_products', JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
  };
  
  /**
   * Retrieves all products from localStorage
   * @returns Array of Product objects
   */
  export const getProductsFromStorage = (): Product[] => {
    try {
      const productsJson = localStorage.getItem('ecohaven_products');
      return productsJson ? JSON.parse(productsJson) : [];
    } catch (error) {
      console.error('Error retrieving products from localStorage:', error);
      return [];
    }
  };

  
  
  /**
   * Fetches all products from the static JSON file and stores them in localStorage
   * @returns Promise that resolves to an array of Product objects
   */
  export const getProducts = async (): Promise<Product[]> => {
    try {
      const response = await fetch('/products.json');
  
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
  
      const products: Product[] = await response.json();
  
      // Save products to localStorage
      saveProducts(products);
  
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
  
      // Fallback to localStorage if fetch fails
      return getProductsFromStorage();
    }
  };
  
  /**
   * Fetches a single product by its ID
   * @param productId - The ID of the product to fetch
   * @returns Promise that resolves to a Product object or null if not found
   */
  export const getProductById = async (productId: string): Promise<Product | null> => {
    try {
      const products = await getProducts();
      return products.find(p => p.id === productId) || null;
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      return null;
    }
  };
  
  /**
   * Fetches products by category
   * @param category - The category to filter products by
   * @returns Promise that resolves to an array of Product objects in the specified category
   */
  export const getProductsByCategory = async (category: string): Promise<Product[]> => {
    try {
      const products = await getProducts();
      return products.filter(p => p.category === category);
    } catch (error) {
      console.error(`Error fetching products in category ${category}:`, error);
      return [];
    }
  };
  
  /**
   * Fetches featured products
   * @returns Promise that resolves to an array of featured Product objects
   */
  export const getFeaturedProducts = async (): Promise<Product[]> => {
    try {
      const products = await getProducts();
      return products.filter(p => p.featured === true);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  };
  