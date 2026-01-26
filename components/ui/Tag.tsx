import React from "react";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

interface TagProps {
  label: string;
  category?: Category;
  variant?: "default" | "status" | "category";
  status?: "open" | "closed" | "completed" | "cancelled";
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  label,
  category,
  variant = "default",
  status,
  className,
}) => {
  const getColorClasses = () => {
    if (variant === "status") {
      if (status === "open") {
        return "bg-secondary/10 text-secondary-dark border-secondary/20";
      }
      if (status === "completed") {
        return "bg-primary/10 text-primary-dark border-primary/20";
      }
      return "bg-gray-100 text-gray-600 border-gray-200";
    }
    
    if (variant === "category") {
      // Using a hash or predefined colors based on category id would be better, 
      // but for now keeping it simple with dynamic classes if they exist in Tailwind safelist,
      // or falling back to a generic style.
      return "bg-white border-gray-200 text-gray-700 shadow-sm hover:border-primary/30 hover:text-primary";
    }
    
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-200",
        getColorClasses(),
        className
      )}
    >
      {label}
    </span>
  );
};
