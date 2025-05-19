import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { MessageCircle, Info, Send, Copy, Trash2, HelpCircle } from 'lucide-react';

function ModernTextMessageNode({ id, data, selected, isConnectable }) {
  const [messageText, setMessageText] = useState(data.text || '');
  
  // Funções para atualizar o nó
  const handleTextChange = (e) => {
    setMessageText(e.target.value);
    data.onChange?.(id, { text: e.target.value });
  };
  
  const handleDuplicate = () => {
    data.onDuplicate?.(id);
  };
  
  const handleDelete = () => {
    data.onDelete?.(id);
  };
  
  return (
    <div className="relative" style={{ width: 320 }}>
      {/* Barra de botões superior */}
      <div className="absolute top-0 left-0 right-0 bg-[#3A4049] text-white rounded-t-xl py-2 px-4 flex justify-end gap-4 z-10">
        <button 
          className="flex items-center gap-1 text-sm font-medium hover:text-gray-200"
          onClick={handleDuplicate}
        >
          <Copy size={16} />
          Duplicar
        </button>
        <button 
          className="flex items-center gap-1 text-sm font-medium hover:text-gray-200"
          onClick={handleDelete}
        >
          <Trash2 size={16} />
          Remover
        </button>
      </div>
      
      {/* Conector de entrada */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ 
          left: -8, 
          top: '50%', 
          width: 16, 
          height: 16, 
          background: 'white', 
          border: '2px solid #E2E8F0',
          zIndex: 20 
        }}
        isConnectable={isConnectable}
      />
      
      <div className="relative mt-10 rounded-xl shadow-md border border-[#E2E8F0] bg-white overflow-hidden">
        {/* Cabeçalho com contadores */}
        <div className="bg-[#26C6B9] text-white p-4 flex justify-center">
          <div className="flex-1 flex flex-col items-center">
            <div className="text-4xl font-bold">{data.executionCount || 0}</div>
            <div className="flex items-center text-sm">
              Executando
              <Info size={14} className="ml-1 cursor-help" />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="text-4xl font-bold">{data.sentCount || 0}</div>
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
            <div className="bg-[#26C6B9] p-3 rounded-full mr-3">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#4A5568] text-lg font-medium">Enviar mensagem</h3>
              <p className="text-[#26C6B9] text-sm">Texto</p>
            </div>
            <HelpCircle size={24} className="text-gray-400" />
          </div>
          
          {/* Área de mensagem */}
          <div className="mb-4">
            <div className="text-gray-400 italic mb-2">Digite sua mensagem abaixo</div>
            <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
              <textarea
                value={messageText}
                onChange={handleTextChange}
                placeholder="Digite sua mensagem abaixo"
                className="w-full min-h-[60px] p-1 text-sm bg-transparent border-none resize-none focus:outline-none"
              />
            </div>
          </div>
          
          {/* Campo de digitação */}
          <div className="relative mb-4">
            <div className="flex items-center border border-gray-200 rounded-md">
              <input 
                type="text" 
                placeholder="Digite @ p/ utilizar os campos" 
                className="flex-1 p-2 text-sm border-none focus:outline-none"
              />
              <button className="p-2 text-gray-400 hover:text-[#26C6B9]">
                <Send size={18} />
              </button>
            </div>
          </div>
          
          {/* Botão próximo passo */}
          <div className="flex justify-end mt-4">
            <button className="text-[#4A5568] font-medium flex items-center">
              Próximo passo
            </button>
          </div>
        </div>
      </div>
      
      {/* Conector de saída */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ 
          right: -8, 
          top: '50%', 
          width: 16, 
          height: 16, 
          background: 'white', 
          border: '2px solid #E2E8F0',
          zIndex: 20 
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default ModernTextMessageNode;