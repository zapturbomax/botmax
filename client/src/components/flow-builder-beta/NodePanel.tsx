import React from 'react';
import { MessageSquare, Image, HelpCircle, List, Clock, User } from 'lucide-react';

/**
 * Painel lateral com os tipos de nós disponíveis para arrastar para o canvas
 */
const NodePanel: React.FC = () => {
  // Tipos de nós disponíveis agrupados por categoria
  const nodeCategories = [
    {
      title: 'Mensagens',
      nodes: [
        { type: 'textMessage', label: 'Texto', color: '#26C6B9', icon: <MessageSquare size={20} /> },
        { type: 'imageMessage', label: 'Imagem', color: '#B44BF2', icon: <Image size={20} /> },
      ],
    },
    {
      title: 'Interações',
      nodes: [
        { type: 'waitResponse', label: 'Pergunta', color: '#26C6B9', icon: <HelpCircle size={20} /> },
        { type: 'quickReplies', label: 'Botões', color: '#4A7AFF', icon: <List size={20} /> },
      ],
    },
    {
      title: 'Controle',
      nodes: [
        { type: 'delay', label: 'Espera', color: '#FF9F4A', icon: <Clock size={20} /> },
        { type: 'contactMessage', label: 'Contato', color: '#FF9F4A', icon: <User size={20} /> },
      ],
    },
  ];

  // Função para lidar com o início do arrasto
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-4 flex flex-col h-full overflow-auto">
      <div className="mb-6">
        <h2 className="font-medium text-lg text-gray-800 mb-2">Flow Builder Beta</h2>
        <p className="text-sm text-gray-500">Arraste os elementos para o canvas para criar seu fluxo</p>
      </div>

      {nodeCategories.map((category) => (
        <div key={category.title} className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3">{category.title}</h3>
          <div className="space-y-2">
            {category.nodes.map((node) => (
              <div
                key={node.type}
                draggable
                onDragStart={(e) => onDragStart(e, node.type)}
                className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-move transition-shadow"
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full mr-3 text-white"
                  style={{ backgroundColor: node.color }}
                >
                  {node.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">{node.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p className="mb-1">Nota: Esta é uma versão beta do Flow Builder.</p>
          <p>Arraste elementos do painel para o canvas para criar seu fluxo de conversação.</p>
        </div>
      </div>
    </div>
  );
};

export default NodePanel;