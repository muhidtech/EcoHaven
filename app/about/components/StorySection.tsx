import React from 'react'

function StorySection() {
  return (
    <div className='h-full w-full bg-green-200 text-center flex flex-col justify-center items-center  p-15'>
      <h1 className='text-3xl text-yellow-900 font-medium font-mono'>
        A Small Idea with a Big Impact
      </h1>
      <p className='text-lg md:w-5xl my-5 font-mono'>
      EcoHaven was born out of a simple belief: everyday products should not harm the planet. Our founder, Emma Carter, started this journey in 2020 after seeing the growing impact of plastic waste on the environment. What began as a passion project turned into a mission—to create beautifully handcrafted, eco-friendly alternatives for daily living.
      </p>
      <p className='text-lg md:w-5xl font-mono'>
      Today, EcoHaven partners with small artisans to bring you sustainable, high-quality products that are kind to the earth and elevate your lifestyle.
      </p>
    </div>
  )
}

export default StorySection
