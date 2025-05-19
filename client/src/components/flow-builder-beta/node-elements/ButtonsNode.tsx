
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Menu } from 'lucide-react';

const ButtonsNode: React.FC<NodeProps> = ({ data }) => {
  const buttons = data?.buttons || [{ text: 'Opção 1' }, { text: 'Opção 2' }];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-md p-3 border border-gray-200 dark:border-gray-700 w-64">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
      
      <div className="flex items-center mb-2">
        <Menu className="h-5 w-5 text-green-500 mr-2" />
        <div className="text-sm font-medium">Botões</div>
      </div>
      
      <div className="space-y-2">
        {buttons.map((button, index) => (
          <div key={index} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm flex justify-between items-center">
            <span>{button.text}</span>
          </div>
        ))}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400" />
    </div>
  );
};

export default ButtonsNode;
