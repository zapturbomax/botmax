import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { ChevronRight, MoreHorizontal, HelpCircle, AlertCircle } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Componente principal para todos os nós do flow builder
 * Design moderno e elegante com foco em UX
 */
const FlowNode = ({ 
  id, 
  data, 
  selected,
  icon: Icon, 
  title = 'Nó',
  subtitle = 'Ação',
  color = '#4C9AFF',
  secondaryColor = '#DEEBFF',
  outputs = 1,
  children 
}) => {
  const [isForwarded, setIsForwarded] = useState(data.isForwarded || false);
  
  // Manipulador para o checkbox de encaminhamento
  const handleForwardedChange = (e) => {
    const checked = e.target.checked;
    setIsForwarded(checked);
    if (data.onChange) {
      data.onChange(id, { isForwarded: checked });
    }
  };
  
  // Função para duplicar o nó
  const handleDuplicate = () => {
    if (data.onDuplicate) {
      data.onDuplicate(id);
    } else if (window.duplicateNode) {
      window.duplicateNode(id);
    }
  };
  
  // Função para remover o nó
  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    } else if (window.deleteNode) {
      window.deleteNode(id);
    }
  };
  
  // Estatísticas de execução
  const executionCount = data.executionCount || 0;
  const sentCount = data.sentCount || 0;
  const hasError = data.hasError || false;
  
  return (
    <motion.div
      className="relative flow-node" 
      style={{ width: 360 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
    >
      {/* Ponto de conexão de entrada */}
      <Handle
        type="target"
        position={Position.Left}
        className="connection-handle connection-handle-input"
        style={{ 
          width: 12,
          height: 12,
          background: 'white',
          border: '2px solid #CBD5E0',
          zIndex: 10,
          left: -6
        }}
      />
      
      {/* Container principal do nó */}
      <div className={`node-container bg-white rounded-xl overflow-hidden shadow-lg border ${selected ? 'border-blue-400' : 'border-gray-100'}`}>
        {/* Cabeçalho com estatísticas */}
        <div 
          className="node-header px-4 py-5 flex justify-between"
          style={{ backgroundColor: color, color: 'white' }}
        >
          <div className="flex flex-col items-center justify-center flex-1">
            <span className="text-5xl font-semibold">{executionCount}</span>
            <div className="flex items-center mt-1 text-sm">
              <span>Executando</span>
              <HelpCircle className="ml-1 h-4 w-4 cursor-help" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center flex-1">
            <span className="text-5xl font-semibold">{sentCount}</span>
            <div className="flex items-center mt-1 text-sm">
              <span>Enviados</span>
              <HelpCircle className="ml-1 h-4 w-4 cursor-help" />
            </div>
          </div>
        </div>
        
        {/* Barra de status (sucesso/erro) */}
        {hasError && (
          <div className="bg-red-50 px-4 py-2 flex items-center text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>Ocorreu um erro neste nó. Verifique a configuração.</span>
          </div>
        )}
        
        {/* Conteúdo do nó com título e menu de ações */}
        <div className="px-5 pt-5 pb-3 flex items-center">
          <div 
            className="icon-container h-14 w-14 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: color }}
          >
            {Icon ? <Icon className="h-6 w-6" /> : <div className="h-6 w-6" />}
          </div>
          
          <div className="ml-4 flex-grow">
            <h3 className="text-xl font-medium text-gray-800">{title}</h3>
            <p className="text-sm font-medium" style={{ color }}>{subtitle}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-full hover:bg-gray-100">
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleDuplicate} className="flex items-center gap-2 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Duplicar</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="flex items-center gap-2 text-red-600 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Remover</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Área de conteúdo específica de cada tipo de nó */}
        <div className="px-5 pb-4">
          {children}
        </div>
        
        {/* Rodapé do nó */}
        <div className="px-5 py-4 flex justify-between items-center border-t border-gray-100">
          <div className="flex items-center">
            <input 
              type="checkbox"
              id={`forward-${id}`}
              checked={isForwarded}
              onChange={handleForwardedChange}
              className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 mr-2"
            />
            <label htmlFor={`forward-${id}`} className="text-gray-600 text-sm cursor-pointer">
              Marcar como encaminhada
            </label>
          </div>
          
          <button 
            className="flex items-center text-sm font-medium transition-colors hover:opacity-90"
            style={{ color }}
          >
            <span className="mr-1">Próximo passo</span>
            <div className="flex items-center justify-center border rounded-full w-6 h-6" style={{ borderColor: color }}>
              <ChevronRight className="h-3.5 w-3.5" style={{ color }} />
            </div>
          </button>
        </div>
      </div>
      
      {/* Ponto(s) de conexão de saída */}
      {outputs === 1 ? (
        <Handle
          type="source"
          position={Position.Right}
          className="connection-handle connection-handle-output"
          style={{ 
            width: 12,
            height: 12,
            background: 'white',
            border: '2px solid #CBD5E0',
            zIndex: 10,
            right: -6
          }}
        />
      ) : (
        Array.from({ length: outputs }).map((_, index) => (
          <Handle
            key={`output-${index}`}
            type="source"
            id={`output-${index}`}
            position={Position.Right}
            className="connection-handle connection-handle-output"
            style={{ 
              width: 12,
              height: 12,
              background: 'white',
              border: '2px solid #CBD5E0',
              zIndex: 10,
              right: -6,
              top: `${35 + (index * 30)}%`
            }}
          />
        ))
      )}
    </motion.div>
  );
};

export default FlowNode;