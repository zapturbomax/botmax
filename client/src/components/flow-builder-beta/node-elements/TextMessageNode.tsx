
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MessageSquare } from 'lucide-react';

const TextMessageNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-md p-3 border border-gray-200 dark:border-gray-700 w-64">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
      
      <div className="flex items-center mb-2">
        <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
        <div className="text-sm font-medium">Mensagem de Texto</div>
      </div>
      
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm min-h-[40px]">
        {data?.message || 'Clique para editar a mensagem...'}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400" />
    </div>
  );
};

export default TextMessageNode;
