
import React, { useCallback } from 'react';
import { Node } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NODE_TYPES, nodeMetadata } from './FlowNodeTypes';
import { useFlowStore } from '@/hooks/use-flow-store';

// Componentes de propriedades (comentados até serem implementados de fato)
// import TextMessageProperties from './properties/TextMessageProperties';
// import ButtonsProperties from './properties/ButtonsProperties';
// import ConditionProperties from './properties/ConditionProperties';

interface PropertiesPanelProps {
  node: Node;
  flowId: string;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  node,
  flowId
}) => {
  const { getFlow, updateFlow } = useFlowStore();
  
  // Função para atualizar dados de um nó
  const updateNodeData = useCallback((data: any) => {
    // Obter fluxo atual do store
    const flow = getFlow(flowId);
    if (!flow) return;
    
    // Atualizar nó específico com novos dados
    const updatedNodes = flow.nodes.map(n => {
      if (n.id === node.id) {
        return {
          ...n,
          data: {
            ...n.data,
            ...data
          }
        };
      }
      return n;
    });
    
    // Atualizar fluxo no store
    updateFlow(flowId, { nodes: updatedNodes });
    
    console.log(`Propriedades do nó ${node.id} atualizadas:`, data);
  }, [node.id, flowId, getFlow, updateFlow]);
  
  if (!node) {
    return (
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Propriedades</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center text-center p-6">
          <div className="text-muted-foreground">
            <p>Selecione um nó para editar suas propriedades</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const nodeType = node.type as NODE_TYPES;
  const metadata = nodeMetadata[nodeType] || { 
    label: "Nó Desconhecido",
    description: "Tipo de nó não reconhecido"
  };

  // Dados específicos do nó
  const nodeData = node.data || {};

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {metadata.icon && React.createElement(metadata.icon, { className: "w-4 h-4 mr-2" })}
          {metadata.label || "Propriedades do Nó"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pt-2">
        <Tabs defaultValue="properties">
          <TabsList className="mb-4">
            <TabsTrigger value="properties">Propriedades</TabsTrigger>
            <TabsTrigger value="advanced">Avançado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties" className="space-y-4">
            {/* Implementação temporária de propriedades básicas comuns */}
            <div className="space-y-4">
              <div>
                <label htmlFor="node-label" className="block text-sm font-medium mb-1">
                  Rótulo
                </label>
                <input
                  id="node-label"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={nodeData.label || ''}
                  onChange={(e) => updateNodeData({ label: e.target.value })}
                  placeholder="Rótulo do nó"
                />
              </div>
              
              <div>
                <label htmlFor="node-description" className="block text-sm font-medium mb-1">
                  Descrição
                </label>
                <textarea
                  id="node-description"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={nodeData.description || ''}
                  onChange={(e) => updateNodeData({ description: e.target.value })}
                  placeholder="Descrição ou função deste nó"
                  rows={3}
                />
              </div>
              
              {/* Mensagem temporária de funcionalidade em desenvolvimento */}
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  As propriedades específicas para o tipo de nó <strong>{metadata.label}</strong> estão em desenvolvimento.
                </p>
              </div>
            </div>
            
            {/* Os componentes específicos serão implementados em uma etapa posterior
            {nodeType === NODE_TYPES.TEXT_MESSAGE && (
              <TextMessageProperties 
                node={node} 
                updateNodeData={updateNodeData} 
              />
            )}
            
            {nodeType === NODE_TYPES.BUTTONS && (
              <ButtonsProperties
                node={node}
                updateNodeData={updateNodeData}
                availableNodes={[]}
              />
            )}
            
            {nodeType === NODE_TYPES.CONDITION && (
              <ConditionProperties 
                node={node}
                updateNodeData={updateNodeData}
                availableNodes={[]}
              />
            )}
            */}
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="text-sm space-y-4">
              <div>
                <p className="font-medium mb-1">ID do Nó</p>
                <p className="text-muted-foreground">{node.id}</p>
              </div>
              
              <div>
                <p className="font-medium mb-1">Tipo</p>
                <p className="text-muted-foreground">{metadata.label || node.type}</p>
              </div>
              
              <div>
                <p className="font-medium mb-1">Posição</p>
                <p className="text-muted-foreground">
                  X: {Math.round(node.position.x)}, 
                  Y: {Math.round(node.position.y)}
                </p>
              </div>
              
              <div>
                <p className="font-medium mb-1">Dados do Nó</p>
                <pre className="text-xs p-2 bg-gray-100 rounded-md overflow-auto max-h-40">
                  {JSON.stringify(node.data, null, 2)}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PropertiesPanel;
