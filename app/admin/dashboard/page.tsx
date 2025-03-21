"use client";

import { useCallback, useEffect, useState } from "react";
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

// Activity interfaces
export interface BaseActivity {
  id: string;
  type: 'order' | 'user' | 'product' | 'blog';
  date: Date;
  message: string;
}

export interface OrderActivity extends BaseActivity {
  type: 'order';
  orderId: string;
  customerName: string;
  productName: string;
}

export interface UserActivity extends BaseActivity {
  type: 'user';
  userName: string;
}

export interface ProductActivity extends BaseActivity {
  type: 'product';
  productName: string;
  action: 'added' | 'updated' | 'deleted';
}

export interface BlogActivity extends BaseActivity {
  type: 'blog';
  title: string;
  slug: string;
}

export type Activity = OrderActivity | UserActivity | ProductActivity | BlogActivity;

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  publishedDate: string;
}


import { Order as LocalOrder } from "@/app/services/localDataService";

interface Order extends LocalOrder {
  customerName: string;
}

interface Product {
  id: string;
  name: string;
  stock: number;
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
  const [activityData, setActivityData] = useState<Activity[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState(true);

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

  // Function to fetch blog posts
  const fetchBlogPosts = async (): Promise<BlogActivity[]> => {
    try {
      const response = await fetch('/blog.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.status} ${response.statusText}`);
      }
      const posts = await response.json();
      return Array.isArray(posts)
        ? posts.map((post: BlogPost, index: number) => ({
            id: post.id || `blog-${index}`,
            type: 'blog' as const,
            date: new Date(post.publishedDate),
            message: `"${post.title}" published`,
            title: post.title,
            slug: post.slug || '',
          }))
        : [];
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  };

  // Function to fetch all activity data
  const fetchActivityData = useCallback( async (): Promise<Activity[]> => {
    try {
      // Get orders and convert to activities
      const orders = getOrdersFromStorage();
      const orderActivities: OrderActivity[] = orders.slice(0, 5).map((order) => {
        const localOrder = order as Order; // Explicitly cast to local Order interface
        return {
          id: `order-${localOrder.id}`,
          type: 'order',
          date: new Date(localOrder.createdAt || Date.now()),
          message: `${localOrder.customerName || 'Customer'} placed an order for ${
            localOrder.items?.[0]?.productName || 'products'
          }`,
          orderId: localOrder.id,
          customerName: localOrder.customerName || 'Customer',
          productName: localOrder.items?.[0]?.productName || 'products',
        };
      });

      // Get blog posts and convert to activities
      const blogActivities = await fetchBlogPosts();
      
      // Get product updates (simulated for now)
      const products = await getProducts();
      const productActivities: ProductActivity[] = products.slice(0, 3).map((product: Product, index: number) => ({
        id: `product-${product.id || index}`,
        type: 'product',
        date: new Date(Date.now() - Math.random() * 86400000 * 3), // Random time in the last 3 days
        message: `${product.name} inventory updated to ${product.stock || 'new'} units`,
        productName: product.name,
        action: 'updated',
      }));

      // Combine all activities
      const allActivities: Activity[] = [
        ...orderActivities,
        ...blogActivities,
        ...productActivities
      ];

      // Sort by date (newest first)
      return allActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
      console.error('Error fetching activity data:', error);
      return [];
    }
  }, []);

  // Revised useEffect
  useEffect(() => {
    // Check admin status; redirect if user is not admin
    if (!isAdminLogin()) {
      router.push('/');
      return; // exit early if not admin
    }

    const fetchAllData = async () => {
      try {
        // Fetch products
        const products = await getProducts();
        setProductsCount(products.length);

        // Fetch orders and calculate revenue
        const orders = getOrdersFromStorage();
        setOrdersCount(orders.length);
        const totalRevenue = orders.reduce((sum, order) => {
          const amount = typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount;
          return sum + (amount || 0);
        }, 0);
        setRevenue(totalRevenue);

        // Fetch users
        const users = await getUsers();
        setUsersCount(users.length);

        // Fetch activity data
        setIsActivityLoading(true);
        const activities = await fetchActivityData();
        setActivityData(activities);
        setIsActivityLoading(false);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsActivityLoading(false);
      }
    };

    fetchAllData();
  }, [isAdminLogin, router, fetchActivityData]);

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

  const handleSignOut = () => {
    signOut()
    router.push('/')
  }

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
          <Link href="/admin/blogs" className="group flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-green-50 hover:text-green-700 mb-1">
            <FaBlog className="mr-3 h-5 w-5" />
            <span>Blog</span>
          </Link>
        </nav>
        <div className="absolute bottom-0 w-full border-t p-4">
          <button onClick={() => handleSignOut()} className="cursor-pointer flex items-center text-gray-700 hover:text-red-600 w-full">
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
              {isActivityLoading ? (
                <div className="text-center py-4">
                  <p className="text-gray-600">Loading activity data...</p>
                </div>
              ) : activityData.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600">No recent activity found</p>
                </div>
              ) : (
                <ol className="relative border-l border-gray-200">
                  {activityData.slice(0, 5).map((activity, index) => {
                    // Determine icon and styling based on activity type
                    let icon;
                    let bgColor;
                    let title;
                    let linkHref;
                    let linkText;
                    
                    switch (activity.type) {
                      case 'order':
                        icon = <FaShoppingCart className="w-3 h-3 text-blue-600" />;
                        bgColor = 'bg-blue-100';
                        title = `New Order #${(activity as OrderActivity).orderId}`;
                        linkHref = '/admin/orders';
                        linkText = 'View Order';
                        break;
                      case 'user':
                        icon = <FaUsers className="w-3 h-3 text-green-600" />;
                        bgColor = 'bg-green-100';
                        title = 'New User Registration';
                        break;
                      case 'product':
                        icon = <FaBoxOpen className="w-3 h-3 text-purple-600" />;
                        bgColor = 'bg-purple-100';
                        title = 'Product Updated';
                        break;
                      case 'blog':
                        icon = <FaBlog className="w-3 h-3 text-yellow-600" />;
                        bgColor = 'bg-yellow-100';
                        title = 'New Blog Post';
                        linkHref = '/admin/blog';
                        linkText = 'View Post';
                        break;
                    }
                    
                    // Format date
                    const timeAgo = (date: Date): string => {
                      const now = new Date();
                      const diffMs = now.getTime() - date.getTime();
                      const diffSecs = Math.floor(diffMs / 1000);
                      const diffMins = Math.floor(diffSecs / 60);
                      const diffHours = Math.floor(diffMins / 60);
                      const diffDays = Math.floor(diffHours / 24);
                      
                      if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
                      if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                      if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
                      return 'just now';
                    };
                    
                    return (
                      <li key={activity.id} className={`${index < activityData.length - 1 ? 'mb-6' : ''} ml-6`}>
                        <span className={`absolute flex items-center justify-center w-6 h-6 ${bgColor} rounded-full -left-3 ring-8 ring-white`}>
                          {icon}
                        </span>
                        <div className="flex justify-between items-center">
                          <h3 className="flex items-center text-lg font-semibold text-gray-900">{title}</h3>
                          <time className="text-sm text-gray-500">{timeAgo(activity.date)}</time>
                        </div>
                        <p className="mb-2 text-base font-normal text-gray-600">
                          {activity.message}
                        </p>
                        {linkHref && (
                          <Link href={linkHref} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 mt-1">
                            {linkText}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
