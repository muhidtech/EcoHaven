import React from 'react'
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';
import Shop from './Shop';
import { CartProvider } from "../contexts/CardContext";


function page() {
  return (
    <CartProvider>
      <NavBar />
      <Shop />
      <Footer />
    </CartProvider>
  )
}

export default page
