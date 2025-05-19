
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ListNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <Card className="w-[280px] shadow-md transition-all">
      <CardHeader className="bg-blue-500 text-white p-3 flex flex-row items-center space-x-2">
        <List size={18} />
        <CardTitle className="text-sm font-medium">Lista</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="text-sm">Lista (implementação pendente)</div>
      </CardContent>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500"
      />
    </Card>
  );
};

export default ListNode;
