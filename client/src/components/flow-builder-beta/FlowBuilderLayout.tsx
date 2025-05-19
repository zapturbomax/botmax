
// src/components/flow-builder-beta/FlowBuilderLayout.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Save, Play, Settings, HelpCircle } from 'lucide-react';
import axios from 'axios';
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
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showProperties, setShowProperties] = useState(false);
  
  // Função para voltar à lista de fluxos
  const handleBack = () => {
    setLocation('/flows-beta');
  };
  
  // Função para salvar o fluxo
  const handleSave = async () => {
    try {
      // Implemente a lógica de salvamento do fluxo aqui
      await axios.post(`/api/flows-beta/${flowId}/save`, {
        // Dados a serem enviados para o servidor
      });
      
      toast({
        title: "Fluxo salvo",
        description: "Seu fluxo foi salvo com sucesso",
      });
    } catch (error) {
      console.error('Erro ao salvar o fluxo:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o fluxo",
        variant: "destructive",
      });
    }
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
    <div className="flex flex-col h-screen bg-background">
      {/* Cabeçalho */}
      <header className="h-14 border-b flex items-center px-4 justify-between bg-card">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-lg truncate max-w-[200px] md:max-w-md">
            {flowName}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" />
                  Salvar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Salvar fluxo</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleTest}>
                  <Play className="h-4 w-4 mr-1" />
                  Testar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Testar fluxo</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleSettings}>
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Configurações</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ajuda</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>
      
      {/* Conteúdo Principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Painel de Nós */}
        <div className="w-56 border-r bg-card p-4 overflow-y-auto">
          <h2 className="font-medium mb-3">Componentes</h2>
          <NodePalette />
        </div>
        
        {/* Canvas do Flow */}
        <div className="flex-1 relative">
          <FlowCanvas 
            flowId={flowId} 
            onNodeSelect={handleNodeSelect} 
          />
        </div>
        
        {/* Painel de Propriedades (condicional) */}
        {showProperties && (
          <div className="w-80 border-l bg-card overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Propriedades</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCloseProperties}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
              <Separator className="mb-4" />
              {selectedNode && (
                <PropertiesPanel 
                  node={selectedNode} 
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowBuilderLayout;
