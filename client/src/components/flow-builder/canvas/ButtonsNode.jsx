import React, { useState } from 'react';
import { LayoutGrid, PlusCircle, X } from 'lucide-react';
import FlowNode from './FlowNode';

const ButtonsNode = ({ id, data, selected }) => {
  // Estado local para gerenciar os botões
  const [buttons, setButtons] = useState(data.buttons || [
    { id: '1', text: 'Opção 1', value: 'opcao_1' },
    { id: '2', text: 'Opção 2', value: 'opcao_2' },
  ]);
  const [message, setMessage] = useState(data.message || "Escolha uma opção:");
  
  // Adiciona um novo botão
  const handleAddButton = () => {
    if (buttons.length < 5) {
      const newId = String(buttons.length + 1);
      setButtons([
        ...buttons,
        { id: newId, text: `Opção ${newId}`, value: `opcao_${newId}` }
      ]);
    }
  };
  
  // Remove um botão específico
  const handleRemoveButton = (id) => {
    setButtons(buttons.filter(button => button.id !== id));
  };
  
  // Atualiza um botão específico
  const handleUpdateButton = (id, field, value) => {
    setButtons(buttons.map(button => {
      if (button.id === id) {
        return { ...button, [field]: value };
      }
      return button;
    }));
  };
  
  return (
    <FlowNode
      id={id}
      data={data}
      selected={selected}
      icon={<LayoutGrid className="h-6 w-6" />}
      title="Enviar botões"
      subtitle="Interação rápida"
      color="#F59F0A"
      outputs={buttons.length + 1}
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg p-3 min-h-[80px] bg-gray-50 border-0 text-gray-800 focus:ring-2 focus:ring-[#F59F0A]/50 outline-none resize-none"
          placeholder="Digite a mensagem que acompanha os botões..."
        />
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Botões (máx. 5)</label>
          <button 
            onClick={handleAddButton}
            disabled={buttons.length >= 5}
            className={`flex items-center text-xs px-2 py-1 rounded ${buttons.length >= 5 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#F59F0A] text-white hover:bg-[#F59F0A]/80'}`}
          >
            <PlusCircle className="h-3 w-3 mr-1" />
            Adicionar
          </button>
        </div>
        
        <div className="space-y-2">
          {buttons.map((button) => (
            <div key={button.id} className="flex items-start space-x-2">
              <div className="flex-1 p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex mb-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
                    {button.id}
                  </div>
                  <button 
                    onClick={() => handleRemoveButton(button.id)}
                    className="ml-auto text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Texto exibido</label>
                    <input
                      type="text"
                      value={button.text}
                      onChange={(e) => handleUpdateButton(button.id, 'text', e.target.value)}
                      className="w-full p-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59F0A]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Valor (variável)</label>
                    <input
                      type="text"
                      value={button.value}
                      onChange={(e) => handleUpdateButton(button.id, 'value', e.target.value)}
                      className="w-full p-2 text-xs rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59F0A]/50 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 border-t border-gray-100 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Fluxo</h3>
        <div className="space-y-2 text-sm text-gray-600">
          {buttons.map((button, index) => (
            <div key={`flow-${button.id}`} className="flex items-center">
              <div 
                className="rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs"
                style={{ 
                  backgroundColor: `rgba(245, 159, 10, ${0.1 + (index * 0.15)})`,
                  color: '#F59F0A'
                }}
              >
                {index + 1}
              </div>
              <span>
                Botão "{button.text}" → Saída {index + 1}
              </span>
            </div>
          ))}
          <div className="flex items-center">
            <div className="bg-red-100 text-red-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">
              {buttons.length + 1}
            </div>
            <span>Timeout (resposta não recebida) → Última saída</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <details className="group">
          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
            <span className="text-sm text-gray-600">Opções avançadas</span>
            <span className="transition group-open:rotate-180">
              <svg fill="none" height="14" width="14" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </summary>
          <div className="mt-3 text-sm text-gray-500 group-open:animate-fadeIn">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tempo limite (segundos)</label>
                <input
                  type="number"
                  defaultValue={60}
                  min={10}
                  max={86400}
                  className="w-full p-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59F0A]/50"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da variável</label>
                <input
                  type="text"
                  defaultValue="resposta_botao"
                  className="w-full p-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F59F0A]/50"
                />
              </div>
            </div>
          </div>
        </details>
      </div>
    </FlowNode>
  );
};

export default ButtonsNode;