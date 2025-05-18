import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface InlineEditProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  textClassName?: string;
  inputClassName?: string;
  multiline?: boolean;
  onBlur?: () => void;
}

export const InlineEdit: React.FC<InlineEditProps> = ({
  value,
  onChange,
  placeholder = 'Clique para editar',
  className = '',
  textClassName = '',
  inputClassName = '',
  multiline = false,
  onBlur
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Atualiza o valor local quando o valor da prop muda
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Foca o input quando começa a editar
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        // Posiciona o cursor no final do texto
        const length = inputRef.current.value.length;
        if (typeof inputRef.current.setSelectionRange === 'function') {
          inputRef.current.setSelectionRange(length, length);
        }
      }
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== localValue) {
      onChange(localValue);
    }
    if (onBlur) {
      onBlur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      handleBlur();
    } else if (e.key === 'Escape') {
      setLocalValue(value); // Restaura o valor original
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        rows={3}
        className={cn(
          'w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent',
          inputClassName
        )}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent',
          inputClassName
        )}
      />
    );
  }

  return (
    <div 
      onClick={handleClick}
      className={cn(
        'cursor-text',
        className
      )}
    >
      {value ? (
        <span className={textClassName}>{value}</span>
      ) : (
        <span className={cn("text-gray-400", textClassName)}>{placeholder}</span>
      )}
    </div>
  );
};