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
      {/* Área de mensagem */}
      <div className="mb-4">
        <div className="text-gray-400 italic mb-2">Digite sua mensagem abaixo</div>
        <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
          <textarea
            value={messageText}
            onChange={handleTextChange}
            placeholder="Digite sua mensagem..."
            className="w-full min-h-[60px] p-1 text-sm bg-transparent border-none resize-none focus:outline-none"
          />
        </div>
      </div>
      
      {/* Campo de entrada com emoji */}
      <div className="mb-4">
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
    </BaseFlowNode>
  );
}

export default TextMessageNode;