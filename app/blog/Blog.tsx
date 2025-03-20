// BlogPage.tsx
import { Suspense } from "react";
import BlogCard from "@/app/components/blog/BlogCard";
import BlogSearch from "@/app/components/blog/BlogSearch";

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

// Server-side data fetching
async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/blog.json`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="min-h-screen pt-20 flex flex-col bg-green-50">
      <main className="flex-grow container mx-auto px-6 py-10">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-green-700 mb-4 font-serif">Our Blog</h1>
          <p className="text-gray-600 max-w-3xl mb-8 text-lg leading-relaxed mx-auto">
            Explore our latest articles on sustainability, eco-friendly living, and environmental conservation.
          </p>

          <Suspense fallback={<div className="h-14 w-full flex justify-center mx-auto animate-pulse rounded-md" />}>
            <BlogSearch blogPosts={blogPosts} />
          </Suspense>
        </div>

        {blogPosts.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-5 rounded-md shadow-sm my-8 max-w-3xl mx-auto">
            <h3 className="font-bold text-lg mb-2">No blog posts available</h3>
            <p>We're working on adding new content. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">
            {blogPosts.map((post) => (
              <div key={post.id} className="transform transition duration-300 hover:scale-105 h-full">
                <BlogCard {...post} publishedDate={post.date} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}