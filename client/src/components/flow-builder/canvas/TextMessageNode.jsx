import React, { useState } from 'react';
import FlowNode from './FlowNode';
import { MessageSquare } from 'lucide-react';

/**
 * Nó para envio de mensagens de texto
 * Design moderno com foco em UX
 */
const TextMessageNode = ({ id, data, selected }) => {
  const [messageText, setMessageText] = useState(data.text || '');
  
  // Função para atualizar o texto da mensagem
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setMessageText(newText);
    
    // Atualizamos os dados no nó
    if (data.onChange) {
      data.onChange(id, { text: newText });
    }
  };

  return (
    <FlowNode 
      id={id}
      data={data}
      selected={selected}
      icon={MessageSquare}
      title="Enviar mensagem"
      subtitle="Texto"
      color="#26C6B9"
    >
      {/* Dica de uso */}
      <div className="text-gray-400 text-sm italic mb-4 text-center">
        Digite sua mensagem abaixo
      </div>
      
      {/* Campo para digitar a mensagem */}
      <div className="mb-4">
        <textarea
          value={messageText}
          onChange={handleTextChange}
          placeholder="Digite sua mensagem aqui..."
          className="w-full rounded-lg p-3 min-h-[120px] bg-gray-50 border-0 text-gray-800 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
        />
      </div>
      
      {/* Campo para variáveis com emoji e envio */}
      <div className="relative">
        <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
          <div className="pl-3 pr-2">
            <button className="text-gray-400 hover:text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9H9.01" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 9H15.01" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <input 
            type="text" 
            placeholder="Digite @ p/ utilizar as variáveis"
            className="flex-1 py-2.5 px-2 text-sm text-gray-600 border-none focus:outline-none focus:ring-0"
          />
          <button className="pr-3 pl-2 text-gray-400 hover:text-[#26C6B9]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </FlowNode>
  );
};

export default TextMessageNode;