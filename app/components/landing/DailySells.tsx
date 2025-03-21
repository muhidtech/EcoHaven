import React from 'react';
import Link from 'next/link';

// Mock data for daily deals
const dailyDeals = [
  {
    id: 1,
    name: 'Eco-Friendly Water Bottle',
    description: 'Reusable stainless steel bottle',
    price: 24.99,
    discountPrice: 19.99,
    discountPercentage: 20,
    image: 'https://placehold.co/400',
    slug: 'eco-friendly-water-bottle'
  },
  {
    id: 2,
    name: 'Bamboo Cutlery Set',
    description: 'Sustainable dining essentials',
    price: 18.99,
    discountPrice: 14.99,
    discountPercentage: 21,
    image: 'https://placehold.co/400',
    slug: 'bamboo-cutlery-set'
  },
  {
    id: 3,
    name: 'Organic Cotton Tote Bag',
    description: 'Durable shopping companion',
    price: 15.99,
    discountPrice: 12.99,
    discountPercentage: 19,
    image: 'https://placehold.co/400',
    slug: 'organic-cotton-tote'
  },
  {
    id: 4,
    name: 'Solar-Powered Charger',
    description: 'Eco-friendly device charging',
    price: 49.99,
    discountPrice: 39.99,
    discountPercentage: 20,
    image: 'https://placehold.co/400',
    slug: 'solar-powered-charger'
  }
];

function DailySells() {
  return (
    <section className="py-12 px-10 md:px-20 bg-gradient-to-r from-green-50 to-emerald-50">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Today's <span className="text-emerald-600">Eco Deals</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our daily selection of sustainable products at special prices. 
            Every purchase contributes to a greener planet.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dailyDeals.map((deal) => (
            <div 
              key={deal.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative h-auto w-full bg-gray-200 p-10">
                
                <img className='' src={deal.image} alt={deal.name} />
                
                {/* Discount Badge */}
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {deal.discountPercentage}% OFF
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">{deal.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{deal.description}</p>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center">
                    <span className="text-emerald-600 font-bold">${deal.discountPrice}</span>
                    <span className="text-gray-400 text-sm line-through ml-2">${deal.price}</span>
                  </div>
                  
                  <Link href={`/products/${deal.slug}`} className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-1 px-3 rounded-full transition-colors">
                    View Deal
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-10">
          <Link href="/products/deals" className="inline-block bg-transparent border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white font-medium py-2 px-6 rounded-full transition-colors duration-300">
            View All Eco Deals
          </Link>
        </div>
      </div>
    </section>
  );
}

export default DailySells;
