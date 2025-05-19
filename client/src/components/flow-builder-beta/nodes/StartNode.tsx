import React from 'react';
import { Handle, Position } from 'reactflow';
import { Play } from 'lucide-react';

interface StartNodeProps {
  id: string;
  data: {
    text: string;
  };
  selected: boolean;
}

/**
 * Nó de início do fluxo
 * Este é o primeiro nó do fluxo e não possui entrada, apenas saída
 */
const StartNode: React.FC<StartNodeProps> = ({ id, data, selected }) => {
  return (
    <div className={`relative rounded-lg shadow-md border border-[#E2E8F0] bg-white overflow-hidden w-[300px] transition-shadow ${selected ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
      {/* Cabeçalho */}
      <div className="bg-[#22c55e] text-white p-3 flex justify-between items-center">
        <div className="flex items-center">
          <Play className="h-5 w-5 mr-2" />
          <span className="font-medium">Início do fluxo</span>
        </div>
      </div>
      
      {/* Conteúdo */}
      <div className="p-4">
        <p className="text-sm text-gray-600">
          Este é o início do fluxo. Seu fluxo sempre começa aqui quando ativado através das suas campanhas ou gatilhos.
        </p>
      </div>
      
      {/* Conector de saída */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ 
          width: 12, 
          height: 12,
          background: 'white',
          border: '2px solid #CBD5E0',
          bottom: -6,
        }}
        id="source"
      />
    </div>
  );
};

export default StartNode;