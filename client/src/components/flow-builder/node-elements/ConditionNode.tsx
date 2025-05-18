import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Card } from '@/components/ui/node-card';
import { ArrowRightLeft } from 'lucide-react';
import { InlineEdit } from '@/components/flow-builder/InlineEdit';

interface ConditionNodeProps {
  id: string;
  data: {
    name?: string;
    description?: string;
    condition?: string;
  };
  selected: boolean;
  onUpdateNodeData: (id: string, data: Record<string, any>) => void;
}

export const ConditionNode: React.FC<ConditionNodeProps> = ({
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
  
  const handleConditionChange = useCallback((newCondition: string) => {
    onUpdateNodeData(id, { condition: newCondition });
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
        title={data.name || "Condição"}
        description={data.description || "Bifurcação condicional no fluxo"}
        icon={<ArrowRightLeft className="h-4 w-4 text-amber-500" />}
        color="bg-amber-100 dark:bg-amber-900/30"
        selected={selected}
        isEditable={isEditing}
        onTitleChange={handleNameChange}
        onDescriptionChange={handleDescriptionChange}
      >
        <Handle type="target" position={Position.Top} />
        
        <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
          {isEditing ? (
            <InlineEdit 
              value={data.condition || ''} 
              onChange={handleConditionChange} 
              placeholder="Digite sua condição... Ex: {{variável}} === 'valor'"
              multiline={true}
              className="w-full min-h-[40px]"
              textClassName="text-xs font-mono"
              onBlur={handleBlur}
            />
          ) : (
            <p className="text-xs font-mono overflow-auto max-h-20">
              {data.condition || <span className="text-gray-400">Clique para editar a condição</span>}
            </p>
          )}
        </div>
        
        <div className="flex justify-between mt-2 text-xs">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
            <span>Verdadeiro</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
            <span>Falso</span>
          </div>
        </div>
        
        <Handle 
          type="source" 
          position={Position.Bottom} 
          id="true" 
          className="w-3 h-3 bg-green-500 -ml-4"
        />
        <Handle 
          type="source" 
          position={Position.Bottom} 
          id="false" 
          className="w-3 h-3 bg-red-500 ml-4"
        />
      </Card>
    </div>
  );
};