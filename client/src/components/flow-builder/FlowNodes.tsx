import { memo, useCallback } from 'react';
import { Handle, Position, useReactFlow, useUpdateNodeInternals } from 'reactflow';
import { Card } from '@/components/ui/node-card';
import { nodeTypes } from './FlowNodeTypes';
import { FlowNode } from '@shared/schema';
import { NodePopover } from './NodePopover';
import { MessageCircle, ArrowRightLeft, Hourglass, Variable, AlertTriangle } from 'lucide-react';

// Function to create a new node connected to the current one
const createConnectedNode = (
  nodeId: string, 
  nodeType: string, 
  position: { x: number, y: number }
) => {
  const newNode: FlowNode = {
    id: `${nodeType}-${Date.now()}`,
    type: nodeType as any,
    position: { 
      x: position.x, 
      y: position.y + 200 // Position below the current node
    },
    data: {}
  };
  
  const edge = {
    id: `edge-${nodeId}-${newNode.id}`,
    source: nodeId,
    target: newNode.id,
  };
  
  return { node: newNode, edge };
};

const BaseNode = ({ data, id, type, selected }: any) => {
  // Get React Flow instance to add nodes
  const reactFlowInstance = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  
  // Find the node type configuration
  const nodeType = nodeTypes.find(t => t.type === type);
  
  if (!nodeType) {
    return (
      <Card 
        title="Unknown Node" 
        description="This node type is not supported"
        selected={selected}
      >
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </Card>
    );
  }
  
  // Display node name if set, otherwise use the default label
  const displayName = data?.name || nodeType.label;
  // Display node description if set, otherwise use the default
  const displayDescription = data?.description || nodeType.description;
  
  // Handle updating node data
  const handleUpdateNode = useCallback((nodeId: string, newData: Record<string, any>) => {
    reactFlowInstance.setNodes(nodes => 
      nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData
            }
          };
        }
        return node;
      })
    );
    
    // If buttons were added or removed, need to update node internals for handles
    if (type === 'quickReplies' && 'buttons' in newData) {
      updateNodeInternals(nodeId);
    }
  }, [reactFlowInstance, updateNodeInternals, type]);
  
  // Handle adding a block after this node
  const handleAddBlock = useCallback(() => {
    const currentNode = reactFlowInstance.getNode(id);
    if (!currentNode) return;
    
    const { node: newNode, edge } = createConnectedNode(
      id, 
      'textMessage', 
      currentNode.position
    );
    
    reactFlowInstance.addNodes(newNode);
    reactFlowInstance.addEdges(edge);
  }, [reactFlowInstance, id]);
  
  // Define node-specific actions
  const getNodeActions = () => {
    const actions = [];
    
    if (['startTrigger', 'textMessage', 'condition', 'waitResponse'].includes(type)) {
      actions.push({
        label: 'Adicionar Mensagem',
        icon: <MessageCircle className="h-4 w-4" />,
        onClick: () => {
          const currentNode = reactFlowInstance.getNode(id);
          if (!currentNode) return;
          
          const { node: newNode, edge } = createConnectedNode(
            id, 
            'textMessage', 
            currentNode.position
          );
          
          reactFlowInstance.addNodes(newNode);
          reactFlowInstance.addEdges(edge);
        }
      });
    }
    
    if (['startTrigger', 'textMessage', 'waitResponse'].includes(type)) {
      actions.push({
        label: 'Adicionar Condição',
        icon: <ArrowRightLeft className="h-4 w-4" />,
        onClick: () => {
          const currentNode = reactFlowInstance.getNode(id);
          if (!currentNode) return;
          
          const { node: newNode, edge } = createConnectedNode(
            id, 
            'condition', 
            currentNode.position
          );
          
          reactFlowInstance.addNodes(newNode);
          reactFlowInstance.addEdges(edge);
        }
      });
    }
    
    if (['startTrigger', 'textMessage', 'quickReplies'].includes(type)) {
      actions.push({
        label: 'Aguardar Resposta',
        icon: <Hourglass className="h-4 w-4" />,
        onClick: () => {
          const currentNode = reactFlowInstance.getNode(id);
          if (!currentNode) return;
          
          const { node: newNode, edge } = createConnectedNode(
            id, 
            'waitResponse', 
            currentNode.position
          );
          
          reactFlowInstance.addNodes(newNode);
          reactFlowInstance.addEdges(edge);
        }
      });
    }
    
    return actions;
  };
  
  // Create the node object for the current node type
  const node: FlowNode = {
    id,
    type: type as any,
    position: { x: 0, y: 0 }, // Not used here, but required by the type
    data: data || {}
  };
  
  return (
    <Card 
      title={displayName}
      description={displayDescription}
      icon={nodeType.icon}
      color={nodeType.iconBg}
      selected={selected}
      actions={selected ? getNodeActions() : []}
      onAddBlock={selected ? handleAddBlock : undefined}
    >
      {/* Add the NodePopover for editing */}
      {selected && (
        <NodePopover 
          node={node} 
          onUpdate={handleUpdateNode}
          onAddBlock={handleAddBlock}
        />
      )}
      
      {/* Input handle */}
      {type !== 'startTrigger' && (
        <Handle 
          type="target" 
          position={Position.Top} 
          className="w-3 h-3 bg-blue-500" 
        />
      )}
      
      {/* Render node type specific content */}
      <div className="p-3 text-sm">
        {type === 'textMessage' && data?.text && (
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs overflow-auto max-h-20">
            {data.text}
          </div>
        )}
        
        {type === 'quickReplies' && (
          <div className="space-y-1">
            {data?.text && (
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs overflow-auto max-h-16">
                {data.text}
              </div>
            )}
            <div className="flex flex-wrap gap-1 mt-1">
              {(data?.buttons || []).map((button: any, index: number) => (
                <span 
                  key={button.id || index} 
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                >
                  {button.title}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {type === 'condition' && data?.condition && (
          <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs font-mono overflow-auto max-h-20">
            {data.condition}
          </div>
        )}
        
        {type === 'waitResponse' && data?.variableName && (
          <div>
            <span className="text-xs text-gray-500">Variable: </span>
            <code className="text-xs bg-gray-50 dark:bg-gray-700 px-1 rounded">{data.variableName}</code>
          </div>
        )}
        
        {type === 'setVariable' && data?.variableName && (
          <div>
            <div className="flex items-center text-xs">
              <span className="text-gray-500">Set </span>
              <code className="mx-1 bg-gray-50 dark:bg-gray-700 px-1 rounded">{data.variableName}</code>
              <span className="text-gray-500"> to </span>
              <code className="ml-1 bg-gray-50 dark:bg-gray-700 px-1 rounded">{data.value || '""'}</code>
            </div>
          </div>
        )}
        
        {type === 'delay' && (
          <div className="text-xs text-gray-500">
            Delay: {data?.delayHours || 0}h {data?.delayMinutes || 0}m
          </div>
        )}
        
        {type === 'httpRequest' && data?.url && (
          <div className="text-xs overflow-hidden">
            <div className="text-xs text-gray-500">
              {data.method || 'GET'} Request
            </div>
            <div className="truncate text-xs text-gray-400">
              {data.url}
            </div>
          </div>
        )}
      </div>
      
      {/* Output handles */}
      {type === 'condition' ? (
        <>
          <Handle 
            type="source" 
            position={Position.Bottom} 
            id="true" 
            className="w-3 h-3 bg-green-500 -ml-4"
          />
          <Handle 
            type="source" 
            position={Position.Bottom} 
            id="false" 
            className="w-3 h-3 bg-red-500 ml-4"
          />
        </>
      ) : type === 'httpRequest' ? (
        <>
          <Handle 
            type="source" 
            position={Position.Bottom} 
            id="success" 
            className="w-3 h-3 bg-green-500 -ml-4"
          />
          <Handle 
            type="source" 
            position={Position.Bottom} 
            id="error" 
            className="w-3 h-3 bg-red-500 ml-4"
          />
        </>
      ) : type === 'quickReplies' ? (
        <div className="flex justify-center">
          {(data?.buttons || []).slice(0, 3).map((button: any, index: number) => (
            <Handle 
              key={button.id || index}
              type="source" 
              position={Position.Bottom} 
              id={`button-${index}`} 
              className="w-3 h-3 bg-green-500"
              style={{ left: `${25 + (index * 25)}%` }}
            />
          ))}
        </div>
      ) : (
        <Handle 
          type="source" 
          position={Position.Bottom} 
          className="w-3 h-3 bg-green-500" 
        />
      )}
    </Card>
  );
};

const MemoizedBaseNode = memo(BaseNode);

export const nodeComponents = {
  startTrigger: MemoizedBaseNode,
  textMessage: MemoizedBaseNode,
  mediaMessage: MemoizedBaseNode,
  quickReplies: MemoizedBaseNode,
  listMessage: MemoizedBaseNode,
  condition: MemoizedBaseNode,
  waitResponse: MemoizedBaseNode,
  delay: MemoizedBaseNode,
  httpRequest: MemoizedBaseNode,
  setVariable: MemoizedBaseNode,
  humanTransfer: MemoizedBaseNode,
  actionButtons: MemoizedBaseNode,
};
