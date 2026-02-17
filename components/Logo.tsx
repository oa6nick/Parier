import React from "react";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "auth";
  /** When true, brand name is always visible (e.g. in footer). Default: false = hidden on mobile in header. */
  alwaysShowText?: boolean;
}

const sizes = {
  sm: "w-8 h-8 text-base",
  md: "w-10 h-10 text-xl",
  lg: "w-12 h-12 text-2xl",
};

export const Logo: React.FC<LogoProps> = ({
  className,
  showText = true,
  size = "md",
  variant = "default",
  alwaysShowText = false,
}) => {
  const iconSize = sizes[size];

  const logoSymbol = (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl font-bold text-white shrink-0",
        variant === "auth"
          ? "relative"
          : "bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg shadow-gray-900/10",
        iconSize
      )}
    >
      {variant === "auth" ? (
        <>
          <div className="absolute inset-0 bg-primary rounded-xl rotate-3" />
          <div className="absolute inset-0 bg-white rounded-xl -rotate-3" />
          <span className="relative text-gray-900 font-bold">P</span>
        </>
      ) : (
        <span>P</span>
      )}
    </div>
  );

  if (!showText) {
    return (
      <Link href="/" className={cn("flex items-center", className)}>
        {logoSymbol}
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 sm:gap-3 group flex-shrink-0",
        className
      )}
    >
      {logoSymbol}
      <span
        className={cn(
          "font-bold tracking-tight",
          size === "sm" && "text-base",
          size === "md" && "text-xl",
          size === "lg" && "text-2xl",
          variant === "auth"
            ? "text-white"
            : cn("text-gray-900", !alwaysShowText && "hidden sm:block")
        )}
      >
        Pariall
      </span>
    </Link>
  );
};
