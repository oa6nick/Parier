import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseStyles = "relative font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] overflow-hidden group";
  
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5",
    secondary: "bg-white text-gray-900 border border-gray-200 shadow-sm hover:border-primary/30 hover:shadow-md hover:text-primary",
    outline: "border-2 border-gray-200 text-gray-700 bg-transparent hover:border-primary hover:text-primary hover:bg-primary/5",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-glass",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-4 text-base",
    icon: "p-2 w-10 h-10 flex items-center justify-center",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {/* Shine effect */}
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      )}
      <span className="relative z-20 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};
