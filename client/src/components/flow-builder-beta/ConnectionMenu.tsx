import React from 'react';
import { MessageCircle, Image, List, CheckSquare } from 'lucide-react';

interface ConnectionMenuProps {
  position: { x: number; y: number };
  onSelectNodeType: (nodeType: string) => void;
  onClose: () => void;
}

/**
 * Menu que aparece quando o usuário está criando uma conexão entre nós
 * Permite escolher que tipo de nó será inserido na conexão
 */
const ConnectionMenu = ({ position, onSelectNodeType, onClose }: ConnectionMenuProps) => {
  // Opções de tipos de nós que podem ser inseridos
  const nodeOptions = [
    { type: 'textMessage', label: 'Texto', icon: <MessageCircle className="w-4 h-4" />, color: 'bg-blue-500' },
    { type: 'imageNode', label: 'Imagem', icon: <Image className="w-4 h-4" />, color: 'bg-purple-500' },
    { type: 'listMessage', label: 'Lista', icon: <List className="w-4 h-4" />, color: 'bg-indigo-500' },
    { type: 'buttonMessage', label: 'Botões', icon: <CheckSquare className="w-4 h-4" />, color: 'bg-pink-500' },
  ];

  // Posicionamento do menu com deslocamento para melhor visualização
  const menuStyle = {
    position: 'absolute' as const,
    left: `${position.x}px`,
    top: `${position.y + 60}px`,
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
  };

  // Handler para quando o usuário seleciona um tipo de nó
  const handleSelect = (nodeType: string) => {
    onSelectNodeType(nodeType);
  };

  // Click fora do menu para fechar
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-connection-menu]')) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      style={menuStyle} 
      className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 border border-gray-200 dark:border-gray-700"
      data-connection-menu
    >
      <div className="w-56">
        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Adicionar nó na conexão
        </h4>
        <div className="space-y-1">
          {nodeOptions.map((option) => (
            <div
              key={option.type}
              className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleSelect(option.type)}
            >
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${option.color} text-white mr-2`}>
                {option.icon}
              </div>
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConnectionMenu;