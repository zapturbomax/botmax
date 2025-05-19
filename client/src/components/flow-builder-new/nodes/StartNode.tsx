import React from 'react';
import { Handle, Position } from 'reactflow';
import { Play } from 'lucide-react';

interface StartNodeProps {
  id: string;
  data: {
    label?: string;
  };
  selected?: boolean;
}

/**
 * Nó de início do fluxo seguindo o design do Dispara.ai
 */
const StartNode = ({ id, data, selected }: StartNodeProps) => {
  return (
    <div 
      className={`group relative flex flex-col rounded-lg bg-white border-2 shadow-sm w-[220px] ${
        selected ? 'border-[#26C6B9]' : 'border-[#e0e0e0]'
      }`}
    >
      {/* Cabeçalho do nó */}
      <div className="flex items-center p-3 bg-[#26C6B9] rounded-t-md">
        <div className="bg-white rounded-full p-1 mr-2">
          <Play className="h-3 w-3 text-[#26C6B9]" />
        </div>
        <span className="text-white text-sm font-medium">Início do fluxo</span>
      </div>
      
      {/* Corpo do nó */}
      <div className="p-3 text-xs text-gray-600">
        Esse é o início do fluxo, pode ser iniciado diretamente pelo botão correspondente.
      </div>
      
      {/* Contador de mensagens no canto superior */}
      <div className="absolute -top-3 -right-3 flex">
        <div className="bg-[#26C6B9] text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
          0
        </div>
        <div className="bg-[#26C6B9] text-white text-xs rounded-full h-6 w-6 flex items-center justify-center ml-1">
          0
        </div>
      </div>
      
      {/* Conectores */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        className="w-3 h-3 bg-[#26C6B9] border-2 border-white"
        style={{ bottom: '-6px' }}
      />
    </div>
  );
};

export default StartNode;