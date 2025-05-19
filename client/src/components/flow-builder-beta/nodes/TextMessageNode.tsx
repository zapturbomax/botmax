import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { MessageCircle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TextMessageNodeProps {
  id: string;
  data: {
    text: string;
    onChange?: (id: string, data: any) => void;
  };
  selected: boolean;
}

/**
 * Nó de mensagem de texto
 * Permite enviar uma mensagem de texto para o usuário
 */
const TextMessageNode = ({ id, data, selected }: TextMessageNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.text || '');

  const handleSave = () => {
    if (data.onChange) {
      data.onChange(id, { ...data, text });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setText(data.text || '');
    setIsEditing(false);
  };

  return (
    <div 
      className={`relative rounded-lg border-2 p-4 shadow-sm w-[280px] bg-white dark:bg-gray-800 ${
        selected ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white">
          <MessageCircle className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">Mensagem de Texto</h3>
        </div>
        {!isEditing && (
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="mt-2 space-y-2">
          <Textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite sua mensagem aqui..."
            className="min-h-[100px] text-sm resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
            >
              Salvar
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-md text-sm min-h-[60px] whitespace-pre-wrap"
          onClick={() => setIsEditing(true)}
        >
          {data.text || <span className="text-gray-400 italic">Clique para adicionar texto</span>}
        </div>
      )}

      {/* Entrada */}
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        className="w-3 h-3 bg-blue-500 border-2 border-white top-[-7px]"
      />

      {/* Saída */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        className="w-3 h-3 bg-blue-500 border-2 border-white bottom-[-7px]"
      />
    </div>
  );
};

export default TextMessageNode;