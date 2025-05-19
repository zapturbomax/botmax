# Prompt 10: Componentes de Propriedades Específicas (TextMessageProperties.tsx)

Este componente implementa a interface de edição de propriedades específicas para o nó de mensagem de texto.

```tsx
// src/components/flow-builder/properties/TextMessageProperties.tsx
import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Bold, Italic, Code } from 'lucide-react';

interface TextMessagePropertiesProps {
  node: Node;
  updateNodeData: (nodeId: string, data: any) => void;
}

const TextMessageProperties: React.FC<TextMessagePropertiesProps> = ({ 
  node, 
  updateNodeData 
}) => {
  const [content, setContent] = useState(node.data.content || '');
  const [delay, setDelay] = useState(node.data.delay || 0);
  const [formatting, setFormatting] = useState(node.data.formatting || {
    bold: false,
    italic: false,
    monospace: false
  });
  
  // Atualizar estado local quando o nó mudar
  useEffect(() => {
    setContent(node.data.content || '');
    setDelay(node.data.delay || 0);
    setFormatting(node.data.formatting || {
      bold: false,
      italic: false,
      monospace: false
    });
  }, [node]);
  
  // Atualizar dados do nó quando o conteúdo mudar
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    updateNodeData(node.id, { content: newContent });
  };
  
  // Atualizar dados do nó quando o delay mudar
  const handleDelayChange = (value: number[]) => {
    const newDelay = value[0];
    setDelay(newDelay);
    updateNodeData(node.id, { delay: newDelay });
  };
  
  // Atualizar dados do nó quando a formatação mudar
  const handleFormattingChange = (value: string[]) => {
    const newFormatting = {
      bold: value.includes('bold'),
      italic: value.includes('italic'),
      monospace: value.includes('monospace')
    };
    setFormatting(newFormatting);
    updateNodeData(node.id, { formatting: newFormatting });
  };
  
  const characterCount = content.length;
  const isOverLimit = characterCount > 1024;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">Mensagem</label>
          <Badge variant={isOverLimit ? "destructive" : "secondary"}>
            {characterCount}/1024
          </Badge>
        </div>
        <Textarea
          value={content}
          onChange={handleContentChange}
          className="min-h-[120px] text-sm resize-none"
          placeholder="Digite sua mensagem aqui..."
        />
        {isOverLimit && (
          <p className="text-xs text-destructive mt-1">
            A mensagem excede o limite de 1024 caracteres do WhatsApp
          </p>
        )}
      </div>
      
      <div>
        <label className="text-sm font-medium block mb-1">Formatação</label>
        <ToggleGroup 
          type="multiple" 
          className="justify-start"
          value={[
            formatting.bold ? 'bold' : '',
            formatting.italic ? 'italic' : '',
            formatting.monospace ? 'monospace' : ''
          ].filter(Boolean)}
          onValueChange={handleFormattingChange}
        >
          <ToggleGroupItem value="bold" aria-label="Negrito">
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Itálico">
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="monospace" aria-label="Monospace">
            <Code className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-xs text-muted-foreground mt-1">
          Use *texto* para negrito, _texto_ para itálico e ```texto``` para monospace
        </p>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">Delay (segundos)</label>
          <span className="text-xs">{delay}s</span>
        </div>
        <Slider
          value={[delay]}
          min={0}
          max={10}
          step={1}
          onValueChange={handleDelayChange}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Tempo de espera antes de enviar a próxima mensagem
        </p>
      </div>
    </div>
  );
};

export default TextMessageProperties;
```

## Características Principais

1. **Edição de Texto**: Campo de texto para editar o conteúdo da mensagem
2. **Contador de Caracteres**: Mostra quantos caracteres foram usados e o limite (1024 para WhatsApp)
3. **Formatação**: Opções para aplicar formatação (negrito, itálico, monospace)
4. **Delay**: Controle deslizante para definir o tempo de espera antes da próxima mensagem
5. **Validação**: Alerta quando o limite de caracteres é excedido
6. **Sincronização**: Atualiza automaticamente o estado do nó quando as propriedades são alteradas

Este componente é renderizado no painel de propriedades quando um nó de mensagem de texto é selecionado, permitindo editar todas as suas propriedades específicas.
