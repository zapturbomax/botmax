import React, { useState } from 'react';
import { MenuSquare, ChevronDown, Plus, Clock, AlertCircle } from 'lucide-react';
import BaseFlowNode from './BaseFlowNode';

function ButtonsNode({ id, data, selected, isConnectable }) {
  const [messageText, setMessageText] = useState(data.message || '');
  
  // Função para atualizar o texto da mensagem
  const handleMessageChange = (e) => {
    const newText = e.target.value;
    setMessageText(newText);
    
    if (data.onChange) {
      data.onChange(id, { message: newText });
    }
  };
  
  // Dados dos botões
  const buttons = data.buttons || [
    { id: 1, text: 'Suporte', ctr: 0 },
    { id: 2, text: 'Vendas', ctr: 0 },
    { id: 3, text: 'Outros', ctr: 0 },
  ];
  
  return (
    <BaseFlowNode
      id={id}
      data={data}
      selected={selected}
      icon={<MenuSquare size={20} className="text-white" />}
      title="Enviar opções"
      subtitle="Botões"
      color="#4A7AFF" // Azul
      outputs={buttons.length + 1} // Um conector para cada botão + caminho padrão
    >
      {/* Área de mensagem */}
      <div className="mb-4">
        <textarea
          value={messageText}
          onChange={handleMessageChange}
          placeholder="Digite sua mensagem acima dos botões..."
          className="w-full min-h-[60px] p-3 text-sm border border-gray-200 rounded-md resize-none focus:outline-none"
        />
      </div>
      
      {/* Seletor de formato */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Formato:</span>
          <div className="relative">
            <button className="flex items-center bg-gray-100 px-3 py-1 rounded-md text-sm">
              Texto
              <ChevronDown size={14} className="ml-2" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Salvar resposta em:</span>
          <div className="relative">
            <button className="flex items-center bg-gray-100 px-3 py-1 rounded-md text-sm">
              Selecione
              <ChevronDown size={14} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Lista de botões */}
      <div className="mb-4">
        {buttons.map((button, index) => (
          <div key={button.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#4A7AFF] mr-2"></div>
              <span className="text-sm">{button.text}</span>
            </div>
            <div className="text-xs text-gray-500">
              CTR: {button.ctr}%
            </div>
          </div>
        ))}
        
        {/* Botão para adicionar mais opções */}
        <button className="flex items-center justify-center w-full p-2 mt-2 border border-dashed border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
          <Plus size={14} className="mr-1" />
          Novo botão
        </button>
      </div>
      
      {/* Opções adicionais */}
      <div className="mb-4">
        <div className="flex items-center p-3 border border-gray-200 rounded-md mb-2">
          <Clock size={16} className="text-gray-400 mr-2" />
          <span className="text-sm">Se não responder em</span>
          <select className="ml-2 text-sm bg-transparent border-none appearance-none focus:outline-none">
            <option>60</option>
            <option>120</option>
            <option>180</option>
          </select>
          <span className="text-sm ml-1 mr-1">segundos</span>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-md">
          <AlertCircle size={16} className="text-gray-400 mr-2" />
          <span className="text-sm">Caso a resposta seja inválida</span>
          <ChevronDown size={14} className="text-gray-400 ml-auto" />
        </div>
      </div>
    </BaseFlowNode>
  );
}

export default ButtonsNode;