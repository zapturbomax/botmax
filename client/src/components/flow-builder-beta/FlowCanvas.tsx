
// src/components/flow-builder-beta/FlowCanvas.tsx
import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  NodeChange,
  EdgeChange,
  OnConnectStartParams,
  XYPosition,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from './FlowNodeTypes';
import { useFlowStore } from '@/hooks/use-flow-store';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FlowCanvasProps {
  flowId: string;
  onNodeSelect: (node: Node | null) => void;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({ 
  flowId, 
  onNodeSelect,
  initialNodes = [],
  initialEdges = []
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { toast } = useToast();
  const initialized = useRef(false);
  
  // Referências para conexão de nós
  const connectingNodeId = useRef<string | null>(null);
  const connectingHandleId = useRef<string | null>(null);
  const connectingHandleType = useRef<'source' | 'target' | null>(null);
  
  // Carregar fluxo do store
  const { getFlow, updateFlow } = useFlowStore();
  
  // Inicialização do fluxo: prioridade para initialNodes/Edges (vindo do backend)
  useEffect(() => {
    console.log("FlowCanvas - Inicializando com flowId:", flowId);
    
    if (initialNodes?.length > 0 || initialEdges?.length > 0) {
      console.log("FlowCanvas - Usando dados iniciais do backend:", { 
        nodes: initialNodes, 
        edges: initialEdges 
      });
      
      // Usar dados do backend que foram passados como props
      setNodes(initialNodes || []);
      setEdges(initialEdges || []);
      
      // Atualizar o store local com os dados do backend
      updateFlow(flowId, { 
        nodes: initialNodes || [], 
        edges: initialEdges || [] 
      });
      
      initialized.current = true;
    } else {
      // Verificar se já existe no store local
      const flow = getFlow(flowId);
      if (flow && (flow.nodes?.length > 0 || flow.edges?.length > 0)) {
        console.log("FlowCanvas - Usando dados do store local:", flow);
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        initialized.current = true;
      } else {
        // Não há dados no backend nem no store local
        console.log("FlowCanvas - Inicializando fluxo vazio");
        initialized.current = true;
      }
    }
  }, [flowId, initialNodes, initialEdges, getFlow, updateFlow]);
  
  // Salvar fluxo no store quando nodes ou edges mudam
  useEffect(() => {
    // Só salvamos se já estiver inicializado
    if (!initialized.current) return;
    
    const timer = setTimeout(() => {
      console.log("Atualizando fluxo no store...", { nodes, edges });
      updateFlow(flowId, { nodes, edges });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [nodes, edges, flowId, updateFlow]);
  
  // Manipulador para conexão entre nós
  const onConnect = useCallback((connection: Connection) => {
    console.log("Criando conexão entre nós:", connection);
    setEdges((eds) => addEdge(connection, eds));
  }, [setEdges]);
  
  // Manipulador para início de conexão
  const onConnectStart = useCallback(
    (_: React.MouseEvent, { nodeId, handleId, handleType }: OnConnectStartParams) => {
      console.log("Iniciando conexão a partir do nó:", nodeId);
      connectingNodeId.current = nodeId;
      connectingHandleId.current = handleId;
      connectingHandleType.current = handleType;
    },
    []
  );
  
  // Manipulador para fim de conexão
  const onConnectEnd = useCallback(
    (event: MouseEvent) => {
      if (!connectingNodeId.current) return;
      
      const targetIsPane = (event.target as Element).classList.contains('react-flow__pane');
      
      if (targetIsPane && connectingHandleType.current === 'source' && reactFlowInstance) {
        // Se estiver arrastando de um handle de saída para o painel, criar um novo nó
        const { top, left } = reactFlowWrapper.current!.getBoundingClientRect();
        const position = reactFlowInstance.project({
          x: event.clientX - left,
          y: event.clientY - top,
        });
        
        toast({
          title: 'Conectar a um novo nó',
          description: 'Use o painel de componentes para adicionar um nó e depois conecte-o.',
        });
      }
      
      connectingNodeId.current = null;
      connectingHandleId.current = null;
      connectingHandleType.current = null;
    },
    [reactFlowInstance, toast]
  );
  
  // Manipulador para arrastar e soltar novos nós
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  // Manipulador para soltar novos nós
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      const nodeType = event.dataTransfer.getData('application/reactflow');
      
      if (!nodeType || !reactFlowInstance || !reactFlowWrapper.current) return;
      
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      // Criar novo nó com base no tipo
      const newNode = {
        id: `${nodeType}_${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1).replace(/([A-Z])/g, ' $1'),
          // Dados iniciais que serão customizados no painel de propriedades
        },
      };
      
      console.log("Adicionando novo nó:", newNode);
      setNodes((nds) => nds.concat(newNode));
      
      toast({
        title: 'Nó adicionado',
        description: `Um novo nó do tipo ${nodeType} foi adicionado ao fluxo.`,
      });
    },
    [reactFlowInstance, setNodes, toast]
  );
  
  // Manipulador para seleção de nós
  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    if (nodes.length === 1) {
      console.log("Nó selecionado:", nodes[0]);
    } else if (nodes.length > 1) {
      console.log("Múltiplos nós selecionados:", nodes.length);
    }
    onNodeSelect(nodes.length === 1 ? nodes[0] : null);
  }, [onNodeSelect]);
  
  // Funções de controle de zoom
  const handleZoomIn = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn();
    }
  };
  
  const handleZoomOut = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut();
    }
  };
  
  const handleFitView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView();
    }
  };

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onSelectionChange={onSelectionChange}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[10, 10]}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.5}
          maxZoom={2}
          attributionPosition="bottom-right"
        >
          <Background color="#aaa" gap={16} />
          
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            position="bottom-right"
            style={{ 
              height: 120, 
              width: 200,
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              border: '1px solid #e2e8f0'
            }}
          />
          
          <Panel position="top-right" className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleFitView}>
              <Maximize className="h-4 w-4" />
            </Button>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowCanvas;
