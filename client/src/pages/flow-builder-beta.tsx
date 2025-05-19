
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import axios from 'axios';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import FlowBuilderLayout from '@/components/flow-builder-beta/FlowBuilderLayout';
import { useToast } from '@/hooks/use-toast';
import { useFlowStore } from '@/hooks/use-flow-store';
import { Node, Edge } from 'reactflow';

// Interface para o modelo de fluxo
interface FlowData {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  nodes: Node[] | null;
  edges: Edge[] | null;
  isBeta: boolean;
  tenantId: number;
}

export default function FlowBuilderBeta() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  
  // Estado para armazenar os dados do fluxo
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [flow, setFlow] = useState<FlowData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Referência ao store de fluxos
  const { updateFlow } = useFlowStore();

  // Carregar os dados do fluxo quando o componente montar
  useEffect(() => {
    if (!id || !user) return;

    const loadFlow = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Garantir que o token está nos headers
        const storedToken = localStorage.getItem('flowbot_token');
        if (storedToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        
        console.log(`Carregando fluxo beta id=${id} para tenantId=${user.tenantId}`);
        
        // Fazer a requisição de forma direta
        const response = await axios.get(`/api/flows-beta/${id}`);
        console.log("Dados recebidos da API:", response.data);
        
        if (!response.data) {
          throw new Error("API retornou resposta vazia");
        }

        // Processar dados recebidos para garantir o formato correto
        const flowData = response.data;
        
        // Criar objeto normalizado
        const normalizedFlow: FlowData = {
          id: String(flowData.id),
          name: flowData.name,
          description: flowData.description || "",
          status: flowData.status || "draft",
          createdAt: flowData.createdAt || flowData.created_at || new Date().toISOString(),
          updatedAt: flowData.updatedAt || flowData.updated_at || new Date().toISOString(),
          nodes: Array.isArray(flowData.nodes) ? flowData.nodes : [],
          edges: Array.isArray(flowData.edges) ? flowData.edges : [],
          isBeta: flowData.isBeta || flowData.is_beta || true,
          tenantId: flowData.tenantId || flowData.tenant_id || user.tenantId
        };
        
        // Atualizar o estado com os dados normalizados
        setFlow(normalizedFlow);
        
        // Atualizar o store local para o uso pelo FlowCanvas
        updateFlow(String(id), {
          nodes: normalizedFlow.nodes || [],
          edges: normalizedFlow.edges || []
        });
        
        console.log("Fluxo carregado com sucesso:", normalizedFlow);
      } catch (err) {
        console.error("Erro ao carregar o fluxo:", err);
        
        // Tratar o erro de forma apropriada
        if (axios.isAxiosError(err)) {
          if (err.response) {
            console.error("Erro da API:", err.response.status, err.response.data);
            setError(new Error(err.response.data?.message || "Erro ao carregar o fluxo"));
          } else if (err.request) {
            console.error("Não houve resposta da API");
            setError(new Error("Não foi possível conectar ao servidor"));
          } else {
            setError(new Error(err.message));
          }
        } else if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("Ocorreu um erro desconhecido"));
        }
        
        // Mostrar toast de erro
        toast({
          title: "Erro ao carregar fluxo",
          description: err instanceof Error ? err.message : "Erro desconhecido",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Executar o carregamento
    loadFlow();
  }, [id, user, updateFlow, toast]);

  // Redirecionar se houver erro após o carregamento
  useEffect(() => {
    if (!isLoading && error) {
      const timer = setTimeout(() => {
        console.log("Redirecionando para a lista de fluxos após erro");
        setLocation('/flows-beta');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, error, setLocation]);

  // Renderizar o estado de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-primary rounded-full"></div>
        <p className="ml-2">Carregando fluxo...</p>
      </div>
    );
  }

  // Renderizar o estado de erro
  if (error || !flow) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Fluxo não encontrado</h2>
        <p className="mb-4">O fluxo que você está tentando acessar não existe ou você não tem permissão.</p>
        <p className="text-sm text-red-500 mb-4">{error?.message}</p>
        <Button onClick={() => setLocation('/flows-beta')}>
          Voltar para a lista de fluxos
        </Button>
      </div>
    );
  }

  // Renderizar o editor com os dados carregados
  return (
    <FlowBuilderLayout 
      flowId={id || ''} 
      flowName={flow.name} 
      flow={flow}
    />
  );
}
