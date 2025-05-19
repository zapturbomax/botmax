
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { GitBranch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ConditionNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <Card className="w-[280px] shadow-md transition-all">
      <CardHeader className="bg-green-500 text-white p-3 flex flex-row items-center space-x-2">
        <GitBranch size={18} />
        <CardTitle className="text-sm font-medium">Condição</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="text-sm">Condição (implementação pendente)</div>
      </CardContent>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-green-500"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500"
      />
      
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="w-3 h-3 bg-green-500"
      />
      
      <Handle
        type="source"
        position={Position.Left}
        id="false"
        className="w-3 h-3 bg-green-500"
      />
    </Card>
  );
};

export default ConditionNode;
