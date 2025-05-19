import React from 'react';
import { Image, Upload, Send } from 'lucide-react';
import BaseFlowNode from './BaseFlowNode';

function ImageNode({ id, data, selected, isConnectable }) {
  return (
    <BaseFlowNode
      id={id}
      data={data}
      selected={selected}
      icon={<Image size={20} className="text-white" />}
      title="Enviar imagem"
      subtitle="Mídia"
      color="#B44BF2" // Roxo
    >
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
        <div className="flex items-center border border-gray-200 rounded-md">
          <input 
            type="text" 
            placeholder="Digite @ p/ utilizar os campos" 
            className="flex-1 p-2 text-sm border-none focus:outline-none"
          />
          <button className="p-2 text-gray-400 hover:text-[#B44BF2]">
            <Send size={18} />
          </button>
        </div>
      </div>
    </BaseFlowNode>
  );
}

export default ImageNode;