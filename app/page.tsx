import React from 'react';
import NavBar from './components/home/navBar';
import Hero from './components/home/Hero';
import Features from './components/home/features';
import PopularProducts from './components/home/PopularProducts';
import DailySells from './components/home/DailySells';
import Footer from './components/home/footer';


function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <Features />
      <PopularProducts />
      <DailySells />
      <Footer />
    </>
  );
}

export default Home;
