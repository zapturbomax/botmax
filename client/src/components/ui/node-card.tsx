import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NodeCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  color?: string;
  children: ReactNode;
  selected?: boolean;
}

export const Card = ({
  title,
  description,
  icon,
  color = 'bg-primary-50 text-primary-500 dark:bg-primary-900/50 dark:text-primary-400',
  children,
  selected = false,
}: NodeCardProps) => {
  return (
    <div
      className={cn(
        'w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md border transition-all',
        selected 
          ? 'border-primary-400 dark:border-primary-500 shadow-lg ring-2 ring-primary-100 dark:ring-primary-900' 
          : 'border-gray-200 dark:border-gray-700 hover:shadow-lg'
      )}
    >
      <div className="p-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-100 dark:border-gray-700 flex items-center rounded-t-lg">
        {icon && (
          <div className={cn('w-8 h-8 rounded-md flex items-center justify-center mr-3', color)}>
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</h3>
          {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      </div>
      
      {children}
    </div>
  );
};
