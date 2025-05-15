import { useState, useCallback, useRef } from 'react';
import { 
  useNodesState, 
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  XYPosition,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { nodeTypes } from '@/components/flow-builder/FlowNodeTypes';
import { FlowNode, FlowEdge } from '@shared/schema';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export function useFlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowInstance = useRef<any>(null);

  // Handle drag and drop from node palette
  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  // Handle dropping a new node onto the canvas
  const onDrop = useCallback(
    (nodeType: string, position: XYPosition) => {
      // Find the node type configuration
      const nodeConfig = nodeTypes.find(type => type.type === nodeType);
      if (!nodeConfig) return;

      const id = `${nodeType}-${uuidv4()}`;
      const newNode: Node = {
        id,
        type: nodeType,
        position,
        data: {
          name: nodeConfig.label,
          description: nodeConfig.description,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  // Handle node connections
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({
        ...connection,
        id: `e${connection.source}-${connection.target}`,
        type: 'smoothstep',
        animated: true,
      }, eds));
    },
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle node data updates
  const updateNodeData = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
        }
        return node;
      })
    );

    // Also update selected node if it's the one being edited
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode((prevSelectedNode) => {
        if (!prevSelectedNode) return null;
        return {
          ...prevSelectedNode,
          data: {
            ...prevSelectedNode.data,
            ...data,
          },
        };
      });
    }
  }, [selectedNode, setNodes]);

  // Convert node/edge format for API
  const getSerializableFlow = useCallback(() => {
    const flowNodes: FlowNode[] = nodes.map(node => ({
      id: node.id,
      type: node.type as any,
      position: node.position,
      data: node.data,
    }));

    const flowEdges: FlowEdge[] = edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      label: edge.label,
    }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [nodes, edges]);

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    selectedNode,
    setSelectedNode,
    onNodeChange: onNodesChange as OnNodesChange,
    onEdgesChange: onEdgesChange as OnEdgesChange,
    onConnect,
    onDragStart,
    onDrop,
    onNodeClick,
    updateNodeData,
    getSerializableFlow,
    reactFlowInstance,
  };
}
