import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  showValue?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  showValue = true,
  size = "md",
  className,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {showValue && <span className="text-sm font-medium mr-1">{rating.toFixed(1)}</span>}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={i} className={cn(starSize, "fill-yellow-400 text-yellow-400")} />
      ))}
      {hasHalfStar && (
        <Star className={cn(starSize, "fill-yellow-400 text-yellow-400 opacity-50")} />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={i} className={cn(starSize, "text-gray-300")} />
      ))}
    </div>
  );
};
