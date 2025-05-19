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
    <div className="relative node-container" style={{ width: 320 }}>
      {/* Barra superior com ações exatamente como na imagem de referência */}
      <div className="absolute top-0 left-0 right-0 bg-[#3A4049] text-white rounded-t-lg py-3.5 px-6 flex justify-between z-10">
        <div className="w-24"></div> {/* Espaçador para centralizar os botões */}
        <div className="flex justify-center space-x-20">
          <button 
            className="flex items-center gap-2 text-base font-medium hover:text-gray-200"
            onClick={handleDuplicate}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Duplicar
          </button>
          <button 
            className="flex items-center gap-2 text-base font-medium hover:text-gray-200"
            onClick={handleDelete}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Remover
          </button>
        </div>
        <div className="w-24"></div> {/* Espaçador para centralizar os botões */}
      </div>
      
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
      <div className="relative mt-[48px] rounded-xl shadow-md bg-white overflow-hidden">
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