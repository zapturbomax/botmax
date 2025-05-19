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
      {/* Barra superior com ações */}
      <div className="absolute top-0 left-0 right-0 bg-[#3A4049] text-white rounded-t-xl py-2 px-4 flex justify-end gap-4 z-10">
        <button 
          className="flex items-center gap-1 text-sm font-medium hover:text-gray-200"
          onClick={handleDuplicate}
        >
          <Copy size={16} />
          Duplicar
        </button>
        <button 
          className="flex items-center gap-1 text-sm font-medium hover:text-gray-200"
          onClick={handleDelete}
        >
          <Trash2 size={16} />
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
        <div style={{ backgroundColor: color }} className="text-white py-3 px-4 flex justify-between">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-medium">{executionCount}</div>
            <div className="flex items-center text-xs">
              Executando
              <Info size={12} className="ml-1 cursor-help" />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-medium">{sentCount}</div>
            <div className="flex items-center text-xs">
              Enviados
              <Info size={12} className="ml-1 cursor-help" />
            </div>
          </div>
        </div>
        
        {/* Seção de título */}
        <div className="p-4 flex items-center">
          <div style={{ backgroundColor: color }} className="p-3 rounded-full mr-3">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-[#4A5568] text-base font-medium">{title}</h3>
            <p style={{ color }} className="text-sm">{subtitle}</p>
          </div>
        </div>
        
        {/* Área de conteúdo */}
        <div className="p-4">
          {children}
        </div>
        
        {/* Rodapé */}
        <div className="px-4 py-3 border-t border-[#F0F4F8] flex justify-between items-center">
          <div className="flex items-center">
            {!hideEncaminhada && (
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
            )}
            
            {!hideStatusDigitando && (
              <div className="flex items-center">
                <div className="mr-2 flex items-center justify-center p-1 border border-[color] rounded">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-[#26C6B9] rounded-full"></div>
                    <div className="w-1 h-1 bg-[#26C6B9] rounded-full"></div>
                    <div className="w-1 h-1 bg-[#26C6B9] rounded-full"></div>
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
            )}
          </div>
          
          <button 
            className="text-[#4A5568] font-medium flex items-center"
            style={{ color }}
          >
            Próximo passo
            <ChevronRight size={16} className="ml-1" />
          </button>
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