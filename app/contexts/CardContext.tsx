"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the structure of a cart item
export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string; // This should be a relative path or full URL to the image
    stock: number;
    slug: string;
  }
  
  // Define the shape of the cart context
  interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>, quantityToAdd?: number) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number, absolute?: boolean) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getCartTotal: () => number;
    itemExists: (id: string) => boolean;
  }
  
  // Props for the CartProvider component
  interface CartProviderProps {
    children: ReactNode;
  }
  
  // Create the context with a default value
  const CartContext = createContext<CartContextType | undefined>(undefined);

  const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    // Initialize cart state from localStorage if available, otherwise empty array
    const [items, setItems] = useState<CartItem[]>(() => {
      // Check if we're in the browser environment before accessing localStorage
      if (typeof window !== 'undefined') {
        try {
          const savedCart = localStorage.getItem('cart');
          if (!savedCart) return [];
          
          const parsedCart = JSON.parse(savedCart);
          // Validate that parsedCart is an array
          if (!Array.isArray(parsedCart)) {
            console.error('Invalid cart data format in localStorage');
            return [];
          }
          
          // Validate each item has the required properties
          return parsedCart.filter(item => {
            const isValid = 
              typeof item === 'object' && 
              item !== null &&
              typeof item.id === 'string' && 
              typeof item.name === 'string' && 
              typeof item.price === 'number' && 
              typeof item.quantity === 'number' &&
              typeof item.image === 'string';
            
            if (!isValid) {
              console.warn('Filtered out invalid cart item:', item);
            }
            return isValid;
          });
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
          // Clear corrupted data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('cart');
          }
          return [];
        }
      }
      return [];
    });
  
    // Persist cart items to localStorage whenever they change
    useEffect(() => {
      if (typeof window !== 'undefined') {
        try {
          // Validate items before saving
          if (!Array.isArray(items)) {
            console.error('Cannot save non-array cart data to localStorage');
            return;
          }
          
          localStorage.setItem('cart', JSON.stringify(items));
        } catch (error) {
          console.error('Failed to save cart to localStorage:', error);
          // Attempt to save a simplified version if stringification fails
          try {
            const simplifiedItems = items.map(({ id, name, price, quantity, image }) => ({
              id, name, price, quantity, image
            }));
            localStorage.setItem('cart', JSON.stringify(simplifiedItems));
          } catch (fallbackError) {
            console.error('Failed to save simplified cart to localStorage:', fallbackError);
          }
        }
      }
    }, [items]);
  
    /**
     * Add an item to the cart
     * If the item already exists, increase its quantity
     * Otherwise, add it as a new item with quantity 1
     * @param item The item to add to the cart
     * @param quantityToAdd Optional quantity to add (defaults to 1)
     */
    const addItem = (item: Omit<CartItem, 'quantity'>, quantityToAdd: number = 1) => {
      // Validate item before adding
      if (!item || typeof item !== 'object' || !item.id) {
        console.error('Attempted to add invalid item to cart:', item);
        return;
      }
  
      // Ensure quantity is a valid positive number
      const safeQuantity = typeof quantityToAdd === 'number' && !isNaN(quantityToAdd) 
        ? Math.max(1, Math.floor(quantityToAdd)) 
        : 1;
  
      setItems(prevItems => {
        // Ensure prevItems is an array
        const safeItems = Array.isArray(prevItems) ? prevItems : [];
        
        // Check if the item is already in the cart
        const existingItemIndex = safeItems.findIndex(i => i.id === item.id);
        
        if (existingItemIndex >= 0) {
          // Item exists, create a new array with updated quantity
          const updatedItems = [...safeItems];
          const currentQuantity = updatedItems[existingItemIndex].quantity || 0;
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: currentQuantity + safeQuantity,
            // Ensure price is always a number and up to date
            price: typeof item.price === 'number' ? item.price : 0,
            // Update other properties that might have changed
            name: item.name,
            image: item.image
          };
          return updatedItems;
        } else {
          // Item doesn't exist, add it with specified quantity
          return [...safeItems, { 
            ...item, 
            quantity: safeQuantity,
            // Ensure price is always a number
            price: typeof item.price === 'number' ? item.price : 0
          }];
        }
      });
    };
  
    /**
     * Remove an item from the cart completely
     * regardless of its quantity
     */
    const removeItem = (id: string) => {
      if (!id) {
        console.error('Attempted to remove item with invalid id');
        return;
      }
      
      setItems(prevItems => {
        // Ensure prevItems is an array
        const safeItems = Array.isArray(prevItems) ? prevItems : [];
        
        // Check if item exists before attempting removal
        const itemExists = safeItems.some(item => item.id === id);
        if (!itemExists) {
          console.warn(`Attempted to remove non-existent item with id: ${id}`);
        }
        
        return safeItems.filter(item => item.id !== id);
      });
    };
  
    /**
     * Update the quantity of an item in the cart
     * If quantity is 0 or less, remove the item completely
     * @param id The ID of the item to update
     * @param quantity The new quantity to set
     * @param absolute If true, sets the quantity to the exact value; if false, adds to existing quantity
     */
    const updateQuantity = (id: string, quantity: number, absolute: boolean = true) => {
      if (!id) {
        console.error('Attempted to update item with invalid id');
        return;
      }
  
      // Ensure quantity is a valid number
      const safeQuantity = typeof quantity === 'number' && !isNaN(quantity) 
        ? Math.max(0, Math.floor(quantity)) 
        : 0;
      
      if (safeQuantity <= 0) {
        removeItem(id);
        return;
      }
  
      setItems(prevItems => {
        // Ensure prevItems is an array
        const safeItems = Array.isArray(prevItems) ? prevItems : [];
        
        // First check if the item exists
        const existingItemIndex = safeItems.findIndex(item => item.id === id);
        if (existingItemIndex === -1) {
          console.warn(`Attempted to update quantity for non-existent item with id: ${id}`);
          return safeItems;
        }
        
        const updatedItems = [...safeItems];
        const currentItem = updatedItems[existingItemIndex];
        
        // Calculate new quantity based on absolute flag
        const newQuantity = absolute 
          ? safeQuantity 
          : (currentItem.quantity || 0) + safeQuantity;
        
        // If new quantity is 0 or less, remove the item
        if (newQuantity <= 0) {
          return updatedItems.filter(item => item.id !== id);
        }
        
        // Otherwise update the quantity
        updatedItems[existingItemIndex] = {
          ...currentItem,
          quantity: newQuantity
        };
        
        return updatedItems;
      });
    };
  
    /**
     * Clear all items from the cart
     */
    const clearCart = () => {
      setItems([]);
      // Also clear localStorage to ensure consistency
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('cart');
        } catch (error) {
          console.error('Failed to clear cart from localStorage:', error);
        }
      }
    };
  
    /**
     * Get the total number of items in the cart
     * This counts each item's quantity
     */
    const getItemCount = () => {
      if (!Array.isArray(items)) return 0;
      
      return items.reduce((total, item) => {
        const quantity = typeof item.quantity === 'number' && !isNaN(item.quantity) 
          ? Math.max(0, item.quantity) 
          : 0;
        return total + quantity;
      }, 0);
    };
  
    /**
     * Calculate the total price of all items in the cart
     */
    const getCartTotal = () => {
      if (!Array.isArray(items)) return 0;
      
      return items.reduce((total, item) => {
        const price = typeof item.price === 'number' && !isNaN(item.price) 
          ? Math.max(0, item.price) 
          : 0;
        const quantity = typeof item.quantity === 'number' && !isNaN(item.quantity) 
          ? Math.max(0, item.quantity) 
          : 0;
        return total + (price * quantity);
      }, 0);
    };
  
    /**
     * Check if an item exists in the cart
     * @param id The ID of the item to check
     * @returns True if the item exists in the cart, false otherwise
     */
    const itemExists = (id: string): boolean => {
      if (!id || !Array.isArray(items)) return false;
      return items.some(item => item.slug || item.id === id);
    };
  
    // Create the context value object with all cart functions
    const contextValue: CartContextType = {
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemCount,
      getCartTotal,
      itemExists
    };
  
    return (
      <CartContext.Provider value={contextValue}>
        {children}
      </CartContext.Provider>
    );
  };
  
  // Custom hook for consuming the cart context
  export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
      throw new Error('useCart must be used within a CartProvider');
    }
    return context;
  };
  
  // Export both the context and the provider as named exports
  export { CartContext, CartProvider };
  