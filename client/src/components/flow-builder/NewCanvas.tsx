import { useRef, useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { useFlowBuilder } from '@/hooks/use-flow-builder';
import { ZoomIn, ZoomOut, Focus, Trash, Copy, Play, Undo2, Redo2, Save, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Importação de novos nós
import TextMessageNode from './canvas/TextMessageNode';
import MediaMessageNode from './canvas/MediaMessageNode';
import ButtonsNode from './canvas/ButtonsNode';
import WaitResponseNode from './canvas/WaitResponseNode';

// Tipos de nós disponíveis
const nodeTypes = {
  textMessage: TextMessageNode,
  mediaMessage: MediaMessageNode,
  quickReplies: ButtonsNode,
  waitResponse: WaitResponseNode,
};

interface NewCanvasProps {
  onSaveDraft: () => void;
  onPublish: () => void;
  onNodeSelect: (node: any) => void;
  isSaving?: boolean;
}

const NewCanvasContent = ({ onSaveDraft, onPublish, onNodeSelect, isSaving = false }: NewCanvasProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const { 
    nodes, 
    edges, 
    setNodes, 
    setEdges, 
    onConnect, 
    onDrop, 
    onNodeChange, 
    onEdgesChange, 
    addStarterNode 
  } = useFlowBuilder();
  const [zoom, setZoom] = useState(100);
  const [showEmptyState, setShowEmptyState] = useState(false);
  
  // Verificar se o fluxo está vazio para mostrar mensagem de início
  useEffect(() => {
    setShowEmptyState(nodes.length === 0);
  }, [nodes]);
  
  // Atualizar o zoom ao mudar o viewport
  useEffect(() => {
    if (reactFlowInstance) {
      const handleViewportChange = (e: any) => {
        setZoom(Math.round(e.zoom * 100));
      };
      
      reactFlowInstance.on('viewportChange', handleViewportChange);
      return () => {
        reactFlowInstance.off('viewportChange', handleViewportChange);
      };
    }
  }, [reactFlowInstance]);
  
  // Handler para drag over (permite soltar elementos no canvas)
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  // Handler para drop (quando um elemento é solto no canvas)
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!reactFlowWrapper.current || !reactFlowInstance) return;
    
    onDrop(event, reactFlowInstance);
  };
  
  // Função para selecionar todos os nós
  const handleSelectAll = useCallback(() => {
    setNodes(
      nodes.map(node => ({
        ...node,
        selected: true,
      }))
    );
  }, [nodes, setNodes]);
  
  // Função para limpar seleção
  const handleClearSelection = useCallback(() => {
    setNodes(
      nodes.map(node => ({
        ...node,
        selected: false,
      }))
    );
  }, [nodes, setNodes]);
  
  // Função para excluir nós selecionados
  const handleDelete = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    if (selectedNodes.length === 0) return;
    
    const selectedNodeIds = new Set(selectedNodes.map(node => node.id));
    
    // Remover nós selecionados
    setNodes(nodes.filter(node => !selectedNodeIds.has(node.id)));
    
    // Remover edges conectadas a nós excluídos
    setEdges(
      edges.filter(
        edge => !selectedNodeIds.has(edge.source) && !selectedNodeIds.has(edge.target)
      )
    );
  }, [nodes, edges, setNodes, setEdges]);
  
  // Função para duplicar nós selecionados
  const handleDuplicate = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    if (selectedNodes.length === 0) return;
    
    const newNodes = selectedNodes.map(node => ({
      ...node,
      id: `${node.id}-copy-${Date.now()}`,
      selected: false,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
    }));
    
    setNodes([...nodes, ...newNodes]);
  }, [nodes, setNodes]);
  
  // Função para iniciar um novo fluxo
  const handleCreateStartNode = useCallback(() => {
    if (nodes.length === 0) {
      addStarterNode();
    }
  }, [nodes, addStarterNode]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Barra de ferramentas superior */}
      <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-1"
            onClick={handleCreateStartNode}
            disabled={nodes.length > 0}
          >
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">Iniciar Fluxo</span>
          </Button>
          
          <div className="h-6 border-r border-gray-200 dark:border-gray-700"></div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => {
              // TODO: implementar undo
            }}
            disabled={true}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => {
              // TODO: implementar redo
            }}
            disabled={true}
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 gap-1"
                  onClick={onSaveDraft}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">Salvar Rascunho</span>
                  {isSaving && <div className="ml-1 h-3 w-3 animate-spin rounded-full border-b-2 border-current"></div>}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Salva o fluxo como rascunho</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="h-8 gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={onPublish}
                  disabled={isSaving}
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Publicar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Publica o fluxo para uso em produção</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Área principal do canvas */}
      <div className="flex-1 flex" ref={reactFlowWrapper}>
        {showEmptyState && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-lg max-w-md text-center pointer-events-auto">
              <Play className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Seu fluxo está vazio</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Comece seu fluxo adicionando um nó inicial ou arraste componentes do painel lateral.
              </p>
              <Button onClick={handleCreateStartNode}>
                Criar nó inicial
              </Button>
            </div>
          </div>
        )}
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodeChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={handleDrop}
          onNodeClick={(_, node) => onNodeSelect(node)}
          nodeTypes={nodeTypes}
          className="bg-dot-pattern"
          fitView
          proOptions={{ hideAttribution: true }}
          snapToGrid
          snapGrid={[10, 10]}
        >
          {/* Controles de zoom e ações na lateral esquerda */}
          <Panel position="top-left" className="bg-white dark:bg-gray-800 shadow-md rounded-md p-1 flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 hover:text-gray-700 h-8 w-8"
              onClick={() => reactFlowInstance.zoomIn()}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 hover:text-gray-700 h-8 w-8"
              onClick={() => reactFlowInstance.zoomOut()}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 hover:text-gray-700 h-8 w-8"
              onClick={() => reactFlowInstance.fitView()}
            >
              <Focus className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 hover:text-gray-700 h-8 w-8"
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 hover:text-gray-700 h-8 w-8"
              onClick={handleDuplicate}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </Panel>
          
          {/* Exibir zoom atual */}
          <Panel position="top-right" className="bg-white dark:bg-gray-800 shadow-md rounded-md px-2 py-1">
            <span className="text-xs text-gray-500">Zoom: {zoom}%</span>
          </Panel>
          
          {/* Componentes de fundo e navegação */}
          <Background 
            gap={20} 
            size={1} 
            color="rgba(0,0,0,0.03)" 
          />
          <MiniMap 
            nodeStrokeWidth={3}
            className="bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            nodeBorderRadius={2}
          />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
};

const NewCanvas = (props: NewCanvasProps) => (
  <ReactFlowProvider>
    <NewCanvasContent {...props} />
  </ReactFlowProvider>
);

export default NewCanvas;