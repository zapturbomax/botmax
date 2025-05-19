import React, { useState } from 'react';
import { MessageSquare, Smile, Send } from 'lucide-react';
import BaseFlowNode from './BaseFlowNode';

function TextMessageNode({ id, data, selected, isConnectable }) {
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
    <BaseFlowNode
      id={id}
      data={data}
      selected={selected}
      icon={<MessageSquare size={20} className="text-white" />}
      title="Enviar mensagem"
      subtitle="Texto"
      color="#26C6B9" // Verde-água
    >
      {/* Área de mensagem - seguindo exatamente o design de referência */}
      <div className="mb-4">
        <div className="text-gray-400 italic mb-2 text-center">Digite sua mensagem abaixo</div>
        <div className="bg-gray-50 rounded-lg p-2 mb-4 text-gray-400 italic text-center">
          <textarea
            value={messageText}
            onChange={handleTextChange}
            placeholder="Digite sua mensagem..."
            className="w-full min-h-[60px] p-2 text-base bg-transparent border-none resize-none focus:outline-none text-center"
          />
        </div>
      </div>
      
      {/* Campo de entrada com emoji - exatamente como na imagem */}
      <div>
        <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
          <div className="pl-4 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9H9.01" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 9H15.01" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Digite @ p/ utilizar os campos" 
            className="flex-1 px-3 py-3 text-base border-none focus:outline-none"
          />
          <button className="px-4 py-3 text-gray-400 hover:text-[#26C6B9]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </BaseFlowNode>
  );
}

export default TextMessageNode;