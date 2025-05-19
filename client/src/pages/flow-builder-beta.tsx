
import React, { useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import FlowBuilderLayout from '@/components/flow-builder-beta/FlowBuilderLayout';
import { useToast } from '@/hooks/use-toast';

export default function FlowBuilderBeta() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const params = useParams<{ id: string }>();
  const id = params?.id;

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
        return {
          id: flowData.id,
          name: flowData.name,
          description: flowData.description,
          status: flowData.status,
          createdAt: flowData.createdAt || flowData.created_at,
          updatedAt: flowData.updatedAt || flowData.updated_at,
          nodes: flowData.nodes || [],
          edges: flowData.edges || [],
          isBeta: flowData.isBeta || flowData.is_beta || true
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
    retry: 2, // Aumentar para 2 tentativas
  });

  // Tentar novamente caso falhe na primeira vez
  useEffect(() => {
    if (error && user && id) {
      console.log("Tentando carregar o fluxo novamente após erro");
      const timer = setTimeout(() => {
        refetch();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [error, user, id, refetch]);

  // Redirect if flow not found after retries
  useEffect(() => {
    if (!isLoading && error) {
      console.error("Fluxo não encontrado ou erro persistente:", error);
      setLocation('/flows-beta');
    }
  }, [isLoading, error, setLocation]);

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
      flowId={id} 
      flowName={flow?.name || 'Fluxo sem nome'} 
    />
  );
}
