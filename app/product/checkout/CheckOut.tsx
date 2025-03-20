'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CardContext';
import { createOrder, generateOrderId, Order } from '../../services/localDataService';
import { toast } from 'react-hot-toast';

// Define shipping form field types
type ShippingFormData = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
};

// Define payment method type
type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, clearCart, getCartTotal } = useCart();

  // State for form data and validation
  const [shippingInfo, setShippingInfo] = useState<ShippingFormData>({
    fullName: user?.displayName || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phoneNumber: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [errors, setErrors] = useState<Partial<ShippingFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push('/product');
      toast.error('Your cart is empty. Please add items before checkout.');
    }
  }, [items, router, orderComplete]);


  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof ShippingFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingFormData> = {};
  
    for (const [key, value] of Object.entries(shippingInfo)) {
      if (!value.trim()) newErrors[key as keyof ShippingFormData] = 'This field is required';
    }
  
    if (!/^\S+@\S+\.\S+$/.test(shippingInfo.email)) newErrors.email = 'Invalid email address';
    if (!/^\+?[0-9\s\-()]{8,20}$/.test(shippingInfo.phoneNumber)) newErrors.phoneNumber = 'Invalid phone number';
    if (!shippingInfo.country) newErrors.country = 'Please select a country';
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Simulate payment process
  const processPayment = async (): Promise<{ success: boolean; transactionId?: string }> => {
    toast.loading(`Processing ${paymentMethod.replace('_', ' ')} payment...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.dismiss();
  
    const isSuccessful = Math.random() < 0.95; // Simulate 95% success rate
    if (isSuccessful) {
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      toast.success('Payment successful!');
      return { success: true, transactionId };
    }
  
    toast.error('Payment failed. Try again.');
    return { success: false };
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.error('Please fix the errors and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentResult = await processPayment();
      if (!paymentResult.success) throw new Error('Payment failed.');

      const newOrder = createOrder(
        user?.uid || 'guest',
        items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        {
          name: shippingInfo.fullName,
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
        },
        paymentMethod
      );
      
      if (!newOrder) {
        throw new Error('Failed to create order.');
      }
      
      setOrderId(newOrder.id);
      setOrderComplete(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Checkout Error:', error);
        toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }finally {
      setIsSubmitting(false);
    }
  };

  // Render order confirmation
  if (orderComplete) {
    useEffect(() => {
        if (orderComplete && orderId) {
          router.push(`/order-confirmation?orderId=${orderId}`);
        }
      }, [orderComplete, orderId, router]);

    return (
      <div className="max-w-4xl mx-auto p-6 my-10">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-700 mb-6">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          <div className="bg-white p-4 rounded-md shadow-sm mb-6">
            <p className="text-gray-700">Order ID: <span className="font-medium">{orderId}</span></p>
            <p className="text-gray-700">A confirmation email has been sent to <span className="font-medium">{shippingInfo.email}</span></p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/product" className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors">
              Continue Shopping
            </Link>
            <Link href="/account/orders" className="bg-white text-green-600 border border-green-600 py-3 px-6 rounded-md hover:bg-green-50 transition-colors">
              View Order History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate cart total for use in the component
  const cartTotal = getCartTotal();

  return (
    <div className="max-w-7xl mx-auto p-4  md:p-6">
      <h1 className="text-3xl font-bold pt-20 mb-8 text-gray-800">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP/Postal Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Country</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={shippingInfo.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Method</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="credit_card"
                    name="paymentMethod"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={() => setPaymentMethod('credit_card')}
                    className="h-4 w-4 text-green-600"
                  />
                  <label htmlFor="credit_card" className="ml-2 text-gray-700">
                    Credit Card
                  </label>
                </div>
                {paymentMethod === 'credit_card' && (
                  <div className="ml-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">
                      This is a demo application. No actual payment will be processed.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          disabled
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="h-4 w-4 text-green-600"
                  />
                  <label htmlFor="paypal" className="ml-2 text-gray-700">
                    PayPal
                  </label>
                </div>
                {paymentMethod === 'paypal' && (
                  <div className="ml-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-500">
                      You will be redirected to PayPal to complete your purchase securely.
                      (This is a demo application. No actual payment will be processed.)
                    </p>
                  </div>
                )}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="bank_transfer"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="h-4 w-4 text-green-600"
                  />
                  <label htmlFor="bank_transfer" className="ml-2 text-gray-700">
                    Bank Transfer
                  </label>
                </div>
                {paymentMethod === 'bank_transfer' && (
                  <div className="ml-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-500">
                      You will receive our bank details after placing the order.
                      (This is a demo application. No actual payment will be processed.)
                    </p>
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-green-600 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'} transition-colors duration-200`}
            >
              {isSubmitting ? 'Processing...' : `Complete Order • $${getCartTotal().toFixed(2)}`}
            </button>
          </form>
        </div>
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
            <div className="max-h-80 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex py-3 border-b border-gray-100">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover object-center"
                      />
                    )}
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-800">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">${cartTotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Shipping</p>
                <p className="font-medium">Free</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Tax</p>
                <p className="font-medium">Calculated at next step</p>
              </div>
              <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200">
                <p className="text-gray-900">Total</p>
                <p className="text-gray-900">${getCartTotal().toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/cart" className="text-green-600 hover:text-green-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Return to cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
