import NavBar from '@/app/components/common/NavBar'
import { CartProvider } from '@/app/contexts/CardContext'
import React from 'react'
import Category from './Category'
import Footer from '@/app/components/common/Footer'


function page() {
  return (
    <CartProvider>
        <NavBar />
        <Category />
        <Footer />
    </CartProvider>
  )
}

export default page
