import React, { ReactNode } from 'react';
import { Copy, Trash2, Info } from 'lucide-react';

interface UnifiedNodeCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  color?: string;
  onDuplicate?: () => void;
  onDelete?: () => void;
  executionCount?: number;
  sentCount?: number;
  children: ReactNode;
}

export function UnifiedNodeCard({
  icon,
  title,
  subtitle,
  color = '#26C6B9',
  onDuplicate,
  onDelete,
  executionCount = 0,
  sentCount = 0,
  children
}: UnifiedNodeCardProps) {
  return (
    <div className="relative" style={{ width: 320 }}>
      {/* Barra de botões superior */}
      <div className="absolute top-0 left-0 right-0 bg-[#3A4049] text-white rounded-t-xl py-2 px-4 flex justify-end gap-4 z-10">
        <button 
          className="flex items-center gap-1 text-sm font-medium hover:text-gray-200"
          onClick={onDuplicate}
        >
          <Copy size={16} />
          Duplicar
        </button>
        <button 
          className="flex items-center gap-1 text-sm font-medium hover:text-gray-200"
          onClick={onDelete}
        >
          <Trash2 size={16} />
          Remover
        </button>
      </div>
      
      <div className="relative mt-10 rounded-xl shadow-md border border-[#E2E8F0] bg-white overflow-hidden">
        {/* Cabeçalho com contadores */}
        <div style={{ backgroundColor: color }} className="text-white p-4 flex justify-center">
          <div className="flex-1 flex flex-col items-center">
            <div className="text-4xl font-bold">{executionCount}</div>
            <div className="flex items-center text-sm">
              Executando
              <Info size={14} className="ml-1 cursor-help" />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="text-4xl font-bold">{sentCount}</div>
            <div className="flex items-center text-sm">
              Enviados
              <Info size={14} className="ml-1 cursor-help" />
            </div>
          </div>
        </div>
        
        {/* Conteúdo principal */}
        <div className="p-4">
          {/* Cabeçalho do corpo */}
          <div className="flex items-center mb-4">
            <div style={{ backgroundColor: color }} className="p-3 rounded-full mr-3">
              {icon}
            </div>
            <div className="flex-1">
              <h3 className="text-[#4A5568] text-lg font-medium">{title}</h3>
              <p style={{ color }} className="text-sm">{subtitle}</p>
            </div>
          </div>
          
          {/* Conteúdo customizado do nó */}
          {children}
        </div>
      </div>
    </div>
  );
}