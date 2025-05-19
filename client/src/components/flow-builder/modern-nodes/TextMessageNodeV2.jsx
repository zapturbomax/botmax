import React, { useState } from 'react';
import BaseNodeV2 from './BaseNodeV2';

function TextMessageNodeV2({ id, data, selected, isConnectable }) {
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
  
  // Ícone para o nó de mensagem de texto
  const MessageIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" 
         stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 9H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 13H14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  
  return (
    <BaseNodeV2
      id={id}
      data={data}
      selected={selected}
      icon={<MessageIcon />}
      title="Enviar mensagem"
      subtitle="Texto"
      color="#26C6B9" // Verde-água
    >
      {/* Texto explicativo superior */}
      <div className="text-gray-400 italic text-center mb-4">
        Digite sua mensagem abaixo
      </div>
      
      {/* Campo de mensagem - textarea com fundo cinza claro */}
      <div className="mb-6">
        <textarea
          value={messageText}
          onChange={handleTextChange}
          placeholder="Digite sua mensagem..."
          className="w-full min-h-[120px] p-4 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none resize-none"
        />
      </div>
      
      {/* Campo de entrada para variáveis com emoji e botão de envio */}
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
    </BaseNodeV2>
  );
}

export default TextMessageNodeV2;