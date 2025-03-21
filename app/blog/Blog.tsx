"use client";
// BlogPage.tsx
import { Suspense, useEffect, useState } from "react";
import BlogCard from "@/app/components/blog/BlogCard";
import BlogSearch from "@/app/components/blog/BlogSearch";
import useScrollAnimation from "@/app/hooks/useScrollAnimation";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  slug: string;
  image: string;
  tags: string[];
}

// Client component that uses server data
export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Scroll animation hooks
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });
  const [searchRef, searchVisible] = useScrollAnimation({ threshold: 0.1, animationDelay: 200 });
  const [gridRef, gridVisible] = useScrollAnimation({ threshold: 0.1, animationDelay: 400 });
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/blog.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch blog posts: ${response.status}`);
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setBlogPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen pt-20 flex flex-col bg-green-50">
      <main className="flex-grow container mx-auto px-6 py-10">
        <div 
          ref={headerRef} 
          className={`mb-12 text-center scroll-animation-container ${headerVisible ? 'animate-fadeInDown' : ''}`}
        >
          <h1 className="text-4xl font-bold text-green-700 mb-4 font-serif">Our Blog</h1>
          <p className="text-gray-600 max-w-3xl mb-8 text-lg leading-relaxed mx-auto">
            Explore our latest articles on sustainability, eco-friendly living, and environmental conservation.
          </p>

          <div 
            ref={searchRef}
            className={`scroll-animation-container ${searchVisible ? 'animate-fadeInUp delay-200' : ''}`}
          >
            <Suspense fallback={<div className="h-14 w-full flex justify-center mx-auto animate-pulse rounded-md" />}>
              <BlogSearch blogPosts={blogPosts} />
            </Suspense>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md h-80 animate-pulse"></div>
            ))}
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-5 rounded-md shadow-sm my-8 max-w-3xl mx-auto">
            <h3 className="font-bold text-lg mb-2">No blog posts available</h3>
            <p>We&#39;re working on adding new content. Please check back later.</p>
          </div>
        ) : (
          <div 
            ref={gridRef}
            className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10 scroll-animation-container ${gridVisible ? 'animate-fadeIn' : ''}`}
          >
            {blogPosts.map((post, index) => (
              <div 
                key={post.id} 
                className={`transform transition duration-300 hover:scale-105 h-full scroll-animation-container ${gridVisible ? `animate-zoomIn delay-${(index % 9 + 1) * 100}` : ''}`}
              >
                <BlogCard {...post} publishedDate={post.date} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
