import React from 'react';
import NavBar from './components/common/NavBar';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import PopularProducts from './components//landing/PopularProducts';
import DailySells from './components/landing/DailySells';
import Footer from './components/common/Footer';
import { CartProvider } from "./contexts/CardContext";



function Home() {
  return (
    <CartProvider>
      <NavBar />
      <Hero />
      <Features />
      <PopularProducts />
      <DailySells />
      <Footer />
    </CartProvider>
  );
}

export default Home;
