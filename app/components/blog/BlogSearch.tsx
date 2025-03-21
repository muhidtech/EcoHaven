'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

interface BlogSearchProps {
  blogPosts: BlogPost[];
}

export default function BlogSearch({ blogPosts }: BlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialPage = Number(searchParams.get('page') || '1');

  const [searchTerm, setSearchTerm] = useState<string>(initialQuery);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);
  const postsPerPage = 6;

  // Update filtered posts when search term changes
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setFilteredPosts(blogPosts);
      } else {
        const filtered = blogPosts.filter((post) => {
          const normalizedTags = Array.isArray(post.tags) ? post.tags : [];
          return (
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            normalizedTags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        });
        setFilteredPosts(filtered);
      }

      // Reset to first page when search results change
      setCurrentPage(1);

      // Update URL with search parameters
      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set('q', searchTerm);
      } else {
        params.delete('q');
      }
      params.set('page', '1');
      router.replace(`/blog?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm, blogPosts, router, searchParams]);

  // Update URL when page changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('page', currentPage.toString());
    if (searchTerm) {
      params.set('q', searchTerm);
    }
    router.replace(`/blog?${params.toString()}`, { scroll: false });
  }, [currentPage, router, searchParams, searchTerm]);

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="w-full mx-auto md:mx-0">
      {/* Search bar */}
      <div className="relative mb-8 group">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200 bg-white"
          aria-label="Search blog posts"
        />
        <svg
          className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>

      {/* Search results info */}
      {searchTerm && (
        <div className="mb-6 text-gray-600">
          Found {filteredPosts.length} results for "{searchTerm}"
        </div>
      )}

      {/* No results message */}
      {filteredPosts.length === 0 && searchTerm && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
          <p className="text-gray-600 text-lg">No blog posts found matching your search.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-4 px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredPosts.length > postsPerPage && (
        <div className="flex justify-center mt-10">
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-50 text-green-800 hover:bg-green-100'
              }`}
              aria-label="Previous page"
            >
              ← Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`hidden md:block px-4 py-2 rounded-md transition-colors ${
                  currentPage === number
                    ? 'bg-green-600 text-white'
                    : 'bg-green-50 text-green-800 hover:bg-green-100'
                }`}
                aria-label={`Page ${number}`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-50 text-green-800 hover:bg-green-100'
              }`}
              aria-label="Next page"
            >
              Next →
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
