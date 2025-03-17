import React from 'react'
import NavBar from '../components/home/navBar'
import ContactHero from './components/ContactHero'
import Contact from './components/Contact'
import Footer from '../components/home/footer'
import SocialMedia from './components/SocialMedia'

function page() {
  return (
    <>
      < NavBar />
      <ContactHero />
      <Contact />
      <SocialMedia />
      <Footer />
    </>
  )
}

export default page
