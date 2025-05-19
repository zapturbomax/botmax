import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
  Connection,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft, ArrowRight, Share, Zap, Save } from 'lucide-react';
import FlowSidebar from './FlowSidebar';
import StartNode from './nodes/StartNode';
import TextMessageNode from './nodes/TextMessageNode';
import AddNodeMenu from './AddNodeMenu';

// Definindo os tipos de nós personalizados
const nodeTypes: NodeTypes = {
  startNode: StartNode,
  textMessage: TextMessageNode,
};

interface FlowCanvasProps {
  flowId?: string;
  flowName?: string;
  onSave?: () => void;
  onClose?: () => void;
}

// Componente principal do Canvas
const FlowCanvasContent = ({
  flowId,
  flowName = "Meu primeiro Flow",
  onSave,
  onClose,
}: FlowCanvasProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  
  // Estados para os nós, arestas e menu de adição de nós
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 'start-node',
      type: 'startNode',
      data: { label: 'Início do fluxo' },
      position: { x: 250, y: 120 },
    },
  ]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [showAddNodeMenu, setShowAddNodeMenu] = useState(false);
  const [addNodeMenuPosition, setAddNodeMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  
  // Estado para contadores
  const [executingCount] = useState(0);
  const [sentCount] = useState(0);

  // Manipuladores de eventos para os nós
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  // Manipuladores de eventos para as arestas
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Manipulador de conexão entre nós
  const onConnect: OnConnect = useCallback((connection) => {
    if (reactFlowWrapper.current) {
      const targetNode = nodes.find((node) => node.id === connection.target);
      
      if (targetNode) {
        // Posicionar o menu próximo ao nó de destino
        const menuX = targetNode.position.x + 180;
        const menuY = targetNode.position.y;
        
        setSelectedConnection(connection);
        setAddNodeMenuPosition({ x: menuX, y: menuY });
        setShowAddNodeMenu(true);
      }
    }
  }, [nodes]);

  // Função para adicionar um novo nó quando selecionado no menu
  const handleAddNode = (nodeType: string) => {
    if (!selectedConnection || !reactFlowInstance) return;
    
    // Obter o nó de origem
    const sourceNode = nodes.find((node) => node.id === selectedConnection.source);
    if (!sourceNode) return;
    
    // Calcular posição para o novo nó
    const newNodePosition = {
      x: sourceNode.position.x,
      y: sourceNode.position.y + 150,
    };
    
    // Criar novo nó
    const newNodeId = `${nodeType}-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: nodeType,
      position: newNodePosition,
      data: { text: nodeType === 'textMessage' ? 'Nova mensagem de texto' : '' },
    };
    
    // Adicionar o novo nó
    setNodes((nds) => [...nds, newNode]);
    
    // Criar nova conexão
    const newEdge: Edge = {
      id: `edge-${selectedConnection.source}-${newNodeId}`,
      source: selectedConnection.source,
      target: newNodeId,
      type: 'smoothstep',
      style: { stroke: '#26C6B9', strokeWidth: 2 }
    };
    
    // Adicionar a nova conexão
    setEdges((eds) => [...eds, newEdge]);
    
    // Fechar o menu
    setShowAddNodeMenu(false);
    setSelectedConnection(null);
  };

  // Função para fechar o menu
  const handleCloseAddNodeMenu = () => {
    setShowAddNodeMenu(false);
    setSelectedConnection(null);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f6f8fa]">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between border-b p-3 bg-white">
        <div className="flex items-center">
          <div className="mr-4 flex items-center">
            <div className="text-[#26C6B9] font-semibold mr-3">dispara.ai</div>
            <h1 className="text-gray-600 font-normal">{flowName}</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            className="flex items-center gap-1 text-gray-600"
            onClick={() => {}}
          >
            <Zap className="h-4 w-4 text-[#8A58DC]" />
            <span className="text-[#8A58DC]">Testar</span>
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            className="text-gray-600"
            onClick={() => {}}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            className="text-gray-600"
            onClick={() => {}}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            className="text-gray-600"
            onClick={() => {}}
          >
            <Share className="h-4 w-4" />
          </Button>
          
          <Button 
            size="sm"
            className="bg-[#26C6B9] hover:bg-[#21b3a7] text-white"
            onClick={onSave}
          >
            <Save className="mr-1 h-4 w-4" />
            Salvar
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost"
            className="text-gray-600"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Área principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar esquerda */}
        <div className="w-[230px] border-r bg-white flex flex-col overflow-auto">
          <FlowSidebar />
        </div>
        
        {/* Canvas principal */}
        <div className="flex-1 overflow-hidden relative" ref={reactFlowWrapper}>
          {/* Contadores no topo do canvas */}
          <div className="absolute z-10 top-2 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <div className="bg-[#26C6B9] text-white px-4 py-2 rounded-md flex items-center space-x-2">
              <span className="font-medium">{executingCount}</span>
              <span className="text-xs">CONVERSAS ATIVAS</span>
            </div>
            <div className="bg-[#26C6B9] text-white px-4 py-2 rounded-md flex items-center space-x-2">
              <span className="font-medium">{sentCount}</span>
              <span className="text-xs">MENSAGENS ENVIADAS</span>
            </div>
          </div>
          
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            minZoom={0.5}
            maxZoom={2}
            attributionPosition="bottom-right"
            connectionLineStyle={{ stroke: '#26C6B9', strokeWidth: 2 }}
            connectionLineType="smoothstep"
          >
            <Background color="#ddd" gap={16} />
            <Controls 
              showInteractive={false}
              className="bg-white border rounded-lg shadow-sm"
            />
            
            {/* Menu de adição de nós */}
            {showAddNodeMenu && (
              <AddNodeMenu
                position={addNodeMenuPosition}
                onSelectNodeType={handleAddNode}
                onClose={handleCloseAddNodeMenu}
              />
            )}
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

// Componente com o provedor ReactFlow
const FlowCanvas = (props: FlowCanvasProps) => (
  <ReactFlowProvider>
    <FlowCanvasContent {...props} />
  </ReactFlowProvider>
);

export default FlowCanvas;