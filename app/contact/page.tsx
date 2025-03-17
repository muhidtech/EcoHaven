import React from 'react'
import NavBar from '../components/home/navBar'
import ContactHero from './components/ContactHero'
import Contact from './components/Contact'
import Footer from '../components/home/footer'

function page() {
  return (
    <>
      < NavBar />
      <ContactHero />
      <Contact />
      <Footer />
    </>
  )
}

export default page
