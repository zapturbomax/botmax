import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { InlineEdit } from "@/components/flow-builder/InlineEdit";

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
  onTitleChange?: (newTitle: string) => void;
  onDescriptionChange?: (newDescription: string) => void;
  isEditable?: boolean;
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
  onTitleChange,
  onDescriptionChange,
  isEditable = false,
}: CardProps) {
  // Função chamada quando o usuário clica duplo no cartão
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
            {isEditable && onTitleChange ? (
              <InlineEdit
                value={title}
                onChange={onTitleChange}
                placeholder="Digite um título..."
                className="w-full"
                textClassName="font-medium text-sm"
              />
            ) : (
              <h3 className="font-medium text-sm truncate hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer rounded px-1">
                {title}
              </h3>
            )}
            
            {description && (
              isEditable && onDescriptionChange ? (
                <InlineEdit
                  value={description}
                  onChange={onDescriptionChange}
                  placeholder="Digite uma descrição..."
                  className="w-full mt-0.5"
                  textClassName="text-gray-500 dark:text-gray-400 text-xs"
                />
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 truncate hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer rounded px-1">
                  {description}
                </p>
              )
            )}
          </div>
        </div>
        
        {children}
      </div>
      
      {/* Botões de ação rápida quando selecionado */}
      {selected && (
        <div className="absolute -right-2 top-0 flex flex-col gap-1 transform translate-x-full p-1">
          {onEdit && (
            <button 
              onClick={onEdit}
              className="w-7 h-7 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          )}
          {onDuplicate && (
            <button 
              onClick={onDuplicate}
              className="w-7 h-7 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button 
              onClick={onDelete}
              className="w-7 h-7 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 flex items-center justify-center text-gray-600 dark:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          {onAddBlock && (
            <button 
              onClick={onAddBlock}
              className="w-7 h-7 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary-foreground flex items-center justify-center text-gray-600 dark:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}