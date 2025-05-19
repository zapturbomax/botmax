import React from 'react';
import { User } from 'lucide-react';
import BaseFlowNode from './BaseFlowNode';

function ContactNode({ id, data, selected, isConnectable }) {
  return (
    <BaseFlowNode
      id={id}
      data={data}
      selected={selected}
      icon={<User size={20} className="text-white" />}
      title="Envio de contatos"
      subtitle="Contatos"
      color="#FF9F4A" // Laranja
      hideEncaminhada={true}
    >
      {/* Lista de contatos */}
      <div className="mb-4">
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md mb-3">
          <p className="text-gray-500 text-sm">Selecione os contatos que deseja compartilhar com o usuário.</p>
        </div>
        
        {/* Lista vazia ou com contatos */}
        {!data.contacts || data.contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-md">
            <div className="p-3 rounded-full bg-[#FF9F4A]/10 mb-3">
              <User size={24} className="text-[#FF9F4A]" />
            </div>
            <p className="text-center text-gray-500 text-sm">Nenhum contato adicionado</p>
            <button className="mt-3 bg-[#FF9F4A] text-white px-4 py-2 rounded-md text-sm font-medium">
              Adicionar contato
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {(data.contacts || []).map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-[#FF9F4A]/10 mr-2">
                    <User size={16} className="text-[#FF9F4A]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.phone}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ))}
            <button className="flex items-center justify-center w-full p-2 border border-dashed border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
              </svg>
              Adicionar contato
            </button>
          </div>
        )}
      </div>
      
      {/* Mostrar indicador de "Recomendado" */}
      <div className="mb-4 flex justify-end">
        <span className="text-xs px-2 py-1 bg-[#FF9F4A]/10 text-[#FF9F4A] rounded-full">
          RECOMENDADO
        </span>
      </div>
    </BaseFlowNode>
  );
}

export default ContactNode;