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
  params: {
    slug: string;
  };
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
        <Image src={post.image} alt={post.title} fill className="object-cover" />
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
