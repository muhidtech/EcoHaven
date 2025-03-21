"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  imageUrl: string;
}

export default function AdminBlogManagement() {
  const router = useRouter();
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/blog.json");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load blog posts. Please try again later.");
        setLoading(false);
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, []);

  // Handle form submission for adding a new blog
  const handleAddBlog = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !slug || !excerpt || !content || !author || !publishedDate || !imageUrl) {
      setFormError("All fields are required");
      return;
    }

    // Create new blog object
    const newBlog: Blog = {
      id: Date.now().toString(),
      title,
      slug,
      excerpt,
      content,
      author,
      publishedDate,
      imageUrl
    };

    try {
      // In a real application, you would make an API call to save the blog
      // For this example, we'll just update the local state
      setBlogs([...blogs, newBlog]);
      
      // Reset form
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setAuthor("");
      setPublishedDate("");
      setImageUrl("");
      
      setFormSuccess("Blog post added successfully!");
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err) {
      setFormError("Failed to add blog post. Please try again.");
      console.error("Error adding blog:", err);
    }
  };

  // Handle blog deletion
  const handleDeleteBlog = (id: string) => {
    try {
      // In a real application, you would make an API call to delete the blog
      // For this example, we'll just update the local state
      const updatedBlogs = blogs.filter(blog => blog.id !== id);
      setBlogs(updatedBlogs);
      setFormSuccess("Blog post deleted successfully!");
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err) {
      setError("Failed to delete blog post. Please try again.");
      console.error("Error deleting blog:", err);
    }
  };

  // If user is not authenticated or loading
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-800">Blog Management</h1>
        <Link href="/admin" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition">
          Back to Dashboard
        </Link>
      </div>

      {/* Success and Error Messages */}
      {formSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {formSuccess}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add New Blog Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">Add New Blog Post</h2>
        
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleAddBlog} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 mb-1">
                Published Date
              </label>
              <input
                type="date"
                id="publishedDate"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Blog Post
          </button>
        </form>
      </div>

      {/* Blog List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">Blog Posts</h2>
        
        {loading ? (
          <p className="text-center py-4">Loading blog posts...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center py-4">No blog posts found.</p>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="border-b pb-6 last:border-b-0">
                <div className="flex flex-col md:flex-row gap-4">
                  {blog.imageUrl && (
                    <div className="w-full md:w-1/4">
                      <div className="relative h-48 w-full">
                        <Image
                          src={blog.imageUrl}
                          alt={blog.title}
                          className="object-cover rounded-md"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="w-full md:w-3/4">
                    <h3 className="text-xl font-semibold text-green-800 mb-2">{blog.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      By {blog.author} • Published on {new Date(blog.publishedDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 mb-4">{blog.excerpt}</p>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}