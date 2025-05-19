import React from 'react';
import { 
  MessageSquare, 
  Image, 
  Clock, 
  ListPlus, 
  MessageCircleQuestion, 
  Contact2, 
  Play, 
  Variable, 
  Globe, 
  User
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface NodeType {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: string;
}

const nodeTypes: NodeType[] = [
  // Categoria: Mensagens
  {
    id: 'textMessage',
    type: 'textMessage',
    name: 'Mensagem de Texto',
    description: 'Envie uma mensagem de texto simples',
    icon: <MessageSquare className="h-5 w-5" />,
    color: '#26C6B9',
    category: 'mensagens'
  },
  {
    id: 'mediaMessage',
    type: 'mediaMessage',
    name: 'Mídia',
    description: 'Envie imagens, áudios ou vídeos',
    icon: <Image className="h-5 w-5" />,
    color: '#4C6EF5',
    category: 'mensagens'
  },
  {
    id: 'quickReplies',
    type: 'quickReplies',
    name: 'Botões',
    description: 'Crie botões interativos para respostas rápidas',
    icon: <ListPlus className="h-5 w-5" />,
    color: '#7950F2',
    category: 'mensagens'
  },
  {
    id: 'contactMessage',
    type: 'contactMessage',
    name: 'Contato',
    description: 'Compartilhe um contato',
    icon: <Contact2 className="h-5 w-5" />,
    color: '#4C6EF5',
    category: 'mensagens'
  },
  
  // Categoria: Interações
  {
    id: 'waitResponse',
    type: 'waitResponse',
    name: 'Aguardar Resposta',
    description: 'Aguarde uma resposta do usuário',
    icon: <Clock className="h-5 w-5" />,
    color: '#FD7E14',
    category: 'interacoes'
  },
  {
    id: 'condition',
    type: 'condition',
    name: 'Condição',
    description: 'Crie uma bifurcação baseada em condições',
    icon: <MessageCircleQuestion className="h-5 w-5" />,
    color: '#FA5252',
    category: 'interacoes'
  },
  
  // Categoria: Avançado
  {
    id: 'startTrigger',
    type: 'startTrigger',
    name: 'Gatilho Inicial',
    description: 'Inicie o fluxo com base em uma palavra-chave',
    icon: <Play className="h-5 w-5" />,
    color: '#40C057',
    category: 'avancado'
  },
  {
    id: 'setVariable',
    type: 'setVariable',
    name: 'Variável',
    description: 'Defina ou atualize uma variável',
    icon: <Variable className="h-5 w-5" />,
    color: '#BE4BDB',
    category: 'avancado'
  },
  {
    id: 'httpRequest',
    type: 'httpRequest',
    name: 'API Externa',
    description: 'Faça uma requisição para uma API externa',
    icon: <Globe className="h-5 w-5" />,
    color: '#12B886',
    category: 'avancado'
  },
  {
    id: 'humanTransfer',
    type: 'humanTransfer',
    name: 'Transferir para Humano',
    description: 'Transferir conversa para atendimento humano',
    icon: <User className="h-5 w-5" />,
    color: '#228BE6',
    category: 'avancado'
  },
];

interface NodeSelectorProps {
  className?: string;
}

const NodeSelector: React.FC<NodeSelectorProps> = ({ className }) => {
  // Função para iniciar o arrasto de um nó
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    // Salvamos os dados do nó que está sendo arrastado
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  
  // Agrupar os nós por categoria
  const categorizedNodes: Record<string, NodeType[]> = nodeTypes.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<string, NodeType[]>);
  
  // Nome das categorias em português
  const categoryNames: Record<string, string> = {
    mensagens: 'Mensagens',
    interacoes: 'Interações',
    avancado: 'Avançado'
  };

  return (
    <div className={`bg-white dark:bg-gray-950 h-full ${className || ''}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold">Componentes</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Arraste e solte para adicionar ao fluxo</p>
      </div>
      
      <div className="p-2 overflow-y-auto h-[calc(100%-64px)]">
        <Accordion type="multiple" defaultValue={['mensagens', 'interacoes', 'avancado']} className="w-full">
          {Object.keys(categorizedNodes).map((category) => (
            <AccordionItem key={category} value={category} className="border-b">
              <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                {categoryNames[category] || category}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 py-1">
                  {categorizedNodes[category].map((node) => (
                    <div
                      key={node.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, node.type)}
                      className="flex items-center p-2 rounded-md border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow cursor-move transition-all"
                    >
                      <div 
                        className="h-8 w-8 rounded-md flex items-center justify-center mr-3" 
                        style={{ backgroundColor: node.color }}
                      >
                        <div className="text-white">
                          {node.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{node.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{node.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default NodeSelector;