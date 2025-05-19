import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

/**
 * Componente base para todos os nós do flow builder com o design do dispara.ai
 * Implementation exata como na imagem de referência
 */
function BaseNodeV2({ 
  id, 
  data, 
  selected, 
  icon, 
  title, 
  subtitle, 
  color, 
  children, 
  outputs = 1
}) {
  // Estados e manipuladores
  const [isForwarded, setIsForwarded] = useState(data.isForwarded || false);
  
  // Handles para duplicação e remoção do nó
  const handleDuplicate = () => {
    if (data.onDuplicate) {
      data.onDuplicate(id);
    } else if (window.duplicateNode) {
      window.duplicateNode(id);
    }
  };
  
  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    } else if (window.deleteNode) {
      window.deleteNode(id);
    }
  };
  
  // Handler para checkbox
  const handleForwardedChange = (e) => {
    const checked = e.target.checked;
    setIsForwarded(checked);
    if (data.onChange) {
      data.onChange(id, { isForwarded: checked });
    }
  };
  
  return (
    <div className="relative node-container" style={{ width: 380 }}>
      {/* Conector de entrada (lado esquerdo) */}
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
      
      {/* Conteúdo do nó */}
      <div className="relative rounded-xl shadow-md bg-white overflow-hidden">
        {/* Cabeçalho com contadores exatamente como na imagem */}
        <div style={{ backgroundColor: color }} className="text-white py-5 flex justify-between">
          <div className="flex-1 flex flex-col items-center">
            <div className="text-6xl font-medium leading-none">0</div>
            <div className="flex items-center text-sm mt-2">
              <span>Executando</span>
              <svg className="ml-1 cursor-help" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
                <circle cx="12" cy="8" r="1.5" fill="white"/>
                <line x1="12" y1="11" x2="12" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="text-6xl font-medium leading-none">0</div>
            <div className="flex items-center text-sm mt-2">
              <span>Enviados</span>
              <svg className="ml-1 cursor-help" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
                <circle cx="12" cy="8" r="1.5" fill="white"/>
                <line x1="12" y1="11" x2="12" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Seção de título com ícone exatamente como na imagem */}
        <div className="py-4 px-5 flex items-center">
          <div style={{ backgroundColor: color }} className="h-16 w-16 rounded-full flex items-center justify-center">
            <div className="text-white">
              {icon}
            </div>
          </div>
          <div className="flex-1 ml-4">
            <h3 className="text-[#4A5568] text-xl font-medium">{title}</h3>
            <p style={{ color }} className="text-base mt-1">{subtitle}</p>
          </div>
          <div>
            <div className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.09 9.00002C9.3251 8.33169 9.78915 7.76813 10.4 7.40915C11.0108 7.05018 11.7289 6.91896 12.4272 7.03873C13.1255 7.15851 13.7588 7.52154 14.2151 8.06354C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17H12.01" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Área de conteúdo principal */}
        <div className="px-5 pb-1">
          {children}
        </div>
        
        {/* Rodapé com checkbox e próximo passo exatamente como na imagem */}
        <div className="px-5 py-4 flex justify-between items-center border-t border-gray-100">
          <div className="flex items-center">
            <input 
              type="checkbox"
              checked={isForwarded}
              onChange={handleForwardedChange}
              className="mr-2 h-4 w-4"
            />
            <span className="text-gray-600 text-sm">Marcar como encaminhada</span>
          </div>
          
          <div className="flex items-center">
            <span className="text-[#26C6B9] font-medium mr-1">Próximo passo</span>
            <div className="flex items-center justify-center w-7 h-7 rounded-full border border-[#26C6B9]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#26C6B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conector(es) de saída (lado direito) */}
      {outputs === 1 ? (
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
      ) : (
        Array.from({ length: outputs }).map((_, index) => (
          <Handle
            key={`output-${index}`}
            type="source"
            id={`output-${index}`}
            position={Position.Right}
            style={{ 
              right: -6, 
              top: `${30 + (index * 40 / (outputs - 1))}%`, 
              width: 12, 
              height: 12, 
              background: 'white', 
              border: '2px solid #CBD5E0',
              zIndex: 20 
            }}
          />
        ))
      )}
    </div>
  );
}

export default BaseNodeV2;