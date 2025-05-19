import React from 'react';
import { Handle, Position } from 'reactflow';
import { Play } from 'lucide-react';

interface StartNodeProps {
  id: string;
  data: {
    label?: string;
    onChange?: (id: string, data: any) => void;
  };
  selected: boolean;
}

/**
 * Nó de início do fluxo
 * Este é o primeiro nó do fluxo, que inicia a conversa
 */
const StartNode = ({ id, data, selected }: StartNodeProps) => {
  return (
    <div 
      className={`relative rounded-lg border-2 p-4 shadow-sm w-[220px] bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-900 ${
        selected ? 'border-green-500 ring-2 ring-green-200 dark:ring-green-800' : 'border-green-300'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
          <Play className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm text-green-700 dark:text-green-400">Início do Fluxo</h3>
          <p className="text-xs text-green-600 dark:text-green-500 mt-1">
            {data.label || "Dispara automaticamente quando o contato inicia a conversa"}
          </p>
        </div>
      </div>

      {/* Saída */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        className="w-3 h-3 bg-green-500 border-2 border-white bottom-[-7px]"
      />
    </div>
  );
};

export default StartNode;