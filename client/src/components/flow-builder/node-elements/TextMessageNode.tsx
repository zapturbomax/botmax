import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Card } from '@/components/ui/node-card';
import { MessageCircle } from 'lucide-react';
import { InlineEdit } from '@/components/flow-builder/InlineEdit';

interface TextMessageNodeProps {
  id: string;
  data: {
    name?: string;
    description?: string;
    text?: string;
  };
  selected: boolean;
  onUpdateNodeData: (id: string, data: Record<string, any>) => void;
}

export const TextMessageNode: React.FC<TextMessageNodeProps> = ({
  id,
  data,
  selected,
  onUpdateNodeData
}) => {
  // Estado para controlar a edição
  const [isEditing, setIsEditing] = useState(false);
  
  // Manipuladores para atualizar os dados do nó
  const handleNameChange = useCallback((newName: string) => {
    onUpdateNodeData(id, { name: newName });
  }, [id, onUpdateNodeData]);
  
  const handleDescriptionChange = useCallback((newDescription: string) => {
    onUpdateNodeData(id, { description: newDescription });
  }, [id, onUpdateNodeData]);
  
  const handleTextChange = useCallback((newText: string) => {
    onUpdateNodeData(id, { text: newText });
  }, [id, onUpdateNodeData]);
  
  // Ativa o modo de edição ao clicar no nó
  const handleCardClick = useCallback(() => {
    setIsEditing(true);
  }, []);
  
  // Desativa o modo de edição ao perder o foco
  const handleBlur = useCallback(() => {
    setIsEditing(false);
  }, []);
  
  return (
    <div onClick={handleCardClick}>
      <Card
        title={data.name || "Mensagem de Texto"}
        description={data.description || "Enviar uma mensagem para o usuário"}
        icon={<MessageCircle className="h-4 w-4 text-primary" />}
        color="bg-primary/10"
        selected={selected}
        isEditable={isEditing}
        onTitleChange={handleNameChange}
        onDescriptionChange={handleDescriptionChange}
      >
        <Handle type="target" position={Position.Top} />
        
        <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
          {isEditing ? (
            <InlineEdit 
              value={data.text || ''} 
              onChange={handleTextChange} 
              placeholder="Digite sua mensagem..."
              multiline={true}
              className="w-full min-h-[60px]"
              textClassName="text-sm"
              onBlur={handleBlur}
            />
          ) : (
            <p className="text-sm">
              {data.text || <span className="text-gray-400">Clique para editar a mensagem</span>}
            </p>
          )}
        </div>
        
        <Handle type="source" position={Position.Bottom} />
      </Card>
    </div>
  );
};