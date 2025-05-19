import React from 'react';
import { MessageSquare, Image, Clock, MessageCircleQuestion } from 'lucide-react';

const NewCanvasDemoWrapper = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Novo Design do Flow Builder</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mensagem de Texto - Estilo Dispara.ai */}
        <div className="relative">
          <div className="absolute -top-10 right-0 bg-[#303342] text-white rounded-lg py-1 px-4 flex space-x-4">
            <button className="flex items-center space-x-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Duplicar</span>
            </button>
            <button className="flex items-center space-x-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Remover</span>
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Header com contadores */}
            <div className="bg-[#4DE1C1] text-white py-3 px-5 flex justify-around">
              <div className="text-center">
                <div className="text-4xl font-semibold">0</div>
                <div className="text-sm flex items-center">
                  Executando
                  <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V12M12 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-semibold">0</div>
                <div className="text-sm flex items-center">
                  Enviados
                  <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V12M12 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Conteúdo do nó */}
            <div className="p-4">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#4DE1C1] rounded-full mr-4 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#303342] text-xl font-semibold">Enviar mensagem</h3>
                  <p className="text-gray-500">Texto</p>
                </div>
                <div className="ml-auto">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="#999" strokeWidth="2"/>
                      <path d="M12 8V12M12 16V16.01" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Mensagem chatbubble style */}
              <div className="bg-[#e7faf5] p-4 rounded-lg mb-4 relative">
                <p className="text-gray-800">Olá! Este é um exemplo de mensagem de texto com o novo design.</p>
                <div className="absolute right-2 bottom-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#4DE1C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              {/* Campo de edição */}
              <div className="border border-gray-200 p-3 rounded-lg flex justify-between items-center mb-4">
                <span className="text-gray-700">Editar</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              {/* Opção final */}
              <div className="flex items-center mt-6">
                <input type="checkbox" className="mr-2 h-5 w-5 rounded border-gray-300" />
                <label className="text-gray-700">Marcar como encaminhada</label>
              </div>
              
              {/* Status e Próximo Passo */}
              <div className="flex justify-between items-center mt-6 border-t border-gray-100 pt-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg border border-[#4DE1C1] flex items-center justify-center mr-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="5" cy="12" r="1" fill="#4DE1C1"/>
                      <circle cx="12" cy="12" r="1" fill="#4DE1C1"/>
                      <circle cx="19" cy="12" r="1" fill="#4DE1C1"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Status digitando</p>
                    <p className="flex items-center">
                      <span className="font-semibold mr-1">0</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 9L12 16L5 9" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-gray-500 ml-1">segundos</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="text-gray-700 mr-2">Próximo passo</p>
                  <div className="w-8 h-8 rounded-full bg-[#4DE1C1] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mídia - Estilo Dispara.ai */}
        <div className="relative">
          <div className="absolute -top-10 right-0 bg-[#303342] text-white rounded-lg py-1 px-4 flex space-x-4">
            <button className="flex items-center space-x-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Duplicar</span>
            </button>
            <button className="flex items-center space-x-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Remover</span>
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Header com contadores */}
            <div className="bg-[#4C6EF5] text-white py-3 px-5 flex justify-around">
              <div className="text-center">
                <div className="text-4xl font-semibold">0</div>
                <div className="text-sm flex items-center">
                  Executando
                  <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V12M12 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-semibold">0</div>
                <div className="text-sm flex items-center">
                  Enviados
                  <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V12M12 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Conteúdo do nó */}
            <div className="p-4">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#4C6EF5] rounded-full mr-4 flex items-center justify-center">
                  <Image className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#303342] text-xl font-semibold">Enviar mídia</h3>
                  <p className="text-gray-500">Imagem/Vídeo</p>
                </div>
                <div className="ml-auto">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="#999" strokeWidth="2"/>
                      <path d="M12 8V12M12 16V16.01" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Imagem */}
              <div className="rounded-lg overflow-hidden border border-gray-200 mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1675587765778-7f1db9112c8d?w=600&auto=format&fit=crop" 
                  alt="Imagem de exemplo" 
                  className="w-full h-auto max-h-[200px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Aguardar Resposta - Estilo Dispara.ai */}
        <div className="relative">
          <div className="absolute -top-10 right-0 bg-[#303342] text-white rounded-lg py-1 px-4 flex space-x-4">
            <button className="flex items-center space-x-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Duplicar</span>
            </button>
            <button className="flex items-center space-x-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Remover</span>
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Header com contadores */}
            <div className="bg-[#FD7E14] text-white py-3 px-5 flex justify-around">
              <div className="text-center">
                <div className="text-4xl font-semibold">0</div>
                <div className="text-sm flex items-center">
                  Executando
                  <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V12M12 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-semibold">0</div>
                <div className="text-sm flex items-center">
                  Enviados
                  <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V12M12 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Conteúdo do nó */}
            <div className="p-4">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#FD7E14] rounded-full mr-4 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#303342] text-xl font-semibold">Aguardar resposta</h3>
                  <p className="text-gray-500">Interação com usuário</p>
                </div>
                <div className="ml-auto">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="#999" strokeWidth="2"/>
                      <path d="M12 8V12M12 16V16.01" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              
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
            </div>
          </div>
        </div>
      
        {/* Botões - Estilo Dispara.ai */}
        <div className="relative">
          <div className="absolute -top-10 right-0 bg-[#303342] text-white rounded-lg py-1 px-4 flex space-x-4">
            <button className="flex items-center space-x-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Duplicar</span>
            </button>
            <button className="flex items-center space-x-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Remover</span>
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Header com contadores */}
            <div className="bg-[#F59F0A] text-white py-3 px-5 flex justify-around">
              <div className="text-center">
                <div className="text-4xl font-semibold">0</div>
                <div className="text-sm flex items-center">
                  Executando
                  <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V12M12 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-semibold">0</div>
                <div className="text-sm flex items-center">
                  Enviados
                  <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V12M12 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Conteúdo do nó */}
            <div className="p-4">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#F59F0A] rounded-full mr-4 flex items-center justify-center">
                  <MessageCircleQuestion className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#303342] text-xl font-semibold">Enviar botões</h3>
                  <p className="text-gray-500">Interação rápida</p>
                </div>
                <div className="ml-auto">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="#999" strokeWidth="2"/>
                      <path d="M12 8V12M12 16V16.01" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#fff8ea] p-4 rounded-lg mb-4">
                <p className="text-gray-800">Escolha uma opção:</p>
              </div>
              
              <div className="mb-4">
                <div className="space-y-2">
                  <button className="block w-full text-center p-2 bg-white border border-[#F59F0A] text-[#F59F0A] rounded-md hover:bg-[#F59F0A] hover:text-white transition-colors">Opção 1</button>
                  <button className="block w-full text-center p-2 bg-white border border-[#F59F0A] text-[#F59F0A] rounded-md hover:bg-[#F59F0A] hover:text-white transition-colors">Opção 2</button>
                  <button className="block w-full text-center p-2 bg-white border border-[#F59F0A] text-[#F59F0A] rounded-md hover:bg-[#F59F0A] hover:text-white transition-colors">Opção 3</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Sobre o Novo Design</h2>
        <p className="mb-4">
          O novo design do Flow Builder foi criado inspirado no estilo moderno usado pelo dispara.ai, com diversas melhorias visuais:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Design elegante com cabeçalho colorido destacando contadores de execução e envio</li>
          <li>Botões de ação (duplicar/remover) facilmente acessíveis no topo dos nós</li>
          <li>Cores específicas para cada tipo de nó, facilitando a identificação visual</li>
          <li>Ícones grandes e claros para melhor comunicação visual</li>
          <li>Interface minimalista com campos específicos para cada tipo de nó</li>
          <li>Elementos de status e controle na parte inferior dos nós</li>
          <li>Paleta de cores consistente para criar uma linguagem visual unificada</li>
        </ul>
      </div>
    </div>
  );
};

export default NewCanvasDemoWrapper;