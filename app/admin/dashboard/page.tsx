"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { FaBoxOpen, FaBlog, FaShoppingCart, FaUsers, FaBars, FaTimes, FaHome, FaChartLine, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { getProducts, getOrdersFromStorage } from "@/app/services/localDataService";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role?: string;
  createdAt: string;
}


const Dashboard = () => {
  const router = useRouter();
  const { isAdminLogin, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  // Function to get products from JSON file or localStorage
  

  // Function to get orders from localStorage

  // Function to get users from public directory
  const getUsers = async (): Promise<User[]> => {
    try {
      const response = await fetch('/data/users.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }
      const users: User[] = await response.json();
      return Array.isArray(users) ? users : [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  // Fetch data for dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch products
        const products = await getProducts();
        setProductsCount(products.length);

        // Fetch orders and calculate revenue
        const orders = getOrdersFromStorage();
        setOrdersCount(orders.length);
        
        // Calculate total revenue from orders
        const totalRevenue = orders.reduce((sum: number, order: { totalAmount: string | number }) => {
          return sum + (parseFloat(order.totalAmount.toString()) || 0);
        }, 0);
        setRevenue(totalRevenue);

        // Fetch users
        const users = await getUsers();
        setUsersCount(Array.isArray(users) ? users.length : 0);
      } catch (error) {
        console.error('Error in fetchDashboardData:', error);
      }
    };

    if (!isLoading) {
      fetchDashboardData();
    }
  }, [isLoading]);

  useEffect(() => {
    // Check if user is admin, if not redirect to home page
    if (!isAdminLogin) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [isAdminLogin, router]);

  // Consolidated data fetching for dashboard
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch products
        const products = await getProducts();
        setProductsCount(products.length);

        // Fetch orders and calculate revenue
        const orders = getOrdersFromStorage();
        setOrdersCount(orders.length);
        
        // Calculate total revenue from orders
        const totalRevenue = orders.reduce((sum: number, order: { totalAmount: string | number }) => {
          // Ensure proper numeric conversion with fallback to 0
          const amount = typeof order.totalAmount === 'string' 
            ? parseFloat(order.totalAmount) 
            : (typeof order.totalAmount === 'number' ? order.totalAmount : 0);
          return sum + (amount || 0);
        }, 0);
        setRevenue(totalRevenue);

        // Fetch users
        const users = await getUsers();
        setUsersCount(users.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    if (!isLoading) {
      fetchAllData();
    }
  }, [isLoading, isAdminLogin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Loading...</h2>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-center h-16 border-b">
          <h2 className="text-xl font-bold text-green-600">EcoHaven Admin</h2>
        </div>
        <nav className="mt-5 px-2">
          <Link href="/admin/dashboard" className="group flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-green-50 hover:text-green-700 mb-1">
            <FaHome className="mr-3 h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products" className="group flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-green-50 hover:text-green-700 mb-1">
            <FaBoxOpen className="mr-3 h-5 w-5" />
            <span>Products</span>
          </Link>
          <Link href="/admin/orders" className="group flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-green-50 hover:text-green-700 mb-1">
            <FaShoppingCart className="mr-3 h-5 w-5" />
            <span>Orders</span>
          </Link>
          <Link href="/admin/users" className="group flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-green-50 hover:text-green-700 mb-1">
            <FaUsers className="mr-3 h-5 w-5" />
            <span>Users</span>
          </Link>
          <Link href="/admin/blog" className="group flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-green-50 hover:text-green-700 mb-1">
            <FaBlog className="mr-3 h-5 w-5" />
            <span>Blog</span>
          </Link>
        </nav>
        <div className="absolute bottom-0 w-full border-t p-4">
          <button onClick={() => signOut()} className="cursor-pointer flex items-center text-gray-700 hover:text-red-600 w-full">
            <FaSignOutAlt className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <button onClick={toggleSidebar} className="md:hidden text-gray-600 focus:outline-none">
              {sidebarOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin User</span>
              <FaUserCircle className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>
            
            {/* Welcome Message */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-medium text-gray-800 mb-2">Welcome to the Admin Dashboard</h2>
              <p className="text-gray-600">
                Here you can manage products, orders, users, and blog posts for your EcoHaven store.
              </p>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <FaBoxOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Products</p>
                    <p className="text-2xl font-bold text-gray-800">{productsCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <FaShoppingCart className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-800">{ordersCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <FaUsers className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800">{usersCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                    <FaChartLine className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">${revenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Management Cards */}
            <h2 className="text-xl font-medium text-gray-800 mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
              <Link href="/admin/products" className="block">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <FaBoxOpen className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Product Management</h3>
                  <p className="text-gray-600">
                    Add, edit, or remove products from the store inventory
                  </p>
                </div>
              </Link>
              
              <Link href="/admin/blog" className="block">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <FaBlog className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Blog Management</h3>
                  <p className="text-gray-600">
                    Create, edit, or delete blog posts for the website
                  </p>
                </div>
              </Link>
              
              <Link href="/admin/orders" className="block">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <FaShoppingCart className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Order Management</h3>
                  <p className="text-gray-600">
                    View and manage customer orders and shipments
                  </p>
                </div>
              </Link>
              
              <Link href="/admin/users" className="block">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <FaUsers className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">User Management</h3>
                  <p className="text-gray-600">
                    Manage user accounts, permissions and roles
                  </p>
                </div>
              </Link>
            </div>
            
            {/* Recent Activity */}
            <h2 className="text-xl font-medium text-gray-800 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ol className="relative border-l border-gray-200">
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                    <FaShoppingCart className="w-3 h-3 text-blue-600" />
                  </span>
                  <div className="flex justify-between items-center">
                    <h3 className="flex items-center text-lg font-semibold text-gray-900">New Order #1089</h3>
                    <time className="text-sm text-gray-500">2 hours ago</time>
                  </div>
                  <p className="mb-2 text-base font-normal text-gray-600">
                    John Doe placed an order for Eco-friendly Water Bottle
                  </p>
                  <Link href="/admin/orders" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
                    View Order
                  </Link>
                </li>
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                    <FaUsers className="w-3 h-3 text-green-600" />
                  </span>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">New User Registration</h3>
                    <time className="text-sm text-gray-500">5 hours ago</time>
                  </div>
                  <p className="text-base font-normal text-gray-600">
                    Jane Smith created a new account
                  </p>
                </li>
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full -left-3 ring-8 ring-white">
                    <FaBoxOpen className="w-3 h-3 text-purple-600" />
                  </span>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Product Updated</h3>
                    <time className="text-sm text-gray-500">1 day ago</time>
                  </div>
                  <p className="text-base font-normal text-gray-600">
                    Bamboo Toothbrush inventory updated to 150 units
                  </p>
                </li>
                <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full -left-3 ring-8 ring-white">
                    <FaBlog className="w-3 h-3 text-yellow-600" />
                  </span>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">New Blog Post</h3>
                    <time className="text-sm text-gray-500">2 days ago</time>
                  </div>
                  <p className="text-base font-normal text-gray-600">
                    "10 Ways to Reduce Your Carbon Footprint" published
                  </p>
                  <Link href="/admin/blog" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 mt-3">
                    View Post
                  </Link>
                </li>
              </ol>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
