"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface BlogItemProps {
  blog: Blog;
  index: number;
  onDelete: (id: string) => void;
}

export default function BlogItem({ blog, index, onDelete }: BlogItemProps) {
  const [itemRef, isVisible] = useScrollAnimation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Calculate staggered animation delay based on index
  const animationDelay = `${index * 0.1}s`;

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete(blog.id);
    setDeleteDialogOpen(false);
  };

  return (
    <div
      ref={itemRef}
      className={`border border-gray-200 rounded-lg p-4 transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: animationDelay }}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4 relative h-48 rounded-md overflow-hidden">
          {blog.imageUrl ? (
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <div className="md:w-3/4">
          <h3 className="text-xl font-semibold text-green-700 mb-2">{blog.title}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="mr-3">By: {blog.author}</span>
            <span>Published: {new Date(blog.publishedDate).toLocaleDateString()}</span>
          </div>
          <p className="text-gray-600 mb-4">{blog.excerpt}</p>
          <div className="flex space-x-3">
            <Link
              href={`/admin/blogs/edit/${blog.id}`}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-all duration-300"
            >
              Edit
            </Link>
            <button
              onClick={handleDeleteClick}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all duration-300"
            >
              Delete
            </button>
            <Link
              href={`/blog/${blog.slug}`}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-all duration-300"
            >
              View
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the blog post "{blog.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-all duration-300 mr-2"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-300"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}