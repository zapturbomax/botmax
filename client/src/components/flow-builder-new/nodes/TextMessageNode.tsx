import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { MessageCircle, MoreHorizontal, Pencil } from 'lucide-react';

interface TextMessageNodeProps {
  id: string;
  data: {
    text?: string;
  };
  selected?: boolean;
}

/**
 * Nó de mensagem de texto seguindo o design do Dispara.ai
 */
const TextMessageNode = ({ id, data, selected }: TextMessageNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.text || 'Enviar mensagem');

  const handleSave = () => {
    // Aqui atualizaríamos os dados do nó no estado global
    setIsEditing(false);
  };

  return (
    <div 
      className={`group relative flex flex-col rounded-lg bg-white border-2 shadow-sm w-[260px] ${
        selected ? 'border-[#26C6B9]' : 'border-[#e0e0e0]'
      }`}
    >
      {/* Cabeçalho do nó */}
      <div className="flex items-center justify-between p-3 bg-[#26C6B9] rounded-t-md">
        <div className="flex items-center">
          <div className="bg-white rounded-full p-1 mr-2">
            <MessageCircle className="h-3 w-3 text-[#26C6B9]" />
          </div>
          <span className="text-white text-sm font-medium">Enviar mensagem</span>
        </div>
        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-4 w-4 cursor-pointer" />
        </div>
      </div>
      
      {/* Corpo do nó */}
      <div className="p-3">
        <div className="flex items-center justify-between text-sm text-gray-700 mb-1">
          <span>Texto</span>
          <Pencil 
            className="h-3 w-3 cursor-pointer text-gray-500 hover:text-[#26C6B9]" 
            onClick={() => setIsEditing(true)}
          />
        </div>
        
        {isEditing ? (
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm min-h-[80px]"
              placeholder="Digite sua mensagem aqui..."
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button 
                className="px-2 py-1 text-xs bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </button>
              <button 
                className="px-2 py-1 text-xs bg-[#26C6B9] text-white rounded-md hover:bg-opacity-90"
                onClick={handleSave}
              >
                Salvar
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="bg-gray-50 p-2 rounded-md text-xs border border-gray-100 min-h-[40px] cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {text || 'Clique para adicionar texto'}
          </div>
        )}
      </div>

      {/* Checkbox para opções adicionais */}
      <div className="px-3 pb-3">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id={`parse-emoji-${id}`} className="h-3 w-3" />
          <label htmlFor={`parse-emoji-${id}`} className="text-xs text-gray-600">
            Ativar emojis
          </label>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <input type="checkbox" id={`parse-variables-${id}`} className="h-3 w-3" />
          <label htmlFor={`parse-variables-${id}`} className="text-xs text-gray-600">
            Utilizar variáveis
          </label>
        </div>
      </div>
      
      {/* Indicador de próximo passo */}
      <div className="p-2 pb-3 flex justify-end">
        <span className="text-xs text-gray-400 flex items-center">
          Próximo passo 
          <svg className="h-3 w-3 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
      
      {/* Contador de mensagens no canto superior */}
      <div className="absolute -top-3 -right-3 flex">
        <div className="bg-[#26C6B9] text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
          0
        </div>
        <div className="bg-[#26C6B9] text-white text-xs rounded-full h-6 w-6 flex items-center justify-center ml-1">
          0
        </div>
      </div>
      
      {/* Conectores */}
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        className="w-3 h-3 bg-[#26C6B9] border-2 border-white"
        style={{ top: '-6px' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        className="w-3 h-3 bg-[#26C6B9] border-2 border-white"
        style={{ bottom: '-6px' }}
      />
    </div>
  );
};

export default TextMessageNode;