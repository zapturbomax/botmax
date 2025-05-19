import React, { useState, useRef, useEffect } from 'react';

interface InlineEditProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  className?: string;
  textClassName?: string;
  inputClassName?: string;
  multiline?: boolean;
  maxRows?: number;
  onBlur?: () => void;
}

/**
 * Componente InlineEdit que permite edição in-place de texto
 * Clique para editar, pressione Enter ou clique fora para salvar
 */
const InlineEdit = ({
  value,
  onChange,
  placeholder = 'Clique para editar',
  className = '',
  textClassName = '',
  inputClassName = '',
  multiline = false,
  maxRows = 5,
  onBlur
}: InlineEditProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      
      // Posicionar o cursor no final do texto
      if (typeof (inputRef.current as HTMLInputElement).setSelectionRange === 'function') {
        const length = text.length;
        (inputRef.current as HTMLInputElement).setSelectionRange(length, length);
      }
    }
  }, [isEditing]);

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== value) {
      onChange(text);
    }
    // Chamamos o callback onBlur se ele existir
    if (typeof onBlur === 'function') {
      onBlur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (!multiline) {
        e.preventDefault();
        setIsEditing(false);
        onChange(text);
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setText(value); // Revert to original
    }
  };

  // Ajustar altura da textarea dinamicamente
  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    textarea.style.height = 'auto';
    
    // Limitar o número de linhas
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const maxHeight = lineHeight * maxRows;
    
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  };

  return (
    <div className={`inline-edit ${className}`}>
      {isEditing ? (
        multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={text}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onInput={handleTextareaInput}
            className={`w-full p-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${inputClassName}`}
            style={{ resize: 'none' }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={text}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`w-full p-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${inputClassName}`}
          />
        )
      ) : (
        <div
          onClick={handleTextClick}
          className={`cursor-pointer p-2 rounded-md hover:bg-gray-100 min-h-[2rem] ${textClassName}`}
        >
          {value || <span className="text-gray-400 italic">{placeholder}</span>}
        </div>
      )}
    </div>
  );
};

export default InlineEdit;