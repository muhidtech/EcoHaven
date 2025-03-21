'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

// Define Order type
type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  imageUrl?: string;
};

type ShippingAddress = {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get order ID from URL parameters
    const orderId = searchParams.get('orderId');
    
    if (orderId) {
      // Fetch order details from localStorage
      try {
        const ordersString = localStorage.getItem('ecohaven_orders');
        if (ordersString) {
          const orders: Order[] = JSON.parse(ordersString);
          const foundOrder = orders.find(o => o.id === orderId);
          
          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            toast.error('Order not found');
            setTimeout(() => router.push('/product'), 10000);
          }
        } else {
          toast.error('No orders found');
          setTimeout(() => router.push('/product'), 10000);
        }
      } catch (error) {
        console.error('Error retrieving order:', error);
        toast.error('Error retrieving order details');
      }
    } else {
      // If no order ID in URL, check if there's a recent order in session storage
      try {
        const recentOrderString = sessionStorage.getItem('recentOrder');
        if (recentOrderString) {
          const recentOrder = JSON.parse(recentOrderString);
          setOrder(recentOrder);
        } else {
          toast.error('No order information found');
          setTimeout(() => router.push('/product'), 10000);
        }
      } catch (error) {
        console.error('Error retrieving recent order:', error);
        toast.error('Error retrieving order details');
      }
    }
    
    setLoading(false);
  }, [router, searchParams]);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle case where order is not found
  if (!loading && !order) {
    return (
      <div className="max-w-4xl mx-auto p-6 my-10">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-yellow-800 mb-4">Order Not Found</h1>
          <p className="text-lg text-gray-700 mb-6">
            We couldn't find the order details you're looking for.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/product" className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors">
              Browse Products
            </Link>
            <Link href="/order" className="bg-white text-green-600 border border-green-600 py-3 px-6 rounded-md hover:bg-green-50 transition-colors">
              View Order History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 my-10 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 my-10">
      <div className="bg-green-50 border border-green-200 rounded-lg p-8">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-green-800 mb-4 text-center">Order Confirmed!</h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        <div className="bg-white p-6 rounded-md shadow-sm mb-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Details</h2>
            <p className="text-gray-700">Order ID: <span className="font-medium">{order?.id}</span></p>
            <p className="text-gray-700">Date: <span className="font-medium">{order?.createdAt ? formatDate(order.createdAt) : 'N/A'}</span></p>
            <p className="text-gray-700">Status: <span className="font-medium capitalize">{order?.status || 'Processing'}</span></p>
            <p className="text-gray-700">Payment Method: <span className="font-medium capitalize">{order?.paymentMethod?.replace('_', ' ') || 'N/A'}</span></p>
          </div>
          
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Shipping Address</h2>
            {order?.shippingAddress && (
              <div>
                <p className="text-gray-700">{order.shippingAddress.name}</p>
                <p className="text-gray-700">{order.shippingAddress.street}</p>
                <p className="text-gray-700">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-gray-700">{order.shippingAddress.country}</p>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Summary</h2>
            <div className="max-h-60 overflow-y-auto mb-4">
              {order?.items.map((item, index) => (
                <div key={index} className="flex py-3 border-b border-gray-100 last:border-b-0">
                  {item.imageUrl && (
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.imageUrl}
                        alt={item.name || `Product ${item.productId}`}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  )}
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-800">
                        <h3>{item.name || `Product ID: ${item.productId}`}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {item.quantity}</p>
                      <p className="text-gray-500">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-base font-medium">
                <p className="text-gray-900">Total</p>
                <p className="text-gray-900">${order?.totalAmount.toFixed(2)}</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                A confirmation email has been sent with your order details.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/product" className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors text-center">
            Continue Shopping
          </Link>
          <Link href="/order" className="bg-white text-green-600 border border-green-600 py-3 px-6 rounded-md hover:bg-green-50 transition-colors text-center">
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
}
