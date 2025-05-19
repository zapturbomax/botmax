import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { MessageSquare, Info, Send, Copy, Trash2, HelpCircle, ChevronDown, Smile } from 'lucide-react';
import { InlineEdit } from '@/components/flow-builder/InlineEdit';

interface TextMessageNodeCustomProps {
  id: string;
  data: {
    name?: string;
    description?: string;
    text?: string;
    isForwarded?: boolean;
    typingSeconds?: number;
    executionCount?: number;
    sentCount?: number;
  };
  selected: boolean;
  onUpdateNodeData: (id: string, data: Record<string, any>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export const TextMessageNodeCustom: React.FC<TextMessageNodeCustomProps> = ({
  id,
  data,
  selected,
  onUpdateNodeData,
  onDelete,
  onDuplicate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Valores padrão
  const executionCount = data?.executionCount || 0;
  const sentCount = data?.sentCount || 0;
  const typingSeconds = data?.typingSeconds || 0;
  const isForwarded = data?.isForwarded || false;
  
  // Manipuladores para atualizar os dados do nó
  const handleTextChange = useCallback((newText: string) => {
    onUpdateNodeData(id, { text: newText });
  }, [id, onUpdateNodeData]);
  
  const handleSetForwarded = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateNodeData(id, { isForwarded: event.target.checked });
  }, [id, onUpdateNodeData]);
  
  const handleTypingSecondsChange = useCallback((value: number) => {
    onUpdateNodeData(id, { typingSeconds: value });
  }, [id, onUpdateNodeData]);
  
  const handleNextStep = useCallback(() => {
    // Lógica para passar para o próximo passo
    console.log("Próximo passo");
  }, []);
  
  // Ativa o modo de edição ao clicar no nó
  const handleCardClick = useCallback(() => {
    setIsEditing(true);
  }, []);
  
  // Desativa o modo de edição ao perder o foco
  const handleBlur = useCallback(() => {
    setIsEditing(false);
  }, []);
  
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
      />
      
      <div className="relative mt-10 rounded-xl shadow-md border border-[#E2E8F0] bg-white overflow-hidden">
        {/* Cabeçalho com contadores */}
        <div className="bg-[#26C6B9] text-white p-4 flex justify-center">
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
        <div className="p-4" onClick={handleCardClick}>
          {/* Cabeçalho do corpo */}
          <div className="flex items-center mb-4">
            <div className="bg-[#26C6B9] p-3 rounded-full mr-3">
              <MessageSquare size={20} className="text-white" />
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
              {isEditing ? (
                <InlineEdit 
                  value={data?.text || ''} 
                  onChange={handleTextChange} 
                  placeholder="Digite sua mensagem..."
                  multiline={true}
                  className="w-full min-h-[60px]"
                  textClassName="text-sm"
                  onBlur={handleBlur}
                />
              ) : (
                <p className="text-sm min-h-[60px]">
                  {data?.text || <span className="text-gray-400 italic">Digite sua mensagem abaixo</span>}
                </p>
              )}
            </div>
          </div>
          
          {/* Campo de digitação */}
          <div className="relative mb-4">
            <div className="flex items-center border border-gray-200 rounded-md">
              <div className="p-2 text-gray-400">
                <Smile size={18} />
              </div>
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
          
          {/* Opção de encaminhamento */}
          <div className="mb-4 flex items-center">
            <input 
              type="checkbox"
              id={`forwarded-${id}`}
              checked={isForwarded}
              onChange={handleSetForwarded}
              className="w-4 h-4 mr-2 rounded border-gray-300"
            />
            <label htmlFor={`forwarded-${id}`} className="text-gray-500 text-sm">
              Marcar como encaminhada
            </label>
          </div>
          
          {/* Status de digitação */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="border border-[#26C6B9] p-2 rounded-md mr-2">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-[#26C6B9] rounded-full"></div>
                  <div className="w-1 h-1 bg-[#26C6B9] rounded-full"></div>
                  <div className="w-1 h-1 bg-[#26C6B9] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">Status digitando</div>
                <div className="flex items-center">
                  <span className="mr-1 text-[#4A5568] font-medium">{typingSeconds}</span>
                  <ChevronDown size={14} className="text-[#4A5568]" />
                  <span className="ml-1 text-gray-500 text-sm">segundos</span>
                </div>
              </div>
            </div>
            
            {/* Botão próximo passo */}
            <button 
              onClick={handleNextStep}
              className="text-[#4A5568] font-medium flex items-center"
            >
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
      />
    </div>
  );
};