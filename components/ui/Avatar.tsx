import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = "md",
  className,
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div
      className={cn(
        "rounded-full bg-gray-200 flex items-center justify-center overflow-hidden",
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold text-sm">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};
