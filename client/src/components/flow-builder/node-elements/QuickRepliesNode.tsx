import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Card } from '@/components/ui/node-card';
import { MessageCircle, X, Plus } from 'lucide-react';
import { InlineEdit } from '@/components/flow-builder/InlineEdit';
import { Button } from '@/components/ui/button';

interface QuickRepliesNodeProps {
  id: string;
  data: {
    name?: string;
    description?: string;
    text?: string;
    buttons?: Array<{
      id: string;
      title: string;
    }>;
  };
  selected: boolean;
  onUpdateNodeData: (id: string, data: Record<string, any>) => void;
}

export const QuickRepliesNode: React.FC<QuickRepliesNodeProps> = ({
  id,
  data,
  selected,
  onUpdateNodeData
}) => {
  // Estado para controlar a edição
  const [isEditing, setIsEditing] = useState(false);
  const [editingButtonId, setEditingButtonId] = useState<string | null>(null);
  
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
  
  const handleButtonTitleChange = useCallback((buttonId: string, newTitle: string) => {
    const newButtons = [...(data.buttons || [])].map(button => 
      button.id === buttonId ? { ...button, title: newTitle } : button
    );
    onUpdateNodeData(id, { buttons: newButtons });
  }, [id, data.buttons, onUpdateNodeData]);
  
  const handleAddButton = useCallback(() => {
    const newButtons = [...(data.buttons || []), { id: Date.now().toString(), title: 'Novo Botão' }];
    onUpdateNodeData(id, { buttons: newButtons });
    // Começa editando o novo botão
    setEditingButtonId(newButtons[newButtons.length - 1].id);
  }, [id, data.buttons, onUpdateNodeData]);
  
  const handleRemoveButton = useCallback((buttonId: string) => {
    const newButtons = [...(data.buttons || [])].filter(button => button.id !== buttonId);
    onUpdateNodeData(id, { buttons: newButtons });
  }, [id, data.buttons, onUpdateNodeData]);
  
  // Ativa o modo de edição ao clicar no nó
  const handleCardClick = useCallback(() => {
    setIsEditing(true);
  }, []);
  
  // Desativa o modo de edição ao perder o foco
  const handleBlur = useCallback(() => {
    setIsEditing(false);
    setEditingButtonId(null);
  }, []);
  
  return (
    <div onClick={handleCardClick}>
      <Card
        title={data.name || "Respostas Rápidas"}
        description={data.description || "Mensagem com botões de resposta rápida"}
        icon={<MessageCircle className="h-4 w-4 text-blue-500" />}
        color="bg-blue-100 dark:bg-blue-900/30"
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
              className="w-full min-h-[40px]"
              textClassName="text-sm"
              onBlur={handleBlur}
            />
          ) : (
            <p className="text-sm">
              {data.text || <span className="text-gray-400">Clique para editar a mensagem</span>}
            </p>
          )}
        </div>
        
        <div className="mt-2 space-y-2">
          {(data.buttons || []).map((button) => (
            <div key={button.id} className="flex items-center gap-1">
              {isEditing && editingButtonId === button.id ? (
                <div className="flex-1 flex items-center">
                  <InlineEdit
                    value={button.title}
                    onChange={(newTitle) => handleButtonTitleChange(button.id, newTitle)}
                    placeholder="Título do botão"
                    className="flex-1"
                    textClassName="text-xs py-1"
                    onBlur={handleBlur}
                  />
                </div>
              ) : (
                <div 
                  className="flex-1 text-xs bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 py-1 px-2 rounded border border-gray-200 dark:border-gray-600 cursor-pointer"
                  onClick={() => isEditing && setEditingButtonId(button.id)}
                >
                  {button.title}
                </div>
              )}
              
              {isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0"
                  onClick={() => handleRemoveButton(button.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          
          {isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={handleAddButton}
            >
              <Plus className="h-3 w-3 mr-1" /> Adicionar Botão
            </Button>
          )}
        </div>
        
        {/* Handles para cada botão */}
        {(data.buttons || []).map((button, index) => (
          <Handle
            key={button.id}
            type="source"
            position={Position.Bottom}
            id={button.id}
            className="w-2 h-2 bg-blue-500"
            style={{ left: `${20 + (index * 60 / Math.max(1, (data.buttons || []).length - 1))}%` }}
          />
        ))}
      </Card>
    </div>
  );
};