import React from 'react';
import { MessageSquare, Image, Clock, MessageCircleQuestion } from 'lucide-react';

const NewCanvasDemoWrapper = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Novo Design do Flow Builder</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Mensagem de Texto</h2>
          <div className="p-4 border-b border-gray-100 flex items-center space-x-3" style={{ backgroundColor: '#26C6B910' }}>
            <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#26C6B9' }}>
              <div className="text-white">
                <MessageSquare className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">Enviar mensagem</h3>
              <p className="text-xs text-gray-500 truncate">Texto</p>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <textarea
                value="Olá! Este é um exemplo de mensagem de texto com o novo design."
                readOnly
                className="w-full min-h-[120px] p-4 text-sm bg-gray-50 border-0 rounded-lg outline-none resize-none"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Mídia</h2>
          <div className="p-4 border-b border-gray-100 flex items-center space-x-3" style={{ backgroundColor: '#4C6EF510' }}>
            <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4C6EF5' }}>
              <div className="text-white">
                <Image className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">Enviar mídia</h3>
              <p className="text-xs text-gray-500 truncate">Imagem/Vídeo</p>
            </div>
          </div>
          <div className="p-4">
            <div className="relative rounded-lg overflow-hidden border border-gray-200 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1675587765778-7f1db9112c8d?w=600&auto=format&fit=crop" 
                alt="Imagem de exemplo" 
                className="w-full h-auto max-h-[200px] object-cover bg-gray-100"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Aguardar Resposta</h2>
          <div className="p-4 border-b border-gray-100 flex items-center space-x-3" style={{ backgroundColor: '#FD7E1410' }}>
            <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FD7E14' }}>
              <div className="text-white">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">Aguardar resposta</h3>
              <p className="text-xs text-gray-500 truncate">Interação com usuário</p>
            </div>
          </div>
          <div className="p-4">
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
        
        <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Botões</h2>
          <div className="p-4 border-b border-gray-100 flex items-center space-x-3" style={{ backgroundColor: '#F59F0A10' }}>
            <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F59F0A' }}>
              <div className="text-white">
                <MessageCircleQuestion className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">Enviar botões</h3>
              <p className="text-xs text-gray-500 truncate">Interação rápida</p>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
              <textarea
                value="Escolha uma opção:"
                readOnly
                className="w-full rounded-lg p-3 min-h-[80px] bg-gray-50 border-0 text-gray-800 outline-none resize-none"
              />
            </div>
            <div className="mb-4">
              <div className="space-y-2">
                <button className="block w-full text-center p-2 bg-gray-50 border border-gray-200 rounded-md">Opção 1</button>
                <button className="block w-full text-center p-2 bg-gray-50 border border-gray-200 rounded-md">Opção 2</button>
                <button className="block w-full text-center p-2 bg-gray-50 border border-gray-200 rounded-md">Opção 3</button>
              </div>
            </div>
          </div>
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

export default NewCanvasDemoWrapper;