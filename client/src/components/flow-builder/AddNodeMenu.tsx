import { useState } from 'react';
import { MessageCircle, ArrowRightLeft, Hourglass, Image, ListFilter, Clock, Globe, Variable, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowNodeType } from '@shared/schema';

interface NodeOption {
  type: FlowNodeType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const NODE_OPTIONS: NodeOption[] = [
  {
    type: 'textMessage',
    label: 'Mensagem de Texto',
    icon: <MessageCircle className="h-5 w-5" />,
    description: 'Envia uma mensagem de texto simples para o usuário'
  },
  {
    type: 'quickReplies',
    label: 'Botões',
    icon: <ListFilter className="h-5 w-5" />,
    description: 'Apresenta botões de resposta rápida para o usuário escolher'
  },
  {
    type: 'condition',
    label: 'Condição',
    icon: <ArrowRightLeft className="h-5 w-5" />,
    description: 'Cria uma bifurcação baseada em uma condição'
  },
  {
    type: 'waitResponse',
    label: 'Aguardar Resposta',
    icon: <Hourglass className="h-5 w-5" />,
    description: 'Aguarda uma resposta do usuário'
  },
  {
    type: 'mediaMessage',
    label: 'Mídia',
    icon: <Image className="h-5 w-5" />,
    description: 'Envia uma imagem, vídeo ou áudio para o usuário'
  },
  {
    type: 'delay',
    label: 'Atraso',
    icon: <Clock className="h-5 w-5" />,
    description: 'Adiciona um atraso antes de continuar o fluxo'
  },
  {
    type: 'httpRequest',
    label: 'API',
    icon: <Globe className="h-5 w-5" />,
    description: 'Faz uma requisição para uma API externa'
  },
  {
    type: 'setVariable',
    label: 'Variável',
    icon: <Variable className="h-5 w-5" />,
    description: 'Define o valor de uma variável'
  },
  {
    type: 'humanTransfer',
    label: 'Atendente',
    icon: <User className="h-5 w-5" />,
    description: 'Transfere a conversa para um atendente humano'
  }
];

interface AddNodeMenuProps {
  open: boolean;
  onClose: () => void;
  onSelect: (nodeType: FlowNodeType) => void;
}

export default function AddNodeMenu({ open, onClose, onSelect }: AddNodeMenuProps) {
  if (!open) return null;
  
  const handleSelect = (nodeType: FlowNodeType) => {
    onSelect(nodeType);
    onClose();
  };
  
  // Uso de número limitado de opções principais para manter o design em estrela
  const mainOptions = NODE_OPTIONS.slice(0, 3); // Texto, Botões, Condição
  const secondaryOptions = NODE_OPTIONS.slice(3, 6); // Aguardar, Mídia, Atraso  
  const tertiaryOptions = NODE_OPTIONS.slice(6); // API, Variável, Atendente
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {/* Centro da estrela */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Button
            size="sm"
            className="h-16 w-16 rounded-full shadow-lg bg-primary text-white border-4 border-white flex flex-col items-center justify-center"
            onClick={onClose}
          >
            <span className="text-xs font-bold">Bloco</span>
          </Button>
        </div>
        
        {/* Opções principais - posição superior */}
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 flex gap-4">
          {mainOptions.map((option) => (
            <Button
              key={option.type}
              variant="outline"
              className="h-16 w-32 rounded-full shadow-xl bg-white border-2 border-primary/20 flex flex-col items-center justify-center p-1 hover:bg-primary/10 hover:border-primary/50 transition-all"
              onClick={() => handleSelect(option.type)}
            >
              <div className="bg-primary/10 p-1 rounded-full">
                {option.icon}
              </div>
              <span className="text-xs font-medium mt-1">{option.label}</span>
            </Button>
          ))}
        </div>
        
        {/* Opções secundárias - posição esquerda/direita */}
        <div className="absolute top-0 -left-36 flex flex-col gap-4">
          {secondaryOptions.map((option) => (
            <Button
              key={option.type}
              variant="outline"
              className="h-16 w-28 rounded-full shadow-xl bg-white border-2 border-primary/20 flex flex-col items-center justify-center p-1 hover:bg-primary/10 hover:border-primary/50 transition-all"
              onClick={() => handleSelect(option.type)}
            >
              <div className="bg-primary/10 p-1 rounded-full">
                {option.icon}
              </div>
              <span className="text-xs font-medium mt-1">{option.label}</span>
            </Button>
          ))}
        </div>
        
        {/* Opções terciárias - posição inferior */}
        <div className="absolute -bottom-36 left-1/2 -translate-x-1/2 flex gap-4">
          {tertiaryOptions.map((option) => (
            <Button
              key={option.type}
              variant="outline"
              className="h-16 w-28 rounded-full shadow-xl bg-white border-2 border-primary/20 flex flex-col items-center justify-center p-1 hover:bg-primary/10 hover:border-primary/50 transition-all"
              onClick={() => handleSelect(option.type)}
            >
              <div className="bg-primary/10 p-1 rounded-full">
                {option.icon}
              </div>
              <span className="text-xs font-medium mt-1">{option.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}