import React from 'react';
import { Handle, Position } from 'reactflow';
import { Copy, Trash2, Info, ChevronRight } from 'lucide-react';

/**
 * Componente base para todos os nós do flow builder com o novo design
 */
function BaseFlowNode({ 
  id, 
  data, 
  selected, 
  icon, 
  title, 
  subtitle, 
  color, 
  children, 
  outputs = 1, 
  hideStatusDigitando = false,
  hideEncaminhada = false
}) {
  // Manipuladores de eventos
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

  // Estados
  const executionCount = data.executionCount || 0;
  const sentCount = data.sentCount || 0;
  const [typingSeconds, setTypingSeconds] = React.useState(data.typingSeconds || 0);
  const [isForwarded, setIsForwarded] = React.useState(data.isForwarded || false);
  
  // Manipulador para atualizar os segundos de digitação
  const handleTypingSecondsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setTypingSeconds(value);
    if (data.onChange) {
      data.onChange(id, { typingSeconds: value });
    }
  };
  
  // Manipulador para o checkbox de encaminhamento
  const handleForwardedChange = (e) => {
    const checked = e.target.checked;
    setIsForwarded(checked);
    if (data.onChange) {
      data.onChange(id, { isForwarded: checked });
    }
  };
  
  return (
    <div className="relative" style={{ width: 380 }}>
      {/* Barra superior com ações - alinhadas à direita */}
      <div className="absolute top-0 left-0 right-0 bg-[#3A4049] text-white rounded-t-xl py-3 px-6 flex justify-end gap-8 z-10">
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
        <div style={{ backgroundColor: color }} className="text-white py-4 px-6 flex justify-between">
          <div className="flex flex-col items-center">
            <div className="text-5xl font-medium">0</div>
            <div className="flex items-center text-sm mt-1">
              Executando
              <svg className="ml-1 cursor-help" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
                <path d="M12 17V11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="8" r="1" fill="white"/>
              </svg>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-5xl font-medium">0</div>
            <div className="flex items-center text-sm mt-1">
              Enviados
              <svg className="ml-1 cursor-help" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
                <path d="M12 17V11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="8" r="1" fill="white"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Seção de título */}
        <div className="p-6 flex items-center border-b border-gray-100">
          <div style={{ backgroundColor: color }} className="p-4 rounded-full mr-4">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-[#4A5568] text-xl font-medium">{title}</h3>
            <p style={{ color }} className="text-base mt-1">{subtitle}</p>
          </div>
          
          {/* Ícone de ajuda na direita */}
          <div className="ml-4">
            <div className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.09 9.00002C9.3251 8.33169 9.78915 7.76813 10.4 7.40915C11.0108 7.05018 11.7289 6.91896 12.4272 7.03873C13.1255 7.15851 13.7588 7.52154 14.2151 8.06354C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17H12.01" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Área de conteúdo */}
        <div className="p-4">
          {children}
        </div>
        
        {/* Rodapé */}
        <div className="px-6 py-3 border-t border-[#F0F4F8] flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center">
              <input 
                type="checkbox"
                checked={isForwarded}
                onChange={handleForwardedChange}
                className="mr-2 h-4 w-4"
              />
              <span className="text-gray-600">Marcar como encaminhada</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4 flex items-center">
              <div className="flex items-center justify-center p-1 border border-[#26C6B9] rounded-md mr-2">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-[#26C6B9] rounded-full"></div>
                  <div className="w-1 h-1 bg-[#26C6B9] rounded-full"></div>
                  <div className="w-1 h-1 bg-[#26C6B9] rounded-full"></div>
                </div>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Status digitando</span>
                <div className="flex items-center">
                  <span className="text-sm text-[#4A5568] font-medium">0</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                    <path d="M6 9L12 15L18 9" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="ml-1 text-gray-500 text-sm">segundos</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-[#26C6B9] font-medium mr-1">Próximo passo</span>
              <div className="flex items-center justify-center w-6 h-6 rounded-full border border-[#26C6B9]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="#26C6B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conector(es) de saída */}
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

export default BaseFlowNode;