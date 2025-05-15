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
  ReactFlowInstance
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
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

  // Set react flow instance
  const setReactFlowInstance = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstanceRef.current = instance;
  }, []);

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
      
      // If this is the first node and it's a startTrigger, select it
      if (nodes.length === 0 && nodeType === 'startTrigger') {
        setSelectedNode(newNode);
      }
    },
    [nodes, setNodes]
  );

  // Handle node connections
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      // Add validation here if needed
      // For example, prevent connections to startTrigger inputs
      if (connection.target) {
        const targetNode = nodes.find(node => node.id === connection.target);
        if (targetNode?.type === 'startTrigger') {
          console.log("Cannot connect to startTrigger input");
          return;
        }
      }
      
      // Create edge with unique ID
      setEdges((eds) => addEdge({
        ...connection,
        id: `e-${uuidv4()}`,
        type: 'smoothstep',
        animated: true,
      }, eds));
    },
    [nodes, setEdges]
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
  
  // Delete a node and its connections
  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter(node => node.id !== nodeId));
    setEdges((eds) => eds.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    ));
    
    // Clear selection if the deleted node was selected
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);
  
  // Duplicate a node
  const duplicateNode = useCallback((nodeId: string) => {
    const originalNode = nodes.find(node => node.id === nodeId);
    if (!originalNode) return;
    
    const newNode = {
      ...originalNode,
      id: `${originalNode.type}-${uuidv4()}`,
      position: {
        x: originalNode.position.x + 50,
        y: originalNode.position.y + 50,
      },
      selected: false,
    };
    
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes]);

  // Convert node/edge format for API
  const getSerializableFlow = useCallback(() => {
    const flowNodes: FlowNode[] = nodes.map(node => ({
      id: node.id,
      type: node.type as any,
      position: node.position,
      data: node.data || {},
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

  // Clear the canvas
  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  // Add a starter node
  const addStarterNode = useCallback(() => {
    if (nodes.length === 0) {
      const startNode: Node = {
        id: `startTrigger-${uuidv4()}`,
        type: 'startTrigger',
        position: { x: 250, y: 50 },
        data: {
          name: 'Start',
          description: 'Entry point for the flow',
        },
      };
      
      setNodes([startNode]);
      setSelectedNode(startNode);
    }
  }, [nodes, setNodes]);

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
    deleteNode,
    duplicateNode,
    getSerializableFlow,
    reactFlowInstance: reactFlowInstanceRef,
    setReactFlowInstance,
    clearCanvas,
    addStarterNode
  };
}
