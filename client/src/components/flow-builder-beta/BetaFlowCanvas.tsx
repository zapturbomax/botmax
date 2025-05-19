import React, { useRef, useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  Node,
  Edge,
  Connection,
  NodeTypes,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Save, Rocket, ZoomIn, ZoomOut, Focus } from 'lucide-react';
import BetaFlowControls from './BetaFlowControls';
import ConnectionMenu from './ConnectionMenu';
import TextMessageNode from './nodes/TextMessageNode';
import ImageNode from './nodes/ImageNode';
import StartNode from './nodes/StartNode';

// Definindo os tipos de nós personalizados
const nodeTypes: NodeTypes = {
  textMessage: TextMessageNode,
  imageMessage: ImageNode,
  startNode: StartNode,
};

// Estilo para o grid pontilhado
const gridStyle = {
  backgroundSize: '20px 20px',
  backgroundImage: 'radial-gradient(circle, #e0e0e0 1px, transparent 1px)',
  backgroundPosition: '0 0',
};

// Interface para as props do BetaFlowCanvasContent
interface BetaFlowCanvasProps {
  onSaveDraft: () => void;
  onPublish: () => void;
  isSaving?: boolean;
}

// Estilo para o painel de controles
const controlsPanelStyle = {
  position: 'absolute' as const,
  bottom: '20px',
  right: '20px',
  display: 'flex',
  gap: '8px',
  padding: '8px',
  borderRadius: '8px',
  backgroundColor: 'white',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
};

// Componente principal do Canvas
const BetaFlowCanvasContent = ({
  onSaveDraft,
  onPublish,
  isSaving = false,
}: BetaFlowCanvasProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  
  // Estados para os nós, arestas e menu de conexão
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [showConnectionMenu, setShowConnectionMenu] = useState(false);
  const [connectionMenuPosition, setConnectionMenuPosition] = useState({ x: 0, y: 0 });
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);

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
    // Em vez de conectar diretamente, armazenamos a conexão pendente
    // e mostramos o menu de conexão
    if (reactFlowWrapper.current) {
      const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
      const targetNode = nodes.find((node) => node.id === connection.target);
      
      if (targetNode) {
        const menuX = targetNode.position.x;
        const menuY = targetNode.position.y;
        
        setPendingConnection(connection);
        setConnectionMenuPosition({ x: menuX, y: menuY });
        setShowConnectionMenu(true);
      } else {
        // Se não encontrar o nó alvo, apenas conecta diretamente
        setEdges((eds) => addEdge(connection, eds));
      }
    }
  }, [nodes, setEdges]);

  // Função para adicionar um nó com o tipo selecionado no menu de conexão
  const addNodeFromConnection = (nodeType: string) => {
    if (!pendingConnection || !reactFlowInstance) return;
    
    // Obter nós de origem e destino
    const sourceNode = nodes.find((node) => node.id === pendingConnection.source);
    const targetNode = nodes.find((node) => node.id === pendingConnection.target);
    
    if (!sourceNode || !targetNode || !pendingConnection.source || !pendingConnection.target) return;
    
    // Calcular posição para o novo nó
    const newNodePosition = {
      x: (sourceNode.position.x + targetNode.position.x) / 2,
      y: (sourceNode.position.y + targetNode.position.y) / 2 + 150,
    };
    
    // Criar novo nó
    const newNodeId = `${nodeType}-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: nodeType,
      position: newNodePosition,
      data: { text: '', isModern: true },
    };
    
    // Adicionar o novo nó
    setNodes((nds) => [...nds, newNode]);
    
    // Criar novas conexões (da origem para o novo nó, e do novo nó para o destino)
    const edgeFromSource: Edge = {
      id: `edge-${pendingConnection.source}-${newNodeId}`,
      source: pendingConnection.source,
      target: newNodeId,
    };
    
    const edgeToTarget: Edge = {
      id: `edge-${newNodeId}-${pendingConnection.target}`,
      source: newNodeId,
      target: pendingConnection.target,
    };
    
    // Adicionar as novas conexões
    setEdges((eds) => [...eds, edgeFromSource, edgeToTarget]);
    
    // Fechar o menu de conexão
    setShowConnectionMenu(false);
    setPendingConnection(null);
  };

  // Função para fechar o menu de conexão
  const closeConnectionMenu = () => {
    setShowConnectionMenu(false);
    setPendingConnection(null);
  };

  // Função para adicionar um nó inicial
  const addStarterNode = useCallback(() => {
    if (nodes.length > 0) return; // Só adiciona se não houver nós
    
    const newNode: Node = {
      id: `startNode-${Date.now()}`,
      type: 'startNode',
      position: { x: 250, y: 100 },
      data: { text: 'Início do fluxo', isModern: true },
    };
    
    setNodes([newNode]);
  }, [nodes]);

  // Função para lidar com o arrasto e soltura de nós
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Função para lidar com a soltura de nós
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      
      if (!reactFlowWrapper.current || !reactFlowInstance) return;
      
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeType = event.dataTransfer.getData('application/reactflow');
      
      if (!nodeType) return;
      
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: { text: '', isModern: true },
      };
      
      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance]
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <BetaFlowControls
        onSave={onSaveDraft}
        onPublish={onPublish}
        isSaving={isSaving}
      />
      
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-lg shadow-lg max-w-md text-center pointer-events-auto">
              <h3 className="text-xl font-bold mb-2">Seu fluxo está vazio</h3>
              <p className="text-gray-600 mb-4">
                Comece seu fluxo adicionando um nó inicial ou arraste componentes para o canvas.
              </p>
              <Button onClick={addStarterNode}>
                Criar nó inicial
              </Button>
            </div>
          </div>
        )}
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          style={gridStyle}
          proOptions={{ hideAttribution: true }}
          snapToGrid
          snapGrid={[20, 20]}
        >
          <Background />
          <MiniMap 
            nodeStrokeWidth={3}
            className="bg-white rounded-lg border border-gray-200"
            nodeBorderRadius={2}
          />
          <Controls showInteractive={false} position="bottom-right" />
          
          {showConnectionMenu && (
            <ConnectionMenu
              position={connectionMenuPosition}
              onSelectNodeType={addNodeFromConnection}
              onClose={closeConnectionMenu}
            />
          )}
        </ReactFlow>
      </div>
    </div>
  );
};

// Componente com o provedor ReactFlow
const BetaFlowCanvas = (props: BetaFlowCanvasProps) => (
  <ReactFlowProvider>
    <BetaFlowCanvasContent {...props} />
  </ReactFlowProvider>
);

export default BetaFlowCanvas;