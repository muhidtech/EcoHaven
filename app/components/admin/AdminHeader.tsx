import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface AdminHeaderProps {
  title: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <header className={`bg-white shadow-md w-full mb-6 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleGoBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-110"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <Link href="/admin/dashboard" className="flex items-center">
              <span className="text-green-600 font-semibold text-lg">EcoHaven Admin</span>
            </Link>
          </div>
          
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h1>
          
          <div className="w-10">
            {/* Placeholder for potential right-side elements */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
