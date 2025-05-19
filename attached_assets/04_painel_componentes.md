# Prompt 4: Painel de Componentes (NodePalette.tsx)

Este componente implementa o painel lateral direito que contém os blocos arrastáveis para o canvas, organizados por categorias.

```tsx
// src/components/flow-builder/NodePalette.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { nodeMetadata, NODE_TYPES } from './FlowNodeTypes';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

// Agrupar nós por categoria
const nodesByCategory = Object.entries(nodeMetadata).reduce((acc, [type, meta]) => {
  if (!acc[meta.category]) {
    acc[meta.category] = [];
  }
  acc[meta.category].push({ type, ...meta });
  return acc;
}, {} as Record<string, Array<{ type: string; label: string; description: string; icon: string; color: string }>>);

interface NodePaletteProps {
  onDragStart?: (event: React.DragEvent, nodeType: string) => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onDragStart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.keys(nodesByCategory).reduce((acc, category) => {
      acc[category] = true; // Inicialmente todas as categorias estão expandidas
      return acc;
    }, {} as Record<string, boolean>)
  );
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  // Filtrar nós com base no termo de busca
  const filteredCategories = Object.entries(nodesByCategory).reduce((acc, [category, nodes]) => {
    const filteredNodes = nodes.filter(node => 
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredNodes.length > 0) {
      acc[category] = filteredNodes;
    }
    
    return acc;
  }, {} as Record<string, Array<{ type: string; label: string; description: string; icon: string; color: string }>>);

  // Função para renderizar o ícone dinâmico
  const renderIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.HelpCircle;
    return <Icon size={16} />;
  };

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    if (onDragStart) {
      onDragStart(event, nodeType);
    } else {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  return (
    <Card className="w-full h-full overflow-hidden flex flex-col">
      <CardHeader className="p-3 border-b">
        <CardTitle className="text-sm font-medium">Componentes</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar componentes..."
            className="pl-8 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-y-auto flex-1">
        {Object.keys(filteredCategories).length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhum componente encontrado
          </div>
        ) : (
          <div className="divide-y">
            {Object.entries(filteredCategories).map(([category, nodes]) => (
              <div key={category} className="py-1">
                <Button
                  variant="ghost"
                  className="w-full justify-between px-3 py-1.5 h-auto text-sm font-medium"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                  <span className="text-xs text-muted-foreground">
                    {nodes.length}
                  </span>
                </Button>
                
                {expandedCategories[category] && (
                  <div className="grid grid-cols-1 gap-1 p-1">
                    {nodes.map((node) => (
                      <div
                        key={node.type}
                        className={cn(
                          "flex items-center space-x-2 p-2 rounded-md cursor-grab hover:bg-muted transition-colors",
                          `border-l-4 border-${node.color}-500`
                        )}
                        draggable
                        onDragStart={(e) => handleDragStart(e, node.type)}
                      >
                        <div className={`p-1.5 rounded-md bg-${node.color}-100 text-${node.color}-500`}>
                          {renderIcon(node.icon)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{node.label}</div>
                          <div className="text-xs text-muted-foreground">{node.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NodePalette;
```

## Características Principais

1. **Organização por Categorias**: Os blocos são agrupados por categorias (Mensagens, Interação, Lógica, etc.)
2. **Busca**: Campo de busca para filtrar os componentes disponíveis
3. **Expansão/Colapso**: Categorias podem ser expandidas ou colapsadas
4. **Drag and Drop**: Componentes podem ser arrastados para o canvas
5. **Ícones Dinâmicos**: Cada tipo de bloco tem seu próprio ícone e cor
6. **Descrições**: Cada bloco tem uma descrição que explica sua função

Este componente é essencial para a experiência do usuário, permitindo que ele encontre e adicione facilmente os blocos necessários ao seu fluxo.
