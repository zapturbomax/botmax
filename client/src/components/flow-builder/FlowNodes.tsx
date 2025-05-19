import { memo, useCallback, useState } from 'react';
import { Handle, Position, useReactFlow, useUpdateNodeInternals } from 'reactflow';
import { Card } from '@/components/ui/node-card';
import { nodeTypes } from './FlowNodeTypes';
import { FlowNode, FlowNodeType } from '@shared/schema';
import { NodePopover } from './NodePopover';
import AddNodeMenu from './AddNodeMenu';
import { MessageCircle, ArrowRightLeft, Hourglass, Variable, AlertTriangle, Info, HelpCircle } from 'lucide-react';
import { UnifiedNodeCard } from './UnifiedNodeCard';

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
  
  // State para controlar a edição
  const [isEditing, setIsEditing] = useState(false);
  
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
  
  // Funções para atualizar o título e a descrição diretamente
  const handleTitleChange = useCallback((newTitle: string) => {
    handleUpdateNode(id, { name: newTitle });
  }, [handleUpdateNode, id]);
  
  const handleDescriptionChange = useCallback((newDescription: string) => {
    handleUpdateNode(id, { description: newDescription });
  }, [handleUpdateNode, id]);
  
  // Função para atualizar texto da mensagem diretamente
  const handleTextChange = useCallback((newText: string) => {
    handleUpdateNode(id, { text: newText });
  }, [handleUpdateNode, id]);
  
  // Função para atualizar condição diretamente
  const handleConditionChange = useCallback((newCondition: string) => {
    handleUpdateNode(id, { condition: newCondition });
  }, [handleUpdateNode, id]);
  
  // Função para controlar o início da edição ao clicar no nó
  const handleNodeClick = useCallback(() => {
    setIsEditing(true);
  }, []);
  
  // Função para finalizar a edição ao perder o foco
  const handleBlur = useCallback(() => {
    setIsEditing(false);
  }, []);
  
  // Component state for the add node menu
  const [addNodeMenuOpen, setAddNodeMenuOpen] = useState(false);
  
  // Handle adding a specific type of node
  const handleAddNodeType = useCallback((nodeType: FlowNodeType) => {
    const currentNode = reactFlowInstance.getNode(id);
    if (!currentNode) return;
    
    const { node: newNode, edge } = createConnectedNode(
      id, 
      nodeType, 
      currentNode.position
    );
    
    reactFlowInstance.addNodes(newNode);
    reactFlowInstance.addEdges(edge);
    setAddNodeMenuOpen(false);
  }, [reactFlowInstance, id]);
  
  // Handle adding a block after this node (opens the menu)
  const handleAddBlock = useCallback(() => {
    setAddNodeMenuOpen(true);
  }, []);
  
  // Função para duplicar o nó
  const handleDuplicateNode = useCallback(() => {
    const currentNode = reactFlowInstance.getNode(id);
    if (!currentNode) return;
    
    // Criar um novo nó com as mesmas propriedades
    const duplicatedNode: FlowNode = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      position: { 
        x: currentNode.position.x + 50, 
        y: currentNode.position.y + 50 
      },
      data: { ...data } // Copia todos os dados
    };
    
    reactFlowInstance.addNodes(duplicatedNode);
  }, [reactFlowInstance, id, type, data]);
  
  // Função para excluir o nó
  const handleDeleteNode = useCallback(() => {
    reactFlowInstance.deleteElements({ nodes: [{ id }] });
  }, [reactFlowInstance, id]);

  // Função para editar o nó
  const handleEditNode = useCallback(() => {
    // Comportamento padrão já mostra o popover de edição
  }, []);
  
  // Create the node object for the current node type
  const node: FlowNode = {
    id,
    type: type as any,
    position: { x: 0, y: 0 }, // Not used here, but required by the type
    data: data || {}
  };
  
  return (
    <>
      <Card 
        title={displayName}
        description={displayDescription}
        icon={nodeType.icon}
        color={nodeType.iconBg}
        selected={selected}
        isEditable={isEditing}
        onTitleChange={handleTitleChange}
        onDescriptionChange={handleDescriptionChange}
        onEdit={selected ? handleEditNode : undefined}
        onDelete={selected ? handleDeleteNode : undefined}
        onDuplicate={selected ? handleDuplicateNode : undefined}
        onAddBlock={selected ? handleAddBlock : undefined}
      >
        {/* Add the NodePopover for editing */}
        {selected && (
          <NodePopover 
            node={node} 
            onUpdate={handleUpdateNode}
            onAddBlock={handleAddBlock}
            onDelete={handleDeleteNode}
            onDuplicate={handleDuplicateNode}
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
        <div className="p-3 text-sm" onClick={handleNodeClick}>
          {type === 'textMessage' && (
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs overflow-auto max-h-20">
              {isEditing ? (
                <InlineEdit 
                  value={data?.text || ''} 
                  onChange={handleTextChange} 
                  placeholder="Digite sua mensagem..."
                  multiline={true}
                  className="w-full"
                  textClassName="text-xs"
                  onBlur={handleBlur}
                />
              ) : (
                data?.text || <span className="text-gray-400 italic">Clique para adicionar texto</span>
              )}
            </div>
          )}
          
          {type === 'quickReplies' && (
            <div className="space-y-1">
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs overflow-auto max-h-16">
                {isEditing ? (
                  <InlineEdit 
                    value={data?.text || ''} 
                    onChange={handleTextChange} 
                    placeholder="Digite sua mensagem..."
                    multiline={true}
                    className="w-full"
                    textClassName="text-xs"
                    onBlur={handleBlur}
                  />
                ) : (
                  data?.text || <span className="text-gray-400 italic">Clique para adicionar texto</span>
                )}
              </div>
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
              
              {isEditing && (
                <button 
                  className="mt-2 text-xs bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-1 rounded w-full"
                  onClick={() => {
                    // Adicionar um novo botão
                    const newButtons = [...(data?.buttons || []), {
                      id: `btn-${Date.now()}`,
                      title: 'Novo Botão'
                    }];
                    handleUpdateNode(id, { buttons: newButtons });
                  }}
                >
                  + Adicionar Botão
                </button>
              )}
            </div>
          )}
          
          {type === 'condition' && (
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs font-mono overflow-auto max-h-20">
              {isEditing ? (
                <InlineEdit 
                  value={data?.condition || ''} 
                  onChange={handleConditionChange} 
                  placeholder="Digite sua condição... Ex: {{variável}} === 'valor'"
                  multiline={true}
                  className="w-full"
                  textClassName="text-xs font-mono"
                  onBlur={handleBlur}
                />
              ) : (
                data?.condition || <span className="text-gray-400 italic">Clique para adicionar condição</span>
              )}
            </div>
          )}
          
          {type === 'waitResponse' && data?.variableName && (
            <div>
              <span className="text-xs text-gray-500">Variável: </span>
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
      
      {/* Node add menu - renderizado fora do card para evitar problemas de z-index/clipping */}
      <AddNodeMenu 
        open={addNodeMenuOpen}
        onClose={() => setAddNodeMenuOpen(false)}
        onSelect={handleAddNodeType}
      />
    </>
  );
};

import { ConditionNode } from './node-elements/ConditionNode';
import { QuickRepliesNode } from './node-elements/QuickRepliesNode';

// Versão memorizada do nó base
const MemoizedBaseNode = memo(BaseNode);

// Componentes específicos de nó com memo
const MemoizedConditionNode = memo(ConditionNode);
const MemoizedQuickRepliesNode = memo(QuickRepliesNode);

// Exportando os componentes de nó
export const nodeComponents = {
  startTrigger: MemoizedBaseNode,
  textMessage: MemoizedBaseNode,
  mediaMessage: MemoizedBaseNode,
  quickReplies: (props: any) => {
    // Pegamos a função handleUpdateNode do BaseNode
    const handleUpdate = (id: string, newData: Record<string, any>) => {
      const reactFlowInstance = useReactFlow();
      reactFlowInstance.setNodes(nodes => 
        nodes.map(node => {
          if (node.id === id) {
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
    };
    
    return (
      <MemoizedQuickRepliesNode
        id={props.id}
        data={props.data}
        selected={props.selected}
        onUpdateNodeData={handleUpdate}
      />
    );
  },
  listMessage: MemoizedBaseNode,
  condition: (props: any) => {
    // Pegamos a função handleUpdateNode do BaseNode
    const handleUpdate = (id: string, newData: Record<string, any>) => {
      const reactFlowInstance = useReactFlow();
      reactFlowInstance.setNodes(nodes => 
        nodes.map(node => {
          if (node.id === id) {
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
    };
    
    return (
      <MemoizedConditionNode
        id={props.id}
        data={props.data}
        selected={props.selected}
        onUpdateNodeData={handleUpdate}
      />
    );
  },
  waitResponse: MemoizedBaseNode,
  delay: MemoizedBaseNode,
  httpRequest: MemoizedBaseNode,
  setVariable: MemoizedBaseNode,
  humanTransfer: MemoizedBaseNode,
  actionButtons: MemoizedBaseNode,
};