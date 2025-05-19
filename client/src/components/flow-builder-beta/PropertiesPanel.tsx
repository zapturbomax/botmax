
import React from 'react';
import { Node } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NODE_TYPES, nodeMetadata } from './FlowNodeTypes';
import TextMessageProperties from './properties/TextMessageProperties';
import ButtonsProperties from './properties/ButtonsProperties';
import ConditionProperties from './properties/ConditionProperties';

interface PropertiesPanelProps {
  selectedNode: Node | null;
  updateNodeData: (nodeId: string, data: any) => void;
  nodes: Node[];
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedNode, 
  updateNodeData,
  nodes
}) => {
  if (!selectedNode) {
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

  const nodeType = selectedNode.type as NODE_TYPES;
  const metadata = nodeMetadata[nodeType];

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {metadata.icon && React.createElement(metadata.icon, { className: "w-4 h-4 mr-2" })}
          {metadata.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pt-2">
        <Tabs defaultValue="properties">
          <TabsList className="mb-4">
            <TabsTrigger value="properties">Propriedades</TabsTrigger>
            <TabsTrigger value="advanced">Avançado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties" className="space-y-4">
            {nodeType === NODE_TYPES.TEXT_MESSAGE && (
              <TextMessageProperties 
                node={selectedNode} 
                updateNodeData={updateNodeData} 
              />
            )}
            
            {nodeType === NODE_TYPES.BUTTONS && (
              <ButtonsProperties
                node={selectedNode}
                updateNodeData={updateNodeData}
                availableNodes={nodes}
              />
            )}
            
            {nodeType === NODE_TYPES.CONDITION && (
              <ConditionProperties 
                node={selectedNode}
                updateNodeData={updateNodeData}
                availableNodes={nodes}
              />
            )}
            
            {/* Adicione outros componentes de propriedades aqui conforme necessário */}
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="text-sm space-y-4">
              <div>
                <p className="font-medium mb-1">ID do Nó</p>
                <p className="text-muted-foreground">{selectedNode.id}</p>
              </div>
              
              <div>
                <p className="font-medium mb-1">Tipo</p>
                <p className="text-muted-foreground">{metadata.label}</p>
              </div>
              
              <div>
                <p className="font-medium mb-1">Posição</p>
                <p className="text-muted-foreground">
                  X: {Math.round(selectedNode.position.x)}, 
                  Y: {Math.round(selectedNode.position.y)}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PropertiesPanel;
