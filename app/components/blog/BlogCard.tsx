import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

export interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  author: string;
  publishedDate: string;
}

const BlogCard: FC<BlogCardProps> = ({
  title,
  slug,
  excerpt,
  image,
  author,
  publishedDate,
}) => {
  // Format date to be more readable
  const formattedDate = new Date(publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Ensure excerpt doesn't exceed a certain length
  const truncatedExcerpt = excerpt.length > 150 ? `${excerpt.substring(0, 150)}...` : excerpt;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
      <div className="relative h-48 w-full flex justify-center">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="object-cover w-50 h-50"
          />
        ) : (
          <div className="w-full h-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
            <span className="text-green-600 dark:text-green-300 font-medium">EcoHaven</span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/blog/${slug}`} className="group">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400">
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow overflow-hidden text-ellipsis line-clamp-3">
          {truncatedExcerpt}
        </p>
        
        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{author}</span>
            <time dateTime={publishedDate}>{formattedDate}</time>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
