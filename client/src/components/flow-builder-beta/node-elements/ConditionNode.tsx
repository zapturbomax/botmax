
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { SplitSquareVertical } from 'lucide-react';

const ConditionNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-md p-3 border border-gray-200 dark:border-gray-700 w-64">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />
      
      <div className="flex items-center mb-2">
        <SplitSquareVertical className="h-5 w-5 text-orange-500 mr-2" />
        <div className="text-sm font-medium">Condição</div>
      </div>
      
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm min-h-[40px]">
        {data?.condition || 'Defina uma condição...'}
      </div>
      
      <div className="flex justify-between mt-2 text-xs">
        <div className="text-green-500">Verdadeiro</div>
        <div className="text-red-500">Falso</div>
      </div>
      
      <Handle type="source" position={Position.Bottom} id="true" className="w-3 h-3 bg-green-500 left-[25%]" />
      <Handle type="source" position={Position.Bottom} id="false" className="w-3 h-3 bg-red-500 left-[75%]" />
    </div>
  );
};

export default ConditionNode;
