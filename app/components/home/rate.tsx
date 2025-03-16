"use client"


import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface RatingProps {
  rating: number;
  maxStars?: number;
}

const Rating: React.FC<RatingProps> = ({ rating, maxStars = 5 }) => {
  const fullStars = Math.floor(rating); // Full stars
  const hasHalfStar = rating % 1 >= 0.5; // Half star condition
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0); // Remaining stars

  return (
    <div className="flex items-center gap-1 text-yellow-500 text-sm">
      {/* Full Stars */}
      {Array.from({ length: fullStars }, (_, i) => (
        <FaStar key={`full-${i}`} />
      ))}

      {/* Half Star */}
      {hasHalfStar && <FaStarHalfAlt key="half" />}

      {/* Empty Stars */}
      {Array.from({ length: emptyStars }, (_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-gray-300" />
      ))}
    </div>
  );
};

export default Rating;
