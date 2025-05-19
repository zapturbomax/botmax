import React, { useState } from 'react';
import { MessageSquare, Info, Send, Copy, Trash2, HelpCircle, ChevronDown, Smile } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

export default function NodePrototype() {
  const [messageText, setMessageText] = useState('');
  const [typingSeconds, setTypingSeconds] = useState(0);
  const [isForwarded, setIsForwarded] = useState(false);
  
  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-10">
        <div className="relative" style={{ width: 320 }}>
          {/* Barra de botões superior */}
          <div className="absolute top-0 left-0 right-0 bg-[#3A4049] text-white rounded-t-xl py-2 px-4 flex justify-end gap-4 z-10">
            <button className="flex items-center gap-1 text-sm font-medium hover:text-gray-200">
              <Copy size={16} />
              Duplicar
            </button>
            <button className="flex items-center gap-1 text-sm font-medium hover:text-gray-200">
              <Trash2 size={16} />
              Remover
            </button>
          </div>
          
          {/* Simulação do conector de entrada */}
          <div 
            className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#E2E8F0] z-10"
          ></div>
          
          <div className="mt-10 rounded-xl shadow-md border border-[#E2E8F0] bg-white overflow-hidden">
            {/* Cabeçalho com contadores */}
            <div className="bg-[#26C6B9] text-white p-4 flex justify-center">
              <div className="flex-1 flex flex-col items-center">
                <div className="text-4xl font-bold">0</div>
                <div className="flex items-center text-sm">
                  Executando
                  <Info size={14} className="ml-1 cursor-help" />
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="text-4xl font-bold">0</div>
                <div className="flex items-center text-sm">
                  Enviados
                  <Info size={14} className="ml-1 cursor-help" />
                </div>
              </div>
            </div>
            
            {/* Conteúdo principal */}
            <div className="p-4">
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
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Digite sua mensagem abaixo"
                    className="w-full min-h-[60px] p-1 text-sm bg-transparent border-none resize-none focus:outline-none"
                  />
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
                  id="forwarded"
                  checked={isForwarded}
                  onChange={(e) => setIsForwarded(e.target.checked)}
                  className="w-4 h-4 mr-2 rounded border-gray-300"
                />
                <label htmlFor="forwarded" className="text-gray-500 text-sm">
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
                      <select
                        value={typingSeconds}
                        onChange={(e) => setTypingSeconds(Number(e.target.value))}
                        className="mr-1 text-[#4A5568] font-medium bg-transparent border-none focus:outline-none appearance-none"
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                      <ChevronDown size={14} className="text-[#4A5568] -ml-1" />
                      <span className="ml-1 text-gray-500 text-sm">segundos</span>
                    </div>
                  </div>
                </div>
                
                {/* Botão próximo passo */}
                <button className="text-[#4A5568] font-medium flex items-center">
                  Próximo passo
                </button>
              </div>
            </div>
          </div>
          
          {/* Simulação do conector de saída */}
          <div 
            className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#E2E8F0] z-10"
          ></div>
        </div>
      </div>
    </AppLayout>
  );
}