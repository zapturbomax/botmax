# Prompt 9: Painel de Propriedades (PropertiesPanel.tsx)

Este componente implementa o painel lateral esquerdo que aparece quando um nó é selecionado, permitindo editar suas propriedades.

```tsx
// src/components/flow-builder/PropertiesPanel.tsx
import React from 'react';
import { Node } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NODE_TYPES, nodeMetadata } from './FlowNodeTypes';
import TextMessageProperties from './properties/TextMessageProperties';
import ButtonsProperties from './properties/ButtonsProperties';
import ConditionProperties from './properties/ConditionProperties';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertiesPanelProps {
  node: Node;
  updateNodeData: (nodeId: string, data: any) => void;
  onClose?: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  node, 
  updateNodeData,
  onClose 
}) => {
  // Obter metadados do tipo de nó
  const nodeType = node.type || '';
  const metadata = nodeMetadata[nodeType] || { label: 'Desconhecido', icon: 'HelpCircle', color: 'gray' };
  
  // Renderizar o componente de propriedades com base no tipo de nó
  const renderPropertiesComponent = () => {
    switch (nodeType) {
      case NODE_TYPES.textMessage:
        return (
          <TextMessageProperties 
            node={node} 
            updateNodeData={updateNodeData} 
          />
        );
      case NODE_TYPES.buttons:
        return (
          <ButtonsProperties 
            node={node} 
            updateNodeData={updateNodeData} 
          />
        );
      case NODE_TYPES.condition:
        return (
          <ConditionProperties 
            node={node} 
            updateNodeData={updateNodeData} 
          />
        );
      // Adicionar outros casos para outros tipos de nós
      default:
        return (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Propriedades não disponíveis para este tipo de nó
          </div>
        );
    }
  };

  return (
    <Card className="w-full h-full overflow-hidden flex flex-col">
      <CardHeader className={`p-3 border-b bg-${metadata.color}-500 text-white flex flex-row justify-between items-center`}>
        <CardTitle className="text-sm font-medium">{metadata.label}</CardTitle>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 text-white">
            <X size={16} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0 overflow-y-auto flex-1">
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="properties" className="flex-1">Propriedades</TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1">Avançado</TabsTrigger>
          </TabsList>
          <TabsContent value="properties" className="p-3">
            {renderPropertiesComponent()}
          </TabsContent>
          <TabsContent value="advanced" className="p-3">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">ID do Nó</h3>
                <div className="text-xs p-2 bg-muted rounded-md">{node.id}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Tipo</h3>
                <div className="text-xs p-2 bg-muted rounded-md">{nodeType}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Posição</h3>
                <div className="text-xs p-2 bg-muted rounded-md">
                  X: {Math.round(node.position.x)}, Y: {Math.round(node.position.y)}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PropertiesPanel;
```

## Características Principais

1. **Painel Dinâmico**: Renderiza diferentes componentes de propriedades com base no tipo de nó selecionado
2. **Abas**: Divide as propriedades em "Propriedades" e "Avançado"
3. **Cabeçalho Colorido**: Usa a cor associada ao tipo de nó para o cabeçalho
4. **Botão de Fechar**: Permite fechar o painel de propriedades
5. **Informações Avançadas**: Mostra ID, tipo e posição do nó na aba avançada

Este componente é essencial para a edição detalhada dos nós, permitindo que o usuário configure cada bloco de acordo com suas necessidades específicas.
