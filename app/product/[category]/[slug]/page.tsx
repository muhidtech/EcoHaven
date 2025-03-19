import React from 'react'
import NavBar from '@/app/components/common/NavBar';
import Footer from '@/app/components/common/Footer';
import ProductPage from './Slug';
import { CartProvider } from '@/app/contexts/CardContext';

function page() {
  return (
    <CartProvider>
        <NavBar />
        <ProductPage />
        <Footer /> 
    </CartProvider>
  )
}

export default page
