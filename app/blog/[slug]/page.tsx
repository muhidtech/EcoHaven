import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
}

interface PageProps {
  params: { slug: string; };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: `${post.title} | EcoHaven Blog`,
    description: post.excerpt,
  };
}

async function getBlogData(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/blog.json`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch blog data');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return [];
  }
}

async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogData();
  return posts.find((post) => post.slug === slug);
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/blog"
          className="text-green-600 hover:text-green-800 flex items-center gap-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to all articles
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>

        <div className="flex items-center text-gray-600 mb-6">
          <span className="mr-4">{post.author}</span>
          <span>•</span>
          <time className="ml-4">{formatDate(post.date)}</time>
        </div>
      </header>

      <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
        <Image src={post.image} alt={post.title} className="object-cover" fill priority />
      </div>

      <article className="prose prose-lg max-w-none">
        {post.content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-6 text-gray-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </article>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Share this article</h3>
            <div className="flex gap-4">
              <button className="text-gray-600 hover:text-green-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
            </div>
          </div>

          <Link
            href="/blog"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition-colors"
          >
            Read more articles
          </Link>
        </div>
      </div>
    </main>
  );
}
