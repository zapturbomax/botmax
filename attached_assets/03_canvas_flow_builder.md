# Prompt 3: Canvas do Flow Builder (FlowCanvas.tsx)

Este componente implementa a área de trabalho central do Flow Builder, utilizando React Flow para criar o canvas interativo onde os nós são posicionados e conectados.

```tsx
// src/components/flow-builder/FlowCanvas.tsx
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

interface FlowCanvasProps {
  flowId: string;
  onNodeSelect: (node: Node | null) => void;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({ 
  flowId, 
  onNodeSelect 
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  // Referências para conexão de nós
  const connectingNodeId = useRef<string | null>(null);
  const connectingHandleId = useRef<string | null>(null);
  const connectingHandleType = useRef<'source' | 'target' | null>(null);
  
  // Carregar fluxo do store
  const { getFlow, updateFlow } = useFlowStore();
  
  useEffect(() => {
    const flow = getFlow(flowId);
    if (flow) {
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
    }
  }, [flowId, getFlow]);
  
  // Salvar fluxo no store quando nodes ou edges mudam
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFlow(flowId, { nodes, edges });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [nodes, edges, flowId, updateFlow]);
  
  // Manipulador para conexão entre nós
  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, [setEdges]);
  
  // Manipulador para início de conexão
  const onConnectStart = useCallback(
    (_: React.MouseEvent, { nodeId, handleId, handleType }: OnConnectStartParams) => {
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
        
        // Aqui você pode implementar a lógica para mostrar um menu de sugestão
        // ou criar um nó padrão
      }
      
      connectingNodeId.current = null;
      connectingHandleId.current = null;
      connectingHandleType.current = null;
    },
    [reactFlowInstance]
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
        data: {}, // Dados iniciais vazios, serão preenchidos pelo componente específico
      };
      
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );
  
  // Manipulador para seleção de nós
  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
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
```

## Características Principais

1. **React Flow**: Utiliza a biblioteca React Flow para criar o canvas interativo
2. **Drag and Drop**: Suporte para arrastar e soltar novos nós no canvas
3. **Conexões**: Sistema para conectar nós entre si
4. **Controles de Visualização**: Zoom in/out, fit view, minimap
5. **Persistência**: Salva automaticamente o estado do fluxo
6. **Seleção de Nós**: Permite selecionar nós para edição de propriedades

Este componente é o coração do Flow Builder, onde os usuários podem criar e editar visualmente seus fluxos de conversação.
