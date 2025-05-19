import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import FlowNode from './FlowNode';

const TextMessageNode = ({ id, data, selected }) => {
  // Estado local para modificações na mensagem
  const [message, setMessage] = useState(data.text || "");
  
  return (
    <FlowNode
      id={id}
      data={data}
      selected={selected}
      icon={<MessageSquare className="h-6 w-6" />}
      title="Enviar mensagem"
      subtitle="Texto"
      color="#26C6B9"
    >
      <div className="text-gray-400 italic text-center mb-4">
        Digite sua mensagem abaixo
      </div>
      
      <div className="mb-6">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full min-h-[120px] p-4 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none resize-none"
          placeholder="Digite sua mensagem aqui..."
        />
      </div>
      
      <div className="mb-4">
        <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
          <div className="px-4 text-gray-400">
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
            className="flex-1 py-3 px-2 text-gray-600 border-none focus:outline-none"
          />
          <button className="px-4 text-gray-400 hover:text-[#26C6B9]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Ferramentas de formatação */}
      <div className="flex items-center justify-center gap-4 py-2">
        <button className="text-gray-500 hover:text-gray-800" title="Texto em negrito">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12H14C16.2091 12 18 10.2091 18 8C18 5.79086 16.2091 4 14 4H6V12ZM6 12H15C17.2091 12 19 13.7909 19 16C19 18.2091 17.2091 20 15 20H6V12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="text-gray-500 hover:text-gray-800" title="Texto em itálico">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 4H10M14 20H5M15 4L9 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="text-gray-500 hover:text-gray-800" title="Texto sublinhado">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 5V11C7 14.3137 9.68629 17 13 17C16.3137 17 19 14.3137 19 11V5M5 19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="text-gray-500 hover:text-gray-800" title="Lista com marcadores">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H20M9 12H20M9 19H20M5 5V5.01M5 12V12.01M5 19V19.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="text-gray-500 hover:text-gray-800" title="Lista numérica">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 6H20M10 12H20M10 18H20M5 6V6.01M5 12V12.01M5 18V18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </FlowNode>
  );
};

export default TextMessageNode;