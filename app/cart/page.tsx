"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/contexts/CardContext";
import NavBar from "@/app/components/common/NavBar";
import Footer from "@/app/components/common/Footer";

const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, getCartTotal } = useCart();
  const [error, setError] = useState<string | null>(null);

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    try {
      if (newQuantity < 1) {
        setError("Quantity cannot be less than 1");
        return;
      }
      updateQuantity(productId, newQuantity);
      setError(null);
    } catch (err) {
      setError("Failed to update quantity");
      console.error(err);
    }
  };

  const handleRemoveItem = (productId: string) => {
    try {
      removeItem(productId);
      setError(null);
    } catch (err) {
      setError("Failed to remove item");
      console.error(err);
    }
  };

  const handleClearCart = () => {
    try {
      clearCart();
      setError(null);
    } catch (err) {
      setError("Failed to clear cart");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Your Shopping Cart</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl mb-4">Your cart is empty</h2>
            <p className="mb-6">Add some eco-friendly products to get started!</p>
            <Link 
              href="/product" 
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-green-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Product</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Quantity</th>
                    <th className="py-3 px-4 text-left">Total</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative h-16 w-16 flex-shrink-0">
                            <img
                              src={item.image || "/images/placeholder.png"}
                              alt={item.name}
                              className="object-cover rounded"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">${item.price.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 space-y-4 md:space-y-0">
              <button
                onClick={handleClearCart}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-300"
              >
                Clear Cart
              </button>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Shipping calculated at checkout</p>
                <Link
                  href="/product/checkout"
                  className="mt-3 block w-full bg-green-600 hover:bg-green-700 text-white text-center font-medium py-2 px-4 rounded transition duration-300"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;