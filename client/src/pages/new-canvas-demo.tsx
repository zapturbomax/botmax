import React, { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import FlowNode from '@/components/flow-builder/canvas/FlowNode';
import { MessageSquare, Image, Clock, MessageCircleQuestion } from 'lucide-react';

const NewCanvasDemo = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Novo Design do Flow Builder</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Mensagem de Texto</h2>
          <ReactFlowProvider>
            <FlowNode 
              id="demo-text-1"
              data={{ text: "Olá! Este é um exemplo de mensagem de texto com o novo design." }}
              selected={false}
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
                  value="Olá! Este é um exemplo de mensagem de texto com o novo design."
                  readOnly
                  className="w-full min-h-[120px] p-4 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none resize-none"
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
                    readOnly
                  />
                  <button className="px-4 text-gray-400 hover:text-[#26C6B9]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 2L11 13" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </FlowNode>
          </ReactFlowProvider>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Mídia</h2>
          <ReactFlowProvider>
            <FlowNode 
              id="demo-media-1"
              data={{ mediaUrl: "https://images.unsplash.com/photo-1675587765778-7f1db9112c8d" }}
              selected={false}
              icon={<Image className="h-6 w-6" />}
              title="Enviar mídia"
              subtitle="Imagem/Vídeo"
              color="#4C6EF5"
            >
              <div className="mb-4">
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1675587765778-7f1db9112c8d?w=600&auto=format&fit=crop" 
                    alt="Imagem de exemplo" 
                    className="w-full h-auto max-h-[200px] object-cover bg-gray-100"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Legenda (opcional)</label>
                <textarea
                  value="Esta é uma imagem de exemplo para o novo design do Flow Builder."
                  readOnly
                  className="w-full rounded-lg p-3 h-20 bg-gray-50 border-0 text-gray-800 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                />
              </div>
            </FlowNode>
          </ReactFlowProvider>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Aguardar Resposta</h2>
          <ReactFlowProvider>
            <FlowNode 
              id="demo-wait-1"
              data={{ timeout: 60 }}
              selected={false}
              icon={<Clock className="h-6 w-6" />}
              title="Aguardar resposta"
              subtitle="Interação com usuário"
              color="#FD7E14"
              outputs={2}
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tempo limite (segundos)</label>
                  <input
                    type="number"
                    value={60}
                    readOnly
                    className="w-full p-2 rounded-md border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da variável</label>
                  <input
                    value="resposta"
                    readOnly
                    className="w-full p-2 rounded-md border border-gray-200"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem de tempo esgotado</label>
                <textarea
                  value="Não recebemos sua resposta a tempo. Por favor, tente novamente."
                  readOnly
                  className="w-full rounded-lg p-3 min-h-[80px] bg-gray-50 border-0 text-gray-800 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                />
              </div>
              
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Fluxo</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">1</div>
                    <span>Resposta recebida → Continua o fluxo</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-red-100 text-red-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">2</div>
                    <span>Tempo esgotado (60s) → Envia mensagem e finaliza</span>
                  </div>
                </div>
              </div>
            </FlowNode>
          </ReactFlowProvider>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Condição</h2>
          <ReactFlowProvider>
            <FlowNode 
              id="demo-condition-1"
              data={{ condition: "{{idade}} >= 18" }}
              selected={false}
              icon={<MessageCircleQuestion className="h-6 w-6" />}
              title="Condição"
              subtitle="Bifurcação baseada em condições"
              color="#FA5252"
              outputs={2}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expressão condicional</label>
                  <input
                    value="{{idade}} >= 18"
                    readOnly
                    className="w-full p-2 rounded-md border border-gray-200"
                  />
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Fluxo</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">1</div>
                      <span>Se verdadeiro → Primeira saída</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-red-100 text-red-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs">2</div>
                      <span>Se falso → Segunda saída</span>
                    </div>
                  </div>
                </div>
              </div>
            </FlowNode>
          </ReactFlowProvider>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Sobre o Novo Design</h2>
        <p className="mb-4">
          O novo design do Flow Builder foi criado com foco em UX e UI moderno, seguindo as melhores práticas do mercado. Principais características:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Design elegante e consistente para todos os tipos de nós</li>
          <li>Layout intuitivo com contadores de execução e envio bem visíveis</li>
          <li>Cores específicas para cada tipo de nó, facilitando a identificação visual</li>
          <li>Interface de edição direta nos nós, sem necessidade de painéis adicionais</li>
          <li>Componentes responsivos e adaptáveis a diferentes tamanhos de tela</li>
          <li>Animações sutis para melhorar a experiência do usuário</li>
        </ul>
      </div>
    </div>
  );
};

export default NewCanvasDemo;