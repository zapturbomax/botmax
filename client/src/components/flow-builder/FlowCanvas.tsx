import { useRef, useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { nodeComponents } from './FlowNodes';
import { useFlowBuilder } from '@/hooks/use-flow-builder';
import FlowControls from './FlowControls';
import { ZoomIn, ZoomOut, Focus, Trash, Copy, Play } from 'lucide-react';

interface FlowCanvasProps {
  onSaveDraft: () => void;
  onPublish: () => void;
  onNodeSelect: (node: any) => void;
  isSaving?: boolean;
}

const FlowCanvasContent = ({ onSaveDraft, onPublish, onNodeSelect, isSaving = false }: FlowCanvasProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const { nodes, edges, setNodes, setEdges, onConnect, onDrop, onNodeChange, onEdgesChange } = useFlowBuilder();
  const [zoom, setZoom] = useState(100);
  
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  const handleDrop = useCallback(
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
      
      onDrop(nodeType, position);
    },
    [reactFlowInstance, onDrop]
  );
  
  const handleZoomChange = useCallback((zoom: number) => {
    setZoom(Math.round(zoom * 100));
  }, []);
  
  const handleDelete = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    if (selectedNodes.length === 0) return;
    
    setNodes(nodes.filter(node => !node.selected));
    setEdges(edges.filter(edge => 
      !selectedNodes.some(node => 
        node.id === edge.source || node.id === edge.target
      )
    ));
  }, [nodes, edges, setNodes, setEdges]);
  
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
  
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <FlowControls
        onSave={onSaveDraft}
        onPublish={onPublish}
        isSaving={isSaving}
      />
      
      <div className="flex-1 flex" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodeChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={handleDrop}
          onNodeClick={(_, node) => onNodeSelect(node)}
          nodeTypes={nodeComponents}
          className="canvas-bg"
          onZoomChange={handleZoomChange}
          fitView
          proOptions={{ hideAttribution: true }}
          snapToGrid
          snapGrid={[20, 20]}
        >
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
            <div className="h-6 border-r border-gray-300 mx-1"></div>
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
          
          <Panel position="top-right" className="bg-white dark:bg-gray-800 shadow-md rounded-md px-2 py-1">
            <span className="text-xs text-gray-500">Zoom: {zoom}%</span>
          </Panel>
          
          <Background />
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

const FlowCanvas = (props: FlowCanvasProps) => (
  <ReactFlowProvider>
    <FlowCanvasContent {...props} />
  </ReactFlowProvider>
);

export default FlowCanvas;
