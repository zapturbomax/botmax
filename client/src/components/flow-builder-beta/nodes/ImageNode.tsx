import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Image, Upload, Info, Send, ChevronRight } from 'lucide-react';

interface ImageNodeProps {
  id: string;
  data: {
    imageUrl?: string;
    onChange?: (id: string, data: any) => void;
  };
  selected: boolean;
}

/**
 * Nó de imagem/mídia
 * Permite enviar uma imagem para o usuário
 */
const ImageNode: React.FC<ImageNodeProps> = ({ id, data, selected }) => {
  const [imageUrl, setImageUrl] = useState(data.imageUrl || '');
  const [typingSeconds, setTypingSeconds] = useState(0);
  const [isForwarded, setIsForwarded] = useState(false);
  
  // Manipulador para atualizar a imagem
  const handleImageChange = (url: string) => {
    setImageUrl(url);
    
    if (data.onChange) {
      data.onChange(id, { imageUrl: url });
    }
  };
  
  // Manipulador para o checkbox de encaminhamento
  const handleForwardedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsForwarded(e.target.checked);
  };
  
  // Manipulador para atualizar os segundos de digitação
  const handleTypingSecondsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypingSeconds(parseInt(e.target.value, 10));
  };

  return (
    <div className={`relative ${selected ? 'z-10' : ''}`} style={{ width: 380 }}>
      {/* Barra superior com ações */}
      <div className="absolute top-0 left-0 right-0 bg-[#3A4049] text-white rounded-t-xl py-2 px-4 flex justify-center gap-8 z-10">
        <button 
          className="flex items-center justify-center hover:text-gray-200"
          title="Duplicar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="8" width="12" height="12" rx="2" ry="2"></rect>
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>
            <path d="M12 12v6"></path>
            <path d="M15 15h-6"></path>
          </svg>
        </button>
        <button 
          className="flex items-center justify-center hover:text-gray-200"
          title="Remover"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>
      
      {/* Conector de entrada */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ 
          left: -6, 
          top: '50%', 
          width: 12, 
          height: 12, 
          background: 'white', 
          border: '2px solid #CBD5E0',
          zIndex: 20 
        }}
      />
      
      <div className="relative mt-10 rounded-xl shadow-md border border-[#E2E8F0] bg-white overflow-hidden">
        {/* Cabeçalho com contadores */}
        <div className="bg-[#B44BF2] text-white py-3 px-4 flex justify-between">
          <div className="flex items-center">
            <span className="text-sm font-normal">Executando</span>
            <Info size={16} className="ml-1 cursor-help" />
          </div>
          <div className="flex items-center">
            <span className="text-sm font-normal">Enviados</span>
            <Info size={16} className="ml-1 cursor-help" />
          </div>
        </div>
        
        {/* Seção de título */}
        <div className="p-4 flex items-center">
          <div className="bg-[#B44BF2] p-3 rounded-full mr-3 flex items-center justify-center">
            <Image size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-[#4A5568] text-lg font-medium">Enviar imagem</h3>
            <p className="text-[#B44BF2] text-sm">Mídia</p>
          </div>
        </div>
        
        {/* Área de conteúdo */}
        <div className="p-4">
          {/* Área de upload */}
          <div className="mb-4">
            <div className="text-gray-400 italic mb-2">Carregar imagem</div>
            <div className="bg-gray-50 rounded-md p-6 border border-gray-200 flex flex-col items-center justify-center">
              <div className="p-3 rounded-full bg-[#B44BF2]/10 mb-3">
                <Upload size={24} className="text-[#B44BF2]" />
              </div>
              <p className="text-center text-gray-500 text-sm mb-1">Carregar imagem do computador</p>
              <p className="text-center text-gray-400 text-xs mb-3">60 mb</p>
              <button className="bg-[#B44BF2] text-white px-4 py-2 rounded-md text-sm font-medium">
                Carregar
              </button>
              <p className="text-center text-gray-400 text-xs mt-3">ou arraste e solte</p>
            </div>
          </div>
          
          {/* Campo de entrada para mencionar campos */}
          <div className="mb-4">
            <div className="flex items-center border border-gray-200 rounded-full px-3 py-2">
              <input 
                type="text" 
                placeholder="Digite @ p/ utilizar os campos" 
                className="flex-1 px-3 py-1 text-sm border-none focus:outline-none"
              />
              <button className="text-[#B44BF2] hover:text-[#A33BD1]">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Rodapé */}
        <div className="px-4 py-3 border-t border-[#F0F4F8] flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-4">
              <label className="flex items-center text-sm text-gray-600">
                <input 
                  type="checkbox"
                  checked={isForwarded}
                  onChange={handleForwardedChange}
                  className="mr-2 h-4 w-4"
                />
                Marcar como encaminhada
              </label>
            </div>
            
            <div className="flex items-center">
              <div className="mr-2 flex items-center justify-center p-1 border border-[#E2E8F0] rounded">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-[#B44BF2] rounded-full"></div>
                  <div className="w-1 h-1 bg-[#B44BF2] rounded-full"></div>
                  <div className="w-1 h-1 bg-[#B44BF2] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-xs">Status digitando</div>
                <div className="flex items-center">
                  <select
                    value={typingSeconds}
                    onChange={handleTypingSecondsChange}
                    className="text-sm text-[#4A5568] font-medium bg-transparent border-none focus:outline-none appearance-none"
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <span className="ml-1 text-gray-500 text-xs">segundos</span>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            className="text-[#B44BF2] font-medium flex items-center"
          >
            Próximo passo
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
      
      {/* Conector de saída */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ 
          right: -6, 
          top: '50%', 
          width: 12, 
          height: 12, 
          background: 'white', 
          border: '2px solid #CBD5E0',
          zIndex: 20 
        }}
      />
    </div>
  );
};

export default ImageNode;