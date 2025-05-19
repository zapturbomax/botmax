
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import FlowBuilderLayout from '@/components/flow-builder-beta/FlowBuilderLayout';
import { useToast } from '@/hooks/use-toast';
import { useFlowStore } from '@/hooks/use-flow-store';

export default function FlowBuilderBeta() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  
  // Inicializar o estado do fluxo no store local
  const { updateFlow } = useFlowStore();
  const [flowInitialized, setFlowInitialized] = useState(false);

  // Check flow exists and user has access (using Beta-specific endpoint)
  const { data: flow, isLoading, error, refetch } = useQuery({
    queryKey: ['flows-beta', id],
    queryFn: async () => {
      try {
        // Garantir que o token está nos headers
        const token = localStorage.getItem('flowbot_token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        if (!id) throw new Error("ID do fluxo não fornecido");
        
        console.log(`Carregando fluxo beta id=${id} para tenantId=${user?.tenantId}`);
        const response = await axios.get(`/api/flows-beta/${id}`);
        console.log("Dados do fluxo beta carregados:", response.data);
        
        // Normalizar nomes de campos para garantir consistência
        const flowData = response.data;
        
        // Converte string para número se necessário
        const numericId = typeof flowData.id === 'string' ? parseInt(flowData.id, 10) : flowData.id;
        
        return {
          id: numericId.toString(), // Garante que ID é string para compatibilidade com o componente
          name: flowData.name,
          description: flowData.description,
          status: flowData.status,
          createdAt: flowData.createdAt || flowData.created_at,
          updatedAt: flowData.updatedAt || flowData.updated_at,
          nodes: flowData.nodes || [],
          edges: flowData.edges || [],
          isBeta: true,
          tenantId: flowData.tenantId || flowData.tenant_id
        };
      } catch (err) {
        console.error("Erro ao carregar fluxo beta:", err);
        if (axios.isAxiosError(err) && err.response) {
          console.error("Detalhes do erro:", err.response.data);
          toast({
            title: "Erro ao carregar fluxo",
            description: err.response.data.message || "Não foi possível carregar o fluxo",
            variant: "destructive",
          });
        }
        throw err;
      }
    },
    enabled: !!id && !!user && !!user.tenantId,
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000 // Manter os dados frescos por 30 segundos
  });

  // Inicializa o fluxo no store local para uso pelos componentes
  useEffect(() => {
    if (flow && !flowInitialized) {
      console.log("Inicializando fluxo no store local:", flow);
      updateFlow(flow.id, {
        nodes: flow.nodes || [],
        edges: flow.edges || []
      });
      setFlowInitialized(true);
    }
  }, [flow, updateFlow, flowInitialized]);

  // Tentar novamente caso falhe na primeira vez
  useEffect(() => {
    if (error && user && id) {
      console.log("Tentando carregar o fluxo novamente após erro");
      const timer = setTimeout(() => {
        console.log("Refazendo requisição do fluxo...");
        // Limpa o cache antes de tentar novamente
        queryClient.invalidateQueries({ queryKey: ['flows-beta', id] });
        refetch();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [error, user, id, refetch, queryClient]);

  // Redirect if flow not found after retries
  useEffect(() => {
    if (!isLoading && error) {
      console.error("Fluxo não encontrado ou erro persistente:", error);
      toast({
        title: "Fluxo não encontrado",
        description: "Voltando para a lista de fluxos",
        variant: "destructive",
      });
      
      // Aguarda um momento antes de redirecionar
      setTimeout(() => {
        setLocation('/flows-beta');
      }, 2000);
    }
  }, [isLoading, error, setLocation, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-primary rounded-full"></div>
        <p className="ml-2">Carregando fluxo...</p>
      </div>
    );
  }

  if (!flow && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Fluxo não encontrado</h2>
        <p className="mb-4">O fluxo que você está tentando acessar não existe ou você não tem permissão.</p>
        <Button onClick={() => setLocation('/flows-beta')}>
          Voltar para a lista de fluxos
        </Button>
      </div>
    );
  }

  return (
    <FlowBuilderLayout 
      flowId={id || ''} 
      flowName={flow?.name || 'Fluxo sem nome'} 
      flow={flow}
    />
  );
}
