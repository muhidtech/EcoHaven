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
    reviewCount?: 0;
    rating: number;
    category: string;
    imageUrl?: string;
    image: string;
    stock: number;
    featured?: boolean;
    popular?: boolean;
    eco_friendly_rating?: number;
    materials?: string[];
    dimensions?: {
      width?: number;
      height?: number;
      depth?: number;
      unit?: string;
    };
  }
  
  // Order interface definition
  export interface Order {
    id: string;
    userId: string;
    items: {
      productName: string;
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
  
  
  export const saveProducts = async (products: Product[]): Promise<void> => {
    try {
      // Save to localStorage
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('ecohaven_products', JSON.stringify(products));
      }
    
      // Save to products.json file via API
      try {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ products }),
        });
      
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
      
        const result = await response.json();
        console.log('Products saved to file:', result.message);
      } catch (apiError) {
        console.error('Error saving products to file via API:', apiError);
        // Continue execution even if API call fails
        // This ensures localStorage is still updated even if the file update fails
      }
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
  };
  
  export const updateProduct = async (id: string, updatedProduct: Product) => {
    try {
      // Retrieve existing products
      const products = await getProducts();
  
      // Find product index
      const productIndex = products.findIndex((product) => product.id === id);
  
      if (productIndex === -1) {
        console.warn(`Product with ID ${id} not found.`);
        return;
      }
  
      // Update the product at the found index
      products[productIndex] = updatedProduct;
  
      // Save the updated product list back to localStorage and file
      await saveProducts(products);
  
      console.log(`Product with ID ${id} updated successfully.`);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  export const deleteProduct = async (id: string) => {
    try {
      // Retrieve existing products
      const products = await getProducts();
  
      // Filter out the product to delete
      const updatedProducts = products.filter((product) => product.id !== id);
  
      // Check if the product was found and removed
      if (products.length === updatedProducts.length) {
        console.warn(`Product with ID ${id} not found.`);
        return;
      }
  
      // Save the updated product list back to localStorage and file
      await saveProducts(updatedProducts);
  
      console.log(`Product with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  /**
   * Retrieves all products from localStorage
   * @returns Array of Product objects
   */
  export const getProductsFromStorage = (): Product[] => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const productsJson = localStorage.getItem('ecohaven_products');
        return productsJson ? JSON.parse(productsJson) : [];
      }
      return [];
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
      await saveProducts(products);
  
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
  
  /**
 * Saves an array of orders to localStorage
 * @param orders - Array of Order objects to save
 * @returns boolean indicating success or failure
 */
export const saveOrders = (orders: Order[]): boolean => {
  try {
    if (!orders || !Array.isArray(orders)) {
      console.error('Invalid orders data provided to saveOrders');
      return false;
    }
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('ecohaven_orders', JSON.stringify(orders));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving orders to localStorage:', error);
    return false;
  }
};

/**
 * Retrieves all orders from localStorage
 * @returns Array of Order objects
 */
export const getOrdersFromStorage = (): Order[] => {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const ordersJson = localStorage.getItem('ecohaven_orders');
      if (!ordersJson) {
        return [];
      }
      
      const parsedOrders = JSON.parse(ordersJson);
      if (!Array.isArray(parsedOrders)) {
        console.error('Invalid orders data format in localStorage');
        return [];
      }
      
      return parsedOrders;
    }
    return [];
  } catch (error) {
    console.error('Error retrieving orders from localStorage:', error);
    return [];
  }
};

/**
 * Generates a unique order ID
 * @returns A unique string for order identification
 */
export const generateOrderId = (): string => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Use crypto.randomUUID if available (modern browsers)
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `order_${crypto.randomUUID()}`;
    }
  }
  // Fallback to timestamp + random string for older browsers or server environment
  return `order_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
};

/**
 * Creates and saves a new order to localStorage
 * @param userId - ID of the user placing the order
 * @param items - Array of items in the order
 * @param shippingAddress - Shipping details for the order
 * @param paymentMethod - Payment method used
 * @returns The created Order object or null if saving failed
 */
export const createOrder = (
  userId: string,
  items: { productName: string; productId: string; quantity: number; price: number }[],
  shippingAddress: Order['shippingAddress'],
  paymentMethod: string
): Order | null => {
  try {
    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !shippingAddress || !paymentMethod) {
      console.error('Invalid order data provided');
      return null;
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Ensure each item includes productName
    items = items.map(item => ({
      ...item,
      productName: item.productName, // Replace with actual product name if available
    }));

    const newOrder: Order = {
      id: generateOrderId(),
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const existingOrders = getOrdersFromStorage();
    const updatedOrders = [...existingOrders, newOrder];

    const saveSuccessful = saveOrders(updatedOrders);
    
    if (!saveSuccessful) {
      console.error('Failed to save the new order');
      return null;
    }

    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

/**
 * Updates an existing order in localStorage
 * @param id - ID of the order to update
 * @param updatedOrder - Partial Order object containing the properties to update
 * @returns boolean indicating success or failure
 */
export const updateOrder = async (id: string, updatedOrder: Partial<Order>): Promise<boolean> => {
  try {
    // Retrieve existing orders
    const orders = getOrdersFromStorage();

    // Find order index
    const orderIndex = orders.findIndex((order) => order.id === id);

    if (orderIndex === -1) {
      console.warn(`Order with ID ${id} not found.`);
      return false;
    }

    // Update the order at the found index (merge existing with updates)
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updatedOrder,
    };

    // Save the updated orders list back to localStorage
    const saveSuccessful = saveOrders(orders);
    
    if (saveSuccessful) {
      console.log(`Order with ID ${id} updated successfully.`);
      return true;
    } else {
      console.error(`Failed to save updated order with ID ${id}`);
      return false;
    }
  } catch (error) {
    console.error('Error updating order:', error);
    return false;
  }
};
