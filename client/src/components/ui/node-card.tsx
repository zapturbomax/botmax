import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const cardVariants = cva(
  "bg-white dark:bg-gray-800 rounded-md shadow-sm border transition-colors duration-200 relative min-w-[200px] overflow-hidden",
  {
    variants: {
      selected: {
        true: "border-primary ring-2 ring-primary/20",
        false: "border-gray-200 dark:border-gray-700",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
);

interface CardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  color?: string;
  selected?: boolean;
  children?: ReactNode;
}

export function Card({
  title,
  description,
  icon,
  color,
  selected = false,
  children,
}: CardProps) {
  return (
    <div className={cn(cardVariants({ selected }))}>
      <div className="p-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className={cn("p-2 rounded-md", color || "bg-primary/10")}>
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-medium text-sm">{title}</h3>
            {description && (
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}