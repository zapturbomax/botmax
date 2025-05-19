import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { 
  useReactFlow, 
  ReactFlowInstance, 
  Node, 
  Edge, 
  applyNodeChanges,
  applyEdgeChanges,
  addEdge
} from 'reactflow';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface FlowControllerContextType {
  // Dados do fluxo
  flowId: string | null;
  nodes: Node[];
  edges: Edge[];
  
  // Funções para manipular o fluxo
  setNodes: (nodes: Node[] | ((prevNodes: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((prevEdges: Edge[]) => Edge[])) => void;
  onNodeChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (params: any) => void;
  
  // Funções para manipular nós
  onDrop: (event: React.DragEvent<HTMLDivElement>, reactFlowInstance: ReactFlowInstance) => void;
  addStarterNode: () => void;
  
  // Status da operação
  isSaving: boolean;
  isLoading: boolean;
  error: any;
}

const FlowControllerContext = createContext<FlowControllerContextType | undefined>(undefined);

interface FlowControllerProviderProps {
  children: ReactNode;
  flowId: string;
}

export const FlowControllerProvider: React.FC<FlowControllerProviderProps> = ({ children, flowId }) => {
  const reactFlowInstance = useReactFlow();
  const { toast } = useToast();
  
  // Estado local para nós e edges
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  
  // Consulta para carregar dados do fluxo
  const { 
    data: flowData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['/api/flows', flowId],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/flows/${flowId}`);
      return res.json();
    },
    enabled: !!flowId,
  });
  
  // Mutação para atualizar nós
  const updateNodesMutation = useMutation({
    mutationFn: async (nodes: Node[]) => {
      const res = await apiRequest('PUT', `/api/flows/${flowId}/nodes`, nodes);
      return res.json();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar nós",
        description: error.message || "Ocorreu um erro ao salvar os nós do fluxo.",
        variant: "destructive",
      });
    },
  });
  
  // Mutação para atualizar edges
  const updateEdgesMutation = useMutation({
    mutationFn: async (edges: Edge[]) => {
      const res = await apiRequest('PUT', `/api/flows/${flowId}/edges`, edges);
      return res.json();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar conexões",
        description: error.message || "Ocorreu um erro ao salvar as conexões do fluxo.",
        variant: "destructive",
      });
    },
  });
  
  // Efeito para carregar dados iniciais
  useEffect(() => {
    if (flowData) {
      if (flowData.nodes) {
        setNodes(flowData.nodes);
      }
      if (flowData.edges) {
        setEdges(flowData.edges);
      }
    }
  }, [flowData]);
  
  // Manipuladores de mudanças de nós e edges
  const onNodeChange = useCallback((changes: any) => {
    setNodes((nds) => {
      const newNodes = applyNodeChanges(changes, nds);
      // Auto-salvar nós após mudanças
      updateNodesMutation.mutate(newNodes);
      return newNodes;
    });
  }, [updateNodesMutation]);
  
  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => {
      const newEdges = applyEdgeChanges(changes, eds);
      // Auto-salvar edges após mudanças
      updateEdgesMutation.mutate(newEdges);
      return newEdges;
    });
  }, [updateEdgesMutation]);
  
  // Função para conectar nós
  const onConnect = useCallback((params: any) => {
    setEdges((eds) => {
      const newEdges = addEdge(params, eds);
      updateEdgesMutation.mutate(newEdges);
      return newEdges;
    });
  }, [updateEdgesMutation]);
  
  // Função para lidar com arrastar e soltar
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>, reactFlowInstance: ReactFlowInstance) => {
      event.preventDefault();
      
      // Obter posição para o novo nó
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      
      // Verificar se temos um tipo válido
      if (!type) return;
      
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      // Criar novo nó
      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {},
      };
      
      // Adicionar nó ao state
      setNodes((nds) => {
        const newNodes = [...nds, newNode];
        updateNodesMutation.mutate(newNodes);
        return newNodes;
      });
    },
    [updateNodesMutation]
  );
  
  // Adicionar nó inicial
  const addStarterNode = useCallback(() => {
    const newNode = {
      id: `startTrigger-${Date.now()}`,
      type: 'startTrigger',
      position: { x: 250, y: 250 },
      data: {},
    };
    
    setNodes((nds) => {
      const newNodes = [...nds, newNode];
      updateNodesMutation.mutate(newNodes);
      return newNodes;
    });
  }, [updateNodesMutation]);
  
  const isSaving = updateNodesMutation.isPending || updateEdgesMutation.isPending;
  
  const value = {
    flowId,
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodeChange,
    onEdgesChange,
    onConnect,
    onDrop,
    addStarterNode,
    isSaving,
    isLoading,
    error
  };
  
  return (
    <FlowControllerContext.Provider value={value}>
      {children}
    </FlowControllerContext.Provider>
  );
};

// Hook para usar o contexto
export const useFlowController = () => {
  const context = useContext(FlowControllerContext);
  
  if (context === undefined) {
    throw new Error('useFlowController deve ser usado dentro de um FlowControllerProvider');
  }
  
  return context;
};

export default FlowControllerProvider;