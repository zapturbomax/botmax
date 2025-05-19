
// src/components/flow-builder-beta/FlowBuilderLayout.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Play, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import FlowCanvas from './FlowCanvas';
import NodePalette from './NodePalette';
import PropertiesPanel from './PropertiesPanel';
import { Node } from 'reactflow';

interface FlowBuilderLayoutProps {
  flowId: string;
  flowName: string;
}

const FlowBuilderLayout: React.FC<FlowBuilderLayoutProps> = ({ 
  flowId, 
  flowName 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showProperties, setShowProperties] = useState(false);
  
  // Função para voltar à lista de fluxos
  const handleBack = () => {
    navigate('/flows');
  };
  
  // Função para salvar o fluxo
  const handleSave = () => {
    toast({
      title: "Fluxo salvo",
      description: "Seu fluxo foi salvo com sucesso",
    });
  };
  
  // Função para testar o fluxo
  const handleTest = () => {
    toast({
      title: "Modo de teste",
      description: "Iniciando simulação do fluxo",
    });
  };
  
  // Função para abrir configurações
  const handleSettings = () => {
    toast({
      title: "Configurações",
      description: "Abrindo configurações do fluxo",
    });
  };
  
  // Função para selecionar um nó
  const handleNodeSelect = (node: Node | null) => {
    setSelectedNode(node);
    setShowProperties(!!node);
  };
  
  // Função para fechar o painel de propriedades
  const handleCloseProperties = () => {
    setShowProperties(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-background">
      {/* Barra superior */}
      <header className="h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">{flowName || 'Novo Fluxo'}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </TooltipTrigger>
              <TooltipContent>Salvar fluxo</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleTest}>
                  <Play className="h-4 w-4 mr-2" />
                  Testar
                </Button>
              </TooltipTrigger>
              <TooltipContent>Testar fluxo</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleSettings}>
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Configurações</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ajuda</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>
      
      {/* Área principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Painel de propriedades (esquerda) - visível apenas quando um nó está selecionado */}
        {showProperties && (
          <div className="w-[280px] border-r">
            <PropertiesPanel 
              node={selectedNode!} 
              updateNodeData={(nodeId, data) => {
                // Implementar lógica para atualizar dados do nó
              }}
              onClose={handleCloseProperties} 
            />
          </div>
        )}
        
        {/* Canvas central */}
        <div className="flex-1">
          <FlowCanvas 
            flowId={flowId} 
            onNodeSelect={handleNodeSelect} 
          />
        </div>
        
        {/* Painel de componentes (direita) */}
        <div className="w-[280px] border-l">
          <NodePalette />
        </div>
      </div>
    </div>
  );
};

export default FlowBuilderLayout;
