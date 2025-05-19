
// src/components/flow-builder-beta/FlowBuilderLayout.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Save, Play, Settings, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import FlowCanvas from './FlowCanvas';
import NodePalette from './NodePalette';
import PropertiesPanel from './PropertiesPanel';
import { Node, Edge } from 'reactflow';
import { useQueryClient } from '@tanstack/react-query';
import { useFlowStore } from '@/hooks/use-flow-store';

interface FlowData {
  id: string;
  name: string;
  description?: string;
  status?: string;
  nodes: Node[];
  edges: Edge[];
  createdAt?: string;
  updatedAt?: string;
  isBeta?: boolean;
  tenantId?: number;
}

interface FlowBuilderLayoutProps {
  flowId: string;
  flowName: string;
  flow?: FlowData;
}

const FlowBuilderLayout: React.FC<FlowBuilderLayoutProps> = ({ 
  flowId, 
  flowName,
  flow
}) => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showProperties, setShowProperties] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { getFlow, updateFlow } = useFlowStore();
  
  useEffect(() => {
    // Sincronizar fluxo do backend com o estado local do fluxo
    if (flow) {
      console.log("Atualizando fluxo no layout com dados do backend:", flow);
    }
  }, [flow]);
  
  // Função para voltar à lista de fluxos
  const handleBack = () => {
    setLocation('/flows-beta');
  };
  
  // Função para salvar o fluxo
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Obter o estado atual do fluxo do store Zustand
      const currentFlowState = getFlow(flowId);
      if (!currentFlowState) {
        throw new Error("Fluxo não encontrado no estado local");
      }
      
      console.log("Salvando fluxo...", {
        id: flowId,
        nodes: currentFlowState.nodes,
        edges: currentFlowState.edges
      });
      
      // Enviar requisição para atualizar nós
      await axios.post(`/api/flows-beta/${flowId}/nodes`, {
        nodes: currentFlowState.nodes
      });
      
      // Enviar requisição para atualizar arestas
      await axios.post(`/api/flows-beta/${flowId}/edges`, {
        edges: currentFlowState.edges
      });
      
      // Invalidar o cache para forçar uma nova busca
      queryClient.invalidateQueries({ queryKey: ['flows-beta', flowId] });
      
      toast({
        title: "Fluxo salvo",
        description: "Seu fluxo foi salvo com sucesso",
      });
    } catch (error) {
      console.error('Erro ao salvar o fluxo:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o fluxo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {isSaving ? 'Salvando...' : 'Salvar'}
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
            initialNodes={flow?.nodes}
            initialEdges={flow?.edges}
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
                  flowId={flowId}
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
