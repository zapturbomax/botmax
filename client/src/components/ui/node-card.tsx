import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const cardVariants = cva(
  "bg-white dark:bg-gray-800 rounded-lg shadow-md border transition-all duration-200 relative min-w-[240px] overflow-visible",
  {
    variants: {
      selected: {
        true: "border-primary/50 ring-2 ring-primary/20 shadow-lg shadow-primary/10",
        false: "border-gray-200 dark:border-gray-700 hover:shadow-lg",
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
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onAddBlock?: () => void;
}

export function Card({
  title,
  description,
  icon,
  color,
  selected = false,
  children,
  onEdit,
  onDelete,
  onDuplicate,
  onAddBlock,
}: CardProps) {
  const handleDoubleClick = () => {
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <div 
      className={cn(cardVariants({ selected }))}
      onDoubleClick={handleDoubleClick}
    >
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-1">
          {icon && (
            <div className={cn("p-2 rounded-md", color || "bg-primary/10")}>
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{title}</h3>
            {description && (
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 truncate">
                {description}
              </p>
            )}
          </div>
          
          {/* Removido o menu de opções para usar o botão existente */}
        </div>
        
        {children}
      </div>
    </div>
  );
}