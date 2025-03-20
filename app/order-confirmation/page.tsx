import React from 'react'
import NavBar from '../components/common/NavBar'
import OrderConfirmationPage from './OrderConfirmationPage'
import Footer from '../components/common/Footer'

function page() {
  return (
    <>
      <NavBar />
      <OrderConfirmationPage />
      <Footer />
    </>
  )
}

export default page
