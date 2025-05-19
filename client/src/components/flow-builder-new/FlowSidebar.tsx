import React from 'react';
import { Play, MessageCircle, List, Image, File, Music, Tag, MessageSquare, MessageSquareMore, Globe, Cable, User, Layers } from 'lucide-react';

/**
 * Sidebar lateral do Flow Builder seguindo o design do Dispara.ai
 */
const FlowSidebar = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 font-medium text-sm text-gray-500 uppercase">
        Configurações
      </div>
      
      {/* Início do fluxo */}
      <div className="p-2 mx-2 rounded-md hover:bg-[#f5f5f5] cursor-pointer">
        <div className="flex items-center p-2">
          <div className="bg-[#ebf7f5] rounded-full p-1.5 mr-3">
            <Play className="h-4 w-4 text-[#26C6B9]" />
          </div>
          <div>
            <div className="text-sm font-medium">Início do fluxo</div>
            <div className="text-xs text-gray-500">Esse é o início do fluxo, ele pode ser iniciado diretamente pelo botão correspondente.</div>
          </div>
        </div>
      </div>
      
      {/* Botão de condições */}
      <div className="mt-4 mb-2 mx-2">
        <button className="w-full bg-[#26C6B9] hover:bg-opacity-90 text-white py-2 px-4 rounded-md text-sm font-medium">
          Condições
        </button>
      </div>
      
      {/* Modelo de funcionamento */}
      <div className="p-2 mx-2 rounded-md hover:bg-[#f5f5f5] cursor-pointer">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center">
            <div className="font-medium text-sm">Modelo de funcionamento</div>
          </div>
          <div className="bg-gray-100 rounded-md p-1">
            <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 5L21 12M21 12L14 19M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="text-xs text-gray-500 px-2 pb-2">
          Defina como o fluxo será iniciado
        </div>
      </div>
      
      {/* Gatilho */}
      <div className="p-2 mx-2 rounded-md hover:bg-[#f5f5f5] cursor-pointer">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center">
            <div className="font-medium text-sm">Gatilho</div>
          </div>
          <div className="bg-gray-100 rounded-md p-1">
            <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 5L21 12M21 12L14 19M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="text-xs text-gray-500 px-2 pb-2">
          Defina palavras-gatilho configuradas
        </div>
      </div>
      
      <div className="border-t my-3"></div>
      
      {/* Transportar contato */}
      <div className="p-2 mx-2 rounded-md hover:bg-[#f5f5f5] cursor-pointer">
        <div className="flex items-center p-2">
          <div className="bg-[#eee6fa] rounded-full p-1.5 mr-3">
            <User className="h-4 w-4 text-[#8A58DC]" />
          </div>
          <div>
            <div className="text-sm font-medium">Transportar contato</div>
            <div className="text-xs text-gray-500">Quando a condição preenchida for direcionada pelo contato, ele será automaticamente direcionado para o bloco do fluxo selecionado.</div>
          </div>
        </div>
      </div>
      
      {/* Botão de condições (roxo) */}
      <div className="mt-4 mb-2 mx-2">
        <button className="w-full bg-[#8A58DC] hover:bg-opacity-90 text-white py-2 px-4 rounded-md text-sm font-medium">
          Condições
        </button>
      </div>
      
      <div className="border-t my-3"></div>
      
      {/* Interromper contato */}
      <div className="p-2 mx-2 rounded-md hover:bg-[#f5f5f5] cursor-pointer">
        <div className="flex items-center p-2">
          <div className="bg-[#feeae9] rounded-full p-1.5 mr-3">
            <svg className="h-4 w-4 text-[#F15249]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium">Interromper contato</div>
            <div className="text-xs text-gray-500">Quando a condição preenchida for direcionada pelo contato o fluxo será interrompido.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowSidebar;