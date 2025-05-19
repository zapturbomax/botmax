
import React from 'react';
import { MessageSquare, Menu, SplitSquareVertical } from 'lucide-react';

const NodePalette: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h3 className="text-lg font-medium mb-4">Componentes</h3>
      
      <div className="space-y-2">
        <div 
          className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm cursor-move border border-gray-200 dark:border-gray-700"
          draggable
          onDragStart={(e) => onDragStart(e, 'textMessage')}
        >
          <MessageSquare className="h-5 w-5 text-blue-500 mr-3" />
          <span>Mensagem de Texto</span>
        </div>
        
        <div 
          className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm cursor-move border border-gray-200 dark:border-gray-700"
          draggable
          onDragStart={(e) => onDragStart(e, 'buttons')}
        >
          <Menu className="h-5 w-5 text-green-500 mr-3" />
          <span>Botões</span>
        </div>
        
        <div 
          className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm cursor-move border border-gray-200 dark:border-gray-700"
          draggable
          onDragStart={(e) => onDragStart(e, 'condition')}
        >
          <SplitSquareVertical className="h-5 w-5 text-orange-500 mr-3" />
          <span>Condição</span>
        </div>
      </div>
    </div>
  );
};

export default NodePalette;
