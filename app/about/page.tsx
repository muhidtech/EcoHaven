import React from 'react'
import './about.css'
import NavBar from '../components/home/navBar'
import Hero from './components/hero'
import StorySection from './components/StorySection'
import Footer from '../components/home/footer'
import Team from './components/Team'
import Commitment from './components/Commitment'


function page() {
  return (
    <>
      <NavBar active='About' />
      <Hero />
      <StorySection />
      <Team />
      <Commitment />
      <Footer />
    </>
  )
}

export default page
