import React from 'react'
import './about.css'
import NavBar from '../components/home/navBar'
import Hero from './components/hero'
import StorySection from './components/StorySection'


function page() {
  return (
    <>
      <NavBar active='About' />
      <Hero />
      <StorySection />
    </>
  )
}

export default page
