import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  iconColor = "text-primary",
  className,
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white rounded-2xl p-5 shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group",
        className
      )}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-150" />
      
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-xl bg-gray-50 group-hover:bg-white group-hover:shadow-md transition-all duration-300", iconColor.replace('text-', 'bg-').replace('500', '100'))}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">{value}</div>
        <div className="text-sm text-gray-500 font-medium">{label}</div>
      </div>
    </div>
  );
};
