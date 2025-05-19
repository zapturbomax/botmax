import React from 'react';
import { X } from 'lucide-react';

interface ConnectionMenuProps {
  position: { x: number; y: number };
  onSelectNodeType: (nodeType: string) => void;
  onClose: () => void;
}

/**
 * Menu flutuante que aparece quando conectamos dois blocos
 * Permite selecionar um tipo de nó para adicionar na conexão
 */
const ConnectionMenu: React.FC<ConnectionMenuProps> = ({
  position,
  onSelectNodeType,
  onClose,
}) => {
  // Categorias de nós
  const nodeCategories = [
    {
      title: 'Mensagens',
      nodes: [
        { type: 'textMessage', label: 'Texto', color: '#26C6B9', icon: '💬' },
        { type: 'imageMessage', label: 'Imagem', color: '#B44BF2', icon: '🖼️' },
      ],
    },
    {
      title: 'Lógica',
      nodes: [
        { type: 'condition', label: 'Condição', color: '#4A7AFF', icon: '🔀' },
        { type: 'delay', label: 'Espera', color: '#FF9F4A', icon: '⏱️' },
      ],
    },
  ];

  // Posicionamento do menu (ajustado para ficar centralizado)
  const menuStyle = {
    position: 'absolute' as const,
    left: `${position.x}px`,
    top: `${position.y + 40}px`,
    transform: 'translate(-50%, 0)',
    zIndex: 10,
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80"
      style={menuStyle}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-800">Adicionar bloco</h3>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>

      {nodeCategories.map((category) => (
        <div key={category.title} className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">{category.title}</h4>
          <div className="grid grid-cols-2 gap-2">
            {category.nodes.map((node) => (
              <button
                key={node.type}
                className="flex items-center p-2 rounded-md hover:bg-gray-50 border border-gray-200 transition-colors"
                onClick={() => onSelectNodeType(node.type)}
              >
                <div
                  className="flex items-center justify-center h-8 w-8 rounded-full mr-2 text-white"
                  style={{ backgroundColor: node.color }}
                >
                  <span>{node.icon}</span>
                </div>
                <span className="text-sm">{node.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="text-xs text-gray-500 mt-2">
        Selecione um tipo de bloco para adicionar na conexão
      </div>
    </div>
  );
};

export default ConnectionMenu;