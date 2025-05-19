
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Node } from 'reactflow';

interface PropertiesPanelProps {
  node: Node;
  updateNodeData: (nodeId: string, data: any) => void;
  onClose: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  node, 
  updateNodeData, 
  onClose 
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">Propriedades</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <p>Editando nó: {node.id}</p>
        <p>Tipo: {node.type}</p>
        
        {/* Placeholder para propriedades específicas de cada tipo de nó */}
        <div className="mt-4">
          <p className="text-gray-500">Conteúdo editável do nó aparecerá aqui.</p>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
