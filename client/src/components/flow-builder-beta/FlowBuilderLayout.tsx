
// src/components/flow-builder-beta/FlowBuilderLayout.tsx
import React, { useState } from 'react';
import { useLocation } from 'wouter';
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
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showProperties, setShowProperties] = useState(false);
  
  // Função para voltar à lista de fluxos Beta
  const handleBack = () => {
    setLocation('/flows-beta');
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
    setSelectedNode(null);
  };
  
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Barra de navegação superior */}
      <header className="flex items-center justify-between h-14 px-4 border-b bg-background">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{flowName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Salvar alterações</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleTest}>
                  <Play className="h-4 w-4 mr-2" />
                  Testar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Testar fluxo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleSettings}>
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Configurações</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ajuda</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex">
        {/* Paleta de nós */}
        <div className="w-64 border-r bg-background overflow-y-auto">
          <NodePalette />
        </div>
        
        {/* Canvas do fluxo */}
        <div className="flex-1 relative">
          <FlowCanvas onNodeSelect={handleNodeSelect} />
        </div>
        
        {/* Painel de propriedades */}
        {showProperties && (
          <div className="w-80 border-l bg-background overflow-y-auto">
            <PropertiesPanel 
              node={selectedNode} 
              onClose={handleCloseProperties} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowBuilderLayout;
