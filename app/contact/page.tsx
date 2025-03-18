import React from 'react'
import NavBar from '../components/common/NavBar'
import ContactHero from './components/ContactHero'
import Contact from './components/Contact'
import Footer from '../components/common/Footer'
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
