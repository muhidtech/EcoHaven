import React from 'react'
import './about.css'
import NavBar from '../components/common/NavBar'
import Hero from './components/hero'
import StorySection from './components/StorySection'
import Footer from '../components/common/Footer'
import Team from './components/Team'
import Commitment from './components/Commitment'
import CustomerReview from './components/CustomerReview'


function page() {
  return (
    <>
      <NavBar />
      <Hero />
      <StorySection />
      <Team />
      <Commitment />
      <CustomerReview />
      <Footer />
    </>
  )
}

export default page
