import React from 'react';
import { Music, Upload, Mic, Send } from 'lucide-react';
import BaseFlowNode from './BaseFlowNode';

function AudioNode({ id, data, selected, isConnectable }) {
  return (
    <BaseFlowNode
      id={id}
      data={data}
      selected={selected}
      icon={<Music size={20} className="text-white" />}
      title="Enviar áudio"
      subtitle="Áudio"
      color="#C77DFF" // Roxo mais claro
    >
      {/* Área de upload */}
      <div className="mb-4">
        <div className="text-gray-400 italic mb-2">Carregar áudio</div>
        <div className="bg-gray-50 rounded-md p-6 border border-gray-200 flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-[#C77DFF]/10 mb-3">
            <Upload size={24} className="text-[#C77DFF]" />
          </div>
          <p className="text-center text-gray-500 text-sm mb-1">Carregar áudio do computador</p>
          <p className="text-center text-gray-400 text-xs mb-3">60 mb</p>
          <button className="bg-[#C77DFF] text-white px-4 py-2 rounded-md text-sm font-medium">
            Carregar
          </button>
          <p className="text-center text-gray-400 text-xs mt-3">ou arraste e solte</p>
        </div>
      </div>
      
      {/* Opção de gravação */}
      <div className="mb-4">
        <button className="flex items-center text-[#C77DFF] mb-3">
          <Mic size={18} className="mr-2" />
          <span className="text-sm font-medium">Grave o áudio ao vivo</span>
        </button>
      </div>
      
      {/* Campo de entrada para mencionar campos */}
      <div className="mb-4">
        <div className="flex items-center border border-gray-200 rounded-md">
          <input 
            type="text" 
            placeholder="Digite @ p/ utilizar os campos" 
            className="flex-1 p-2 text-sm border-none focus:outline-none"
          />
          <button className="p-2 text-gray-400 hover:text-[#C77DFF]">
            <Send size={18} />
          </button>
        </div>
      </div>
    </BaseFlowNode>
  );
}

export default AudioNode;