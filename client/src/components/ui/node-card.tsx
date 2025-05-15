import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { Copy, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
          
          {/* Menu de opções (três pontos) */}
          {selected && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 rounded-full"
                >
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Duplicar</span>
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500" 
                    onClick={onDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        {children}
      </div>
    </div>
  );
}