import { useState, useEffect } from 'react';
import { FlowNodeType } from '@shared/schema';
import { MessageCircle, ArrowRightLeft, Hourglass, Image, ListFilter, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Interface para cada item de sugestão
interface SuggestionItem {
  nodeType: FlowNodeType;
  label: string;
  icon: React.ReactNode;
  priority: number; // Quanto maior, mais importante é a sugestão
}

// Props do componente
interface SuggestionMenuProps {
  parentNodeType: string;
  onSelect: (nodeType: FlowNodeType) => void;
}

// "Inteligência" para sugerir nós com base no nó pai
function getSuggestions(parentNodeType: string): SuggestionItem[] {
  const allSuggestions: SuggestionItem[] = [
    {
      nodeType: 'textMessage',
      label: 'Texto',
      icon: <MessageCircle className="h-4 w-4" />,
      priority: 5
    },
    {
      nodeType: 'quickReplies',
      label: 'Botões',
      icon: <ListFilter className="h-4 w-4" />,
      priority: 3
    },
    {
      nodeType: 'mediaMessage',
      label: 'Mídia',
      icon: <Image className="h-4 w-4" />,
      priority: 2
    },
    {
      nodeType: 'condition',
      label: 'Condição',
      icon: <ArrowRightLeft className="h-4 w-4" />,
      priority: 4
    },
    {
      nodeType: 'waitResponse',
      label: 'Aguardar',
      icon: <Hourglass className="h-4 w-4" />,
      priority: 4
    },
    {
      nodeType: 'humanTransfer',
      label: 'Humano',
      icon: <User className="h-4 w-4" />,
      priority: 1
    },
    {
      nodeType: 'delay',
      label: 'Atraso',
      icon: <Clock className="h-4 w-4" />,
      priority: 1
    }
  ];

  // Lógica para priorizar sugestões com base no tipo do nó pai
  let sortedSuggestions = [...allSuggestions];

  switch (parentNodeType) {
    case 'startTrigger':
      // Após um nó inicial, geralmente se envia uma mensagem ou espera-se uma ação
      sortedSuggestions = sortedSuggestions.map(s => {
        if (s.nodeType === 'textMessage') s.priority += 3;
        if (s.nodeType === 'mediaMessage') s.priority += 2;
        if (s.nodeType === 'waitResponse') s.priority -= 2;
        return s;
      });
      break;
    
    case 'textMessage':
      // Após uma mensagem de texto, geralmente se usa botões, condição ou aguarda resposta
      sortedSuggestions = sortedSuggestions.map(s => {
        if (s.nodeType === 'quickReplies') s.priority += 3;
        if (s.nodeType === 'waitResponse') s.priority += 3;
        if (s.nodeType === 'textMessage') s.priority -= 2; // Desincentivar múltiplas mensagens consecutivas
        if (s.nodeType === 'condition') s.priority += 1;
        return s;
      });
      break;
    
    case 'quickReplies':
      // Após botões, geralmente se usa condições para ramificar com base na escolha
      sortedSuggestions = sortedSuggestions.map(s => {
        if (s.nodeType === 'condition') s.priority += 4;
        if (s.nodeType === 'textMessage') s.priority += 2;
        if (s.nodeType === 'quickReplies') s.priority -= 3; // Evitar múltiplos botões consecutivos
        return s;
      });
      break;
      
    case 'condition':
      // Após uma condição, qualquer nó pode ser apropriado
      // Mas geralmente é uma mensagem de texto ou ação
      sortedSuggestions = sortedSuggestions.map(s => {
        if (s.nodeType === 'textMessage') s.priority += 2;
        if (s.nodeType === 'condition') s.priority -= 3; // Evitar condições aninhadas
        return s;
      });
      break;
      
    case 'waitResponse':
      // Após aguardar resposta, geralmente se usa condições
      sortedSuggestions = sortedSuggestions.map(s => {
        if (s.nodeType === 'condition') s.priority += 3;
        if (s.nodeType === 'textMessage') s.priority += 2;
        if (s.nodeType === 'waitResponse') s.priority -= 5; // Nunca repetir aguardar resposta
        return s;
      });
      break;
      
    case 'mediaMessage':
      // Após uma mensagem de mídia, similar ao texto
      sortedSuggestions = sortedSuggestions.map(s => {
        if (s.nodeType === 'quickReplies') s.priority += 3;
        if (s.nodeType === 'waitResponse') s.priority += 2;
        if (s.nodeType === 'mediaMessage') s.priority -= 3; // Evitar múltiplas mídias consecutivas
        return s;
      });
      break;
      
    default:
      // Configuração padrão para outros tipos
      break;
  }

  // Ordenar por prioridade e retornar as 3 principais sugestões
  return sortedSuggestions
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);
}

export default function SuggestionMenu({ parentNodeType, onSelect }: SuggestionMenuProps) {
  const suggestions = getSuggestions(parentNodeType);
  
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Pilha de sugestões */}
      <div className="flex flex-col items-center gap-2 pb-1">
        {suggestions.map((suggestion, index) => (
          <Button
            key={suggestion.nodeType}
            size="sm"
            variant="outline"
            className={`h-8 min-w-[120px] text-xs gap-2 bg-white hover:bg-primary/5 border-primary/30 animate-fadeIn`}
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationDuration: '200ms'
            }}
            onClick={() => onSelect(suggestion.nodeType)}
          >
            <div className="bg-primary/10 p-1 rounded-full">
              {suggestion.icon}
            </div>
            <span>{suggestion.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}