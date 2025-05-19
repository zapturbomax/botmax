import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface InlineEditProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  textClassName?: string;
  onBlur?: () => void;
}

export const InlineEdit: React.FC<InlineEditProps> = ({
  value,
  onChange,
  placeholder = 'Clique para editar...',
  multiline = false,
  className = '',
  textClassName = '',
  onBlur
}) => {
  const [editedValue, setEditedValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditedValue(value);
  }, [value]);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
      
      // Posiciona o cursor no final do texto
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
      }
    }
  }, [isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedValue(e.target.value);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (editedValue !== value) {
      onChange(editedValue);
    }
    onBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditedValue(value);
      setIsFocused(false);
      onBlur?.();
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      {isFocused ? (
        multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editedValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              'w-full min-h-[60px] p-1 text-sm rounded border border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none',
              textClassName
            )}
            autoFocus
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editedValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              'w-full p-1 text-sm rounded border border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none',
              textClassName
            )}
            autoFocus
          />
        )
      ) : (
        <div
          onClick={() => setIsFocused(true)}
          className={cn(
            'cursor-text p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800/50 min-h-[24px]',
            {
              'text-gray-400 italic': !value,
            },
            textClassName
          )}
        >
          {value || placeholder}
        </div>
      )}
    </div>
  );
};