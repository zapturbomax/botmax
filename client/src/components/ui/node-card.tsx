import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "./button";

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

interface CardAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

interface CardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  color?: string;
  selected?: boolean;
  children?: ReactNode;
  actions?: CardAction[];
  onAddBlock?: () => void;
}

export function Card({
  title,
  description,
  icon,
  color,
  selected = false,
  children,
  actions = [],
  onAddBlock,
}: CardProps) {
  return (
    <div className={cn(cardVariants({ selected }))}>
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
        </div>
        
        {children}
        
        {/* Inline actions shown when card is selected */}
        {selected && actions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {actions.map((action, i) => (
              <Button 
                key={i} 
                size="sm" 
                variant="ghost" 
                className="h-8 px-2 text-xs"
                onClick={action.onClick}
              >
                {action.icon && <span className="mr-1.5">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {/* Add block button (shown below the node when selected) */}
      {selected && onAddBlock && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 z-10">
          <Button 
            size="sm" 
            variant="secondary"
            className="h-8 rounded-full shadow-md border border-gray-200 dark:border-gray-700"
            onClick={onAddBlock}
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Adicionar bloco</span>
          </Button>
        </div>
      )}
    </div>
  );
}